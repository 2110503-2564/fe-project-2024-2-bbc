import HotelList from "@/app/components/HotelList";
import { Suspense } from "react";
import getHotels from "@/libs/getHotels";
import { LinearProgress } from "@mui/material";

export default async function Hotel(){
    
    const hotels = await getHotels();

    return(
        <main className="text-center p-5 min-h-screen bg-slate-50">
            <Suspense fallback={<p>Loading ...<LinearProgress/></p>}>
                <h1 className="text-[50px] font-bold">
                    Select Your Hotel
                </h1>
                <HotelList hotelJson={hotels}/>
            </Suspense>
            <hr className="my-10" />
        </main>
    );

}