import Image from "next/image";
import styles from "./banner.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Session } from "next-auth"; // Import session type

// Define the expected prop type
interface BannerProps {
    session: Session | null;
}

export default function Banner({ session }: BannerProps) {
    const coverImage = [
        "/img/cover1.jpg",
        "/img/cover2.jpg",
        "/img/cover3.jpg",
    ];

    return (
        <div className={styles.bannerImg}>
            {/* Static Image */}
            <Image
                src={coverImage[0]}
                alt="cover"
                fill
                className="object-cover"
            />
            <div className={styles.bannerLinearGradient}></div>
            <div className={styles.innerBorder}></div>
            
            {/* Display user greeting if logged in */}
            {session && (
                <div className="z-30 absolute right-10 m-1 mt-5 font-semibold text-white text-lg">
                    Welcome {session.user?.account.role} {session.user?.account.first_name} {session.user?.account.last_name}
                </div>
            )}

            <div className={styles.bannerFade}></div>
            <div className={styles.bannerText}>
                <h1 style={{ marginBottom: "20px" }} className="text-4xl font-sans font-medium">
                    Discover the Unseen. Book the Unforgettable.
                </h1>
                <h4 className="font-sans font-medium">
                    Effortlessly uncover your perfect stay with our secure, streamlined booking system.
                    Find hidden gems, choose your dates, and book with confidence – seamless, simple, and stress-free.
                </h4>
            </div>
        </div>
    );
}
