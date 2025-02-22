import createErrors from "http-errors";
import contactsService from "../services/contactsServices.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import createHttpError from "http-errors";
import parseSortParams from "../utils/parseSortParams.js";
import parsePaginationParams from "../utils/parsePaginationParams.js";

const getAllContacts = async (req, res) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const { type, isFavourite } = req.query;

    const filterOptions = {};
    if (type) {
      filterOptions.contactType = type;
      if (isFavourite) {
        filterOptions.isFavourite = isFavourite === "true";
      }
    }

    const contacts = await contactsService.getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      ...filterOptions,
    });

    res.status(200).json({
      status: 200,
      message: "Successfully found contacts!",
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error while getting contacts",
      error: error.message,
    });
  }
};

const getContactById = async (req, res) => {
  const contact = await contactsService.getContactById(req.params.id);
  if (!contact) {
    throw createErrors(404, "Contact not found");
  }
  res.status(200).json({
    status: 200,
    message: "Successfully found contact with id {**contactId**}!",
    data: contact,
  });
};

const createContact = async (req, res) => {
  const contact = await contactsService.createContact(req.body);
  res.status(201).json({
    status: 201,
    message: "Successfully created contact!",
    data: contact,
  });
};

const updateContact = async (req, res) => {
  const contact = await contactsService.updateContact(req.params.id, req.body);
  if (!contact) {
    throw createErrors(404, "Contact not found");
  }
  res.status(200).json({
    status: 200,
    message: "Successfully patched a contact!",
    data: contact,
  });
};

const deleteContact = async (req, res) => {
  const contact = await contactsService.deleteContact(req.params.id);
  if (!contact) {
    throw createErrors(404, "Contact not found");
  }
  res.status(204).send();
};

const upsertContact = async (req, res, next) => {
  const contact = req.params.id;

  const result = await contactsService.upsertContact(contact, req.body, {
    upsert: true,
  });

  if (!result) {
    next(createHttpError(404, "Contact not found"));
    return;
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message:
      status === 201
        ? "Successfully created contact!"
        : "Successfully updated contact!",
    data: result.contact,
  });
};

const contactsController = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  deleteContact: ctrlWrapper(deleteContact),
  upsertContact: ctrlWrapper(upsertContact),
};

export default contactsController;
