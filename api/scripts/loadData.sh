#!/bin/bash

HOST=localhost
PORT=27017
DATA_URL="https://huggingface.co/datasets/EXCALOFRIO/juegos/blob/main/games.json"
DATA_DIR="../data/games"
DATA_FILE="$DATA_DIR/games.json"

# Crear el directorio de datos si no existe
mkdir -p $DATA_DIR

# Descargar el archivo JSON si no existe
if [ ! -f "$DATA_FILE" ]; then
    echo "Downloading $DATA_FILE..."
    curl -L $DATA_URL -o $DATA_FILE
fi

# Importar los datos a MongoDB
for coll in ../data/*; do
    if [ -d "${coll}" ] ; then
        echo "$(basename $coll)"
        for file in $coll/*; do
            mongoimport --drop --host $HOST --port $PORT --db "$(basename $coll)" --collection "$(basename $file .json)" --file $file
        done
    fi
done
