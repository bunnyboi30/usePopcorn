import { useState, useEffect } from "react";

const KEY = process.env.REACT_APP_API_KEY;

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      callback?.();
      const controller = new AbortController();

      async function fetchData() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal },
          );

          if (!res.ok)
            throw new Error("Something went wrong while fetching movies data");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not Found 😢");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      //handleCloseSelectedMovie();
      fetchData();

      return function () {
        controller.abort();
      };
    },
    [query],
  );

  return { movies, isLoading, error };
}
