import mongoose from "mongoose";
const fineSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
        },
        fine: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            default: new Date()
        }
    }
)


const FineModel = mongoose.model("Fine", fineSchema);

export default FineModel;