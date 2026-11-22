--
-- PostgreSQL database dump
--

\restrict gTzG4CfWScaHIZmVEU6LX3jRix5fNOk3ZcNYPXlzaUiiCiRHfTZiJE5q8B9LbC7

-- Dumped from database version 17.11
-- Dumped by pg_dump version 18.7

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: check_emergency_only_q1(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_emergency_only_q1() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.is_emergency AND NOT EXISTS (
       SELECT 1 FROM self_assessment_questions q WHERE q.question_id = NEW.question_id AND q.q_code = 'q1') THEN
    RAISE EXCEPTION 'penanda darurat hanya boleh untuk pertanyaan Q1';
  END IF;
  RETURN NEW;
END $$;


--
-- Name: match_knowledge_chunks(public.vector, integer, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.match_knowledge_chunks(query_embedding public.vector, match_count integer DEFAULT 20, require_verified boolean DEFAULT false) RETURNS TABLE(chunk_id bigint, entry_id integer, entry_type character varying, title character varying, topic character varying, article_number character varying, page_number integer, chunk_text text, metadata jsonb, similarity double precision)
    LANGUAGE sql STABLE
    AS $$
  SELECT c.chunk_id, c.entry_id, e.entry_type, e.title, e.topic,
         c.article_number, c.page_number, c.chunk_text, c.metadata,
         (1 - (c.embedding <=> query_embedding))::double precision AS similarity
  FROM public.knowledge_chunks c
  JOIN public.knowledge_entries e ON e.entry_id = c.entry_id
  WHERE e.is_active
    AND e.processing_status = 'done'
    AND (NOT require_verified OR e.verified_by <> 'belum ditinjau')
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
$$;


--
-- Name: match_knowledge_chunks_gemini(public.vector, integer, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.match_knowledge_chunks_gemini(query_embedding public.vector, match_count integer DEFAULT 20, require_verified boolean DEFAULT false) RETURNS TABLE(chunk_id bigint, entry_id integer, entry_type character varying, title character varying, topic character varying, article_number character varying, page_number integer, chunk_text text, metadata jsonb, similarity double precision)
    LANGUAGE sql STABLE
    AS $$
  SELECT c.chunk_id, c.entry_id, e.entry_type, e.title, e.topic,
         c.article_number, c.page_number, c.chunk_text, c.metadata,
         (1 - (c.embedding_gemini <=> query_embedding))::double precision AS similarity
  FROM public.knowledge_chunks c
  JOIN public.knowledge_entries e ON e.entry_id = c.entry_id
  WHERE e.is_active
    AND e.processing_status = 'done'
    AND (NOT require_verified OR e.verified_by <> 'belum ditinjau')
  ORDER BY c.embedding_gemini <=> query_embedding
  LIMIT match_count;
$$;


--
-- Name: touch_session(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.touch_session(p_token_hash text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare
  v_count int;
begin
  update anonymous_sessions
  set last_active_at = now()
  where session_token_hash = p_token_hash
    and expires_at > now();

  get diagnostics v_count = row_count;
  return v_count > 0;
end;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ai_feedback; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_feedback (
    feedback_id bigint NOT NULL,
    message_id bigint NOT NULL,
    message_sender character varying(10) DEFAULT 'ai'::character varying NOT NULL,
    session_id bigint NOT NULL,
    is_helpful boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    reason_code text,
    reason_text text,
    CONSTRAINT ck_ai_feedback_sender CHECK (((message_sender)::text = 'ai'::text))
);


--
-- Name: TABLE ai_feedback; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.ai_feedback IS 'Penilaian membantu / tidak membantu untuk jawaban AI.';


--
-- Name: ai_feedback_feedback_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.ai_feedback ALTER COLUMN feedback_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.ai_feedback_feedback_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: ai_message_sources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_message_sources (
    source_id bigint NOT NULL,
    message_id bigint NOT NULL,
    message_sender character varying(10) DEFAULT 'ai'::character varying NOT NULL,
    chunk_id bigint,
    rank_order integer NOT NULL,
    similarity numeric(5,4) NOT NULL,
    CONSTRAINT ck_ai_message_sources_sender CHECK (((message_sender)::text = 'ai'::text)),
    CONSTRAINT ck_ai_message_sources_similarity CHECK (((similarity >= ('-1'::integer)::numeric) AND (similarity <= (1)::numeric)))
);


--
-- Name: TABLE ai_message_sources; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.ai_message_sources IS 'Chunk yang dipakai AI untuk menjawab sebuah pesan (urutan dan skor kemiripan).';


--
-- Name: ai_message_sources_source_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.ai_message_sources ALTER COLUMN source_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.ai_message_sources_source_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: ai_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_messages (
    message_id bigint NOT NULL,
    session_id bigint NOT NULL,
    sender_type character varying(10) NOT NULL,
    message_type character varying(30) NOT NULL,
    content text NOT NULL,
    sent_at timestamp with time zone DEFAULT now() NOT NULL,
    response_mode character varying,
    CONSTRAINT ck_ai_messages_response_mode CHECK (((response_mode IS NULL) OR ((response_mode)::text = ANY ((ARRAY['rag'::character varying, 'darurat'::character varying, 'tanpa_sumber'::character varying, 'error_llm'::character varying, 'llm_kosong'::character varying, 'sapaan'::character varying, 'gagal_verifikasi'::character varying, 'klarifikasi'::character varying])::text[])))),
    CONSTRAINT ck_ai_messages_sender CHECK (((sender_type)::text = ANY ((ARRAY['user'::character varying, 'ai'::character varying])::text[])))
);


--
-- Name: TABLE ai_messages; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.ai_messages IS 'Riwayat percakapan pengguna dan AI dalam satu sesi. Belum ada aturan penghapusan otomatis.';


--
-- Name: ai_messages_message_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.ai_messages ALTER COLUMN message_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.ai_messages_message_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: anonymous_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.anonymous_sessions (
    session_id bigint NOT NULL,
    session_token_hash character varying(64) NOT NULL,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    last_active_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    validated_category character varying(50),
    validated_at timestamp with time zone
);


--
-- Name: TABLE anonymous_sessions; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.anonymous_sessions IS 'Identitas anonim berbasis hash token. Menyimpan hasil kategori Cek Kondisi, bukan jawaban per pertanyaan.';


--
-- Name: anonymous_sessions_session_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.anonymous_sessions ALTER COLUMN session_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.anonymous_sessions_session_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: article_likes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.article_likes (
    like_id bigint NOT NULL,
    entry_id integer NOT NULL,
    reader_session_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE article_likes; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.article_likes IS 'Satu sesi hanya bisa menyukai satu artikel satu kali.';


--
-- Name: article_likes_like_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.article_likes ALTER COLUMN like_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.article_likes_like_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: cities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cities (
    city_id integer NOT NULL,
    province_id smallint NOT NULL,
    city_name character varying(100) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: TABLE cities; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.cities IS 'Kota dan kabupaten';


--
-- Name: cities_city_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.cities ALTER COLUMN city_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.cities_city_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: knowledge_chunks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.knowledge_chunks (
    chunk_id bigint NOT NULL,
    entry_id integer NOT NULL,
    chunk_index integer NOT NULL,
    page_number integer,
    article_number character varying(50),
    chunk_text text NOT NULL,
    embedding public.vector(768) NOT NULL,
    embedding_model character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    page_end integer,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    embedding_gemini public.vector(768),
    embedding_gemini_model text,
    CONSTRAINT ck_knowledge_chunks_pages CHECK (((page_end IS NULL) OR (page_number IS NULL) OR (page_end >= page_number)))
);


--
-- Name: TABLE knowledge_chunks; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.knowledge_chunks IS 'Potongan dokumen dan vektor embedding 768 dimensi (intfloat/multilingual-e5-base). Tabel inilah yang dicari saat retrieval.';


--
-- Name: knowledge_chunks_chunk_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.knowledge_chunks ALTER COLUMN chunk_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.knowledge_chunks_chunk_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: knowledge_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.knowledge_entries (
    entry_id integer NOT NULL,
    entry_type character varying(30) NOT NULL,
    topic character varying(50) NOT NULL,
    source_name character varying(150) NOT NULL,
    title character varying(200) NOT NULL,
    publisher character varying(150) NOT NULL,
    document_date character varying(50),
    drive_file_id character varying(200) NOT NULL,
    official_source_url character varying(500),
    verified_by character varying(200) DEFAULT 'belum ditinjau'::character varying NOT NULL,
    verified_at timestamp with time zone,
    is_active boolean DEFAULT false NOT NULL,
    ingested_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    processing_status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    checksum_sha256 character varying(64),
    last_successful_checksum character varying(64),
    error_message text,
    slug character varying(200),
    content_md text,
    summary text,
    image_url character varying,
    is_headline boolean DEFAULT false NOT NULL,
    read_minutes smallint,
    published_at timestamp with time zone,
    show_in_education boolean DEFAULT false NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    CONSTRAINT ck_knowledge_entries_status CHECK (((processing_status)::text = ANY ((ARRAY['pending'::character varying, 'processing'::character varying, 'done'::character varying, 'failed'::character varying, 'skipped'::character varying])::text[]))),
    CONSTRAINT ck_knowledge_entries_type CHECK (((entry_type)::text = ANY (ARRAY['hukum'::text, 'panduan_dukungan'::text, 'prosedur'::text, 'layanan'::text, 'checklist'::text, 'edukasi'::text]))),
    CONSTRAINT knowledge_entries_read_minutes_check CHECK ((read_minutes > 0)),
    CONSTRAINT knowledge_entries_slug_check CHECK (((slug)::text ~ '^[a-z0-9]+(-[a-z0-9]+)*$'::text))
);


--
-- Name: TABLE knowledge_entries; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.knowledge_entries IS 'Satu baris = satu dokumen sumber (UU, panduan, artikel publik).';


--
-- Name: knowledge_entries_entry_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.knowledge_entries ALTER COLUMN entry_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.knowledge_entries_entry_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: knowledge_topics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.knowledge_topics (
    topic_code character varying NOT NULL,
    topic_label character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


--
-- Name: provinces; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.provinces (
    province_id smallint NOT NULL,
    province_name character varying(80) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: TABLE provinces; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.provinces IS '38 provinsi Indonesia. Nama perlu dicocokkan dengan sumber resmi sebelum produksi.';


--
-- Name: provinces_province_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.provinces ALTER COLUMN province_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.provinces_province_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: reinforcement_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reinforcement_messages (
    reinforcement_id bigint NOT NULL,
    author_session_id bigint,
    content_messages character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_role character varying,
    user_location character varying,
    deleted_at timestamp with time zone,
    edited_at timestamp with time zone
);


--
-- Name: TABLE reinforcement_messages; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.reinforcement_messages IS 'Pesan penguatan dari pengguna.';


--
-- Name: reinforcement_messages_reinforcement_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.reinforcement_messages ALTER COLUMN reinforcement_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.reinforcement_messages_reinforcement_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: reinforcement_reactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reinforcement_reactions (
    reaction_id bigint NOT NULL,
    reinforcement_id bigint NOT NULL,
    reader_session_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE reinforcement_reactions; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.reinforcement_reactions IS 'Reaksi pembaca terhadap pesan penguatan.';


--
-- Name: reinforcement_reactions_reaction_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.reinforcement_reactions ALTER COLUMN reaction_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.reinforcement_reactions_reaction_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: relaxation_tracks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.relaxation_tracks (
    track_id integer NOT NULL,
    category character varying(20) NOT NULL,
    title character varying(100) NOT NULL,
    description character varying(200),
    audio_url character varying(500),
    duration_seconds integer,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
    sound_key character varying,
    CONSTRAINT ck_relaxation_tracks_active_has_audio CHECK (((NOT is_active) OR (audio_url IS NOT NULL) OR (sound_key IS NOT NULL))),
    CONSTRAINT ck_relaxation_tracks_category CHECK (((category)::text = ANY ((ARRAY['noise'::character varying, 'suara_alam'::character varying, 'musik'::character varying])::text[]))),
    CONSTRAINT ck_relaxation_tracks_duration CHECK (((duration_seconds IS NULL) OR (duration_seconds > 0)))
);


--
-- Name: TABLE relaxation_tracks; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.relaxation_tracks IS 'Katalog audio latihan tenang (noise, suara alam, musik). Hanya yang is_active yang tampil. Diaktifkan setelah file audio tersedia.';


--
-- Name: COLUMN relaxation_tracks.is_active; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.relaxation_tracks.is_active IS 'Benar hanya jika audio_url sudah terisi, dijaga CHECK.';


--
-- Name: relaxation_tracks_track_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.relaxation_tracks ALTER COLUMN track_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.relaxation_tracks_track_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: self_assessment_options; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.self_assessment_options (
    option_id integer NOT NULL,
    question_id smallint NOT NULL,
    option_code character varying(2) NOT NULL,
    option_label character varying(200) NOT NULL,
    query_text character varying(300),
    topic_hints text[] DEFAULT '{}'::text[] NOT NULL,
    entry_type character varying(30),
    is_emergency boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    is_education boolean DEFAULT false NOT NULL,
    CONSTRAINT ck_cek_kondisi_options_code CHECK (((option_code)::text ~ '^[a-z]$'::text)),
    CONSTRAINT ck_self_assessment_options_entry_type CHECK (((entry_type)::text = ANY ((ARRAY['hukum'::character varying, 'panduan_dukungan'::character varying, 'prosedur'::character varying, 'layanan'::character varying, 'checklist'::character varying])::text[])))
);


--
-- Name: TABLE self_assessment_options; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.self_assessment_options IS 'Pilihan jawaban Cek Kondisi beserta aturan topik dan tipe yang dipakai pipeline.';


--
-- Name: COLUMN self_assessment_options.is_emergency; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.self_assessment_options.is_emergency IS 'Benar hanya untuk pilihan dalam bahaya di Q1. Dijaga trigger.';


--
-- Name: self_assessment_options_option_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.self_assessment_options ALTER COLUMN option_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.self_assessment_options_option_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: self_assessment_questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.self_assessment_questions (
    question_id smallint NOT NULL,
    q_code character varying(2) NOT NULL,
    question_text text NOT NULL,
    allows_multiple boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    updated_at timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
    CONSTRAINT ck_cek_kondisi_questions_q_code CHECK (((q_code)::text = ANY ((ARRAY['q1'::character varying, 'q2'::character varying, 'q3'::character varying, 'q4'::character varying, 'q5'::character varying, 'q6'::character varying])::text[]))),
    CONSTRAINT ck_cek_kondisi_questions_text CHECK (((char_length(question_text) >= 5) AND (char_length(question_text) <= 300)))
);


--
-- Name: TABLE self_assessment_questions; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.self_assessment_questions IS 'Enam pertanyaan Cek Kondisi (Q1 sampai Q6). Hanya definisi.';


--
-- Name: COLUMN self_assessment_questions.allows_multiple; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.self_assessment_questions.allows_multiple IS 'Benar hanya untuk Q4, karena boleh lebih dari satu jawaban.';


--
-- Name: self_assessment_questions_question_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.self_assessment_questions ALTER COLUMN question_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.self_assessment_questions_question_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: service_providers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_providers (
    provider_id integer NOT NULL,
    provider_name character varying(150) NOT NULL,
    provider_type character varying(20) NOT NULL,
    province character varying(80) NOT NULL,
    city character varying(80) NOT NULL,
    address text NOT NULL,
    phone_number character varying(255),
    latitude numeric(9,6),
    longitude numeric(9,6),
    source_url character varying(500) NOT NULL,
    verified_at timestamp with time zone,
    is_verified boolean DEFAULT false NOT NULL,
    is_national boolean DEFAULT false NOT NULL,
    email_providers character varying,
    desc_providers character varying,
    operating_hours character varying,
    social_media_providers character varying,
    city_id integer,
    province_id smallint
);


--
-- Name: TABLE service_providers; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.service_providers IS 'Daftar lembaga layanan.';


--
-- Name: service_providers_provider_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.service_providers ALTER COLUMN provider_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.service_providers_provider_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: ai_feedback ai_feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_feedback
    ADD CONSTRAINT ai_feedback_pkey PRIMARY KEY (feedback_id);


--
-- Name: ai_message_sources ai_message_sources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_message_sources
    ADD CONSTRAINT ai_message_sources_pkey PRIMARY KEY (source_id);


--
-- Name: ai_messages ai_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_messages
    ADD CONSTRAINT ai_messages_pkey PRIMARY KEY (message_id);


--
-- Name: anonymous_sessions anonymous_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.anonymous_sessions
    ADD CONSTRAINT anonymous_sessions_pkey PRIMARY KEY (session_id);


--
-- Name: anonymous_sessions anonymous_sessions_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.anonymous_sessions
    ADD CONSTRAINT anonymous_sessions_token_hash_key UNIQUE (session_token_hash);


--
-- Name: article_likes article_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.article_likes
    ADD CONSTRAINT article_likes_pkey PRIMARY KEY (like_id);


--
-- Name: cities cities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_pkey PRIMARY KEY (city_id);


--
-- Name: knowledge_chunks knowledge_chunks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_chunks
    ADD CONSTRAINT knowledge_chunks_pkey PRIMARY KEY (chunk_id);


--
-- Name: knowledge_entries knowledge_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_entries
    ADD CONSTRAINT knowledge_entries_pkey PRIMARY KEY (entry_id);


--
-- Name: knowledge_entries knowledge_entries_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_entries
    ADD CONSTRAINT knowledge_entries_slug_key UNIQUE (slug);


--
-- Name: knowledge_topics knowledge_topics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_topics
    ADD CONSTRAINT knowledge_topics_pkey PRIMARY KEY (topic_code);


--
-- Name: provinces provinces_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT provinces_pkey PRIMARY KEY (province_id);


--
-- Name: reinforcement_messages reinforcement_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reinforcement_messages
    ADD CONSTRAINT reinforcement_messages_pkey PRIMARY KEY (reinforcement_id);


--
-- Name: reinforcement_reactions reinforcement_reactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reinforcement_reactions
    ADD CONSTRAINT reinforcement_reactions_pkey PRIMARY KEY (reaction_id);


--
-- Name: relaxation_tracks relaxation_tracks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.relaxation_tracks
    ADD CONSTRAINT relaxation_tracks_pkey PRIMARY KEY (track_id);


--
-- Name: relaxation_tracks relaxation_tracks_sound_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.relaxation_tracks
    ADD CONSTRAINT relaxation_tracks_sound_key_key UNIQUE (sound_key);


--
-- Name: self_assessment_options self_assessment_options_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.self_assessment_options
    ADD CONSTRAINT self_assessment_options_pkey PRIMARY KEY (option_id);


--
-- Name: self_assessment_questions self_assessment_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.self_assessment_questions
    ADD CONSTRAINT self_assessment_questions_pkey PRIMARY KEY (question_id);


--
-- Name: service_providers service_providers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_providers
    ADD CONSTRAINT service_providers_pkey PRIMARY KEY (provider_id);


--
-- Name: ai_feedback uq_ai_feedback_message_session; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_feedback
    ADD CONSTRAINT uq_ai_feedback_message_session UNIQUE (message_id, session_id);


--
-- Name: ai_messages uq_ai_messages_id_sender; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_messages
    ADD CONSTRAINT uq_ai_messages_id_sender UNIQUE (message_id, sender_type);


--
-- Name: article_likes uq_article_likes_entry_session; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.article_likes
    ADD CONSTRAINT uq_article_likes_entry_session UNIQUE (entry_id, reader_session_id);


--
-- Name: self_assessment_questions uq_cek_kondisi_questions_q_code; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.self_assessment_questions
    ADD CONSTRAINT uq_cek_kondisi_questions_q_code UNIQUE (q_code);


--
-- Name: knowledge_chunks uq_knowledge_chunks_entry_index; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_chunks
    ADD CONSTRAINT uq_knowledge_chunks_entry_index UNIQUE (entry_id, chunk_index);


--
-- Name: knowledge_entries uq_knowledge_entries_drive_file; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_entries
    ADD CONSTRAINT uq_knowledge_entries_drive_file UNIQUE (drive_file_id);


--
-- Name: provinces uq_provinces_name; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT uq_provinces_name UNIQUE (province_name);


--
-- Name: reinforcement_reactions uq_reaction_per_session; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reinforcement_reactions
    ADD CONSTRAINT uq_reaction_per_session UNIQUE (reinforcement_id, reader_session_id);


--
-- Name: self_assessment_options uq_self_assessment_options_question_code; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.self_assessment_options
    ADD CONSTRAINT uq_self_assessment_options_question_code UNIQUE (question_id, option_code);


--
-- Name: idx_ai_feedback_session; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ai_feedback_session ON public.ai_feedback USING btree (session_id);


--
-- Name: idx_ai_message_sources_chunk; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ai_message_sources_chunk ON public.ai_message_sources USING btree (chunk_id);


--
-- Name: idx_ai_messages_sent_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ai_messages_sent_at ON public.ai_messages USING btree (sent_at);


--
-- Name: idx_ai_messages_session_sent; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ai_messages_session_sent ON public.ai_messages USING btree (session_id, sent_at);


--
-- Name: idx_anonymous_sessions_expires; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_anonymous_sessions_expires ON public.anonymous_sessions USING btree (expires_at);


--
-- Name: idx_cities_province; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cities_province ON public.cities USING btree (province_id);


--
-- Name: idx_knowledge_chunks_embedding_gemini_hnsw; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_knowledge_chunks_embedding_gemini_hnsw ON public.knowledge_chunks USING hnsw (embedding_gemini public.vector_cosine_ops) WITH (m='16', ef_construction='64');


--
-- Name: idx_knowledge_chunks_embedding_hnsw; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_knowledge_chunks_embedding_hnsw ON public.knowledge_chunks USING hnsw (embedding public.vector_cosine_ops) WITH (m='16', ef_construction='64');


--
-- Name: idx_knowledge_chunks_metadata; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_knowledge_chunks_metadata ON public.knowledge_chunks USING gin (metadata jsonb_path_ops);


--
-- Name: idx_knowledge_entries_active_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_knowledge_entries_active_status ON public.knowledge_entries USING btree (is_active, processing_status);


--
-- Name: service_providers_city_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX service_providers_city_id_idx ON public.service_providers USING btree (city_id);


--
-- Name: self_assessment_options tr_cek_kondisi_options_emergency_q1; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_cek_kondisi_options_emergency_q1 BEFORE INSERT OR UPDATE ON public.self_assessment_options FOR EACH ROW EXECUTE FUNCTION public.check_emergency_only_q1();


--
-- Name: ai_feedback fk_ai_messages_to_ai_feedback; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_feedback
    ADD CONSTRAINT fk_ai_messages_to_ai_feedback FOREIGN KEY (message_id, message_sender) REFERENCES public.ai_messages(message_id, sender_type) ON DELETE CASCADE;


--
-- Name: ai_message_sources fk_ai_messages_to_ai_message_sources; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_message_sources
    ADD CONSTRAINT fk_ai_messages_to_ai_message_sources FOREIGN KEY (message_id, message_sender) REFERENCES public.ai_messages(message_id, sender_type) ON DELETE CASCADE;


--
-- Name: ai_feedback fk_anonymous_sessions_to_ai_feedback; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_feedback
    ADD CONSTRAINT fk_anonymous_sessions_to_ai_feedback FOREIGN KEY (session_id) REFERENCES public.anonymous_sessions(session_id) ON DELETE CASCADE;


--
-- Name: ai_messages fk_anonymous_sessions_to_ai_messages; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_messages
    ADD CONSTRAINT fk_anonymous_sessions_to_ai_messages FOREIGN KEY (session_id) REFERENCES public.anonymous_sessions(session_id) ON DELETE CASCADE;


--
-- Name: article_likes fk_anonymous_sessions_to_article_likes; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.article_likes
    ADD CONSTRAINT fk_anonymous_sessions_to_article_likes FOREIGN KEY (reader_session_id) REFERENCES public.anonymous_sessions(session_id) ON DELETE CASCADE;


--
-- Name: reinforcement_messages fk_anonymous_sessions_to_reinforcement_messages; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reinforcement_messages
    ADD CONSTRAINT fk_anonymous_sessions_to_reinforcement_messages FOREIGN KEY (author_session_id) REFERENCES public.anonymous_sessions(session_id) ON DELETE SET NULL;


--
-- Name: reinforcement_reactions fk_anonymous_sessions_to_reinforcement_reactions; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reinforcement_reactions
    ADD CONSTRAINT fk_anonymous_sessions_to_reinforcement_reactions FOREIGN KEY (reader_session_id) REFERENCES public.anonymous_sessions(session_id) ON DELETE CASCADE;


--
-- Name: self_assessment_options fk_cek_kondisi_questions_to_cek_kondisi_options; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.self_assessment_options
    ADD CONSTRAINT fk_cek_kondisi_questions_to_cek_kondisi_options FOREIGN KEY (question_id) REFERENCES public.self_assessment_questions(question_id) ON DELETE CASCADE;


--
-- Name: ai_message_sources fk_knowledge_chunks_to_ai_message_sources; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_message_sources
    ADD CONSTRAINT fk_knowledge_chunks_to_ai_message_sources FOREIGN KEY (chunk_id) REFERENCES public.knowledge_chunks(chunk_id) ON DELETE SET NULL;


--
-- Name: article_likes fk_knowledge_entries_to_article_likes; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.article_likes
    ADD CONSTRAINT fk_knowledge_entries_to_article_likes FOREIGN KEY (entry_id) REFERENCES public.knowledge_entries(entry_id) ON DELETE CASCADE;


--
-- Name: knowledge_chunks fk_knowledge_entries_to_knowledge_chunks; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_chunks
    ADD CONSTRAINT fk_knowledge_entries_to_knowledge_chunks FOREIGN KEY (entry_id) REFERENCES public.knowledge_entries(entry_id) ON DELETE CASCADE;


--
-- Name: knowledge_entries fk_knowledge_topics_to_knowledge_entries; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_entries
    ADD CONSTRAINT fk_knowledge_topics_to_knowledge_entries FOREIGN KEY (topic) REFERENCES public.knowledge_topics(topic_code) ON UPDATE CASCADE;


--
-- Name: cities fk_provinces_to_cities; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT fk_provinces_to_cities FOREIGN KEY (province_id) REFERENCES public.provinces(province_id) ON DELETE RESTRICT;


--
-- Name: reinforcement_reactions fk_reinforcement_messages_to_reinforcement_reactions; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reinforcement_reactions
    ADD CONSTRAINT fk_reinforcement_messages_to_reinforcement_reactions FOREIGN KEY (reinforcement_id) REFERENCES public.reinforcement_messages(reinforcement_id) ON DELETE CASCADE;


--
-- Name: service_providers service_providers_city_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_providers
    ADD CONSTRAINT service_providers_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.cities(city_id);


--
-- Name: service_providers service_providers_province_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_providers
    ADD CONSTRAINT service_providers_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.provinces(province_id);


--
-- Name: relaxation_tracks Publik bisa membaca track aktif; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Publik bisa membaca track aktif" ON public.relaxation_tracks FOR SELECT TO authenticated, anon USING ((is_active = true));


--
-- Name: ai_feedback; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ai_feedback ENABLE ROW LEVEL SECURITY;

--
-- Name: ai_message_sources; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ai_message_sources ENABLE ROW LEVEL SECURITY;

--
-- Name: ai_messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: anonymous_sessions anon can insert sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "anon can insert sessions" ON public.anonymous_sessions FOR INSERT TO anon WITH CHECK (((validated_category IS NULL) AND (validated_at IS NULL)));


--
-- Name: anonymous_sessions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.anonymous_sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: article_likes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.article_likes ENABLE ROW LEVEL SECURITY;

--
-- Name: cities baca kota aktif; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "baca kota aktif" ON public.cities FOR SELECT TO anon USING (((is_active = true) AND (deleted_at IS NULL)));


--
-- Name: service_providers baca layanan terverifikasi; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "baca layanan terverifikasi" ON public.service_providers FOR SELECT TO anon USING ((is_verified = true));


--
-- Name: self_assessment_options baca opsi aktif; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "baca opsi aktif" ON public.self_assessment_options FOR SELECT TO authenticated, anon USING (is_active);


--
-- Name: self_assessment_questions baca pertanyaan aktif; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "baca pertanyaan aktif" ON public.self_assessment_questions FOR SELECT TO authenticated, anon USING (is_active);


--
-- Name: provinces baca provinsi aktif; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "baca provinsi aktif" ON public.provinces FOR SELECT TO anon USING (((is_active = true) AND (deleted_at IS NULL)));


--
-- Name: cities; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

--
-- Name: knowledge_chunks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.knowledge_chunks ENABLE ROW LEVEL SECURITY;

--
-- Name: knowledge_entries; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.knowledge_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: knowledge_topics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.knowledge_topics ENABLE ROW LEVEL SECURITY;

--
-- Name: provinces; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.provinces ENABLE ROW LEVEL SECURITY;

--
-- Name: reinforcement_messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.reinforcement_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: reinforcement_reactions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.reinforcement_reactions ENABLE ROW LEVEL SECURITY;

--
-- Name: relaxation_tracks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.relaxation_tracks ENABLE ROW LEVEL SECURITY;

--
-- Name: self_assessment_options; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.self_assessment_options ENABLE ROW LEVEL SECURITY;

--
-- Name: self_assessment_questions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.self_assessment_questions ENABLE ROW LEVEL SECURITY;

--
-- Name: service_providers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

\unrestrict gTzG4CfWScaHIZmVEU6LX3jRix5fNOk3ZcNYPXlzaUiiCiRHfTZiJE5q8B9LbC7

