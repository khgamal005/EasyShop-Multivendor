import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Layout/Loader";
import { getAllOrdersForAdmin } from "../../redux/slices/orderSlice";

const AdminOrders = () => {
  const dispatch = useDispatch();

  const { orders, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
     renderCell: (params) => (
  <span
    className={
      params.value === "Delivered"
        ? "text-green-600 font-semibold"
        : params.value === "Processing"
        ? "text-blue-600 font-semibold"
        : "text-red-600 font-semibold"
    }
  >
    {params.value}
  </span>
)
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "createdAt",
      headerName: "Order Date",
      minWidth: 130,
      flex: 0.8,
    },
  ];

  const rows = orders?.map((item) => ({
    id: item._id,
    itemsQty: item.cart?.reduce((acc, i) => acc + i.qty, 0),
    total: item.totalPrice + " $",
    status: item.status,
    createdAt: item.createdAt.slice(0, 10),
  })) || [];

  if (loading) return <Loader />;

  return (
    <div className="w-full flex">
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]"></div>
        <div className="w-full min-h-[45vh] pt-5 rounded flex justify-center">
          <div className="w-[97%] flex justify-center">
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={4}
              disableSelectionOnClick
              autoHeight
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;

