export interface HotelItem{
    address:{
        city:string,
        street_name:string,
        street_address:string,
        zipcode:string
    },
    location:{
        latitude:number,
        longtitude:number
    }
    _id:string,
    hotel_name:string,
    tel:string,
    __v:number,
    id:string
    // bookings:
}

export interface HotelData{
    hotel:{
        address:{
            city:string,
            street_name:string,
            street_address:string,
            zipcode:string
        },
        location:{
            latitude:number,
            longtitude:number
        }
        _id:string,
        hotel_name:string,
        tel:string,
        __v:number,
        id:string
    }
}

export interface HotelJson{
    count:number,
    hotels:HotelItem[]
}

export interface AccountItem{
    _id:string,
    first_name:string,
    last_name:string,
    tel:string,
    email:string,
    id:string
}

export interface AccountData{
    role:string,
    account:{
        _id:string,
        first_name:string,
        last_name:string,
        tel:string,
        email:string,
        id:string,
        role:string,
        create_at:string,
    }
}

export interface AccountJson{
    data:AccountItem[]
}

export interface RoomItem{
    _id:string,
    hotel_id:string,
    room_number:string,
    capacity:number,
    price_per_night:number,
    status:string,
    __v:number
}

export interface RoomData{
    room:{
        _id:string,
        hotel_id:string,
        room_number:string,
        capacity:number,
        price_per_night:number,
        status:string,
        __v:number
    }
}

// for /hotel/${hid}/rooms only!!! 
export interface RoomJson{
    count:number,
    hotel:HotelData,
    room:RoomItem[]
}

// for /mybooking/manage?bookingId=[]
export interface BookingObject{
    data:{
        account_id:AccountItem,
        check_in_date:string,
        check_out_date:string,
        createdAt:string,
        hotel_id:HotelItem,
        num_people:number,
        room_id:RoomItem,
        status:string,
        updatedAt:string,
        _id:string
    }
}

export interface BookingItem{
    _id:string,
    account_id:string,
    hotel_id:string,
    room_id:string,
    status:string,
    num_people:number,
    check_in_date:string,
    check_out_date:string
}

export interface BookingData{
    booking:{
        _id:string,
        account_id:string,
        hotel_id:string,
        room_id:string,
        status:string,
        num_people:number,
        check_in_date:string,
        check_out_date:string
    }
}

export interface BookingJson{
    count:number,
    data:BookingItem[]
}