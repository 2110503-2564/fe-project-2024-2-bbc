import Image from "next/image";
import InteractiveCard from "./InteractiveCard";
import styles from "./hotelcard.module.css";

export default function HotelCard({hotelName,imgSrc} : {hotelName:string,imgSrc:string}){

    return(
        <InteractiveCard contentName={hotelName}>
                    <div className='w-full h-full relative '>
                        <Image src={imgSrc}
                        alt='Hotel Picture'
                        fill={true}
                        className='object-cover '
                        />
                        <div className={styles.cardLinearGradient}></div>
                        <div className={styles.cardFade}></div>
                        <div className={`font-sans font-medium text-2xl ${styles.cardText}`}>
                        {hotelName}
                        </div>
                        <div className={styles.innerBorder}></div>
                    </div>
        </InteractiveCard>
    );

}