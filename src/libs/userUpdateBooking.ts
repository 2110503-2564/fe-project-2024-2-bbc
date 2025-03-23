export default async function userUpdateBooking(
    token: string,
    bid: string,
    hotel_id?: string,
    check_in_date?: string,
    check_out_date?: string,
    room_number?: string,
    num_people?: number,
    status?: string
) {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/${bid}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // Include authentication if needed
                },
                body: JSON.stringify({
                    hotel_id,
                    check_in_date,
                    check_out_date,
                    room_number,
                    num_people,
                    status,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Failed to update booking: ${data.message}`);
        }
        
        return data; // Return response data if needed
    } catch (err) {
        console.error("Failed to update booking:", err);
        throw err; // Re-throw error for higher-level handling
    }
}
