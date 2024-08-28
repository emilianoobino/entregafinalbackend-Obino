import mongoose, { mongo } from "mongoose";

const carritosSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
}, 
{
    versionKey: false
})

const CarritosModel = mongoose.model("carts", carritosSchema);

export default CarritosModel;