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
import CreateProduct from "../componant/Shop/CreateProduct";
import CreateBrand from "../componant/Admin/createBrand";
import ShopLoginPage from "../pages/shop/ShopLoginPage";
import CreateCategory from "../componant/Shop/CreateCategory";
import CreateSubCategory from "../componant/Admin/CreateSubCategory ";
import AllProducts from "../componant/Shop/AllProducts";
import EditShopPage from "../pages/shop/EditShopPage";
import CreateEvent from "../componant/Shop/CreateEvent";
import AllEvents from "../componant/Shop/AllEvents";
import AdminProtectedRoute from "./AdminProtectedRoute";
import AdminDashboardPage from "../pages/Admin/AdminDashboardPage";
import CreateCoupon from "../componant/Admin/CreateCoupone";
import AllCoupons from "../pages/Admin/AllCoupons";
import Checkout from "../componant/Checkout/Checkout";
import OrderDetailsPage from "../pages/OrderDetailsPage";
import OrderSuccessPage from "../pages/OrderSuccessPage";
import PaymentPage from "../pages/PaymentPage";
import StripeWrapper from "./StripeWrapper";
import AllShopCoupone from "../pages/shop/AllShopCoupone";
import CreateSellerCoupone from "../componant/Shop/CreateSellerCoupone";
import AdminOrders from "../pages/Admin/AdminOrders";
import ShopAllOrders from "../componant/Shop/ShopAllOrders";
import OrderDetails from "../componant/Shop/OrderDetails";
import WithdrawMoney from "../componant/Shop/WithdrawMoney";
import AllRefundOrders from "../componant/Shop/AllRefundOrders";
import TrackOrder from "../componant/Profile/TrackOrder";
import ChangePassword from "../componant/Profile/ChangePassword";
import ForgetPassword from "../componant/Profile/ForgetPassword ";
import VerifyResetCode from "../componant/Profile/VerifyResetCode ";
import ResetPassword from "../componant/Profile/ResetPassword ";
import AllWithdraw from "../componant/Admin/AllWithdraw";
import UserOrders from "../componant/order/UserOrders";
import UserInbox from "../pages/UserInbox";
import ShopInboxPage from "../pages/shop/ShopInboxPage";
import PreviewShopPage from "../pages/PreviewShopPage";
import Categories from "../pages/Categories ";
import ShopResetPassword from "../componant/Shop/ShopResetPassword";
import ShopForgetPassword from "../componant/Shop/ShopForgetPassword";
import ShopVerifyResetCode from "../componant/Shop/ShopVerifyResetCode";

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
        path: "categories",
        element: <Categories />,
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
        path: "track-order",
        element: <TrackOrder />,
      },
      {
        path: "profile-change-password",
        element: <ChangePassword />,
      },
      {
        path: "ForgetPassword",
        element: <ForgetPassword />,
      },
      {
        path: "VerifyResetCode",
        element: <VerifyResetCode />,
      },
      {
        path: "ResetPassword",
        element: <ResetPassword />,
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
        path: "shop/preview/:id",
        element: <PreviewShopPage />,
      },
          {
        path: "shop/ForgetPassword",
        element: <ShopForgetPassword />,
      },
      {
        path: "shop/VerifyResetCode",
        element: <ShopVerifyResetCode />,
      },
      {
        path: "shop/ResetPassword",
        element: <ShopResetPassword />,
      },
      {
        path: "shop/:id",
        element: (
          <SellerProtectedRoute>
            <ShopHomePage />
          </SellerProtectedRoute>
        ),
      },
      {
        path: "payment",
        element: (
          <StripeWrapper>
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          </StripeWrapper>
        ),
      },

      {
        path: "shop/:id/setting",
        element: <EditShopPage />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "order/success",
        element: <OrderSuccessPage />,
      },
      {
        path: "user/order/:id",
        element: <OrderDetailsPage />,
      },
      {
        path: "AllOrders",
        element: <UserOrders />,
      },
      {
        path: "inbox",
        element: <UserInbox />,
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
        index: true,
        element: <ShopAllOrders />,
      },
      {
        path: "dashboard-orders",
        element: <ShopAllOrders />,
      },
      {
        path: "order/:id",
        element: <OrderDetails />,
      },
      { path: "products", element: <AllProducts /> },
      { path: "create-product", element: <CreateProduct /> },
      { path: "create-brand", element: <CreateBrand /> },
      { path: "create-category", element: <CreateCategory /> },
      { path: "create-subcategory", element: <CreateSubCategory /> },
      { path: "events", element: <AllEvents /> },
      { path: "create-event", element: <CreateEvent /> },
      { path: "all-seller-coupons", element: <AllShopCoupone /> },
      { path: "create-seller-coupone", element: <CreateSellerCoupone /> },
      { path: "withdraw", element: <WithdrawMoney /> },
      { path: "refunds", element: <AllRefundOrders /> },
      { path: "settings", element: <EditShopPage /> },
      { path: "inbox", element: <ShopInboxPage /> },
    ],
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
      { path: "All-Coupons", element: <AllCoupons /> },
      { path: "create-coupone", element: <CreateCoupon /> },
      { path: "dashboard-orders", element: <AdminOrders /> },
      { path: "create-brand", element: <CreateBrand /> },
      { path: "create-category", element: <CreateCategory /> },
      { path: "create-subcategory", element: <CreateSubCategory /> },
      { path: "events", element: <AllEvents /> },
      { path: "withdraw", element: <AllWithdraw /> },

      { path: "refunds", element: <div>Refunds</div> },
    ],
  },
]);

export default router;
