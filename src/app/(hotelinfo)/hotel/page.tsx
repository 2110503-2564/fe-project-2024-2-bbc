import HotelList from "@/app/components/HotelList";
import { Suspense } from "react";
import getHotels from "@/libs/getHotels";
import { LinearProgress } from "@mui/material";

export default async function Hotel(){
    
    const hotels = await getHotels();

    return(
        <main className="text-center p-5 min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-200">
            <Suspense fallback={<p>Loading ...<LinearProgress/></p>}>
                <h1 className="text-[50px] font-medium bg-gradient-to-r from-blue-500 to-yellow-300 bg-clip-text text-transparent">
                    Select Your Hotel
                </h1>
                <HotelList hotelJson={hotels}/>
            </Suspense>
            <hr className="my-10" />
        </main>
    );

}