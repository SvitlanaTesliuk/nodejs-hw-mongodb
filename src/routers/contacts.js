import express from 'express';
import { getAllContactsController, getContactByIdController, createContactController, deleteContactController, updateContactController } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { errorHandler } from '../middlewares/errorHandler.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { checkRoles } from '../middlewares/checkRoles.js';
import { authenticate } from '../middlewares/authenticate.js';
import { ROLES } from '../constants/index.js';


const router = express.Router();

router.use(authenticate);

router.get('/',authenticate, ctrlWrapper(getAllContactsController));
router.get('/', checkRoles(ROLES.TEACHER), ctrlWrapper(getAllContactsController));
router.get('/:contactId',checkRoles(ROLES.TEACHER, ROLES.PARENT),isValidId, ctrlWrapper(getContactByIdController));
router.post('/',checkRoles(ROLES.TEACHER), validateBody(createContactSchema), ctrlWrapper(createContactController));
router.patch('/:contactId',checkRoles(ROLES.TEACHER, ROLES.PARENT),isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContactController));
router.delete('/:contactId',checkRoles(ROLES.TEACHER,),isValidId, ctrlWrapper(deleteContactController));

router.use(errorHandler);

export default router;
