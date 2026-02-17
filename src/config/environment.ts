import { config } from 'dotenv';

config();

export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';

// Database Configuration
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = parseInt(process.env.DB_PORT || '3306');
export const DB_USERNAME = process.env.DB_USERNAME || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || '';
export const DB_NAME = process.env.DB_NAME || 'kata_encuestas';

// JWT Configuration
export const JWT_SECRET: string = process.env.JWT_SECRET || 'default_secret_key';
export const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d';
