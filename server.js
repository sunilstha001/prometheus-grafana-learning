const express = require("express");
const client = require("prom-client");

const app = express();
const PORT = 3000;

// Create registry
const register = new client.Registry();

// Collect default Node.js metrics (CPU, memory, event loop)
client.collectDefaultMetrics({
    register
});

// Custom metric: HTTP request counter
const httpRequestsTotal = new client.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status"]
});

register.registerMetric(httpRequestsTotal);

// Example API route
app.get("/", (req, res) => {
    httpRequestsTotal.inc({
        method: req.method,
        route: req.path,
        status: 200
    });

    res.send("Hello Prometheus Monitoring 🚀");
});

// Metrics endpoint (Prometheus will scrape this)
app.get("/metrics", async (req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});