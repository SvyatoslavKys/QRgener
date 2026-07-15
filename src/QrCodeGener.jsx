import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { GENERATE_DATE } from "./constants";
import { appendHistory } from "./historyStorage";
import { Icon } from "./Icon";
import { t } from "./i18n";

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
      setError(t("generator.emptyError"));
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
        setShareStatus(t("generator.shareUnavailable"));
        return;
      }

      const pngFile = await createPngFile();
      const shareData = {
        title: t("generator.shareTitle"),
        text: t("generator.shareText", { value: result }),
      };

      if (pngFile && navigator.canShare?.({ files: [pngFile] })) {
        shareData.files = [pngFile];
      }

      await navigator.share(shareData);
      setShareStatus(shareData.files ? t("generator.imageShared") : t("generator.contentShared"));
    } catch (shareError) {
      if (shareError.name !== "AbortError") {
        setShareStatus(t("generator.shareError"));
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
          {t("generator.eyebrow")}
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-[-0.03em] text-slate-950 sm:text-4xl">{t("generator.title")}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
          {t("generator.description")}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <form onSubmit={handleSubmit} className="surface-card flex flex-col p-5 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="qr-value" className="text-sm font-bold text-slate-800">
              {t("generator.content")}
            </label>
            <span className="text-xs font-medium text-slate-400">
              {value.length}/{MAX_LENGTH}
            </span>
          </div>

          <textarea
            id="qr-value"
            className="form-field mt-3 min-h-40 resize-y"
            placeholder={t("generator.placeholder")}
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
              {t("generator.hint")}
            </p>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button type="button" className="secondary-button" onClick={handleClear} disabled={!value && !result}>
              {t("generator.clear")}
            </button>
            <button type="submit" className="primary-button">
              <Icon name="qr" />
              {t("generator.generate")}
            </button>
          </div>
        </form>

        <section className="surface-card relative min-h-[420px] overflow-hidden p-5 sm:p-7" aria-label={t("generator.previewLabel")}>
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-indigo-100/70 blur-3xl" />
          <div className="relative flex h-full min-h-[364px] flex-col">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">{t("generator.preview")}</p>
                <p className="mt-1 text-xs text-slate-400">{t("generator.previewFormat")}</p>
              </div>
              <span className={`h-2.5 w-2.5 rounded-full ${result ? "bg-emerald-400 shadow-[0_0_0_5px_rgba(52,211,153,0.13)]" : "bg-slate-200"}`} />
            </div>

            <div className="flex flex-1 items-center justify-center py-7">
              {result ? (
                <div id="printable-qr" className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-[0_20px_45px_-25px_rgba(15,23,42,0.35)] sm:p-6">
                  <QRCodeSVG id="generated-qr-code" value={result} size={224} level="H" includeMargin />
                  <p className="print-caption hidden">{t("generator.printCaption")}</p>
                </div>
              ) : (
                <div className="text-center">
                  <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-slate-300">
                    <Icon name="qr" className="h-11 w-11" />
                  </span>
                  <p className="mt-4 text-sm font-semibold text-slate-500">{t("generator.emptyPreview")}</p>
                  <p className="mt-1 text-xs text-slate-400">{t("generator.emptyPreviewHint")}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="secondary-button px-3" onClick={handleCopy} disabled={!result}>
                <Icon name={copied ? "check" : "copy"} />
                {copied ? t("generator.copied") : t("generator.copyText")}
              </button>
              <button type="button" className="secondary-button px-3" onClick={handleDownload} disabled={!result}>
                <Icon name="download" />
                {t("generator.download")}
              </button>
              <button type="button" className="secondary-button px-3" onClick={handlePrint} disabled={!result}>
                <Icon name="print" />
                {t("generator.print")}
              </button>
              <button type="button" className="primary-button px-3" onClick={handleShare} disabled={!result}>
                <Icon name="share" />
                {t("generator.share")}
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
