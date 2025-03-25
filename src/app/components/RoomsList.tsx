import { RoomItem, RoomJson } from "../../../interface";
import RoomCard from "./RoomCard";

export default async function RoomsList({rooms}:{rooms:RoomJson}){
    
    const roomsJsonReady = await rooms;
    
    return(
        <div className="flex bg-gray-200 p-10 pt-20 flex-wrap justify-center gap-4 px-4 relative">
            <h1 style={{fontSize:"30px", fontWeight:"800", marginBottom:"20px", position:"absolute", top:"15px"}}>Choose Your Room</h1>
            {
                roomsJsonReady.room.map((roomItem:RoomItem)=>(
                    <RoomCard
                    _id={roomItem._id}
                    hotelid={roomItem.hotel_id}
                    roomNumber={roomItem.room_number}
                    roomCapacity={roomItem.capacity}
                    price={roomItem.price_per_night}
                    status={roomItem.status}/>
                ))
            }
        </div>
    );
}