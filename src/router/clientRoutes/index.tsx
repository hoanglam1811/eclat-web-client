import { Navigate, RouteObject } from "react-router-dom";
import RouteNames from "../../constants/routeNames";
import Home from "./Home/index.tsx";
import ProductDetails from "./ProductDetails/index.tsx";
import Cart from "./Cart/index.tsx";
import Account from "./Account/index.tsx";
import AccountChangePassword from "./AccountChangePassword/index.tsx";
import Products from "./Products/index.tsx";
import AccountOrder from "./AccountOrder/index.tsx";
import Payment from "./Payment/index.tsx";
import Brands from "./Brands/index.tsx";
import SkinQuiz from "./SkinQuiz/index.tsx";
import SkincareBlog from "./Blog/index.tsx";
import SkincareBlogDetails from "./BlogDetails/index.tsx";
import { PaymentError, PaymentFailed, PaymentNotFound, PaymentSuccess, VnPayReturn } from "./PaymentReturn/index.tsx";

const publicRoutes: RouteObject[] = [
  {
    path: RouteNames.HOME,
    element: <Home />,
  },
  {
    path: RouteNames.PRODUCT_DETAIL,
    element: <ProductDetails />,
  },
  {
    path: RouteNames.CART,
    element: <Cart />,
  },
  {
    path: RouteNames.ACCOUNT,
    element: <Account />,
  },
  {
    path: RouteNames.ACCOUNT_ORDERS,
    element: <AccountOrder />,
  },
  {
    path: RouteNames.ACCOUNT_CHANGE_PASSWORD,
    element: <AccountChangePassword />,
  },
  {
    path: RouteNames.PRODUCTS,
    element: <Products />,
  },
  {
    path: RouteNames.PAYMENT,
    element: <Payment />,
  },
  // {
  //   path: RouteNames.CATEGORIES_MANAGEMENT,
  //   element: <CategoriesManagement />,
  // },
  // {
  //   path: RouteNames.SKIN_TYPES_MANAGEMENT,
  //   element: <SkinTypesManagement />,
  // },
  // {
  //   path: RouteNames.BRANDS_MANAGEMENT,
  //   element: <BrandsManagement />,
  // },
  // {
  //   path: RouteNames.PRODUCTS_MANAGEMENT,
  //   element: <ProductsManagement />,
  // },
  // {
  //   path: RouteNames.PRODUCT_ADDITION,
  //   element: <FormCreateProduct />,
  // },
  // {
  //   path: RouteNames.PRODUCT_VIEW,
  //   element: <FormViewProduct />,
  // },
  {
    path: RouteNames.BRANDS,
    element: <Brands />,
  },
  // {
  //   path: RouteNames.TAGS_MANAGEMENT,
  //   element: <TagsManagement />,
  // },

  {
    path: RouteNames.SKIN_QUIZ,
    element: <SkinQuiz />,
  },
  {
    path: RouteNames.BEAUTY_BLOG,
    element: <SkincareBlog />,
  },
  {
    path: RouteNames.BLOG_DETAILS,
    element: <SkincareBlogDetails />,
  },
  {
    path: RouteNames.PAYMENT_SUCCESS,
    element: <PaymentSuccess />,
  },
  {
    path: RouteNames.PAYMENT_FAILED,
    element: <PaymentFailed />,
  }, {
    path: RouteNames.PAYMENT_ERROR,
    element: <PaymentError />,
  }, {
    path: RouteNames.PAYMENT_NOT_FOUND,
    element: <PaymentNotFound />,
  }, {
    path: RouteNames.PAYMENT_RETURN,
    element: <VnPayReturn />,
  },
];

const privateRoutes: RouteObject[] = [
  // {
  //   path: RouteNames.ACCOUNT_INFO,
  //   element: <AccountInfo />,
  // },
];

const clientRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to={RouteNames.HOME} replace />,
  },
  ...publicRoutes,
];

export default clientRoutes;
