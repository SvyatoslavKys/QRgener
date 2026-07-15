import { useRef, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { SCAN_DATA } from "./constants";
import { appendHistory } from "./historyStorage";
import { Icon } from "./Icon";

const isWebLink = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const QrCodeScan = () => {
  const [scanResult, setScanResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [shareFeedback, setShareFeedback] = useState("");
  const lastScan = useRef("");

  const scanHandler = (results) => {
    const value = results?.[0]?.rawValue?.trim() || "";
    if (!value || value === lastScan.current) return;

    lastScan.current = value;
    setScanResult(value);
    setCopied(false);
    setShareFeedback("");
    appendHistory(SCAN_DATA, value);
  };

  const handleCopy = async () => {
    if (!scanResult) return;
    await navigator.clipboard.writeText(scanResult);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const handleShare = async () => {
    if (!scanResult) return;

    try {
      if (navigator.share) {
        const webLink = isWebLink(scanResult);
        await navigator.share({
          title: "Scanned QR code",
          text: webLink ? "Scanned with QR Studio" : scanResult,
          ...(webLink && { url: scanResult }),
        });
        setShareFeedback("Shared");
      } else {
        await navigator.clipboard.writeText(scanResult);
        setShareFeedback("Copied");
      }
      window.setTimeout(() => setShareFeedback(""), 1600);
    } catch (shareError) {
      if (shareError.name !== "AbortError") {
        await navigator.clipboard.writeText(scanResult);
        setShareFeedback("Copied");
        window.setTimeout(() => setShareFeedback(""), 1600);
      }
    }
  };

  const handleOpen = () => {
    if (!scanResult) return;

    if (isWebLink(scanResult)) {
      window.open(scanResult, "_blank", "noopener,noreferrer");
      return;
    }

    const url = URL.createObjectURL(new Blob([scanResult], { type: "text/plain;charset=utf-8" }));
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  const resetScanner = () => {
    lastScan.current = "";
    setScanResult("");
    setCopied(false);
    setShareFeedback("");
  };

  const resultIsLink = isWebLink(scanResult);

  return (
    <div className="page-container">
      <div className="mb-8 max-w-2xl">
        <span className="eyebrow">
          <Icon name="camera" className="h-4 w-4" />
          QR scanner
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-[-0.03em] text-slate-950 sm:text-4xl">Scan a QR code</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
          Allow camera access, then place the QR code inside the frame. Recognition happens automatically.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="surface-card overflow-hidden p-3 sm:p-5" aria-label="Camera scanner">
          <div className="relative aspect-square overflow-hidden rounded-[1.4rem] bg-slate-950 sm:aspect-[4/3]">
            <Scanner
              allowMultiple={false}
              scanDelay={1200}
              formats={["qr_code"]}
              constraints={{ facingMode: "environment" }}
              onScan={scanHandler}
              components={{ audio: true, finder: true }}
              styles={{
                container: { width: "100%", height: "100%" },
                video: { width: "100%", height: "100%", objectFit: "cover" },
              }}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 to-transparent px-5 pb-5 pt-14 text-center">
              <p className="text-xs font-semibold text-white/85">Keep the code steady inside the frame</p>
            </div>
          </div>
        </section>

        <section className="surface-card flex min-h-[340px] flex-col p-5 sm:p-7" aria-live="polite">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-800">Scan result</p>
              <p className="mt-1 text-xs text-slate-400">The latest detected content</p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${scanResult ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
              {scanResult ? "Detected" : "Waiting"}
            </span>
          </div>

          <div className="flex flex-1 items-center py-7">
            {scanResult ? (
              <div className="w-full rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                    <Icon name={resultIsLink ? "link" : "qr"} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-500">
                      {resultIsLink ? "Web link" : "Text content"}
                    </p>
                    <p className="mt-2 break-words text-sm font-medium leading-6 text-slate-800">{scanResult}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full text-center">
                <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 text-slate-300">
                  <Icon name="scan" className="h-9 w-9" />
                </span>
                <p className="mt-4 text-sm font-semibold text-slate-500">Ready to scan</p>
                <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-slate-400">
                  Camera access works on localhost or a secure HTTPS connection.
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="secondary-button px-3" onClick={resetScanner} disabled={!scanResult}>
              Scan again
            </button>
            <button type="button" className="secondary-button px-3" onClick={handleCopy} disabled={!scanResult}>
              <Icon name={copied ? "check" : "copy"} />
              {copied ? "Copied" : "Copy"}
            </button>
            <button type="button" className="secondary-button px-3" onClick={handleShare} disabled={!scanResult}>
              <Icon name={shareFeedback ? "check" : "share"} />
              {shareFeedback || "Share"}
            </button>
            <button type="button" className="primary-button px-3" onClick={handleOpen} disabled={!scanResult}>
              Open
              <Icon name="external" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
