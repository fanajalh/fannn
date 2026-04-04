import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const sql = getDb();
    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get("channelId");

    if (!channelId) {
      return NextResponse.json({ error: "channelId required" }, { status: 400 });
    }

    const messages = await sql`
      SELECT m.id, m.content, m.channel_id, m.user_id as sender_id, m.created_at,
             u.name as username
      FROM messages m
      LEFT JOIN users u ON m.user_id = u.id
      WHERE m.channel_id = ${channelId}
      ORDER BY m.created_at ASC
    `;

    const formatted = messages.map((msg: any) => ({
      id: msg.id,
      content: msg.content,
      channel_id: msg.channel_id,
      sender_id: msg.sender_id?.toString() || "Unknown",
      created_at: msg.created_at,
      profiles: { username: msg.username || "Anonim" },
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const sql = getDb();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, channel_id } = await req.json();
    if (!content || !channel_id) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    const userId = parseInt((session.user as any).id);

    const result = await sql`
      INSERT INTO messages (content, channel_id, user_id)
      VALUES (${content}, ${channel_id}, ${userId})
      RETURNING *
    `;

    return NextResponse.json({
      id: result[0].id,
      content: result[0].content,
      channel_id: result[0].channel_id,
      sender_id: result[0].user_id.toString(),
      created_at: result[0].created_at,
      profiles: { username: "Anda" },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
