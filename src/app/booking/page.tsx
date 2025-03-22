'use client'

import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";

import getHotel from "@/libs/getHotel";
import getRoom from "@/libs/getRoom";
import { HotelData, RoomData } from "../../../interface";

import LinearProgress from '@mui/material/LinearProgress';

export default function Booking() {

    const router = useRouter();
    const [hotelId, setHotelId] = useState<string | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [hotel, setHotel] = useState<HotelData | null>(null);
    const [room, setRoom] = useState<RoomData | null>(null);

    // Extract hotelId and roomId from the URL only once when the component mounts
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const fetchedHotelId = searchParams.get('hotelId');
        const fetchedRoomId = searchParams.get('roomId');

        // Set the hotelId and roomId states if not already set
        if (fetchedHotelId && fetchedRoomId) {
            setHotelId(fetchedHotelId);
            setRoomId(fetchedRoomId);
        } else {
            router.push('/');
        }
    }, [router]);

    // Fetch hotel and room data only when hotelId and roomId are available
    useEffect(() => {
        const fetchHotelRoom = async () => {
            if (hotelId && roomId) {
                try {
                    const hotelData = await getHotel(hotelId);
                    const roomData = await getRoom(roomId);

                    console.log(hotelData)
                    console.log(roomData)

                    setHotel(hotelData);
                    setRoom(roomData);
                } catch (error) {
                    console.error('Failed to fetch hotel or room:', error);
                }
            }
        };

        fetchHotelRoom();
    }, [hotelId, roomId]); // Run this effect when hotelId or roomId changes

    // Loading state while waiting for hotelId and roomId
    if (!hotelId || !roomId) {
        return (
            <p>Loading...<LinearProgress /></p>
        );
    }

    return (
        <main className="w-[100%] flex flex-row space-y-4 justify-center">
            {/* Hotel Details Section */}
            <div className="flex flex-col m-5 p-5 bg-slate-100 rounded-lg shadow-lg shadow-gray-500 w-full max-w-[600px]">
                <div className="text-[30px] font-bold font-sans">Start Booking Hotel</div>
                <div className="mt-4 text-lg">
                    <h3 className="font-semibold">Hotel Name: {hotel?.hotel.hotel_name}</h3>
                    <p><strong>Room Number:</strong>{room?.room.room_number}</p>
                    <p><strong>Capacity:</strong> {room?.room.capacity} People</p>
                    <p><strong>Price per Night:</strong>{room?.room.price_per_night} Baht</p>
                    <p><strong>Status:</strong> {room?.room.status}</p>
                </div>
            </div>
            
            {/* Booking Form */}
            <form action="">
                <div className="bg-slate-100 rounded-lg flex flex-col items-center justify-center w-fit space-y-10 px-10 py-10 shadow-lg shadow-gray-500 mx-10 my-10">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        {/* Amount of People */}
                        <TextField
                            type="number"
                            required
                            slotProps={{
                                htmlInput: {
                                    min: 1,
                                    step: 1
                                }
                            }}
                            variant="standard"
                            name="numpeople"
                            label="Amount of People"
                            fullWidth
                        />

                        {/* Check-in Date Picker */}
                        <DatePicker
                            label="Check-in Date"
                        />

                        {/* Check-out Date Picker */}
                        <DatePicker
                            label="Check-out Date"
                        />
                        <button type='submit' name="Book Venue" className="bg-blue-400 text-white rounded-lg w-[120px] h-[40px] font-bold shadow-lg
                        transform transition-transform duration-500 hover:scale-[1.01] hover:bg-blue-600">
                            Book Hotel
                        </button>
                    </LocalizationProvider>
                </div>
            </form>
        </main>
    );
}
