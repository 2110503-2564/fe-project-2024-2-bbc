export default async function getUserProfile(token:string){
    const response = await fetch('${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me',{
        method:'GET',
        headers:{
            authorization:`Bearer ${token}`
        },
    })

    if(!response.ok){
        throw new Error("Failed to fecth user profile")
    }

    return await response.json();
}