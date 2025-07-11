import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { createEvent } from '../../redux/slices/eventSlice';
import { toast } from 'react-toastify';

const CreateEvent = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.events);

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    start_Date: '',
    Finish_Date: '',
    discountPrice: '',
    originalPrice: '',
    stock: '',
    tags: '',
  });

  const [images, setImages] = useState([]);

  const handleDrop = (acceptedFiles) => {
    setImages((prev) => [...prev, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: { 'image/*': [] },
    multiple: true,
    maxFiles: 7,
  });

  const handleDeleteProductImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    images.forEach((img) => formData.append('images', img));

    dispatch(createEvent(formData))
      .unwrap()
      .then(() => {
        toast.success('Event created successfully');
        setForm({
          name: '',
          description: '',
          category: '',
          start_Date: '',
          Finish_Date: '',
          discountPrice: '',
          originalPrice: '',
          stock: '',
          tags: '',
        });
        setImages([]);
      })
      .catch((err) => {
        toast.error(err || 'Failed to create event');
      });
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create Event</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          ['name', 'Event Name'],
          ['description', 'Description'],
          ['category', 'Category'],
          ['tags', 'Tags (comma separated)'],
          ['start_Date', 'Start Date'],
          ['Finish_Date', 'Finish Date'],
          ['discountPrice', 'Discount Price'],
          ['originalPrice', 'Original Price'],
          ['stock', 'Stock'],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="block mb-1 font-medium">{label}</label>
            <input
              type={
                key.includes('Date')
                  ? 'date'
                  : key.includes('Price') || key === 'stock'
                  ? 'number'
                  : 'text'
              }
              name={key}
              value={form[key]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required={key !== 'originalPrice' && key !== 'tags'}
            />
          </div>
        ))}

        {/* Image Upload */}
        <div>
          <label className="block mb-1 font-medium">Event Images</label>
          <div
            {...getRootProps()}
            className="border-dashed border-2 border-gray-400 p-4 rounded cursor-pointer text-center"
          >
            <input {...getInputProps()} />
            <p>Drag & drop images here, or click to select</p>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {images.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview-${index}`}
                  className="w-full h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteProductImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-sm hidden group-hover:block"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
