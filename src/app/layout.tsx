import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MovieLog | 영화 기록 저장소",
  description: "당신이 본 영화를 Linear 스타일의 깔끔한 디자인으로 기록하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <main className="min-h-screen flex flex-col items-center max-w-4xl mx-auto px-6 py-12">
          {children}
        </main>
      </body>
    </html>
  );
}
