import { Link } from "react-router-dom";

const ProductCard = ({ product, handleBrandChange }: { product: any, handleBrandChange?: any }) => {

  const discountPercentage = Math.round(
    ((product?.origin_price - product?.disc_price) / product?.origin_price) * 100
  );

  return (
    <Link to={`/product/${product?.id}`}>
      <div className="relative flex flex-col items-center bg-white gap-2 p-4 rounded-lg hover:shadow-xl transition-transform transform hover:scale-105">
        <div className="relative">
          <img
            src={product?.imageUrl}
            alt={product?.name}
            className="w-50 h-50 object-contain rounded"
          />
          {discountPercentage > 0 && (
            <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs font-bold py-1 px-2 rounded-lg">
              -{discountPercentage}%
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="text-left">
          {/* Product Name */}
          <h4 className="text-sm font-bold text-gray-600 hover:underline" onClick={(e) => {
            e.preventDefault();
            handleBrandChange(product?.brandId);
          }}>
            {product.brandId}
          </h4>
          <h3
            className="text-md font-bold text-gray-800"
          >
            {product?.name?.length > 40
              ? product?.name.substring(0, 40) + "..."
              : product?.name}
          </h3>

          <div className="flex items-center justify-start gap-2">
            <p className="text-lg font-bold text-red-600">
              {product?.disc_price?.toLocaleString("vi-VN")}đ
            </p>
            <p className="text-sm text-gray-500 line-through">
              {product?.origin_price?.toLocaleString("vi-VN")}đ
            </p>
          </div>

        </div>
      </div>

    </Link>
  );
};

export default ProductCard;
