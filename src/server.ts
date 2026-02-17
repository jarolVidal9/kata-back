import 'reflect-metadata';
import app from './app';
import { PORT } from './config/environment';
import { connectDatabase } from './config/dbConnection';

const port = PORT || 3000;

const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDatabase();

    // Iniciar servidor
    app.listen(port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
