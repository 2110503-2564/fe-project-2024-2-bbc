import { RoomItem, RoomJson } from "../../../interface";
import RoomCard from "./RoomCard";

export default async function RoomsList({rooms}:{rooms:RoomJson}){
    
    const roomsJsonReady = await rooms;
    
    return(
        <div className="items-center flex flex-col">
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