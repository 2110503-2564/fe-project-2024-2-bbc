import Link from "next/link";

export default function RoomCard({
    _id,
    hotelid,
    roomNumber,
    roomCapacity,
    price,
    status,
  }: {
    _id:string,
    hotelid:string,
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
          <span className="text-green-600 font-semibold">{status}</span>
        </div>
        
        {/* Book Button at the bottom right */}
        <Link href={`/booking?hotelId=${hotelid}&roomId=${_id}`}>
          <button className="bg-blue-500 text-white font-medium p-2 rounded-lg hover:bg-blue-800">
              Book Room
          </button>
        </Link>
      </div>
    );
  }
  