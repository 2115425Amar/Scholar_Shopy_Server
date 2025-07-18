import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.mjs";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
// import emailRoute from "./routes/emailRoute.js";
import cors from "cors";

//to deploy 
import path from 'path';
import { fileURLToPath } from "url";

//configure env
dotenv.config();

//databse config
connectDB();

//esmodulefix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//rest object
const app = express();

// Stripe webhook needs raw body
app.use(
  "/api/v1/product/stripe-webhook",
  express.raw({ type: "application/json" })
);

//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, './client/build')))


//routes    authRoutes from "./routes/authRoute.js"
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
// console.log(emailRoute);
// app.use("/api/v1/email", emailRoute);

// Optional: Health Check
app.get("/", (req, res) => {
  res.send("🚀 MERN backend is live on Azure!");
});


// app.use('*',function(req,res){
//   res.sendFile(path.join(__dirname, "./client/build/index.html"));
// })



//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});
