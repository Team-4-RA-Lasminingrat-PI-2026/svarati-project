-- Hak akses minimum untuk role anon dan authenticated.
-- Jalankan SETELAH schema.sql dan seed.sql.

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;

GRANT SELECT ON public.provinces, public.cities, public.service_providers,
                public.relaxation_tracks, public.self_assessment_questions,
                public.self_assessment_options TO anon;
GRANT INSERT ON public.anonymous_sessions TO anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  REVOKE ALL ON TABLES FROM anon, authenticated;
