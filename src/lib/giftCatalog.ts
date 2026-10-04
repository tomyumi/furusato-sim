import { wrapAffiliateUrl } from "@/lib/affiliates";

export const GIFT_AMOUNTS = [1000, 3000, 5000, 10000, 15000, 20000, 30000, 50000] as const;

export interface GiftLeaf {
  id: string;
  name: string;
  keyword: string;
}

export interface GiftGroup {
  id: string;
  name: string;
  keyword: string;
  children?: GiftLeaf[];
}

export interface GiftGenre {
  id: string;
  name: string;
  keyword: string;
  searchNoun: string;
  groups: GiftGroup[];
}

export const GIFT_GENRES: GiftGenre[] = [
  {
    id: "meat",
    name: "お肉",
    keyword: "肉",
    searchNoun: "肉返礼品",
    groups: [
      {
        id: "beef",
        name: "牛肉",
        keyword: "牛肉",
        children: [
          { id: "wagyu", name: "ブランド牛", keyword: "ブランド牛" },
          { id: "beef-cut", name: "切り落とし", keyword: "牛肉 切り落とし" },
          { id: "steak", name: "ステーキ", keyword: "ステーキ 牛肉" },
          { id: "yakiniku", name: "焼肉", keyword: "焼肉 牛肉" },
        ],
      },
      {
        id: "pork",
        name: "豚肉",
        keyword: "豚肉",
        children: [
          { id: "pork-cut", name: "切り落とし", keyword: "豚肉 切り落とし" },
          { id: "shabu", name: "しゃぶしゃぶ", keyword: "豚肉 しゃぶしゃぶ" },
          { id: "block", name: "塊肉", keyword: "豚肉 塊" },
          { id: "pork-roast", name: "ロース", keyword: "豚ロース" },
        ],
      },
      {
        id: "chicken",
        name: "鶏肉",
        keyword: "鶏肉",
        children: [
          { id: "thigh", name: "もも肉", keyword: "鶏もも" },
          { id: "breast", name: "むね肉", keyword: "鶏むね" },
          { id: "wing", name: "手羽", keyword: "手羽" },
        ],
      },
      {
        id: "other-meat",
        name: "その他のお肉",
        keyword: "肉",
        children: [
          { id: "lamb", name: "羊肉", keyword: "羊肉" },
          { id: "horse", name: "馬肉", keyword: "馬肉" },
          { id: "processed", name: "ハム・ソーセージ", keyword: "ソーセージ" },
        ],
      },
    ],
  },
  {
    id: "seafood",
    name: "魚介類",
    keyword: "魚介",
    searchNoun: "魚介返礼品",
    groups: [
      {
        id: "fish",
        name: "魚",
        keyword: "魚",
        children: [
          { id: "tuna", name: "マグロ", keyword: "マグロ" },
          { id: "salmon", name: "サーモン", keyword: "サーモン" },
          { id: "himono", name: "干物", keyword: "干物" },
          { id: "buri", name: "ぶり・かんぱち", keyword: "ぶり" },
        ],
      },
      {
        id: "shell",
        name: "貝",
        keyword: "貝",
        children: [
          { id: "hotate", name: "ホタテ", keyword: "ホタテ" },
          { id: "sazae", name: "サザエ", keyword: "サザエ" },
          { id: "oyster", name: "牡蠣", keyword: "牡蠣" },
        ],
      },
      {
        id: "shrimp-crab",
        name: "エビ・カニ",
        keyword: "カニ",
        children: [
          { id: "crab", name: "カニ", keyword: "カニ" },
          { id: "shrimp", name: "エビ", keyword: "エビ" },
        ],
      },
      {
        id: "roe",
        name: "いくら・ウニ・魚卵",
        keyword: "いくら",
        children: [
          { id: "ikura", name: "いくら", keyword: "いくら" },
          { id: "uni", name: "ウニ", keyword: "ウニ" },
          { id: "mentaiko", name: "明太子", keyword: "明太子" },
        ],
      },
    ],
  },
  {
    id: "produce",
    name: "野菜・果物",
    keyword: "野菜",
    searchNoun: "野菜・果物",
    groups: [
      {
        id: "veg",
        name: "野菜",
        keyword: "野菜",
        children: [
          { id: "tomato", name: "トマト", keyword: "トマト" },
          { id: "onion", name: "玉ねぎ", keyword: "玉ねぎ" },
          { id: "potato", name: "じゃがいも", keyword: "じゃがいも" },
          { id: "corn", name: "とうもろこし", keyword: "とうもろこし" },
          { id: "mushroom", name: "きのこ", keyword: "きのこ" },
        ],
      },
      {
        id: "fruit",
        name: "果物",
        keyword: "果物",
        children: [
          { id: "mikan", name: "みかん", keyword: "みかん" },
          { id: "strawberry", name: "いちご", keyword: "いちご" },
          { id: "shine", name: "シャインマスカット", keyword: "シャインマスカット" },
          { id: "peach", name: "桃", keyword: "桃" },
          { id: "apple", name: "りんご", keyword: "りんご" },
        ],
      },
    ],
  },
  {
    id: "staple",
    name: "お米・パン・麺類",
    keyword: "お米",
    searchNoun: "米・麺",
    groups: [
      {
        id: "rice",
        name: "お米",
        keyword: "お米",
        children: [
          { id: "musenmai", name: "無洗米", keyword: "無洗米" },
          { id: "brand-rice", name: "ブランド米", keyword: "ブランド米" },
          { id: "genmai", name: "玄米", keyword: "玄米" },
        ],
      },
      {
        id: "bread",
        name: "パン",
        keyword: "パン",
        children: [
          { id: "plain-bread", name: "食パン", keyword: "食パン" },
          { id: "sweet-bread", name: "菓子パン", keyword: "菓子パン" },
        ],
      },
      {
        id: "noodles",
        name: "麺類",
        keyword: "麺",
        children: [
          { id: "udon", name: "うどん", keyword: "うどん" },
          { id: "soba", name: "そば", keyword: "そば" },
          { id: "ramen", name: "ラーメン", keyword: "ラーメン" },
        ],
      },
    ],
  },
  {
    id: "sweets-drink",
    name: "スイーツ・飲料",
    keyword: "スイーツ",
    searchNoun: "スイーツ・飲料",
    groups: [
      {
        id: "sweets",
        name: "スイーツ",
        keyword: "スイーツ",
        children: [
          { id: "cake", name: "ケーキ", keyword: "ケーキ" },
          { id: "ice", name: "アイス", keyword: "アイス" },
          { id: "pudding", name: "プリン", keyword: "プリン" },
        ],
      },
      {
        id: "alcohol",
        name: "お酒",
        keyword: "日本酒",
        children: [
          { id: "beer", name: "ビール", keyword: "ビール" },
          { id: "sake", name: "日本酒", keyword: "日本酒" },
          { id: "wine", name: "ワイン", keyword: "ワイン" },
          { id: "shochu", name: "焼酎", keyword: "焼酎" },
        ],
      },
      {
        id: "soft-drink",
        name: "ジュース・お茶",
        keyword: "ジュース",
        children: [
          { id: "juice", name: "ジュース", keyword: "ジュース" },
          { id: "tea", name: "お茶", keyword: "お茶" },
        ],
      },
    ],
  },
  {
    id: "daily-home",
    name: "日用品・家電",
    keyword: "日用品",
    searchNoun: "日用品",
    groups: [
      {
        id: "paper",
        name: "ペーパー類",
        keyword: "ティッシュ",
        children: [
          { id: "toilet", name: "トイレットペーパー", keyword: "トイレットペーパー" },
          { id: "tissue", name: "ティッシュ", keyword: "ティッシュ" },
        ],
      },
      {
        id: "clean",
        name: "洗剤・タオル",
        keyword: "洗剤",
        children: [
          { id: "detergent", name: "洗剤", keyword: "洗剤" },
          { id: "towel", name: "タオル", keyword: "タオル" },
        ],
      },
      {
        id: "appliance",
        name: "家電製品",
        keyword: "家電",
        children: [
          { id: "rice-cooker", name: "炊飯器", keyword: "炊飯器" },
          { id: "vacuum", name: "掃除機", keyword: "掃除機" },
          { id: "air", name: "空気清浄機", keyword: "空気清浄機" },
        ],
      },
    ],
  },
];

export interface GiftCartItem {
  id: string;
  genreId: string;
  groupId: string;
  leafId: string | null;
  amount: number;
  qty: number;
}

export function findGenre(id: string) {
  return GIFT_GENRES.find((g) => g.id === id);
}

export function findGroup(genre: GiftGenre | undefined, groupId: string | null) {
  if (!genre || !groupId) return undefined;
  return genre.groups.find((g) => g.id === groupId);
}

export function findLeaf(group: GiftGroup | undefined, leafId: string | null) {
  if (!group || !leafId || !group.children) return undefined;
  return group.children.find((c) => c.id === leafId);
}

export function itemLabel(item: Pick<GiftCartItem, "genreId" | "groupId" | "leafId">): string {
  const genre = findGenre(item.genreId);
  const group = findGroup(genre, item.groupId);
  if (!genre || !group) return "返礼品";
  const leaf = findLeaf(group, item.leafId);
  if (leaf) return `${genre.name} / ${group.name} / ${leaf.name}`;
  return `${genre.name} / ${group.name}`;
}

export function itemKeyword(item: Pick<GiftCartItem, "genreId" | "groupId" | "leafId">): string {
  const genre = findGenre(item.genreId);
  const group = findGroup(genre, item.groupId);
  if (!genre) return "ふるさと納税";
  const leaf = findLeaf(group, item.leafId);
  return leaf?.keyword ?? group?.keyword ?? genre.keyword;
}

export function itemSearchNoun(item: Pick<GiftCartItem, "genreId" | "groupId" | "leafId">): string {
  const genre = findGenre(item.genreId);
  const group = findGroup(genre, item.groupId);
  if (!genre) return "返礼品";
  const leaf = findLeaf(group, item.leafId);
  return leaf?.name ?? group?.name ?? genre.searchNoun;
}

export function itemSearchQuery(item: Pick<GiftCartItem, "genreId" | "groupId" | "leafId" | "amount">): string {
  const keyword = itemKeyword(item);
  if (item.amount && item.amount > 0) {
    return `${keyword} ${item.amount}円`;
  }
  return keyword;
}

export function pinpointHeading(item: Pick<GiftCartItem, "genreId" | "groupId" | "leafId" | "amount">): string {
  return `${item.amount.toLocaleString("ja-JP")}円前後の${itemSearchNoun(item)}を各サイトで探す`;
}

export function pinpointKey(item: Pick<GiftCartItem, "genreId" | "groupId" | "leafId" | "amount">): string {
  return `${item.genreId}|${item.groupId}|${item.leafId ?? ""}|${item.amount}`;
}

export function uniquePinpoints(items: GiftCartItem[]): GiftCartItem[] {
  const seen = new Map<string, GiftCartItem>();
  for (const item of items) {
    const key = pinpointKey(item);
    if (!seen.has(key)) seen.set(key, item);
  }
  return [...seen.values()];
}

export function cartTotal(items: GiftCartItem[]): number {
  return items.reduce((sum, item) => sum + item.amount * item.qty, 0);
}

function amountRange(amount: number) {
  const pad = Math.max(500, Math.round(amount * 0.15));
  return {
    min: Math.max(500, amount - pad),
    max: amount + pad,
  };
}

export interface PortalLink {
  name: string;
  href: string;
  query: string;
}

export function buildPortalLinks(keyword?: string, amount?: number): PortalLink[] {
  const base = (keyword && keyword.trim()) || "ふるさと納税";
  const query = amount && amount > 0 ? `${base} ${amount}円` : base;
  const encoded = encodeURIComponent(query);
  const rakutenQ = encodeURIComponent(`ふるさと納税 ${query}`);
  const range = amount && amount > 0 ? amountRange(amount) : undefined;
  const searchParts = { query, amount, min: range?.min, max: range?.max };

  const rakuten = range
    ? `https://search.rakuten.co.jp/search/mall/${rakutenQ}/?min=${range.min}&max=${range.max}`
    : `https://search.rakuten.co.jp/search/mall/${rakutenQ}/`;

  const satofull = range
    ? `https://www.satofull.jp/products/list.php?q=${encoded}&price_from=${range.min}&price_to=${range.max}`
    : `https://www.satofull.jp/products/list.php?q=${encoded}`;

  const choice = range
    ? `https://www.furusato-tax.jp/search?q=${encoded}&target_amount_from=${range.min}&target_amount_to=${range.max}`
    : `https://www.furusato-tax.jp/search?q=${encoded}`;

  const furanavi = range
    ? `https://furunavi.jp/Product/Search?keyword=${encoded}&amountfrom=${range.min}&amountto=${range.max}`
    : `https://furunavi.jp/Product/Search?keyword=${encoded}`;

  return [
    { id: "rakuten" as const, name: "楽天ふるさと納税", href: rakuten, query: `ふるさと納税 ${query}` },
    { id: "satofull" as const, name: "さとふる", href: satofull, query },
    { id: "choice" as const, name: "ふるさとチョイス", href: choice, query },
    { id: "furanavi" as const, name: "ふるなび", href: furanavi, query },
  ].map((site) => ({
    name: site.name,
    query: site.query,
    href: wrapAffiliateUrl(site.id, site.href, searchParts),
  }));
}

export function isValidCartItem(item: GiftCartItem): boolean {
  const genre = findGenre(item.genreId);
  const group = findGroup(genre, item.groupId);
  if (!genre || !group) return false;
  if (item.leafId && !findLeaf(group, item.leafId)) return false;
  if (!Number.isFinite(item.amount) || item.amount <= 0) return false;
  if (!Number.isFinite(item.qty) || item.qty <= 0) return false;
  return typeof item.id === "string" && item.id.length > 0;
}
