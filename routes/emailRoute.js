import express from "express";
import { sendAdminAccessRequest } from "../controllers/emailController";

// const { sendAdminAccessRequest } = require('../controllers/emailController');
const router = express.Router();

// Route for handling admin access requests
router.post("/request-admin-access", sendAdminAccessRequest);

export default router;