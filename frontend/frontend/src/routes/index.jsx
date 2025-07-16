import { createBrowserRouter } from "react-router-dom";
import React, { lazy } from "react";
import App from "../App";
import ProtectedRoute from "./ProtectedRoute";
import SellerProtectedRoute from "./SellerProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";
import StripeWrapper from "./StripeWrapper";

// Lazy-loaded pages
const HomePage = lazy(() => import("../pages/HomePage"));
const SignupPage = lazy(() => import("../pages/SignupPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const ActivationPage = lazy(() => import("../pages/ActivationPage"));
const ActivationShop = lazy(() => import("../pages/shop/ActivationShop"));
const ProductsPage = lazy(() => import("../pages/ProductsPage"));
const ProductDetailsPage = lazy(() => import("../pages/ProductDetailsPage"));
const FAQPage = lazy(() => import("../pages/FAQPage"));
const EventsPage = lazy(() => import("../pages/EventsPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const ErrorPage = lazy(() => import("../pages/ErrorPage"));
const ShopCreatePage = lazy(() => import("../pages/shop/ShopCreate"));
const ShopHomePage = lazy(() => import("../pages/shop/ShopHomePage"));
const ShopDashboardPage = lazy(() => import("../pages/shop/ShopDashboardPage"));
const CreateProduct = lazy(() => import("../components/Shop/CreateProduct"));
const CreateBrand = lazy(() => import("../components/Admin/createBrand"));
const ShopLoginPage = lazy(() => import("../pages/shop/ShopLoginPage"));
const CreateCategory = lazy(() => import("../components/Shop/CreateCategory"));
const CreateSubCategory = lazy(() => import("../components/Admin/CreateSubCategory "));
const AllProducts = lazy(() => import("../components/Shop/AllProducts"));
const EditShopPage = lazy(() => import("../pages/shop/EditShopPage"));
const CreateEvent = lazy(() => import("../components/Shop/CreateEvent"));
const AllEvents = lazy(() => import("../components/Shop/AllEvents"));
const AdminDashboardPage = lazy(() => import("../pages/Admin/AdminDashboardPage"));
const CreateCoupon = lazy(() => import("../components/Admin/CreateCoupone"));
const AllCoupons = lazy(() => import("../pages/Admin/AllCoupons"));
const Checkout = lazy(() => import("../components/Checkout/Checkout"));
const OrderDetailsPage = lazy(() => import("../pages/OrderDetailsPage"));
const OrderSuccessPage = lazy(() => import("../pages/OrderSuccessPage"));
const PaymentPage = lazy(() => import("../pages/PaymentPage"));
const AllShopCoupone = lazy(() => import("../pages/shop/AllShopCoupone"));
const CreateSellerCoupone = lazy(() => import("../components/Shop/CreateSellerCoupone"));
const AdminOrders = lazy(() => import("../pages/Admin/AdminOrders"));
const ShopAllOrders = lazy(() => import("../components/Shop/ShopAllOrders"));
const OrderDetails = lazy(() => import("../components/Shop/OrderDetails"));
const WithdrawMoney = lazy(() => import("../components/Shop/WithdrawMoney"));
const AllRefundOrders = lazy(() => import("../components/Shop/AllRefundOrders"));
const TrackOrder = lazy(() => import("../components/Profile/TrackOrder"));
const ChangePassword = lazy(() => import("../components/Profile/ChangePassword"));
const ForgetPassword = lazy(() => import("../components/Profile/ForgetPassword"));
const VerifyResetCode = lazy(() => import("../components/Profile/VerifyResetCode"));
const ResetPassword = lazy(() => import("../components/Profile/ResetPassword "));
const AllWithdraw = lazy(() => import("../components/Admin/AllWithdraw"));
const UserOrders = lazy(() => import("../components/order/UserOrders"));
const UserInbox = lazy(() => import("../pages/UserInbox"));
const ShopInboxPage = lazy(() => import("../pages/shop/ShopInboxPage"));
const PreviewShopPage = lazy(() => import("../pages/PreviewShopPage"));
const Categories = lazy(() => import("../pages/Categories "));
const ShopForgetPassword = lazy(() => import("../components/Shop/ShopForgetPassword"));
const ShopResetPassword = lazy(() => import("../components/Shop/ShopResetPassword"));
const ShopVerifyResetCode = lazy(() => import("../components/Shop/ShopVerifyResetCode"));
const Coupons = lazy(() => import("../pages/Coupons"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "sign-up", element: <SignupPage /> },
      { path: "activation/:token", element: <ActivationPage /> },
      { path: "activation/seller/:token", element: <ActivationShop /> },
      { path: "products", element: <ProductsPage /> },
      { path: "categories", element: <Categories /> },
      { path: "product/:id", element: <ProductDetailsPage /> },
      { path: "Coupons", element: <Coupons /> },
      { path: "events", element: <EventsPage /> },
      { path: "faq", element: <FAQPage /> },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      { path: "track-order", element: <TrackOrder /> },
      { path: "profile-change-password", element: <ChangePassword /> },
      { path: "ForgetPassword", element: <ForgetPassword /> },
      { path: "VerifyResetCode", element: <VerifyResetCode /> },
      { path: "ResetPassword", element: <ResetPassword /> },
      { path: "shop-create", element: <ShopCreatePage /> },
      { path: "shop-login", element: <ShopLoginPage /> },
      { path: "shop/preview/:id", element: <PreviewShopPage /> },
      { path: "shop/ForgetPassword", element: <ShopForgetPassword /> },
      { path: "shop/VerifyResetCode", element: <ShopVerifyResetCode /> },
      { path: "shop/ResetPassword", element: <ShopResetPassword /> },
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
      { path: "shop/:id/setting", element: <EditShopPage /> },
      { path: "checkout", element: <Checkout /> },
      { path: "order/success", element: <OrderSuccessPage /> },
      { path: "user/order/:id", element: <OrderDetailsPage /> },
      { path: "AllOrders", element: <UserOrders /> },
      { path: "inbox", element: <UserInbox /> },
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
      { index: true, element: <ShopAllOrders /> },
      { path: "dashboard-orders", element: <ShopAllOrders /> },
      { path: "order/:id", element: <OrderDetails /> },
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
