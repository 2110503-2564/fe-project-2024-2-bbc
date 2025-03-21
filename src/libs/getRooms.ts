export default async function getRooms(hid:{hid:string}){
    
    // add timeout for loading delay testing
    // await new Promise((resolve)=>setTimeout(resolve,5000))

    const response = await fetch(`${process.env.BACKEND_URL}/api/hotels/hid/rooms`,{next:{tags:['rooms']}});
    if(!response.ok){
        throw new Error("Failed to fetch rooms")
    }

    return await response.json();

}