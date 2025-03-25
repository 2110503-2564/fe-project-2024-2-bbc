export default async function userLogin(userEmail:string,userPassword:string){
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/signin`,
        {
            method:'POST',
            headers:{
                'Content-type':"application/json"
            },
            // convert json object to json string
            body:JSON.stringify({
                email:userEmail,
                password:userPassword
            }),
        }
    )

    if(!response.ok){
        throw Error('failed to login')
    }

    return await response.json();

}