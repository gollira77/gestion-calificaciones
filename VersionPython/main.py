import json
import os

RUTA_CARPETA = "data"
RUTA_ARCHIVO = os.path.join(RUTA_CARPETA, "alumnos.json")


def asegurar_archivo():
    if not os.path.exists(RUTA_CARPETA):
        os.makedirs(RUTA_CARPETA)

    if not os.path.exists(RUTA_ARCHIVO):
        with open(RUTA_ARCHIVO, "w", encoding="utf-8") as archivo:
            json.dump([], archivo, indent=2, ensure_ascii=False)


def leer_alumnos():
    asegurar_archivo()

    try:
        with open(RUTA_ARCHIVO, "r", encoding="utf-8") as archivo:
            contenido = archivo.read().strip()

            if not contenido:
                return []

            return json.loads(contenido)
    except (json.JSONDecodeError, FileNotFoundError):
        return []


def guardar_alumnos(alumnos):
    asegurar_archivo()

    with open(RUTA_ARCHIVO, "w", encoding="utf-8") as archivo:
        json.dump(alumnos, archivo, indent=2, ensure_ascii=False)


def buscar_alumno_por_nombre(alumnos, nombre):
    for alumno in alumnos:
        if alumno[0].lower() == nombre.lower():
            return alumno
    return None


def calcular_promedio_alumno(alumno):
    materias = alumno[1]

    if len(materias) == 0:
        return 0

    suma = 0
    for materia in materias:
        suma += materia[1]

    return suma / len(materias)


def mostrar_alumnos(alumnos):
    if len(alumnos) == 0:
        print("\nTodavía no se cargaron alumnos.\n")
        return

    print("\n=== LISTA DE ALUMNOS ===")

    for i, alumno in enumerate(alumnos, start=1):
        nombre = alumno[0]
        materias = alumno[1]

        print(f"\n{i}. Alumno: {nombre}")

        if len(materias) == 0:
            print("   Sin materias registradas.")
        else:
            for materia in materias:
                print(f"   - {materia[0]}: {materia[1]}")

            promedio = calcular_promedio_alumno(alumno)
            print(f"   Promedio: {promedio:.2f}")

    print()


def es_nota_valida(nota):
    return 0 <= nota <= 10


def agregar_alumno():
    alumnos = leer_alumnos()

    nombre = input("\nIngrese el nombre del alumno: ").strip()

    if nombre == "":
        print("El nombre no puede estar vacío.\n")
        return

    alumno_existente = buscar_alumno_por_nombre(alumnos, nombre)

    if alumno_existente is not None:
        print("El alumno ya está registrado.\n")
        return

    try:
        cantidad_materias = int(input("Ingrese la cantidad de materias que desea cargar: "))
    except ValueError:
        print("Cantidad inválida.\n")
        return

    if cantidad_materias <= 0:
        print("La cantidad debe ser mayor que 0.\n")
        return

    materias = []

    i = 0
    while i < cantidad_materias:
        print(f"\nMateria {i + 1}:")
        nombre_materia = input("Ingrese el nombre de la materia: ").strip()

        if nombre_materia == "":
            print("El nombre de la materia no puede estar vacío.")
            continue

        materia_repetida = False
        for materia in materias:
            if materia[0].lower() == nombre_materia.lower():
                materia_repetida = True
                break

        if materia_repetida:
            print("Esa materia ya fue cargada.")
            continue

        try:
            nota = float(input("Ingrese la nota (0 a 10): "))
        except ValueError:
            print("Nota inválida.")
            continue

        if not es_nota_valida(nota):
            print("La nota debe estar entre 0 y 10.")
            continue

        materias.append([nombre_materia, nota])
        i += 1

    alumnos.append([nombre, materias])
    guardar_alumnos(alumnos)

    promedio = sum(materia[1] for materia in materias) / len(materias)
    print("\nAlumno agregado correctamente.")
    print(f"Promedio inicial: {promedio:.2f}\n")


def agregar_o_modificar_notas():
    alumnos = leer_alumnos()

    if len(alumnos) == 0:
        print("\nTodavía no se cargaron alumnos.\n")
        return

    nombre_alumno = input("\nIngrese el nombre del alumno: ").strip()

    alumno = buscar_alumno_por_nombre(alumnos, nombre_alumno)

    if alumno is None:
        print("El alumno no existe.\n")
        return

    nombre_materia = input("Ingrese la materia: ").strip()

    if nombre_materia == "":
        print("La materia no puede estar vacía.\n")
        return

    try:
        nota = float(input("Ingrese la nota (0 a 10): "))
    except ValueError:
        print("Nota inválida.\n")
        return

    if not es_nota_valida(nota):
        print("La nota debe estar entre 0 y 10.\n")
        return

    materia_existente = None
    for materia in alumno[1]:
        if materia[0].lower() == nombre_materia.lower():
            materia_existente = materia
            break

    if materia_existente is not None:
        materia_existente[1] = nota
        print("Nota modificada correctamente.\n")
    else:
        alumno[1].append([nombre_materia, nota])
        print("Materia y nota agregadas correctamente.\n")

    guardar_alumnos(alumnos)


def mostrar_menu():
    print("================================")
    print(" SISTEMA DE CALIFICACIONES")
    print("================================")
    print("1. Ver alumnos")
    print("2. Agregar alumno")
    print("3. Agregar o modificar notas")
    print("4. Salir")


def iniciar_programa():
    while True:
        mostrar_menu()
        opcion = input("Seleccione una opción: ").strip()

        if opcion == "1":
            alumnos = leer_alumnos()
            mostrar_alumnos(alumnos)

        elif opcion == "2":
            agregar_alumno()

        elif opcion == "3":
            agregar_o_modificar_notas()

        elif opcion == "4":
            print("\nSaliendo del sistema...\n")
            break

        else:
            print("\nOpción inválida.\n")


iniciar_programa()