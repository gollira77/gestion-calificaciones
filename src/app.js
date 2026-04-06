import alumnos from './data/alumnos.js';
import { preguntar, cerrarInput } from './utils/input.js';
import {
  mostrarAlumnos,
  agregarAlumno,
  agregarOModificarMateria,
  buscarAlumnoPorNombre,
  obtenerAlumnoConMejorPromedio,
  ordenarAlumnosPorPromedio,
  esNotaValida
} from './services/alumnosService.js';

async function verAlumnos() {
  mostrarAlumnos(alumnos);
}

async function agregarNuevoAlumno() {
  const nombre = await preguntar('\nIngrese el nombre del alumno: ');

  if (!nombre) {
    console.log('El nombre no puede estar vacío.\n');
    return;
  }

  const resultado = agregarAlumno(alumnos, nombre);
  console.log(`${resultado.mensaje}\n`);
}

async function agregarOModificarNotas() {
  const nombreAlumno = await preguntar('\nIngrese el nombre del alumno: ');

  if (!nombreAlumno) {
    console.log('El nombre no puede estar vacío.\n');
    return;
  }

  const alumno = buscarAlumnoPorNombre(alumnos, nombreAlumno);

  if (!alumno) {
    console.log('El alumno no existe.');
    const opcion = await preguntar('¿Desea agregarlo? (si/no): ');

    if (opcion.toLowerCase() === 'si') {
      const resultado = agregarAlumno(alumnos, nombreAlumno);
      console.log(resultado.mensaje);
    } else {
      console.log('');
      return;
    }
  } else {
    console.log('El alumno ya está registrado.');
  }

  const materia = await preguntar('Ingrese el nombre de la materia: ');

  if (!materia) {
    console.log('La materia no puede estar vacía.\n');
    return;
  }

  const notaIngresada = await preguntar('Ingrese la nota (0 a 10): ');
  const nota = Number(notaIngresada);

  if (!esNotaValida(nota)) {
    console.log('La nota ingresada no es válida.\n');
    return;
  }

  const resultado = agregarOModificarMateria(alumnos, nombreAlumno, materia, nota);
  console.log(`${resultado.mensaje}\n`);
}

async function mostrarMejorPromedio() {
  const resultado = obtenerAlumnoConMejorPromedio(alumnos);

  if (!resultado) {
    console.log('\nNo hay alumnos registrados.\n');
    return;
  }

  console.log('\n=== MEJOR PROMEDIO ===');
  console.log(`Alumno: ${resultado.alumno[0]}`);
  console.log(`Promedio: ${resultado.promedio.toFixed(2)}\n`);
}

async function mostrarAlumnosOrdenados() {
  const ordenados = ordenarAlumnosPorPromedio(alumnos);

  if (ordenados.length === 0) {
    console.log('\nNo hay alumnos registrados.\n');
    return;
  }

  console.log('\n=== ALUMNOS ORDENADOS POR PROMEDIO ===');

  ordenados.forEach((alumno, index) => {
    const promedio = alumno[1].length === 0
      ? 0
      : alumno[1].reduce((acc, materia) => acc + materia[1], 0) / alumno[1].length;

    console.log(`${index + 1}. ${alumno[0]} - Promedio: ${promedio.toFixed(2)}`);
  });

  console.log('');
}

function mostrarMenu() {
  console.log('=== SISTEMA DE CALIFICACIONES ===');
  console.log('1. Ver alumnos');
  console.log('2. Agregar alumno');
  console.log('3. Agregar o modificar notas');
  console.log('4. Mostrar alumno con mejor promedio');
  console.log('5. Ordenar alumnos por promedio');
  console.log('6. Salir');
}

async function iniciarPrograma() {
  let continuar = true;

  while (continuar) {
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
        await mostrarAlumnosOrdenados();
        break;
      case '6':
        continuar = false;
        console.log('\nSaliendo del sistema...\n');
        break;
      default:
        console.log('\nOpción inválida. Intente nuevamente.\n');
    }
  }

  cerrarInput();
}

iniciarPrograma();