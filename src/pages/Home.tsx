import { useEffect } from "react";
import { initRealtime } from "@lib/sync";
import { supabase } from "@lib/supabase";

function Home() {
  useEffect(() => {
    const setup = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.id) {
        initRealtime(data.user.id);
      }
    };
    setup();
  }, []);

  return <div>Welcome Home</div>;
}

export default Home;
