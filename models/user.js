const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  resetToken: String,
  resetExpiration: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});
userSchema.method("addToCart", function (productId) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === productId.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: productId,
      quantity: newQuantity,
    });
  }
  const updatedCart = { items: updatedCartItems };
  this.cart = updatedCart;
  return this.save();
});
userSchema.method("removeFromCart", function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item._id.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
});

module.exports = mongoose.model("User", userSchema);
