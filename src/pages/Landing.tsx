import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function Landing() {
  console.log("hi");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      console.log(data);
      if (data.session) {
        navigate("/home"); // Already signed in
      } else {
        navigate("/register");
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) return <div className="text-red-600">Loading...</div>;
  return <div className="text-red-500">Redirecting...</div>;
}

export default Landing;
