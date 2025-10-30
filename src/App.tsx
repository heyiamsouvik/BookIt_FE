import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import ExperienceDetails from "./pages/ExperienceDetails";

const App = () => {
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const isLoggedIn = localStorage.getItem("userLoggedIn");

  //   if (isLoggedIn) {
  //     navigate("/dashboard");
  //   } else {
  //     navigate("/login");
  //   }
  // }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<Dashboard />} />
      <Route path="/experiences" element={<Dashboard />} />

      
      <Route path="/experience/:id" element={<ExperienceDetails />} />

      <Route path="/checkout" element={<Checkout />} />
      <Route path="/confirmation" element={<Confirmation />} />
    </Routes>
  );
};

export default App;
