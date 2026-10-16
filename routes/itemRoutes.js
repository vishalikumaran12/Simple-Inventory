const express = require("express");
const router = express.Router();

const {
    getAllItems,
    getItemById,
    addItem,
    updateItem,
    deleteItem
} = require("../models/itemModel");

// GET all items + filtering + searching
router.get("/", (req, res) => {
    let items = getAllItems();

    const { category, minQuantity, maxQuantity, name } = req.query;

    if (category) {
        items = items.filter(
            item => item.category.toLowerCase() === category.toLowerCase()
        );
    }

    if (minQuantity !== undefined) {
        items = items.filter(
            item => item.quantity >= Number(minQuantity)
        );
    }

    if (maxQuantity !== undefined) {
        items = items.filter(
            item => item.quantity <= Number(maxQuantity)
        );
    }

    if (name) {
        items = items.filter(
            item => item.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    res.json(items);
});

// GET a single item
router.get("/:id", (req, res) => {
    const item = getItemById(req.params.id);

    if (!item) {
        return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
});

// POST: Add an item
router.post("/", (req, res) => {
    const { name, category, quantity, price } = req.body;

    if (
        typeof name !== "string" || !name.trim() ||
        typeof category !== "string" || !category.trim() ||
        quantity === undefined || quantity === null ||
        price === undefined || price === null ||
        quantity === "" || price === "" ||
        !Number.isFinite(Number(quantity)) ||
        !Number.isFinite(Number(price)) ||
        Number(quantity) < 0 ||
        Number(price) < 0
    ) {
        return res.status(400).json({
            message: "Provide a valid name, category, quantity and price"
        });
    }

    const newItem = addItem({
        name: name.trim(),
        category: category.trim(),
        quantity: Number(quantity),
        price: Number(price)
    });

    res.status(201).json(newItem);
});

// PUT: Update an item
router.put("/:id", (req, res) => {
    const { name, category, quantity, price } = req.body;

    const existingItem = getItemById(req.params.id);

    if (!existingItem) {
        return res.status(404).json({ message: "Item not found" });
    }

    const updates = {};

    if (name !== undefined) {
        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({ message: "Invalid name" });
        }
        updates.name = name.trim();
    }

    if (category !== undefined) {
        if (typeof category !== "string" || !category.trim()) {
            return res.status(400).json({ message: "Invalid category" });
        }
        updates.category = category.trim();
    }

    if (quantity !== undefined) {
        if (
            quantity === "" || quantity === null ||
            !Number.isFinite(Number(quantity)) ||
            Number(quantity) < 0
        ) {
            return res.status(400).json({ message: "Invalid quantity" });
        }
        updates.quantity = Number(quantity);
    }

    if (price !== undefined) {
        if (
            price === "" || price === null ||
            !Number.isFinite(Number(price)) ||
            Number(price) < 0
        ) {
            return res.status(400).json({ message: "Invalid price" });
        }
        updates.price = Number(price);
    }

    const updatedItem = updateItem(req.params.id, updates);

    res.json(updatedItem);
});

// DELETE an item
router.delete("/:id", (req, res) => {
    const deletedItem = deleteItem(req.params.id);

    if (!deletedItem) {
        return res.status(404).json({ message: "Item not found" });
    }

    res.json({
        message: "Item deleted successfully",
        item: deletedItem
    });
});

module.exports = router;