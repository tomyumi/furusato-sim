import { Simulator } from "@/components/Simulator";

export default function HomePage() {
  return (
    <main className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12 sm:text-left">
        <p className="font-display text-sm tracking-[0.2em] text-cedar-700">FURUSATO NOZEI</p>
        <h1 className="mt-2 font-display text-3xl leading-tight text-ink-950 sm:text-4xl">
          ふるさと納税
          <span className="block text-mist-800">控除上限シミュレーター</span>
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-600 sm:text-base">
          源泉徴収票の「支払金額」「社会保険料等の金額」などを書き写すだけで、会社員でも副業がある人でも、
          自己負担2,000円で済む寄付上限の目安を計算できます。
        </p>
      </div>
      <Simulator />
      <footer className="mx-auto mt-12 max-w-3xl text-center text-xs text-ink-500 sm:text-left">
        本サービスは税務アドバイスではありません。計算結果は概算の目安です。
      </footer>
    </main>
  );
}
