-- =========================================================
-- BASE DE DATOS
-- =========================================================

CREATE DATABASE "pollaMundialista";

\c "pollaMundialista";

-- =========================================================
-- EXTENSIONES
-- =========================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================================================
-- ENUMS
-- =========================================================

CREATE TYPE estado_partido AS ENUM (
    'PROGRAMADO',
    'BLOQUEADO',
    'EN_VIVO',
    'FINALIZADO'
);

CREATE TYPE estado_ticket AS ENUM (
    'BORRADOR',
    'ENVIADO',
    'BLOQUEADO',
    'CALCULADO'
);

CREATE TYPE estado_evento_ticket AS ENUM (
    'PENDIENTE',
    'GANADO',
    'PERDIDO'
);

CREATE TYPE estado_sala AS ENUM (
    'ACTIVA',
    'ARCHIVADA'
);

CREATE TYPE estado_encuesta AS ENUM (
    'ABIERTA',
    'CERRADA'
);

-- =========================================================
-- USUARIOS
-- =========================================================

CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_usuario VARCHAR(60) UNIQUE NOT NULL,
    correo VARCHAR(120) UNIQUE NOT NULL,
    contrasena_hash TEXT NOT NULL,
    rol_global VARCHAR(20) DEFAULT 'USUARIO',
    creado_en TIMESTAMP DEFAULT NOW()
);

-- =========================================================
-- SALAS
-- =========================================================

CREATE TABLE salas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(120) NOT NULL,
    descripcion TEXT,
    codigo_ingreso VARCHAR(20) UNIQUE NOT NULL,
    enlace_invite TEXT,
    estado estado_sala DEFAULT 'ACTIVA',
    id_propietario UUID NOT NULL REFERENCES usuarios(id),
    creado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sala_miembros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_sala UUID NOT NULL REFERENCES salas(id) ON DELETE CASCADE,
    id_usuario UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    rol_sala VARCHAR(20) DEFAULT 'USUARIO',
    unido_en TIMESTAMP DEFAULT NOW(),
    UNIQUE(id_sala, id_usuario)
);

-- =========================================================
-- EQUIPOS / JUGADORES
-- =========================================================

CREATE TABLE equipos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(120) NOT NULL,
    codigo_iso VARCHAR(10),
    pais VARCHAR(80),
    creado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE jugadores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(120) NOT NULL,
    posicion VARCHAR(30),
    id_equipo UUID REFERENCES equipos(id),
    creado_en TIMESTAMP DEFAULT NOW()
);

-- =========================================================
-- PARTIDOS (CORE DEL SISTEMA)
-- =========================================================

CREATE TABLE partidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_equipo_local UUID REFERENCES equipos(id),
    id_equipo_visitante UUID REFERENCES equipos(id),
    estado estado_partido DEFAULT 'PROGRAMADO',
    fecha_partido TIMESTAMP NOT NULL,
    bloqueado_en TIMESTAMP,
    creado_en TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_partidos_fecha ON partidos(fecha_partido);
CREATE INDEX idx_partidos_estado ON partidos(estado);

-- =========================================================
-- CACHE API (SOLO SOPORTE - NO CRÍTICO)
-- =========================================================

CREATE TABLE api_partidos_cache (
    id_api INT PRIMARY KEY,
    id_equipo_local_api INT,
    id_equipo_visitante_api INT,
    fecha_partido TIMESTAMP,
    estado VARCHAR(30),
    goles_local INT,
    goles_visitante INT,
    actualizado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE api_eventos_partido_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_partido_api INT REFERENCES api_partidos_cache(id_api),
    tipo_evento VARCHAR(50),
    id_jugador_api INT,
    minuto INT,
    datos JSONB,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- =========================================================
-- SNAPSHOTS + MODELO ML
-- =========================================================

CREATE TABLE partido_snapshot (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_partido UUID NOT NULL REFERENCES partidos(id),
    rating_local NUMERIC(6,2),
    rating_visitante NUMERIC(6,2),
    contexto NUMERIC(6,2),
    prob_local NUMERIC(5,2),
    prob_empate NUMERIC(5,2),
    prob_visitante NUMERIC(5,2),
    version_modelo INT,
    creado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE modelo_prediccion_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_partido UUID REFERENCES partidos(id),
    features JSONB,
    resultado_modelo JSONB,
    version_modelo INT,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- =========================================================
-- FEATURE STORE (🔥 CLAVE PARA TU SISTEMA MATEMÁTICO)
-- =========================================================

CREATE TABLE feature_store_partidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_partido UUID REFERENCES partidos(id),

    ataque_local NUMERIC(6,2),
    defensa_local NUMERIC(6,2),
    ataque_visitante NUMERIC(6,2),
    defensa_visitante NUMERIC(6,2),

    forma_local NUMERIC(6,2),
    forma_visitante NUMERIC(6,2),

    ventaja_local NUMERIC(6,2),

    creado_en TIMESTAMP DEFAULT NOW()
);

-- =========================================================
-- PREDICCIONES Y MERCADOS
-- =========================================================

CREATE TABLE versiones_prediccion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_partido UUID REFERENCES partidos(id),
    version INT NOT NULL,
    congelado BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE mercados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_partido UUID REFERENCES partidos(id),
    tipo VARCHAR(80),
    probabilidad NUMERIC(5,2),
    id_version UUID REFERENCES versiones_prediccion(id),
    creado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE resultados_mercado (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_mercado UUID REFERENCES mercados(id) ON DELETE CASCADE,
    resultado BOOLEAN NOT NULL,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- =========================================================
-- TICKETS (AHORA DEPENDEN DE PARTIDOS INTERNOS ✔️)
-- =========================================================

CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_usuario UUID REFERENCES usuarios(id),
    id_sala UUID REFERENCES salas(id),
    id_partido UUID REFERENCES partidos(id),
    estado estado_ticket DEFAULT 'BORRADOR',
    creado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE eventos_ticket (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_ticket UUID REFERENCES tickets(id) ON DELETE CASCADE,
    id_mercado UUID REFERENCES mercados(id),

    probabilidad_congelada NUMERIC(5,2),
    puntos_calculados NUMERIC(10,2),

    estado estado_evento_ticket DEFAULT 'PENDIENTE',

    es_primer_apostador BOOLEAN DEFAULT FALSE,
    es_raro BOOLEAN DEFAULT FALSE,

    creado_en TIMESTAMP DEFAULT NOW()
);

-- =========================================================
-- RANKING SIMPLE DE SALA (SOLO PUNTOS ✔️)
-- =========================================================

CREATE TABLE ranking_sala (
    id_sala UUID REFERENCES salas(id) ON DELETE CASCADE,
    id_usuario UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    puntos_totales NUMERIC(12,2) DEFAULT 0,
    actualizado_en TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (id_sala, id_usuario)
);

CREATE INDEX idx_ranking ON ranking_sala(id_sala, puntos_totales DESC);

-- =========================================================
-- MOVIMIENTOS DE RANKING (AUDITORÍA)
-- =========================================================

CREATE TABLE movimientos_ranking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_sala UUID REFERENCES salas(id),
    id_usuario UUID REFERENCES usuarios(id),
    puntos NUMERIC(12,2),
    motivo TEXT,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- =========================================================
-- ENCUESTAS
-- =========================================================

CREATE TABLE encuestas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_sala UUID REFERENCES salas(id) ON DELETE CASCADE,
    pregunta TEXT,
    estado estado_encuesta DEFAULT 'ABIERTA',
    creado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE opciones_encuesta (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_encuesta UUID REFERENCES encuestas(id) ON DELETE CASCADE,
    opcion TEXT
);

CREATE TABLE votos_encuesta (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_encuesta UUID REFERENCES encuestas(id),
    id_usuario UUID REFERENCES usuarios(id),
    id_opcion UUID REFERENCES opciones_encuesta(id),
    UNIQUE(id_encuesta, id_usuario)
);

-- =========================================================
-- CHAT
-- =========================================================

CREATE TABLE mensajes_chat (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_sala UUID REFERENCES salas(id) ON DELETE CASCADE,
    id_usuario UUID REFERENCES usuarios(id),
    mensaje TEXT,
    creado_en TIMESTAMP DEFAULT NOW()
);

-- =========================================================
-- NOTIFICACIONES
-- =========================================================

CREATE TABLE notificaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_usuario UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    mensaje TEXT,
    creado_en TIMESTAMP DEFAULT NOW()
);