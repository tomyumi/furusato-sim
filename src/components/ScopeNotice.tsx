export function ScopeNotice() {
  return (
    <aside
      className="card-gold py-5 text-[15px] leading-8 text-cedar-950 md:py-6"
      aria-label="シミュレーションのご注意"
      suppressHydrationWarning
    >
      <p className="field-label text-cedar-950" suppressHydrationWarning>
        シミュレーションのご注意
      </p>
      <p className="section-copy mt-3 text-cedar-900" suppressHydrationWarning>
        以下に該当する方は正確な上限額が算出されないため、本ツールの対象外となります。
      </p>
      <ul className="section-copy mt-4 list-disc space-y-2.5 pl-5 text-cedar-900" suppressHydrationWarning>
        <li suppressHydrationWarning>株式の譲渡所得や配当所得（申告分離課税）がある方</li>
        <li suppressHydrationWarning>前年からの損失の繰越控除がある方</li>
        <li suppressHydrationWarning>特殊な税額控除（外国税額控除など）を受けている方</li>
      </ul>
    </aside>
  );
}
