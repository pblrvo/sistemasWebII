import fs from 'fs';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const HOST = process.env.DB_HOST || '127.0.0.1';
const PORT = process.env.DB_PORT || '27017';
const JSON_FILE = 'db/database.json';
const DB_NAME = 'Gametrade';
const COLLECTION_NAME = 'juegos';

// Función principal para importar JSON a MongoDB
async function importJsonToMongo() {
    try {
        // Comprobamos si el archivo JSON existe
        if (!fs.existsSync(JSON_FILE)) {
            console.error(`El archivo JSON ${JSON_FILE} no existe.`);
            return;
        }

        // Leemos el contenido del archivo JSON
        const data = fs.readFileSync(JSON_FILE, 'utf8');
        const jsonArray = JSON.parse(data);

        // Creamos la URL de conexión a MongoDB
        const url = `mongodb://${HOST}:${PORT}`;
        const client = new MongoClient(url);

        // Conectamos al cliente de MongoDB
        await client.connect();
        console.log('Conectado a MongoDB');

        // Obtenemos la base de datos y la colección
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        // Limpiamos la colección existente
        await collection.deleteMany({});
        console.log(`Colección ${COLLECTION_NAME} vaciada`);

        // Insertamos los datos del archivo JSON en la colección
        await collection.insertMany(jsonArray);
        console.log(`Importación exitosa de ${JSON_FILE} a la base de datos ${DB_NAME}`);

        // Cerramos la conexión
        await client.close();
        console.log('Conexión cerrada');
    } catch (error) {
        console.error(`Error al importar ${JSON_FILE} a la base de datos ${DB_NAME}: ${error}`);
    }
}

// Llamamos a la función principal
importJsonToMongo();
