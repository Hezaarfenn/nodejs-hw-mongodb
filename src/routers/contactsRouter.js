import express from "express";
import contactsController from "../controllers/contactsController.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../validation/contactSchema.js";
import isValidId from "../middlewares/isValidId.js";
import validateBody from "../middlewares/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import uploadMulter from "../middlewares/uploadMulter.js";

const router = express.Router();

router.use(authenticate);

router.get("/", contactsController.getAllContacts);

router.get("/:id", isValidId, contactsController.getContactById);

router.post(
  "/",
  uploadMulter.single("photo"),
  validateBody(createContactSchema),
  contactsController.createContact,
);

router.patch(
  "/:id",
  isValidId,
  uploadMulter.single("photo"),
  validateBody(updateContactSchema),
  contactsController.updateContact,
);

router.delete("/:id", isValidId, contactsController.deleteContact);

router.put(
  "/:id",
  isValidId,
  uploadMulter.single("photo"),
  validateBody(updateContactSchema),
  contactsController.upsertContact,
);

export default router;
