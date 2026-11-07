import { useNavigate } from "react-router-dom";
import SliderItem from "../common/SliderItem";

function DealOfTheDayCards({ list = [], loading = false }) {
  const navigate = useNavigate();

  function handleViewProduct() {
    navigate("/deal-of-the-day")
  }

  return (
    <SliderItem
      title={"Deal Of The Day"}
      list={list}
      loading={loading}
      handleViewAll={handleViewProduct}
    />
  );
}

export default DealOfTheDayCards;