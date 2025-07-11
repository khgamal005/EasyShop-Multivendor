import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { AiOutlineDelete } from "react-icons/ai";
import { Button } from "@mui/material";
import { toast } from "react-toastify";

import { getEvents, deleteEvent } from "../../redux/slices/eventSlice"; // adjust paths
import Loader from "../Layout/Loader";

const AllEvents = () => {
  const { events, isLoading } = useSelector((state) => state.events);

  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(getEvents());
    
  }, [dispatch]);

  const handleDelete = async (id) => {
    const action = await dispatch(deleteEvent(id));
    if (deleteEvent.fulfilled.match(action)) {
      toast.success("Event deleted successfully");
      dispatch(getEvents());
    } else {
      toast.error(action.payload || "Failed to delete event");
    }
  };



  const columns = [
    { field: "id", headerName: "Event ID", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Name", minWidth: 180, flex: 1.4 },
    {
      field: "price",
      headerName: "Discount Price",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "sold",
      headerName: "Sold Out",
      type: "number",
      minWidth: 100,
      flex: 0.5,
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      sortable: false,
    
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => handleDelete(params.id)}>
          <AiOutlineDelete size={20} />
        </Button>
      ),
    },
  ];

  const rows = events?.map((event) => ({
    id: event._id,
    name: event.name,
    price: "US$ " + event.discountPrice,
    stock: event.stock,
    sold: event?.sold_out,
  }));

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid
            rows={rows}
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

export default AllEvents;
