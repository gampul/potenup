"use client";

export default function PledgeContent() {
  return (
    <section className="mb-8">
      {/* 서문 */}
      <p className="text-gray-700 mb-6 leading-relaxed">
        본인은 아래 사항을 충분히 숙지하고 동의하며, 이를 성실히 준수할 것임을 서약합니다.
      </p>

      {/* 서약 항목들 */}
      <ol className="list-decimal list-outside ml-6 space-y-4 text-gray-700">
        <li className="pl-2 leading-relaxed">
          ㈜원티드랩(이하 &apos;교육기관&apos;)으로부터 지급된 모든 물품은 교육기관의 자산임을 인식하고 이를 철저히 관리하는 것에 동의합니다.
        </li>
        
        <li className="pl-2 leading-relaxed">
          전항의 자산은 타인에게 대여할 수 없으며, 본인이 교육 수강 용도로만 사용하는 것에 동의합니다.
        </li>
        
        <li className="pl-2 leading-relaxed">
          1항의 자산에 인가되지 않은 불법 소프트웨어 설치 또는 사용으로 인한 자산 훼손 등 및/또는 제3자의 지적재산권 침해 등으로 인한 민/형사상 책임은 본인이 부담하며, 그에 따라 교육 수강 제한됨에 동의합니다.
        </li>
        
        <li className="pl-2 leading-relaxed">
          1항의 자산에 관한 내역 [첨부1. 자산수령/반납확인서]을 모두 확인하였으며, 아래{" "}
          <span className="text-blue-600 font-medium">
            &quot;원티드랩 내부 자산 손∙망실 처리 규정&quot;
          </span>{" "}
          일부를 준수하는 것에 동의합니다.
        </li>
        
        <li className="pl-2 leading-relaxed">
          1항의 자산은 교육 종료 즉시 교육기관에{" "}
          <span className="font-medium text-red-600">전부</span> 반납하는 것에 동의합니다.
          <p className="mt-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
            ※ 미 반납품은 [내부 자산 손∙망실 처리규정] &quot;망실&quot; 적용
          </p>
        </li>
        
        <li className="pl-2 leading-relaxed">
          1항의 자산에 임의로 USIM칩 및 부착물(스티커 포함) 등은 부착하지 않겠습니다.
          <p className="mt-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
            ※ 부착물로 인한 자산 손상 시 &quot;내부 자산 손∙망실 처리 규정&quot;이 적용될 수 있습니다.
          </p>
        </li>
      </ol>
    </section>
  );
}

