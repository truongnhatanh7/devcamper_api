const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");

const app = express();

// Body parser
app.use(express.json());

// load Env
dotenv.config({ path: "./config/config.env" });

// Connect db
connectDB();

// Route files
const bootcamps = require("./routes/bootcamps");

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 6969;

const server = app.listen(
	PORT,
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
			.yellow.bold
	)
);

// Handle unhanlded prmosie rejections
process.on("unhandledRejection", (err, promise) => {
	console.log(`Error: ${err.message}`.red);
	server.close(() => {
		process.exit(1);
	});
});
