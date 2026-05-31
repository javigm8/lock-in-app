-- Lock In! - Schema de base de datos
-- Versión limpia, compatible con DBeaver y psql

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- TABLAS

CREATE TABLE public.usuario (
    id integer NOT NULL,
    usuario character varying NOT NULL,
    nombre character varying NOT NULL,
    email character varying NOT NULL,
    password_hash character varying NOT NULL,
    configuracion json,
    fecha_registro timestamp without time zone NOT NULL
);

CREATE SEQUENCE public.usuario_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.usuario_id_seq OWNED BY public.usuario.id;
ALTER TABLE ONLY public.usuario ALTER COLUMN id SET DEFAULT nextval('public.usuario_id_seq'::regclass);

CREATE TABLE public.tarea (
    id integer NOT NULL,
    titulo character varying,
    descripcion text,
    estado character varying NOT NULL,
    prioridad integer DEFAULT 0 NOT NULL,
    tiempo_estimado integer,
    tiempo_real integer,
    fecha_limite timestamp without time zone,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id_usuario integer NOT NULL
);

CREATE SEQUENCE public.tarea_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.tarea_id_seq OWNED BY public.tarea.id;
ALTER TABLE ONLY public.tarea ALTER COLUMN id SET DEFAULT nextval('public.tarea_id_seq'::regclass);

CREATE TABLE public.nota (
    id integer NOT NULL,
    titulo character varying,
    contenido text,
    enlace text,
    archivo_adjunto text,
    id_usuario integer NOT NULL,
    id_tarea integer
);

CREATE SEQUENCE public.nota_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.nota_id_seq OWNED BY public.nota.id;
ALTER TABLE ONLY public.nota ALTER COLUMN id SET DEFAULT nextval('public.nota_id_seq'::regclass);

CREATE TABLE public.pizarra (
    id integer NOT NULL,
    titulo character varying NOT NULL,
    datos json,
    version character varying DEFAULT '1.0.0'::character varying NOT NULL,
    fecha_ultima_modificacion timestamp without time zone,
    id_usuario integer NOT NULL
);

CREATE SEQUENCE public.pizarra_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.pizarra_id_seq OWNED BY public.pizarra.id;
ALTER TABLE ONLY public.pizarra ALTER COLUMN id SET DEFAULT nextval('public.pizarra_id_seq'::regclass);

CREATE TABLE public.perfil_sesion (
    id integer NOT NULL,
    id_usuario integer,
    nombre character varying NOT NULL,
    es_custom boolean NOT NULL,
    duracion integer NOT NULL,
    ciclos integer NOT NULL
);

CREATE SEQUENCE public.perfil_sesion_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.perfil_sesion_id_seq OWNED BY public.perfil_sesion.id;
ALTER TABLE ONLY public.perfil_sesion ALTER COLUMN id SET DEFAULT nextval('public.perfil_sesion_id_seq'::regclass);

CREATE TABLE public.sesion (
    id integer NOT NULL,
    duracion integer,
    ciclos_completos integer,
    fecha_inicio timestamp without time zone,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id_usuario integer NOT NULL,
    id_tarea integer,
    id_perfil_sesion integer
);

CREATE SEQUENCE public.sesion_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.sesion_id_seq OWNED BY public.sesion.id;
ALTER TABLE ONLY public.sesion ALTER COLUMN id SET DEFAULT nextval('public.sesion_id_seq'::regclass);

CREATE TABLE public.etiqueta (
    id integer NOT NULL,
    id_usuario integer NOT NULL,
    nombre character varying NOT NULL,
    color character varying
);

CREATE SEQUENCE public.etiqueta_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.etiqueta_id_seq OWNED BY public.etiqueta.id;
ALTER TABLE ONLY public.etiqueta ALTER COLUMN id SET DEFAULT nextval('public.etiqueta_id_seq'::regclass);

CREATE TABLE public.tarea_etiqueta (
    id_tarea integer NOT NULL,
    id_etiqueta integer NOT NULL
);

CREATE TABLE public.recordatorio (
    id integer NOT NULL,
    id_usuario integer NOT NULL,
    id_tarea integer,
    titulo character varying NOT NULL,
    descripcion text,
    repeticion character varying,
    activo boolean DEFAULT true NOT NULL,
    completado boolean DEFAULT false NOT NULL,
    fecha_hora timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE SEQUENCE public.recordatorio_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.recordatorio_id_seq OWNED BY public.recordatorio.id;
ALTER TABLE ONLY public.recordatorio ALTER COLUMN id SET DEFAULT nextval('public.recordatorio_id_seq'::regclass);

CREATE TABLE public.estadistica (
    id integer NOT NULL,
    id_usuario integer NOT NULL,
    fecha date DEFAULT CURRENT_DATE NOT NULL,
    total_tiempo integer NOT NULL,
    sesiones_completadas integer DEFAULT 0 NOT NULL,
    tareas_completadas integer DEFAULT 0 NOT NULL
);

CREATE SEQUENCE public.estadistica_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER SEQUENCE public.estadistica_id_seq OWNED BY public.estadistica.id;
ALTER TABLE ONLY public.estadistica ALTER COLUMN id SET DEFAULT nextval('public.estadistica_id_seq'::regclass);

-- PRIMARY KEYS

ALTER TABLE ONLY public.usuario ADD CONSTRAINT usuario_pk PRIMARY KEY (id);
ALTER TABLE ONLY public.tarea ADD CONSTRAINT tarea_pk PRIMARY KEY (id);
ALTER TABLE ONLY public.nota ADD CONSTRAINT nota_pk PRIMARY KEY (id);
ALTER TABLE ONLY public.pizarra ADD CONSTRAINT pizarra_pk PRIMARY KEY (id);
ALTER TABLE ONLY public.perfil_sesion ADD CONSTRAINT perfil_sesion_pk PRIMARY KEY (id);
ALTER TABLE ONLY public.sesion ADD CONSTRAINT sesion_pk PRIMARY KEY (id);
ALTER TABLE ONLY public.etiqueta ADD CONSTRAINT etiqueta_pk PRIMARY KEY (id);
ALTER TABLE ONLY public.tarea_etiqueta ADD CONSTRAINT tarea_etiqueta_pk PRIMARY KEY (id_tarea, id_etiqueta);
ALTER TABLE ONLY public.recordatorio ADD CONSTRAINT recordatorio_pk PRIMARY KEY (id);
ALTER TABLE ONLY public.estadistica ADD CONSTRAINT estadistica_pk PRIMARY KEY (id);

-- FOREIGN KEYS

ALTER TABLE ONLY public.tarea ADD CONSTRAINT tarea_usuario_fk FOREIGN KEY (id_usuario) REFERENCES public.usuario(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.nota ADD CONSTRAINT nota_usuario_fk FOREIGN KEY (id_usuario) REFERENCES public.usuario(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.nota ADD CONSTRAINT nota_tarea_fk FOREIGN KEY (id_tarea) REFERENCES public.tarea(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.pizarra ADD CONSTRAINT pizarra_usuario_fk FOREIGN KEY (id_usuario) REFERENCES public.usuario(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.perfil_sesion ADD CONSTRAINT perfil_sesion_usuario_fk FOREIGN KEY (id_usuario) REFERENCES public.usuario(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.sesion ADD CONSTRAINT sesion_usuario_fk FOREIGN KEY (id_usuario) REFERENCES public.usuario(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.sesion ADD CONSTRAINT sesion_tarea_fk FOREIGN KEY (id_tarea) REFERENCES public.tarea(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.sesion ADD CONSTRAINT sesion_perfil_sesion_fk FOREIGN KEY (id_perfil_sesion) REFERENCES public.perfil_sesion(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.etiqueta ADD CONSTRAINT etiqueta_usuario_fk FOREIGN KEY (id_usuario) REFERENCES public.usuario(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.tarea_etiqueta ADD CONSTRAINT tarea_etiqueta_tarea_fk FOREIGN KEY (id_tarea) REFERENCES public.tarea(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.tarea_etiqueta ADD CONSTRAINT tarea_etiqueta_etiqueta_fk FOREIGN KEY (id_etiqueta) REFERENCES public.etiqueta(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.recordatorio ADD CONSTRAINT recordatorio_usuario_fk FOREIGN KEY (id_usuario) REFERENCES public.usuario(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.recordatorio ADD CONSTRAINT recordatorio_tarea_fk FOREIGN KEY (id_tarea) REFERENCES public.tarea(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.estadistica ADD CONSTRAINT estadistica_usuario_fk FOREIGN KEY (id_usuario) REFERENCES public.usuario(id) ON DELETE CASCADE;
