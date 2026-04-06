import { preguntar, cerrarInput } from './utils/input.js';
import { leerAlumnos, guardarAlumnos } from './utils/archivo.js';

import {
  mostrarAlumnos,
  agregarAlumno,
  agregarOModificarMateria,
  buscarAlumnoPorNombre,
  obtenerAlumnoConMejorPromedio,
  ordenarAlumnosPorPromedio,
  esNotaValida,
  calcularPromedioDesdeMaterias,
  calcularPromedioAlumno
} from './services/alumnosService.js';

let alumnos = leerAlumnos();

async function verAlumnos() {
  alumnos = leerAlumnos();
  mostrarAlumnos(alumnos);
}

async function agregarNuevoAlumno() {
  alumnos = leerAlumnos();

  const nombre = await preguntar('\nIngrese el nombre del alumno: ');

  if (!nombre) {
    console.log('El nombre no puede estar vacío.\n');
    return;
  }

  const alumnoExistente = buscarAlumnoPorNombre(alumnos, nombre);

  if (alumnoExistente) {
    console.log('El alumno ya está registrado.\n');
    return;
  }

  const cantidadIngresada = await preguntar(
    'Ingrese la cantidad de materias que desea cargar: '
  );

  const cantidadMaterias = Number(cantidadIngresada);

  if (
    isNaN(cantidadMaterias) ||
    cantidadMaterias <= 0 ||
    !Number.isInteger(cantidadMaterias)
  ) {
    console.log('Cantidad inválida.\n');
    return;
  }

  const materias = [];

  for (let i = 0; i < cantidadMaterias; i++) {
    console.log(`\nMateria ${i + 1}:`);

    const nombreMateria = await preguntar('Ingrese el nombre de la materia: ');

    if (!nombreMateria) {
      console.log('Nombre inválido.\n');
      i--;
      continue;
    }

    const materiaRepetida = materias.find(
      (m) => m[0].toLowerCase() === nombreMateria.toLowerCase()
    );

    if (materiaRepetida) {
      console.log('Esa materia ya fue cargada.\n');
      i--;
      continue;
    }

    const notaIngresada = await preguntar('Ingrese la nota (0 a 10): ');
    const nota = Number(notaIngresada);

    if (!esNotaValida(nota)) {
      console.log('Nota inválida.\n');
      i--;
      continue;
    }

    materias.push([nombreMateria, nota]);
  }

  const resultado = agregarAlumno(alumnos, nombre, materias);

  if (resultado.exito) {
    guardarAlumnos(alumnos);

    const promedio = calcularPromedioDesdeMaterias(materias);

    console.log(`\n${resultado.mensaje}`);
    console.log(`Promedio inicial: ${promedio.toFixed(2)}\n`);
  } else {
    console.log(`${resultado.mensaje}\n`);
  }
}

async function agregarOModificarNotas() {
  alumnos = leerAlumnos();

  if (alumnos.length === 0) {
    console.log('\nTodavía no se cargaron alumnos.\n');
    return;
  }

  const nombreAlumno = await preguntar('\nIngrese el nombre del alumno: ');

  const alumno = buscarAlumnoPorNombre(alumnos, nombreAlumno);

  if (!alumno) {
    console.log('El alumno no existe.\n');
    return;
  }

  const materia = await preguntar('Ingrese la materia: ');

  if (!materia) {
    console.log('La materia no puede estar vacía.\n');
    return;
  }

  const notaIngresada = await preguntar('Ingrese la nota (0 a 10): ');
  const nota = Number(notaIngresada);

  if (!esNotaValida(nota)) {
    console.log('Nota inválida.\n');
    return;
  }

  const resultado = agregarOModificarMateria(
    alumnos,
    nombreAlumno,
    materia,
    nota
  );

  guardarAlumnos(alumnos);

  console.log(resultado.mensaje + '\n');
}

async function mostrarMejorPromedio() {
  alumnos = leerAlumnos();

  const resultado = obtenerAlumnoConMejorPromedio(alumnos);

  if (!resultado) {
    console.log('\nTodavía no se cargaron alumnos.\n');
    return;
  }

  console.log('\n=== MEJOR PROMEDIO ===');
  console.log(`Alumno: ${resultado.alumno[0]}`);
  console.log(`Promedio: ${resultado.promedio.toFixed(2)}\n`);
}

async function mostrarOrdenados() {
  alumnos = leerAlumnos();

  if (alumnos.length === 0) {
    console.log('\nTodavía no se cargaron alumnos.\n');
    return;
  }

  const ordenados = ordenarAlumnosPorPromedio(alumnos);

  console.log('\n=== ORDENADOS POR PROMEDIO ===');

  ordenados.forEach((alumno, index) => {
    const promedio = calcularPromedioAlumno(alumno);

    console.log(
      `${index + 1}. ${alumno[0]} - Promedio: ${promedio.toFixed(2)}`
    );
  });

  console.log('');
}

function mostrarMenu() {
  console.log('==============================');
  console.log(' SISTEMA DE CALIFICACIONES');
  console.log('==============================');
  console.log('1. Ver alumnos');
  console.log('2. Agregar alumno');
  console.log('3. Agregar o modificar notas');
  console.log('4. Mostrar mejor promedio');
  console.log('5. Ordenar por promedio');
  console.log('6. Salir');
}

async function iniciarPrograma() {
  let activo = true;

  while (activo) {
    mostrarMenu();

    const opcion = await preguntar('Seleccione una opción: ');

    switch (opcion) {
      case '1':
        await verAlumnos();
        break;
      case '2':
        await agregarNuevoAlumno();
        break;
      case '3':
        await agregarOModificarNotas();
        break;
      case '4':
        await mostrarMejorPromedio();
        break;
      case '5':
        await mostrarOrdenados();
        break;
      case '6':
        activo = false;
        console.log('\nSaliendo del sistema...\n');
        break;
      default:
        console.log('\nOpción inválida.\n');
    }
  }

  cerrarInput();
}

iniciarPrograma();