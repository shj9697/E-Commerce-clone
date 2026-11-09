import { useParams, useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import { useEffect, useState } from "react";
import Breadcrumb from "../components/common/Breadcrumb";
import { getProductCategoriesBySlugAPI } from "../api/productCategoriesApi";
import SliderItem from "../components/common/SliderItem";

function CategoryPage() {
	const navigate = useNavigate();
	const { slug } = useParams();
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let cancelled = false;
		async function load() {
			try {
				setLoading(true);
				setError(null);
				const data = await getProductCategoriesBySlugAPI(slug);
				if (!cancelled) setData(data.categories);
			} catch (err) {
				if (!cancelled) setError(err.message);
			} finally {
				if (!cancelled) setLoading(false);
			}
		}
		load();
		return () => { cancelled = true; };
	}, [slug]);

	if (loading) {
		return (
			<div className="px-8 pb-8 animate-pulse">
				<div className="flex flex-col">
					<div className="h-6 w-56 my-3 bg-gray-200 rounded"></div>
					<span className="w-25 h-1 bg-[#fb641b]"></span>
				</div>

				<div className="w-full gap-5 py-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
					{Array.from({ length: 10 }).map((_, index) => (
						<div key={index} className="bg-white rounded-md p-4">
							<div className="h-4 w-2/3 bg-gray-200 rounded"></div>
							<div className="w-full aspect-square mt-3 bg-gray-200 rounded"></div>
						</div>
					))}
				</div>
			</div>
		)
	}

	if (error) {
		return <p>Error : {error}</p>
	};

	function handleViewProductList(s) {
		navigate(`/categories/${(slug)}/${(s)}`)
	}

	return (
		<div className="w-full">
			<Breadcrumb
				paths={[{ title: data?.name || "" }]}
			/>
			<div className="px-8 pb-8">
				<div className="flex flex-col">
					<h1 className="text-xl my-3 font-normal">
						Select by {data?.name || ""} Category
					</h1>
					<span className="w-25 h-1 bg-[#fb641b]"></span>
				</div>

				<div className="w-full gap-5 py-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
					{(data?.children || []).map((item) => {
						return (
							<div key={item.id}
								className="hover:-translate-y-2 transition-transform duration-400 ease-out cursor-pointer bg-white rounded-md p-4"
								onClick={() => handleViewProductList(item.slug)}
							>
								<h1 className="text-l font-normal text-gray-600">{item.name}</h1>
								<img src={item.imageUrl}
									alt=""
									className="w-full object-contain" />
							</div>
						)
					})}
				</div>
				<div className="w-full">
					<SliderItem
						title={"Latest Products in " + (data?.name || "")}
						list={data?.latestProducts || []}
					/>
				</div>
			</div>
		</div>
	);
}

export default CategoryPage;
