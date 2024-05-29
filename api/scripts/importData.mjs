import { exec } from 'child_process';

const HOST = 'localhost';
const PORT = '27017';
const JSON_FILE = 'db/database.json';

// Comprobamos si el archivo JSON existe
exec(`[ -f ${JSON_FILE} ] && echo "true" || echo "false"`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error al comprobar si el archivo JSON existe: ${error}`);
        return;
    }

    if (stdout.trim() === 'false') {
        console.error(`El archivo JSON ${JSON_FILE} no existe.`);
        return;
    }

    // Obtenemos el nombre de la base de datos
    const dbName = "Gametrade"
    const collectionName = "juegos"

    // Importamos el archivo JSON a la base de datos
    exec(`mongoimport --drop --host ${HOST} --port ${PORT} --db ${dbName} --collection ${collectionName} --file ${JSON_FILE} --jsonArray`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error al importar ${JSON_FILE} a la base de datos ${dbName}: ${error}`);
            return;
        }
        console.log(`Importación exitosa de ${JSON_FILE} a la base de datos ${dbName}.`);
    });
});
