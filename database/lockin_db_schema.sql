--
-- PostgreSQL database dump
--

\restrict VvhRMenl4UrMLtLhFfKt4n8SomuiNeBKa2faigS1YF8SHLso9dUuzhQyAwuhcOL

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-05-24 17:25:46

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 236 (class 1259 OID 16535)
-- Name: estadistica; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estadistica (
    id integer NOT NULL,
    id_usuario integer NOT NULL,
    fecha date DEFAULT CURRENT_DATE NOT NULL,
    total_tiempo integer NOT NULL,
    sesiones_completadas integer DEFAULT 0 NOT NULL,
    tareas_completadas integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.estadistica OWNER TO postgres;

--
-- TOC entry 5124 (class 0 OID 0)
-- Dependencies: 236
-- Name: COLUMN estadistica.total_tiempo; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.estadistica.total_tiempo IS 'en minutos';


--
-- TOC entry 235 (class 1259 OID 16534)
-- Name: estadistica_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estadistica_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estadistica_id_seq OWNER TO postgres;

--
-- TOC entry 5125 (class 0 OID 0)
-- Dependencies: 235
-- Name: estadistica_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estadistica_id_seq OWNED BY public.estadistica.id;


--
-- TOC entry 231 (class 1259 OID 16495)
-- Name: etiqueta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.etiqueta (
    id integer NOT NULL,
    id_usuario integer NOT NULL,
    nombre character varying NOT NULL,
    color character varying
);


ALTER TABLE public.etiqueta OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16494)
-- Name: etiqueta_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.etiqueta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.etiqueta_id_seq OWNER TO postgres;

--
-- TOC entry 5126 (class 0 OID 0)
-- Dependencies: 230
-- Name: etiqueta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.etiqueta_id_seq OWNED BY public.etiqueta.id;


--
-- TOC entry 223 (class 1259 OID 16441)
-- Name: nota; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nota (
    id integer NOT NULL,
    titulo character varying,
    contenido text,
    enlace text,
    archivo_adjunto text,
    id_usuario integer NOT NULL,
    id_tarea integer
);


ALTER TABLE public.nota OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16440)
-- Name: nota_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nota_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nota_id_seq OWNER TO postgres;

--
-- TOC entry 5127 (class 0 OID 0)
-- Dependencies: 222
-- Name: nota_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nota_id_seq OWNED BY public.nota.id;


--
-- TOC entry 229 (class 1259 OID 16476)
-- Name: perfil_sesion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.perfil_sesion (
    id integer NOT NULL,
    id_usuario integer,
    nombre character varying NOT NULL,
    es_custom boolean NOT NULL,
    duracion integer NOT NULL,
    ciclos integer NOT NULL
);


ALTER TABLE public.perfil_sesion OWNER TO postgres;

--
-- TOC entry 5128 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN perfil_sesion.duracion; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.perfil_sesion.duracion IS 'en minutos';


--
-- TOC entry 228 (class 1259 OID 16475)
-- Name: perfil_sesion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.perfil_sesion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.perfil_sesion_id_seq OWNER TO postgres;

--
-- TOC entry 5129 (class 0 OID 0)
-- Dependencies: 228
-- Name: perfil_sesion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.perfil_sesion_id_seq OWNED BY public.perfil_sesion.id;


--
-- TOC entry 225 (class 1259 OID 16451)
-- Name: pizarra; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pizarra (
    id integer NOT NULL,
    titulo character varying NOT NULL,
    datos json,
    version character varying DEFAULT '1.0.0'::character varying NOT NULL,
    fecha_ultima_modificacion timestamp without time zone,
    id_usuario integer NOT NULL
);


ALTER TABLE public.pizarra OWNER TO postgres;

--
-- TOC entry 5130 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN pizarra.datos; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.pizarra.datos IS 'contenido de la pizzarra';


--
-- TOC entry 224 (class 1259 OID 16450)
-- Name: pizarra_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pizarra_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pizarra_id_seq OWNER TO postgres;

--
-- TOC entry 5131 (class 0 OID 0)
-- Dependencies: 224
-- Name: pizarra_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pizarra_id_seq OWNED BY public.pizarra.id;


--
-- TOC entry 234 (class 1259 OID 16512)
-- Name: recordatorio; Type: TABLE; Schema: public; Owner: postgres
--

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


ALTER TABLE public.recordatorio OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16511)
-- Name: recordatorio_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recordatorio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recordatorio_id_seq OWNER TO postgres;

--
-- TOC entry 5132 (class 0 OID 0)
-- Dependencies: 233
-- Name: recordatorio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recordatorio_id_seq OWNED BY public.recordatorio.id;


--
-- TOC entry 227 (class 1259 OID 16465)
-- Name: sesion; Type: TABLE; Schema: public; Owner: postgres
--

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


ALTER TABLE public.sesion OWNER TO postgres;

--
-- TOC entry 5133 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN sesion.duracion; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.sesion.duracion IS 'en minutos';


--
-- TOC entry 226 (class 1259 OID 16464)
-- Name: sesion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sesion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sesion_id_seq OWNER TO postgres;

--
-- TOC entry 5134 (class 0 OID 0)
-- Dependencies: 226
-- Name: sesion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sesion_id_seq OWNED BY public.sesion.id;


--
-- TOC entry 221 (class 1259 OID 16427)
-- Name: tarea; Type: TABLE; Schema: public; Owner: postgres
--

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


ALTER TABLE public.tarea OWNER TO postgres;

--
-- TOC entry 5135 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN tarea.tiempo_estimado; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tarea.tiempo_estimado IS 'en segundos';


--
-- TOC entry 5136 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN tarea.tiempo_real; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tarea.tiempo_real IS 'en segundos';


--
-- TOC entry 232 (class 1259 OID 16506)
-- Name: tarea_etiqueta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tarea_etiqueta (
    id_tarea integer NOT NULL,
    id_etiqueta integer NOT NULL
);


ALTER TABLE public.tarea_etiqueta OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16426)
-- Name: tarea_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tarea_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tarea_id_seq OWNER TO postgres;

--
-- TOC entry 5137 (class 0 OID 0)
-- Dependencies: 220
-- Name: tarea_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tarea_id_seq OWNED BY public.tarea.id;


--
-- TOC entry 219 (class 1259 OID 16389)
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    usuario character varying NOT NULL,
    nombre character varying NOT NULL,
    email character varying NOT NULL,
    password_hash character varying NOT NULL,
    configuracion json,
    fecha_registro timestamp without time zone NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16551)
-- Name: usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_id_seq OWNER TO postgres;

--
-- TOC entry 5138 (class 0 OID 0)
-- Dependencies: 237
-- Name: usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_id_seq OWNED BY public.usuario.id;


--
-- TOC entry 4915 (class 2604 OID 16538)
-- Name: estadistica id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estadistica ALTER COLUMN id SET DEFAULT nextval('public.estadistica_id_seq'::regclass);


--
-- TOC entry 4910 (class 2604 OID 16498)
-- Name: etiqueta id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etiqueta ALTER COLUMN id SET DEFAULT nextval('public.etiqueta_id_seq'::regclass);


--
-- TOC entry 4904 (class 2604 OID 16444)
-- Name: nota id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota ALTER COLUMN id SET DEFAULT nextval('public.nota_id_seq'::regclass);


--
-- TOC entry 4909 (class 2604 OID 16479)
-- Name: perfil_sesion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil_sesion ALTER COLUMN id SET DEFAULT nextval('public.perfil_sesion_id_seq'::regclass);


--
-- TOC entry 4905 (class 2604 OID 16454)
-- Name: pizarra id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pizarra ALTER COLUMN id SET DEFAULT nextval('public.pizarra_id_seq'::regclass);


--
-- TOC entry 4911 (class 2604 OID 16515)
-- Name: recordatorio id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recordatorio ALTER COLUMN id SET DEFAULT nextval('public.recordatorio_id_seq'::regclass);


--
-- TOC entry 4907 (class 2604 OID 16468)
-- Name: sesion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sesion ALTER COLUMN id SET DEFAULT nextval('public.sesion_id_seq'::regclass);


--
-- TOC entry 4901 (class 2604 OID 16430)
-- Name: tarea id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tarea ALTER COLUMN id SET DEFAULT nextval('public.tarea_id_seq'::regclass);


--
-- TOC entry 4900 (class 2604 OID 16552)
-- Name: usuario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id SET DEFAULT nextval('public.usuario_id_seq'::regclass);


--
-- TOC entry 5117 (class 0 OID 16535)
-- Dependencies: 236
-- Data for Name: estadistica; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estadistica (id, id_usuario, fecha, total_tiempo, sesiones_completadas, tareas_completadas) FROM stdin;
\.


--
-- TOC entry 5112 (class 0 OID 16495)
-- Dependencies: 231
-- Data for Name: etiqueta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.etiqueta (id, id_usuario, nombre, color) FROM stdin;
\.


--
-- TOC entry 5104 (class 0 OID 16441)
-- Dependencies: 223
-- Data for Name: nota; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nota (id, titulo, contenido, enlace, archivo_adjunto, id_usuario, id_tarea) FROM stdin;
\.


--
-- TOC entry 5110 (class 0 OID 16476)
-- Dependencies: 229
-- Data for Name: perfil_sesion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.perfil_sesion (id, id_usuario, nombre, es_custom, duracion, ciclos) FROM stdin;
\.


--
-- TOC entry 5106 (class 0 OID 16451)
-- Dependencies: 225
-- Data for Name: pizarra; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pizarra (id, titulo, datos, version, fecha_ultima_modificacion, id_usuario) FROM stdin;
\.


--
-- TOC entry 5115 (class 0 OID 16512)
-- Dependencies: 234
-- Data for Name: recordatorio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recordatorio (id, id_usuario, id_tarea, titulo, descripcion, repeticion, activo, completado, fecha_hora) FROM stdin;
\.


--
-- TOC entry 5108 (class 0 OID 16465)
-- Dependencies: 227
-- Data for Name: sesion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sesion (id, duracion, ciclos_completos, fecha_inicio, fecha_creacion, id_usuario, id_tarea, id_perfil_sesion) FROM stdin;
\.


--
-- TOC entry 5102 (class 0 OID 16427)
-- Dependencies: 221
-- Data for Name: tarea; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tarea (id, titulo, descripcion, estado, prioridad, tiempo_estimado, tiempo_real, fecha_limite, fecha_creacion, id_usuario) FROM stdin;
\.


--
-- TOC entry 5113 (class 0 OID 16506)
-- Dependencies: 232
-- Data for Name: tarea_etiqueta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tarea_etiqueta (id_tarea, id_etiqueta) FROM stdin;
\.


--
-- TOC entry 5100 (class 0 OID 16389)
-- Dependencies: 219
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (usuario, nombre, email, password_hash, configuracion, fecha_registro, id) FROM stdin;
\.


--
-- TOC entry 5139 (class 0 OID 0)
-- Dependencies: 235
-- Name: estadistica_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estadistica_id_seq', 1, false);


--
-- TOC entry 5140 (class 0 OID 0)
-- Dependencies: 230
-- Name: etiqueta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.etiqueta_id_seq', 1, false);


--
-- TOC entry 5141 (class 0 OID 0)
-- Dependencies: 222
-- Name: nota_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nota_id_seq', 1, false);


--
-- TOC entry 5142 (class 0 OID 0)
-- Dependencies: 228
-- Name: perfil_sesion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.perfil_sesion_id_seq', 1, false);


--
-- TOC entry 5143 (class 0 OID 0)
-- Dependencies: 224
-- Name: pizarra_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pizarra_id_seq', 1, false);


--
-- TOC entry 5144 (class 0 OID 0)
-- Dependencies: 233
-- Name: recordatorio_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recordatorio_id_seq', 1, false);


--
-- TOC entry 5145 (class 0 OID 0)
-- Dependencies: 226
-- Name: sesion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sesion_id_seq', 1, false);


--
-- TOC entry 5146 (class 0 OID 0)
-- Dependencies: 220
-- Name: tarea_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tarea_id_seq', 1, false);


--
-- TOC entry 5147 (class 0 OID 0)
-- Dependencies: 237
-- Name: usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_id_seq', 1, false);


--
-- TOC entry 4938 (class 2606 OID 16549)
-- Name: estadistica estadistica_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estadistica
    ADD CONSTRAINT estadistica_pk PRIMARY KEY (id);


--
-- TOC entry 4932 (class 2606 OID 16505)
-- Name: etiqueta etiqueta_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etiqueta
    ADD CONSTRAINT etiqueta_pk PRIMARY KEY (id);


--
-- TOC entry 4924 (class 2606 OID 16449)
-- Name: nota nota_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota
    ADD CONSTRAINT nota_pk PRIMARY KEY (id);


--
-- TOC entry 4930 (class 2606 OID 16488)
-- Name: perfil_sesion perfil_sesion_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil_sesion
    ADD CONSTRAINT perfil_sesion_pk PRIMARY KEY (id);


--
-- TOC entry 4926 (class 2606 OID 16462)
-- Name: pizarra pizarra_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pizarra
    ADD CONSTRAINT pizarra_pk PRIMARY KEY (id);


--
-- TOC entry 4936 (class 2606 OID 16528)
-- Name: recordatorio recordatorio_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recordatorio
    ADD CONSTRAINT recordatorio_pk PRIMARY KEY (id);


--
-- TOC entry 4928 (class 2606 OID 16474)
-- Name: sesion sesion_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sesion
    ADD CONSTRAINT sesion_pk PRIMARY KEY (id);


--
-- TOC entry 4934 (class 2606 OID 16638)
-- Name: tarea_etiqueta tarea_etiqueta_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tarea_etiqueta
    ADD CONSTRAINT tarea_etiqueta_pk PRIMARY KEY (id_tarea, id_etiqueta);


--
-- TOC entry 4922 (class 2606 OID 16564)
-- Name: tarea tarea_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tarea
    ADD CONSTRAINT tarea_pk PRIMARY KEY (id);


--
-- TOC entry 4920 (class 2606 OID 16562)
-- Name: usuario usuario_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pk PRIMARY KEY (id);


--
-- TOC entry 4952 (class 2606 OID 16581)
-- Name: estadistica estadistica_usuario_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estadistica
    ADD CONSTRAINT estadistica_usuario_fk FOREIGN KEY (id_usuario) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- TOC entry 4947 (class 2606 OID 16586)
-- Name: etiqueta etiqueta_usuario_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etiqueta
    ADD CONSTRAINT etiqueta_usuario_fk FOREIGN KEY (id_usuario) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- TOC entry 4940 (class 2606 OID 16576)
-- Name: nota nota_tarea_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota
    ADD CONSTRAINT nota_tarea_fk FOREIGN KEY (id_tarea) REFERENCES public.tarea(id) ON DELETE CASCADE;


--
-- TOC entry 4941 (class 2606 OID 16571)
-- Name: nota nota_usuario_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota
    ADD CONSTRAINT nota_usuario_fk FOREIGN KEY (id_tarea) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- TOC entry 4946 (class 2606 OID 16591)
-- Name: perfil_sesion perfil_sesion_usuario_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perfil_sesion
    ADD CONSTRAINT perfil_sesion_usuario_fk FOREIGN KEY (id_usuario) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- TOC entry 4942 (class 2606 OID 16597)
-- Name: pizarra pizarra_usuario_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pizarra
    ADD CONSTRAINT pizarra_usuario_fk FOREIGN KEY (id_usuario) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- TOC entry 4950 (class 2606 OID 16607)
-- Name: recordatorio recordatorio_tarea_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recordatorio
    ADD CONSTRAINT recordatorio_tarea_fk FOREIGN KEY (id_tarea) REFERENCES public.tarea(id) ON DELETE CASCADE;


--
-- TOC entry 4951 (class 2606 OID 16602)
-- Name: recordatorio recordatorio_usuario_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recordatorio
    ADD CONSTRAINT recordatorio_usuario_fk FOREIGN KEY (id_usuario) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- TOC entry 4943 (class 2606 OID 16622)
-- Name: sesion sesion_perfil_sesion_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sesion
    ADD CONSTRAINT sesion_perfil_sesion_fk FOREIGN KEY (id_perfil_sesion) REFERENCES public.perfil_sesion(id) ON DELETE CASCADE;


--
-- TOC entry 4944 (class 2606 OID 16617)
-- Name: sesion sesion_tarea_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sesion
    ADD CONSTRAINT sesion_tarea_fk FOREIGN KEY (id_tarea) REFERENCES public.tarea(id) ON DELETE CASCADE;


--
-- TOC entry 4945 (class 2606 OID 16612)
-- Name: sesion sesion_usuario_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sesion
    ADD CONSTRAINT sesion_usuario_fk FOREIGN KEY (id_usuario) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- TOC entry 4948 (class 2606 OID 16632)
-- Name: tarea_etiqueta tarea_etiqueta_etiqueta_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tarea_etiqueta
    ADD CONSTRAINT tarea_etiqueta_etiqueta_fk FOREIGN KEY (id_etiqueta) REFERENCES public.etiqueta(id) ON DELETE CASCADE;


--
-- TOC entry 4949 (class 2606 OID 16627)
-- Name: tarea_etiqueta tarea_etiqueta_tarea_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tarea_etiqueta
    ADD CONSTRAINT tarea_etiqueta_tarea_fk FOREIGN KEY (id_tarea) REFERENCES public.tarea(id) ON DELETE CASCADE;


--
-- TOC entry 4939 (class 2606 OID 16565)
-- Name: tarea tarea_usuario_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tarea
    ADD CONSTRAINT tarea_usuario_fk FOREIGN KEY (id_usuario) REFERENCES public.usuario(id) ON DELETE CASCADE;


-- Completed on 2026-05-24 17:25:46

--
-- PostgreSQL database dump complete
--

\unrestrict VvhRMenl4UrMLtLhFfKt4n8SomuiNeBKa2faigS1YF8SHLso9dUuzhQyAwuhcOL

