import { useParams } from "react-router-dom";
import ProductListPage from "./ProductListPage";

// New key per URL, so ProductListPage remounts and reads the new params
function ProductListRoute() {
	const { categorySlug, subCategorySlug } = useParams();
	return <ProductListPage key={`${categorySlug}/${subCategorySlug}`} />;
}

export default ProductListRoute;
