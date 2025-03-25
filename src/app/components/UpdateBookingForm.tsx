'use client'

import { useState, FormEvent } from "react"
import { HotelItem, RoomItem, BookingObject, RoomJson } from "../../../interface"
import updateRoomStatus from "@/libs/updateRoomStatus"
import userUpdateBooking from "@/libs/userUpdateBooking"
import { useRouter } from "next/navigation"
import { TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material"
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"
import Link from "next/link"


export default function UpdateBookingForm({
    bookingData,
    availableRooms,
    token,
    session,
    hotelName
}: {
    bookingData: BookingObject
    availableRooms: RoomJson
    token: string
    session: any
    hotelName: string
}) {
    const router = useRouter()

    // Form states (initialized from booking data)
    const [checkInDate, setCheckInDate] = useState<dayjs.Dayjs | null>(dayjs(bookingData.data.check_in_date))
    const [checkOutDate, setCheckOutDate] = useState<dayjs.Dayjs | null>(dayjs(bookingData.data.check_out_date))
    const [numPeople, setNumPeople] = useState<number>(bookingData.data.num_people)
    const [roomNumber, setRoomNumber] = useState(bookingData.data.room_id.room_number)
    const [hotelId, setHotelId] = useState(session.user.role === "super_admin" ? bookingData.data.hotel_id._id : undefined)
    const [status, setStatus] = useState(session.user.role === "hotel_admin" || session.user.role === "super_admin" ? bookingData.data.status : undefined)

    const [prevRoomNumber, setPrevRoomNumber] = useState(bookingData.data.room_id.room_number)
    const [error, setError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleUpdateBooking = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        if (!checkInDate || !checkOutDate || !roomNumber) {
            setError("Check-in date, check-out date, and room selection are required.");
            return;
        }
    
        if (!token) {
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
            // Update previous room status if changed
            if (prevRoomNumber && prevRoomNumber !== roomNumber) {
                const prevRoom = availableRooms.room.find((room: RoomItem) => room.room_number === prevRoomNumber);
                if (prevRoom) {
                    await updateRoomStatus(token, prevRoom._id, "available");
                }
            }
            
            // Find the new room
            const newRoom = availableRooms.room.find((room: RoomItem) => room.room_number === roomNumber);
            if (newRoom) {
                // Call API to update booking
                const updatedBooking = await userUpdateBooking(
                    token,
                    bookingData.data._id,
                    hotelId, // This can be undefined for non-super admins
                    checkInDate.format("YYYY-MM-DD"),
                    checkOutDate.format("YYYY-MM-DD"),
                    newRoom.room_number,
                    numPeople,
                    status // This can be undefined for users
                );
    
                // Update room status based on booking status
                if (status === "accept") {
                    await updateRoomStatus(token, newRoom._id, "booked");
                } else if (status === "reject") {
                    await updateRoomStatus(token, newRoom._id, "available");
                } else {
                    await updateRoomStatus(token, newRoom._id, "pending");
                }
                
                setSuccessMessage("Booking updated successfully!");
                setPrevRoomNumber(roomNumber)
                router.refresh()
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
                            <Select 
                                value={roomNumber} 
                                onChange={(e) => setRoomNumber(e.target.value)}
                                disabled={isLoading}
                            >
                                {availableRooms.room?.map((room: RoomItem) => (
                                    <MenuItem key={room.room_number} value={room.room_number}>
                                        Room {room.room_number} - {room.status}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <DatePicker 
                            label="Check-in Date" 
                            value={checkInDate} 
                            onChange={setCheckInDate} 
                            disabled={isLoading}
                        />
                        <DatePicker 
                            label="Check-out Date" 
                            value={checkOutDate} 
                            onChange={setCheckOutDate} 
                            disabled={isLoading}
                        />

                        {/* Show status field only for hotel admins and super admins */}
                        {(session.user.role === "hotel_admin" || session.user.role === "super_admin") && (
                            <FormControl fullWidth variant="standard">
                                <InputLabel>Status</InputLabel>
                                <Select 
                                    value={status} 
                                    onChange={(e) => setStatus(e.target.value)}
                                    disabled={isLoading}
                                >
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="accept">Accept</MenuItem>
                                    <MenuItem value="reject">Reject</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                        
                        {/* Show hotelId only for super admins */}
                        {session.user.role === "super_admin" && (
                            <TextField
                                label="Hotel ID"
                                value={hotelId}
                                onChange={(e) => setHotelId(e.target.value)}
                                fullWidth
                                disabled={isLoading}
                            />
                        )}

                        <button 
                            type="submit" 
                            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-800 disabled:bg-gray-400"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Updating...' : 'Update Booking'}
                        </button>
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
    )
}