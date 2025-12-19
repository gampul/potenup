import Header from "@/components/Header";
import PledgeContent from "@/components/PledgeContent";
import PolicySection from "@/components/PolicySection";
import PledgeForm from "@/components/PledgeForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4">
      <main className="max-w-3xl mx-auto">
        {/* 서약서 카드 */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 md:p-12">
          {/* 헤더 (로고 + 제목) */}
          <Header />

          {/* 서약 본문 내용 */}
          <PledgeContent />

          {/* 손∙망실 처리 규정 */}
          <PolicySection />

          {/* 서약 입력 폼 */}
          <PledgeForm />
        </div>

        {/* 푸터 */}
        <footer className="text-center mt-8 text-sm text-gray-500">
          © {new Date().getFullYear()} ㈜원티드랩. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
