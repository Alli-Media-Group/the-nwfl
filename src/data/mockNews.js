import featured from './images/news/_Z623987.jpg';
import article1 from './images/news/_Z623834.jpg';
import article2 from './images/news/_Z624022.jpg';
import article3 from './images/news/_Z624064.jpg';

export const mockFeaturedArticle = {
  id: 1,
  image: featured,
  photoCredit: "women's football",
  date: '2022-09-19',
  category: 'Football',
  title: 'Get the latest sports news updates, on the local and international sphere. Only on NWFL',
  slug: 'latest-sports-news',
};

export const mockArticles = [
  {
    id: 2,
    image: article1,
    date: '03-12-2022',
    category: 'Football',
    title: 'Naija Ratels FC players push hard in training ahead of crucial Premiership clash',
    slug: 'naija-ratels-training',
  },
  {
    id: 3,
    image: article2,
    date: '14-11-2022',
    category: 'Football',
    title: 'Rivers Angels midfielder delivers stunning strike in MD 15 fixture at home ground',
    slug: 'rivers-angels-md15-strike',
  },
  {
    id: 4,
    image: article3,
    date: '13-12-2022',
    category: 'Football',
    title: 'Edo Queens FC forward nets late winner to secure crucial three points in Premiership',
    slug: 'edo-queens-late-winner',
  },
];
