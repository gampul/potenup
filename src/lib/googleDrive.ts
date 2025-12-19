import { google } from "googleapis";
import { Readable } from "stream";

// 서비스 계정 인증 정보
const credentials = {
  type: "service_account",
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
};

// Google Drive 폴더 ID
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

// Google Auth 클라이언트 생성
function getAuthClient() {
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
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, webViewLink",
    });

    const fileId = response.data.id || "";
    const webViewLink = response.data.webViewLink || "";

    console.log("File uploaded to Google Drive:", { fileId, webViewLink, fileName });

    return { fileId, webViewLink };
  } catch (error) {
    console.error("Google Drive upload error:", error);
    throw error;
  }
}

// PDF 파일을 Google Drive에 업로드 (하위 호환성)
export async function uploadPdfToDrive(
  pdfBuffer: Buffer,
  fileName: string
): Promise<{ fileId: string; webViewLink: string }> {
  return uploadFileToDrive(pdfBuffer, fileName, "text/plain; charset=utf-8");
}
