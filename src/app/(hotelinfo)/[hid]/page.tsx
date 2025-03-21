import getHotel from "@/libs/getHotel";
import { HotelItem } from "../../../../interface";

export default async function HotelDetail({params}:{params:{hid:string}}){

    const hotelDetail:HotelItem = await getHotel(params.hid)

    return(
        <main>
            <h1>{hotelDetail.hotel_name}</h1>
        </main>
    );

}