import Contact from "../db/models/Contact.js";
import createErrors from "http-errors";

const getAllContacts = async () => {
  return await Contact.find();
};

const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  if (!contact) {
    throw createErrors(404, "Contact not found");
  }
  return contact;
};

const createContact = async (contact) => {
  return await Contact.create(contact);
};

const updateContact = async (contactId, contact) => {
  return await Contact.findByIdAndUpdate(contactId, contact, { new: true });
};

const deleteContact = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};

const upsertContact = async (contactId, payload, options = {}) => {
  const rawResult = await Contact.findOneAndUpdate(
    { _id: contactId },
    { $set: payload },
    {
      new: true,
      includeResultMetadata: true,
      upsert: true,
      ...options,
    },
  );

  if (!rawResult) return null;

  return {
    contact: rawResult,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export default {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  upsertContact,
};
