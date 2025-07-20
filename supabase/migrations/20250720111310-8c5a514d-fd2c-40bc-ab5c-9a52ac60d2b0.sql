-- Limpar todos os dados das tabelas (mantendo a estrutura)

-- Deletar dados das tabelas na ordem correta devido às foreign keys
DELETE FROM public.documents;
DELETE FROM public.interviews;
DELETE FROM public.position_candidates;
DELETE FROM public.candidates;
DELETE FROM public.positions;

-- Limpar objetos do storage bucket
DELETE FROM storage.objects WHERE bucket_id = 'recruitment-documents';

-- Reset das sequences (para que os IDs voltem a começar do início se necessário)
-- Como estamos usando UUID, não há sequences para resetar

-- Log da limpeza
INSERT INTO supabase_migrations.schema_migrations (version, name, statements, created_by)
VALUES (
  to_char(current_timestamp, 'YYYYMMDDHHMISS'),
  'Clear all recruitment data',
  ARRAY['DELETE FROM documents, interviews, position_candidates, candidates, positions and storage objects'],
  'system_cleanup'
);