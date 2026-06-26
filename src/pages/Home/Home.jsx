import { useEffect, useState } from "react";
import Hero from "../../components/Hero/Hero";
import NewsSection from "../../components/NewsSection/NewsSection";
import RisingStars from "../../components/RisingStars/RisingStars";
import LeagueSection from "../../components/LeagueSection/LeagueSection";
import { fetchMatches, fetchStandings, fetchPosts } from "../../lib/api";
import { mockFeaturedArticle } from "../../data/mockNews";
import { mockPlayers } from "../../data/mockPlayers";
import heroBg from "../../data/images/hero.webp";
import stadiumBg from "../../data/images/stadium.webp";
import Footer from "../../components/Footer/Footer";
import { useSeason } from "../../hooks/useSeason";

export default function Home() {
  const { season, setSeason, seasons, ready } = useSeason();
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState({ groupA: [], groupB: [] });
  const [news, setNews] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [standingsLoading, setStandingsLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);

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

    fetchPosts('news')
      .then((data) => {
        if (cancelled) return;
        setNews(data.posts.slice(0, 4));
        setNewsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setNewsLoading(false);
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
        articles={newsLoading ? [] : news.map((post) => ({
          id: post.id,
          slug: post.slug,
          title: post.title,
          image: post.featured_image_url,
          date: post.published_at
            ? new Date(post.published_at).toLocaleDateString('en-NG', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            : '',
          category: post.category,
        }))}
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
