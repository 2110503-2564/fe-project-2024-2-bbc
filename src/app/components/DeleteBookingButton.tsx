'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"
import deleteBooking from "@/libs/deleteBooking"
import updateRoomStatus from "@/libs/updateRoomStatus"

export default function DeleteBookingButton({ bookingId, roomId, token }: { bookingId: string, roomId: string, token: string }) {
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const router = useRouter()

    const handleDeleteBooking = async () => {
        try {
            setError(null)
            setSuccessMessage(null)

            await deleteBooking(token, bookingId)
            await updateRoomStatus(token, roomId, 'available')

            setSuccessMessage("Booking deleted successfully")
            router.refresh() // Refresh the page to show updated bookings
        } catch (error: any) {
            setError(error.message || "Error deleting booking")
        }
    }

    return (
        <>
            {error && (
                <div className="bg-red-500 text-white text-center font-semibold rounded-lg p-3 shadow-md shadow-gray-500">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="bg-green-500 text-white text-center font-semibold rounded-lg p-3 shadow-md shadow-gray-500">
                    {successMessage}
                </div>
            )}

            <button
                className="block rounded-md bg-red-600 hover:bg-red-800 px-3 py-2 text-white shadow-sm"
                onClick={handleDeleteBooking}
            >
                Cancel Booking
            </button>
        </>
    )
}