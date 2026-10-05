"use client";

import { FormEvent, useState } from "react";
import { hasContactEmail, SITE } from "@/lib/site";
import { useClientReady } from "@/lib/useClientReady";

const fieldClass =
  "mt-2 w-full rounded-md border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-950 outline-none transition focus:border-cedar-400 focus:ring-2 focus:ring-cedar-200/70";

export function ContactForm() {
  const mounted = useClientReady();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setReceipt("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();
    if (!trimmedName || !trimmedMessage) {
      setError("お名前（ニックネーム可）とお問い合わせ内容を入力してください。");
      return;
    }

    const id = `FL-${Date.now().toString(36).toUpperCase()}`;
    const body = [
      `受付番号: ${id}`,
      `お名前: ${trimmedName}`,
      trimmedEmail ? `メールアドレス: ${trimmedEmail}` : "メールアドレス: （未記入）",
      "",
      trimmedMessage,
    ].join("\n");

    if (hasContactEmail()) {
      const subject = encodeURIComponent(`【${SITE.name}】お問い合わせ ${id}`);
      window.location.href = `mailto:${SITE.contactEmail}?subject=${subject}&body=${encodeURIComponent(body)}`;
    }

    void navigator.clipboard?.writeText(body).catch(() => undefined);
    setReceipt(id);
  }

  if (!mounted) {
    return (
      <div
        className="card-muted space-y-5"
        aria-busy="true"
        aria-label="お問い合わせフォーム"
        suppressHydrationWarning
      >
        <p className="section-copy" suppressHydrationWarning>
          読み込み中…
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card-muted space-y-5">
      <div>
        <label htmlFor="contact-name" className="field-label block">
          お名前（ニックネーム可）
        </label>
        <input
          id="contact-name"
          name="name"
          autoComplete="nickname"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="field-label block">
          返信先メールアドレス（任意）
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="field-label block">
          お問い合わせ内容
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${fieldClass} resize-y`}
        />
      </div>
      {error ? (
        <p className="rounded-md border border-cedar-300 bg-cedar-50 px-3.5 py-3 text-sm font-medium text-cedar-900">
          {error}
        </p>
      ) : null}
      {receipt ? (
        <p className="rounded-md border border-mist-200 bg-mist-50 px-3.5 py-3 text-sm leading-7 text-mist-950">
          受け付けました（受付番号 {receipt}）。内容の控えをクリップボードへコピーしています。
          {hasContactEmail()
            ? " メールアプリが開いた場合は、送信を完了してください。"
            : " 運営事務局はこのフォームを正規窓口として確認します。"}
        </p>
      ) : null}
      <button type="submit" className="btn-accent">
        送信する
      </button>
    </form>
  );
}
