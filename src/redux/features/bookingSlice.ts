import { createSlice , PayloadAction } from "@reduxjs/toolkit"
import { BookingData, BookingItem } from "../../../interface"

type BookState = {
    bookItems:BookingData[]
}

const initialState:BookState = {bookItems:[]}

export const bookSlice = createSlice({
    name:'booking',
    initialState,
    reducers:{
        addBooking:(state,action:PayloadAction<BookingData>)=>{
            state.bookItems.push(action.payload);
        },
        removeBooking:(state,action:PayloadAction<BookingData>)=>{
            const remainItem = state.bookItems.filter(book=>{
                return((book.booking._id !== action.payload.booking._id))
            })
            state.bookItems = remainItem;
        },
        updateBooking: (state, action: PayloadAction<BookingData>) => {
            const index = state.bookItems.findIndex(book => book.booking._id === action.payload.booking._id);
            if (index !== -1) {
                state.bookItems[index] = action.payload;
            }
        }
    }
})

export const {addBooking,removeBooking,updateBooking} = bookSlice.actions
export default bookSlice.reducer