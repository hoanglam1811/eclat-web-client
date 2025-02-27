import { Navigate, RouteObject } from "react-router-dom";
import RouteNames from "../../constants/routeNames";
import CategoriesManagement from "./CategoriesManagement/index.tsx";
import BrandsManagement from "./BrandManagement/index.tsx";
import SkinTypesManagement from "./SkinTypeManagement/index.tsx";
import ProductsManagement from "./ProductsManagement/index.tsx";
import FormCreateProduct from "./FormAddProduct/index.tsx";
import FormViewProduct from "./ProductDetailsManagement/index.tsx";
import TagsManagement from "./TagManagement/index.tsx";
const publicRoutes: RouteObject[] = [
  {
    path: RouteNames.CATEGORIES_MANAGEMENT,
    element: <CategoriesManagement />,
  },
  {
    path: RouteNames.SKIN_TYPES_MANAGEMENT,
    element: <SkinTypesManagement />,
  },
  {
    path: RouteNames.BRANDS_MANAGEMENT,
    element: <BrandsManagement />,
  },
  {
    path: RouteNames.PRODUCTS_MANAGEMENT,
    element: <ProductsManagement />,
  },
  {
    path: RouteNames.PRODUCT_ADDITION,
    element: <FormCreateProduct />,
  },
  {
    path: RouteNames.PRODUCT_VIEW,
    element: <FormViewProduct />,
  },
  {
    path: RouteNames.TAGS_MANAGEMENT,
    element: <TagsManagement />,
  },
  // {
  //   path: RouteNames.SKIN_QUIZ,
  //   element: <SkinQuiz />,
  // },
  // {
  //   path: RouteNames.BEAUTY_BLOG,
  //   element: <SkincareBlog />,
  // },
  // {
  //   path: RouteNames.BLOG_DETAILS,
  //   element: <SkincareBlogDetails />,
  // }
];

const privateRoutes: RouteObject[] = [
  // {
  //   path: RouteNames.ACCOUNT_INFO,
  //   element: <AccountInfo />,
  // },
];

const staffRoutes: RouteObject[] = [
  {
    path: "/staff",
    element: <Navigate to={RouteNames.PRODUCTS_MANAGEMENT} replace />,
  },
  ...publicRoutes,
];

export default staffRoutes;
