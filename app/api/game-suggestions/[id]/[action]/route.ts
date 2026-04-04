import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: Request, { params }: { params: { id: string; action: string } }) {
  try {
    const sql = getDb();
    const { action, id } = params;

    if (action === "reply") {
      const { author, content } = await req.json();
      const result = await sql`
        INSERT INTO suggestion_replies (suggestion_id, author, content)
        VALUES (${parseInt(id)}, ${author}, ${content})
        RETURNING *
      `;
      return NextResponse.json({ success: true, data: result[0] });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string; action: string } }) {
  try {
    const sql = getDb();
    const { action, id } = params;

    if (action === "upvote") {
      const result = await sql`
        UPDATE suggestions SET upvotes = upvotes + 1
        WHERE id = ${parseInt(id)}
        RETURNING upvotes
      `;
      return NextResponse.json({ success: true, upvotes: result[0]?.upvotes });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
