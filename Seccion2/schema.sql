-- Esquema SQL para el modelo de datos de visitas y puntos de gestión

CREATE TABLE puntos_gestion (
  id UUID PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  latitud DECIMAL(10, 7) NOT NULL,
  longitud DECIMAL(10, 7) NOT NULL,
  direccion VARCHAR(255),
  tipo VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE visitas (
  id UUID PRIMARY KEY,
  punto_id UUID NOT NULL REFERENCES puntos_gestion(id),
  inicio TIMESTAMP NOT NULL,
  fin TIMESTAMP NOT NULL,
  duracion_minutos INTEGER GENERATED ALWAYS AS (
    FLOOR(EXTRACT(EPOCH FROM (fin - inicio)) / 60)
  ) STORED,
  estado VARCHAR(50),
  comentarios TEXT,
  usuario VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_visitas_punto_id ON visitas(punto_id);
CREATE INDEX idx_visitas_inicio ON visitas(inicio);
CREATE INDEX idx_visitas_fin ON visitas(fin);
