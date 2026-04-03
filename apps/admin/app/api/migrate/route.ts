import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ALTERATIONS = [
  "ALTER TABLE channel ALTER COLUMN subscriber_count TYPE TEXT USING subscriber_count::TEXT",
  "ALTER TABLE channel ALTER COLUMN total_views TYPE TEXT USING total_views::TEXT",
  "ALTER TABLE channel ALTER COLUMN total_watch_time_hours TYPE TEXT USING total_watch_time_hours::TEXT",
  "ALTER TABLE channel ALTER COLUMN video_count TYPE TEXT USING video_count::TEXT",
  "ALTER TABLE dashboard_stats ALTER COLUMN views TYPE TEXT USING views::TEXT",
  "ALTER TABLE dashboard_stats ALTER COLUMN watch_time_hours TYPE TEXT USING watch_time_hours::TEXT",
  "ALTER TABLE dashboard_stats ALTER COLUMN subscribers_gained TYPE TEXT USING subscribers_gained::TEXT",
  "ALTER TABLE dashboard_stats ALTER COLUMN subscribers_lost TYPE TEXT USING subscribers_lost::TEXT",
  "ALTER TABLE dashboard_stats ALTER COLUMN subscribers_net TYPE TEXT USING subscribers_net::TEXT",
  "ALTER TABLE dashboard_stats ALTER COLUMN estimated_revenue TYPE TEXT USING estimated_revenue::TEXT",
  "ALTER TABLE dashboard_stats ALTER COLUMN views_change_percent TYPE TEXT USING views_change_percent::TEXT",
  "ALTER TABLE dashboard_stats ALTER COLUMN watch_time_change_percent TYPE TEXT USING watch_time_change_percent::TEXT",
  "ALTER TABLE dashboard_stats ALTER COLUMN subscribers_change_percent TYPE TEXT USING subscribers_change_percent::TEXT",
  "ALTER TABLE dashboard_stats ALTER COLUMN revenue_change_percent TYPE TEXT USING revenue_change_percent::TEXT",
  "ALTER TABLE dashboard_stats ALTER COLUMN impressions TYPE TEXT USING impressions::TEXT",
  "ALTER TABLE dashboard_stats ALTER COLUMN impression_ctr TYPE TEXT USING impression_ctr::TEXT",
  "ALTER TABLE videos ALTER COLUMN view_count TYPE TEXT USING view_count::TEXT",
  "ALTER TABLE videos ALTER COLUMN like_count TYPE TEXT USING like_count::TEXT",
  "ALTER TABLE videos ALTER COLUMN dislike_count TYPE TEXT USING dislike_count::TEXT",
  "ALTER TABLE videos ALTER COLUMN comment_count TYPE TEXT USING comment_count::TEXT",
  "ALTER TABLE videos ALTER COLUMN share_count TYPE TEXT USING share_count::TEXT",
  "ALTER TABLE videos ALTER COLUMN watch_time_hours TYPE TEXT USING watch_time_hours::TEXT",
  "ALTER TABLE videos ALTER COLUMN impressions TYPE TEXT USING impressions::TEXT",
  "ALTER TABLE videos ALTER COLUMN impression_ctr TYPE TEXT USING impression_ctr::TEXT",
  "ALTER TABLE videos ALTER COLUMN estimated_revenue TYPE TEXT USING estimated_revenue::TEXT",
  "ALTER TABLE videos ALTER COLUMN rpm TYPE TEXT USING rpm::TEXT",
  "ALTER TABLE videos ALTER COLUMN cpm TYPE TEXT USING cpm::TEXT",
  "ALTER TABLE revenue ALTER COLUMN estimated_revenue TYPE TEXT USING estimated_revenue::TEXT",
  "ALTER TABLE revenue ALTER COLUMN ad_revenue TYPE TEXT USING ad_revenue::TEXT",
  "ALTER TABLE revenue ALTER COLUMN membership_revenue TYPE TEXT USING membership_revenue::TEXT",
  "ALTER TABLE revenue ALTER COLUMN superchat_revenue TYPE TEXT USING superchat_revenue::TEXT",
  "ALTER TABLE revenue ALTER COLUMN merchandise_revenue TYPE TEXT USING merchandise_revenue::TEXT",
  "ALTER TABLE revenue ALTER COLUMN premium_revenue TYPE TEXT USING premium_revenue::TEXT",
  "ALTER TABLE revenue ALTER COLUMN rpm TYPE TEXT USING rpm::TEXT",
  "ALTER TABLE revenue ALTER COLUMN cpm TYPE TEXT USING cpm::TEXT",
  "ALTER TABLE comments ALTER COLUMN like_count TYPE TEXT USING like_count::TEXT",
  "ALTER TABLE comments ALTER COLUMN dislike_count TYPE TEXT USING dislike_count::TEXT",
];

export async function GET() {
  const results: string[] = [];

  for (const sql of ALTERATIONS) {
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
    if (error) {
      // Try alternative: just skip if already TEXT
      results.push(`SKIP: ${sql.split(' ')[4]} - ${error.message}`);
    } else {
      results.push(`OK: ${sql.split(' ')[4]}`);
    }
  }

  return NextResponse.json({ results });
}
