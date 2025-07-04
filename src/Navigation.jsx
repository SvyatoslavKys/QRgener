import { Link } from "react-router-dom";

export const Navigation = () => {
    return (
        <nav>
            <Link to="/scan">Scan QR</Link>
            <Link to="/generate">Generate QR</Link>
            <Link to="/scanHistory">Scan history</Link>
            <Link to="/generateHistory">Generate history</Link>
        </nav>
    );
};