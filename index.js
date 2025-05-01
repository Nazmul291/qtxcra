// config
import "dotenv/config";
import "./config/logger.js"

// Packages 
import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors";

// Middleware
import errorHandler from "./middleware/errorHandlerMiddleware.js"

// Routes
import shopifyCustomerRoutes from "./routes/shopifyCustomerRoutes.js"

const app = express()

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use("/api/shopify/customer", shopifyCustomerRoutes)

app.use(errorHandler.handle)

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});