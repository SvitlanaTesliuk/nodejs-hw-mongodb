
import { getAllContacts, getContactById, createContact, deleteContact, updateContact } from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

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

    const userId = req.user;
    const { name, email, phoneNumber } = req.body;
    let photoUrl = null;

    if (req.file?.path) {
      photoUrl = await saveFileToCloudinary(req.file);
    }

    const contact = await createContact(userId, { name, email, phoneNumber, photo: photoUrl });

    res.status(201).json({
      status: 201,
      message: "Successfully created contact!",
      data: contact
    });

};
export const updateContactController = async (req, res, next) => {

    const userId = req.user;
    const { contactId } = req.params;
    const updateData = { ...req.body };

    if (req.file?.path) {
      updateData.photo = await saveFileToCloudinary(req.file);
    }

    const contact = await updateContact(userId, contactId, updateData);

    if (!contact) {
      return next(createHttpError(404, 'Contact not found'));
    }

    res.status(200).json({
      status: 200,
      message: "Successfully updated contact!",
      data: contact
    });
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
