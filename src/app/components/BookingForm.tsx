'use client'

import { TextField } from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { DatePicker } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { Dayjs } from "dayjs"
import { useState } from "react"
import { useRouter } from "next/navigation"
import userBooking from "@/libs/userBooking"
import updateRoomStatus from "@/libs/updateRoomStatus"
import { RoomData } from "../../../interface"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/redux/store"
import { addBooking } from "@/redux/features/bookingSlice"
import Link from "next/link"

export default function BookingForm({
    hotelId,
    room,
    token,
    session
}: {
    hotelId: string
    room: RoomData
    token: string | undefined
    session: any
}) {
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>()
    const [numpeople, setNumPeople] = useState<number>(1)
    const [checkInDate, setCheckInDate] = useState<Dayjs | null>(null)
    const [checkOutDate, setCheckOutDate] = useState<Dayjs | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const handlerNumPeopleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumPeople(Number(event.target.value))
    }

    const makeBooking = async (event: React.FormEvent) => {
        event.preventDefault()
        setError(null)

        if (!session) {
            setError("You must be logged in to make a booking.")
            return
        }

        if (!checkInDate || !checkOutDate) {
            setError("Please select both check-in and check-out dates.")
            return
        }

        const diffDays = checkOutDate.diff(checkInDate, 'day')
        if (diffDays > 4) {
            setError("The booking must be exactly 3 nights (4 days). Please select valid dates.")
            return
        }

        if (checkInDate.isAfter(checkOutDate)) {
            setError("Check-in date must be before check-out date.")
            return
        }

        try {
            if (!token) throw new Error("No authentication token found")
            
            const item = await userBooking(
                token,
                hotelId,
                room.room.room_number,
                numpeople,
                checkInDate.format("YYYY-MM-DD"),
                checkOutDate.format("YYYY-MM-DD")
            )

            if (room.room._id) {
                const status = "pending"
                await updateRoomStatus(token, room.room._id, status)
            } else {
                console.log("Room Id is undefined")
            }
            
            setSuccessMessage("Booking successful!")
            dispatch(addBooking(item))
            router.refresh()

        } catch (err: any) {
            setError(err.message)
        }
    }

    return (
        <form onSubmit={makeBooking}>
            <div className="bg-slate-100 rounded-lg flex flex-col justify-center w-[100%] space-y-10 px-10 py-10 shadow-lg shadow-gray-500 mx-10">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TextField 
                        type="number" 
                        required 
                        variant="standard" 
                        name="numpeople" 
                        label="Amount of People" 
                        value={numpeople} 
                        onChange={handlerNumPeopleChange} 
                        InputProps={{
                            inputProps: {
                                min: 1
                            }
                        }}
                        fullWidth 
                    />
                    <DatePicker label="Check-in Date" value={checkInDate} onChange={setCheckInDate} />
                    <DatePicker label="Check-out Date" value={checkOutDate} onChange={setCheckOutDate} />
                    <button 
                        type='submit' 
                        className="bg-blue-400 text-white rounded-lg w-[120px] h-[40px] font-bold shadow-lg transform transition-transform duration-500 hover:scale-[1.01] hover:bg-blue-600"
                    >
                        Book Hotel
                    </button>
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
    )
}