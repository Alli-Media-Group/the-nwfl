import Hero from "../../components/Hero/Hero";
import NewsSection from "../../components/NewsSection/NewsSection";
import RisingStars from "../../components/RisingStars/RisingStars";
import LeagueSection from "../../components/LeagueSection/LeagueSection";
import { mockMatches } from "../../data/mockMatches";
import { mockFeaturedArticle, mockArticles } from "../../data/mockNews";
import { mockPlayers } from "../../data/mockPlayers";
import heroBg from "../../data/images/hero.webp";
import stadiumBg from "../../data/images/stadium.webp";
import Footer from "../../components/Footer/Footer";

export default function Home() {
  return (
    <>
      <Hero
        bgImage={heroBg}
        titleHtml="We are recruiting"
        subtitle="Join our large network of contributors"
        matches={mockMatches}
      />

      <NewsSection
        bgImage={stadiumBg}
        featured={mockFeaturedArticle}
        articles={mockArticles}
      />

      <RisingStars players={mockPlayers} />

      <LeagueSection matches={mockMatches} />

      <Footer />
    </>
  );
}
