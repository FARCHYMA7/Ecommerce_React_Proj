const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true 
        },
        detail: { 
            type: String, 
            required: true 
        },
        stock: { 
            type: Number, 
            required: true 
        },
        price: { 
            type: Number, 
            required: true 
        },
        productImg: { 
            type: String, 
            required: true 
        },
        size: {
            type: String,
            enum: ['40”', '45”', '50”', '55”', '60”', '65”', '70”', '75”'],
        },
        resolution: {
            type: String,
            enum: ['HDMI', '2K', '4K', '8K']
        }
    },
    {
        timestamps: true // This will automatically create createdAt and updatedAt fields
    }
);

const Product = mongoose.model("Product", productSchema);

module.exports = { Product } 