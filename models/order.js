const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;

const orderSchema = new Schema({
  products: [
    {
      product: {
        type: Object,
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],

  userId: { type: ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Order", orderSchema);
