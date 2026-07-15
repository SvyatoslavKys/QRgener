import { Navigate, Route, Routes } from "react-router-dom";
import { Navigation } from "./Navigation";
import { QrCodeGener } from "./QrCodeGener";
import { QrCodeScan } from "./QrCodescanner";
import { Home } from "./Home";
import { History } from "./History";
import { ScanHistory } from "./ScanHistory";
import { GenerateHistory } from "./GenerateHistory";
import { t } from "./i18n";

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col pb-20 md:pb-0">
      <Navigation />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generate" element={<QrCodeGener />} />
          <Route path="/scan" element={<QrCodeScan />} />
          <Route path="/history" element={<History />} />
          <Route path="/scanHistory" element={<ScanHistory />} />
          <Route path="/generateHistory" element={<GenerateHistory />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="hidden border-t border-slate-200/70 bg-white/50 py-6 text-center text-sm text-slate-500 md:block">
        {t("footer")}
      </footer>
    </div>
  );
};

export { Layout };
