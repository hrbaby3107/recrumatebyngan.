import { useEffect, useRef, useState, type DragEvent } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  RefreshCw,
  Upload,
  X,
} from "lucide-react";
import type { CvFile } from "../../types";
import { fileExtension, formatBytes } from "../../lib/files";

interface Props {
  value: CvFile | null;
  onChange: (file: CvFile | null) => void;
  /** Lets the parent disable its submit button while a file is being read. */
  onBusyChange?: (busy: boolean) => void;
  /** Allowed extensions, e.g. [".pdf", ".doc", ".docx"] */
  accept?: string[];
  maxSizeMB?: number;
  prompt?: string;
}

interface Processing {
  name: string;
  size: number;
  progress: number;
}

const MIME_BY_EXT: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  txt: "text/plain",
};

export default function FileUploader({
  value,
  onChange,
  onBusyChange,
  accept = [".pdf", ".doc", ".docx"],
  maxSizeMB = 10,
  prompt = "Click to upload or drag & drop",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const readerRef = useRef<FileReader | null>(null);
  const [processing, setProcessing] = useState<Processing | null>(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  useEffect(
    () => () => {
      readerRef.current?.abort();
    },
    []
  );

  const setBusy = (busy: boolean) => onBusyChange?.(busy);

  const fail = (msg: string) => {
    setProcessing(null);
    setError(msg);
    setBusy(false);
  };

  const handleFile = (file: File) => {
    setError("");
    const ext = fileExtension(file.name);
    if (!accept.includes(`.${ext}`)) {
      setError(`Unsupported file type. Please upload ${accept.join(", ")}.`);
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(
        `File is too large (${formatBytes(file.size)}). Maximum size is ${maxSizeMB} MB.`
      );
      return;
    }
    if (file.size === 0) {
      setError("This file is empty.");
      return;
    }

    setBusy(true);
    setProcessing({ name: file.name, size: file.size, progress: 0 });

    const reader = new FileReader();
    readerRef.current = reader;

    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        setProcessing({
          name: file.name,
          size: file.size,
          progress: Math.min(99, Math.round((e.loaded / e.total) * 100)),
        });
      }
    };
    reader.onerror = () => fail("Couldn't read this file. Please try again.");
    reader.onabort = () => setBusy(false);
    reader.onload = () => {
      const buf = reader.result as ArrayBuffer;
      if (ext === "pdf") {
        const head = String.fromCharCode(...new Uint8Array(buf.slice(0, 5)));
        if (head !== "%PDF-") {
          fail("This doesn't look like a valid PDF file.");
          return;
        }
      }
      if (value) URL.revokeObjectURL(value.url);
      onChange({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type || MIME_BY_EXT[ext] || "application/octet-stream",
        size: file.size,
      });
      setProcessing(null);
      setBusy(false);
    };
    reader.readAsArrayBuffer(file);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const remove = () => {
    if (value) URL.revokeObjectURL(value.url);
    onChange(null);
    setError("");
  };

  const input = (
    <input
      ref={inputRef}
      type="file"
      accept={accept.join(",")}
      className="hidden"
      onChange={(e) => {
        const f = e.target.files?.[0];
        if (f) handleFile(f);
        e.target.value = ""; // allow picking the same file again
      }}
    />
  );

  // 1) Reading the file — spinner + progress bar
  if (processing) {
    return (
      <div
        className="rounded-xl border border-brand-200 bg-brand-50/60 p-4 dark:border-brand-900/40 dark:bg-brand-900/10"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 shrink-0 animate-spin text-brand-600" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
              Processing {processing.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatBytes(processing.size)} · {processing.progress}%
            </p>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-brand-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-brand-600 transition-[width] duration-200 ease-out"
            style={{ width: `${processing.progress}%` }}
          />
        </div>
      </div>
    );
  }

  // 2) File ready
  if (value) {
    return (
      <div>
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 dark:border-emerald-900/40 dark:bg-emerald-900/10">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-slate-800">
            <FileText className="h-5 w-5 text-brand-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 truncate text-sm font-medium text-slate-800 dark:text-slate-100">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span className="truncate">{value.name}</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatBytes(value.size)} · Ready to submit
            </p>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white dark:hover:bg-slate-800"
            title="Replace file"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={remove}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-red-600 dark:hover:bg-slate-800"
            title="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {error && <ErrorLine msg={error} />}
        {input}
      </div>
    );
  }

  // 3) Empty — drop zone
  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed px-4 py-6 text-center text-sm transition ${
          dragging
            ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/20"
            : "border-slate-300 bg-slate-50 text-slate-500 hover:border-brand-400 hover:bg-brand-50/50 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:border-brand-600"
        }`}
      >
        <Upload className="h-5 w-5" />
        <span className="font-medium">{prompt}</span>
        <span className="text-xs text-slate-400">
          {accept.map((a) => a.slice(1).toUpperCase()).join(", ")} · up to {maxSizeMB} MB
        </span>
      </div>
      {error && <ErrorLine msg={error} />}
      {input}
    </div>
  );
}

function ErrorLine({ msg }: { msg: string }) {
  return (
    <p className="mt-2 flex items-start gap-1.5 text-xs font-medium text-red-600 dark:text-red-400">
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {msg}
    </p>
  );
}
