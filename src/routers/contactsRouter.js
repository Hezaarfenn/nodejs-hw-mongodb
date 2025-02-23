import express from "express";
import contactsController from "../controllers/contactsController.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../middlewares/validateBody.js";
import isValidId from "../middlewares/isValidId.js";
import authenticate from "../middlewares/authenticate.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../validation/contactSchema.js";

const router = express.Router();

router.use(authenticate);

router.get("/", ctrlWrapper(contactsController.getAllContacts));
router.get("/:id", isValidId, ctrlWrapper(contactsController.getContactById));
router.post(
  "/",
  validateBody(createContactSchema),
  ctrlWrapper(contactsController.createContact),
);
router.patch(
  "/:id",
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(contactsController.updateContact),
);
router.delete("/:id", isValidId, ctrlWrapper(contactsController.deleteContact));
router.put("/:id", isValidId, ctrlWrapper(contactsController.upsertContact));
export default router;
