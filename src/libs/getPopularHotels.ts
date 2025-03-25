export default async function getPopularHotels(){
    
  // add timeout for loading delay testing
  // await new Promise((resolve)=>setTimeout(resolve,5000))

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/hotels/popular?limit=6`,{
      method:'GET',
      headers: {
        "Content-Type": "application/json",
      }
  });
  if(!response.ok){
      throw new Error("Failed to fetch hotels")
  }

  const result = await response.json();

  console.log(result);

  return result;

}