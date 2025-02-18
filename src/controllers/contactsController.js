import contactsService from "../services/contacts.js";

const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactsService.getAllContacts();
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
  try {
    const contact = await contactsService.getContactById(req.params.id);
    res.status(200).json({
      status: 200,
      message: "Successfully found contact with id {**contactId**}!",
      data: contact,
    });
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: "Contact not found",
      error: error.message,
    });
  }
};

const contactsController = {
  getAllContacts,
  getContactById,
};

export default contactsController;
