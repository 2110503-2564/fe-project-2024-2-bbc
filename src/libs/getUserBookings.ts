export default async function getUserBookings(token: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch bookings");
    }

    return await response.json();
}