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
        <div className="flex flex-col justify-center items-center">
            <Scanner 
            allowMultiple={false} 
            onScan={scanHandler}
            components={settings}
            styles={stylesSettings}
            />
            <a target="_blank" href={scanResult}><input className='mt-2 w-300 bg-gray-200 p-2 border-red-400' type="text" value={scanResult} readOnly /></a>
        </div>
    );
};