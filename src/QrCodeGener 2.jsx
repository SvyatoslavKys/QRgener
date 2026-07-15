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
        <div className="relativ flex flex-col justify-center items-center">
            <div className='mt-5'>{result !== '' && (<QRCodeSVG value={result} size={200} />) }</div>
           <div className='flex gap-4 absolute top-[300px]'> 
           <input className='bg-gray-200 p-2 border-red-500' placeholder='your text' type="text" value={value} onChange={onChangeHandler} />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md border border-blue-600 hover:bg-blue-600 hover:border-blue-700 transition-colors duration-300"
                     type='button' onClick={onClickHandler}>Gener QR</button>
            </div>
        </div>
    );
};
export{ QrCodeGener };