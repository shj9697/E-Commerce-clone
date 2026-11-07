import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

function Breadcrumb({ paths, loading = false }) {
  if (loading) return (
    <div className="w-full bg-[#f7f7f7] px-8">
      <div className="flex items-center gap-2 w-[85%] h-[50px]">
        <div className="h-4 w-12 rounded bg-gray-300 animate-pulse" />
        <ChevronRight size={16} className="text-gray-300" />
        <div className="h-4 w-28 rounded bg-gray-300 animate-pulse" />
      </div>
    </div>
  );

  return (
    <div className="w-full bg-[#f7f7f7] px-8">
      <div className="flex items-center gap-2 w-[85%] h-[50px]">
        <Link to="/">Home</Link>
        {paths?.map((path, index) => {
          const isCurrent = index === paths.length - 1;
          return (
            <div key={path.link ?? index} className={`flex items-center gap-2 ${isCurrent ? "min-w-0" : "shrink-0"}`}>
              <ChevronRight size={16} />
              {isCurrent ? (
                <span className="text-gray-600 truncate max-w-[50vw] md:max-w-[420px]">
                  {path.title}
                </span>
              ) : (
                <Link to={path.link}>{path.title}</Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Breadcrumb;
