import { SCAN_DATA } from './constants';


export const ScanHistory = () => {
    const data = JSON.parse(localStorage.getItem(SCAN_DATA) || "[]");
    return(
        <div className='mt-4 flex justify-center flex-col gap-4 text-blue-600' >
            {data.map((text )=> (
                <a target="_blank" href={text}><p className="hover:text-red-500" key={text}>{text}</p></a>
               ))
            };
        </div>
    )
};