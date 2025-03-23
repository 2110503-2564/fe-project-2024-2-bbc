'use client'

import { useEffect, useState, FormEvent } from "react"
import { HotelItem, RoomItem, BookingObject, RoomJson } from "../../../../interface"
import getBooking from "@/libs/getBooking"
import { useSession } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import getRooms from "@/libs/getRooms"
import updateRoomStatus from "@/libs/updateRoomStatus"
import userUpdateBooking from "@/libs/userUpdateBooking"
import Link from "next/link"
import { TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material"
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"

import { useDispatch } from "react-redux"
import { updateBooking } from "@/redux/features/bookingSlice"

import { AppDispatch } from "@/redux/store"

export default function Manage() {
    const router = useRouter()
    const { data: session } = useSession()
    const token = session?.user?.token
    const searchParams = useSearchParams()
    const bookingId = searchParams.get('bookingId')
    const hotelName = searchParams.get('hotelName')

    const [bookingData, setBookingData] = useState<BookingObject | null>(null)
    const [availableRooms, setAvailableRooms] = useState<RoomJson | null>(null)
    
    // Form states (initialized from booking data)
    const [checkInDate, setCheckInDate] = useState<dayjs.Dayjs | null>(null)
    const [checkOutDate, setCheckOutDate] = useState<dayjs.Dayjs | null>(null)
    const [numPeople, setNumPeople] = useState<number>(1)
    const [roomNumber, setRoomNumber] = useState("")
    const [hotelId, setHotelId] = useState<string | undefined>(undefined);

    const [prevRoomNumber, setPrevRoomNumber] = useState("") // Track previous room

    const [error, setError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useDispatch<AppDispatch>()

    const fetchBooking = async () => {
        if (!session) {
            setError("You must be logged in to manage bookings.")
            return
        }

        if (!token || !bookingId) {
            router.push('/')
            return
        }

        try {
            setIsLoading(true)
            const booking: BookingObject = await getBooking(token, bookingId)
            setBookingData(booking)

            // Initialize form values
            setCheckInDate(booking.data.check_in_date ? dayjs(booking.data.check_in_date) : null)
            setCheckOutDate(booking.data.check_out_date ? dayjs(booking.data.check_out_date) : null)
            setNumPeople(booking.data.num_people)
            setRoomNumber(booking.data.room_id.room_number)
            setPrevRoomNumber(booking.data.room_id.room_number) // Store initial room number
            setHotelId(undefined);

            // Fetch available rooms
            const rooms: RoomJson = await getRooms(booking.data.hotel_id._id)
            setAvailableRooms(rooms)
            
            setIsLoading(false)
        } catch (err) {
            console.log("Failed to fetch booking", err)
            setError("Failed to load booking details. Please try again later.")
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchBooking()
    }, [token, bookingId, session, router])

    const handleUpdateBooking = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        if (!checkInDate || !checkOutDate || !roomNumber) {
            setError("Check-in date, check-out date, and room selection are required.");
            return;
        }
    
        if (!session || !token) {
            setError("You must be logged in to make a booking.");
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
    
        setIsLoading(true);
        setError("");
    
        try {

            if (!bookingId) {
                setError("Booking ID is required.");
                return;
            }

            if (!token || !prevRoomNumber) {
                setError("Missing required data for room update.");
                return;
            }

            // Update previous room status if changed
            if (prevRoomNumber && prevRoomNumber !== roomNumber) {
                // Find the room_id from availableRooms that corresponds to prevRoomNumber
                const prevRoom = availableRooms?.room.find(room => room.room_number === prevRoomNumber);
                if (prevRoom) {
                    await updateRoomStatus(token, prevRoom._id, "available");
                }
            }
    
            // Find the room_id for the new room based on roomNumber
            const newRoom = availableRooms?.room.find(room => room.room_number === roomNumber);
            if (newRoom) {
                // Call API to update booking
                const updatedBooking = await userUpdateBooking(
                    token,
                    bookingId, // Ensure `bookingId` is defined
                    hotelId, // Ensure `hotelId` is defined
                    checkInDate.format("YYYY-MM-DD"),
                    checkOutDate.format("YYYY-MM-DD"),
                    newRoom.room_number, // Use the room number of the new room
                    numPeople, // Ensure `numPeople` is defined
                    "pending"
                );
    
                dispatch(updateBooking(updatedBooking))

                await updateRoomStatus(token,newRoom._id,"pending");
                
                await fetchBooking()
                
                setSuccessMessage("Booking updated successfully!");
                
                console.log("Updated Booking:", updatedBooking);
            } else {
                setError("Selected room is not available.");
            }
        } catch (err) {
            console.log("Failed to update booking", err);
            const errorMessage = err instanceof Error ? err.message : "Failed to update booking.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <main className="flex flex-col md:flex-row justify-center items-start gap-6 p-4 min-h-screen bg-gray-100">
            {/* Current Booking Details */}
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Current Booking Detail</h2>
                {isLoading ? (
                    <div className="flex justify-center p-4">Loading booking details...</div>
                ) : bookingData ? (
                    <div className="space-y-3">
                        <div className="flex justify-between border-b pb-2">
                            <strong>Name-Lastname:</strong>
                            <span>{bookingData.data.account_id.first_name} {bookingData.data.account_id.last_name}</span>
                        </div>
    
                        <div className="flex justify-between border-b pb-2">
                            <strong>Hotel:</strong>
                            <span>{hotelName}</span>
                        </div>
    
                        <div className="flex justify-between border-b pb-2">
                            <strong>Room Number:</strong>
                            <span>{bookingData.data.room_id.room_number}</span>
                        </div>
    
                        <div className="flex justify-between border-b pb-2">
                            <strong>Amount Of People:</strong>
                            <span>{bookingData.data.num_people}</span>
                        </div>

                        <div className="flex justify-between border-b pb-2">
                            <strong>Room Capacity:</strong>
                            <span>{bookingData.data.room_id.capacity}</span>
                        </div>
    
                        <div className="flex justify-between border-b pb-2">
                            <strong>Check-In Date:</strong>
                            <span>{bookingData.data.check_in_date}</span>
                        </div>
    
                        <div className="flex justify-between">
                            <strong>Check-Out Date:</strong>
                            <span>{bookingData.data.check_out_date}</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500">No booking data available</div>
                )}
            </div>
    
            {/* Update Booking Form */}
            <div className="w-full max-w-lg">
                <form onSubmit={handleUpdateBooking}>
                    <div className="bg-white rounded-lg flex flex-col justify-center w-full space-y-10 px-10 py-10 shadow-lg">
                        <h2 className="text-xl font-bold text-center text-gray-800 mb-2">Update Booking</h2>
    
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TextField
                                type="number"
                                variant="standard"
                                name="numpeople"
                                label="Amount of People (optional)"
                                value={numPeople}
                                onChange={(e) => setNumPeople(parseInt(e.target.value) || 1)}
                                InputProps={{ inputProps: { min: 1 } }}
                                fullWidth
                            />
    
                            <FormControl fullWidth variant="standard">
                                <InputLabel>Room Number</InputLabel>
                                <Select value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)}>
                                    {availableRooms?.room?.map((room) => (
                                        <MenuItem key={room.room_number} value={room.room_number}>
                                            Room {room.room_number} - {room.status}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
    
                            <DatePicker label="Check-in Date" value={checkInDate} onChange={setCheckInDate} />
                            <DatePicker label="Check-out Date" value={checkOutDate} onChange={setCheckOutDate} />
    
                            <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg">Update Booking</button>
                        </LocalizationProvider>
                    </div>
                </form>
                    {/* Error Box */}
                {error && (
                    <div className="w-full bg-red-500 text-white text-center font-semibold rounded-lg p-3 mt-10 shadow-md shadow-gray-500">
                        {error}
                    </div>
                )}
        
                {/* Success Box */}
                {successMessage && (
                    <div className="w-full bg-green-500 text-white text-center font-semibold rounded-lg p-3 mt-10 shadow-md shadow-gray-500">
                        {successMessage}
                        <div className="mt-3">
                            <Link href="/mybooking" className="text-blue-200 hover:text-blue-400 underline">
                                Go to My Bookings
                            </Link>
                        </div>
                    </div>
                )}
            </div>
    
            {/* Debugging State Values */}
            {/* <div>
                <div>Hotel Id: {hotelId}</div>
                <div>Booking Id: {bookingId}</div>
                <div>Num People: {numPeople}</div>
                <div>Room Number: {roomNumber}</div>
                <div>Previous Room Number: {prevRoomNumber}</div>
                <div>Check-in: {checkInDate?.toString()}</div>
                <div>Check-out: {checkOutDate?.toString()}</div>
            </div> */}
        </main>
    );
    
}
