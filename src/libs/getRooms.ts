export default async function getRooms(hid:string){
    
    // add timeout for loading delay testing
    // await new Promise((resolve)=>setTimeout(resolve,5000))

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/hotels/${hid}/rooms`,{
        cache:'no-store',
        next:{
            tags:['rooms'],
            revalidate:0
        }
    });
    if(!response.ok){
        throw new Error("Failed to fetch rooms")
    }

    return await response.json();

}