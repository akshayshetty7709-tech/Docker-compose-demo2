const path = require("path");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

const products = [
  { name: "Oak Sit-Stand Desk", category: "Desks", price: 649, colors: ["#c9a06a", "#7a5c3e", "#2c2c2c"] },
  { name: "Anders Task Chair", category: "Seating", price: 389, colors: ["#4a5240", "#8a8578", "#c2b8a3"] },
  { name: "Arc Desk Lamp", category: "Lighting", price: 89, colors: ["#c2c2c2", "#2c2c2c", "#c9a06a"] },
  { name: "Felt Cable Tray", category: "Accessories", price: 29, colors: ["#8a8578", "#c2b8a3"] },
  { name: "Birch Monitor Riser", category: "Desks", price: 119, colors: ["#c9a06a", "#e3d3b8"] },
  { name: "Low-Back Lounge Stool", category: "Seating", price: 219, colors: ["#7a5c3e", "#2c2c2c"] },
  { name: "Halo Ring Light", category: "Lighting", price: 129, colors: ["#c2c2c2", "#2c2c2c"] },
  { name: "Canvas Desk Mat", category: "Accessories", price: 45, colors: ["#4a5240", "#8a8578", "#c9a06a"] },
  { name: "Walnut Bookend Pair", category: "Accessories", price: 39, colors: ["#7a5c3e"] },
  { name: "Corner Standing Desk", category: "Desks", price: 799, colors: ["#2c2c2c", "#c9a06a"] }
];

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`service-c listening on port ${PORT}`);
});
