import { Link, useLocation } from "react-router-dom";
import Dropdown from "./Dropdown";
import { useEffect, useState } from "react";
import { getProductCategoriesAPI } from "../../api/productCategoriesApi";

function CategoryDropdown() {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const location = useLocation();

	useEffect(() => {
		let cancelled = false;
		async function load() {
			try {
				setLoading(true);
				setError(null);
				const data = await getProductCategoriesAPI();
				if (!cancelled) setCategories(data.categories);
			} catch (err) {
				if (!cancelled) setError(err.message);
			} finally {
				if (!cancelled) setLoading(false);
			}
		}
		load();
		return () => { cancelled = true; };
	}, []);

	if (error) {
		return <p>Error : {error}</p>
	};

	return (
		<div className="w-full flex  lg:h-10 items-center lg:justify-center bg-white shadow-[0_3px_6px_0_#dee0e2] px-3 lg:px-8 min-w-dvw max-lg:overflow-x-auto">
			<div className="w-full hidden  lg:flex  max-w-6xl px-4 items-center justify-between h-full text-base font-bold">
				<Link
					to="/new-arrival"
					className="text-[15px] text-[#fb641b] font-semibold whitespace-nowrap"
				>
					New Arrivals
				</Link>
				{loading
					? [1, 2, 3, 4, 5].map((placeholder) => (
						<div key={placeholder} className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
					))
					: categories.map((item) => (
						<Dropdown
							key={item.id}
							title={item.name}
							list={item.children}
							slug={item.slug}
						/>
					))}
				<Link
					to="/sale"
					className="text-[15px] text-[#fb641b] font-semibold"
				>
					Sale
				</Link>
				<Link to="/emboss"
					className="text-[15px] font-semibold">
					Emboss
				</Link>
				<Link to="/bulkContact"
					className="text-[15px] font-semibold">
					Corporate Gifting
				</Link>
				<Link to="/franchise"
					className="text-[15px] font-semibold">
					Franchise Contact
				</Link>
			</div>
			<div>
				{location.pathname === "/" &&
					<div className="block lg:hidden">
						<div className="flex lg:hidden w-full items-center gap-1 py-2 bg-white">
							<Link to={`/new-arrival`}>
								<div className="h-27 w-20">
									<img src={`https://marfit-ea7ba.web.app/static/media/new.23972988.png`} className="h-full w-full object-contain" />
								</div>
							</Link>
							{loading
								? [1, 2, 3, 4].map((placeholder) => (
									<div key={placeholder} className="h-27 w-20 shrink-0 bg-gray-200 rounded animate-pulse" />
								))
								: categories.map((category) => (
									<Link key={category.id} to={`/categories/${category.slug}`}>
										<div className="h-27 w-20">
											<img src={category.imageUrl} className="h-full w-full object-contain" />
										</div>
									</Link>
								))}
							<Link to={`/sale`}>
								<div className="h-27 w-20">
									<img src={`https://marfit-ea7ba.web.app/static/media/sale.814e30f3.png`} className="h-full w-full object-contain" />
								</div>
							</Link>
						</div>
					</div>
				}
			</div>
		</div>
	);
}

export default CategoryDropdown;
