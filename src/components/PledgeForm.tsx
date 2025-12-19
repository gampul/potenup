"use client";

import { useState, useRef, useEffect } from "react";
import SignaturePad from "./SignaturePad";
import { submitPledge } from "@/lib/supabase";

// 교육 과정 목록
const EDUCATION_COURSES = [
  "AI Agent & 언리얼 개발 협업과정",
  "게임 개발자 양성과정",
  "AI기반 FE & BE 협업과정",
];

interface FormData {
  pledgeDate: string;
  educationName: string;
  name: string;
  address: string;
  phone: string;
  signature: string | null;
  agreed: boolean;
}

export default function PledgeForm() {
  const [formData, setFormData] = useState<FormData>({
    pledgeDate: new Date().toISOString().split("T")[0],
    educationName: "",
    name: "",
    address: "",
    phone: "",
    signature: null,
    agreed: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [isEducationDropdownOpen, setIsEducationDropdownOpen] = useState(false);
  const [driveLink, setDriveLink] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsEducationDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSignatureChange = (signature: string | null) => {
    setFormData((prev) => ({
      ...prev,
      signature,
    }));
  };

  const handleEducationSelect = (courseName: string) => {
    setFormData((prev) => ({
      ...prev,
      educationName: courseName,
    }));
    setIsEducationDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreed) {
      alert("서약 내용에 동의해주세요.");
      return;
    }

    if (!formData.signature) {
      alert("서명을 입력해주세요.");
      return;
    }

    if (!formData.educationName) {
      alert("교육 과정을 선택해주세요.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Supabase에 서약서 데이터 저장
      await submitPledge({
        pledge_date: formData.pledgeDate,
        education_name: formData.educationName,
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        signature: formData.signature,
        agreed: formData.agreed,
      });

      // Google Drive에 서약서 업로드
      try {
        console.log("Google Drive 업로드 시작...");
        const response = await fetch("/api/submit-pledge", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pledgeDate: formData.pledgeDate,
            educationName: formData.educationName,
            name: formData.name,
            address: formData.address,
            phone: formData.phone,
            signature: formData.signature,
          }),
        });

        console.log("API Response status:", response.status);
        const result = await response.json();
        console.log("API Response data:", result);

        if (result.success && result.webViewLink) {
          setDriveLink(result.webViewLink);
          console.log("✅ Google Drive 업로드 성공:", result.webViewLink);
          alert("✅ 서약서가 Google Drive에 저장되었습니다!");
        } else {
          console.error("❌ Google Drive 업로드 실패:", result);
          alert("⚠️ Google Drive 저장 실패: " + (result.error || "알 수 없는 오류"));
        }
      } catch (driveError) {
        console.error("❌ Google Drive 업로드 오류:", driveError);
        alert("⚠️ Google Drive 저장 중 오류 발생");
        // Google Drive 업로드 실패해도 제출은 성공으로 처리
      }
      
      setSubmitStatus("success");
    } catch (error) {
      console.error("제출 오류:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintPdf = () => {
    // 인쇄 페이지로 이동 (새 창)
    const params = new URLSearchParams({
      pledgeDate: formData.pledgeDate,
      educationName: formData.educationName,
      name: formData.name,
      address: formData.address,
      phone: formData.phone,
      signature: formData.signature || "",
    });
    
    window.open(`/print?${params.toString()}`, "_blank", "width=900,height=700");
  };

  if (submitStatus === "success") {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          서약서가 제출되었습니다
        </h3>
        <p className="text-gray-600 mb-6">
          {formData.name}님의 자산관리서약서가 정상적으로 접수되었습니다.
        </p>

        {/* Google Drive 링크 */}
        {driveLink && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 mb-2">
              ✅ 서약서가 Google Drive에 저장되었습니다.
            </p>
            <a
              href={driveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              Google Drive에서 보기 →
            </a>
          </div>
        )}

        {/* PDF 다운로드 버튼 */}
        <button
          onClick={handlePrintPdf}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          서약서 PDF 저장 / 인쇄
        </button>
      </div>
    );
  }

  return (
    <section>
      {/* 서약 확인 문구 */}
      <div className="text-center mb-8 py-4 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-gray-800 font-medium">
          위 모든 사항을 숙지하고 이를 성실히 준수할 것을 서약합니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 서약일 */}
        <div className="flex items-center gap-4">
          <label className="w-32 text-gray-700 font-medium text-right shrink-0">
            서 약 일 :
          </label>
          <input
            type="date"
            name="pledgeDate"
            value={formData.pledgeDate}
            onChange={handleChange}
            required
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* 교육명 - 아코디언 드롭다운 */}
        <div className="flex items-center gap-4">
          <label className="w-32 text-gray-700 font-medium text-right shrink-0">
            교 육 명 :
          </label>
          <div className="flex-1 relative" ref={dropdownRef}>
            {/* 선택 버튼 */}
            <button
              type="button"
              onClick={() => setIsEducationDropdownOpen(!isEducationDropdownOpen)}
              className={`w-full px-4 py-3 border rounded-lg text-left flex items-center justify-between transition-all ${
                isEducationDropdownOpen
                  ? "border-blue-500 ring-2 ring-blue-500"
                  : "border-gray-300 hover:border-gray-400"
              } ${formData.educationName ? "text-gray-900" : "text-gray-400"}`}
            >
              <span>{formData.educationName || "교육 과정을 선택하세요"}</span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  isEducationDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* 드롭다운 메뉴 */}
            <div
              className={`absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-all duration-200 origin-top ${
                isEducationDropdownOpen
                  ? "opacity-100 scale-y-100"
                  : "opacity-0 scale-y-0 pointer-events-none"
              }`}
            >
              {EDUCATION_COURSES.map((course, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleEducationSelect(course)}
                  className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 ${
                    formData.educationName === course
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700"
                  } ${index !== EDUCATION_COURSES.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  {/* 체크 아이콘 */}
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      formData.educationName === course
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.educationName === course && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="font-medium">{course}</span>
                </button>
              ))}
            </div>

            {/* 숨겨진 필수 입력 필드 (폼 검증용) */}
            <input
              type="text"
              name="educationName"
              value={formData.educationName}
              onChange={() => {}}
              required
              className="sr-only"
              tabIndex={-1}
            />
          </div>
        </div>

        {/* 성명 + 서명 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <label className="w-32 text-gray-700 font-medium text-right shrink-0">
              성 명 :
            </label>
            <div className="flex-1 flex items-center gap-3">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="성명을 입력하세요"
                required
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <span className="text-gray-500 shrink-0">(인)</span>
            </div>
          </div>
          
          {/* 서명 패드 */}
          <div className="ml-36">
            <SignaturePad 
              signature={formData.signature}
              onSignatureChange={handleSignatureChange}
            />
          </div>
        </div>

        {/* 주소 */}
        <div className="flex items-center gap-4">
          <label className="w-32 text-gray-700 font-medium text-right shrink-0">
            주 소 :
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="주소를 입력하세요"
            required
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* 연락처 */}
        <div className="flex items-center gap-4">
          <label className="w-32 text-gray-700 font-medium text-right shrink-0">
            연 락 처 :
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="010-0000-0000"
            required
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* 동의 체크박스 */}
        <div className="flex items-center gap-3 mt-6 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="agreed"
            name="agreed"
            checked={formData.agreed}
            onChange={handleChange}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
          />
          <label htmlFor="agreed" className="text-gray-700 cursor-pointer select-none">
            위 서약 내용을 모두 확인하였으며, 이에 동의합니다.
          </label>
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting || !formData.agreed || !formData.signature}
          className={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-200 ${
            formData.agreed && formData.signature && !isSubmitting
              ? "bg-blue-600 hover:bg-blue-700 active:scale-[0.99] shadow-lg shadow-blue-500/25"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              제출 중...
            </span>
          ) : (
            "서약서 제출하기"
          )}
        </button>

        {submitStatus === "error" && (
          <p className="text-center text-red-500 mt-4">
            제출 중 오류가 발생했습니다. 다시 시도해주세요.
          </p>
        )}
      </form>
    </section>
  );
}
