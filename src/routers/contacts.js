import express from 'express';
import { getAllContactsController, getContactByIdController, createContactController, deleteContactController, updateContactController } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { errorHandler } from '../middlewares/errorHandler.js';

const router = express.Router();

router.get('/', ctrlWrapper(getAllContactsController));
router.get('/:contactId', ctrlWrapper(getContactByIdController));
router.post('/', ctrlWrapper(createContactController));
router.patch('/:contactId', ctrlWrapper(updateContactController));
router.delete('/:contactId', ctrlWrapper(deleteContactController));

router.use(errorHandler);

export default router;
