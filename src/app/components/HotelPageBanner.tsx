import Image from "next/image";
import styles from "./banner.module.css";

export default function HotelPageBanner({hotelName}:{hotelName:string}) {
    return (
        <div className={`relative mx-5 mb-10 w-[calc(100vw-40px)] h-[20vh] overflow-hidden ${styles.bannerImg}`}>
            {/* Current image */}
            <Image 
                src="/img/samplehotel.jpg"
                alt="current cover"
                fill
                className="object-cover transition-opacity duration-1000"
            />
            <div className={`${styles.bannerFade}`}></div>
            <div className={`${styles.bannerLinearGradient}`}></div>
            <div className={`${styles.innerBorder}`}></div>

            {/* Text content */}
            <div className="absolute bottom-10 left-2 right-2 text-white p-3 z-30">
                <h1 className="mb-5 text-4xl font-sans font-medium text-center drop-shadow-lg">{hotelName}</h1>
            </div>
        </div>
    );
}
