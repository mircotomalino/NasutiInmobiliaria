import 'dotenv/config';
import { initDatabase } from './db.js';

initDatabase()
  .then(() => {
    console.log('✅ Base de datos inicializada exitosamente!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error inicializando base de datos:', error);
    process.exit(1);
  });

