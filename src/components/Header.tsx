import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("userLoggedIn"));
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.info("Enter something to search");
      return;
    }
    onSearch(searchQuery);
  };

  const logout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user/logout`,
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("userLoggedIn");
      setIsLoggedIn(false);
      toast.success("Logged out");
      navigate("/login");
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <header className="flex px-12 py-4 items-center justify-between border-b">
      <div
        onClick={() => navigate("/")}
        className="cursor-pointer flex items-center gap-2"
      >
        <img src={logo} alt="logo" className="h-10 object-center" />
      </div>

      <div className="flex gap-5 items-center">
        <input
          type="text"
          placeholder="Search experiences"
          value={searchQuery}
          onChange={(e) => {
            const value = e.target.value;
            setSearchQuery(value);
            onSearch(value);
          }}
          className="border px-4 py-2 outline-none w-64 bg-gray-100 text-black rounded-md"
        />

        <button
          onClick={handleSearch}
          className="flex items-center gap-3 border px-5 py-2 rounded-md font-medium bg-yellow-400 hover:scale-105 transition"
        >
          Search
        </button>

        {isLoggedIn ? (
          <button
            onClick={logout}
            className="flex items-center gap-3 border px-5 py-2 rounded-md font-medium bg-yellow-400 hover:scale-105 transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-3 border px-5 py-2 rounded-md font-medium bg-gray-200 hover:bg-gray-300 transition"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
