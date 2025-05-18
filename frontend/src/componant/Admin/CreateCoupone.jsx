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
    selectedProduct: '',
  });

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.coupon);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createCoupon(form))
          .unwrap()
          .then(() => {
            toast.success('coupon created successfully');
            setForm({
              name: '',
              value: '',
              minAmount: '',
              maxAmount: '',
              selectedProduct: '',
        
            });
          })
          .catch((err) => {
            toast.error(err || 'Failed to create event');
          });;
  };

  return (
    <div className="max-w-[600px] mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Create Coupon</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['name', 'value', 'minAmount', 'maxAmount', 'selectedProduct'].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field}
            value={form[field]}
            onChange={handleChange}
            required={field === 'name' || field === 'value'}
            className="w-full p-2 border border-gray-300 rounded"
          />
        ))}
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
