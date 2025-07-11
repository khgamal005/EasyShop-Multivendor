import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCoupon } from '../../redux/slices/couponeSlice';
import { toast } from 'react-toastify';

const CreateCoupon = () => {
  const [form, setForm] = useState({
    name: '',
    value: '',
    minAmount: '',
    maxAmount: '',
    expire: '',
  });

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.coupon);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: ['value', 'minAmount', 'maxAmount'].includes(name)
        ? Number(value)
        : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createCoupon(form))
      .unwrap()
      .then(() => {
        toast.success('Coupon created successfully');
        setForm({
          // code: '',
          name: '',
          value: '',
          minAmount: '',
          maxAmount: '',
          expire: '',
        });
      })
      .catch((err) => {
        toast.error(err || 'Failed to create coupon');
      });
  };

  return (
    <div className="max-w-[600px] mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Create Coupon</h2>
      <form onSubmit={handleSubmit} className="space-y-4">


        {/* Name / Description */}
        <input
          type="text"
          name="name"
          placeholder="Coupon Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />

        {/* Percentage or Flat Value */}
        <input
          type="number"
          name="value"
          placeholder="Discount Value"
          value={form.value}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />

        {/* Min Amount */}
        <input
          type="number"
          name="minAmount"
          placeholder="Minimum Order Amount"
          value={form.minAmount}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />

        {/* Max Amount */}
        <input
          type="number"
          name="maxAmount"
          placeholder="Maximum Discount Limit"
          value={form.maxAmount}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />

        {/* Expiry Date */}
        <input
          type="date"
          name="expire"
          value={form.expire}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {loading ? 'Creating...' : 'Create Coupon'}
        </button>
      </form>
    </div>
  );
};

export default CreateCoupon;
