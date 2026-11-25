const app = require("../src/app");
const connectDB = require("../src/config/db");

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (error) {
    console.error("API database connection failed:", error);
    return res.status(503).json({ error: "Database unavailable" });
  }

  return app(req, res);
};
