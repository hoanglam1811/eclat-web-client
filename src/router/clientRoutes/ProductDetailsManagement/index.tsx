import { Button, notification } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import Select from "react-select";
import { Textarea } from "../../../components/ui/textarea";
import { useNavigate, useParams } from "react-router-dom";
import { originCountries } from "./originCountries";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { getProductById, updateProduct } from "../../../services/ApiServices/productService";
import { addOption, deleteOption, getOptionById, updateOption } from "../../../services/ApiServices/optionService";
import { getAllBrands } from "../../../services/ApiServices/brandService";
import { getAllCategories } from "../../../services/ApiServices/categoryService";
import { getAllSkinTypes } from "../../../services/ApiServices/skinTypeService";
import { getAllTags } from "../../../services/ApiServices/tagService";
import { DeleteOutlined, EditOutlined, LeftOutlined, RightOutlined, UploadOutlined } from "@ant-design/icons";
import { FaPlus } from "react-icons/fa";
import { addImageOption, deleteImage } from "../../../services/ApiServices/imageService";

const FormViewProduct = () => {
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);


    const navigate = useNavigate();

    const {
        register,
        formState: { errors },
        trigger,
        watch,
        setValue,
        getValues,
    } = useForm();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
            // console.log("newFiles", newFiles);
            // console.log("newPreviews", newPreviews);
            console.log("images", images);

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

    // const handleRemoveImage = (index: number) => {
    //     setImageFiles((prev) => prev.filter((_, i) => i !== index));
    //     setImages((prev) => prev.filter((_, i) => i !== index));
    // };

    // const handleReplaceImage = (index: number) => {
    //     const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    //     fileInput.click();
    //     fileInput.onchange = (e: any) => handleFileChange(e, index);
    // };

    // const handleNextImage = () => {
    //     if (currentIndex < images.length - 1) {
    //         setCurrentIndex(currentIndex + 1);
    //     }
    // };

    // const handlePreviousImage = () => {
    //     if (currentIndex > 0) {
    //         setCurrentIndex(currentIndex - 1);
    //     }
    // };

    // useEffect(() => {
    //     return () => {
    //         images.forEach((image) => URL.revokeObjectURL(image));
    //     };
    // }, [images]);

    const handleEditing = () => {
        setIsEditing(!isEditing);
    };

    const { id } = useParams();
    const token = useSelector((state: RootState) => state.token.token);
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [brands, setBrands] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [tags, setTags] = useState<any[]>([]);
    const [skinTypes, setSkinTypes] = useState<any[]>([]);
    const [hiddenOptions, setHiddenOptions] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [undoStack, setUndoStack] = useState<{ index: any; option: any }[]>([]);
    const [tempOptions, setTempOptions] = useState<any[]>([]);

    const handleAddTempOption = () => {
        setTempOptions([...tempOptions, {
            optionValue: "",
            quantity: 0,
            optionPrice: 0,
            discPrice: 0,
            imgUrl: ""
        }]);
    };

    const handleDeleteOption = (index: any) => {
        const optionToRemove = watch("options")[index];
        setUndoStack([...undoStack, { index, option: optionToRemove }]);
        setHiddenOptions([...hiddenOptions, index]);
    };

    const handleUndoDelete = () => {
        if (undoStack.length === 0) return;

        const lastDeleted = undoStack[undoStack.length - 1];
        setUndoStack(undoStack.slice(0, -1));
        setHiddenOptions(hiddenOptions.filter((idx) => idx !== lastDeleted.index));
    };

    const handleSave = async () => {
        const isValid = await trigger();
        if (!isValid) {
            console.error("Validation failed", errors);
            return;
        }

        let data = getValues();
        console.log("Form data: ", data);

        if (!token) {
            navigate("/login");
            return;
        }
        if (!id) return;

        try {
            setLoading(true);

            await updateProduct(Number(id), data, token);
            console.log(imageFiles)

            const updatedOptionsData = watch("options").map((option: any, index: number) => ({
                productId: Number(id),
                optionValue: option.optionValue,
                quantity: option.quantity,
                optionPrice: option.optionPrice,
                discPrice: option.discPrice,
                optionId: option.optionId
            }));
            console.log("newOptionsData", watch("options"));
            await Promise.all(updatedOptionsData.map((opt: any) => updateOption(opt.optionId, opt, token)));

            if (tempOptions.length > 0) {
                const newOptionsData = tempOptions.map(option => ({
                    productId: Number(id),
                    optionValue: option.optionValue,
                    quantity: option.quantity,
                    optionPrice: option.optionPrice,
                    discPrice: option.discPrice,
                    // imgUrl: option.imgUrl
                }));


                const newOptions = await Promise.all(newOptionsData.map(opt => addOption(opt, token)));

                data.options = [...data.options, ...newOptions.map((opt:any) => opt.data)];

                setTempOptions([]);
            }

            //Update images for existing options
            console.log("data", data);
            
            if(imageFiles.length > 0) {
                const imageUrls = await Promise.all(data.options.map((option:any,index:number) => {
                  if (hiddenOptions.includes(index) || !imageFiles[index]) return null; 
                  option.images.forEach((image:any) => {
                    deleteImage(image.imageId, token);
                  })
                  // console.log("option", option);
                  return addImageOption(option.optionId, imageFiles[index], token).then((url:any) => url.data)
                }).filter(Boolean));
                data.options.forEach((option: any, index: number) => {
                    if (hiddenOptions.includes(index)) return
                    option.imgUrl = imageUrls[index]
                });
                setImageFiles([]);
            }

            for (const index of hiddenOptions) {
                const optionId = product.options[index].optionId;
                // console.log("optionId", optionId);
                if (optionId) {
                    await deleteOption(optionId, token);
                }
            }

            await fetchProduct();
            setHiddenOptions([]);
            setIsEditing(false);
            setUndoStack([]);
            notification.success({ message: "Cập nhật sản phẩm thành công! 🎉" });
        } catch (error: any) {
            console.error("Lỗi khi cập nhật sản phẩm:", error);
            notification.error({ message: "Cập nhật thất bại! 🥺" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!token) return null;

                const brandsData = await getAllBrands(token);
                setBrands(brandsData);

                const categoriesData = await getAllCategories(token);
                setCategories(categoriesData);

                const skinTypesData = await getAllSkinTypes(token);
                setSkinTypes(skinTypesData.result);

                const tagsData = await getAllTags(token);
                setTags(tagsData);

            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, [token]);

    const fetchProduct = async () => {
        try {
            if (!token) return null;
            if (!id) return;
            const productData = await getProductById(Number(id), token);
            console.log(productData)
            setProduct(productData.data);

            setValue('productName', productData.data.productName);
            setValue('description', productData.data.description);
            setValue('usageInstruct', productData.data.usageInstruct);
            setValue('status', productData.data.status);
            setValue('originCountry', productData.data.originCountry);
            setValue('skinType.id', productData.data.skinTypeId);
            setValue('brand.brandId', productData.data.brandId);
            // setValue('productType', productData.data.categoryId);
            setValue('tag.tagId', productData.data.tagId);
            setValue('attribute', productData.data.attribute || "N/A");
            // setValue('options', productData.data.options || []);

            if (productData.data.options?.length > 0) {
                const optionsData = await Promise.all(
                    productData.data.options.map((opt: any) =>
                        getOptionById(opt.optionId, token)
                    )
                );
                setProduct({ ...productData.data, options: optionsData.map((opt: any) => opt.data) });
                setValue('options', optionsData.map((opt: any) => opt.data) || []);
            }
        } catch (error) {
            console.error("Error fetching product data", error);
            setError("Không thể tải sản phẩm.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        fetchProduct();
    }, [id, token]);

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!product) return <p className="text-red-500">Sản phẩm không tồn tại!</p>;

    return (
        <>
            <div className="relative bg-gradient-to-br from-sky-100 to-white min-h-screen flex justify-center items-center px-4">
                {/* Các họa tiết trang trí */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-300 opacity-20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-16 right-10 w-24 h-24 bg-teal-300 opacity-20 rounded-full blur-2xl"></div>
                <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-pink-300 opacity-30 rounded-full blur-xl"></div>
                <div>
                    <form className="bg-gray-50 p-8 rounded-lg shadow-md max-w-6xl mt-10 mb-10">
                        {/* Tiêu đề */}
                        <h2 className="text-3xl font-bold text-blue-700 mb-8 border-b-2 pb-4">
                            Thông tin sản phẩm {product.productName}
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
                                                            //onClick={handlePreviousImage}
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
                                                            // onClick={handleNextImage}
                                                            className="text-white bg-black opacity-50 hover:opacity-100"
                                                            style={{ padding: '10px' }}
                                                        />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                                    <button
                                                        type="button"
                                                        // onClick={() => handleReplaceImage(currentIndex)}
                                                        className="text-white text-2xl mx-2"
                                                    >
                                                        <EditOutlined />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        // onClick={() => handleRemoveImage(currentIndex)}
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
                                                    disabled={!isEditing}
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
                                          disabled={!isEditing}
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
                                    <div className="col-span-3">
                                        <Label htmlFor="" className="block text-sm font-bold text-gray-700 text-left">
                                            Tên sản phẩm <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            defaultValue={product.productName} // Gán giá trị mặc định từ product
                                            {...register("productName")}
                                            disabled={!isEditing}
                                            placeholder="Nhập tên sản phẩm"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Các thông tin khác */}


                                {/* Mô tả sản phẩm */}
                                <div className="mt-6">
                                    <Label htmlFor="description" className="block text-sm font-bold text-gray-700 text-left">
                                        Mô tả sản phẩm <span className="text-red-500">*</span>
                                    </Label>
                                    <>
                                        <Textarea
                                            defaultValue={product.description}
                                            rows={4}
                                            disabled={!isEditing}
                                            {...register("description")}
                                            placeholder="Nhập mô tả sản phẩm"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </>
                                </div>

                                <div className="mt-6">
                                    <Label htmlFor="usageInstructions" className="block text-sm font-bold text-gray-700 text-left">
                                        Hướng dẫn sử dụng <span className="text-red-500">*</span>
                                    </Label>
                                    <>
                                        <Textarea
                                            defaultValue={product.usageInstruct}
                                            rows={4}
                                            disabled={!isEditing}
                                            {...register("usageInstruct")}
                                            placeholder="Nhập hướng dẫn sử dụng"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </>
                                </div>

                                <div className="grid grid-cols-3 gap-6">
                                    <div className="col-span-1">
                                        <Label htmlFor="status" className="block text-sm font-bold text-gray-700 text-left">
                                            Trạng thái <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={{
                                                label: product.status == true ? "Còn hàng" : "Tạm ẩn",
                                                value: product.status == true
                                            }}
                                            isDisabled={!isEditing}
                                            isSearchable
                                            placeholder="Chọn trạng thái"
                                            className="mt-1"
                                        />
                                    </div>

                                    <div className="col-span-1">
                                        <Label htmlFor="origin_country" className="block text-sm font-bold text-gray-700 text-left">
                                            Nguồn gốc xuất xứ <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={originCountries.map((country) => ({
                                                value: country,
                                                label: country,
                                            })).find((country) => country.value === watch("originCountry"))}
                                            onChange={(e: any) => setValue("originCountry", e.value)}
                                            isDisabled={!isEditing}
                                            options={originCountries.map((country: any) => ({ value: country, label: country }))}
                                            isSearchable
                                            placeholder="Chọn nguồn gốc xuất xứ"
                                            className="mt-1"
                                        />
                                    </div>

                                    <div className="col-span-1">
                                        <Label htmlFor="skinTypeId" className="block text-sm font-bold text-gray-700 text-left">
                                            Loại da <span className="text-red-500">*</span>
                                        </Label>
                                        <>
                                            <Select
                                                options={skinTypes.map((skinType: any) => ({ value: skinType.id, label: skinType.skinName }))}
                                                onChange={(e: any) => setValue("skinType.id", e.value)}
                                                value={skinTypes.map((tag: any) => ({ value: tag.id, label: tag.skinName }))
                                                    .find((tag: any) => tag.value == watch("skinType.id"))}
                                                isSearchable
                                                isDisabled={!isEditing}
                                                placeholder="Chọn loại da"
                                                className="mt-1"
                                            />
                                        </>
                                    </div>

                                    <div className="col-span-1">
                                        <Label htmlFor="brandId" className="block text-sm font-bold text-gray-700 text-left">
                                            Thương hiệu <span className="text-red-500">*</span>
                                        </Label>
                                        <>
                                            <Select
                                                options={brands.map((brand: any) => ({ value: brand.brandId, label: brand.brandName }))}
                                                onChange={(e: any) => setValue("brand.brandId", e.value)}
                                                value={brands.map((tag: any) => ({ value: tag.brandId, label: tag.brandName }))
                                                    .find((tag: any) => tag.value == watch("brand.brandId"))}
                                                isSearchable
                                                isDisabled={!isEditing}
                                                placeholder="Chọn thương hiệu"
                                                className="mt-1"
                                            />
                                        </>
                                    </div>

                                    <div className="col-span-1">
                                        <Label htmlFor="productType" className="block text-sm font-bold text-gray-700 text-left">
                                            Loại sản phẩm <span className="text-red-500">*</span>
                                        </Label>
                                        <>
                                            <Select
                                                options={categories.map((category: any) => ({ value: category.categoryId, label: category.categoryName }))}
                                                onChange={(e: any) => setValue("tag.tagId", e.value)}
                                                value={tags.find((tag: any) => tag.tagId == watch("tag.tagId")) &&
                                                    tags.filter((tag: any) => tag.tagId == watch("tag.tagId")).map((tag: any) => {
                                                        return { label: tag.category.categoryName, value: tag.category.categoryId };
                                                    })}
                                                isSearchable
                                                isDisabled
                                                placeholder="Chọn loại sản phẩm"
                                                className="mt-1"
                                            />
                                        </>
                                    </div>

                                    <div className="col-span-1">
                                        <Label htmlFor="productType" className="block text-sm font-bold text-gray-700 text-left">
                                            Loại thẻ <span className="text-red-500">*</span>
                                        </Label>
                                        <>
                                            <Select
                                                options={tags.map((tag: any) => ({ value: tag.tagId, label: tag.tagName }))}
                                                onChange={(e: any) => setValue("tag.tagId", e.value)}
                                                value={tags.map((tag: any) => ({ value: tag.tagId, label: tag.tagName }))
                                                    .find((tag: any) => tag.value == watch("tag.tagId"))}
                                                //{ label: product.tag.tagName, value: product.tag.tagId }}
                                                isSearchable
                                                isDisabled={!isEditing}
                                                placeholder="Chọn loại sản phẩm"
                                                className="mt-1"
                                            />
                                        </>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <Label htmlFor="quantity" className="block text-sm font-bold text-gray-700 text-left">
                                        Tên tuỳ chọn <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        defaultValue={product?.attribute || "N/A"}
                                        {...register("attribute")}
                                        disabled={!isEditing}
                                        placeholder="Ví dụ: Phân loại, Size,.."
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="mt-6">
                                    <Label htmlFor="quantity" className="block text-sm font-bold text-gray-700 text-left">
                                        Chi tiết tuỳ chọn <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="space-y-4 ">
                                        {product.options.map((option: any, index: number) => (
                                            <div key={index} className={`p-4 border rounded-md bg-white shadow-sm relative ${hiddenOptions.includes(index) ? "opacity-50 pointer-events-none" : ""}`}>
                                                {!hiddenOptions.includes(index) && watch("options").length > 1 && (
                                                    <Button
                                                        disabled={!isEditing}
                                                        onClick={() => handleDeleteOption(index)}
                                                        className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-full shadow"
                                                    >
                                                        <DeleteOutlined className="w-4 h-4" />
                                                    </Button>
                                                )}

                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="col-span-2">
                                                        <Label htmlFor="brandId" className="block text-sm font-bold text-blue-500 text-left mb-1">
                                                            Ví dụ: Da dầu, Da khô, 216ml, 348ml.. <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            {...register(`options.${index}.optionValue`)}
                                                            placeholder="Ví dụ: Da dầu, Da khô, 216ml, 348ml.."
                                                            disabled={hiddenOptions.includes(index) || !isEditing}
                                                            className="w-full"
                                                        />
                                                        {
                                                            (errors.options as any) && (errors.options as any)[index]?.optionValue?.message && (
                                                                <p className="text-sm text-red-500 mt-1">
                                                                    {String((errors.options as any)[index].optionValue?.message)}
                                                                </p>
                                                            )}
                                                    </div>

                                                    <div className="col-span-1">
                                                        <Label htmlFor="brandId" className="block text-sm font-bold text-blue-500 text-left mb-1">
                                                            Số lượng <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            {...register(`options.${index}.quantity`, {
                                                                valueAsNumber: true,
                                                            })}
                                                            disabled={hiddenOptions.includes(index) || !isEditing}
                                                            placeholder="Nhập số lượng"
                                                            className="w-full"
                                                        />
                                                        {
                                                            (errors.options as any) && (errors.options as any)[index]?.quantity?.message && (
                                                                <p className="text-sm text-red-500 mt-1">
                                                                    {String((errors.options as any)[index].quantity?.message)}
                                                                </p>
                                                            )}
                                                    </div>
                                                </div>

                                                {/* Dòng thứ hai */}
                                                <div className="grid grid-cols-3 gap-4 mt-3">
                                                    <div className="col-span-1">
                                                        <Label htmlFor="brandId" className="block text-sm font-bold text-blue-500 text-left mb-1">
                                                            Giá gốc <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            {...register(`options.${index}.optionPrice`, {
                                                                valueAsNumber: true,
                                                            })}
                                                            placeholder="Nhập giá gốc"
                                                            disabled={hiddenOptions.includes(index) || !isEditing}
                                                            type="number"
                                                            className="w-full"
                                                        />
                                                        {
                                                            (errors.options as any) && (errors.options as any)[index]?.optionPrice?.message && (
                                                                <p className="text-sm text-red-500 mt-1">
                                                                    {String((errors.options as any)[index].optionPrice?.message)}
                                                                </p>
                                                            )}
                                                    </div>

                                                    <div className="col-span-1">
                                                        <Label htmlFor="brandId" className="block text-sm font-bold text-blue-500 text-left mb-1">
                                                            Giá khuyến mãi <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            {...register(`options.${index}.discPrice`, {
                                                                valueAsNumber: true,
                                                            })}
                                                            type="number"
                                                            placeholder="Nhập giá khuyến mãi"
                                                            disabled={hiddenOptions.includes(index) || !isEditing}
                                                            className="w-full"
                                                        />
                                                        {
                                                            (errors.options as any) && (errors.options as any)[index]?.discPrice?.message && (
                                                                <p className="text-sm text-red-500 mt-1">
                                                                    {String((errors.options as any)[index].discPrice?.message)}
                                                                </p>
                                                            )}
                                                    </div>

                                                    <div className="col-span-1">
                                                        <Label htmlFor="brandId" className="block text-sm font-bold text-blue-500 text-left mb-1">
                                                            Hình ảnh <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            type="file"
                                                            // value={watch(`options.${index}.imgUrl`)}
                                                            accept="image/*"
                                                            disabled={hiddenOptions.includes(index) || !isEditing}
                                                            //{...register("imgUrl")}
                                                            // onChange={(e: any) => setValue(`options.${index}.imgUrl`, e.target.value)}
                                                            onChange={(e) => handleFileChange(e, index)}
                                                            placeholder="Upload hình ảnh"
                                                            className="p-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                                        />
                                                    </div>
                                                    <div className="mt-3 flex justify-center col-span-3">
                                                        {images[index] && (
                                                            <div className="mt-4">
                                                                <Label className="text-left">Xem trước</Label>
                                                                <img
                                                                    src={images[index]}
                                                                    alt="Logo Preview"
                                                                    className="w-full h-40 object-cover border rounded-md mt-2"
                                                                />
                                                            </div>
                                                        )}
                                                        {!images[index] && product.options[index].images?.[0]?.imageUrl && (
                                                            <div className="mt-4">
                                                                <Label className="text-left">Xem trước</Label>
                                                                <img
                                                                    src={product.options[index].images[0].imageUrl}
                                                                    alt="Logo Preview"
                                                                    className="w-full h-40 object-cover border rounded-md mt-2"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {tempOptions.map((option, index) => (
                                            <div key={index} className="p-4 border rounded-md bg-white shadow-sm mt-4">
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="col-span-2">
                                                        <Label className="block text-sm font-bold text-blue-500 text-left mb-1">
                                                            Ví dụ: Da dầu, Da khô, 216ml, 348ml.. <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            value={option.optionValue}
                                                            onChange={(e) => {
                                                                const newOptions = [...tempOptions];
                                                                newOptions[index].optionValue = e.target.value;
                                                                setTempOptions(newOptions);
                                                            }}
                                                            placeholder="Ví dụ: Da dầu, Da khô, 216ml, 348ml.."
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    <div className="col-span-1">
                                                        <Label className="block text-sm font-bold text-blue-500 text-left mb-1">
                                                            Số lượng <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            value={option.quantity}
                                                            onChange={(e) => {
                                                                const newOptions = [...tempOptions];
                                                                newOptions[index].quantity = Number(e.target.value);
                                                                setTempOptions(newOptions);
                                                            }}
                                                            placeholder="Nhập số lượng"
                                                            className="w-full"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-4 mt-3">
                                                    <div className="col-span-1">
                                                        <Label className="block text-sm font-bold text-blue-500 text-left mb-1">
                                                            Giá gốc <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            value={option.optionPrice}
                                                            onChange={(e) => {
                                                                const newOptions = [...tempOptions];
                                                                newOptions[index].optionPrice = Number(e.target.value);
                                                                setTempOptions(newOptions);
                                                            }}
                                                            placeholder="Nhập giá gốc"
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    <div className="col-span-1">
                                                        <Label className="block text-sm font-bold text-blue-500 text-left mb-1">
                                                            Giá khuyến mãi <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            value={option.discPrice}
                                                            onChange={(e) => {
                                                                const newOptions = [...tempOptions];
                                                                newOptions[index].discPrice = Number(e.target.value);
                                                                setTempOptions(newOptions);
                                                            }}
                                                            placeholder="Nhập giá khuyến mãi"
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    <div className="col-span-1">
                                                        <Label className="block text-sm font-bold text-blue-500 text-left mb-1">
                                                            Hình ảnh <span className="text-red-500">*</span>
                                                        </Label>
                                                        <Input
                                                            type="file"
                                                            accept="image/*"
                                                            // value={option.imgUrl}
                                                            // onChange={(e) => {
                                                            //     const newOptions = [...tempOptions];
                                                            //     newOptions[index].imgUrl = e.target.value;
                                                            //     setTempOptions(newOptions);
                                                            // }}
                                                            onChange={(e) => handleFileChange(e, index + product.options.length)}
                                                            placeholder="Upload hình ảnh"
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    <div className="mt-3 flex justify-center col-span-3">
                                                        {images[index + product.options.length] && (
                                                            <div className="mt-4">
                                                                <Label className="text-left">Xem trước</Label>
                                                                <img
                                                                    src={images[index + product.options.length]}
                                                                    alt="Logo Preview"
                                                                    className="w-full h-40 object-cover border rounded-md mt-2"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>

                                                </div>

                                                <div className="mt-4 flex justify-end space-x-4">
                                                    <Button
                                                        disabled={!isEditing}
                                                        onClick={() => {
                                                            const newOptions = tempOptions.filter((_, i) => i !== index);
                                                            setTempOptions(newOptions);
                                                            setImages((prev) => prev.filter((_, i) => i !== index + product.options.length));
                                                        }}
                                                        className="bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600 transition"
                                                    >
                                                        Xoá
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}

                                        <Button
                                            disabled={!isEditing}
                                            onClick={handleAddTempOption}
                                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition flex items-center space-x-2"
                                        >
                                            <FaPlus />
                                            <span>Thêm mới</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            {undoStack.length > 0 && (
                                <Button
                                    onClick={handleUndoDelete}
                                    className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition"
                                >
                                    Hoàn tác
                                </Button>
                            )}

                            {!isEditing && (
                                <Button onClick={handleEditing} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                                    Thay đổi
                                </Button>
                            )}

                            {isEditing && (
                                <>
                                    <Button
                                        onClick={() => { setIsEditing(false); fetchProduct(); setTempOptions([]); setHiddenOptions([]); setUndoStack([]) }}
                                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        onClick={handleSave}
                                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                                    >
                                        Lưu
                                    </Button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default FormViewProduct;
