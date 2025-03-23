
export default async function getBooking(token:string|undefined,id:string|null){

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/${id}`,{
        method:'GET',
        headers: {
            "Authorization": `Bearer ${token}`
        },
    })

    const data = await response.json();

    if(!response.ok){
        throw new Error(`Error fecth booking with message: ${data.message}`);
    }

    return data ;
}