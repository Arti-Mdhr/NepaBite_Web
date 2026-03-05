import Link from "next/link";

export default function FoodCard(props: {
  id: string;
  name: string;
  time?: string;
  rating?: string;
  image?: string;
}) {
  const { id, name, time = "—", rating = "—", image } = props;

  return (
    <Link
      href={`/recipes/${id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition duration-300"
    >
      <div className="relative overflow-hidden">

        <img
          src={image || "/images/img1.jpg"}
          alt={name}
          className="h-56 w-full object-cover group-hover:scale-105 transition duration-300"
        />

        {/* Rating */}
        <div className="absolute top-3 right-3 bg-black px-3 py-1 rounded-full text-xs font-semibold shadow">
          ⭐ {rating}
        </div>
      </div>

      <div className="p-5">

        <h3 className="text-lg font-semibold text-gray-900 capitalize line-clamp-2">
          {name}
        </h3>
{/* 
        <div className="flex justify-between items-center mt-4 text-sm">

          <span className="text-gray-500">
            ⏱ {time} */}
          {/* </span> */}

          <span className="text-green-600 font-semibold group-hover:underline">
            View Recipe →
          </span>

        </div>
      {/* </div> */}
    </Link>
  );
}