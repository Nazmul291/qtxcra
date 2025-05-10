import express from "express";
import shopifyCustomerController from "../controller/shopifyCustomerController.js";


const router = express.Router();

router.get("/", shopifyCustomerController.getCustomers);
router.get("/:email", shopifyCustomerController.getCustomerIdByEmail)
router.post("/", shopifyCustomerController.createCustomers);

export default router;
