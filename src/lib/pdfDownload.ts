"use client";

const PDF_FONT = "Meiryo, 'Yu Gothic', 'Hiragino Sans', sans-serif";

function cropCanvas(
  source: HTMLCanvasElement,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
): HTMLCanvasElement {
  const slice = document.createElement("canvas");
  slice.width = Math.max(1, Math.round(sw));
  slice.height = Math.max(1, Math.round(sh));
  const ctx = slice.getContext("2d");
  if (!ctx) return source;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, slice.width, slice.height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    source,
    Math.round(sx),
    Math.round(sy),
    slice.width,
    slice.height,
    0,
    0,
    slice.width,
    slice.height,
  );
  return slice;
}

function preparePdfClone(root: HTMLElement) {
  root.style.boxSizing = "border-box";
  root.style.width = "720px";
  root.style.maxWidth = "720px";
  root.style.margin = "0";
  root.style.padding = "0";
  root.style.background = "#ffffff";
  root.style.color = "#111111";
  root.style.fontFamily = PDF_FONT;
  root.style.fontSize = "13px";
  root.style.lineHeight = "1.5";
  root.style.letterSpacing = "0";
  root.style.overflow = "visible";
  root.style.display = "flex";
  root.style.flexDirection = "column";
  root.style.gap = "10px";
  root.style.boxShadow = "none";

  root.querySelectorAll("[data-pdf-hide]").forEach((node) => node.remove());
  root.querySelectorAll(".font-display").forEach((node) => node.classList.remove("font-display"));

  root.querySelectorAll("button").forEach((button) => {
    const div = document.createElement("div");
    if (button.hasAttribute("data-pdf-unit")) {
      div.setAttribute("data-pdf-unit", "");
    }
    div.textContent = button.textContent?.replace("▾", "").trim() ?? "";
    div.style.fontWeight = "700";
    div.style.fontSize = "13px";
    div.style.lineHeight = "1.5";
    div.style.color = "#111111";
    div.style.padding = "10px 4px 12px";
    div.style.marginBottom = "0";
    button.replaceWith(div);
    const next = div.nextElementSibling;
    if (next instanceof HTMLElement) {
      next.style.borderTop = "1px solid #d9cfc3";
      next.style.paddingTop = "12px";
      next.style.marginTop = "0";
    }
  });

  root.querySelectorAll("h2, h3, h4").forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    node.setAttribute("data-pdf-unit", "");
    node.style.fontWeight = "700";
    node.style.lineHeight = "1.5";
    node.style.padding = "8px 0 10px";
    node.style.margin = "0";
    node.style.borderBottom = "0";
  });

  root.querySelectorAll("*").forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    node.style.fontFamily = PDF_FONT;
    node.style.letterSpacing = "0";
    node.style.boxShadow = "none";
    node.style.overflow = "visible";
    node.style.setProperty("-webkit-print-color-adjust", "exact");
    node.style.setProperty("print-color-adjust", "exact");
  });

  root.querySelectorAll(".grid").forEach((grid) => {
    if (!(grid instanceof HTMLElement)) return;
    grid.style.display = "flex";
    grid.style.flexDirection = "column";
    grid.style.gap = "8px";
  });

  root.querySelectorAll(".kv-row").forEach((row) => {
    if (!(row instanceof HTMLElement)) return;
    row.setAttribute("data-pdf-unit", "");
    row.style.display = "flex";
    row.style.flexDirection = "row";
    row.style.justifyContent = "space-between";
    row.style.alignItems = "flex-start";
    row.style.gap = "12px";
    row.style.padding = "8px 0";
    row.style.borderBottom = "1px solid #e6e6e6";
  });

  root.querySelectorAll(".kv-value, .tabular-nums").forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    node.style.fontWeight = "700";
    node.style.color = "#111111";
    node.style.whiteSpace = "nowrap";
    node.style.lineHeight = "1.5";
  });
}

interface Unit {
  top: number;
  bottom: number;
}

function collectUnits(root: HTMLElement): Unit[] {
  const rootRect = root.getBoundingClientRect();
  const nodes = Array.from(
    root.querySelectorAll<HTMLElement>("h2, h3, h4, [data-pdf-unit], [data-pdf-block]"),
  );
  const leaves = nodes.filter(
    (el) => !nodes.some((other) => other !== el && el.contains(other)),
  );

  const units = leaves
    .map((el) => {
      const r = el.getBoundingClientRect();
      return {
        top: r.top - rootRect.top,
        bottom: r.bottom - rootRect.top,
      };
    })
    .filter((u) => u.bottom - u.top > 1)
    .sort((a, b) => a.top - b.top);

  const merged: Unit[] = [];
  for (const unit of units) {
    const last = merged[merged.length - 1];
    if (last && unit.top < last.bottom) {
      last.bottom = Math.max(last.bottom, unit.bottom);
    } else {
      merged.push({ ...unit });
    }
  }
  return merged;
}

function pageRanges(units: Unit[], totalHeight: number, pagePx: number): Array<{ start: number; end: number }> {
  if (units.length === 0) {
    const ranges = [];
    for (let y = 0; y < totalHeight; y += pagePx) {
      ranges.push({ start: y, end: Math.min(totalHeight, y + pagePx) });
    }
    return ranges;
  }

  const ranges: Array<{ start: number; end: number }> = [];
  let start = 0;

  const flush = (end: number) => {
    const safeEnd = Math.min(totalHeight, Math.max(end, start + 1));
    ranges.push({ start, end: safeEnd });
    start = safeEnd;
  };

  for (const unit of units) {
    const height = unit.bottom - unit.top;
    if (height > pagePx) {
      if (unit.top > start) flush(unit.top);
      let y = unit.top;
      while (y < unit.bottom) {
        flush(Math.min(unit.bottom, y + pagePx));
        y = start;
      }
      continue;
    }
    if (unit.bottom - start > pagePx && unit.top > start) {
      flush(unit.top);
    }
  }

  if (start < totalHeight - 0.5) {
    flush(totalHeight);
  }
  return ranges;
}

export async function downloadElementAsPdf(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const html2canvasModule = await import("html2canvas");
  const html2canvas = html2canvasModule.default;
  const { jsPDF } = await import("jspdf");

  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.left = "0";
  host.style.top = "0";
  host.style.width = "720px";
  host.style.background = "#ffffff";
  host.style.zIndex = "2147483646";
  host.style.pointerEvents = "none";

  const clone = element.cloneNode(true) as HTMLElement;
  preparePdfClone(clone);
  host.appendChild(clone);
  document.body.appendChild(host);

  await new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve()));
  });

  try {
    const width = 720;
    const cssHeight = Math.max(clone.scrollHeight, clone.offsetHeight, 1);

    const canvas = await html2canvas(clone, {
      scale: 2.5,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      foreignObjectRendering: false,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      width,
      height: cssHeight,
      windowWidth: width,
      windowHeight: cssHeight,
    });

    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 8;
    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - margin * 2;
    const scale = canvas.height / cssHeight;
    const pagePx = usableHeight * (canvas.width / usableWidth);

    const units = collectUnits(clone).map((u) => ({
      top: u.top * scale,
      bottom: u.bottom * scale,
    }));
    const ranges = pageRanges(units, canvas.height, pagePx);

    ranges.forEach((range, index) => {
      const slicePx = Math.max(1, range.end - range.start);
      const destHmm = (slicePx / canvas.width) * usableWidth;
      const slice = cropCanvas(canvas, 0, range.start, canvas.width, slicePx);
      if (index > 0) pdf.addPage();
      pdf.addImage(slice.toDataURL("image/png"), "PNG", margin, margin, usableWidth, destHmm);
    });

    pdf.save(filename);
  } finally {
    host.remove();
  }
}
