import { useEffect, useState, useRef } from "react";
import { fetchSeasons } from "../lib/api";

export function useSeason() {
  const [season, setSeason] = useState("");
  const [seasons, setSeasons] = useState([]);
  const [ready, setReady] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    fetchSeasons()
      .then((list) => {
        setSeasons(list);
        if (list.length) {
          setSeason(list[0]);
        }
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  return { season, setSeason, seasons, ready };
}
