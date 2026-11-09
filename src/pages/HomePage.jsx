import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Banner from '../components/home/Banner';
import AboutUs from '../components/home/AboutUs';
import HeroSection from '../components/home/HeroSection';
import SliderItem from '../components/common/SliderItem';
import { getHomePageContentAPI } from '../api/homeApi';

function HomePage() {
  const navigate = useNavigate();
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
      <SliderItem title="Deal Of The Day" list={homePageContent?.collections?.find(item => item.slug === 'deal-of-the-day')?.products} loading={loading} handleViewAll={() => navigate("/deal-of-the-day")} />
      <Banner imgUrl={homePageContent?.banners?.["mid-1"]?.imageUrl} path={homePageContent?.banners?.["mid-1"]?.linkUrl} loading={loading} />
      <SliderItem title="Trending Now" list={homePageContent?.collections?.find(item => item.slug === 'trending')?.products} loading={loading} handleViewAll={() => navigate("/trending")} />
      <Banner imgUrl={homePageContent?.banners?.["mid-2"]?.imageUrl} path={homePageContent?.banners?.["mid-2"]?.linkUrl} loading={loading} />
      <SliderItem title="Best Sellers" list={homePageContent?.collections?.find(item => item.slug === "best-sellers")?.products} loading={loading} handleViewAll={() => navigate("/best-sellers")} />
      <AboutUs leftContent={homePageContent?.banners?.["mid-3"]?.left} rightContent={homePageContent?.banners?.["mid-3"]?.right} loading={loading} />
      <SliderItem title="Luggage & Suitcases" list={homePageContent?.collections?.find(item => item.slug === "luggage")?.products} loading={loading} handleViewAll={() => navigate("/categories/luggage")} />
      <Banner imgUrl={homePageContent?.banners?.["mid-4"]?.imageUrl} path={homePageContent?.banners?.["mid-4"]?.linkUrl} loading={loading} />
      <SliderItem title="Accessories" list={homePageContent?.collections?.find(item => item.slug === "accessories")?.products} loading={loading} handleViewAll={() => navigate("/categories/accessories")} />
    </div>
  )
}

export default HomePage;
