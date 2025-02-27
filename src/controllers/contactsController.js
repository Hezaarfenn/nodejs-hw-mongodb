import contactsService from "../services/contactsServices.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import createHttpError from "http-errors";
import parseSortParams from "../utils/parseSortParams.js";
import parsePaginationParams from "../utils/parsePaginationParams.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { checkAndCreateDir } from "../utils/checkAndCreateDir.js";
import { env } from "../utils/env.js";

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
      filterOptions,
      page,
      perPage,
      sortBy,
      sortOrder,
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
  const contact = await contactsService.getContactById(
    req.params.id,
    req.user._id,
  );
  if (!contact) {
    throw createHttpError(404, "Contact not found");
  }
  res.status(200).json({
    status: 200,
    message: "Successfully found contact with id {**contactId**}!",
    data: contact,
  });
};

const createContact = async (req, res) => {
  try {
    const photo = req.file;
    let photoUrl;
    if (photo) {
      if (env("ENABLE_CLOUDINARY") === "true") {
        photoUrl = await uploadToCloudinary(photo);
      } else {
        photoUrl = await checkAndCreateDir(photo);
      }
    }
    const contactData = { ...req.body, photoUrl, userId: req.user._id };
    const contact = await contactsService.createContact(contactData);

    res.status(201).json({
      status: 201,
      message: "Successfully created contact!",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "An error occurred while creating contact.",
      error: error.message,
    });
  }
};

const updateContact = async (req, res) => {
  try {
    const photo = req.file;
    let photoUrl;

    if (photo) {
      if (env("ENABLE_CLOUDINARY") === "true") {
        photoUrl = await uploadToCloudinary(photo);
      } else {
        photoUrl = await checkAndCreateDir(photo);
      }
    }

    const updateData = { ...req.body };
    if (photoUrl) {
      updateData.photoUrl = photoUrl;
    }

    const contact = await contactsService.updateContact(
      req.params.id,
      updateData,
      req.user._id,
    );

    if (!contact) {
      throw createHttpError(404, "Contact not found");
    }
    res.status(200).json({
      status: 200,
      message: "Successfully patched a contact!",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "An error occurred while updating contact.",
      error: error.message,
    });
  }
};

const deleteContact = async (req, res) => {
  const contact = await contactsService.deleteContact(
    req.params.id,
    req.user._id,
  );
  if (!contact) {
    throw createHttpError(404, "Contact not found");
  }
  res.status(204).send();
};

const upsertContact = async (req, res, next) => {
  const contact = req.params.id;
  const userId = req.user._id;

  const result = await contactsService.upsertContact(
    contact,
    { ...req.body, userId },
    {
      upsert: true,
    },
  );

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

const patchContact = async (req, res) => {
  const contact = await contactsService.patchContact(
    req.params.id,
    req.body,
    req.user._id,
  );
  if (!contact) throw createHttpError(404, "Contact not found");

  res.status(200).json({
    status: 200,
    message: "Successfully patched a contact!",
    data: contact,
  });
};

const contactsController = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  deleteContact: ctrlWrapper(deleteContact),
  upsertContact: ctrlWrapper(upsertContact),
  patchContact: ctrlWrapper(patchContact),
};

export default contactsController;
