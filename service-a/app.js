const path = require("path");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Serve the frontend (HTML/CSS/JS) from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Sample data — swap this for a real database/API later
const videos = [
  { title: "Docker Compose from Zero to Production", channel: "Container Corner", duration: "12:41", views: "48K", posted: "3 days ago" },
  { title: "Multi-Stage Builds: Shrink Your Images 10x", channel: "Backend Weekly", duration: "08:57", views: "21K", posted: "1 week ago" },
  { title: "Kubernetes vs Compose: When to Switch", channel: "ShipIt Live", duration: "19:03", views: "76K", posted: "2 weeks ago" },
  { title: "Building a CI/CD Pipeline for Node.js", channel: "Backend Weekly", duration: "15:22", views: "33K", posted: "4 days ago" },
  { title: "Live: Debugging a Broken Container", channel: "ShipIt Live", duration: "42:10", views: "9.4K", posted: "Yesterday" },
  { title: "Reverse Proxies Explained with Nginx", channel: "Container Corner", duration: "10:05", views: "58K", posted: "3 weeks ago" },
  { title: "Environment Variables Done Right", channel: "Backend Weekly", duration: "06:48", views: "17K", posted: "5 days ago" },
  { title: "Volumes, Bind Mounts & Where Your Data Lives", channel: "Container Corner", duration: "13:37", views: "29K", posted: "6 days ago" }
];

app.get("/api/videos", (req, res) => {
  res.json(videos);
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`service-a listening on port ${PORT}`);
});
