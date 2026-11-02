import { useParams } from "react-router-dom";
import SubCategories from "./SubCategories";

// New key per URL, so SubCategories remounts and reads the new params
function SubCategoriesRoute() {
	const { categorySlug, subCategorySlug } = useParams();
	return <SubCategories key={`${categorySlug}/${subCategorySlug}`} />;
}

export default SubCategoriesRoute;
