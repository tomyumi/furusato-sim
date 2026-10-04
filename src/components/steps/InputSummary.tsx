"use client";

import type { ReactNode } from "react";
import {
  formatInputAmount,
  formatInputCount,
  formatInputYear,
} from "@/lib/format";
import type { SimulatorFormState } from "@/lib/types";

const BLUE_LABEL: Record<string, string> = {
  "": "未選択（0円として計算）",
  "0": "適用なし（白色など）",
  "100000": "10万円（簡易帳簿など）",
  "550000": "55万円（複式・紙申告など）",
  "650000": "65万円（複式・電子申告）",
};

const SPOUSE_LABEL = {
  none: "いない",
  deduction: "配偶者控除あり",
  special: "配偶者特別控除あり",
} as const;

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="kv-row" data-pdf-unit>
      <div className="kv-label text-ink-600">{label}</div>
      <div className="kv-value font-medium text-ink-900">{value}</div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      data-pdf-block
      className="min-w-0 overflow-visible rounded-xl border border-cedar-200 bg-[#fbf8f3] p-5 sm:p-6"
    >
      <h4 className="mb-2 pb-2 text-sm font-semibold leading-6 text-cedar-950">{title}</h4>
      <div>{children}</div>
    </div>
  );
}

export function InputSummary({ form }: { form: SimulatorFormState }) {
  const { income, deductions, family } = form;
  const rateLabel =
    family.housingLoanRate === ""
      ? "未選択"
      : family.housingLoanRate === 0.01
        ? "1.0%"
        : "0.7%";

  return (
    <div className="space-y-2">
      <h3 data-pdf-block className="text-sm font-semibold leading-6 text-ink-800">
        入力内容
      </h3>
      <Block title="年">
        <Row label="対象年" value={formatInputYear(form.taxYear)} />
        <Row label="居住開始年" value={formatInputYear(family.occupancyYear)} />
      </Block>
      <Block title="源泉徴収票・所得">
        <Row label="支払金額（本業）" value={formatInputAmount(income.primarySalaryRevenue)} />
        <Row label="支払金額（副業・2枚目）" value={formatInputAmount(income.sideSalaryRevenue)} />
        <Row label="売上（収入金額）" value={formatInputAmount(income.businessRevenue)} />
        <Row label="必要経費" value={formatInputAmount(income.businessExpenses)} />
        <Row
          label="青色申告特別控除"
          value={BLUE_LABEL[String(income.blueSpecialDeduction)] ?? "未選択（0円として計算）"}
        />
        <Row label="その他の所得" value={formatInputAmount(income.otherIncome)} />
      </Block>
      <Block title="所得控除">
        <Row label="社会保険料等の金額" value={formatInputAmount(deductions.socialInsurance)} />
        <Row label="生命保険料の控除額" value={formatInputAmount(deductions.lifeInsurance)} />
        <Row label="地震保険料の控除額" value={formatInputAmount(deductions.earthquakeInsurance)} />
        <Row label="小規模企業共済等掛金の金額" value={formatInputAmount(deductions.ideco)} />
        <Row label="医療費控除" value={formatInputAmount(deductions.medicalExpense)} />
      </Block>
      <Block title="家族">
        <Row label="控除対象配偶者" value={SPOUSE_LABEL[family.spouseStatus]} />
        {family.spouseStatus !== "none" ? (
          <Row label="配偶者の合計所得金額" value={formatInputAmount(family.spouseIncome)} />
        ) : null}
        <Row
          label="一般の控除対象扶養親族"
          value={formatInputCount(family.dependentGeneral)}
        />
        <Row label="特定扶養親族（19〜22歳）" value={formatInputCount(family.dependentSpecific)} />
        <Row label="老人扶養親族（同居以外）" value={formatInputCount(family.dependentElderly)} />
        <Row label="老人扶養親族（同居）" value={formatInputCount(family.dependentElderlyLiving)} />
      </Block>
      <Block title="住宅ローン">
        <Row
          label="住宅借入金等特別控除"
          value={family.hasHousingLoanCredit ? "あり" : "なし"}
        />
        {family.hasHousingLoanCredit ? (
          <>
            <Row label="居住開始年" value={formatInputYear(family.occupancyYear)} />
            <Row label="控除率" value={rateLabel} />
            <Row
              label="住宅借入金等年末残高"
              value={formatInputAmount(family.housingLoanYearEndBalance)}
            />
            <Row
              label="住宅借入金等特別控除可能額"
              value={formatInputAmount(family.housingLoanPossibleAmount)}
            />
          </>
        ) : null}
      </Block>
    </div>
  );
}
