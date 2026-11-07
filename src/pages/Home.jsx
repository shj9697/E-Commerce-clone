import Banner from '../components/home/Banner';
import Banner2 from '../components/home/Banner2';
import AboutUs from '../components/home/AboutUs';
import HeroSection from '../components/home/HeroSection';
import { useEffect, useState } from 'react';
import { getHomePageContentAPI } from '../api/home';
import DealOfTheDayCards from '../components/home/DealOfTheDayCards';
import TrendingNow from '../components/home/TrendingNow';
import BestSellers from '../components/home/BestSellers';
import Luggage from '../components/home/Luggage';
import Accessories from '../components/home/Accessories';

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

  if (error) {
    return <p>Error : {error}</p>
  };

  return (
    <div className="w-full flex flex-col gap-2 px-3">
      <HeroSection banner={homePageContent?.banners?.hero} loading={loading} />
      <DealOfTheDayCards list={homePageContent?.collections?.find(item => item.slug === 'deal-of-the-day')?.products} loading={loading} />
      <Banner imgUrl={homePageContent?.banners?.["mid-1"]?.imageUrl} path={homePageContent?.banners?.["mid-1"]?.linkUrl} loading={loading} />
      <TrendingNow list={homePageContent?.collections?.find(item => item.slug === 'trending')?.products} loading={loading} />
      <Banner2 imgUrl={homePageContent?.banners?.["mid-2"]?.imageUrl} path={homePageContent?.banners?.["mid-2"]?.linkUrl} loading={loading} />
      <BestSellers list={homePageContent?.collections?.find(item => item.slug === "best-sellers")?.products} loading={loading} />
      <AboutUs leftContent={homePageContent?.banners?.["mid-3"]?.left} rightContent={homePageContent?.banners?.["mid-3"]?.right} loading={loading} />
      <Luggage list={homePageContent?.collections?.find(item => item.slug === "luggage")?.products} loading={loading} />
      <Banner2 imgUrl={homePageContent?.banners?.["mid-4"]?.imageUrl} path={homePageContent?.banners?.["mid-4"]?.linkUrl} loading={loading} />
      <Accessories list={homePageContent?.collections?.find(item => item.slug === "accessories")?.products} loading={loading} />
    </div>
  )
}

export default Home;