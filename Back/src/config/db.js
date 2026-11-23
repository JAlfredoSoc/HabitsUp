const mongoose = require("mongoose");
const seedInitialData = require("./seed");

let isConnected = false;
let memoryServer = null;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const useMemory =
    process.env.USE_MEMORY_DB === "true" || !process.env.MONGO_URI;

  if (!useMemory) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      isConnected = true;
      console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
      await seedInitialData();
      return conn.connection;
    } catch (error) {
      console.warn(
        `⚠️ No se pudo conectar a MONGO_URI (${error.message}). Intentando base de datos en memoria para pruebas...`
      );
    }
  }

  try {
    const path = require("node:path");
    const { MongoMemoryServer } = require("mongodb-memory-server");
    memoryServer = await MongoMemoryServer.create({
      binary: {
        downloadDir: path.resolve(__dirname, "../../.cache/mongodb-binaries"),
      },
      instance: {
        dbName: "habitsUp_Test",
      },
    });
    const uri = memoryServer.getUri("habitsUp_Test");
    const conn = await mongoose.connect(uri);
    isConnected = true;
    console.log(
      `✅ MongoDB en memoria conectado (db: ${conn.connection.name})`
    );
    await seedInitialData();
    return conn.connection;
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (memoryServer) {
      await memoryServer.stop();
      memoryServer = null;
    }
    isConnected = false;
  } catch (error) {
    console.error("Error cerrando conexión MongoDB:", error.message);
  }
};

module.exports = connectDB;
module.exports.disconnectDB = disconnectDB;
