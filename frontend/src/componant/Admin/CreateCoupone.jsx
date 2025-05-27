import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCoupon } from '../../redux/slices/couponeSlice'; // adjust path as needed
import { toast } from 'react-toastify';

const CreateCoupon = () => {
  const [form, setForm] = useState({
    name: '',
    discount: '',
    expire: '',
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
        toast.success('Coupon created successfully');
        setForm({ name: '', discount: '', expire: '' });
      })
      .catch((err) => {
        toast.error(err || 'Failed to create coupon');
      });
  };

  return (
    <div className="max-w-[600px] mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Create Coupon</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Coupon Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />

        <input
          type="number"
          name="discount"
          placeholder="Discount Value (%)"
          value={form.discount}
          onChange={handleChange}
          required
          min="1"
          max="100"
          className="w-full p-2 border border-gray-300 rounded"
        />

        <input
          type="date"
          name="expire"
          placeholder="Expiry Date"
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
