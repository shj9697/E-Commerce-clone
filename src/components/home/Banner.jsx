import { Link } from 'react-router-dom';

function Banner({ imgUrl = "", path = "", loading = false }) {

  if (!imgUrl) return null;

  if (loading) {
    return (
      <div className="pt-2 relative lg:w-full">
        <div className="w-full h-120 bg-gray-300 animate-pulse" />
      </div>
    )
  }

  return (
    <Link to={path} className="relative bg-white">
      <img src={imgUrl} alt="Banner" />
    </Link>
  )
}

export default Banner;