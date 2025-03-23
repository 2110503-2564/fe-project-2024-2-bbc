export default async function updateRoomStatus(
    token: string,
    room_id: string,
    status: string
) {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms/${room_id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ 
                    status 
                }), // Only updating the status field
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Failed to update room status: ${data.message}`);
        }

        return data; // Return updated room data
    } catch (err) {
        console.error("Failed to update room status:", err);
        throw err;
    }
}
