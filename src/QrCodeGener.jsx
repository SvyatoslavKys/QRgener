import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { GENERATE_DATE } from './constants';

const QrCodeGener = () => {
    const [value, setValue] = useState('');
    const [result, setResult] = useState('');

    const onClickHandler = (event) =>{
        setResult(value);
        setValue('');

        const prevData = JSON.parse(localStorage.getItem(GENERATE_DATE) || "[]");
      localStorage.setItem(
        GENERATE_DATE, 
        JSON.stringify([...prevData, value])
        );
    };
    const onChangeHandler = (event) => {
       setValue(event.target.value);
       setResult('');
    };
    console.log( 'result:',result)
    return(
        <div>
            {result !== '' && (<QRCodeSVG value={result} size={200} />) }
            <input placeholder='your text' type="text" value={value} onChange={onChangeHandler} />
            <button type='button' onClick={onClickHandler}>Gener QR</button>
        </div>
    );
};
export{ QrCodeGener };