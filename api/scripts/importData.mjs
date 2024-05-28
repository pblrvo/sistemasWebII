import { exec } from 'child_process';
import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

// Estas líneas son necesarias para manejar __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOST = 'localhost';
const PORT = 27017;
const REPO_URL = 'https://huggingface.co/datasets/EXCALOFRIO/juegos';
const DATA_DIR = path.join(__dirname, '../data/games');
const REPO_DIR = path.join(DATA_DIR, 'juegos');
const DATA_FILE = path.join(REPO_DIR, 'games.json');

// Crear el directorio de datos si no existe
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Clonar el repositorio si no existe
if (!fs.existsSync(REPO_DIR)) {
    console.log(`Cloning repository into ${DATA_DIR}...`);
    exec(`git clone ${REPO_URL} ${REPO_DIR}`, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error cloning repository: ${err}`);
            return;
        }
        console.log(stdout);
        importData();
    });
} else {
    importData();
}

function importData() {
    fs.readdir(REPO_DIR, (err, collections) => {
        if (err) {
            console.error(`Error reading directory: ${err}`);
            return;
        }
        collections.forEach((coll) => {
            const collPath = path.join(REPO_DIR, coll);
            if (fs.lstatSync(collPath).isDirectory()) {
                console.log(coll);
                fs.readdir(collPath, (err, files) => {
                    if (err) {
                        console.error(`Error reading files: ${err}`);
                        return;
                    }
                    files.forEach((file) => {
                        if (path.extname(file) === '.json') {
                            const filePath = path.join(collPath, file);
                            const dbName = coll;
                            const collectionName = path.basename(file, '.json');
                            console.log(`Importing ${filePath} into ${dbName}.${collectionName}`);
                            exec(`mongoimport --drop --host ${HOST} --port ${PORT} --db ${dbName} --collection ${collectionName} --file ${filePath}`, (err, stdout, stderr) => {
                                if (err) {
                                    console.error(`Error importing data: ${err}`);
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
