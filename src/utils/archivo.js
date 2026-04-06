import fs from 'fs';
import path from 'path';

const carpetaData = path.resolve('data');
const rutaArchivo = path.join(carpetaData, 'alumnos.json');

function asegurarArchivo() {
  if (!fs.existsSync(carpetaData)) {
    fs.mkdirSync(carpetaData, { recursive: true });
  }

  if (!fs.existsSync(rutaArchivo)) {
    fs.writeFileSync(rutaArchivo, JSON.stringify([], null, 2), 'utf-8');
  }
}

export function leerAlumnos() {
  try {
    asegurarArchivo();

    const contenido = fs.readFileSync(rutaArchivo, 'utf-8');

    if (!contenido.trim()) {
      return [];
    }

    return JSON.parse(contenido);
  } catch (error) {
    console.log('Error al leer el archivo de alumnos:', error.message);
    return [];
  }
}

export function guardarAlumnos(alumnos) {
  try {
    asegurarArchivo();
    fs.writeFileSync(rutaArchivo, JSON.stringify(alumnos, null, 2), 'utf-8');
  } catch (error) {
    console.log('Error al guardar el archivo de alumnos:', error.message);
  }
}