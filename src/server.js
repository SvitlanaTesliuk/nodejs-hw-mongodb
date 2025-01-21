import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { getAllContacts, getContactById } from './services/contacts.js';

const getEnvVar = (key, defaultValue) => process.env[key] || defaultValue;

const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(cors());
  const logger = pino();
  app.use(pinoHttp({ logger }));

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getAllContacts();
      res.status(200).json({ data: contacts, message: "Successfully found contacts!" });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params;

    try {
      const contact = await getContactById(contactId);

      if (!contact) {
        res.status(404).json({ message: 'Contact not found' });
        return;
      }

      res.status(200).json({ data: contact, message: "Successfully found contact!" });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
