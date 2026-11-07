import { useParams } from "react-router-dom";
import ProductDetailsPage from "./ProductDetailsPage";

// New key per product, so opening a similar product starts with fresh state
function ProductDetailsRoute() {
	const { productId } = useParams();
	return <ProductDetailsPage key={productId} />;
}

export default ProductDetailsRoute;
