import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/authOptions"
import { BookingData } from "../../../interface"
import { HotelData, RoomData } from "../../../interface"
import Link from "next/link"
import getHotel from "@/libs/getHotel"
import getRoom from "@/libs/getRoom"
import getUserBookings from "@/libs/getUserBookings"
import DeleteBookingButton from "./DeleteBookingButton"

export default async function BookingList() {
    const session = await getServerSession(authOptions)
    const token = session?.user?.token

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

    // Fetch bookings from API directly
    const bookingsResponse = await getUserBookings(token)
    const bookingItems = bookingsResponse.data.map((booking: any) => ({
        booking: {
            _id: booking._id,
            account_id: booking.account_id._id,
            hotel_id: booking.hotel_id._id,
            room_id: booking.room_id._id,
            status: booking.status,
            num_people: booking.num_people,
            check_in_date: booking.check_in_date,
            check_out_date: booking.check_out_date
        }
    }))

    // Fetch hotel and room data
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

    // Filter bookings based on user role
    const filteredBookings = bookingItems.filter((bookingItem: BookingData) => {
        if (session.user.role === "super_admin") return true // Show all for super_admin
        if (session.user.role === "hotel_admin") {
            return hotelDataMap[bookingItem.booking.hotel_id]?.hotel._id === session.user.account.hotel_id
        }
        return bookingItem.booking.account_id === session.user.account._id // Show only own bookings for user
    })

    return (
        <>
            {/* Welcome Message Based on Role */}
            {session.user && (
                <div className="text-center text-[30px] font-bold">
                    <p>Welcome "{session.user.account.first_name + ' ' + session.user.account.last_name}"</p>
                    <p className="text-[25px]">Role: {session.user.role.replace('_', ' ').toUpperCase()}</p>
                    <p className="text-[25px]">Booking List</p>
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
                            session.user.role == 'super_admin' || session.user.role == 'hotel_admin' &&(
                                <div>AccountId : {bookingItem.booking.account_id}</div>
                            )
                        }
                        <div>Hotel: {hotelDataMap[bookingItem.booking.hotel_id]?.hotel.hotel_name || "Loading..."}</div>
                        <div>Room Number: {roomDataMap[bookingItem.booking.room_id]?.room.room_number || "Loading..."}</div>
                        <div>Amount of People: {bookingItem.booking.num_people}</div>
                        <div>Check-In Date: {bookingItem.booking.check_in_date}</div>
                        <div>Check-Out Date: {bookingItem.booking.check_out_date}</div>
                        <div>Status: {bookingItem.booking.status}</div>

                        <Link href={`/mybooking/manage?bookingId=${bookingItem.booking._id}&hotelName=${hotelDataMap[bookingItem.booking.hotel_id]?.hotel.hotel_name}`}>
                            <button className="w-full block rounded-md bg-blue-500 hover:bg-blue-800 px-3 py-2 text-white shadow-sm">
                                Edit Booking
                            </button>
                        </Link>

                        <DeleteBookingButton 
                            bookingId={bookingItem.booking._id}
                            roomId={bookingItem.booking.room_id}
                            token={token}
                        />
                    </div>
                ))
            )}
        </>
    )
}