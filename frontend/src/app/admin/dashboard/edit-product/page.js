"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProduct } from "@/app/store/productsSlice";
import { fetchProductById } from "@/app/store/productByIdSlice";
import { fetchCategories } from "@/app/store/categorySlice";

const EditProduct = ({ productId, onBack }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const { data: categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    const loadProduct = async () => {
      try {
        await dispatch(fetchCategories()).unwrap();
        const result = await dispatch(fetchProductById(productId)).unwrap();

        const gallery = result.gallery_images || [];

        setProduct({ ...result, productGallery: gallery });
        setGalleryPreviews(gallery);
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) loadProduct();
  }, [productId, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGalleryFilesChange = (files) => {
    const updatedGallery = [...(product.gallery_images || [])];
    const previews = [...galleryPreviews];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatedGallery.push(reader.result);
        previews.push(reader.result);
        setProduct((prev) => ({
          ...prev,
          productGallery: updatedGallery,
        }));
        setGalleryPreviews(previews);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveGalleryImage = (indexToRemove) => {
    const updatedGallery = [...(product.productGallery || [])];
    const updatedPreviews = [...galleryPreviews];

    updatedGallery.splice(indexToRemove, 1);
    updatedPreviews.splice(indexToRemove, 1);

    setProduct((prev) => ({
      ...prev,
      productGallery: updatedGallery,
    }));
    setGalleryPreviews(updatedPreviews);
  };

  const handleUpdateProduct = async () => {
    try {
      await dispatch(
        updateProduct({ id: productId, updatedProduct: product })
      ).unwrap();
      alert("Product updated successfully!");
    } catch (err) {
      console.error("Update failed", err);
      alert("Update failed");
    }
  };

  if (loading || categoriesLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="text-center py-10 text-red-600">Product not found.</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <div className="mb-4">
        <button onClick={onBack} className="text-blue-600 hover:underline">
          ← Back to Product List
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4">Edit Product Details</h2>

      <table className="table-auto w-full text-left border">
        <tbody>
          <tr className="border-t">
            <td className="p-2 font-semibold">Name</td>
            <td className="p-2">
              <input
                type="text"
                name="name"
                value={product.name || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </td>
          </tr>

          <tr className="border-t">
            <td className="p-2 font-semibold">Description</td>
            <td className="p-2">
              <textarea
                name="description"
                value={product.description || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </td>
          </tr>

          <tr className="border-t">
            <td className="p-2 font-semibold">Price</td>
            <td className="p-2">
              <input
                type="number"
                name="price"
                value={product.price || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </td>
          </tr>

          <tr className="border-t">
            <td className="p-2 font-semibold">Stock</td>
            <td className="p-2">
              <input
                type="number"
                name="stock"
                value={product.stock || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </td>
          </tr>

          <tr className="border-t">
            <td className="p-2 font-semibold">Category</td>
            <td className="p-2">
              <select
                name="category"
                value={product.category || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </td>
          </tr>

          <tr className="border-t">
            <td className="p-2 font-semibold align-top">Product Image</td>
            <td className="p-2">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt="Main"
                  width={125}
                  height={125}
                  className="rounded border mb-2"
                />
              ) : (
                <div className="mb-2 text-gray-500">No image</div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setProduct((prev) => ({
                        ...prev,
                        image_url: reader.result,
                      }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="mb-2"
              />
            </td>
          </tr>

          <tr className="border-t">
            <td className="p-2 font-semibold align-top">Gallery Images</td>
            <td className="p-2">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files.length > 0) {
                    handleGalleryFilesChange(files);
                  }
                }}
                className="mb-4"
              />

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {galleryPreviews.map((img, i) =>
                  img ? (
                    <div key={i} className="relative w-[100px] h-[100px]">
                      <Image
                        src={img}
                        alt={`Gallery ${i + 1}`}
                        width={100}
                        height={100}
                        className="object-cover rounded border"
                      />
                      <button
                        onClick={() => handleRemoveGalleryImage(i)}
                        className="absolute top-[-8px] right-[-8px] bg-white-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-green-200"
                        title="Remove Image"
                      >
                        ✖
                      </button>
                    </div>
                  ) : null
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleUpdateProduct}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Update Product
        </button>
      </div>
    </div>
  );
};

export default EditProduct;
