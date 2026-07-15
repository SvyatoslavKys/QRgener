import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { GENERATE_DATE } from "./constants";
import { appendHistory } from "./historyStorage";
import { Icon } from "./Icon";

const MAX_LENGTH = 1200;

const QrCodeGener = () => {
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [shareStatus, setShareStatus] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanValue = value.trim();

    if (!cleanValue) {
      setError("Enter a link or text to create your QR code.");
      return;
    }

    setResult(cleanValue);
    setError("");
    appendHistory(GENERATE_DATE, cleanValue);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
    setError("");
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const createSvgBlob = () => {
    const source = document.getElementById("generated-qr-code");
    if (!source) return null;

    const svg = source.cloneNode(true);
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    return new Blob([new XMLSerializer().serializeToString(svg)], {
      type: "image/svg+xml;charset=utf-8",
    });
  };

  const handleDownload = () => {
    const blob = createSvgBlob();
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "qr-code.svg";
    link.click();
    URL.revokeObjectURL(url);
  };

  const createPngFile = async () => {
    const svgBlob = createSvgBlob();
    if (!svgBlob) return null;

    const url = URL.createObjectURL(svgBlob);
    const image = new Image();
    image.src = url;
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);

    const pngBlob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    return pngBlob ? new File([pngBlob], "qr-code.png", { type: "image/png" }) : null;
  };

  const handleShare = async () => {
    if (!result) return;
    setShareStatus("");

    try {
      if (!navigator.share) {
        await navigator.clipboard.writeText(result);
        setShareStatus("Sharing is unavailable here — the content was copied instead.");
        return;
      }

      const pngFile = await createPngFile();
      const shareData = {
        title: "QR Studio code",
        text: `QR code for: ${result}`,
      };

      if (pngFile && navigator.canShare?.({ files: [pngFile] })) {
        shareData.files = [pngFile];
      }

      await navigator.share(shareData);
      setShareStatus(shareData.files ? "QR image shared successfully." : "QR content shared successfully.");
    } catch (shareError) {
      if (shareError.name !== "AbortError") {
        setShareStatus("Could not open sharing. Download the QR code and attach it manually.");
      }
    }
  };

  const handlePrint = () => {
    if (result) window.print();
  };

  const handleClear = () => {
    setValue("");
    setResult("");
    setError("");
    setShareStatus("");
  };

  return (
    <div className="page-container">
      <div className="mb-8 max-w-2xl">
        <span className="eyebrow">
          <Icon name="sparkles" className="h-4 w-4" />
          QR generator
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-[-0.03em] text-slate-950 sm:text-4xl">Create your QR code</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
          Add a URL, contact detail, or message. Your code is generated instantly in this browser.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <form onSubmit={handleSubmit} className="surface-card flex flex-col p-5 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="qr-value" className="text-sm font-bold text-slate-800">
              Content
            </label>
            <span className="text-xs font-medium text-slate-400">
              {value.length}/{MAX_LENGTH}
            </span>
          </div>

          <textarea
            id="qr-value"
            className="form-field mt-3 min-h-40 resize-y"
            placeholder="Paste a link or type any text..."
            value={value}
            maxLength={MAX_LENGTH}
            onChange={handleChange}
            aria-describedby={error ? "generator-error" : "generator-hint"}
          />
          {error ? (
            <p id="generator-error" className="mt-2 text-sm font-medium text-rose-600">
              {error}
            </p>
          ) : (
            <p id="generator-hint" className="mt-2 text-xs leading-5 text-slate-400">
              Tip: include https:// for links that should open directly after scanning.
            </p>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button type="button" className="secondary-button" onClick={handleClear} disabled={!value && !result}>
              Clear
            </button>
            <button type="submit" className="primary-button">
              <Icon name="qr" />
              Generate QR code
            </button>
          </div>
        </form>

        <section className="surface-card relative min-h-[420px] overflow-hidden p-5 sm:p-7" aria-label="QR code preview">
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-indigo-100/70 blur-3xl" />
          <div className="relative flex h-full min-h-[364px] flex-col">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">Preview</p>
                <p className="mt-1 text-xs text-slate-400">High-quality SVG format</p>
              </div>
              <span className={`h-2.5 w-2.5 rounded-full ${result ? "bg-emerald-400 shadow-[0_0_0_5px_rgba(52,211,153,0.13)]" : "bg-slate-200"}`} />
            </div>

            <div className="flex flex-1 items-center justify-center py-7">
              {result ? (
                <div id="printable-qr" className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-[0_20px_45px_-25px_rgba(15,23,42,0.35)] sm:p-6">
                  <QRCodeSVG id="generated-qr-code" value={result} size={224} level="H" includeMargin />
                  <p className="print-caption hidden">Generated with QR Studio</p>
                </div>
              ) : (
                <div className="text-center">
                  <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-slate-300">
                    <Icon name="qr" className="h-11 w-11" />
                  </span>
                  <p className="mt-4 text-sm font-semibold text-slate-500">Your QR code will appear here</p>
                  <p className="mt-1 text-xs text-slate-400">Enter content and press Generate</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="secondary-button px-3" onClick={handleCopy} disabled={!result}>
                <Icon name={copied ? "check" : "copy"} />
                {copied ? "Copied" : "Copy text"}
              </button>
              <button type="button" className="secondary-button px-3" onClick={handleDownload} disabled={!result}>
                <Icon name="download" />
                Download
              </button>
              <button type="button" className="secondary-button px-3" onClick={handlePrint} disabled={!result}>
                <Icon name="print" />
                Print
              </button>
              <button type="button" className="primary-button px-3" onClick={handleShare} disabled={!result}>
                <Icon name="share" />
                Share
              </button>
            </div>
            {shareStatus && <p className="mt-3 text-center text-xs font-medium text-slate-500">{shareStatus}</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

export { QrCodeGener };
