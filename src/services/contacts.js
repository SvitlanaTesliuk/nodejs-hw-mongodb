import { Contact } from '../models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

/**
 * Отримати всі контакти конкретного користувача з пагінацією та сортуванням
 */
export const getAllContacts = async ({
  userId,
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = "_id",
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  // Фільтруємо контакти тільки для цього користувача
  const contactsQuery = Contact.find({ userId }).sort({ [sortBy]: sortOrder });
  const contactsCount = await Contact.countDocuments({ userId });

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

/**
 * Отримати контакт за ID, але тільки якщо він належить користувачеві
 */
export const getContactById = async (userId, id) => {
  return Contact.findOne({ _id: id, userId });
};

/**
 * Створити новий контакт для конкретного користувача
 */
export const createContact = async (userId, payload) => {
  return Contact.create({ ...payload, userId });
};

/**
 * Оновити контакт, але тільки якщо він належить користувачеві
 */
export const updateContact = async (userId, id, payload) => {
  return Contact.findOneAndUpdate({ _id: id, userId }, payload, { new: true });
};

/**
 * Видалити контакт, але тільки якщо він належить користувачеві
 */
export const deleteContact = async (userId, id) => {
  return Contact.findOneAndDelete({ _id: id, userId });
};
