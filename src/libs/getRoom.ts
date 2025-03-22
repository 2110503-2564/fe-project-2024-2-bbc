
export default async function getRoom(id:string){

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rooms/${id}`)
    if(!response.ok){
        throw new Error("Failed to fecth room");
    }

    return await response.json();
}