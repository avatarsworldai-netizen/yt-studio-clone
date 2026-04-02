import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const table = formData.get("table") as string;
  const column = formData.get("column") as string;
  const rowId = formData.get("rowId") as string;

  if (!file || !table || !column || !rowId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Upload to Supabase Storage
  const ext = file.name.split(".").pop();
  const fileName = `${table}/${rowId}_${column}_${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("assets")
    .upload(fileName, buffer, { contentType: file.type, upsert: true });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  // Get public URL
  const { data: urlData } = supabase.storage.from("assets").getPublicUrl(fileName);
  const publicUrl = urlData.publicUrl;

  // Update the row in the database
  const { error: updateError } = await supabase
    .from(table)
    .update({ [column]: publicUrl })
    .eq("id", rowId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ url: publicUrl });
}
