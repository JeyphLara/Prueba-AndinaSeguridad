# Modelo de datos - Punto 5

## Respuesta al punto 5: Modelo de datos para registro y análisis de visitas

El punto 5 solicita definir un modelo de datos que permita registrar información de visitas realizadas a diferentes puntos de gestión, y construir un modelo analítico para visualizar distancias entre puntos, identificar puntos con mayor cantidad de visitas y puntos donde las visitas se demoran más.

### ¿Por qué este diseño?

Elegí un modelo relacional con dos tablas principales (`puntos_gestion` y `visitas`) porque:

- **Normalización**: Separa la información estática de los puntos (ubicación, nombre) de la información dinámica de las visitas (tiempos, estado), evitando redundancia y facilitando actualizaciones.
- **Escalabilidad**: Permite agregar múltiples visitas por punto sin duplicar datos de ubicación.
- **Análisis eficiente**: Las relaciones permiten consultas agregadas (COUNT, AVG, SUM) para los análisis requeridos.
- **Integridad**: Las claves foráneas aseguran que cada visita esté ligada a un punto existente.

Este diseño es simple, eficiente y directamente soporta los requerimientos analíticos sin necesidad de estructuras complejas.

### ¿Qué hace el modelo?

#### Registro de visitas
- La tabla `puntos_gestion` almacena cada punto de gestión con su ubicación geográfica (latitud/longitud), permitiendo cálculos de distancia.
- La tabla `visitas` registra cada visita con tiempos de inicio y fin, estado, comentarios y usuario, permitiendo rastrear duración y frecuencia.

#### Análisis analítico
- **Distancias entre puntos**: Usando las coordenadas geográficas, se calcula la distancia Haversine entre cualquier par de puntos.
- **Puntos más visitados**: Mediante `COUNT(visitas.id)` agrupado por `punto_id`, se identifica cuáles puntos tienen más visitas.
- **Puntos con mayor demora**: Calculando `AVG(duracion_minutos)` por punto, se determina dónde las visitas duran más tiempo.

El modelo en `soluciones.js` es una representación en memoria de este esquema, no una capa ORM, y refleja fielmente las columnas definidas aquí.

## Diseño general

### Tabla `puntos_gestion`
Esta tabla almacena los puntos de gestión y su ubicación.

- `id` UUID o serial PRIMARY KEY
- `nombre` VARCHAR(255) NOT NULL
- `latitud` DECIMAL(10, 7) NOT NULL
- `longitud` DECIMAL(10, 7) NOT NULL
- `direccion` VARCHAR(255)
- `tipo` VARCHAR(100)
- `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

### Tabla `visitas`
Esta tabla registra cada visita realizada a un punto de gestión.

- `id` UUID o serial PRIMARY KEY
- `punto_id` UUID NOT NULL REFERENCES `puntos_gestion`(`id`)
- `inicio` TIMESTAMP NOT NULL
- `fin` TIMESTAMP NOT NULL
- `duracion_minutos` INTEGER GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (fin - inicio)) / 60
  ) STORED
- `estado` VARCHAR(50)
- `comentarios` TEXT
- `usuario` VARCHAR(100)
- `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

## Beneficios del modelo

Este diseño permite:

- Calcular distancias entre puntos usando las coordenadas geográficas (`latitud`, `longitud`).
- Obtener los puntos más visitados mediante agregaciones de `COUNT(visitas.id)`.
- Analizar duración de visitas con diferencias de tiempo y funciones de agregación como `AVG` y `SUM`.
- Asociar visitas con puntos concretos, lo que facilita el análisis por ubicación.

También se incluye el archivo `schema.sql` en este directorio con el esquema SQL listo para ejecutar.

## Diseño general

### Tabla `puntos_gestion`
Esta tabla almacena los puntos de gestión y su ubicación.

- `id` UUID o serial PRIMARY KEY
- `nombre` VARCHAR(255) NOT NULL
- `latitud` DECIMAL(10, 7) NOT NULL
- `longitud` DECIMAL(10, 7) NOT NULL
- `direccion` VARCHAR(255)
- `tipo` VARCHAR(100)
- `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

### Tabla `visitas`
Esta tabla registra cada visita realizada a un punto de gestión.

- `id` UUID o serial PRIMARY KEY
- `punto_id` UUID NOT NULL REFERENCES `puntos_gestion`(`id`)
- `inicio` TIMESTAMP NOT NULL
- `fin` TIMESTAMP NOT NULL
- `duracion_minutos` INTEGER GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (fin - inicio)) / 60
  ) STORED
- `estado` VARCHAR(50)
- `comentarios` TEXT
- `usuario` VARCHAR(100)
- `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

## Beneficios del modelo

Este diseño permite:

- Calcular distancias entre puntos usando las coordenadas geográficas (`latitud`, `longitud`).
- Obtener los puntos más visitados mediante agregaciones de `COUNT(visitas.id)`.
- Analizar duración de visitas con diferencias de tiempo y funciones de agregación como `AVG` y `SUM`.
- Asociar visitas con puntos concretos, lo que facilita el análisis por ubicación.

También se incluye el archivo `schema.sql` en este directorio con el esquema SQL listo para ejecutar.
