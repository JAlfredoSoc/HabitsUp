const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log("Ya existe conexión a MongoDB");
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        isConnected = true;

        console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error("❌ Error conectando a MongoDB:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;