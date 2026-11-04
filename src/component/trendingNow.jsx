import { useNavigate } from "react-router-dom";
import SliderItem from "./sliderItem";


function TrendingNow({ list = [], loading = false }) {
  const navigate = useNavigate();

  function handleViewProduct() {
    navigate("/trending");
  }
  return (
    <SliderItem
      title={"Trending Now"}
      list={list}
      loading={loading}
      handleViewAll={handleViewProduct}
    />
  );
}

export default TrendingNow;
