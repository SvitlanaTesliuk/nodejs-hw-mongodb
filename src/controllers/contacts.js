import e from 'cors';
import { getAllContacts, getContactById, createContact, deleteContact, updateContact } from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getAllContactsController = async (req, res) => {
        const contacts = await getAllContacts();
        res.status(200).json({
            status: 200,
            message: "Successfully found contacts!",
            data: contacts });
};

export const getContactByIdController = async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
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
export const createContactController = async (req, res) => {
        const contact = await createContact(req.body);
        res.status(201).json({
            status: 201,
            message: "Successfully created contact!",
            data: contact});
};

export const updateContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await updateContact(contactId, req.body);
        if (!contact) {
        next( createHttpError(404, 'Contact not found'));
        return;
        }
        res.status(200).json({
            status: 200,
            message: "Successfully updated contact!",
            data: contact });
};

export const deleteContactController = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const contact = await deleteContact(contactId);

        if (!contact) {
        next(createHttpError(404, 'Contact not found'));
        return;
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
