import { Link } from "react-router-dom";

export const Navigation = () => {
  return (
    <nav className="flex justify-center items-start gap-4 p-4 bg-gray-200">
      <Link to="/scan" className="text-[13px] md:text-base lg:text-lg text-blue-600 hover:text-red-600">Scan QR</Link>
      <Link to="/generate" className="text-[13px] md:text-base lg:text-lg  text-blue-600 hover:text-red-600">Generate QR</Link>
      <Link to="/scanHistory" className="text-[13px] md:text-base lg:text-lg  text-blue-600 hover:text-red-600">Scan history</Link>
      <Link to="/generateHistory" className="text-[13px] md:text-base lg:text-lg  text-blue-600 hover:text-red-600">Generate history</Link>
    </nav>
  );
};
