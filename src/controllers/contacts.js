import { findContactById } from '../services/contacts.js';
export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  try {
    const contact = await findContactById(contactId);

    if (!contact) {
      return res.status(404).json({
        message: 'Contact not found',
      });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    console.error('Error fetching contact:', error.message);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};
