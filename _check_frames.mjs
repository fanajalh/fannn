import { neon } from "@neondatabase/serverless";

const sql = neon("postgresql://neondb_owner:npg_v48JLeyirwNf@ep-quiet-resonance-anlw9a41-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require");
const rows = await sql`SELECT id, slug, name, is_active FROM photobooth_frames`;
console.log("Total rows:", rows.length);
console.log(JSON.stringify(rows, null, 2));
