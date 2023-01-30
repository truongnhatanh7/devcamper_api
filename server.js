const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// load Env
dotenv.config({ path: "./config/config.env" });

// Connect db
connectDB();

// Route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// File uploading
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limitting, 100 reqs/10min
const limiter = rateLimit({
	window: 10 * 60 * 1000, // 10 mins
	max: 100,
});

app.use(limiter);

app.use("hpp");

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);

app.use(errorHandler);

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
