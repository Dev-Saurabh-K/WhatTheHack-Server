const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Books",
        "Electronics",
        "Furniture",
        "Clothing",
        "Sports",
        "Other",
      ],
    },
    images: [
      {
        type: String, // Array of image URLs
      },
    ],
    listingType: {
      type: String,
      required: true,
      enum: ["Sell", "Rent", "Donate"],
    },
    price: {
      type: Number,
      required: function () {
        return this.listingType === "Sell";
      },
    },
    rentPricePerDay: {
      type: Number,
      required: function () {
        return this.listingType === "Rent";
      },
    },
    securityDeposit: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "Available",
      enum: ["Available", "Sold", "Rented", "Donated"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    currentBorrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Item", itemSchema);
