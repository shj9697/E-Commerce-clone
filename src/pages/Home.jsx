import Banner from '../component/Banner';
import Banner2 from '../component/Banner2';
import AboutUs from '../component/AboutUs';
import HeroSection from '../component/HeroSection';
import { useEffect, useState } from 'react';
import { getHomePageContentAPI } from '../api/home';
import DealOfTheDayCards from '../component/DealOfTheDayCards';
import TrendingNow from '../component/trendingNow';
import BestSellers from '../component/bestSellers';
import Luggage from '../component/luggage';
import Accessories from '../component/accessories';

function Home() {
  const [homePageContent, setHomePageContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false; //cancelled is a note that says "I'm gone, don't update me," so old data doesn't show up on a page that isn't there anymore.
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getHomePageContentAPI();
        if (!cancelled) setHomePageContent(data.data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return <p>Loading......</p>
  }
  if (error) {
    return <p>Error : {error}</p>
  };

  return (
    <div className="w-full flex flex-col gap-2 px-3">
      <HeroSection banner={homePageContent?.banners?.hero} />
      <DealOfTheDayCards list={homePageContent?.collections?.find(item => item.slug === 'deal-of-the-day')?.products} />
      <Banner imgUrl={homePageContent?.banners?.["mid-1"]?.imageUrl} path={homePageContent?.banners?.["mid-1"]?.linkUrl} />
      <TrendingNow list={homePageContent?.collections?.find(item => item.slug === 'trending')?.products} />
      <Banner2 imgUrl={homePageContent?.banners?.["mid-2"]?.imageUrl} path={homePageContent?.banners?.["mid-2"]?.linkUrl} />
      <BestSellers list={homePageContent?.collections?.find(item => item.slug === "best-sellers")?.products} />
      <AboutUs leftContent={homePageContent?.banners?.["mid-3"]?.left} rightContent={homePageContent?.banners?.["mid-3"]?.right} />
      <Luggage list={homePageContent?.collections?.find(item => item.slug === "luggage")?.products} />
      <Banner2 imgUrl={homePageContent?.banners?.["mid-4"]?.imageUrl} path={homePageContent?.banners?.["mid-4"]?.linkUrl} />
      <Accessories list={homePageContent?.collections?.find(item => item.slug === "accessories")?.products} />
    </div>
  )
}

export default Home;