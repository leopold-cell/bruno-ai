
-- set_updated_at doesn't need SECURITY DEFINER (trigger context)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- handle_new_user must stay SECURITY DEFINER (writes to public from auth trigger) — revoke from API roles
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- match_memories: always scope to auth.uid(), revoke from anon
DROP FUNCTION IF EXISTS public.match_memories(UUID, vector, INT);
CREATE OR REPLACE FUNCTION public.match_memories(
  p_query vector(768), p_limit INT DEFAULT 5
) RETURNS TABLE(id UUID, kind TEXT, content TEXT, similarity FLOAT)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT m.id, m.kind, m.content, 1 - (m.embedding <=> p_query) AS similarity
  FROM public.memories m
  WHERE m.user_id = auth.uid() AND m.embedding IS NOT NULL
  ORDER BY m.embedding <=> p_query
  LIMIT p_limit;
$$;
REVOKE EXECUTE ON FUNCTION public.match_memories(vector, INT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.match_memories(vector, INT) TO authenticated, service_role;
