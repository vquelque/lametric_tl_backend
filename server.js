const express = require("express");

const routes = require("./routes/tl_routes");
const app = express();
const server_port = process.env.PORT || 8080;
const server_ip_address = process.env.IP || "127.0.0.1";
app.use("/", routes);
app.listen(server_port, server_ip_address, () =>
  console.log(`Server listening on port ${server_ip_address}:${server_port}!`)
);
