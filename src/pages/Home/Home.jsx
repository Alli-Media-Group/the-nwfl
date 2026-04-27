import Hero from "../../components/Hero/Hero";
import NewsSection from "../../components/NewsSection/NewsSection";
import RisingStars from "../../components/RisingStars/RisingStars";
import GrowingNetwork from "../../components/GrowingNetwork/GrowingNetwork";
import { mockMatches } from "../../data/mockMatches";
import { mockFeaturedArticle, mockArticles } from "../../data/mockNews";
import { mockPlayers } from "../../data/mockPlayers";
import { networkCards } from "../../data/mockNetwork";
import heroBg from "../../data/images/hero.png";
import stadiumBg from "../../data/images/stadium.png";
import peopleBg from "../../data/images/people.jpg";
import Newsletter from "../../components/NewsLetter/Newsletter";
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

      <GrowingNetwork bgImage={peopleBg} cards={networkCards} />

      <Newsletter />

      <Footer />
    </>
  );
}
