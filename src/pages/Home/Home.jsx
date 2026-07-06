import { useEffect, useState } from "react";
import Hero from "../../components/Hero/Hero";
import NewsSection from "../../components/NewsSection/NewsSection";
import RisingStars from "../../components/RisingStars/RisingStars";
import LeagueSection from "../../components/LeagueSection/LeagueSection";
import {
  fetchMatches,
  fetchStandings,
  fetchPosts,
  fetchPlayerTopScorers,
} from "../../lib/api";
import heroBg from "../../data/images/hero.webp";
import stadiumBg from "../../data/images/stadium.webp";
import Footer from "../../components/Footer/Footer";
import { useSeason } from "../../hooks/useSeason";

function formatPostDate(isoDate) {
  if (!isoDate) return "";
  return new Date(isoDate).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function mapNewsArticle(post) {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    image: post.featured_image_url,
    date: formatPostDate(post.published_at),
    category: post.category,
  };
}

function mapTopScorer(player) {
  return {
    id: player.id,
    name: player.name,
    team: player.team_name,
    position: `${player.goals} goals`,
    image: null,
  };
}

export default function Home() {
  const { season, setSeason, seasons, ready } = useSeason();
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState({ groupA: [], groupB: [] });
  const [news, setNews] = useState([]);
  const [players, setPlayers] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [standingsLoading, setStandingsLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);
  const [playersLoading, setPlayersLoading] = useState(true);

  useEffect(() => {
    if (!ready || !season) return;
    let cancelled = false;

    fetchMatches(season)
      .then((data) => {
        if (cancelled) return;
        setMatches(data);
      })
      .finally(() => {
        if (!cancelled) setMatchesLoading(false);
      });

    fetchStandings(season)
      .then((data) => {
        if (cancelled) return;
        setStandings(data);
      })
      .finally(() => {
        if (!cancelled) setStandingsLoading(false);
      });

    fetchPosts("news")
      .then((data) => {
        if (cancelled) return;
        setNews(data.posts.slice(0, 4));
      })
      .finally(() => {
        if (!cancelled) setNewsLoading(false);
      });

    fetchPlayerTopScorers(season, 8)
      .then((data) => {
        if (cancelled) return;
        setPlayers((data ?? []).map(mapTopScorer));
      })
      .finally(() => {
        if (!cancelled) setPlayersLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [season, ready]);

  const articleList = news.map(mapNewsArticle);

  return (
    <>
      <Hero
        bgImage={heroBg}
        ctaText="Explore Teams"
        ctaTo="/teams"
        matches={matches}
        matchesLoading={matchesLoading}
      />

      <NewsSection
        bgImage={stadiumBg}
        articles={articleList}
        loading={newsLoading}
      />

      <RisingStars
        players={playersLoading ? [] : players}
        ctaText="View Players"
        ctaTo="/players"
      />

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
