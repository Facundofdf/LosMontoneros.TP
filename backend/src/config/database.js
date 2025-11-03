import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_STORAGE = process.env.DB_STORAGE;
const DB_DIALECT = process.env.DB_DIALECT || 'sqlite';

export const sequelize = new Sequelize({
    dialect: DB_DIALECT,
    storage: DB_STORAGE,
    logging: false,
});