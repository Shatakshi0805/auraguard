const mongoose = require("mongoose")
const dotenv = require("dotenv")
// dotenv is a Node.js library that lets you load environment variables from a .env file into process.env
// In any backend project, you need sensitive config values like:

// API keys
// Database URLs
// Port numbers
// JWT secrets
// Hardcoding them in your code is dangerous and unscalable.
// Instead, you store them in a .env file (which is not pushed to GitHub), and access them securely using process.env

process.on("uncaughtException", err => {
    console.log(err.name, err.message)
    console.log("Ucaught Exception! shutting down...")
    process.exit(1)
})

dotenv.config({path: "./.env"})
console.log("🧪 MONGO_URI from .env:", process.env.MONGO_URI);

const app = require("./app")

const DB = process.env.MONGO_URI;

console.log("🧪 Connecting to:", DB);
console.log("✅ Final DB URI:", DB);

// connect to DB
mongoose.connect(DB, {
  
  serverSelectionTimeoutMS: 5000,
  family: 4
}).then(() => {
  console.log(`✅ DB connection successful! ${DB}`);
}).catch(err => {
  console.error("Stack:", err.stack);
  console.error("❌ MongoDB error:", err.message);
});

// setup server
const port = process.env.PORT || 3000
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION! 💣 Shutting Down...');
    server.close(() => {//first close the running requests then exit the process
        process.exit(1);
    })
})
