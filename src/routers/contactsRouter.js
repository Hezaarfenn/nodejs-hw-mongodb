import express from "express";
import contactsController from "../controllers/contactsController.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

router.use(authenticate);

router.get("/", contactsController.getAllContacts);
router.get("/:id", contactsController.getContactById);
router.post("/", contactsController.createContact);
router.patch("/:id", contactsController.updateContact);
router.delete("/:id", contactsController.deleteContact);
router.put("/:id", contactsController.upsertContact);

export default router;
