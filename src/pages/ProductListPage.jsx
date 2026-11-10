import { useParams } from "react-router-dom";
import Breadcrumb from "../components/common/Breadcrumb";
import { useEffect, useState } from "react";
import ProductCard from "../components/common/ProductCard";
import Filter from "../components/common/Filter";
import { getProductsAPI, getProductCategoriesBySlugAPI, getProductCategoriesBySubSlugAPI } from "../api/productCategoriesApi";
import { ArrowUpDown, SlidersHorizontal } from "lucide-react";

function ProductListPage() {
	const { categorySlug, subCategorySlug } = useParams();
	// Reset goes back to the category and subcategory in the URL
	const defaultFilters = { page: 1, sortBy: "relevance", category: categorySlug, subCategory: subCategorySlug, embossable: false, stock: true, priceRange: [0, 10000] };
	const [filters, setFilters] = useState(defaultFilters);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [isSortOpen, setIsSortOpen] = useState(false);
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Every filter change starts again from page 1
	const updateFilter = (changes) => setFilters({ ...filters, ...changes, page: 1 });

	useEffect(() => {
		let cancelled = false;
		async function load() {
			try {
				setLoading(true);
				setError(null);
				const productListData = await getProductsAPI({
					page: filters.page,
					limit: 8,
					category: filters.category,
					subCategory: filters.subCategory,
					sort: filters.sortBy,
					embossable: filters.embossable,
					inStock: filters.stock,
					minPrice: filters.priceRange[0],
					// The slider's top (10000) means "no upper limit", so pricier products still show
					maxPrice: filters.priceRange[1] < 10000 ? filters.priceRange[1] : undefined
				});
				const categoryData = await getProductCategoriesBySlugAPI(filters.category);
				const subCategorydata = await getProductCategoriesBySubSlugAPI(filters.category, filters.subCategory);
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
	}, [filters]);

	if (error) {
		return <p>Error : {error}</p>
	};

	const filler = [
		{ value: "relevance", label: "Relevance" },
		{ value: "price-low-to-high", label: "Price: Low to High" },
		{ value: "price-high-to-low", label: "Price: High to Low" },
	]

	return (
		<div className="w-full bg-white px-4 pb-16 md:px-8 md:pb-0">
			<Breadcrumb
				loading={!data.productListData}
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
					filters={filters}
					updateFilter={updateFilter}
					handleReset={() => setFilters(defaultFilters)}
				/>
				<div className="flex flex-col flex-1 min-w-0 pb-4 gap-6">
					<div className="w-full grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
						{loading ?
							Array.from({ length: 8 }).map((placeholder, index) => <ProductCard key={index} loading />)
							:
							(data?.productListData?.products || []).map(item => <ProductCard item={item} key={item.id} />)}
					</div>

					<div className="flex justify-center items-center px-2 gap-2">
						<button disabled={filters.page <= 1} className="bg-[#fb641b] text-white px-6 py-2 cursor-pointer disabled:bg-white" onClick={() => setFilters({ ...filters, page: filters.page - 1 })}> Prev</button>
						<h1>Page {filters.page} of {data?.productListData?.totalPages || 1}</h1>
						<button disabled={filters.page >= data?.productListData?.totalPages} className="bg-[#fb641b] text-white px-6 py-2 cursor-pointer disabled:bg-white" onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>Next</button>
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
						{filler.map(option => (
							<button
								key={option.value}
								onClick={() => { updateFilter({ sortBy: option.value }); setIsSortOpen(false); }}
								className={`block w-full text-left py-3 cursor-pointer ${filters.sortBy === option.value ? "text-[#fb641b] font-semibold" : "text-gray-700"}`}
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

export default ProductListPage;
