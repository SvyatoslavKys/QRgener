import { GENERATE_DATE } from './constants';

export const GenerateHistory = () => {
    const datag = JSON.parse(localStorage.getItem(GENERATE_DATE) || "[]");

    return (
        <div className='mt-4 flex justify-center flex-col gap-4 text-blue-600'>
            {datag.map((text) => (
                <p key={text}>{text}</p>
            ))}
        </div>
    );
};
