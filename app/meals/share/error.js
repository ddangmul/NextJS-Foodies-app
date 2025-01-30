"use client";

export default function Error({ error }) {
  // nextJS가 제공하는 prop. 애러 정보 담고 있어 사용자에겐 보이지 않음
  return (
    <main className="error">
      <h1>An error occurred!</h1>
      <p>Failed to create meal.</p>
    </main>
  );
}
