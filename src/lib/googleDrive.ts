import { google } from "googleapis";
import { Readable } from "stream";

// Private Key 디코딩 함수
function getPrivateKey(): string {
  const privateKeyEnv = process.env.GOOGLE_PRIVATE_KEY;
  
  if (!privateKeyEnv) {
    throw new Error("GOOGLE_PRIVATE_KEY environment variable is not set");
  }

  // Base64로 인코딩된 경우 디코딩
  if (!privateKeyEnv.includes("BEGIN PRIVATE KEY")) {
    console.log("🔓 Decoding Base64 private key...");
    try {
      const decoded = Buffer.from(privateKeyEnv, "base64").toString("utf-8");
      console.log("✅ Private key decoded successfully");
      return decoded;
    } catch (error) {
      console.error("❌ Failed to decode Base64 private key:", error);
      throw new Error("Failed to decode GOOGLE_PRIVATE_KEY from Base64");
    }
  }

  // 이미 일반 형식이면 줄바꿈 처리
  console.log("🔑 Using plain text private key with newline replacement");
  return privateKeyEnv.replace(/\\n/g, "\n");
}

// 환경 변수 검증
function validateEnvVars() {
  const requiredVars = [
    "GOOGLE_PROJECT_ID",
    "GOOGLE_PRIVATE_KEY_ID",
    "GOOGLE_PRIVATE_KEY",
    "GOOGLE_CLIENT_EMAIL",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_X509_CERT_URL",
    "GOOGLE_DRIVE_FOLDER_ID",
  ];

  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.error("❌ Missing environment variables:", missing);
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  console.log("✅ All environment variables validated");
}

// 서비스 계정 인증 정보
function getCredentials() {
  return {
    type: "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: getPrivateKey(),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
  };
}

// Google Drive 폴더 ID
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

// Google Auth 클라이언트 생성
function getAuthClient() {
  validateEnvVars();
  
  console.log("🔑 Creating Google Auth client...");
  console.log("  - Client Email:", process.env.GOOGLE_CLIENT_EMAIL);
  console.log("  - Folder ID:", FOLDER_ID);
  
  const credentials = getCredentials();
  
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });
  return auth;
}

// Google Drive 클라이언트 생성
function getDriveClient() {
  const auth = getAuthClient();
  return google.drive({ version: "v3", auth });
}

// Buffer를 Readable Stream으로 변환
function bufferToStream(buffer: Buffer): Readable {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

// 파일을 Google Drive에 업로드
export async function uploadFileToDrive(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string = "text/plain"
): Promise<{ fileId: string; webViewLink: string }> {
  console.log("📤 Starting file upload to Google Drive...");
  console.log("  - File name:", fileName);
  console.log("  - MIME type:", mimeType);
  console.log("  - Buffer size:", fileBuffer.length, "bytes");
  
  const drive = getDriveClient();

  const fileMetadata = {
    name: fileName,
    parents: FOLDER_ID ? [FOLDER_ID] : undefined,
  };

  const media = {
    mimeType: mimeType,
    body: bufferToStream(fileBuffer),
  };

  try {
    console.log("🚀 Calling Google Drive API...");
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, webViewLink",
    });

    const fileId = response.data.id || "";
    const webViewLink = response.data.webViewLink || "";

    console.log("✅ File uploaded successfully to Google Drive:");
    console.log("  - File ID:", fileId);
    console.log("  - Web View Link:", webViewLink);

    return { fileId, webViewLink };
  } catch (error: any) {
    console.error("❌ Google Drive upload error:");
    console.error("  - Error message:", error.message);
    console.error("  - Error code:", error.code);
    console.error("  - Error details:", JSON.stringify(error.errors || error, null, 2));
    
    // 더 자세한 에러 정보를 포함한 에러 던지기
    throw new Error(`Google Drive upload failed: ${error.message}`);
  }
}

// PDF 파일을 Google Drive에 업로드 (하위 호환성)
export async function uploadPdfToDrive(
  pdfBuffer: Buffer,
  fileName: string
): Promise<{ fileId: string; webViewLink: string }> {
  return uploadFileToDrive(pdfBuffer, fileName, "text/plain; charset=utf-8");
}
