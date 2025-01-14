import { Link } from "react-router-dom";

const ProductCard = ({ product }: { product: any }) => {
  const discountPercentage = Math.round(
    ((product?.origin_price - product?.disc_price) / product?.origin_price) * 100
  );

  return (
    <Link to={`/product/${product?.id}`}>
      <div className="relative flex flex-col items-center gap-2 p-4 rounded-lg hover:shadow-xl transition-transform transform hover:scale-105">
        {/* Product Image */}
        <div className="relative">
          <img
            src={product?.imageUrl}
            alt={product?.name}
            className="w-50 h-50 object-contain rounded"
          />
          {discountPercentage > 0 && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold py-1 px-2 rounded-full">
              -{discountPercentage}%
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="text-center">
          {/* Product Name */}
          <h3
            className="text-sm font-bold text-gray-800"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {product?.name?.length > 30
              ? product?.name.substring(0, 30) + "..."
              : product?.name}
          </h3>

          {/* Original Price */}
          <p className="text-sm text-gray-500 line-through">
            {product?.origin_price?.toLocaleString("vi-VN")}đ
          </p>

          {/* Discounted Price */}
          <p className="text-lg font-bold text-red-600">
            {product?.disc_price?.toLocaleString("vi-VN")}đ
          </p>
        </div>
      </div>

    </Link>
  );
};

export default ProductCard;
