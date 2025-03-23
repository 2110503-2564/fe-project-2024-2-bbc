'use client'

import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import getHotel from "@/libs/getHotel";
import getRoom from "@/libs/getRoom";
import userBooking from "@/libs/userBooking";
import { HotelData, RoomData } from "../../../interface";

import Link from "next/link";

import LinearProgress from '@mui/material/LinearProgress';
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addBooking } from "@/redux/features/bookingSlice";

export default function Booking() {
    const router = useRouter();
    const [hotelId, setHotelId] = useState<string | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [numpeople, setNumPeople] = useState<number>(1);
    const [checkInDate, setCheckInDate] = useState<Dayjs | null>(null);
    const [checkOutDate, setCheckOutDate] = useState<Dayjs | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [hotel, setHotel] = useState<HotelData | null>(null);
    const [room, setRoom] = useState<RoomData | null>(null);

    const { data: session } = useSession();
    const dispatch = useDispatch<AppDispatch>();

    const handlerNumPeopleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumPeople(Number(event.target.value));
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const fetchedHotelId = searchParams.get('hotelId');
        const fetchedRoomId = searchParams.get('roomId');

        if (fetchedHotelId && fetchedRoomId) {
            setHotelId(fetchedHotelId);
            setRoomId(fetchedRoomId);
        } else {
            router.push('/');
        }
    }, [router]);

    useEffect(() => {
        const fetchHotelRoom = async () => {
            if (hotelId && roomId) {
                try {
                    const hotelData = await getHotel(hotelId);
                    const roomData = await getRoom(roomId);
                    setHotel(hotelData);
                    setRoom(roomData);
                } catch (error) {
                    console.error('Failed to fetch hotel or room:', error);
                }
            }
        };

        fetchHotelRoom();
    }, [hotelId, roomId]);

    if (!hotelId || !roomId) {
        return (
            <p>Loading...<LinearProgress /></p>
        );
    }

    const makeBooking = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        if (!session) {
            setError("You must be logged in to make a booking.");
            return;
        }

        if (!checkInDate || !checkOutDate) {
            setError("Please select both check-in and check-out dates.");
            return;
        }

        const diffDays = checkOutDate.diff(checkInDate, 'day');
        if (diffDays > 4) {
            setError("The booking must be exactly 3 nights (4 days). Please select valid dates.");
            return;
        }

        if (checkInDate.isAfter(checkOutDate)) {
            setError("Check-in date must be before check-out date.");
            return;
        }

        try {
            const token = session.user.token;
            const item = await userBooking(
                token,
                hotelId!,
                room!.room.room_number,
                numpeople,
                checkInDate.format("YYYY-MM-DD"),
                checkOutDate.format("YYYY-MM-DD")
            );
            
            setSuccessMessage("Booking successful!");
            dispatch(addBooking(item));
            console.log(item);

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <main className="w-[100%] flex flex-row space-y-4 justify-center">
            <div className="m-5 p-5 bg-slate-100 rounded-lg shadow-lg shadow-gray-500 w-full max-w-[400px] h-[50%]">
                <div className="text-[30px] font-bold font-sans mb-4">Start Booking Hotel</div>

                {session && (
                    <div className="bg-slate-300 rounded-lg p-5 mb-5">
                        <div className="font-bold text-[25px] mb-2">User Profile</div>
                        <table className="w-full border-collapse">
                            <tbody>
                                <tr><td className="font-semibold pr-5">Name:</td><td>{session.user?.account.first_name + ' ' + session.user?.account.last_name}</td></tr>
                                <tr><td className="font-semibold pr-5">Tel:</td><td>{session.user?.account.tel}</td></tr>
                                <tr><td className="font-semibold pr-5">Email:</td><td>{session.user?.account.email}</td></tr>
                            </tbody>
                        </table>
                    </div>
                )}

                <table className="w-full border-collapse">
                    <tbody>
                        <tr><td className="font-semibold pr-5">Hotel Name:</td><td>{hotel?.hotel.hotel_name}</td></tr>
                        <tr><td className="font-semibold pr-5">Room Number:</td><td>{room?.room.room_number}</td></tr>
                        <tr><td className="font-semibold pr-5">Capacity:</td><td>{room?.room.capacity} People</td></tr>
                        <tr><td className="font-semibold pr-5">Price per Night:</td><td>{room?.room.price_per_night} Baht</td></tr>
                        <tr><td className="font-semibold pr-5">Status:</td><td>{room?.room.status}</td></tr>
                    </tbody>
                </table>
            </div>
            
            <form onSubmit={makeBooking}>
                <div className="bg-slate-100 rounded-lg flex flex-col justify-center w-[100%] space-y-10 px-10 py-10 shadow-lg shadow-gray-500 mx-10">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TextField type="number" required variant="standard" name="numpeople" label="Amount of People" value={numpeople} onChange={handlerNumPeopleChange} 
                        InputProps={{
                            inputProps:{
                                min:1
                            }
                        }}
                        fullWidth />
                        <DatePicker label="Check-in Date" value={checkInDate} onChange={setCheckInDate} />
                        <DatePicker label="Check-out Date" value={checkOutDate} onChange={setCheckOutDate} />
                        <button type='submit' className="bg-blue-400 text-white rounded-lg w-[120px] h-[40px] font-bold shadow-lg transform transition-transform duration-500 hover:scale-[1.01] hover:bg-blue-600">Book Hotel</button>
                    </LocalizationProvider>
                </div>
                {error && (
                    <div className="w-full bg-red-500 text-white text-center font-semibold rounded-lg p-3 mt-10 ml-10 shadow-md shadow-gray-500">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="w-full bg-green-500 text-white text-center font-semibold rounded-lg p-3 mt-10 ml-10 shadow-md shadow-gray-500">
                        {successMessage}
                        <div className="mt-3">
                            <Link href="/mybooking" className="text-blue-200 hover:text-blue-400 underline">Go to My Bookings</Link>
                        </div>
                    </div>
                )}
            </form>
        </main>
    );
}