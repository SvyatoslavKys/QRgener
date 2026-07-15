import { Routes, Route } from "react-router-dom";
import { Navigation } from './Navigation';
import { QrCodeGener } from "./QrCodeGener";
import { QrCodeScan } from "./QrCodescanner";
import { ScanHistory } from "./ScanHistory";
import { GenerateHistory } from "./GenerateHistory";
import { Home } from "./Home";



const Layout = () => {
    return(
    <div>
        <Navigation/>
        <Routes>
            <Route path="/QRgener" element={<Home/>} />
            <Route path="/generate" element={<QrCodeGener/>} />
            <Route path="/scan" element={<QrCodeScan/>} />
            <Route path="/scanHistory" element={<ScanHistory/>} />
            <Route path="/generateHistory" element={<GenerateHistory/>} />
        </Routes>
        
    </div>
    )
};
export { Layout };