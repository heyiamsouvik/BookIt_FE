import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { toast } from "react-toastify";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("userLoggedIn");

    if (!isLoggedIn) {
      toast.info("Please login to continue");
      navigate("/login?redirect=/checkout");
    }
  }, [navigate]);

  useEffect(() => {
    if (!booking) {
      navigate("/experiences");
    }
  }, [booking, navigate]);

  if (!booking) return null;

  const { experience, date, time, quantity, subtotal, tax, total } = booking;

  const applyPromo = async () => {
    if (!promo) {
      toast.error("Enter a promo code");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/promo/validate`,
        { promoCode: promo, basePrice: subtotal }
      );

      if (res.data.success) {
        setDiscount(res.data.discount);
        toast.success(`Promo applied! You saved ₹${res.data.discount}`);
      }
    
    } catch (err) {
  const error = err as { response?: { data?: { message?: string } } };

  const message =
    error?.response?.data?.message ||
    (err instanceof Error ? err.message : "Invalid Promo Code");

  toast.error(message);
  setDiscount(0);
}

  };

  const handleBooking = async () => {
    if (!fullName || !email) {
      toast.error("Enter your name and email");
      return;
    }

    const payload = {
      bookedUnderName: fullName,
      contactEmail: email,
      experienceId: experience._id,
      date,
      time,
      quantity,
      totalPrice: total,
      promoCode: promo || null,
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/booking`,
        payload,
        { withCredentials: true }
      );

      if (res.data.success) {
        const refId = res.data.refId;

        toast.success("Booking created. Redirecting to payment...");

        const confirmPayload = {
          refId,
          paymentId: "dummyPayment123",
          paymentStatus: "SUCCESS",
        };

        const confirmRes = await axios.post(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/booking/confirm`,
          confirmPayload
        );

        if (confirmRes.data.success) {
          navigate(`/confirmation?ref=${refId}`);
        }
      }
    } catch (err) {
  const error = err as { response?: { data?: { message?: string } } };

  const message =
    error?.response?.data?.message ||
    (err instanceof Error ? err.message : "Server error");

  console.error(err);
  toast.error(message);
}
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={() => {}} />

      <div className="max-w-6xl mx-auto py-6 px-4">
        <button
          onClick={() => navigate(-1)}
          className="text-sm mb-4 text-gray-600"
        >
          ← Checkout
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-lg p-6 shadow">
            <div className="mb-3">
              <label className="block mb-1 text-sm font-medium">
                Full name
              </label>
              <input
                className="w-full border rounded p-2 text-sm"
                placeholder="Your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input
                className="w-full border rounded p-2 text-sm"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex gap-2 mb-4">
              <input
                className="flex-1 border rounded p-2 text-sm"
                placeholder="Promo code"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
              />
              <button
                onClick={applyPromo}
                className="px-4 bg-black text-white rounded text-sm"
              >
                Apply
              </button>
            </div>
          </div>

          <div className="bg-white p-6 shadow rounded-lg text-sm">
            <div className="mb-2 flex justify-between">
              <span>Experience</span>
              <span>{experience.title}</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span>Date</span>
              <span>{date}</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span>Time</span>
              <span>{time}</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span>Qty</span>
              <span>{quantity}</span>
            </div>

            <div className="mb-2 flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span>Taxes</span>
              <span>₹{tax}</span>
            </div>

            {discount > 0 && (
              <div className="mb-2 flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}

            <hr className="my-3" />

            <div className="flex justify-between font-semibold text-lg mb-3">
              <span>Total</span>
              <span>₹{total - discount}</span>
            </div>

            <button
              onClick={handleBooking}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded font-medium"
            >
              Pay and Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
