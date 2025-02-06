import { Link } from "react-router-dom";

const BrandCard = ({ brand }: { brand: any }) => {

    return (
        <Link to={`/brand/${brand?.id}`}>
            <div className="relative flex flex-col items-center gap-2 p-4 rounded-lg hover:shadow-xl transition-transform transform hover:scale-105">
                {/* Brand Image */}
                <div className="relative">
                    <img
                        src={brand?.logo}
                        alt={brand?.label}
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
                        {brand?.label?.length > 30
                            ? brand?.label.substring(0, 30) + "..."
                            : brand?.label}
                    </h3>
                </div>
            </div>

        </Link>
    );
};

export default BrandCard;
