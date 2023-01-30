const express = require("express");
const {
	register,
	login,
	getMe,
	forgotPassword,
	resetPassword,
	updateDetails,
	updatePassword,
	logout
} = require("../controllers/auth");

const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.post("/forgotpassword", forgotPassword);
router.put("/updatedetails", protect, updateDetails);
router.put("/resetpassword/:resettoken", resetPassword);
router.put("/updatepassword", protect, updatePassword);

module.exports = router;
