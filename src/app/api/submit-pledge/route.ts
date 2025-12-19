import { NextRequest, NextResponse } from "next/server";
import { uploadFileToDrive } from "@/lib/googleDrive";
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

    // 텍스트를 Buffer로 변환
    const buffer = Buffer.from(pdfContent, "utf-8");

    // 파일명 생성: 자산관리서약서_이름_과정명.pdf
    const fileName = `자산관리서약서_${name}_${educationName}.pdf`;

    // Google Drive에 업로드 (PDF mimeType으로)
    const result = await uploadFileToDrive(buffer, fileName, "application/pdf");

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
