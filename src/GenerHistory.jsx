import { GENERATE_DATE } from './constants';

export const GenerateHistory = () => {
    const datag = JSON.parse(localStorage.getItem(GENERATE_DATE) || "[]");

    return (
        <div>
            {datag.map((text) => (
                <p key={text}>{text}</p>
            ))}
        </div>
    );
};
