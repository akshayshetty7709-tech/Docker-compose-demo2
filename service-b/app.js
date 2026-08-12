const path = require("path");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

const dashboardData = {
  stats: [
    { label: "Uptime (30d)", value: "99.97%", delta: "+0.02% vs last month", deltaDirection: "up", color: "mint" },
    { label: "Active Deployments", value: "6", delta: "2 in progress", deltaDirection: "", color: "indigo" },
    { label: "Open Incidents", value: "1", delta: "P3 · investigating", deltaDirection: "down", color: "amber" },
    { label: "Build Success Rate", value: "94.2%", delta: "-1.1% vs last week", deltaDirection: "down", color: "coral" }
  ],
  pipelines: [
    { name: "api-gateway", branch: "main", status: "success", statusLabel: "Passed", duration: "2m 14s", triggered: "4 min ago" },
    { name: "auth-service", branch: "release/2.3", status: "running", statusLabel: "Running", duration: "1m 02s", triggered: "1 min ago" },
    { name: "billing-worker", branch: "main", status: "success", statusLabel: "Passed", duration: "3m 40s", triggered: "22 min ago" },
    { name: "frontend-web", branch: "feature/cart-redesign", status: "failed", statusLabel: "Failed", duration: "0m 58s", triggered: "37 min ago" },
    { name: "notifications", branch: "main", status: "success", statusLabel: "Passed", duration: "1m 45s", triggered: "1 hr ago" }
  ],
  infrastructure: [
    { name: "api-gateway", status: "healthy", metric: "42ms p95" },
    { name: "postgres-primary", status: "healthy", metric: "12% CPU" },
    { name: "redis-cache", status: "degraded", metric: "71% hit ratio" },
    { name: "worker-pool", status: "healthy", metric: "8/8 nodes" },
    { name: "cdn-edge", status: "healthy", metric: "99.99% uptime" },
    { name: "message-queue", status: "healthy", metric: "134 msg/s" }
  ]
};

app.get("/api/dashboard", (req, res) => {
  res.json(dashboardData);
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`service-b listening on port ${PORT}`);
});
