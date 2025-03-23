'use client'

import { AppDispatch, useAppSelector } from "@/redux/store"
import { useDispatch } from "react-redux"
import { BookingData } from "../../../interface"

import { removeBooking } from "@/redux/features/bookingSlice"
import Link from "next/link"
import deleteBooking from "@/libs/deleteBooking" // Import deleteBooking function
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react" // Import useState for error and success messages
import getHotel from "@/libs/getHotel"
import getRoom from "@/libs/getRoom"

import { HotelData , RoomData } from "../../../interface"

export default function BookingList() {
    const bookingItems = useAppSelector((state) => state.bookSlice.bookItems)
    const dispatch = useDispatch<AppDispatch>()
    
    const { data: session } = useSession()
    const token = session?.user?.token

    // State to manage error and success messages
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const [hotelData, setHotelData] = useState<{ [key: string]: HotelData }>({})
    const [roomData, setRoomData] = useState<{ [key: string]: RoomData }>({})

    useEffect(()=>{
        const fecthHotelRoom = async() => {

            const hotelDataMap: { [key: string]: HotelData } = {}
            const roomDataMap: { [key: string]: RoomData } = {}

            for(const bookingItem of bookingItems){
                const hotelId = bookingItem.booking.hotel_id
                const roomId = bookingItem.booking.room_id
                
                if (!hotelDataMap[hotelId]) {
                    const hotel = await getHotel(hotelId)
                    hotelDataMap[hotelId] = hotel
                }

                if (!roomDataMap[roomId]) {
                    const room = await getRoom(roomId)
                    roomDataMap[roomId] = room
                }
            }

            setHotelData(hotelDataMap)
            setRoomData(roomDataMap)

        }
        fecthHotelRoom()
    },[bookingItems])

    const handleDeleteBooking = async (bookingId: string , bookingItem:BookingData) => {
        try {
            // Reset previous messages
            setError(null)
            setSuccessMessage(null)

            const data = token ? await deleteBooking(token, bookingId) : null

            // If successful, remove from Redux store
            dispatch(removeBooking(bookingItem))

            // Set success message
            setSuccessMessage("Booking deleted successfully")
        } catch (error: any) {
            // Set error message
            setError(error.message || "Error deleting booking")
        }
    }

    return (
        <>
            {/* Display Error Message */}
            {error && (
                <div className="bg-red-500 text-white text-center font-semibold rounded-lg p-3 shadow-md shadow-gray-500">
                    {error}
                </div>
            )}

            {/* Display Success Message */}
            {successMessage && (
                <div className="bg-green-500 text-white text-center font-semibold rounded-lg p-3 shadow-md shadow-gray-500">
                    {successMessage}
                </div>
            )}

            {bookingItems.length === 0 ? (
                <div className="font-bold text-[30px] text-red-500 text-center mt-10">
                    No Booking Found
                    <div className="flex justify-center mt-4">
                        <Link href='/hotel' className="w-fit">
                            <div className="text-[20px] underline hover:text-red-800">make book here</div>
                        </Link>
                    </div>
                </div>
            ) : (
                bookingItems.map((bookingItem: BookingData) => (
                    <div key={bookingItem.booking._id} className="bg-slate-200 rounded p-5 m-5 font-sans font-bold flex flex-col">
                        <div>Hotel: {hotelData[bookingItem.booking.hotel_id]?.hotel.hotel_name || "Loading..."}</div>
                        <div>Room Number: {roomData[bookingItem.booking.room_id]?.room.room_number || "Loading..."}</div>
                        <div>AmountOfPeoples: {bookingItem.booking.num_people}</div>
                        <div>CheckIn Date: {bookingItem.booking.check_in_date}</div>
                        <div>CheckOut Date: {bookingItem.booking.check_out_date}</div>
                        <div>Status: {bookingItem.booking.status}</div>

                        <button
                            className="block rounded-md bg-red-600 hover:bg-red-800 px-3 py-2 text-white shadow-sm"
                            onClick={() => handleDeleteBooking(bookingItem.booking._id, bookingItem)} // Call handleDeleteBooking on click
                        >
                            Cancel Booking
                        </button>
                    </div>
                ))
            )}
        </>
    )
}
