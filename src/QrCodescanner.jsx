import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { SCAN_DATA } from './constants';

export const QrCodeScan = () => {
    const [scanResult, setScanResult] = useState('');
  
    const scanHandler = (results) => {
      const value = results?.[0]?.rawValue || '';
      setScanResult(value);

      const prevData = JSON.parse(localStorage.getItem(SCAN_DATA) || "[]");
      localStorage.setItem(
        SCAN_DATA, 
        JSON.stringify([...prevData, value])
        );

    };
    const settings = {
        audio: true,
        finder: true,
    };
    const stylesSettings = {
        container: { width: 360, }
    };
    return(
        <div>
            <Scanner 
            allowMultiple={false} 
            onScan={scanHandler}
            components={settings}
            styles={stylesSettings}
            />
            <input type="text" value={scanResult} readOnly />
        </div>
    );
};