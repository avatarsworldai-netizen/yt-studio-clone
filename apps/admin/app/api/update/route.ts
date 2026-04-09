import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { table, column, value, rowId, channelId } = await req.json();

  if (!table || !column || !rowId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // When channelId is present, always save as channel-specific override
  // This ensures each channel has independent data
  if (channelId) {
    const overrideId = `${channelId}_${table}_${column}_${rowId}`;
    const { error: overrideError } = await supabase
      .from("field_overrides")
      .upsert({
        id: overrideId,
        table_name: table,
        column_name: column,
        row_id: rowId,
        value: String(value),
        updated_at: new Date().toISOString(),
      });

    if (overrideError) {
      return NextResponse.json({ error: overrideError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, source: "override" });
  }

  // No channelId — legacy behavior: try original table first
  let { error } = await supabase
    .from(table)
    .update({ [column]: value })
    .eq("id", rowId);

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
    const overrideId = `${table}_${column}_${rowId}`;
    const { error: overrideError } = await supabase
      .from("field_overrides")
      .upsert({
        id: overrideId,
        table_name: table,
        column_name: column,
        row_id: rowId,
        value: String(value),
        updated_at: new Date().toISOString(),
      });

    if (overrideError) {
      return NextResponse.json({ error: overrideError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, source: "override" });
  }

  return NextResponse.json({ ok: true, source: "table" });
}
