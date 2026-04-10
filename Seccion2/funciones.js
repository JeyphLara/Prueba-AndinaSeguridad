
// 1. Funcion para encontrar la palabra más larga en un texto
function palabraMasLarga(texto) {
  if (!texto || typeof texto !== 'string') return ''; //Validar entrada ya que debe ser una cadena

  //Procesar el texto para obtener solo palabras, eliminando puntuación y caracteres especiales
  const palabras = texto
    .trim()
    .split(/\s+/)
    .map((palabra) => palabra.replace(/[^\p{L}0-9]/gu, ''))
    .filter(Boolean);

  let palabraMasLarga = '';

  for (const palabra of palabras) {
    if (palabra.length > palabraMasLarga.length) {
      palabraMasLarga = palabra;
    }
  }

  return palabraMasLarga;
}

// 2. Paréntesis balanceados
function parentesisBalanceados(texto) {
  if (typeof texto !== 'string') return false;

  let contador = 0;

  for (const caracter of texto) {
    if (caracter === '(') {
      contador += 1;
    } else if (caracter === ')') {
      contador -= 1;
      if (contador < 0) return false;
    }
  }

  return contador === 0;
}

// 3. Frecuencia de caracteres
function frecuenciaCaracteres(texto) {
  if (typeof texto !== 'string') return {};

  const frecuencia = {};
  const textoLimpio = texto.toLowerCase();

  for (const caracter of textoLimpio) {
    if (!caracter.match(/\p{L}/u)) continue; // contar solo letras

    frecuencia[caracter] = (frecuencia[caracter] || 0) + 1;
  }

  return frecuencia;
}

// 4. FizzBuzz extendido
function fizzBuzzExtendido() {
  const resultado = [];

  for (let numero = 1; numero <= 100; numero += 1) {
    let salida = '';

    if (numero % 3 === 0) salida += 'Fizz';
    if (numero % 5 === 0) salida += 'Buzz';

    resultado.push(salida || numero);
  }

  return resultado;
}

// 5. Modelo de datos para registro y análisis de visitas
// Este modelo en memoria corresponde al diseño de las tablas `puntos_gestion` y `visitas`.
class PuntoGestion {
  constructor({ id, nombre, latitud, longitud, direccion = '', tipo = '', createdAt = null, updatedAt = null }) {
    this.id = id;
    this.nombre = nombre;
    this.latitud = Number(latitud);
    this.longitud = Number(longitud);
    this.direccion = direccion;
    this.tipo = tipo;
    this.createdAt = createdAt ? new Date(createdAt) : new Date();
    this.updatedAt = updatedAt ? new Date(updatedAt) : new Date();
  }
}

class Visita {
  constructor({ id, puntoId, inicio, fin, estado = '', comentarios = '', usuario = '', createdAt = null }) {
    this.id = id;
    this.puntoId = puntoId;
    this.inicio = new Date(inicio);
    this.fin = new Date(fin);
    this.estado = estado;
    this.comentarios = comentarios;
    this.usuario = usuario;
    this.createdAt = createdAt ? new Date(createdAt) : new Date();
  }

  get duracionMinutos() {
    const diff = this.fin - this.inicio;
    return diff > 0 ? Math.floor(diff / 60000) : 0;
  }
}

class RegistroVisitas {
  constructor(puntos = [], visitas = []) {
    this.puntos = puntos;
    this.visitas = visitas;
  }

  agregarPunto(punto) {
    this.puntos.push(new PuntoGestion(punto));
  }

  agregarVisita(visita) {
    this.visitas.push(new Visita(visita));
  }

  obtenerPunto(puntoId) {
    return this.puntos.find((punto) => punto.id === puntoId) || null;
  }

  obtenerVisitasPorPunto() {
    const conteo = {};
    for (const visita of this.visitas) {
      conteo[visita.puntoId] = (conteo[visita.puntoId] || 0) + 1;
    }
    return conteo;
  }

  obtenerDemoraPromedioPorPunto() {
    const sumaDuraciones = {};
    const conteo = {};

    for (const visita of this.visitas) {
      sumaDuraciones[visita.puntoId] = (sumaDuraciones[visita.puntoId] || 0) + visita.duracionMinutos;
      conteo[visita.puntoId] = (conteo[visita.puntoId] || 0) + 1;
    }

    const promedio = {};
    for (const puntoId of Object.keys(sumaDuraciones)) {
      promedio[puntoId] = Math.round(sumaDuraciones[puntoId] / conteo[puntoId]);
    }
    return promedio;
  }

  puntosMasVisitados() {
    const visitasPorPunto = this.obtenerVisitasPorPunto();
    return [...this.puntos]
      .sort((a, b) => (visitasPorPunto[b.id] || 0) - (visitasPorPunto[a.id] || 0));
  }

  puntosConMayorDemora() {
    const demoraPromedio = this.obtenerDemoraPromedioPorPunto();
    return [...this.puntos]
      .sort((a, b) => (demoraPromedio[b.id] || 0) - (demoraPromedio[a.id] || 0));
  }

  calcularDistanciaEntrePuntos(puntoA, puntoB) {
    const radioTierraKm = 6371;
    const toRad = (valor) => (valor * Math.PI) / 180;

    const lat1 = toRad(puntoA.latitud);
    const lon1 = toRad(puntoA.longitud);
    const lat2 = toRad(puntoB.latitud);
    const lon2 = toRad(puntoB.longitud);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((radioTierraKm * c).toFixed(3));
  }

  obtenerDistanciaEntreIds(idA, idB) {
    const puntoA = this.obtenerPunto(idA);
    const puntoB = this.obtenerPunto(idB);
    if (!puntoA || !puntoB) return null;
    return this.calcularDistanciaEntrePuntos(puntoA, puntoB);
  }
}

// Exportar funciones 
module.exports = {
  palabraMasLarga,
  parentesisBalanceados,
  frecuenciaCaracteres,
  fizzBuzzExtendido,
  PuntoGestion,
  Visita,
  RegistroVisitas,
};
