import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import { HotelItem, RoomItem, BookingObject, RoomJson } from "../../../../interface"
import getBooking from "@/libs/getBooking"
import { redirect, useSearchParams } from "next/navigation"
import getRooms from "@/libs/getRooms"
import UpdateBookingForm from "@/app/components/UpdateBookingForm"
import Link from "next/link"

export default async function Manage({
    searchParams
}: {
    searchParams: { bookingId: string; hotelName: string }
}) {
    const session = await getServerSession(authOptions)
    const token = session?.user?.token

    if (!token || !searchParams.bookingId) {
        redirect('/')
    }

    try {
        // Fetch booking data
        const booking: BookingObject = await getBooking(token, searchParams.bookingId)
        
        // Fetch available rooms
        const rooms: RoomJson = await getRooms(booking.data.hotel_id._id)

        return (
            <main className="flex flex-col md:flex-row justify-center items-start gap-6 p-4 min-h-screen bg-gray-100">
                {/* Current Booking Details */}
                <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
                    <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Current Booking Detail</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between border-b pb-2">
                            <strong>Name-Lastname:</strong>
                            <span>{booking.data.account_id.first_name} {booking.data.account_id.last_name}</span>
                        </div>

                        <div className="flex justify-between border-b pb-2">
                            <strong>Hotel:</strong>
                            <span>{searchParams.hotelName}</span>
                        </div>

                        <div className="flex justify-between border-b pb-2">
                            <strong>Room Number:</strong>
                            <span>{booking.data.room_id.room_number}</span>
                        </div>

                        <div className="flex justify-between border-b pb-2">
                            <strong>Amount Of People:</strong>
                            <span>{booking.data.num_people}</span>
                        </div>

                        <div className="flex justify-between border-b pb-2">
                            <strong>Room Capacity:</strong>
                            <span>{booking.data.room_id.capacity}</span>
                        </div>

                        <div className="flex justify-between border-b pb-2">
                            <strong>Check-In Date:</strong>
                            <span>{booking.data.check_in_date}</span>
                        </div>

                        <div className="flex justify-between">
                            <strong>Check-Out Date:</strong>
                            <span>{booking.data.check_out_date}</span>
                        </div>
                    </div>
                </div>

                {/* Update Booking Form (Client Component) */}
                <UpdateBookingForm 
                    bookingData={booking}
                    availableRooms={rooms}
                    token={token}
                    session={session}
                    hotelName={searchParams.hotelName}
                />
            </main>
        )
    } catch (err) {
        console.error("Failed to fetch booking", err)
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Booking</h1>
                    <p className="text-gray-600 mb-6">Failed to load booking details. Please try again later.</p>
                    <Link 
                        href="/mybooking" 
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        Back to My Bookings
                    </Link>
                </div>
            </div>
        )
    }
}