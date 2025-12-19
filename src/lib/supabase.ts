import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 서약서 데이터 타입
export interface PledgeData {
  pledge_date: string;
  education_name: string;
  name: string;
  address: string;
  phone: string;
  signature: string;
  agreed: boolean;
}

// 서약서 제출 함수
export async function submitPledge(data: PledgeData) {
  console.log("Submitting pledge data:", {
    ...data,
    signature: data.signature ? `[Base64 image, length: ${data.signature.length}]` : null,
  });

  // INSERT만 수행 (SELECT 제거)
  const { error } = await supabase
    .from("pledges")
    .insert([data]);

  if (error) {
    console.error("Supabase error details:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw new Error(error.message || "데이터 저장에 실패했습니다.");
  }

  console.log("Pledge submitted successfully!");
  return { success: true };
}
