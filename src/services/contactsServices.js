import Contact from "../db/models/ContactModel.js";
import createHttpError from "http-errors";
import { SORT_ORDER } from "../constants/indexConstants.js";
import calculatePaginationData from "../utils/calculatePaginationData.js";

const getAllContacts = async ({
  filterOptions,
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = "name",
}) => {
  console.log("FilterOptions:", filterOptions);

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

const getContactById = async (contactId, userId) => {
  const contact = await Contact.findById({ _id: contactId, userId });
  if (!contact) {
    throw createHttpError(404, "Contact not found");
  }
  return contact;
};

const createContact = async (contact) => {
  return await Contact.create(contact);
};

const updateContact = async (contactId, contact, userId) => {
  return await Contact.findByIdAndUpdate({ _id: contactId, userId }, contact, {
    new: true,
  });
};

const deleteContact = async (contactId, userId) => {
  return await Contact.findByIdAndDelete({ _id: contactId, userId });
};

const upsertContact = async (contactId, payload, options = {}) => {
  const rawResult = await Contact.findOneAndUpdate(
    { _id: contactId, userId: payload.userId },
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

const patchContact = async (contactId, updateData, userId) => {
  return await Contact.findOneAndUpdate(
    { _id: contactId },
    { $set: updateData },
    { new: true },
  );
};

export default {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  upsertContact,
  patchContact,
};
