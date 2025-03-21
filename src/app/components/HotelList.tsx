import { HotelItem , HotelJson} from "../../../interface";
import Link from "next/link";
import HotelCard from "./HotelCard";

export default async function HotelList({hotelJson}:{hotelJson:HotelJson}){


    const hotelJsonReady = await hotelJson;

    return(
        <>
        <div className="text-[20px] font-medium">Explore {hotelJson.count} Hotels in our List</div>
        <div style={{margin:"20px" , display:"flex" , flexDirection:"row" , flexWrap:"wrap" , justifyContent:"space-around" , alignContent:"space-around"}}>
                {
                    hotelJsonReady.hotels.map((hotelItem:HotelItem)=>(
                        <Link href={`/car/${hotelItem.id}`} 
                        className="w-[100%] sm:w-[50%] md:w-[30%] lg:w-[25%]
                        p-2 sm:p-4 md:p-4 lg:p-8">
                        <HotelCard hotelName={hotelItem.hotel_name} imgSrc={'/img/samplehotel.jpg'}/>
                        </Link>
                       
                    ))
                }
            </div>
        </>
    );
}