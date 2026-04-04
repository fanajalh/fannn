import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const sql = getDb();

    const suggestions = await sql`SELECT * FROM suggestions WHERE type = 'game' ORDER BY created_at DESC`;

    // Fetch replies for all suggestions in one query
    const suggestionIds = suggestions.map((s: any) => s.id);

    let allReplies: any[] = [];
    if (suggestionIds.length > 0) {
      allReplies = await sql`
        SELECT * FROM suggestion_replies
        WHERE suggestion_id = ANY(${suggestionIds})
        ORDER BY created_at ASC
      `;
    }

    const formattedData = suggestions.map((item: any) => ({
      id: item.id.toString(),
      author: item.author || item.nama || "Anonim",
      category: item.category,
      content: item.saran,
      created_at: item.created_at,
      upvotes: item.upvotes || 0,
      replies: allReplies
        .filter((r: any) => r.suggestion_id === item.id)
        .map((r: any) => ({
          id: r.id.toString(),
          author: r.author,
          content: r.content,
          created_at: r.created_at,
        })),
    }));

    return NextResponse.json({ data: formattedData });
  } catch (error) {
    console.error("Game suggestions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
