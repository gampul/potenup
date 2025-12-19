"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

interface PledgeData {
  pledgeDate: string;
  educationName: string;
  name: string;
  address: string;
  phone: string;
  signature: string | null;
}

function PrintPageContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<PledgeData | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // URL 파라미터에서 데이터 가져오기
    const pledgeDate = searchParams.get("pledgeDate") || "";
    const educationName = searchParams.get("educationName") || "";
    const name = searchParams.get("name") || "";
    const address = searchParams.get("address") || "";
    const phone = searchParams.get("phone") || "";
    const signature = searchParams.get("signature") || null;

    setData({
      pledgeDate,
      educationName,
      name,
      address,
      phone,
      signature,
    });

    setIsReady(true);
  }, [searchParams]);

  useEffect(() => {
    if (isReady && data) {
      // 페이지 로드 후 자동으로 인쇄 다이얼로그 열기
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [isReady, data]);

  if (!data) {
    return <div className="p-10 text-center">로딩 중...</div>;
  }

  return (
    <div className="print-container">
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
        }
        .print-container {
          max-width: 210mm;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Noto Sans KR', sans-serif;
          color: #1e293b;
          line-height: 1.7;
          background: white;
        }
      `}</style>

      {/* 인쇄 버튼 (인쇄 시 숨김) */}
      <div className="no-print fixed top-4 right-4 flex gap-2">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          PDF로 저장 / 인쇄
        </button>
        <button
          onClick={() => window.close()}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          닫기
        </button>
      </div>

      {/* 헤더 */}
      <div className="mb-8">
        <Image
          src="/wanted-logo.png"
          alt="Wanted"
          width={120}
          height={28}
          className="h-7 w-auto"
        />
      </div>

      {/* 제목 */}
      <h1 className="text-2xl font-bold text-center mb-8">자산 관리 서약서</h1>

      {/* 서문 */}
      <p className="mb-6 text-gray-700">
        본인은 아래 사항을 충분히 숙지하고 동의하며, 이를 성실히 준수할 것임을 서약합니다.
      </p>

      {/* 서약 항목 */}
      <ol className="list-decimal list-outside ml-5 mb-6 space-y-3 text-gray-700 text-sm">
        <li className="pl-1">
          ㈜원티드랩(이하 &apos;교육기관&apos;)으로부터 지급된 모든 물품은 교육기관의 자산임을 인식하고 이를 철저히 관리하는 것에 동의합니다.
        </li>
        <li className="pl-1">
          전항의 자산은 타인에게 대여할 수 없으며, 본인이 교육 수강 용도로만 사용하는 것에 동의합니다.
        </li>
        <li className="pl-1">
          1항의 자산에 인가되지 않은 불법 소프트웨어 설치 또는 사용으로 인한 자산 훼손 등 및/또는 제3자의 지적재산권 침해 등으로 인한 민/형사상 책임은 본인이 부담하며, 그에 따라 교육 수강 제한됨에 동의합니다.
        </li>
        <li className="pl-1">
          1항의 자산에 관한 내역 [첨부1. 자산수령/반납확인서]을 모두 확인하였으며, 아래{" "}
          <span className="text-blue-600 font-medium">&quot;원티드랩 내부 자산 손∙망실 처리 규정&quot;</span>{" "}
          일부를 준수하는 것에 동의합니다.
        </li>
        <li className="pl-1">
          1항의 자산은 교육 종료 즉시 교육기관에 <span className="font-bold text-red-600">전부</span> 반납하는 것에 동의합니다.
          <p className="mt-1 text-xs text-gray-500 bg-gray-50 p-2 rounded">
            ※ 미 반납품은 [내부 자산 손∙망실 처리규정] &quot;망실&quot; 적용
          </p>
        </li>
        <li className="pl-1">
          1항의 자산에 임의로 USIM칩 및 부착물(스티커 포함) 등은 부착하지 않겠습니다.
          <p className="mt-1 text-xs text-gray-500 bg-gray-50 p-2 rounded">
            ※ 부착물로 인한 자산 손상 시 &quot;내부 자산 손∙망실 처리 규정&quot;이 적용될 수 있습니다.
          </p>
        </li>
      </ol>

      {/* 손망실 처리 규정 */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 text-sm">
        <h2 className="font-bold text-gray-900 mb-3 pb-2 border-b border-slate-200">
          [내부 자산 손∙망실 처리 규정]
        </h2>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            개인 과실로 인한 손실(파손)
          </h3>
          <div className="ml-4 text-gray-600 text-xs space-y-1">
            <p className="font-medium">수리 가능의 경우:</p>
            <ul className="ml-3 space-y-0.5">
              <li>• 10만원 이상: 개인과실 비율은 자산관리자의 실사용자가 확인하여 결정</li>
              <li>• 10만원 미만: 수리비 전액 사용자 부담</li>
            </ul>
            <p className="font-medium mt-2">수리 불가능의 경우:</p>
            <ul className="ml-3 space-y-0.5">
              <li>• 손실 시점 장부상 잔존 가액 전액 개인 부담</li>
              <li>• 자산가액이 설정되어 있지 않은 물품은 구입비용의 50% 개인 부담</li>
              <li className="text-green-600">• 자연 손실 및 제품 하자로 인한 수리는 전액 회사 부담</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            개인 부주의로 인한 망실(분실)
          </h3>
          <ul className="ml-4 text-gray-600 text-xs">
            <li>• 망실 시점 장부상 잔존 가액 전액 부담</li>
          </ul>
        </div>
      </div>

      {/* 서약 확인 문구 */}
      <div className="text-center py-3 bg-blue-50 rounded-lg border border-blue-100 mb-6">
        <p className="text-gray-800 font-medium text-sm">
          위 모든 사항을 숙지하고 이를 성실히 준수할 것을 서약합니다.
        </p>
      </div>

      {/* 작성 정보 */}
      <div className="space-y-2 text-sm mb-6">
        <div className="flex">
          <span className="w-24 text-right mr-4 text-gray-600">서 약 일 :</span>
          <span className="text-gray-900">{data.pledgeDate}</span>
        </div>
        <div className="flex">
          <span className="w-24 text-right mr-4 text-gray-600">교 육 명 :</span>
          <span className="text-gray-900">{data.educationName}</span>
        </div>
        <div className="flex items-center">
          <span className="w-24 text-right mr-4 text-gray-600">성 명 :</span>
          <span className="text-gray-900">{data.name}</span>
          <span className="ml-2 text-gray-500">(인)</span>
          {data.signature && (
            <img
              src={data.signature}
              alt="서명"
              className="ml-4 max-w-[120px] max-h-[50px] border border-gray-200 rounded p-1 bg-white"
            />
          )}
        </div>
        <div className="flex">
          <span className="w-24 text-right mr-4 text-gray-600">주 소 :</span>
          <span className="text-gray-900">{data.address}</span>
        </div>
        <div className="flex">
          <span className="w-24 text-right mr-4 text-gray-600">연 락 처 :</span>
          <span className="text-gray-900">{data.phone}</span>
        </div>
      </div>

      {/* 푸터 */}
      <div className="text-center text-xs text-gray-400 pt-4 border-t border-gray-200 mt-8">
        © {new Date().getFullYear()} ㈜원티드랩. All rights reserved.
      </div>
    </div>
  );
}

export default function PrintPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">로딩 중...</div>}>
      <PrintPageContent />
    </Suspense>
  );
}
