import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Estas líneas son necesarias para manejar __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOST = 'localhost';
const MONGO_PORT = process.env.MONGO_PORT || 27017; // Utilizar MONGO_PORT o 27017 si no está definido
const REPO_URL = 'https://huggingface.co/datasets/EXCALOFRIO/juegos';
const DATA_DIR = path.join(__dirname, '../data/games');
const REPO_DIR = path.join(DATA_DIR, 'juegos');
const DATA_FILE = path.join(REPO_DIR, 'games.json');

// Crear el directorio de datos si no existe
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Función para importar datos
function importData() {
    fs.readdir(REPO_DIR, (err, collections) => {
        if (err) {
            console.error(`Error al leer el directorio: ${err}`);
            return;
        }

        collections.forEach((coll) => {
            const collPath = path.join(REPO_DIR, coll);
            if (fs.lstatSync(collPath).isDirectory()) {
                console.log(coll);
                fs.readdir(collPath, (err, files) => {
                    if (err) {
                        console.error(`Error al leer los archivos: ${err}`);
                        return;
                    }

                    files.forEach((file) => {
                        if (path.extname(file) === '.json') {
                            const filePath = path.join(collPath, file);
                            const dbName = coll;
                            const collectionName = path.basename(file, '.json');
                            console.log(`Importando ${filePath} en ${dbName}.${collectionName}`);
                            exec(`mongoimport --drop --host ${HOST} --port ${MONGO_PORT} --db ${dbName} --collection ${collectionName} --file ${filePath}`, (err, stdout, stderr) => {
                                if (err) {
                                    console.error(`Error al importar los datos: ${err}`);
                                    return;
                                }
                                console.log(stdout);
                            });
                        }
                    });
                });
            }
        });
    });
}

// Verificar si el archivo JSON ya existe
if (fs.existsSync(DATA_FILE)) {
    console.log('El archivo de datos ya existe, omitiendo la descarga.');
    importData();
} else {
    // Clonar el repositorio si no existe
    if (!fs.existsSync(REPO_DIR)) {
        console.log(`Clonando el repositorio en ${DATA_DIR}...`);
        exec(`git clone ${REPO_URL} ${REPO_DIR}`, (err, stdout, stderr) => {
            if (err) {
                console.error(`Error al clonar el repositorio: ${err}`);
                return;
            }
            console.log(stdout);
            importData();
        });
    } else {
        importData();
    }
}