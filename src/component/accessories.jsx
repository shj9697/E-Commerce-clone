import { useNavigate } from "react-router-dom";
import SliderItem from "./sliderItem";



const Accessories = ({ list = [], loading = false }) => {
    const navigate = useNavigate();

    function handleViewProduct() {
        navigate("/categories/accessories");
    }

    return (
        <SliderItem
            title={"Accessories"}
            list={list}
            loading={loading}
            handleViewAll={handleViewProduct}
        />
    );
}

export default Accessories;
