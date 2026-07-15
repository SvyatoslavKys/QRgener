import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { GENERATE_DATE, SCAN_DATA } from "./constants";
import { clearHistory, readHistory, removeHistoryEntry } from "./historyStorage";
import { Icon } from "./Icon";
import { currentLocale, t } from "./i18n";

const isWebLink = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const formatDate = (date) => {
  if (!date) return t("history.savedEarlier");
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return t("history.savedEarlier");

  return new Intl.DateTimeFormat(currentLocale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
};

export const History = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") === "scanned" ? "scanned" : "generated";
  const storageKey = activeTab === "scanned" ? SCAN_DATA : GENERATE_DATE;
  const [entries, setEntries] = useState(() => readHistory(storageKey));
  const [copiedId, setCopiedId] = useState("");
  const [sharedId, setSharedId] = useState("");

  useEffect(() => {
    setEntries(readHistory(storageKey));
    setCopiedId("");
    setSharedId("");
  }, [storageKey]);

  const generatedCount = readHistory(GENERATE_DATE).length;
  const scannedCount = readHistory(SCAN_DATA).length;

  const changeTab = (tab) => {
    setSearchParams({ tab });
  };

  const handleCopy = async (entry) => {
    await navigator.clipboard.writeText(entry.value);
    setCopiedId(entry.id);
    window.setTimeout(() => setCopiedId(""), 1600);
  };

  const handleShare = async (entry) => {
    try {
      if (navigator.share) {
        const webLink = isWebLink(entry.value);
        await navigator.share({
          title: t("history.shareTitle"),
          text: webLink ? t("history.shareLinkText") : entry.value,
          ...(webLink && { url: entry.value }),
        });
        setSharedId(entry.id);
      } else {
        await navigator.clipboard.writeText(entry.value);
        setCopiedId(entry.id);
      }
      window.setTimeout(() => setSharedId(""), 1600);
    } catch (shareError) {
      if (shareError.name !== "AbortError") {
        await navigator.clipboard.writeText(entry.value);
        setCopiedId(entry.id);
      }
    }
  };

  const handleOpen = (entry) => {
    if (isWebLink(entry.value)) {
      window.open(entry.value, "_blank", "noopener,noreferrer");
      return;
    }

    const url = URL.createObjectURL(new Blob([entry.value], { type: "text/plain;charset=utf-8" }));
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  const handleDelete = (id) => {
    removeHistoryEntry(storageKey, id);
    setEntries(readHistory(storageKey));
  };

  const handleClear = () => {
    const confirmationKey = activeTab === "scanned"
      ? "history.confirmClearScanned"
      : "history.confirmClearGenerated";
    if (!window.confirm(t(confirmationKey))) return;
    clearHistory(storageKey);
    setEntries([]);
  };

  const emptyAction = activeTab === "scanned" ? "/scan" : "/generate";
  const emptyLabel = activeTab === "scanned" ? t("history.scanFirst") : t("history.createFirst");

  return (
    <div className="page-container">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <span className="eyebrow">
            <Icon name="history" className="h-4 w-4" />
            {t("history.eyebrow")}
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-[-0.03em] text-slate-950 sm:text-4xl">{t("history.title")}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
            {t("history.description")}
          </p>
        </div>
        {entries.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-2 self-start rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
          >
            <Icon name="trash" className="h-4 w-4" />
            {t("history.clearAll")}
          </button>
        )}
      </div>

      <div className="mt-8 inline-grid w-full grid-cols-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm sm:w-auto sm:min-w-[360px]">
        <button
          type="button"
          onClick={() => changeTab("generated")}
          className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
            activeTab === "generated" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Icon name="qr" className="h-[18px] w-[18px]" />
          {t("history.generated")}
          <span className={`rounded-full px-2 py-0.5 text-[10px] ${activeTab === "generated" ? "bg-white/15" : "bg-slate-100"}`}>
            {generatedCount}
          </span>
        </button>
        <button
          type="button"
          onClick={() => changeTab("scanned")}
          className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
            activeTab === "scanned" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Icon name="scan" className="h-[18px] w-[18px]" />
          {t("history.scanned")}
          <span className={`rounded-full px-2 py-0.5 text-[10px] ${activeTab === "scanned" ? "bg-white/15" : "bg-slate-100"}`}>
            {scannedCount}
          </span>
        </button>
      </div>

      {entries.length > 0 ? (
        <div className="mt-6 grid gap-3">
          {entries.map((entry) => {
            const webLink = isWebLink(entry.value);
            return (
              <article key={entry.id} className="surface-card group flex items-start gap-4 p-4 transition hover:border-indigo-100 sm:items-center sm:p-5">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${activeTab === "scanned" ? "bg-cyan-50 text-cyan-700" : "bg-indigo-50 text-indigo-700"}`}>
                  <Icon name={webLink ? "link" : activeTab === "scanned" ? "scan" : "qr"} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-semibold leading-6 text-slate-800 sm:truncate">{entry.value}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                    <Icon name="clock" className="h-3.5 w-3.5" />
                    {formatDate(entry.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                  <button type="button" className="icon-button" onClick={() => handleCopy(entry)} aria-label={t("history.copyContent")} title={t("history.copy")}>
                    <Icon name={copiedId === entry.id ? "check" : "copy"} className="h-[18px] w-[18px]" />
                  </button>
                  <button type="button" className="icon-button" onClick={() => handleShare(entry)} aria-label={t("history.shareContent")} title={t("history.share")}>
                    <Icon name={sharedId === entry.id ? "check" : "share"} className="h-[18px] w-[18px]" />
                  </button>
                  <button type="button" className="icon-button" onClick={() => handleOpen(entry)} aria-label={t("history.openNewWindow")} title={t("history.openNewWindow")}>
                    <Icon name="external" className="h-[18px] w-[18px]" />
                  </button>
                  <button
                    type="button"
                    className="icon-button hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                    onClick={() => handleDelete(entry.id)}
                    aria-label={t("history.deleteEntry")}
                    title={t("history.delete")}
                  >
                    <Icon name="trash" className="h-[18px] w-[18px]" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="surface-card mt-6 flex min-h-[320px] flex-col items-center justify-center p-8 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 text-slate-300">
            <Icon name="history" className="h-9 w-9" />
          </span>
          <h2 className="mt-5 text-lg font-extrabold text-slate-900">
            {activeTab === "scanned" ? t("history.noScanned") : t("history.noGenerated")}
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            {t("history.emptyDescription")}
          </p>
          <Link to={emptyAction} className="primary-button mt-6">
            {emptyLabel}
            <Icon name="arrow" />
          </Link>
        </div>
      )}
    </div>
  );
};
