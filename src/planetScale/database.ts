import { createConnection } from 'mysql2'
import * as dotenv from 'dotenv';
dotenv.config();

const dataBaseURL = import.meta.env.VITE_DATABASE_URL;

export const conecta = createConnection(dataBaseURL)


