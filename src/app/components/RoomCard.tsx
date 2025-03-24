import Link from "next/link";

export default function RoomCard({
    _id,
    hotelid,
    roomNumber,
    roomCapacity,
    price,
    status,
}: {
    _id: string;
    hotelid: string;
    roomNumber: string;
    roomCapacity: number;
    price: number;
    status: string;
}) {
    return (
        <div className="bg-slate-200 w-[80%] m-5 p-5 text-[15px] rounded-lg shadow-lg relative">
            {/* Room Number */}
            <div className="flex justify-between mb-3">
                <span className="font-bold">Room Number</span>
                <span>{roomNumber}</span>
            </div>

            {/* Capacity */}
            <div className="flex justify-between mb-3">
                <span className="font-bold">Capacity</span>
                <span>{roomCapacity}</span>
            </div>

            {/* Price Per Night */}
            <div className="flex justify-between mb-3">
                <span className="font-bold">Price Per Night (Baht)</span>
                <span>{price}</span>
            </div>

            {/* Status */}
            <div className="flex justify-between mb-6">
                <span className="font-bold">Status</span>
                <span
                    className={`font-semibold ${
                        status === "pending"
                            ? "text-yellow-600"
                            : status === "booked"
                            ? "text-red-600"
                            : "text-green-600"
                    }`}
                >
                    {status}
                </span>
            </div>

            {/* Book Button at the bottom right */}
            <Link href={`/booking?hotelId=${hotelid}&roomId=${_id}`} passHref>
                <button
                    className={`text-white font-medium p-2 rounded-lg ${
                        status === "pending" || status === "booked"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-800"
                    }`}
                    disabled={status === "pending" || status === "booked"}
                >
                    {status === "pending" || status === "booked"
                        ? "Booked"
                        : "Book Room"}
                </button>
            </Link>
        </div>
    );
}
