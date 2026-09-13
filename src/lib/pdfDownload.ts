export async function downloadElementAsPdf(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  const html2canvasModule = await import("html2canvas");
  const html2canvas = html2canvasModule.default;
  const { jsPDF } = await import("jspdf");

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const imageData = canvas.toDataURL("image/jpeg", 0.92);
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 8;
  const usableWidth = pageWidth - margin * 2;
  const usableHeight = pageHeight - margin * 2;
  const imgHeight = (canvas.height * usableWidth) / canvas.width;

  let heightLeft = imgHeight;
  let offsetY = margin;

  pdf.addImage(imageData, "JPEG", margin, offsetY, usableWidth, imgHeight);
  heightLeft -= usableHeight;

  while (heightLeft > 0) {
    offsetY = margin - (imgHeight - heightLeft);
    pdf.addPage();
    pdf.addImage(imageData, "JPEG", margin, offsetY, usableWidth, imgHeight);
    heightLeft -= usableHeight;
  }

  pdf.save(filename);
}
