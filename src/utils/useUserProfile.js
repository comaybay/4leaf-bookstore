import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default () => {
  const user = supabase.auth.user();
  const [reload, setReload] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  useEffect(() => {
    const user = supabase.auth.user();
    (async () => {
    if (!user) {
      setProfile(null);
    }
    else {
      setIsProfileLoading(true);
      const { data: profile } = await supabase.from("profile").select("*").eq("id", user.id).single();
      setProfile(profile);
      setIsProfileLoading(false); 
      }
    })(); 
  }, [reload]);


  return {
    isProfileLoading,
    user,
    profile,
    reloadUser() {
      setIsProfileLoading(true);
      setReload(r => !r);
    }
  }
}