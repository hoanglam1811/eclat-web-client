import { DeleteOutlined, EditOutlined, LeftOutlined, RightOutlined, UploadOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import Select from "react-select";
import { Textarea } from "../../../components/ui/textarea";
import { useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa";


const schema = z.object({
    imageUrl: z.string().optional(),
});

const FormViewProduct = () => {
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);

    // const updateTotalQuantity = () => {
    //     const quantities = watch("criteria")?.map((item: any) => item.quantity || 0) || [];
    //     setTotalQuantity(quantities.reduce((sum: any, val: any) => sum + val, 0));
    // };

    const {
        register,
        formState: { errors },
        trigger,
        setValue,
        getValues,
    } = useForm({
        resolver: zodResolver(schema),
    });

    const sampleProducts = [
        {
            id: "1",
            name: " Son Merzy, Romand, FOIF, Romand #23 (Starry Edition)",
            quantity: 50,
            description: "Beautiful earrings with a unique palm design.",
            origin_price: 835000,
            disc_price: 120000,
            origin_country: "USA",
            skinTypeId: "All Skin Types",
            brandId: "Brand A",
            average_rating: 4.5,
            status: "Hết hàng",
            imageUrl: "https://product.hstatic.net/1000006063/product/thumb_4340a9c074534f69bb76537f11da26c5_1024x1024.png",
            total_reviews: 200
        },
        {
            id: "2",
            name: " Son Merzy, Romand, FOIF, Romand #23 (Starry Edition)",
            quantity: 30,
            description: "Elegant necklace with a red birthstone.",
            origin_price: 100000,
            disc_price: 90000,
            origin_country: "USA",
            skinTypeId: "Sensitive Skin",
            brandId: "Brand B",
            average_rating: 4.8,
            status: "Còn hàng",
            imageUrl: "https://product.hstatic.net/1000006063/product/glam_2.11.1_18a5ca6f9b814d9bb11125d8c6d2f704_1024x1024.png",
            total_reviews: 200
        },
        {
            id: "3",
            name: "Son Merzy, Romand, FOIF, Romand #23 (Starry Edition)",
            quantity: 20,
            description: "Dainty butterfly necklace in gold.",
            origin_price: 1200000,
            disc_price: 600000,
            origin_country: "Vietnam",
            skinTypeId: "All Skin Types",
            brandId: "Brand C",
            average_rating: 4.9,
            status: "Còn hàng",
            imageUrl: "https://product.hstatic.net/1000006063/product/1_b5d9938d4e0d4b71b98a3ac1e059d73e_1024x1024.png",
            total_reviews: 200
        },
        {
            id: "4",
            name: "Son Merzy, Romand, FOIF, Romand #23 (Starry Edition)",
            quantity: 20,
            description: "Dainty butterfly necklace in gold.",
            origin_price: 1200000,
            disc_price: 600000,
            origin_country: "Vietnam",
            skinTypeId: "All Skin Types",
            brandId: "Brand C",
            average_rating: 4.9,
            status: "Ngừng hoạt động",
            imageUrl: "https://product.hstatic.net/1000006063/product/1200_x_1200_5b80186af6344e41b036b8dc310db177_1024x1024.png",
            total_reviews: 200
        },
        {
            id: "5",
            name: "Son lỏ, Romand, FOIF, Romand #23 (Starry Edition)",
            quantity: 20,
            description: "Dainty butterfly necklace in gold.",
            origin_price: 1200000,
            disc_price: 600000,
            origin_country: "Vietnam",
            skinTypeId: "All Skin Types",
            brandId: "Brand C",
            average_rating: 4.9,
            status: "Còn hàng",
            imageUrl: "https://product.hstatic.net/1000006063/product/1200_x_1200_5b80186af6344e41b036b8dc310db177_1024x1024.png",
            total_reviews: 200
        },
        {
            id: "6",
            name: " Son Merzy, Romand, FOIF, Romand #23 (Starry Edition)",
            quantity: 50,
            description: "Beautiful earrings with a unique palm design.",
            origin_price: 835000,
            disc_price: 120000,
            origin_country: "USA",
            skinTypeId: "All Skin Types",
            brandId: "Brand A",
            average_rating: 4.5,
            status: "Hết hàng",
            imageUrl: "https://product.hstatic.net/1000006063/product/thumb_4340a9c074534f69bb76537f11da26c5_1024x1024.png",
            total_reviews: 200
        },
        {
            id: "7",
            name: " Son Merzy, Romand, FOIF, Romand #23 (Starry Edition)",
            quantity: 30,
            description: "Elegant necklace with a red birthstone.",
            origin_price: 100000,
            disc_price: 90000,
            origin_country: "USA",
            skinTypeId: "Sensitive Skin",
            brandId: "Brand B",
            average_rating: 4.8,
            status: "Còn hàng",
            imageUrl: "https://product.hstatic.net/1000006063/product/glam_2.11.1_18a5ca6f9b814d9bb11125d8c6d2f704_1024x1024.png",
            total_reviews: 200
        },
        {
            id: "8",
            name: "Son Merzy, Romand, FOIF, Romand #23 (Starry Edition)",
            quantity: 20,
            description: "Dainty butterfly necklace in gold.",
            origin_price: 1200000,
            disc_price: 600000,
            origin_country: "Vietnam",
            skinTypeId: "All Skin Types",
            brandId: "Brand C",
            average_rating: 4.9,
            status: "Còn hàng",
            imageUrl: "https://product.hstatic.net/1000006063/product/1_b5d9938d4e0d4b71b98a3ac1e059d73e_1024x1024.png",
            total_reviews: 200
        },
        {
            id: "9",
            name: "Son Merzy, Romand, FOIF, Romand #23 (Starry Edition)",
            quantity: 20,
            description: "Dainty butterfly necklace in gold.",
            origin_price: 1200000,
            disc_price: 600000,
            origin_country: "Vietnam",
            skinTypeId: "All Skin Types",
            brandId: "Brand C",
            average_rating: 4.9,
            status: "Còn hàng",
            imageUrl: "https://product.hstatic.net/1000006063/product/1200_x_1200_5b80186af6344e41b036b8dc310db177_1024x1024.png",
            total_reviews: 200
        },
        {
            id: "10",
            name: "Son Merzy, Romand, FOIF, Romand #23 (Starry Edition)",
            quantity: 20,
            description: "Dainty butterfly necklace in gold.",
            origin_price: 1200000,
            disc_price: 600000,
            origin_country: "Vietnam",
            skinTypeId: "All Skin Types",
            brandId: "Brand C",
            average_rating: 4.9,
            status: "Còn hàng",
            imageUrl: "https://product.hstatic.net/1000006063/product/1200_x_1200_5b80186af6344e41b036b8dc310db177_1024x1024.png",
            total_reviews: 200
        }
    ];

    const [products, setProducts] = useState(sampleProducts);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

            if (index !== undefined) {
                setImages((prev) => {
                    const updatedImages = [...prev];
                    updatedImages[index] = newPreviews[0];
                    return updatedImages;
                });
                setImageFiles((prev) => {
                    const updatedFiles = [...prev];
                    updatedFiles[index] = newFiles[0];
                    return updatedFiles;
                });
            } else {
                setImageFiles((prev) => [...prev, ...newFiles]);
                setImages((prev) => [...prev, ...newPreviews]);
            }
        }
    };

    const handleRemoveImage = (index: number) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleReplaceImage = (index: number) => {
        const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
        fileInput.click();
        fileInput.onchange = (e: any) => handleFileChange(e, index);
    };


    const handleNextImage = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePreviousImage = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    useEffect(() => {
        return () => {
            images.forEach((image) => URL.revokeObjectURL(image));
        };
    }, [images]);

    const handleSave = async () => {
        const isValid = await trigger();
        if (!isValid) {
            console.error("Validation failed", errors);
            return;
        }
        const data = getValues();
        console.log("Form data: ", data);
    };

    const { id } = useParams();
    const product = products.find((p) => p.id === id);

    if (!product) {
        return <p className="text-center text-red-500 font-bold">Sản phẩm không tồn tại!</p>;
    }

    return (
        <>
            <div>
                <div>
                    <form className="bg-gray-50 p-8 rounded-lg shadow-lg max-w-5xl mx-auto space-y-10">
                        {/* Tiêu đề */}
                        <h2 className="text-3xl font-bold text-blue-700 mb-8 border-b-2 pb-4">
                            Thông tin sản phẩm {product.name}
                        </h2>

                        <div className="grid grid-cols-4 gap-6">
                            {/* Phần hiển thị ảnh (chiếm 1 cột) */}
                            <div className="col-span-1">
                                <div className="mb-6 relative group">
                                    <label className="block text-sm font-medium text-gray-700 text-left">
                                        Hình ảnh sản phẩm <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative mt-1 h-72 w-full">
                                        {images.length > 0 ? (
                                            <div className="relative h-full w-full">
                                                {images.length > 1 && (
                                                    <div className="absolute top-1/2 left-0 z-10 transform -translate-y-1/2 flex items-center">
                                                        <Button
                                                            type="primary"
                                                            shape="circle"
                                                            icon={<LeftOutlined />}
                                                            onClick={handlePreviousImage}
                                                            className="text-white bg-black opacity-50 hover:opacity-100"
                                                            style={{ padding: '10px' }}
                                                        />
                                                    </div>
                                                )}
                                                <img
                                                    src={images[currentIndex]}
                                                    alt={`Product Preview ${currentIndex + 1}`}
                                                    className="h-full w-full object-cover rounded-md"
                                                />
                                                {images.length > 1 && (
                                                    <div className="absolute top-1/2 right-0 z-10 transform -translate-y-1/2 flex items-center">
                                                        <Button
                                                            type="primary"
                                                            shape="circle"
                                                            icon={<RightOutlined />}
                                                            onClick={handleNextImage}
                                                            className="text-white bg-black opacity-50 hover:opacity-100"
                                                            style={{ padding: '10px' }}
                                                        />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleReplaceImage(currentIndex)} // Gọi đúng vị trí ảnh cần thay thế
                                                        className="text-white text-2xl mx-2"
                                                    >
                                                        <EditOutlined />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(currentIndex)}
                                                        className="text-white text-2xl mx-2"
                                                    >
                                                        <DeleteOutlined />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-full w-full bg-gray-200 flex items-center justify-center rounded-md">
                                                <span className="text-gray-500">Hiện tại trống, hãy thêm ảnh vào</span>
                                            </div>
                                        )}

                                        {/* Biểu tượng tải ảnh chỉ hiển thị khi không có ảnh */}
                                        {images.length === 0 && (
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                                <button
                                                    type="button"
                                                    onClick={() => document.getElementById('imageUpload')?.click()}
                                                    className="text-white text-2xl"
                                                >
                                                    <UploadOutlined />
                                                </button>
                                            </div>
                                        )}

                                        {/* Input file ẩn */}
                                        <input
                                            id="imageUpload"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e)} // Thêm ảnh mới hoặc thay thế ảnh
                                            className="hidden"
                                            multiple
                                        />
                                    </div>

                                </div>
                            </div>


                            {/* Phần thông tin sản phẩm (chiếm 3 cột) */}
                            <div className="col-span-3 space-y-8">
                                {/* Thông tin cơ bản */}
                                <div className="grid grid-cols-3 gap-6">
                                    {/* Tên sản phẩm */}
                                    <div className="col-span-2">
                                        <Label htmlFor="" className="block text-sm font-bold text-gray-700 text-left">
                                            Tên sản phẩm <span className="text-red-500">*</span>
                                        </Label>
                                        <p className="text-black-3 text-left">{product.name}</p>
                                        {/* <Input
                                            {...register("scholarshipName")}
                                            placeholder="Nhập tên sản phẩm"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.scholarshipName?.message && (
                                            <p className="text-sm text-red-500 mt-1">{String(errors.scholarshipName?.message)}</p>
                                        )} */}
                                    </div>
                                    <div>
                                        <Label htmlFor="educationalLevel" className="block text-sm font-bold text-gray-700 text-left">
                                            Nguồn gốc xuất xứ <span className="text-red-500">*</span>
                                        </Label>
                                        <p className="text-sm text-gray-500 text-left">{product.origin_country}</p>
                                        {/* <Select
                                            isSearchable
                                            placeholder="Chọn nguồn gốc xuất xứ"
                                            className="mt-1"
                                        />
                                        {errors.educationalLevel?.message && (
                                            <p className="text-sm text-red-500 mt-1">{String(errors.educationalLevel?.message)}</p>
                                        )} */}
                                    </div>
                                </div>

                                {/* Các thông tin khác */}
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="col-span-1">
                                        <Label htmlFor="educationalLevel" className="block text-sm font-bold text-gray-700 text-left">
                                            Loại da <span className="text-red-500">*</span>
                                        </Label>
                                        <p className="text-sm text-gray-500 text-left">{product.origin_country}</p>
                                        {/* <Select
                                            isSearchable
                                            placeholder="Chọn loại da"
                                            className="mt-1"
                                        />
                                        {errors.educationalLevel?.message && (
                                            <p className="text-sm text-red-500 mt-1">{String(errors.educationalLevel?.message)}</p>
                                        )} */}
                                    </div>
                                    <div className="col-span-1">
                                        <Label htmlFor="category" className="block text-sm font-bold text-gray-700 text-left">
                                            Thương hiệu <span className="text-red-500">*</span>
                                        </Label>
                                        <p className="text-sm text-gray-500 text-left">{product.brandId}</p>
                                        {/* <Select
                                            isSearchable
                                            placeholder="Chọn thương hiệu"
                                            className="mt-1"
                                        />
                                        {errors.deadline?.message && (
                                            <p className="text-sm text-red-500 mt-1">{String(errors.deadline?.message)}</p>
                                        )} */}
                                    </div>
                                    <div className="col-span-1">
                                        <Label htmlFor="productType" className="block text-sm font-bold text-gray-700 text-left">
                                            Loại sản phẩm <span className="text-red-500">*</span>
                                        </Label>
                                        <p className="text-sm text-gray-500 text-left">{product.origin_country}</p>
                                        {/* <Select
                                            isSearchable
                                            placeholder="Chọn loại sản phẩm"
                                            className="mt-1"
                                        />
                                        {errors.scholarshipType?.message && (
                                            <p className="text-sm text-red-500 mt-1">{String(errors.scholarshipType.message)}</p>
                                        )} */}
                                    </div>
                                </div>

                                {/* Mô tả sản phẩm */}
                                <div className="mt-6">
                                    <Label htmlFor="description" className="block text-sm font-bold text-gray-700 text-left">
                                        Mô tả sản phẩm <span className="text-red-500">*</span>
                                    </Label>
                                    <p className="text-sm text-gray-500 text-left">{product.origin_country}</p>
                                    {/* <Textarea
                                        {...register("description")}
                                        rows={4}
                                        placeholder="Nhập mô tả sản phẩm"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.description?.message && (
                                        <p className="text-sm text-red-500 mt-1">{String(errors.description.message)}</p>
                                    )} */}
                                </div>
                                <div className="mt-6">
                                    <Label htmlFor="usageInstructions" className="block text-sm font-bold text-gray-700 text-left">
                                        Hướng dẫn sử dụng <span className="text-red-500">*</span>
                                    </Label>
                                    <p className="text-sm text-gray-500 text-left">{product.origin_country}</p>
                                    {/* <Textarea
                                        {...register("usageInstructions")}
                                        rows={4}
                                        placeholder="Nhập hướng dẫn sử dụng"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.usageInstructions?.message && (
                                        <p className="text-sm text-red-500 mt-1">{String(errors.usageInstructions.message)}</p>
                                    )} */}
                                </div>
                                {/* <Label htmlFor="quantity" className="block text-sm font-bold text-gray-700 text-left">
                            Tên tuỳ chọn <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            {...register("quantity")}
                            placeholder="Ví dụ: Phân loại, Size,.."
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.quantity?.message && (
                            <p className="text-sm text-red-500 mt-1">{String(errors.quantity.message)}</p>
                        )}
                        <Label htmlFor="quantity" className="block text-sm font-bold text-gray-700 text-left">
                            Thêm chi tiết tuỳ chọn <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-4">
                            {watch("criteria")?.map((_criteria: any, index: any) => (
                                <div
                                    key={index}
                                    className="relative p-4 border rounded-md bg-white shadow-sm"
                                >
                                    {watch("criteria").length > 1 && (
                                        <Button
                                            onClick={() =>
                                                setValue(
                                                    "criteria",
                                                    watch("criteria").filter((_: any, i: any) => i !== index),
                                                    { shouldValidate: true }
                                                )
                                            }
                                            className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-full shadow"
                                        >
                                            <DeleteOutlined className="w-4 h-4" />
                                        </Button>
                                    )}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-2">
                                            <Input
                                                {...register(`criteria.${index}.name`)}
                                                placeholder="Ví dụ: Da dầu, Da khô, 216ml, 348ml.."
                                                className="w-full"
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Input
                                                type="number"
                                                {...register(`criteria.${index}.quantity`, {
                                                    valueAsNumber: true,
                                                    onChange: () => updateTotalQuantity(),
                                                })}
                                                placeholder="Nhập số lượng"
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mt-3">
                                        <Input
                                            {...register(`criteria.${index}.description`)}
                                            placeholder="Nhập giá gốc"
                                            className="w-full"
                                        />
                                        <Input
                                            {...register(`criteria.${index}.description`)}
                                            placeholder="Nhập giá khuyến mãi"
                                            className="w-full"
                                        />
                                        <Input
                                            type="file"
                                            id="imageUrl"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            ))}
                            {errors.criteria && errors.criteria.root && <p className="text-red-500 text-sm">{String(errors.criteria.root.message)}</p>}
                            <Button
                                onClick={() =>
                                    setValue("criteria", [...watch("criteria"), { name: "", description: "", percentage: "" }])
                                }
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition flex items-center space-x-2"
                            >
                                <FaPlus />
                                <span>Thêm mới</span>
                            </Button>
                        </div>

                        <div className="mt-6 flex items-center justify-between bg-gray-100 border border-gray-300 rounded-md p-4 shadow">
                            <h3 className="text-sm font-medium text-gray-700">
                                Tổng số lượng:
                            </h3>
                            <span className="text-xl font-bold text-gray-600">
                                {totalQuantity}
                            </span>
                        </div> */}
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end mt-6">
                            <Button onClick={handleSave} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                                Lưu
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default FormViewProduct;
