import Contact from '../models/Contact.js';
export const getAllContacts = async () => {
  return await Contact.find({});
};
export const findContactById = async (id) => {
    return await Contact.findById(id);
  };
