import { Link } from "react-router-dom";

const BrandCard = ({ brand }: { brand: any }) => {

    return (
        <Link to={`/brand/${brand?.brandId}`}>
            <div className="relative flex flex-col items-center gap-2 p-4 rounded-lg hover:shadow-xl transition-transform transform hover:scale-105">
                {/* Brand Image */}
                <div className="relative">
                    <img
                        src={brand?.imgUrl}
                        alt={brand?.brandName}
                        className="w-50 h-50 object-contain rounded"
                    />
                </div>

                {/* Brand Details */}
                <div className="text-center">
                    {/* Brand Name */}
                    <h3
                        className="text-sm font-bold text-gray-800"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        {brand?.brandName?.length > 30
                            ? brand?.brandName.substring(0, 30) + "..."
                            : brand?.brandName}
                    </h3>
                </div>
            </div>

        </Link>
    );
};

export default BrandCard;
