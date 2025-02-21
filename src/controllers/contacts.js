
import { getAllContacts, getContactById, createContact, deleteContact, updateContact } from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import  cloudinary  from '../utils/cloudinary.js';

export const getAllContactsController = async (req, res) => {
        const userId = req.user;
        const { page, perPage } = parsePaginationParams(req.query);
        const { sortOrder, sortBy } = parseSortParams(req.query);
        const contacts = await getAllContacts({
            userId,
            page,
            perPage,
            sortOrder,
            sortBy,
        });
        res.status(200).json({
            status: 200,
            message: "Successfully found contacts!",
            data: contacts });
};

export const getContactByIdController = async (req, res, next) => {

    const userId = req.user;
    const { contactId } = req.params;
    const contact = await getContactById( userId,contactId);
        if (!contact) {
            next (createHttpError(404, "Contact not found"));
            return;
        }
        res.status(200).json({
            status: 200,
            message: "Successfully found contact!",
            data: contact
        });
};
export const createContactController = async (req, res, next) => {
    try {
      const userId = req.user;
      if (!userId) return next(createHttpError(401, "Unauthorized"));

      const contactData = { ...req.body, userId };
      console.log(req.file)
      if (req.file) {
        const result = await (req.file.path, {
          folder: "contacts",
        });
        contactData.photo = result.secure_url;
      }
      const contact = await createContact(userId, contactData);

      res.status(201).json({
        status: 201,
        message: "Successfully created contact!",
        data: contact,
      });
    } catch (error) {
      console.error("Create Contact Error:", error);
      next(error);
    }
  };

  export const updateContactController = async (req, res, next) => {
    try {
      const userId = req.user;
      if (!userId) return next(createHttpError(401, "Unauthorized"));

      const { contactId } = req.params;
      let updateData = { ...req.body };

      const existingContact = await getContactById(userId, contactId);
      if (!existingContact) {
        return next(createHttpError(404, "Contact not found"));
      }

      if (req.file) {

        if (existingContact.photo) {
          try {
            const publicId = existingContact.photo.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`contacts/${publicId}`);
          } catch (err) {
            
          }
        }

        const result = await (req.file.path, {
          folder: "contacts",
        });
        updateData.photo = result.secure_url;
      }

      const updatedContact = await updateContact(userId, contactId, updateData);
      if (!updatedContact) {
        return next(createHttpError(404, "Contact not found"));
      }

      res.status(200).json({
        status: 200,
        message: "Successfully updated contact!",
        data: updatedContact,
      });
    } catch (error) {
      console.error("Update Contact Error:", error);
      next(error);
    }
  };

export const deleteContactController = async (req, res, next) => {
    const userId = req.user;
    const { contactId } = req.params;

    const contact = await deleteContact(userId, contactId);
    if (!contact) {
        return next(createHttpError(404, "Contact not found"));
    }

    res.status(204).send();
};
