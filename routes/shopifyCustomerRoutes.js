import express from "express";
import shopifyCustomerController from "../controller/shopifyCustomerController.js";


const router = express.Router();

router.get("/", shopifyCustomerController.getCustomers);
router.post("/", shopifyCustomerController.createCustomers);

export default router;
