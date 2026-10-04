export function ScopeNotice() {
  return (
    <aside
      className="card-gold text-sm leading-7 text-cedar-950"
      aria-label="シミュレーションのご注意"
    >
      <p className="font-semibold">シミュレーションのご注意</p>
      <p className="mt-2 text-cedar-900/90">
        以下に該当する方は正確な上限額が算出されないため、本ツールの対象外となります。
      </p>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-cedar-900/90">
        <li>株式の譲渡所得や配当所得（申告分離課税）がある方</li>
        <li>前年からの損失の繰越控除がある方</li>
        <li>特殊な税額控除（外国税額控除など）を受けている方</li>
      </ul>
    </aside>
  );
}
