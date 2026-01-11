const Item = require("../models/Item");
const User = require("../models/User");

// @desc    Get all items
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { status: "Available" }; // Default to showing available items

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const items = await Item.find(query).populate(
      "owner",
      "name email collegeName reputationScore"
    );
    res.status(200).json(items);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      "owner",
      "name email collegeName reputationScore"
    );

    if (!item) {
      res.status(404);
      throw new Error("Item not found");
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
};

// @desc    Create new item
// @route   POST /api/items
// @access  Private
const createItem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      images,
      listingType,
      price,
      rentPricePerDay,
      securityDeposit,
    } = req.body;

    const item = await Item.create({
      title,
      description,
      category,
      images,
      listingType,
      price,
      rentPricePerDay,
      securityDeposit,
      owner: req.user.id,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error("Item not found");
    }

    // Check for user
    if (!req.user) {
      res.status(401);
      throw new Error("User not found");
    }

    // Make sure the logged in user matches the goal user
    if (item.owner.toString() !== req.user.id) {
      res.status(401);
      throw new Error("User not authorized");
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error("Item not found");
    }

    // Check for user
    if (!req.user) {
      res.status(401);
      throw new Error("User not found");
    }

    // Make sure the logged in user matches the goal user
    if (item.owner.toString() !== req.user.id) {
      res.status(401);
      throw new Error("User not authorized");
    }

    await item.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
