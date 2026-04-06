export function buscarAlumnoPorNombre(alumnos, nombre) {
  return alumnos.find(
    (alumno) => alumno[0].toLowerCase() === nombre.toLowerCase()
  );
}

export function mostrarAlumnos(alumnos) {
  if (alumnos.length === 0) {
    console.log('\nNo hay alumnos registrados.\n');
    return;
  }

  console.log('\n=== LISTA DE ALUMNOS ===');
  alumnos.forEach((alumno, index) => {
    const nombre = alumno[0];
    const materias = alumno[1];

    console.log(`\n${index + 1}. Alumno: ${nombre}`);

    if (materias.length === 0) {
      console.log('   Sin materias registradas.');
    } else {
      materias.forEach((materia) => {
        console.log(`   - ${materia[0]}: ${materia[1]}`);
      });

      const promedio = calcularPromedioAlumno(alumno);
      console.log(`   Promedio: ${promedio.toFixed(2)}`);
    }
  });

  console.log('');
}

export function agregarAlumno(alumnos, nombre, materias) {
  const alumnoExistente = buscarAlumnoPorNombre(alumnos, nombre);

  if (alumnoExistente) {
    return {
      exito: false,
      mensaje: 'El alumno ya está registrado.'
    };
  }

  alumnos.push([nombre, materias]);

  return {
    exito: true,
    mensaje: 'Alumno agregado correctamente.'
  };
}

export function buscarMateria(alumno, nombreMateria) {
  return alumno[1].find(
    (materia) => materia[0].toLowerCase() === nombreMateria.toLowerCase()
  );
}

export function agregarOModificarMateria(alumnos, nombreAlumno, nombreMateria, nota) {
  const alumno = buscarAlumnoPorNombre(alumnos, nombreAlumno);

  if (!alumno) {
    return {
      exito: false,
      mensaje: 'El alumno no existe.'
    };
  }

  const materiaExistente = buscarMateria(alumno, nombreMateria);

  if (materiaExistente) {
    materiaExistente[1] = nota;
    return {
      exito: true,
      mensaje: 'Nota modificada correctamente.'
    };
  }

  alumno[1].push([nombreMateria, nota]);
  return {
    exito: true,
    mensaje: 'Materia y nota agregadas correctamente.'
  };
}

export function calcularPromedioAlumno(alumno) {
  const materias = alumno[1];

  if (materias.length === 0) {
    return 0;
  }

  const suma = materias.reduce((acumulador, materia) => acumulador + materia[1], 0);
  return suma / materias.length;
}

export function calcularPromedioDesdeMaterias(materias) {
  if (materias.length === 0) {
    return 0;
  }

  const suma = materias.reduce((acumulador, materia) => acumulador + materia[1], 0);
  return suma / materias.length;
}

export function obtenerAlumnoConMejorPromedio(alumnos) {
  if (alumnos.length === 0) {
    return null;
  }

  let mejorAlumno = alumnos[0];
  let mejorPromedio = calcularPromedioAlumno(alumnos[0]);

  for (let i = 1; i < alumnos.length; i++) {
    const promedioActual = calcularPromedioAlumno(alumnos[i]);

    if (promedioActual > mejorPromedio) {
      mejorPromedio = promedioActual;
      mejorAlumno = alumnos[i];
    }
  }

  return {
    alumno: mejorAlumno,
    promedio: mejorPromedio
  };
}

export function ordenarAlumnosPorPromedio(alumnos) {
  return [...alumnos].sort(
    (a, b) => calcularPromedioAlumno(b) - calcularPromedioAlumno(a)
  );
}

export function esNotaValida(nota) {
  return !isNaN(nota) && nota >= 0 && nota <= 10;
}