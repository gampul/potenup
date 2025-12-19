import { NextRequest, NextResponse } from "next/server";
import { uploadFileToDrive } from "@/lib/googleDrive";
import { generatePledgePdfContent } from "@/lib/generatePdfServer";

export async function POST(request: NextRequest) {
  console.log("📝 Received pledge submission request");
  
  try {
    const data = await request.json();
    console.log("📋 Form data received:", { 
      name: data.name, 
      educationName: data.educationName,
      hasSignature: !!data.signature 
    });

    const { pledgeDate, educationName, name, address, phone, signature } = data;

    // 텍스트 형식의 서약서 내용 생성
    console.log("📄 Generating PDF content...");
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
    console.log("✅ PDF content generated, buffer size:", buffer.length, "bytes");

    // 파일명 생성: 자산관리서약서_이름_과정명.pdf
    const fileName = `자산관리서약서_${name}_${educationName}.pdf`;
    console.log("📝 File name:", fileName);

    // Google Drive에 업로드 (PDF mimeType으로)
    console.log("☁️ Uploading to Google Drive...");
    const result = await uploadFileToDrive(buffer, fileName, "application/pdf");

    console.log("✅ Pledge submission completed successfully!");
    return NextResponse.json({
      success: true,
      fileId: result.fileId,
      webViewLink: result.webViewLink,
      message: "서약서가 Google Drive에 저장되었습니다.",
    });
  } catch (error: any) {
    console.error("❌ Submit pledge API error:");
    console.error("  - Error name:", error.name);
    console.error("  - Error message:", error.message);
    console.error("  - Error stack:", error.stack);
    
    return NextResponse.json(
      { 
        error: "서약서 저장에 실패했습니다.", 
        details: error.message || String(error),
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
