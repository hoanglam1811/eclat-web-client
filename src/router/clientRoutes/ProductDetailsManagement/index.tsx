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
import { getOptionById } from "../../../services/ApiServices/optionService";
import { getAllBrands } from "../../../services/ApiServices/brandService";
import { getAllCategories } from "../../../services/ApiServices/categoryService";
import { getAllSkinTypes } from "../../../services/ApiServices/skinTypeService";
import { getAllTags } from "../../../services/ApiServices/tagService";

const FormViewProduct = () => {
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [isEditing, setIsEditing] = useState(false);

    const navigate = useNavigate();

    const {
        register,
        formState: { errors },
        trigger,
        watch,
        setValue,
        getValues,
    } = useForm();

    // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    //     const files = e.target.files;
    //     if (files) {
    //         const newFiles = Array.from(files);
    //         const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    //         if (index !== undefined) {
    //             setImages((prev) => {
    //                 const updatedImages = [...prev];
    //                 updatedImages[index] = newPreviews[0];
    //                 return updatedImages;
    //             });
    //             setImageFiles((prev) => {
    //                 const updatedFiles = [...prev];
    //                 updatedFiles[index] = newFiles[0];
    //                 return updatedFiles;
    //             });
    //         } else {
    //             setImageFiles((prev) => [...prev, ...newFiles]);
    //             setImages((prev) => [...prev, ...newPreviews]);
    //         }
    //     }
    // };

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

    const handleSave = async () => {
        const isValid = await trigger();
        if (!isValid) {
            console.error("Validation failed", errors);
            return;
        }
        const data = getValues();
        console.log("Form data: ", data);
        if(!token) {
          navigate("/login");
          return;
        }
        if(!id) return;
        try{
          setLoading(true)
          const response = await updateProduct(Number(id), data, token);
          await fetchProduct();
          setIsEditing(false);
          notification.success({ message: "Cập nhật sản phẩm thành công! 🎉" })
        }
        catch(error:any){
          notification.error({ message: "Cấp nhật that bai! 🥺" })
        }
        finally{
          setLoading(false);
        }
    };

    const handleEditing = () => {
        setIsEditing(!isEditing);
    };

    const { id } = useParams();
    const token = useSelector((state: RootState) => state.token.token);
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [options, setOptions] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [tags, setTags] = useState<any[]>([]);
    const [skinTypes, setSkinTypes] = useState<any[]>([]);

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
            setValue('skinType.id', productData.data.skinType.id);
            setValue('brand.brandId', productData.data.brand.brandId);
            setValue('productType', productData.data.tag.category.categoryId);
            setValue('tag.tagId', productData.data.tag.tagId);
            setValue('attribute', productData.data.attribute || "N/A");
            setValue('options', productData.data.options || []);
            
                // if (productData.data.options?.length > 0) {
                //     const optionsData = await Promise.all(
                //         productData.data.options.map((opt: any) =>
                //             getOptionById(opt.optionId, token)
                //         )
                //     );
                //     setOptions(optionsData);
                // }
            } catch (error) {
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
                                                onChange={(e:any) => setValue("skinType.id", e.value)}
                                                value={skinTypes.map((tag: any) => ({ value: tag.id, label: tag.skinName}))
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
                                                onChange={(e:any) => setValue("brand.brandId", e.value)}
                                                value={brands.map((tag: any) => ({ value: tag.brandId, label: tag.brandName}))
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
                                                onChange={(e:any) => setValue("tag.tagId", e.value)}
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
                                                onChange={(e:any) => setValue("tag.tagId", e.value)}
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
                                    <div className="space-y-4">
                                        {product.options.map((option: any, index: number) => (
                                            <div key={index} className="p-4 border rounded-md bg-white shadow-sm">
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="col-span-2">
                                                      <Input
                                                        {...register(`options.${index}.optionValue`)}
                                                        placeholder="Ví dụ: Da dầu, Da khô, 216ml, 348ml.."
                                                        disabled={!isEditing}
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
                                                      <Input
                                                        type="number"
                                                        {...register(`options.${index}.quantity`, {
                                                          valueAsNumber: true,
                                                        })}
                                                        disabled={!isEditing}
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
                                                    <Input
                                                      {...register(`options.${index}.optionPrice`, {
                                                        valueAsNumber: true,
                                                      })}
                                                      placeholder="Nhập giá gốc"
                                                      disabled={!isEditing}
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
                                                    <Input
                                                      {...register(`options.${index}.discPrice`, {
                                                        valueAsNumber: true,
                                                      })}
                                                      type="number"
                                                      placeholder="Nhập giá khuyến mãi"
                                                      disabled={!isEditing}
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
                                                    <Input
                                                      type="text"
                                                      {...register(`options.${index}.imageUrl`)}
                                                      placeholder="Nhập đường link hình ảnh"
                                                      disabled={!isEditing}
                                                      className="w-full"
                                                    />
                                                  </div>
                                                  <div className="mt-3">
                                                    <img src={option.imageUrl} className="w-12 h-12 rounded-md" alt="Option" />
                                                  </div>
                                              </div>

                                                
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            {!isEditing && (
                                <Button onClick={handleEditing} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                                    Thay đổi
                                </Button>
                            )}

                            {isEditing && (
                                <>
                                    <Button
                                        onClick={() => setIsEditing(false)}
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
