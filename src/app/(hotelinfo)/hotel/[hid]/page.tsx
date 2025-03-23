import getHotel from "@/libs/getHotel";
import {RoomItem, RoomJson } from "../../../../../interface";
import { HotelData } from "../../../../../interface";
import HotelPageBanner from "@/app/components/HotelPageBanner";
import getRooms from "@/libs/getRooms";
import RoomsList from "@/app/components/RoomsList";

export default async function HotelDetail({params}:{params:{hid:string}}){

    const hotelDetail:HotelData = await getHotel(params.hid)
    // console.log(hotelDetail)
    const hotelRooms:RoomJson = await getRooms(params.hid)
    
    return(
        <main>
            <HotelPageBanner hotelName={hotelDetail.hotel.hotel_name}/>
            {
                (hotelRooms.room.length === 0)?  <p className="text-center text-xl font-semibold text-red-500 mt-5">No Room in this Hotel</p>
                :<RoomsList rooms={hotelRooms}/>
            }
        </main>
    );
}