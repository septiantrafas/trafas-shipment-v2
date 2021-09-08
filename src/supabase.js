import { createClient } from "@supabase/supabase-js";

const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMDIzMzcyMiwiZXhwIjoxOTQ1ODA5NzIyfQ.60kjWQdmGM2M954D7gAE29iBbXKRg0kDf_412MfibHA";

const SUPABASE_URL = "https://hwhpfyumwrvkihszusrg.supabase.co";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export { supabase };
