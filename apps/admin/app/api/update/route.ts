import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { table, column, value, rowId } = await req.json();

  if (!table || !column || !rowId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // First try saving as-is (works for TEXT columns)
  let { error } = await supabase
    .from(table)
    .update({ [column]: value })
    .eq("id", rowId);

  // If it fails (probably numeric column), try converting to number
  if (error) {
    const cleaned = String(value).replace(/\./g, "").replace(",", ".");
    const num = Number(cleaned);
    if (!isNaN(num)) {
      const retry = await supabase
        .from(table)
        .update({ [column]: num })
        .eq("id", rowId);
      error = retry.error;
    }
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
