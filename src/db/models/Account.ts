import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema(
    {
        first_name: {
            type: String, 
            required: [true, 'Please add a first name']
        },
        last_name: {
            type: String, 
            required: [true, 'Please add a last name']
        },
        tel: {
            type: String,
            required: [true, 'Please add a telephone number'],
            unique: true,
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            match: [
                /^(?![.-])[A-Za-z0-9._%+-]+(?:[A-Za-z0-9-]*[A-Za-z0-9])?@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                'Please add a valid email'
            ]
        },
        password : {
            type : String ,
            required: [true, 'Please add a password'],
            minlenght: 6,
            select: false
        },
        role : { 
            type : String , 
            enum : ["user", "hotel_admin", "super_admin"] , 
            required : true 
        },
        hotel_id : {
            type : mongoose.Schema.ObjectId , 
            ref : 'Account',
            default : null 
        },
        create_at:{
            type: Date,
            default: Date.now
        },
    }
);

const Account = mongoose.models.Account || mongoose.model('Account',AccountSchema)

export default Account