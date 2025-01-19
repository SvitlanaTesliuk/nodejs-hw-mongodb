console.log('Current working directory:', process.cwd());
console.log('Directory name:', __dirname);
console.log('Import path:', import.meta.url);

import Contact from '../models/contact.js';

export const getAllContacts = async () => {
  return await Contact.find({});
};
export const findContactById = async (id) => {
    return await Contact.findById(id);
  };
