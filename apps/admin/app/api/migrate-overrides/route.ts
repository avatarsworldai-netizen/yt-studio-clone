import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  // Try to create the table using raw SQL via Supabase Management API
  // Since exec_sql doesn't exist, we'll use a workaround:
  // Create a PostgreSQL function first, then call it

  const createFnSQL = `
    CREATE OR REPLACE FUNCTION create_field_overrides()
    RETURNS void AS $$
    BEGIN
      CREATE TABLE IF NOT EXISTS field_overrides (
        id TEXT PRIMARY KEY,
        table_name TEXT NOT NULL,
        column_name TEXT NOT NULL,
        row_id TEXT NOT NULL,
        value TEXT NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE UNIQUE INDEX IF NOT EXISTS idx_field_overrides_lookup
        ON field_overrides(table_name, column_name, row_id);
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
    $$ LANGUAGE plpgsql;
  `;

  // Use the Supabase SQL endpoint
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/create_field_overrides`, {
    method: "POST",
    headers: {
      "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY!,
      "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      "Content-Type": "application/json",
    },
    body: "{}",
  });

  if (!res.ok) {
    return NextResponse.json({
      status: "Table needs to be created manually in Supabase SQL Editor",
      sql: `
CREATE TABLE field_overrides (
  id TEXT PRIMARY KEY,
  table_name TEXT NOT NULL,
  column_name TEXT NOT NULL,
  row_id TEXT NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_field_overrides_lookup
  ON field_overrides(table_name, column_name, row_id);

ALTER TABLE field_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON field_overrides FOR SELECT USING (true);
CREATE POLICY "Allow service write" ON field_overrides FOR ALL USING (true);
      `.trim()
    });
  }

  return NextResponse.json({ status: "ok" });
}
