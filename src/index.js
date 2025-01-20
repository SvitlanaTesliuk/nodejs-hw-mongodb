import 'dotenv/config';
import { startServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
const startApplication = async () => {
  try {

    await initMongoConnection();

    startServer();
  } catch (error) {
    console.error('Error starting the application:', error.message);
    process.exit(1);
  }
};

startApplication();
