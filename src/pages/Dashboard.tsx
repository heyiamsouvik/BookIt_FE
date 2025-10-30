import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import ExperienceCard from "../components/ExperienceCard";
import { toast } from "react-toastify";

interface Experience {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  image: string;
}

function Dashboard() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filtered, setFiltered] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchExperiences = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/experience/`,
        { withCredentials: true }
      );

      setExperiences(res.data.experiences);
      setFiltered(res.data.experiences);
    } catch (err) {
      console.log(err);
      toast.error("Unable to fetch experiences");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  // Browser-side search (no API)
  useEffect(() => {
    const q = search.toLowerCase();

    const result = experiences.filter((exp) =>
      exp.title.toLowerCase().includes(q) ||
      exp.location.toLowerCase().includes(q) ||
      exp.description.toLowerCase().includes(q)
    );

    setFiltered(result);
  }, [search, experiences]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={setSearch} />

      <div className="max-w-5xl mx-auto mt-6 px-4">
        {loading ? (
          <p>Loading...</p>
        ) : filtered.length === 0 ? (
          <p>No experience found.</p>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((exp) => (
              <ExperienceCard key={exp._id} {...exp} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
