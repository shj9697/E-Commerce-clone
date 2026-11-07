import { useParams } from "react-router-dom";
import Breadcrumb from "../components/common/Breadcrumb";
import { useEffect, useState } from "react";
import ProductCard from "../components/common/ProductCard";
import Filter from "../components/common/Filter";
import { getProductsAPI, getProductCategoriesBySlugAPI, getProductCategoriesBySubSlugAPI } from "../api/productCategoriesApi";
import { ArrowUpDown, SlidersHorizontal } from "lucide-react";

function SubCategories() {
	const { categorySlug, subCategorySlug } = useParams();
	const [sortBy, setSortBy] = useState("relevance");
	const [category, setCategory] = useState(categorySlug);
	const [subCategory, setSubCategory] = useState(subCategorySlug);
	const [currentPage, setCurrentPage] = useState(1);
	const [stock, setStock] = useState(true);
	const [embossable, setEmbossable] = useState(false);
	const [priceRange, setPriceRange] = useState([0, 10000]);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [isSortOpen, setIsSortOpen] = useState(false);
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let cancelled = false;
		async function load() {
			try {
				setLoading(true);
				setError(null);
				const params = {
					page: currentPage,
					limit: 8,
					category: category,
					subCategory: subCategory,
					sort: sortBy,
					embossable: embossable,
					inStock: stock,
					minPrice: priceRange[0],
					// The slider's top (10000) means "no upper limit", so pricier products still show
					maxPrice: priceRange[1] < 10000 ? priceRange[1] : undefined
				};
				const productListData = await getProductsAPI(params);
				const categoryData = await getProductCategoriesBySlugAPI(category);
				const subCategorydata = await getProductCategoriesBySubSlugAPI(category, subCategory);
				if (!cancelled) {
					setData({
						productListData: productListData || null,
						categoryData: categoryData.categories || [],
						subCategoryData: subCategorydata.categories || []
					});
				}
			} catch (err) {
				if (!cancelled) setError(err.message);
			} finally {
				if (!cancelled) setLoading(false);
			}
		}
		load();
		return () => { cancelled = true; };
	}, [category, subCategory, currentPage, sortBy, embossable, stock, priceRange]);

	if (loading && !data.productListData) {
		return (
			<div className="w-full bg-white px-4 pb-16 md:px-8 md:pb-0 animate-pulse">
				<Breadcrumb loading />
				<div className="bg-white py-5 w-full flex flex-col gap-6 md:flex-row md:gap-10">
					<div className="hidden md:flex w-full shrink-0 md:w-50 lg:w-70 flex-col gap-2">
						<div className="h-8 w-full bg-gray-200 rounded"></div>
						<div className="h-28 w-full bg-gray-200 rounded-md"></div>
						<div className="h-48 w-full bg-gray-200 rounded-md"></div>
						<div className="h-24 w-full bg-gray-200 rounded-md"></div>
					</div>
					<div className="flex-1 min-w-0 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
						{Array.from({ length: 8 }).map((placeholder, index) => (
							<div key={index} className="p-2 h-80">
								<div className="h-45 w-full bg-gray-200 rounded-md"></div>
								<div className="h-4 w-full mt-3 bg-gray-200 rounded"></div>
								<div className="h-4 w-1/2 mt-2 bg-gray-200 rounded"></div>
								<div className="h-4 w-1/3 mt-2 bg-gray-200 rounded"></div>
							</div>
						))}
					</div>
				</div>
			</div>
		)
	}

	if (error) {
		return <p>Error : {error}</p>
	};

	// Every filter change starts again from page 1
	const handleSortBy = (value) => { setSortBy(value); setCurrentPage(1); };
	const handleCategoryBy = (value) => { setCategory(value); setSubCategory(""); setCurrentPage(1); };
	const handleSubCategoryBy = (value) => { setSubCategory(value); setCurrentPage(1); };
	const handleIsEmbossableBy = (value) => { setEmbossable(value); setCurrentPage(1); };
	const handleStock = (value) => { setStock(value); setCurrentPage(1); };
	const handlePriceRange = (value) => { setPriceRange(value); setCurrentPage(1); };

	// Back to the category and subcategory in the URL
	const handleReset = () => {
		setSortBy("relevance");
		setCategory(categorySlug);
		setSubCategory(subCategorySlug);
		setEmbossable(false);
		setStock(true);
		setPriceRange([0, 10000]);
		setCurrentPage(1);
	};

	const handleNextPage = () => {
		setCurrentPage(prev => prev + 1);
	}

	const handlePrevPage = () => {
		setCurrentPage(prev => prev - 1);
	}

	return (
		<div className="w-full bg-white px-4 pb-16 md:px-8 md:pb-0">
			<Breadcrumb
				paths={[
					{ title: data.categoryData?.name, link: `/categories/${categorySlug}` },
					{
						title: data.subCategoryData?.name,
						link: `/categories/${categorySlug}/${subCategorySlug}`,
					},
				]}
			/>
			<div className="bg-white py-5 w-full flex flex-col gap-6 md:flex-row md:gap-10">
				<Filter
					isOpen={isFilterOpen}
					onClose={() => setIsFilterOpen(false)}
					handleSortBy={handleSortBy}
					handleCategoryBy={handleCategoryBy}
					handleSubCategoryBy={handleSubCategoryBy}
					handleReset={handleReset}
					sortBy={sortBy}
					category={category}
					subCategory={subCategory}
					embossable={embossable}
					handleIsEmbossableBy={handleIsEmbossableBy}
					stock={stock}
					handleStock={handleStock}
					priceRange={priceRange}
					handlePriceRange={handlePriceRange}
				/>
				<div className="flex flex-col flex-1 min-w-0 pb-4 gap-6">
					<div className="w-full grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
						{loading
							? Array.from({ length: 8 }).map((placeholder, index) => (
								<div key={index} className="p-2 h-80 animate-pulse">
									<div className="h-45 w-full bg-gray-200 rounded-md"></div>
									<div className="h-4 w-full mt-3 bg-gray-200 rounded"></div>
									<div className="h-4 w-1/2 mt-2 bg-gray-200 rounded"></div>
									<div className="h-4 w-1/3 mt-2 bg-gray-200 rounded"></div>
								</div>
							))
							: (data?.productListData?.products || []).map(item => (
								<ProductCard item={item} key={item.id} />
							))}
					</div>

					<div className="flex justify-center items-center px-2 gap-2">
						<button disabled={currentPage <= 1} className="bg-[#fb641b] text-white px-6 py-2 cursor-pointer disabled:bg-white" onClick={handlePrevPage}> Prev</button>
						<h1>Page {currentPage} of {data?.productListData?.totalPages || 1}</h1>
						<button disabled={currentPage >= data?.productListData?.totalPages} className="bg-[#fb641b] text-white px-6 py-2 cursor-pointer disabled:bg-white" onClick={handleNextPage}>Next</button>
					</div>
				</div>
			</div>
			<div className="md:hidden fixed bottom-0 inset-x-0 z-40 flex bg-white border-t border-gray-200">
				<button onClick={() => setIsSortOpen(true)} className="flex-1 flex items-center justify-center gap-2 py-3 border-r border-gray-200 cursor-pointer">
					<ArrowUpDown size={18} /> SORT
				</button>
				<button onClick={() => setIsFilterOpen(true)} className="flex-1 flex items-center justify-center gap-2 py-3 cursor-pointer">
					<SlidersHorizontal size={18} /> FILTER
				</button>
			</div>
			{isSortOpen && (
				<div onClick={() => setIsSortOpen(false)} className="md:hidden fixed inset-0 z-50 flex items-end bg-black/40">
					<div onClick={(event) => event.stopPropagation()} className="w-full bg-white rounded-t-xl p-4">
						<p className="text-xs text-gray-500 pb-3 border-b border-gray-200">SORT BY</p>
						{[
							{ value: "relevance", label: "Relevance" },
							{ value: "price-low-to-high", label: "Price: Low to High" },
							{ value: "price-high-to-low", label: "Price: High to Low" },
						].map(option => (
							<button
								key={option.value}
								onClick={() => { handleSortBy(option.value); setIsSortOpen(false); }}
								className={`block w-full text-left py-3 cursor-pointer ${sortBy === option.value ? "text-[#fb641b] font-semibold" : "text-gray-700"}`}
							>
								{option.label}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

export default SubCategories;
