
export default async function getHotel(id:string){

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/hotels/${id}`,{
        cache:'no-store',
        next:{
            tags:['rooms'],
            revalidate:0
        }
    })
    if(!response.ok){
        throw new Error("Failed to fecth hotel");
    }

    return await response.json();
}