export default async function getAccounts(){
    
    // add timeout for loading delay testing
    // await new Promise((resolve)=>setTimeout(resolve,5000))

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/accounts`,{next:{tags:['accounts']}});
    if(!response.ok){
        throw new Error("Failed to fetch accounts")
    }

    return await response.json();

}