// utils/imageHelpers.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PRODUCT_IMAGE_PATH = import.meta.env.VITE_PRODUCT_IMAGE_PATH;
const Shop_IMAGE_PATH = import.meta.env.VITE_Shop_IMAGE_PATH;
const user_IMAGE_PATH = import.meta.env.VITE_user_IMAGE_PATH;
const EVENT_IMAGE_PATH = import.meta.env.VITE_EVENT_IMAGE_PATH;
const Category_IMAGE_PATH = import.meta.env.VITE_Category_IMAGE_PATH;



export const getProductImageUrl = (img) => {
  if (!img) return "/images/image-placeholder.jpg"; // Fallback image for invalid values

  // If the image is a string, it could be a URL; return it directly
  if (typeof img === "string") {
    return `${API_BASE_URL}${PRODUCT_IMAGE_PATH}${img}`;
  }

  // If it's a File or Blob, create an Object URL
  if (img instanceof Blob || img instanceof File) {
    return URL.createObjectURL(img);
  }

  // Return a default fallback or null in case of an invalid type
  return "/images/image-placeholder.jpg"; // Fallback image
};
export const getCaategorymageUrl = (img) => {
  if (!img) return "/images/image-placeholder.jpg"; // Fallback image for invalid values

  // If the image is a string, it could be a URL; return it directly
  if (typeof img === "string") {
    return `${API_BASE_URL}${Category_IMAGE_PATH}${img}`;
  }

  // If it's a File or Blob, create an Object URL
  if (img instanceof Blob || img instanceof File) {
    return URL.createObjectURL(img);
  }

  // Return a default fallback or null in case of an invalid type
  return "/images/image-placeholder.jpg"; // Fallback image
};



export const getSellerImageUrl = (img) => {
  if (!img) return "/images/image-placeholder.jpg"; 


  if (typeof img === "string") {
    return `${API_BASE_URL}${Shop_IMAGE_PATH}${img}`;
  }
  if (img instanceof Blob || img instanceof File) {
    return URL.createObjectURL(img);
  }
  return "/images/image-placeholder.jpg"; // Fallback image
};

export const getUserImageUrl = (img) => {
  if (!img) return "/images/image-placeholder.jpg"; 


  if (typeof img === "string") {
    return `${API_BASE_URL}${user_IMAGE_PATH}${img}`;
  }
  if (img instanceof Blob || img instanceof File) {
    return URL.createObjectURL(img);
  }
  return "/images/image-placeholder.jpg"; // Fallback image
};
export const getEventImageUrl = (img) => {
  if (!img) return "/images/image-placeholder.jpg"; 


  if (typeof img === "string") {
    return `${API_BASE_URL}${EVENT_IMAGE_PATH}${img}`;
  }
  if (img instanceof Blob || img instanceof File) {
    return URL.createObjectURL(img);
  }
  return "/images/image-placeholder.jpg"; // Fallback image
};

