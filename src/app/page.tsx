import { ScopeNotice } from "@/components/ScopeNotice";
import { Simulator } from "@/components/Simulator";

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-3xl overflow-x-clip px-4 py-5 sm:px-6 sm:py-8">
      <div className="mb-5 min-w-0 space-y-3 sm:mb-6">
        <p className="font-display text-sm tracking-wide text-cedar-700">FURUSATO NOZEI</p>
        <h1 className="text-3xl font-semibold leading-normal text-ink-950 sm:text-4xl">
          ふるさと納税
          <span className="mt-0.5 block text-mist-800">控除上限シミュレーター</span>
        </h1>
        <p className="text-sm leading-6 text-ink-600 sm:text-base">
          源泉徴収票の「支払金額」「社会保険料等の金額」などを書き写すだけで、会社員でも副業がある人でも、
          自己負担2,000円で済む寄付上限の目安を計算できます。
        </p>
        <ScopeNotice />
      </div>
      <Simulator />
      <footer className="mt-6 text-xs leading-5 text-ink-500">
        本サービスは税務アドバイスではありません。計算結果は概算の目安です。
      </footer>
    </main>
  );
}
