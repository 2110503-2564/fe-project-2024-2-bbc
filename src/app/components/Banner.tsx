'use client'

import styles from "./banner.module.css";
import Image from "next/image";
import { useState , useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Banner() {

    //data
    const coverImage = [
        '/img/cover1.jpg',
        '/img/cover2.jpg',
        '/img/cover3.jpg',
    ]
    const {data:session} = useSession();

    //state
    const [index,setImage] = useState(0);
    const [nextIndex,setNextImage] = useState(1);
    const [fade,setFade] = useState(false)

    const changeImage=()=>{
        setFade(true)
        setTimeout(()=>{
            setImage((prevIndex)=>(prevIndex+1)%coverImage.length)
            setFade(false)
        },1000)
    }

    useEffect(()=>{
        const interval = setInterval(changeImage,5000)
        return ()=>clearInterval(interval);
    },[])

    const router = useRouter()

    return(
       <div className={styles.bannerImg}>
            {/* current image */}
            <Image src={coverImage[index%coverImage.length]}
                alt="current cover"
                fill={true}
                className="object-cover transition-opacity duration-1000"
            />
            {/* next image */}
            <Image 
                src={coverImage[nextIndex%coverImage.length]} 
                alt="next cover" 
                fill 
                className={`absolute inset-0 object-cover transition-opacity duration-1000 ${fade ? 'opacity-100' : 'opacity-0'}`}
            />
            <div className={styles.innerBorder}></div>
            {
                session?<div className='z-30 absolute right-10 m-1 mt-5 font-semibold text-white text-lg'>
                    Welcome {session.user?.account.first_name +' '+session.user?.account.last_name}</div>
                :null
            }
            <div className={styles.bannerText}>
                <h1 style={{marginBottom:"20px"}} className='text-4xl font-sans font-medium'>Your Dream Hotel</h1>
                <h4 className='font-sans font-medium'>Effortlessly book your accommodation with our secure and streamlined booking system. Select your preferred hotel, choose your dates, and confirm your reservation with confidence.</h4>
            </div>
            <button className='bg-gradient-to-r from-blue-500 to-blue-800 text-white shadow-xl shadow-black
            font-semibold py-2 px-2 m-2 rounded z-30 absolute bottom-[15%] left-[5%]
            hover:bg-gradient-to-r hover:from-blue-800 hover:to-blue-500 hover:text-white hover:border-transparent'
            onClick={(e)=>{e.stopPropagation(); router.push('/hotel')}}>
                Choose Hotel
            </button>
        </div>
    );
};