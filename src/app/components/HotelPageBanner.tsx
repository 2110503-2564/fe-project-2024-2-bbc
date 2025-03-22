import Image from "next/image";

export default function HotelPageBanner({hotelName}:{hotelName:string}) {
    return (
        <div className="relative mx-5 mb-10 w-[calc(100vw-40px)] h-[20vh] rounded-lg overflow-hidden shadow-lg">
            {/* Current image */}
            <Image 
                src="/img/samplehotel.jpg"
                alt="current cover"
                fill
                className="object-cover transition-opacity duration-1000"
            />

            <div className='absolute inset-0 bg-gradient-to-t from-[#232c36] to-transparent z-10'></div>

            {/* Text content */}
            <div className="absolute bottom-10 left-2 right-2 text-white p-3 z-30">
                <h1 className="mb-5 text-4xl font-sans font-medium text-center drop-shadow-lg">{hotelName}</h1>
            </div>
        </div>
    );
}
