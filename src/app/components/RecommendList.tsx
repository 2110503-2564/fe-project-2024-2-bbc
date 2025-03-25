import getPopularHotels from "@/libs/getPopularHotels";
import RecommendCard from "./RecommendCard";
import { HotelItem } from "../../../interface";

export default async function RecommendList() {
  const hotels = await getPopularHotels();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column", 
        alignItems: "center", 
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap", 
          justifyContent: "space-between", 
          width: "90%",
        }}
      >
        {hotels.hotels.map((hotelItem: HotelItem, index: number) => (
          <RecommendCard
            key={index}
            imgPos={false}
            imgSrc={`/img/recommend${index}.jpg`}
            hotelName={hotelItem.hotel_name}
            Tel={hotelItem.tel}
            address={hotelItem.address}
            textSection="Discover a luxurious stay with our recommended hotel. Enjoy modern amenities, convenient locations, and unmatched comfort during your visit."
            delay={index * 0.4} // Sequential delay for each card
          />
        ))}
      </div>
    </div>
  );
}