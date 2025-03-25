import getPopularHotels from "@/libs/getPopularHotels";
import RecommendCard from "./RecommendCard";
import { HotelItem } from "../../../interface";

export default async function RecommendList() {
  const hotels = await getPopularHotels();

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-extrabold mb-5 bg-black text-white rounded-full px-6 py-3">
        Our Top Hotels
      </h1>
      <div className="flex flex-wrap justify-center w-full max-w-[95%]">
        {hotels.hotels.map((hotelItem: HotelItem, index: number) => (
          <div
            key={index}
            className="opacity-0 translate-x-[50px] slide-in-right"
            style={{ animationDelay: `${index * 500}ms` }}
          >
            <RecommendCard
              imgPos={false}
              imgSrc={`/img/recommend${index}.jpg`}
              hotelName={hotelItem.hotel_name}
              Tel={hotelItem.tel}
              address={hotelItem.address}
              textSection="Discover a luxurious stay with our recommended hotel. Enjoy modern amenities, convenient locations, and unmatched comfort during your visit."
            />
          </div>
        ))}
      </div>
    </div>
  );
}
