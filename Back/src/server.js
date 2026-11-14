require("dotenv").config();

const dns = require("node:dns");
const dnsServers = process.env.DNS_SERVERS
  ?.split(",")
  .map((server) => server.trim())
  .filter(Boolean);

if (dnsServers?.length) {
  dns.setServers(dnsServers);
}

const app = require("./app");
const connectDB = require("./config/db");
const iniciarScheduler = require("./scheduler/schedulersService");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
    console.log(`Docs: http://localhost:${PORT}/api-docs`);
  });

   iniciarScheduler();

};

startServer()