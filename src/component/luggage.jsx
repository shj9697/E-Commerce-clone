import { useNavigate } from "react-router-dom";
import SliderItem from "./sliderItem";

function Luggage({ list = [], loading = false }) {
  const navigate = useNavigate();

  function handleViewProduct() {
    navigate("/categories/luggage");
  }

  return (
    <SliderItem
      title={"Luggage & Suitcases"}
      list={list}
      loading={loading}
      handleViewAll={handleViewProduct}
    />
  );
}

export default Luggage;
