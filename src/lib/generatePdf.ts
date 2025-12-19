"use client";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface PledgeFormData {
  pledgeDate: string;
  educationName: string;
  name: string;
  address: string;
  phone: string;
  signature: string | null;
}

export async function generatePledgePdf(formData: PledgeFormData): Promise<Blob> {
  // PDF용 HTML 요소 생성
  const container = document.createElement("div");
  container.style.cssText = `
    position: absolute;
    left: -9999px;
    top: 0;
    width: 794px;
    padding: 40px;
    background: white;
    font-family: 'Noto Sans KR', sans-serif;
    color: #1e293b;
    line-height: 1.6;
  `;

  container.innerHTML = `
    <div style="margin-bottom: 30px;">
      <span style="color: #258bf7; font-size: 18px; font-weight: bold;">wanted</span>
    </div>

    <h1 style="text-align: center; font-size: 28px; font-weight: bold; margin-bottom: 30px; color: #111;">
      자산 관리 서약서
    </h1>

    <p style="margin-bottom: 20px; color: #374151;">
      본인은 아래 사항을 충분히 숙지하고 동의하며, 이를 성실히 준수할 것임을 서약합니다.
    </p>

    <ol style="margin-bottom: 25px; padding-left: 20px; color: #374151;">
      <li style="margin-bottom: 12px;">
        ㈜원티드랩(이하 '교육기관')으로부터 지급된 모든 물품은 교육기관의 자산임을 인식하고 이를 철저히 관리하는 것에 동의합니다.
      </li>
      <li style="margin-bottom: 12px;">
        전항의 자산은 타인에게 대여할 수 없으며, 본인이 교육 수강 용도로만 사용하는 것에 동의합니다.
      </li>
      <li style="margin-bottom: 12px;">
        1항의 자산에 인가되지 않은 불법 소프트웨어 설치 또는 사용으로 인한 자산 훼손 등 및/또는 제3자의 지적재산권 침해 등으로 인한 민/형사상 책임은 본인이 부담하며, 그에 따라 교육 수강 제한됨에 동의합니다.
      </li>
      <li style="margin-bottom: 12px;">
        1항의 자산에 관한 내역 [첨부1. 자산수령/반납확인서]을 모두 확인하였으며, 아래 <span style="color: #2563eb;">"원티드랩 내부 자산 손·망실 처리 규정"</span> 일부를 준수하는 것에 동의합니다.
      </li>
      <li style="margin-bottom: 12px;">
        1항의 자산은 교육 종료 즉시 교육기관에 <strong style="color: #dc2626;">전부</strong> 반납하는 것에 동의합니다.
        <p style="margin-top: 8px; padding: 10px; background: #f8fafc; border-radius: 6px; font-size: 13px; color: #64748b;">
          ※ 미 반납품은 [내부 자산 손·망실 처리규정] "망실" 적용
        </p>
      </li>
      <li style="margin-bottom: 12px;">
        1항의 자산에 임의로 USIM칩 및 부착물(스티커 포함) 등은 부착하지 않겠습니다.
        <p style="margin-top: 8px; padding: 10px; background: #f8fafc; border-radius: 6px; font-size: 13px; color: #64748b;">
          ※ 부착물로 인한 자산 손상 시 "내부 자산 손·망실 처리 규정"이 적용될 수 있습니다.
        </p>
      </li>
    </ol>

    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 25px;">
      <h2 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0;">
        [내부 자산 손·망실 처리 규정]
      </h2>
      
      <div style="margin-bottom: 15px;">
        <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
          <span style="width: 8px; height: 8px; background: #3b82f6; border-radius: 50%; display: inline-block;"></span>
          개인 과실로 인한 손실(파손)
        </h3>
        <div style="margin-left: 16px; font-size: 13px; color: #4b5563;">
          <p style="margin-bottom: 5px;"><strong>수리 가능의 경우:</strong></p>
          <ul style="margin-left: 16px; margin-bottom: 10px;">
            <li>10만원 이상: 개인과실 비율은 자산관리자의 실사용자가 확인하여 결정</li>
            <li>10만원 미만: 수리비 전액 사용자 부담</li>
          </ul>
          <p style="margin-bottom: 5px;"><strong>수리 불가능의 경우:</strong></p>
          <ul style="margin-left: 16px;">
            <li>손실 시점 장부상 잔존 가액 전액 개인 부담</li>
            <li>자산가액이 설정되어 있지 않은 물품은 구입비용의 50% 개인 부담</li>
            <li style="color: #16a34a;">자연 손실 및 제품 하자로 인한 수리는 전액 회사 부담</li>
          </ul>
        </div>
      </div>

      <div>
        <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
          <span style="width: 8px; height: 8px; background: #ef4444; border-radius: 50%; display: inline-block;"></span>
          개인 부주의로 인한 망실(분실)
        </h3>
        <ul style="margin-left: 16px; font-size: 13px; color: #4b5563;">
          <li>망실 시점 장부상 잔존 가액 전액 부담</li>
        </ul>
      </div>
    </div>

    <div style="text-align: center; padding: 15px; background: #eff6ff; border-radius: 8px; margin-bottom: 25px; border: 1px solid #bfdbfe;">
      <p style="font-weight: 500; color: #1e40af;">
        위 모든 사항을 숙지하고 이를 성실히 준수할 것을 서약합니다.
      </p>
    </div>

    <div style="margin-bottom: 30px; font-size: 14px; color: #374151;">
      <div style="display: flex; margin-bottom: 10px;">
        <span style="width: 100px; text-align: right; margin-right: 20px;">서 약 일 :</span>
        <span>${formData.pledgeDate}</span>
      </div>
      <div style="display: flex; margin-bottom: 10px;">
        <span style="width: 100px; text-align: right; margin-right: 20px;">교 육 명 :</span>
        <span>${formData.educationName}</span>
      </div>
      <div style="display: flex; margin-bottom: 10px;">
        <span style="width: 100px; text-align: right; margin-right: 20px;">성 명 :</span>
        <span>${formData.name}</span>
        <span style="margin-left: 10px; color: #6b7280;">(인)</span>
      </div>
      <div style="display: flex; margin-bottom: 10px;">
        <span style="width: 100px; text-align: right; margin-right: 20px;">주 소 :</span>
        <span>${formData.address}</span>
      </div>
      <div style="display: flex; margin-bottom: 10px;">
        <span style="width: 100px; text-align: right; margin-right: 20px;">연 락 처 :</span>
        <span>${formData.phone}</span>
      </div>
      ${formData.signature ? `
      <div style="display: flex; align-items: center; margin-top: 15px;">
        <span style="width: 100px; text-align: right; margin-right: 20px;">서 명 :</span>
        <img src="${formData.signature}" style="max-width: 150px; max-height: 60px; border: 1px solid #e5e7eb; border-radius: 4px; padding: 5px; background: white;" />
      </div>
      ` : ""}
    </div>

    <div style="text-align: center; font-size: 12px; color: #9ca3af; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      © ${new Date().getFullYear()} ㈜원티드랩. All rights reserved.
    </div>
  `;

  document.body.appendChild(container);

  // HTML을 캔버스로 변환
  const canvas = await html2canvas(container, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
  });

  // 컨테이너 제거
  document.body.removeChild(container);

  // PDF 생성
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const imgX = (pdfWidth - imgWidth * ratio) / 2;
  const imgY = 0;

  // 이미지가 한 페이지를 초과하면 여러 페이지로 분할
  const pageHeight = pdfHeight;
  const scaledImgHeight = (imgHeight * pdfWidth) / imgWidth;
  
  if (scaledImgHeight <= pageHeight) {
    // 한 페이지에 들어가는 경우
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, scaledImgHeight);
  } else {
    // 여러 페이지로 분할
    let heightLeft = scaledImgHeight;
    let position = 0;
    let page = 0;

    while (heightLeft > 0) {
      if (page > 0) {
        pdf.addPage();
      }
      
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, scaledImgHeight);
      heightLeft -= pageHeight;
      position -= pageHeight;
      page++;
    }
  }

  return pdf.output("blob");
}

export function downloadPdf(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
