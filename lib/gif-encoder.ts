/**
 * GIF89a encoder with adaptive palette + Floyd-Steinberg dithering.
 * Produces high quality animated GIFs in the browser.
 */

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image`))
    img.src = src
  })
}

/**
 * Encode frames with per-frame delays using adaptive palette + dithering.
 */
export async function encodeGifWithDelays(
  frames: { data: ImageData; delay: number }[],
  width: number,
  height: number,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  // Scale to reasonable size
  const maxDim = 600
  let sw = width, sh = height
  if (width > maxDim || height > maxDim) {
    const r = Math.min(maxDim / width, maxDim / height)
    sw = Math.round(width * r)
    sh = Math.round(height * r)
  }

  // Scale all frames
  const tc = document.createElement("canvas")
  tc.width = sw; tc.height = sh
  const tctx = tc.getContext("2d", { willReadFrequently: true })!
  const scaled: { data: ImageData; delay: number }[] = []

  for (const f of frames) {
    const sc = document.createElement("canvas")
    sc.width = f.data.width; sc.height = f.data.height
    sc.getContext("2d")!.putImageData(f.data, 0, 0)
    tctx.clearRect(0, 0, sw, sh)
    tctx.drawImage(sc, 0, 0, sw, sh)
    scaled.push({ data: tctx.getImageData(0, 0, sw, sh), delay: f.delay })
  }

  // Build adaptive palette from all frames combined (median cut)
  const palette = buildAdaptivePalette(scaled.map(s => s.data), 256)

  const buf: number[] = []
  writeStr(buf, "GIF89a")
  writeU16(buf, sw)
  writeU16(buf, sh)
  buf.push(0xf7, 0, 0) // GCT flag, 256 colors

  // Write palette
  for (let i = 0; i < 256; i++) {
    buf.push(palette[i * 3], palette[i * 3 + 1], palette[i * 3 + 2])
  }

  // Netscape loop extension
  buf.push(0x21, 0xff, 0x0b)
  writeStr(buf, "NETSCAPE2.0")
  buf.push(0x03, 0x01)
  writeU16(buf, 0) // infinite loop
  buf.push(0x00)

  // Encode each frame
  for (let i = 0; i < scaled.length; i++) {
    onProgress?.(i / scaled.length)
    const delayCS = Math.max(2, Math.round(scaled[i].delay / 10))

    // Graphic Control Extension
    buf.push(0x21, 0xf9, 0x04, 0x00)
    writeU16(buf, delayCS)
    buf.push(0x00, 0x00)

    // Image Descriptor
    buf.push(0x2c)
    writeU16(buf, 0); writeU16(buf, 0)
    writeU16(buf, sw); writeU16(buf, sh)
    buf.push(0x00) // no local color table

    // Quantize with Floyd-Steinberg dithering
    const pixels = ditherFrame(scaled[i].data, palette)
    buf.push(8) // min LZW code size
    const lzw = lzwEncode(pixels, 8)
    let off = 0
    while (off < lzw.length) {
      const sz = Math.min(255, lzw.length - off)
      buf.push(sz)
      for (let j = 0; j < sz; j++) buf.push(lzw[off + j])
      off += sz
    }
    buf.push(0x00)
  }

  onProgress?.(1)
  buf.push(0x3b) // trailer
  return new Blob([new Uint8Array(buf)], { type: "image/gif" })
}

// ====== Adaptive Palette (Median Cut) ======

function buildAdaptivePalette(frames: ImageData[], maxColors: number): Uint8Array {
  // Sample pixels from all frames
  const sampleSize = 20000
  const allPixels: [number, number, number][] = []
  
  for (const frame of frames) {
    const d = frame.data
    const totalPixels = frame.width * frame.height
    const step = Math.max(1, Math.floor(totalPixels / (sampleSize / frames.length)))
    for (let i = 0; i < totalPixels; i += step) {
      allPixels.push([d[i * 4], d[i * 4 + 1], d[i * 4 + 2]])
    }
  }

  // Median cut
  const boxes: [number, number, number][][] = [allPixels]
  
  while (boxes.length < maxColors) {
    // Find box with largest range
    let maxRange = -1, maxIdx = 0
    for (let i = 0; i < boxes.length; i++) {
      const range = boxRange(boxes[i])
      if (range > maxRange) { maxRange = range; maxIdx = i }
    }
    
    if (boxes[maxIdx].length < 2) break
    
    // Split along axis with largest range
    const box = boxes[maxIdx]
    const axis = longestAxis(box)
    box.sort((a, b) => a[axis] - b[axis])
    const mid = Math.floor(box.length / 2)
    boxes.splice(maxIdx, 1, box.slice(0, mid), box.slice(mid))
  }

  // Average each box to get palette color
  const pal = new Uint8Array(256 * 3)
  for (let i = 0; i < Math.min(boxes.length, 256); i++) {
    const box = boxes[i]
    let rSum = 0, gSum = 0, bSum = 0
    for (const p of box) { rSum += p[0]; gSum += p[1]; bSum += p[2] }
    pal[i * 3] = Math.round(rSum / box.length)
    pal[i * 3 + 1] = Math.round(gSum / box.length)
    pal[i * 3 + 2] = Math.round(bSum / box.length)
  }

  return pal
}

function boxRange(box: [number, number, number][]): number {
  let minR = 255, maxR = 0, minG = 255, maxG = 0, minB = 255, maxB = 0
  for (const p of box) {
    if (p[0] < minR) minR = p[0]; if (p[0] > maxR) maxR = p[0]
    if (p[1] < minG) minG = p[1]; if (p[1] > maxG) maxG = p[1]
    if (p[2] < minB) minB = p[2]; if (p[2] > maxB) maxB = p[2]
  }
  return Math.max(maxR - minR, maxG - minG, maxB - minB)
}

function longestAxis(box: [number, number, number][]): number {
  let minR = 255, maxR = 0, minG = 255, maxG = 0, minB = 255, maxB = 0
  for (const p of box) {
    if (p[0] < minR) minR = p[0]; if (p[0] > maxR) maxR = p[0]
    if (p[1] < minG) minG = p[1]; if (p[1] > maxG) maxG = p[1]
    if (p[2] < minB) minB = p[2]; if (p[2] > maxB) maxB = p[2]
  }
  const rr = maxR - minR, gg = maxG - minG, bb = maxB - minB
  if (rr >= gg && rr >= bb) return 0
  if (gg >= rr && gg >= bb) return 1
  return 2
}

// ====== Floyd-Steinberg Dithering ======

function ditherFrame(frame: ImageData, palette: Uint8Array): Uint8Array {
  const w = frame.width, h = frame.height
  const pixels = new Uint8Array(w * h)
  
  // Create working copy of pixel data as float for error diffusion
  const r = new Float32Array(w * h)
  const g = new Float32Array(w * h)
  const b = new Float32Array(w * h)
  const d = frame.data
  
  for (let i = 0; i < w * h; i++) {
    r[i] = d[i * 4]
    g[i] = d[i * 4 + 1]
    b[i] = d[i * 4 + 2]
  }

  // Build fast lookup cache
  const cache = new Map<number, number>()

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x
      const cr = clamp(Math.round(r[idx]))
      const cg = clamp(Math.round(g[idx]))
      const cb = clamp(Math.round(b[idx]))

      // Find nearest palette color (with cache)
      const key = (cr << 16) | (cg << 8) | cb
      let bestIdx: number
      if (cache.has(key)) {
        bestIdx = cache.get(key)!
      } else {
        bestIdx = findNearest(cr, cg, cb, palette)
        cache.set(key, bestIdx)
      }
      pixels[idx] = bestIdx

      // Calculate error
      const er = cr - palette[bestIdx * 3]
      const eg = cg - palette[bestIdx * 3 + 1]
      const eb = cb - palette[bestIdx * 3 + 2]

      // Floyd-Steinberg error diffusion
      if (x + 1 < w) {
        r[idx + 1] += er * 7 / 16
        g[idx + 1] += eg * 7 / 16
        b[idx + 1] += eb * 7 / 16
      }
      if (y + 1 < h) {
        if (x > 0) {
          r[idx + w - 1] += er * 3 / 16
          g[idx + w - 1] += eg * 3 / 16
          b[idx + w - 1] += eb * 3 / 16
        }
        r[idx + w] += er * 5 / 16
        g[idx + w] += eg * 5 / 16
        b[idx + w] += eb * 5 / 16
        if (x + 1 < w) {
          r[idx + w + 1] += er * 1 / 16
          g[idx + w + 1] += eg * 1 / 16
          b[idx + w + 1] += eb * 1 / 16
        }
      }
    }
  }
  return pixels
}

function findNearest(r: number, g: number, b: number, palette: Uint8Array): number {
  let best = 0, bestDist = Infinity
  for (let i = 0; i < 256; i++) {
    const dr = r - palette[i * 3]
    const dg = g - palette[i * 3 + 1]
    const db = b - palette[i * 3 + 2]
    const dist = dr * dr + dg * dg + db * db
    if (dist < bestDist) { bestDist = dist; best = i }
    if (dist === 0) break
  }
  return best
}

function clamp(v: number): number { return v < 0 ? 0 : v > 255 ? 255 : v }

// ====== GIF Binary Helpers ======

function writeStr(buf: number[], s: string) {
  for (let i = 0; i < s.length; i++) buf.push(s.charCodeAt(i))
}

function writeU16(buf: number[], v: number) {
  buf.push(v & 0xff, (v >> 8) & 0xff)
}

// ====== LZW Encoding ======

function lzwEncode(pixels: Uint8Array, minCodeSize: number): number[] {
  const clearCode = 1 << minCodeSize
  const eoiCode = clearCode + 1
  let codeSize = minCodeSize + 1
  let nextCode = eoiCode + 1

  const output: number[] = []
  let curByte = 0, curBits = 0

  function emit(code: number) {
    curByte |= (code << curBits)
    curBits += codeSize
    while (curBits >= 8) {
      output.push(curByte & 0xff)
      curByte >>= 8
      curBits -= 8
    }
  }

  let table = new Map<string, number>()
  function resetTable() {
    table = new Map<string, number>()
    for (let i = 0; i < clearCode; i++) table.set(String(i), i)
    nextCode = eoiCode + 1
    codeSize = minCodeSize + 1
  }

  resetTable()
  emit(clearCode)

  let prefix = String(pixels[0])
  for (let i = 1; i < pixels.length; i++) {
    const c = String(pixels[i])
    const key = prefix + "," + c
    if (table.has(key)) {
      prefix = key
    } else {
      emit(table.get(prefix)!)
      if (nextCode < 4096) {
        table.set(key, nextCode++)
        if (nextCode > (1 << codeSize) && codeSize < 12) codeSize++
      } else {
        emit(clearCode)
        resetTable()
      }
      prefix = c
    }
  }

  emit(table.get(prefix)!)
  emit(eoiCode)
  if (curBits > 0) output.push(curByte & 0xff)
  return output
}
