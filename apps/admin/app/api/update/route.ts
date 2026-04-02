import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Numeric columns that need number values
const NUMERIC_COLUMNS = [
  "subscriber_count", "total_views", "total_watch_time_hours", "video_count",
  "view_count", "like_count", "dislike_count", "comment_count", "share_count",
  "watch_time_hours", "impressions", "impression_ctr", "estimated_revenue",
  "rpm", "cpm", "sort_order",
  "views", "views_change_percent", "watch_time_change_percent",
  "subscribers_gained", "subscribers_lost", "subscribers_net",
  "subscribers_change_percent", "revenue_change_percent",
  "impressions_count", "current_viewers", "views_last_48h", "views_last_60min",
  "ad_revenue", "membership_revenue", "superchat_revenue", "merchandise_revenue",
  "premium_revenue", "playback_based_cpm", "ad_impressions", "monetized_playbacks",
  "value",
];

export async function POST(req: NextRequest) {
  const { table, column, value, rowId } = await req.json();

  if (!table || !column || !rowId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Convert to number if the column expects it
  let finalValue = value;
  if (NUMERIC_COLUMNS.includes(column)) {
    // Remove dots used as thousands separator, replace comma with dot for decimals
    const cleaned = String(value).replace(/\./g, "").replace(",", ".");
    const num = Number(cleaned);
    if (!isNaN(num)) {
      finalValue = num;
    } else {
      return NextResponse.json({ error: `"${column}" requiere un valor numérico válido` }, { status: 400 });
    }
  }

  const { error } = await supabase
    .from(table)
    .update({ [column]: finalValue })
    .eq("id", rowId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
