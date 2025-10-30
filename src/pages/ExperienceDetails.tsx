import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { toast } from "react-toastify";

interface Experience {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  image: string;
}

interface TimeSlot {
  time: string;
  remaining: number;
  available: boolean;
}

function ExperienceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exp, setExp] = useState<Experience | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);

  const today = new Date();
  const next5Days = [...Array(5)].map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);
    return {
      label: d.toLocaleString("en-US", { month: "short", day: "numeric" }),
      value: d.toISOString().split("T")[0],
    };
  });

  const fetchExperience = async () => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/experience/details/${id}`,
        { withCredentials: true }
      );
      setExp(res.data.experience);
    } catch {
      toast.error("Failed to load experience");
      navigate("/");
    }
  };

  const fetchSlots = async (date: string) => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/slot/${id}/slots?date=${date}`,
        { withCredentials: true }
      );
      setSlots(res.data.slots);
    } catch {
      toast.error("Could not load slots");
    }
  };

  useEffect(() => {
    fetchExperience();
  }, [id]);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setQuantity(1);
    fetchSlots(date);
  };

  if (!exp) return <p className="p-8">Loading...</p>;

  const subtotal = exp.price * quantity;
  const tax = Math.round(subtotal * 0.06);
  const total = subtotal + tax;

  // ✅ MAX QUANTITY BASED ON REMAINING SLOTS
  const selectedSlot = slots.find((s) => s.time === selectedTime);
  const maxQty = selectedSlot?.remaining || 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={() => {}} />

      <div className="max-w-6xl mx-auto py-6 px-4">
        <button
          onClick={() => navigate(-1)}
          className="text-sm mb-3 text-gray-600"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2">
            <img
              src={exp.image}
              alt={exp.title}
              className="w-full h-72 object-cover rounded-xl mb-4"
            />

            <h1 className="text-3xl font-bold mb-2">{exp.title}</h1>
            <p className="text-gray-700 mb-6">{exp.description}</p>

            {/* Dates */}
            <h3 className="font-medium mb-2">Choose date</h3>
            <div className="flex gap-2 mb-4">
              {next5Days.map((d) => (
                <button
                  key={d.value}
                  onClick={() => handleDateClick(d.value)}
                  className={`px-3 py-2 rounded-md border text-sm ${
                    selectedDate === d.value
                      ? "bg-yellow-400 border-yellow-400 text-black"
                      : "bg-white"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Times */}
            <h3 className="font-medium mb-2">Available slots</h3>

            <div className="flex gap-2 flex-wrap mb-4">
              {slots.map((t) => (
                <button
                  key={t.time}
                  onClick={() => {
                    if (!t.available) return;
                    setSelectedTime(t.time);

                    if (quantity > t.remaining) {
                      setQuantity(t.remaining);
                    } else {
                      setQuantity(1);
                    }
                  }}
                  disabled={!t.available}
                  className={`px-3 py-2 text-sm rounded-md border ${
                    !t.available
                      ? "opacity-50 bg-gray-200"
                      : selectedTime === t.time
                      ? "bg-yellow-400 border-yellow-400"
                      : "bg-white"
                  }`}
                >
                  {t.time}{" "}
                  {t.available ? (
                    <span className="text-xs text-red-500 ml-1">
                      {t.remaining} left
                    </span>
                  ) : (
                    <span className="text-xs ml-1 text-gray-500">Sold out</span>
                  )}
                </button>
              ))}
            </div>

            <h3 className="font-medium mb-2">About</h3>
            <p className="text-gray-600 bg-gray-100 p-3 rounded-md text-sm">
              Scenic routes, trained guides, and safety briefing. Minimum age
              10.
            </p>
          </div>

          {/* RIGHT CARD */}
          <div className="bg-white rounded-xl shadow p-5 h-fit">
            <div className="flex justify-between mb-4 text-sm">
              <span>Starts at</span>
              <span>₹{exp.price}</span>
            </div>

            {/* ✅ Quantity control with limit */}
            <div className="flex justify-between mb-4 text-sm items-center">
              <span>Quantity</span>
              <div className="flex items-center gap-2">
                {/* minus */}
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={!selectedTime}
                  className="px-2 border rounded"
                >
                  -
                </button>

                <span>{quantity}</span>

                {/* plus */}
                <button
                  onClick={() => {
                    if (!selectedTime) {
                      toast.error("Select a time first");
                      return;
                    }
                    setQuantity((q) => Math.min(q + 1, maxQty));
                  }}
                  disabled={!selectedTime || quantity >= maxQty}
                  className="px-2 border rounded"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex justify-between text-sm mb-2">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between text-sm mb-3">
              <span>Taxes</span>
              <span>₹{tax}</span>
            </div>

            <hr className="my-2" />

            <div className="flex justify-between font-semibold mb-4">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              disabled={!selectedDate || !selectedTime}
              onClick={() => {
                if (!selectedDate || !selectedTime) return;

                navigate("/checkout", {
                  state: {
                    experience: exp,
                    date: selectedDate,
                    time: selectedTime,
                    quantity,
                    subtotal,
                    tax,
                    total,
                  },
                });
              }}
              className={`w-full py-2 rounded-md font-medium ${
                selectedDate && selectedTime
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExperienceDetails;
