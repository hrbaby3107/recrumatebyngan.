import { useEffect, useState } from "react";
import {
  Download,
  ExternalLink,
  FileText,
  Info,
  Loader2,
  X,
} from "lucide-react";
import type { Candidate } from "../../types";
import { formatBytes, isImageName, isPdfName } from "../../lib/files";

interface Props {
  candidate: Candidate;
  onClose: () => void;
  onDownload: () => void;
}

export default function CvPreviewPanel({ candidate, onClose, onDownload }: Props) {
  const cv = candidate.cvFile;
  const name = cv?.name ?? candidate.cvFileName ?? "CV";

  return (
    <aside
      className="fixed inset-0 z-[60] flex flex-col bg-white shadow-2xl lg:static lg:z-auto lg:h-[92vh] lg:min-w-0 lg:flex-1 lg:rounded-2xl dark:bg-slate-900"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Toolbar */}
      <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20">
          <FileText className="h-5 w-5 text-red-500" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
            {name}
          </p>
          <p className="text-xs text-slate-400">
            {cv ? `${formatBytes(cv.size)} · CV preview` : "CV preview"}
          </p>
        </div>
        {cv && (
          <a
            href={cv.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            title="Open in a new tab"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">New tab</span>
          </a>
        )}
        <button
          onClick={onDownload}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-600 px-3 text-xs font-semibold text-white hover:bg-brand-700"
          title="Download CV"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Download</span>
        </button>
        <button
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          title="Close preview"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Viewer */}
      <div className="relative min-h-0 flex-1 overflow-hidden bg-slate-100 dark:bg-slate-950 lg:rounded-b-2xl">
        {cv ? (
          <FileViewer
            url={cv.url}
            name={cv.name}
            type={cv.type}
            onDownload={onDownload}
          />
        ) : candidate.cvFileName ? (
          <SampleCv candidate={candidate} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-slate-400">
            <FileText className="h-10 w-10" />
            <p className="mt-2 text-sm">No CV uploaded</p>
          </div>
        )}
      </div>
    </aside>
  );
}

function FileViewer({
  url,
  name,
  type,
  onDownload,
}: {
  url: string;
  name: string;
  type: string;
  onDownload: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [url]);

  if (isPdfName(name, type)) {
    return (
      <>
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-500">
            <Loader2 className="h-7 w-7 animate-spin text-brand-600" />
            <p className="text-sm">Loading CV…</p>
          </div>
        )}
        <iframe
          key={url}
          src={`${url}#toolbar=1&navpanes=0&view=FitH`}
          title={`CV preview — ${name}`}
          onLoad={() => setLoaded(true)}
          className="h-full w-full border-0 bg-white"
        />
      </>
    );
  }

  if (isImageName(name, type)) {
    return (
      <div className="flex h-full items-start justify-center overflow-auto p-4">
        <img src={url} alt={name} className="max-w-full rounded shadow" />
      </div>
    );
  }

  // Word documents can't be rendered by the browser.
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-slate-900">
        <FileText className="h-8 w-8 text-brand-600" />
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
        Word documents can't be previewed in the browser
      </p>
      <p className="mt-1 max-w-xs text-xs text-slate-500 dark:text-slate-400">
        Download the file to read it. PDF CVs are previewed directly here.
      </p>
      <button
        onClick={onDownload}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
      >
        <Download className="h-4 w-4" /> Download {name}
      </button>
    </div>
  );
}

/** Demo candidates have no real file, so render their profile as a CV page. */
function SampleCv({ candidate: c }: { candidate: Candidate }) {
  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto mb-4 flex max-w-[640px] items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Sample preview built from the profile. The original file for this demo
        candidate isn't stored — CVs uploaded through the site are shown as-is.
      </div>
      <div className="mx-auto min-h-[700px] max-w-[640px] rounded bg-white p-8 text-slate-800 shadow-lg sm:p-10">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {c.fullName}
        </h1>
        <p className="mt-1 text-sm font-medium text-brand-600">
          {c.currentPosition}
          {c.yearsOfExp > 0 ? ` · ${c.yearsOfExp} years of experience` : ""}
        </p>
        <p className="mt-3 text-xs text-slate-500">
          {[c.email, c.phone, c.residence].filter(Boolean).join("  •  ")}
        </p>
        <hr className="my-5 border-slate-200" />

        {c.techStack.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Skills
            </h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {c.techStack.map((t) => (
                <span
                  key={t}
                  className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
                >
                  {t}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Details
          </h2>
          <dl className="mt-2 space-y-1.5 text-sm">
            {c.birthYear && <Row k="Born" v={String(c.birthYear)} />}
            {c.residence && <Row k="Location" v={c.residence} />}
            {c.salaryExpectation && (
              <Row k="Expected salary" v={`${c.salaryExpectation} / month`} />
            )}
            {c.salaryMin && <Row k="Minimum salary" v={`${c.salaryMin} / month`} />}
            {c.linkedinUrl && <Row k="LinkedIn" v={c.linkedinUrl} />}
          </dl>
        </section>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-3">
      <dt className="w-32 shrink-0 text-slate-400">{k}</dt>
      <dd className="min-w-0 break-words text-slate-700">{v}</dd>
    </div>
  );
}
