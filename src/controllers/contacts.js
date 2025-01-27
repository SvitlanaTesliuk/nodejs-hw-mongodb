import { getAllContacts, getContactById, createContact, deleteContact, updateContact } from '../services/contacts.js';
import HttpError from 'http-errors';

export const getAllContactsController = async (req, res) => {
    try {
        const contacts = await getAllContacts();
        res.status(200).json({
            status: 200,
            message: "Successfully found contacts!",
            data: contacts });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getContactByIdController = async (req, res, next) => {
    const { contactId } = req.params;
    try {
        const contact = await getContactById(contactId);
        if (!contact) {
            return next(HttpError(404, "Contact not found"));
        }
        res.status(200).json({
            status: 200,
            message: "Successfully found contact!",
            data: contact
        });
    } catch (error) {
        next(error);
    }
};
export const createContactController = async (req, res) => {
    try {
        const contact = await createContact(req.body);
        res.status(201).json({
            status: 201,
            message: "Successfully created contact!",
            data: contact});
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateContactController = async (req, res) => {
    const { contactId } = req.params;
    try {
        const contact = await updateContact(contactId, req.body);
        if (!contact) {
            return next(HttpError(404, 'Contact not found'));
        }
        res.status(200).json({
            status: 200,
            message: "Successfully updated contact!",
            data: contact });
    } catch (error) {
        next(error);
    }
};

export const deleteContactController = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const contact = await deleteContact(contactId);

        if (!contact) {
          return next(HttpError(404, 'Contact not found'));
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
