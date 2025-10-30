import { useSearchParams, Link } from "react-router-dom";
import Header from "../components/Header";

const Confirmation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const refId = searchParams.get("ref");

  return (
    <div className="min-h-screen bg-white">
      <Header onSearch={(value: string) => console.log("Search:", value)} />

      <div className="flex flex-col items-center justify-center mt-24 px-4 text-center">
        <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="white"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold mb-2">
          Booking Confirmed
        </h1>

        <p className="text-gray-600 mb-6">
          Ref ID: {refId || "N/A"}
        </p>

        <Link to="/">
          <button className="px-5 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition text-sm">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Confirmation;
