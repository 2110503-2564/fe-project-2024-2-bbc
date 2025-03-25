import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/authOptions"
import { HotelData, RoomData } from "../../../interface"
import getHotel from "@/libs/getHotel"
import getRoom from "@/libs/getRoom"
import { redirect } from "next/navigation"
import BookingForm from "../components/BookingForm"
import Link from "next/link"

export default async function Booking({
    searchParams
}: {
    searchParams: { hotelId: string; roomId: string }
}) {
    const session = await getServerSession(authOptions)
    const token = session?.user?.token

    if (!searchParams.hotelId || !searchParams.roomId) {
        redirect('/')
    }

    try {
        // Fetch hotel and room data in parallel
        const [hotel, room] = await Promise.all([
            getHotel(searchParams.hotelId),
            getRoom(searchParams.roomId)
        ])

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
                            <tr><td className="font-semibold pr-5">Hotel Name:</td><td>{hotel.hotel.hotel_name}</td></tr>
                            <tr><td className="font-semibold pr-5">Room Number:</td><td>{room.room.room_number}</td></tr>
                            <tr><td className="font-semibold pr-5">Capacity:</td><td>{room.room.capacity} People</td></tr>
                            <tr><td className="font-semibold pr-5">Price per Night:</td><td>{room.room.price_per_night} Baht</td></tr>
                            <tr><td className="font-semibold pr-5">Status:</td><td>{room.room.status}</td></tr>
                        </tbody>
                    </table>
                </div>
                
                <BookingForm 
                    hotelId={searchParams.hotelId}
                    room={room}
                    token={token}
                    session={session}
                />
            </main>
        )
    } catch (error) {
        console.error('Failed to fetch hotel or room:', error)
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Booking</h1>
                    <p className="text-gray-600 mb-6">Failed to load booking details. Please try again later.</p>
                    <Link 
                        href="/hotel" 
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        Back to Hotels
                    </Link>
                </div>
            </div>
        )
    }
}