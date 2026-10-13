export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function fileExtension(name: string): string {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

export function isPdfName(name: string, type?: string): boolean {
  return type === "application/pdf" || fileExtension(name) === "pdf";
}

export function isImageName(name: string, type?: string): boolean {
  return (
    (type ?? "").startsWith("image/") ||
    ["png", "jpg", "jpeg", "webp", "gif"].includes(fileExtension(name))
  );
}

export function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
