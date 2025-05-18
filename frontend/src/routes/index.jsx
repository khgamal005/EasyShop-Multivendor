import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import ActivationPage from "../pages/ActivationPage";

import App from "../App";
import ProductsPage from "../pages/ProductsPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import BestSellingPage from "../pages/BestSellingPage";
import FAQPage from "../pages/FAQPage";
import EventsPage from "../pages/EventsPage";
import ProfilePage from "../pages/ProfilePage";
import ErrorPage from "../pages/ErrorPage";
import ProtectedRoute from "./ProtectedRoute";
import ShopCreatePage from "../pages/shop/ShopCreate";
import ActivationShop from "../pages/shop/Activationshop";
import ShopHomePage from "../pages/shop/ShopHomePage";
import SellerProtectedRoute from "./SellerProtectedRoute";
import ShopDashboardPage from "../pages/shop/ShopDashboardPage";
import DashboardHero from "../componant/Shop/DashboardHero";
import AllOrders from "../componant/Shop/AllOrders";
import ShopPreviewPage from "../pages/shop/EditShopPage";
import CreateProduct from "../componant/Shop/CreateProduct";
import CreateBrand from "../componant/Shop/createBrand";
import ShopLoginPage from "../pages/shop/ShopLoginPage";
import CreateCategory from "../componant/Shop/CreateCategory";
import CreateSubCategory from "../componant/Shop/CreateSubCategory ";
import AllProducts from "../componant/Shop/AllProducts";
import EditShopPage from "../pages/shop/EditShopPage";
import CreateEvent from "../componant/Shop/CreateEvent";
import AllEvents from "../componant/Shop/AllEvents";
import AdminProtectedRoute from "./AdminProtectedRoute";
import AdminDashboardPage from "../pages/Admin/AdminDashboardPage";
import CreateCoupon from "../componant/Admin/CreateCoupone";
import AllCoupons from "../pages/Admin/AllCoupons";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },

      {
        path: "sign-up",
        element: <SignupPage />,
      },
      {
        path: "activation/:token",
        element: <ActivationPage />,
      },
      {
        path: "activation/seller/:token",
        element: <ActivationShop />,
      },

      {
        path: "products",
        element: <ProductsPage />,
      },

      {
        path: "product/:id",
        element: <ProductDetailsPage />,
      },

      {
        path: "best-selling",
        element: <BestSellingPage />,
      },
      {
        path: "events",
        element: <EventsPage />,
      },
      {
        path: "faq",
        element: <FAQPage />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "shop-create",
        element: <ShopCreatePage />,
      },
      {
        path: "shop-login",
        element: <ShopLoginPage />,
      },
      {
        path: "shop/:id",
        element: (
          <SellerProtectedRoute>
            <ShopHomePage />
          </SellerProtectedRoute>
        ),
      },
      // {
      //   path: "/shop/preview/:id",
      //   element: <ShopPreviewPage />,
      // },
      {
        path: "shop/:id/setting",
        element: <EditShopPage />,
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <SellerProtectedRoute>
        <ShopDashboardPage />
      </SellerProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
        {
            path: "",
            element: <DashboardHero />,
          },
        {
            path: "dashboard-orders",
            element: <AllOrders />,
          },
          { path: "products", element: <AllProducts/> },
          { path: "create-product", element: <CreateProduct/> },
          { path: "create-brand", element: <CreateBrand/> },
          { path: "create-category", element: <CreateCategory/> },
          { path: "create-subcategory", element: <CreateSubCategory/> },
          { path: "events", element: <AllEvents/> },
          { path: "create-event", element: <CreateEvent/> },
          { path: "withdraw", element: <div>Withdraw Money</div> },
          { path: "messages", element: <div>Shop Inbox</div> },
          { path: "coupons", element: <div>Discount Codes</div> },
          { path: "refunds", element: <div>Refunds</div> },
          { path: "settings", element: <div>Settings</div> },

    ]
  },
  {
    path: "admin-dashboard",
    element: (
      <AdminProtectedRoute>
        <AdminDashboardPage />
      </AdminProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [

          { path: "All-Coupons", element:  <AllCoupons/>},
          { path: "create-coupone", element: <CreateCoupon/> },
          { path: "coupons", element: <div>Discount Codes</div> },
          { path: "refunds", element: <div>Refunds</div> },
          { path: "settings", element: <div>Settings</div> },

    ]
  },
]);

export default router;
