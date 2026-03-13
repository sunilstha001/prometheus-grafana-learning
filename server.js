const express = require("express");
const client = require("prom-client");

const app = express();
const PORT = 3000;


// Create a registry where metrics are stored

const register = new client.Registry();

/*
Collect default Node.js metrics
CPU
Memory
Event loop delay
*/
client.collectDefaultMetrics({
  register
});


//Custom metric: HTTP request counter

const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"]
});

register.registerMetric(httpRequestCounter);

// Example route

app.get("/", (req, res) => {

  httpRequestCounter.inc({
    method: req.method,
    route: req.path,
    status: 200
  });

  res.send("Hello from Prometheus monitored app");
});


// Metrics endpoint for Prometheus

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});