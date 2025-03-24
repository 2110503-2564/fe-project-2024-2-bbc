import getPopularHotels from "@/libs/getPopularHotels";
import RecommendCard from "./RecommendCard";
import { HotelItem } from "../../../interface";

export default async function RecommendList(){

    const hotels = await getPopularHotels();

    return(
        <div className="space-y-10" style={{margin:"20px", display:"flex", flexDirection:"column", alignContent:"center"}}>
            { hotels.hotels.map((hotelItem:HotelItem)=>(
                <RecommendCard 
                imgPos={false} 
                imgSrc="/img/recommend1.jpg" 
                textSection="Discover a luxurious stay with our recommended hotel. Enjoy modern amenities, convenient
                locations, and unmatched comfort during your visit."/>
            ))
            }          
        </div>
       
    );
}