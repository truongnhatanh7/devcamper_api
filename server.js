const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const app = express();

// Route files
const bootcamps = require("./routes/bootcamps");

// load Env
dotenv.config({ path: "./config/config.env" });

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 6969;

app.listen(
	PORT,
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
	)
);
