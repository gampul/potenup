"use client";

import Image from "next/image";

export default function Header() {
  return (
    <header className="mb-8">
      {/* Wanted 로고 */}
      <div className="flex items-center gap-2 mb-10">
        <Image
          src="/wanted-logo.png"
          alt="Wanted"
          width={140}
          height={32}
          priority
          className="h-8 w-auto"
        />
      </div>

      {/* 제목 */}
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
        자산 관리 서약서
      </h1>
    </header>
  );
}
