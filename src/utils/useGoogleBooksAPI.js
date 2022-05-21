import { SupabaseClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import {supabase} from "./supabaseClient"

export default (initialIsbn) => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isbn, setIsbn] = useState(initialIsbn);

  useEffect(() => {
    (async () => {
      if (!isbn) {
        return;
      }

      setIsLoading(true);
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      const result = await response.json()
      setResult(result);
      setIsLoading(false);
    })();
  }, [isbn])

  return [
    {
      isLoading,
      result
    },
    setIsbn
  ]
}