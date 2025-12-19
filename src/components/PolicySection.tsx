"use client";

export default function PolicySection() {
  return (
    <section className="mb-10 bg-slate-50 border border-slate-200 rounded-xl p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b border-slate-200">
        [내부 자산 손∙망실 처리 규정]
      </h2>

      {/* 개인 과실로 인한 손실(파손) */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          개인 과실로 인한 손실(파손)
        </h3>

        {/* 수리 가능의 경우 */}
        <div className="ml-4 mb-4">
          <p className="font-medium text-gray-700 mb-2">수리 가능의 경우 :</p>
          <ul className="ml-4 space-y-1 text-gray-600 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>
                10만원 이상 : 개인과실 비율은 자산관리자의 실사용자가 확인하여 결정
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>10만원 미만 : 수리비 전액 사용자 부담</span>
            </li>
          </ul>
        </div>

        {/* 수리 불가능의 경우 */}
        <div className="ml-4">
          <p className="font-medium text-gray-700 mb-2">수리 불가능의 경우 :</p>
          <ul className="ml-4 space-y-1 text-gray-600 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>손실 시점 장부상 잔존 가액 전액 개인 부담.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>
                자산가액이 설정되어 있지 않은 물품은 구입비용의 50% 개인 부담.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              <span>자연 손실 및 제품 하자로 인한 수리는 전액 회사 부담.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 개인 부주의로 인한 망실(분실) */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          개인 부주의로 인한 망실(분실)
        </h3>
        <ul className="ml-4 text-gray-600 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-red-500 mt-1">•</span>
            <span>망실 시점 장부상 잔존 가액 전액 부담.</span>
          </li>
        </ul>
      </div>
    </section>
  );
}

