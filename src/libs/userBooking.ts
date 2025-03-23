export default async function userBooking(
    token:string,
    hotel_id:string,
    room_number:string,
    num_people:number,
    check_in_date:string,
    check_out_date:string
){
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                hotel_id,
                room_number,
                num_people,
                check_in_date,
                check_out_date
            })
        });

        const data = await response.json();

        if(!response.ok){
            throw new Error(`Error with message: ${data.message}`)
        }

        return data ;

    }catch(err){
        console.log("Booking Failed:",err)
        throw err;
    }
}