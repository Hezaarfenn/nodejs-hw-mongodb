import express from "express";
import contactsController from "../controllers/contactsController.js";

const router = express.Router();

router.get("/", contactsController.getAllContacts);
router.get("/:id", contactsController.getContactById);

export default router;
