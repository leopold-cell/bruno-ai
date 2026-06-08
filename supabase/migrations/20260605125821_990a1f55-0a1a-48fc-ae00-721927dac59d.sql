DROP POLICY IF EXISTS "Anyone can join the waitlist" ON public.waitlist_signups;
REVOKE INSERT ON public.waitlist_signups FROM anon, authenticated;