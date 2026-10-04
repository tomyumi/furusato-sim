"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SiteLinks } from "@/components/SiteLinks";
import { formatYen } from "@/lib/format";
import {
  GIFT_AMOUNTS,
  GIFT_GENRES,
  cartTotal,
  findGenre,
  findGroup,
  itemKeyword,
  itemLabel,
  pinpointHeading,
  pinpointKey,
  uniquePinpoints,
  type GiftCartItem,
} from "@/lib/giftCatalog";
import {
  formatSavedAt,
  loadGiftCart,
  loadWishlists,
  saveGiftCart,
  saveWishlist,
  deleteWishlist,
  type GiftWishlist,
} from "@/lib/storage";

interface GiftCartProps {
  limit: number;
}

type PickerStep = 1 | 2 | 3;

function chipClass(active: boolean) {
  return active ? "gift-chip gift-chip-on" : "gift-chip";
}

function amountClass(active: boolean) {
  return active ? "gift-amount gift-amount-on" : "gift-amount";
}

function stepTabClass(kind: "current" | "done" | "idle") {
  if (kind === "current") return "gift-step-tab gift-step-tab-current";
  if (kind === "done") return "gift-step-tab gift-step-tab-done";
  return "gift-step-tab gift-step-tab-idle";
}

export function GiftCart({ limit }: GiftCartProps) {
  const [items, setItems] = useState<GiftCartItem[]>([]);
  const [wishlists, setWishlists] = useState<GiftWishlist[]>([]);
  const [wishName, setWishName] = useState("");
  const [wishMessage, setWishMessage] = useState("");
  const [genreId, setGenreId] = useState("meat");
  const [groupId, setGroupId] = useState("beef");
  const [leafId, setLeafId] = useState<string | null>(null);
  const [pickerAmount, setPickerAmount] = useState<number | undefined>(undefined);
  const [pickerStep, setPickerStep] = useState<PickerStep>(1);
  const [leafTouched, setLeafTouched] = useState(false);
  const remainStickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setItems(loadGiftCart());
    setWishlists(loadWishlists());
  }, []);

  useEffect(() => {
    const sticky = remainStickyRef.current;
    if (!sticky) return;

    function applyStickyOffset() {
      const el = remainStickyRef.current;
      if (!el) return;
      const stickyTop = 16;
      const gap = 16;
      const header = document.querySelector("header");
      const headerBottom = header ? Math.max(0, header.getBoundingClientRect().bottom) : 0;
      const stickyHeight = el.getBoundingClientRect().height;
      const offset = Math.ceil(Math.max(headerBottom, stickyHeight + stickyTop) + gap);
      document.documentElement.style.setProperty("--gift-sticky-offset", `${offset}px`);
    }

    applyStickyOffset();
    const observer = new ResizeObserver(applyStickyOffset);
    observer.observe(sticky);
    window.addEventListener("resize", applyStickyOffset);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", applyStickyOffset);
      document.documentElement.style.removeProperty("--gift-sticky-offset");
    };
  }, []);

  function persist(next: GiftCartItem[]) {
    setItems(next);
    saveGiftCart(next);
  }

  const genre = findGenre(genreId);
  const groups = genre?.groups ?? [];
  const group = findGroup(genre, groupId);
  const leaves = group?.children ?? [];
  const used = cartTotal(items);
  const cap = Math.max(0, Math.round(limit));
  const remaining = cap - used;
  const over = remaining < 0;
  const exact = !over && remaining === 0 && cap > 0;
  const pct = cap > 0 ? Math.min(120, (used / cap) * 100) : used > 0 ? 120 : 0;
  const barWidth = `${Math.min(100, pct)}%`;

  const cartOffers = useMemo(() => uniquePinpoints(items), [items]);

  const activeOffer = useMemo(() => {
    if (!groupId) return cartOffers[cartOffers.length - 1];
    const matched = items.find(
      (item) => item.genreId === genreId && item.groupId === groupId && item.leafId === leafId,
    );
    const amount =
      pickerAmount && pickerAmount > 0
        ? pickerAmount
        : matched?.amount ?? cartOffers[cartOffers.length - 1]?.amount;
    if (!amount) return cartOffers[cartOffers.length - 1];
    return {
      id: "focus",
      genreId,
      groupId,
      leafId,
      amount,
      qty: 1,
    } satisfies GiftCartItem;
  }, [pickerAmount, genreId, groupId, leafId, items, cartOffers]);

  const step3Label =
    leaves.length === 0 ? "この種類で検索" : leafId ? (leaves.find((leaf) => leaf.id === leafId)?.name ?? "こだわり") : `${group?.name ?? "種類"}全般`;

  const steps: { n: PickerStep; title: string; value: string; done: boolean }[] = [
    { n: 1, title: "ジャンル", value: genre?.name ?? "未選択", done: Boolean(genreId) },
    { n: 2, title: "種類", value: group?.name ?? "未選択", done: Boolean(groupId) },
    { n: 3, title: "くわしく", value: step3Label, done: leaves.length === 0 || leafTouched },
  ];

  function stickyScrollOffset() {
    const raw = getComputedStyle(document.documentElement).getPropertyValue("--gift-sticky-offset");
    const parsed = Number.parseFloat(raw);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
    const sticky = remainStickyRef.current?.getBoundingClientRect();
    return (sticky?.height ?? 220) + 32;
  }

  function scrollToStep(n: PickerStep) {
    setPickerStep(n);
    const target = document.getElementById(`gift-step-${n}`);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - stickyScrollOffset();
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  function selectGenre(id: string) {
    const next = findGenre(id);
    setGenreId(id);
    setGroupId(next?.groups[0]?.id ?? "");
    setLeafId(null);
    setLeafTouched(false);
    setPickerStep(1);
  }

  function selectGroup(id: string) {
    setGroupId(id);
    setLeafId(null);
    setLeafTouched(false);
    setPickerStep(2);
  }

  function selectLeaf(id: string | null) {
    setLeafId(id);
    setLeafTouched(true);
    setPickerStep(3);
  }

  function addAmount(amount: number) {
    if (!groupId) return;
    setPickerAmount(amount);
    const existing = items.find(
      (item) =>
        item.genreId === genreId &&
        item.groupId === groupId &&
        item.leafId === leafId &&
        item.amount === amount,
    );
    if (existing) {
      persist(
        items.map((item) => (item.id === existing.id ? { ...item, qty: item.qty + 1 } : item)),
      );
      return;
    }
    persist([
      ...items,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        genreId,
        groupId,
        leafId,
        amount,
        qty: 1,
      },
    ]);
  }

  function changeQty(id: string, delta: number) {
    persist(
      items
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0),
    );
  }

  function removeItem(id: string) {
    persist(items.filter((item) => item.id !== id));
  }

  function focusCartItem(item: GiftCartItem) {
    setGenreId(item.genreId);
    setGroupId(item.groupId);
    setLeafId(item.leafId);
    setPickerAmount(item.amount);
    setLeafTouched(true);
    setPickerStep(3);
  }

  function handleSaveWishlist() {
    const fallback = `${new Date().getFullYear()}年の組み合わせ`;
    const saved = saveWishlist(wishName || fallback, items);
    if (!saved) {
      setWishMessage("カートが空のときは保存できません。");
      return;
    }
    setWishlists(loadWishlists());
    setWishName("");
    setWishMessage(`「${saved.name}」を保存しました。`);
  }

  function restoreWishlist(entry: GiftWishlist) {
    const restored = entry.items.map((item) => ({
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    }));
    persist(restored);
    const first = restored[0];
    if (first) focusCartItem(first);
    setWishMessage(`「${entry.name}」をカートに読み込みました。`);
  }

  const remainingHeadline = over
    ? `上限を${formatYen(Math.abs(remaining))}オーバーしています`
    : exact
      ? "ぴったり使い切りです！"
      : cap <= 0
        ? "上限が0円のため、寄付の割り振りは参考表示です。"
        : `残り${formatYen(remaining)}です！`;

  const remainingNote = over
    ? "金額を減らすか、別の組み合わせにしてください。"
    : exact
      ? "自己負担およそ2,000円で、控除上限まで使い切れています。"
      : cap <= 0
        ? ""
        : "この金額までなら、自己負担およそ2,000円で寄付できます。";

  return (
    <section data-pdf-hide className="gift-selector min-w-0 space-y-6 p-6 sm:p-8" aria-label="マイ返礼品セレクター">
      <header className="min-w-0 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="kicker">GIFT SELECTOR</p>
          <span className="rounded-full bg-cedar-600 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white">
            このサイトの主役
          </span>
        </div>
        <h3 className="mt-2 font-display text-2xl text-ink-950 sm:text-3xl">マイ返礼品セレクター</h3>
      </header>

      <div className="gift-guide px-4 py-4 sm:px-5 sm:py-5">
        <span className="gift-guide-icon" aria-hidden>
          💡
        </span>
        <p className="min-w-0 text-[15px] font-medium leading-8 text-ink-900 sm:text-base sm:leading-8">
          控除枠の残りに合わせて、お好みのジャンル・こだわり条件を選ぶだけで、各ポータルサイトの検索キーワードを自動作成します！
        </p>
      </div>

      <div ref={remainStickyRef} className="sticky top-4 z-20">
        <div className="gift-remain px-4 py-4 shadow-lg sm:px-6 sm:py-5">
          <div className="grid grid-cols-3 gap-2 sm:gap-5">
            <div className="min-w-0">
              <p className="text-[10px] tracking-wide text-ink-300 sm:text-xs">控除上限（総枠）</p>
              <p className="amount-figure mt-1 text-sm text-white sm:text-2xl">{formatYen(cap)}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] tracking-wide text-ink-300 sm:text-xs">カート合計</p>
              <p className="amount-figure mt-1 text-sm text-white sm:text-2xl">{formatYen(used)}</p>
            </div>
            <div className="min-w-0 rounded-lg bg-white/10 px-2 py-2 sm:px-4 sm:py-3">
              <p className="text-[10px] font-semibold tracking-wide text-cedar-200 sm:text-xs">
                {over ? "超過額" : "いま使える残りの枠"}
              </p>
              <p className="amount-figure gift-remain-accent mt-1 text-lg sm:text-4xl">
                {formatYen(Math.abs(remaining))}
              </p>
            </div>
          </div>
          <div
            className="mt-3 h-2 overflow-hidden rounded-sm bg-ink-800 sm:mt-5 sm:h-2.5"
            role="meter"
            aria-label="控除上限に対するカート合計"
            aria-valuemin={0}
            aria-valuemax={cap || 1}
            aria-valuenow={used}
          >
            <div
              className={`h-full rounded-sm transition-all ${over ? "bg-cedar-400" : "bg-cedar-300"}`}
              style={{ width: barWidth }}
            />
          </div>
          <p className="mt-3 text-sm font-semibold leading-6 text-white sm:mt-4 sm:text-base sm:leading-7">
            {remainingHeadline}
          </p>
          {remainingNote ? (
            <p className="mt-1 hidden text-sm leading-6 text-ink-300 sm:block">{remainingNote}</p>
          ) : null}
          <p className="mt-2 hidden text-sm font-medium leading-7 text-cedar-200 sm:block">
            この残りの枠から、下の3ステップで返礼品条件を選ぶ → 各サイトの検索ボタンが現れます。
          </p>
        </div>
      </div>

      <p className="text-center text-sm leading-7 text-ink-600">
        💡 お好みの条件を選ぶと、各ポータルサイトの検索ページに連動します
      </p>

      <div className="gift-step-rail" role="tablist" aria-label="返礼品の選び方">
        {steps.map((step) => {
          const kind = pickerStep === step.n ? "current" : step.done ? "done" : "idle";
          return (
            <button
              key={step.n}
              type="button"
              role="tab"
              aria-selected={pickerStep === step.n}
              className={stepTabClass(kind)}
              onClick={() => scrollToStep(step.n)}
            >
              <span
                className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider ${
                  pickerStep === step.n ? "bg-cedar-400 text-ink-950" : "bg-ink-900 text-white"
                }`}
              >
                STEP {step.n}
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold tracking-wide opacity-80">{step.title}</span>
                <span className="mt-0.5 block truncate text-sm font-bold">{step.value}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div id="gift-step-1" className="gift-step-anchor">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-ink-900 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white">
            STEP 1
          </span>
          <p className="text-sm font-semibold tracking-wide text-ink-800">ジャンルを選ぶ</p>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {GIFT_GENRES.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`${chipClass(genreId === g.id)} text-center font-medium`}
              onClick={() => selectGenre(g.id)}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {groups.length > 0 ? (
        <div id="gift-step-2" className="gift-step-anchor">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-ink-900 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white">
              STEP 2
            </span>
            <p className="text-sm font-semibold tracking-wide text-ink-800">種類を選ぶ</p>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {groups.map((g) => (
              <button
                key={g.id}
                type="button"
                className={chipClass(groupId === g.id)}
                onClick={() => selectGroup(g.id)}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {leaves.length > 0 ? (
        <div id="gift-step-3" className="gift-step-anchor">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-full bg-ink-900 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white">
              STEP 3
            </span>
            <p className="text-sm font-semibold tracking-wide text-ink-800">くわしく（こだわり）</p>
          </div>
          <p className="mb-3 text-xs leading-6 text-ink-500">
            未選択なら「{group?.name ?? "この種類"}」全般で検索します。押すほどキーワードが具体的になります。
          </p>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <button type="button" className={chipClass(leafId === null)} onClick={() => selectLeaf(null)}>
              {group?.name}全般
            </button>
            {leaves.map((leaf) => (
              <button
                key={leaf.id}
                type="button"
                className={chipClass(leafId === leaf.id)}
                onClick={() => selectLeaf(leaf.id)}
              >
                {leaf.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div id="gift-step-3" className="gift-step-anchor rounded-lg border border-dashed border-cedar-200 bg-white/70 px-4 py-3">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-full bg-ink-900 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white">
              STEP 3
            </span>
            <p className="text-sm font-semibold tracking-wide text-ink-800">くわしく</p>
          </div>
          <p className="text-xs leading-6 text-ink-500">この種類は細かい条件なしで検索できます。次は金額を選んでください。</p>
        </div>
      )}

      <div>
        <p className="text-sm font-semibold tracking-wide text-ink-800">
          {itemLabel({ genreId, groupId, leafId })} に加算する金額
        </p>
        <p className="mt-1 text-xs leading-6 text-ink-500">
          残りの枠 {formatYen(Math.abs(remaining))} を目安に、ワンタップでカートへ追加します。
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {GIFT_AMOUNTS.map((amount) => (
            <button
              key={amount}
              type="button"
              className={amountClass(pickerAmount === amount)}
              onClick={() => addAmount(amount)}
            >
              {formatYen(amount)}
            </button>
          ))}
        </div>
      </div>

      <div className="card-muted">
        <div className="flex items-center justify-between gap-2">
          <p className="text-base font-semibold leading-6 text-ink-900">カート</p>
          {items.length > 0 ? (
            <button
              type="button"
              className="text-xs leading-5 text-ink-500 underline-offset-2 hover:underline"
              onClick={() => persist([])}
            >
              空にする
            </button>
          ) : null}
        </div>
        {items.length === 0 ? (
          <p className="mt-1 text-xs leading-5 text-ink-500">
            金額ボタンを押すと、ここに割り振りが入り、下に検索ボタンが出ます。
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-ink-100">
            {items.map((item) => (
              <li key={item.id} className="flex min-w-0 flex-col gap-2 py-2 sm:flex-row sm:items-center">
                <button type="button" className="min-w-0 flex-1 text-left" onClick={() => focusCartItem(item)}>
                  <p className="text-sm leading-6 text-ink-800">{itemLabel(item)}</p>
                  <p className="text-xs leading-5 tabular-nums text-ink-500">
                    {formatYen(item.amount)} × {item.qty} = {formatYen(item.amount * item.qty)}
                  </p>
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="rounded-md border border-ink-200 bg-white px-2.5 py-1 text-sm leading-5"
                    onClick={() => changeQty(item.id, -1)}
                    aria-label="数量を減らす"
                  >
                    −
                  </button>
                  <span className="min-w-6 text-center text-sm tabular-nums">{item.qty}</span>
                  <button
                    type="button"
                    className="rounded-md border border-ink-200 bg-white px-2.5 py-1 text-sm leading-5"
                    onClick={() => changeQty(item.id, 1)}
                    aria-label="数量を増やす"
                  >
                    ＋
                  </button>
                  <button
                    type="button"
                    className="text-xs leading-5 text-cedar-800 underline-offset-2 hover:underline"
                    onClick={() => removeItem(item.id)}
                  >
                    削除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="min-w-0 rounded-xl border border-ink-100 bg-white p-5">
        <p className="text-base font-semibold leading-6 text-ink-900">お気に入り</p>
        <p className="mt-1 text-sm leading-6 text-ink-500">
          いまのカート内訳と合計を、名前をつけて保存できます。
        </p>
        <div className="mt-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            value={wishName}
            suppressHydrationWarning
            onChange={(event) => setWishName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSaveWishlist();
              }
            }}
            maxLength={40}
            placeholder="例: 2026年贅沢セット"
            className="min-w-0 flex-1 rounded-md border border-ink-200 bg-white px-3.5 py-2.5 text-sm leading-5 text-ink-900 outline-none placeholder:text-ink-400 focus:border-cedar-400 focus:ring-2 focus:ring-cedar-200/70"
            aria-label="お気に入りの名前"
          />
          <button
            type="button"
            disabled={items.length === 0}
            onClick={handleSaveWishlist}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            お気に入りに保存
          </button>
        </div>
        {wishMessage ? <p className="mt-2 text-xs leading-5 text-mist-800">{wishMessage}</p> : null}

        {wishlists.length === 0 ? (
          <p className="mt-3 text-xs leading-5 text-ink-500">保存した組み合わせはまだありません。</p>
        ) : (
          <ul className="mt-3 divide-y divide-ink-100">
            {wishlists.map((entry) => (
              <li key={entry.id} className="py-2.5">
                <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-6 text-ink-900">{entry.name}</p>
                    <p className="text-xs leading-5 tabular-nums text-ink-500">
                      合計 {formatYen(entry.total)} ・ {formatSavedAt(entry.savedAt)}
                    </p>
                    <ul className="mt-1 space-y-0.5 text-xs leading-5 text-ink-600">
                      {entry.items.map((item) => (
                        <li key={item.id}>
                          {itemLabel(item)} {formatYen(item.amount)} × {item.qty}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn-accent px-3 py-2 text-xs"
                      onClick={() => restoreWishlist(entry)}
                    >
                      この組み合わせを読み込む
                    </button>
                    <button
                      type="button"
                      className="btn-secondary px-3 py-2 text-xs text-cedar-800"
                      onClick={() => {
                        setWishlists(deleteWishlist(entry.id));
                        setWishMessage(`「${entry.name}」を削除しました。`);
                      }}
                    >
                      削除
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {activeOffer ? (
        <div className="space-y-4">
          <div className="gift-bridge">
            <p className="font-semibold text-ink-950">
              残りの枠 {formatYen(Math.abs(remaining))} から選んだ条件で、各ポータルを開きます。
            </p>
            <p className="text-xs leading-6 text-ink-600">
              いまの条件: {itemLabel(activeOffer)} / {formatYen(activeOffer.amount)}
            </p>
          </div>
          {cartOffers.length > 1 ? (
            <div>
              <p className="text-xs font-semibold tracking-wide text-ink-600">カートの内訳から探す</p>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {cartOffers.map((offer) => {
                  const active = pinpointKey(offer) === pinpointKey(activeOffer);
                  return (
                    <button
                      key={pinpointKey(offer)}
                      type="button"
                      className={chipClass(active)}
                      onClick={() => focusCartItem(offer)}
                    >
                      {itemLabel(offer)} {formatYen(offer.amount)}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
          <SiteLinks
            key={pinpointKey(activeOffer)}
            appear
            keyword={itemKeyword(activeOffer)}
            amount={activeOffer.amount}
            heading={pinpointHeading(activeOffer)}
          />
        </div>
      ) : (
        <p className="text-xs leading-5 text-ink-500">
          種類と金額を選ぶと、その条件に合わせた各サイトの検索ボタンがここに現れます。
        </p>
      )}
    </section>
  );
}
