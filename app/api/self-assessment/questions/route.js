import { NextResponse } from "next/server";
import { buatClientServer  } from "@/lib/supabase/server";

// RLA043: GET pertanyaan asesmen beserta opsinya.
// Sengaja TIDAK mengirim query_text, topic_hints, dan entry_type (data internal RAG).

export async function GET() {
  try {
    const { data, error } = await buatClientServer()
      .from("self_assessment_questions")
      .select(
        `q_code, question_text, allows_multiple,
         self_assessment_options (
           option_id, option_code, option_label,
           is_emergency, is_education, is_active
         )`
      )
      .eq("is_active", true)
      .order("q_code")
      .order("option_code", { referencedTable: "self_assessment_options" });

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("Pertanyaan asesmen kosong");

    const questions = data.map((q) => ({
      id: q.q_code,
      text: q.question_text,
      multi: q.allows_multiple,
      options: (q.self_assessment_options || [])
        .filter((o) => o.is_active)
        .map((o) => ({
          id: o.option_code,
          label: o.option_label,
          flag: o.is_emergency ? "darurat" : o.is_education ? "edukasi" : null,
        })),
    }));

    return NextResponse.json(
      { questions },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
    );
  } catch (err) {
    console.error("[GET /api/self-assessment/questions]", err);
    return NextResponse.json(
      { error: "Pertanyaan belum bisa dimuat" },
      { status: 500 }
    );
  }
}