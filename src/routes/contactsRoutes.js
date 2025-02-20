import express from "express";
import contactsController from "../controllers/contactsController.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";

const router = express.Router();

router.get("/", ctrlWrapper(contactsController.getAllContacts));
router.get("/:id", ctrlWrapper(contactsController.getContactById));
router.post("/", ctrlWrapper(contactsController.createContact));
router.patch("/:id", ctrlWrapper(contactsController.updateContact));
router.delete("/:id", ctrlWrapper(contactsController.deleteContact));
router.put("/:id", ctrlWrapper(contactsController.upsertContact));
export default router;
