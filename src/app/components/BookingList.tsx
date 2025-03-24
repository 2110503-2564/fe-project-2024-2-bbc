'use client'

import { AppDispatch, useAppSelector } from "@/redux/store"
import { useDispatch } from "react-redux"
import { BookingData } from "../../../interface"

import { removeBooking } from "@/redux/features/bookingSlice"
import Link from "next/link"
import deleteBooking from "@/libs/deleteBooking"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import getHotel from "@/libs/getHotel"
import getRoom from "@/libs/getRoom"

import { HotelData , RoomData } from "../../../interface"
import LinearProgress from '@mui/material/LinearProgress'

export default function BookingList() {
    const bookingItems = useAppSelector((state) => state.bookSlice.bookItems)
    const dispatch = useDispatch<AppDispatch>()
    
    const { data: session } = useSession()
    const token = session?.user?.token

    // Loading state for fetching bookingItems
    const [loading, setLoading] = useState<boolean>(true)

    if (!token) {
        return (
            <div className="text-center text-[30px] font-bold mt-10 text-red-500 items-center justify-center">
                <p>You need to Register or Sign-in first to make a booking.</p>
                <div className="flex flex-row space-x-5 items-center justify-center">
                    <Link href="/register" passHref>
                        <div className="text-[20px] text-red-500 underline hover:text-red-800 mt-4">Register</div>
                    </Link>
                    <div className="text-[20px] text-red-500 hover:text-red-800 mt-4">Or</div>
                    <Link href="/api/auth/signin" passHref>
                        <div className="text-[20px] text-red-500 underline hover:text-red-800 mt-4">Login</div>
                    </Link>
                </div>
            </div>
        )
    }

    // State to manage error and success messages
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const [hotelData, setHotelData] = useState<{ [key: string]: HotelData }>({})
    const [roomData, setRoomData] = useState<{ [key: string]: RoomData }>({})

    useEffect(() => {
        const fetchHotelRoom = async () => {
            const hotelDataMap: { [key: string]: HotelData } = {}
            const roomDataMap: { [key: string]: RoomData } = {}

            for (const bookingItem of bookingItems) {
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
            setLoading(false) // Set loading to false after data is fetched
        }

        fetchHotelRoom()
    }, [bookingItems])

    const handleDeleteBooking = async (bookingId: string, bookingItem: BookingData) => {
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

    // Filter bookings based on user role
    const filteredBookings = bookingItems.filter((bookingItem) => {
        if (session?.user?.role === "super_admin") return true // Show all for super_admin
        if (session?.user?.role === "hotel_admin") {
            return hotelData[bookingItem.booking.hotel_id]?.hotel._id === session.user.account.hotel_id
        }
        return bookingItem.booking.account_id === session?.user?.account._id // Show only own bookings for user
    })

    // If loading, show the LinearProgress
    if (loading) {
        return (
            <div className="flex justify-center items-center mt-10">
                <LinearProgress />
            </div>
        )
    }

    return (
        <>
            {/* Welcome Message Based on Role */}
            {session?.user && (
                <div className="text-center text-[30px] font-bold">
                    <p>Welcome "{session.user.account.first_name + ' ' + session.user.account.last_name}"</p>
                    <p className="text-[25px]">Role: {session.user.role.replace('_', ' ').toUpperCase()}</p>
                    <p className="text-[25px]">Booking List</p>
                </div>
            )}

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

            {filteredBookings.length === 0 ? (
                <div className="font-bold text-[30px] text-red-500 text-center mt-10">
                    No Booking Found
                    <div className="flex justify-center mt-4">
                        <Link href='/hotel' className="w-fit">
                            <div className="text-[20px] underline hover:text-red-800">Make a booking here</div>
                        </Link>
                    </div>
                </div>
            ) : (
                filteredBookings.map((bookingItem: BookingData) => (
                    <div key={bookingItem.booking._id} className="bg-slate-200 rounded p-5 m-5 font-sans font-bold flex flex-col">
                        {
                            session?.user.role == 'super_admin' || session?.user.role == 'hotel_admin' &&(
                                <div>AccountId : {bookingItem.booking.account_id}</div>
                            )
                        }
                        <div>Hotel: {hotelData[bookingItem.booking.hotel_id]?.hotel.hotel_name || "Loading..."}</div>
                        <div>Room Number: {roomData[bookingItem.booking.room_id]?.room.room_number || "Loading..."}</div>
                        <div>Amount of People: {bookingItem.booking.num_people}</div>
                        <div>Check-In Date: {bookingItem.booking.check_in_date}</div>
                        <div>Check-Out Date: {bookingItem.booking.check_out_date}</div>
                        <div>Status: {bookingItem.booking.status}</div>

                        <Link href={`/mybooking/manage?bookingId=${bookingItem.booking._id}&hotelName=${hotelData[bookingItem.booking.hotel_id]?.hotel.hotel_name}`}>
                            <button className="w-full block rounded-md bg-blue-500 hover:bg-blue-800 px-3 py-2 text-white shadow-sm">
                                Edit Booking
                            </button>
                        </Link>

                        <button
                            className="block rounded-md bg-red-600 hover:bg-red-800 px-3 py-2 text-white shadow-sm"
                            onClick={() => handleDeleteBooking(bookingItem.booking._id, bookingItem)}
                        >
                            Cancel Booking
                        </button>
                    </div>
                ))
            )}
        </>
    )
}
