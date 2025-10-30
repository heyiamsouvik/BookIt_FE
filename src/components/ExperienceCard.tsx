import { Link } from "react-router-dom";

interface Props {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  image: string;
}

function ExperienceCard({ _id, title, description, location, price, image }: Props) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-0 overflow-hidden border">
      
      <img 
        src={image}
        alt={title}
        className="w-full h-44 object-cover"
      />

      <div className="p-3">
        <div className="flex justify-between items-start mb-1 gap-2">
          <h2 className="font-semibold text-lg">{title}</h2>
          <div className="bg-gray-200 text-xs px-2 py-1 rounded-md line-clamp-2">
            {location}
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between mt-3">
          <p className="font-semibold text-sm">
            From <span className="text-black font-bold">₹{price}</span>
          </p>

          <Link
            to={`/experience/${_id}`}
            className="bg-yellow-400 text-sm font-medium py-2 px-3 rounded-md hover:bg-yellow-500"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ExperienceCard;
