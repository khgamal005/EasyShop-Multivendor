import React, { useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCouponessShop,
  deleteCoupon,
} from "../../redux/slices/couponeSlice";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Loader from "../../components/Layout/Loader";
import { toast } from "react-toastify";

const AllShopCoupone = () => {
  const dispatch = useDispatch();
  const { coupons, loading } = useSelector((state) => state.coupon);
    const { seller } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(getAllCouponessShop(seller._id));
  }, [dispatch]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this coupon?");
    if (confirm) {
      const action = await dispatch(deleteCoupon(id));
      if (deleteCoupon.fulfilled.match(action)) {
        toast.success("Coupon deleted successfully");
        dispatch(getAllCoupons()); // Refresh list
      } else {
        toast.error(action.payload || "Failed to delete coupon");
      }
    }
  };

  const columns = [
    { field: "id", headerName: "Coupon ID", minWidth: 180, flex: 1 },
    { field: "name", headerName: "Name", minWidth: 150, flex: 1.2 },
    { field: "value", headerName: "Discount (%)", minWidth: 130, flex: 0.7, type: "number" },
    { field: "minAmount", headerName: "Min Amount", minWidth: 120, flex: 0.7, type: "number" },
    { field: "maxAmount", headerName: "Max Amount", minWidth: 120, flex: 0.7, type: "number" },
    { field: "expire", headerName: "expire", minWidth: 120, flex: 0.7, type: "number" },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 100,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => handleDelete(params.id)}>
          <AiOutlineDelete size={20} />
        </Button>
      ),
    },
  ];

const rows = coupons
  ?.filter((coupon) => coupon.shopId) // only coupons tied to a shop
  .map((coupon) => ({
    id: coupon._id,
    name: coupon.name,
    value: coupon.value,
    minAmount: coupon.minAmount ?? 0,
    maxAmount: coupon.maxAmount ?? 0,
    expire: coupon.expire ?? 0,
  })) || [];

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <h2 className="text-lg font-semibold mb-4">All Coupons</h2>
<DataGrid
  rows={rows}
  getRowId={(row) => row.id || `${row.name}-${Math.random()}`}
  columns={columns}
  pageSize={10}
  disableSelectionOnClick
  autoHeight
/>

        </div>
      )}
    </>
  );
};

export default AllShopCoupone;