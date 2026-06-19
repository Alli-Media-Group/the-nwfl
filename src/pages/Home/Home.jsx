import { useEffect, useState } from "react";
import Hero from "../../components/Hero/Hero";
import NewsSection from "../../components/NewsSection/NewsSection";
import RisingStars from "../../components/RisingStars/RisingStars";
import LeagueSection from "../../components/LeagueSection/LeagueSection";
import { fetchMatches, fetchStandings } from "../../lib/api";
import { mockFeaturedArticle, mockArticles } from "../../data/mockNews";
import { mockPlayers } from "../../data/mockPlayers";
import heroBg from "../../data/images/hero.webp";
import stadiumBg from "../../data/images/stadium.webp";
import Footer from "../../components/Footer/Footer";
import { useSeason } from "../../hooks/useSeason";

export default function Home() {
  const { season, setSeason, seasons, ready } = useSeason();
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState({ groupA: [], groupB: [] });
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [standingsLoading, setStandingsLoading] = useState(true);

  useEffect(() => {
    if (!ready || !season) return;
    let cancelled = false;
    fetchMatches(season)
      .then((data) => {
        if (cancelled) return;
        setMatches(data);
        setMatchesLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setMatchesLoading(false);
      });
    fetchStandings(season)
      .then((data) => {
        if (cancelled) return;
        setStandings(data);
        setStandingsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setStandingsLoading(false);
      });
    return () => { cancelled = true; };
  }, [season, ready]);

  return (
    <>
      <Hero
        bgImage={heroBg}
        titleHtml="We are recruiting"
        subtitle="Join our large network of contributors"
        matches={matches}
        matchesLoading={matchesLoading}
      />

      <NewsSection
        bgImage={stadiumBg}
        featured={mockFeaturedArticle}
        articles={mockArticles}
      />

      <RisingStars players={mockPlayers} />

      <LeagueSection
        matches={matches}
        matchesLoading={matchesLoading}
        standings={standings}
        standingsLoading={standingsLoading}
        season={season}
        seasons={seasons}
        onSeasonChange={setSeason}
      />

      <Footer />
    </>
  );
}
