import Image from "next/image";
import InteractiveCard from "./InteractiveCard";


export default function HotelCard({hotelName,imgSrc} : {hotelName:string,imgSrc:string}){

    return(
        <InteractiveCard contentName={hotelName}>
            <div className='w-full h-[70%] relative rounded-t-lg'>
                <Image src={imgSrc}
                alt='Hotel Picture'
                fill={true}
                className='object-cover rounded-t-lg'/>
            </div>
            <div className='w-full h-[15%] p-[10px] mt-5 md:mt-2 font-bold text-[18px]'>
                {hotelName}
            </div>
        </InteractiveCard>
    );

}