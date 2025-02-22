import Contact from "../db/models/Contact.js";
import createErrors from "http-errors";
import SORT_ORDER from "../constants/index.js";
import calculatePaginationData from "../utils/calculatePaginationData.js";

const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = "name",
  type,
  isFavourite,
}) => {
  const filterOptions = {};

  if (type) {
    filterOptions.contactType = type;
  }

  if (isFavourite) {
    filterOptions.isFavourite = isFavourite === "true";
  }

  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = Contact.find(filterOptions);
  const contactsCount = await Contact.countDocuments(filterOptions);

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, page, perPage);

  return {
    data: contacts,
    ...paginationData,
  };
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
