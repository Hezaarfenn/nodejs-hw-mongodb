import Contact from "../db/models/Contact.js";

const getAllContacts = async () => {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId);
    return contact;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default { getAllContacts, getContactById };
