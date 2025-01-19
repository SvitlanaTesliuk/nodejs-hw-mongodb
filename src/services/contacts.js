// Додайте виведення для дебагу
console.log('Current directory:', __dirname);
console.log('Attempting to import Contact from: ../../src/models/Contact.js');

import Contact from '../../src/models/Contact.js';
export const getAllContacts = async () => {
  return await Contact.find({});
};
export const findContactById = async (id) => {
    return await Contact.findById(id);
  };
