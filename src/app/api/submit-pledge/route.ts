import { NextRequest, NextResponse } from "next/server";
import { uploadPdfToDrive } from "@/lib/googleDrive";
import { generatePledgePdfContent } from "@/lib/generatePdfServer";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const { pledgeDate, educationName, name, address, phone, signature } = data;

    // 텍스트 형식의 서약서 내용 생성
    const pdfContent = generatePledgePdfContent({
      pledgeDate,
      educationName,
      name,
      address,
      phone,
      signature,
    });

    // 텍스트를 Buffer로 변환 (txt 파일로 저장)
    const buffer = Buffer.from(pdfContent, "utf-8");

    // 파일명 생성
    const fileName = `자산관리서약서_${name}_${pledgeDate}.txt`;

    // Google Drive에 업로드
    const result = await uploadPdfToDrive(buffer, fileName);

    return NextResponse.json({
      success: true,
      fileId: result.fileId,
      webViewLink: result.webViewLink,
      message: "서약서가 Google Drive에 저장되었습니다.",
    });
  } catch (error) {
    console.error("Submit pledge API error:", error);
    return NextResponse.json(
      { error: "서약서 저장에 실패했습니다.", details: String(error) },
      { status: 500 }
    );
  }
}

