import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/productstable.css';
import { Eye, Trash2, Pencil, X, Upload, Image as ImageIcon } from 'lucide-react';
import {
  Modal,
  TextInput,
  NumberInput,
  Select,
  Button,
  Badge,
  Group,
  Text,
  Stack,
  Grid,
  Card,
  Image,
  FileInput
} from '@mantine/core';
import { notifications } from '@mantine/notifications';

function ProductTable() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null);

  const fetchProducts = () => {
    axios.get('http://127.0.0.1:8000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  };

  const fetchCategories = () => {
    axios.get('http://127.0.0.1:8000/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/products/${id}`);
        fetchProducts();
        notifications.show({
          title: '✅ Product Deleted',
          message: 'Product was deleted successfully.',
          color: 'red'
        });
      } catch (error) {
        notifications.show({
          title: '❌ Delete Failed',
          message: 'Failed to delete product.',
          color: 'red'
        });
      }
    }
  };

  const handleShow = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseShow = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="table-wrapper">
        <div className="table-title">
          <h2>📦 Products</h2>
          <button className="add-btn">+ Add Product</button>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>#ID</th>
              <th>Product</th>
              <th>Stock</th>
              <th>Date</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Final Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const discount = parseFloat(p.discount || 0);
              const final = (parseFloat(p.price) - discount).toFixed(2);
              const status = p.status || 'Pending';

              return (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td className="product-cell">
                    <div className="product-img-group">
                      {p.images.slice(0, 3).map((img, index) => (
                        <img
                          key={index}
                          src={`http://127.0.0.1:8000/storage/${img.image_path}`}
                          alt={`product-${p.id}`}
                          className="product-img"
                        />
                      ))}
                      {p.images.length > 3 && (
                        <div className="image-count">+{p.images.length - 3}</div>
                      )}
                    </div>
                    <div>
                      <div className="name">{p.name}</div>
                      <div className="category">{p.category?.name || '—'}</div>
                    </div>
                  </td>
                  <td>{p.quantity}</td>
                  <td>{new Date(p.created_at).toLocaleDateString()}</td>
                  <td>${parseFloat(p.price).toFixed(2)}</td>
                  <td>${discount.toFixed(2)}</td>
                  <td>${final}</td>
                  <td>
                    <span className={`status ${status.toLowerCase()}`}>
                      {status}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <Pencil
                      size={16}
                      className="edit"
                      onClick={() => setEditedProduct({
                        ...p,
                        category_id: p.category?.id ?? '',
                        status: p.status || 'Pending',
                        newImages: [],
                        imagesToDelete: [],
                        newCategory: ''
                      })}
                    />
                    <Trash2
                      size={16}
                      className="delete"
                      onClick={() => handleDelete(p.id)}
                    />
                    <Eye
                      size={16}
                      className="view"
                      onClick={() => handleShow(p)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* VIEW/SHOW MODAL */}
      <Modal
        opened={showModal}
        onClose={handleCloseShow}
        title={`Product Details: ${selectedProduct?.name || ''}`}
        size="xl"
        className="product-view-modal"
      >
        {selectedProduct && (
          <div className="product-view-content">
            <div className="product-view-header">
              <div className="product-view-images">
                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  selectedProduct.images.map((img, index) => (
                    <img
                      key={index}
                      src={`http://127.0.0.1:8000/storage/${img.image_path}`}
                      alt={`${selectedProduct.name}-${index}`}
                      className="product-view-image"
                    />
                  ))
                ) : (
                  <div className="no-image-placeholder">No images available</div>
                )}
              </div>
              
              <div className="product-view-info">
                <h2 className="product-view-name">{selectedProduct.name}</h2>
                <Badge className="product-view-category" size="lg">
                  {selectedProduct.category?.name || 'No Category'}
                </Badge>
                {selectedProduct.description && (
                  <Text className="product-description" mt="md">
                    {selectedProduct.description}
                  </Text>
                )}
              </div>
            </div>

            <div className="product-view-details">
              <div className="product-detail-item">
                <div className="product-detail-label">Product ID</div>
                <div className="product-detail-value">#{selectedProduct.id}</div>
              </div>
              
              <div className="product-detail-item">
                <div className="product-detail-label">Price</div>
                <div className="product-detail-value">${parseFloat(selectedProduct.price).toFixed(2)}</div>
              </div>
              
              <div className="product-detail-item">
                <div className="product-detail-label">Discount</div>
                <div className="product-detail-value">${parseFloat(selectedProduct.discount || 0).toFixed(2)}</div>
              </div>
              
              <div className="product-detail-item">
                <div className="product-detail-label">Final Price</div>
                <div className="product-detail-value">
                  ${(parseFloat(selectedProduct.price) - parseFloat(selectedProduct.discount || 0)).toFixed(2)}
                </div>
              </div>
              
              <div className="product-detail-item">
                <div className="product-detail-label">Stock Quantity</div>
                <div className="product-detail-value">{selectedProduct.quantity} units</div>
              </div>
              
              <div className="product-detail-item">
                <div className="product-detail-label">Status</div>
                <div className="product-detail-value">
                  <span className={`status ${(selectedProduct.status || 'Pending').toLowerCase()}`}>
                    {selectedProduct.status || 'Pending'}
                  </span>
                </div>
              </div>
              
              <div className="product-detail-item">
                <div className="product-detail-label">Created Date</div>
                <div className="product-detail-value">
                  {new Date(selectedProduct.created_at).toLocaleDateString()}
                </div>
              </div>
              
              <div className="product-detail-item">
                <div className="product-detail-label">Last Updated</div>
                <div className="product-detail-value">
                  {new Date(selectedProduct.updated_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        opened={!!editedProduct}
        onClose={() => setEditedProduct(null)}
        title={`Edit: ${editedProduct?.name}`}
        size="xl"
      >
        {editedProduct && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const formData = new FormData();
                
                // Add basic product data
                formData.append('name', editedProduct.name);
                formData.append('description', editedProduct.description || "");
                formData.append('price', Number(editedProduct.price));
                formData.append('quantity', Number(editedProduct.quantity));
                formData.append('discount', Number(editedProduct.discount || 0));
                formData.append('discount_expires_at', '');
                formData.append('category_id', Number(editedProduct.category_id));
                formData.append('status', editedProduct.status || 'Pending');
                formData.append('_method', 'PUT');

                // Add new images
                if (editedProduct.newImages && editedProduct.newImages.length > 0) {
                  editedProduct.newImages.forEach((file, index) => {
                    formData.append(`images[${index}]`, file);
                  });
                }

                // Add images to delete
                if (editedProduct.imagesToDelete && editedProduct.imagesToDelete.length > 0) {
                  editedProduct.imagesToDelete.forEach((imageId, index) => {
                    formData.append(`delete_images[${index}]`, imageId);
                  });
                }

                await axios.post(`http://127.0.0.1:8000/api/products/${editedProduct.id}`, formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                });

                setEditedProduct(null);
                fetchProducts();

                notifications.show({
                  title: '✅ Product Updated',
                  message: 'Product was updated successfully.',
                  color: 'teal'
                });
              } catch (error) {
                notifications.show({
                  title: '❌ Update Failed',
                  message: error.response?.data?.message || 'An error occurred.',
                  color: 'red'
                });
              }
            }}
          >
            <div className="form-section">
              <TextInput
                label="Product Name"
                value={editedProduct.name}
                onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                required
              />

              <TextInput
                label="Description"
                value={editedProduct.description || ''}
                onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                placeholder="Enter product description"
              />
            </div>

            <div className="form-section">
              <NumberInput
                label="Price"
                value={editedProduct.price}
                onChange={(val) => setEditedProduct({ ...editedProduct, price: val })}
                required
                precision={2}
                min={0}
              />

              <NumberInput
                label="Discount"
                value={editedProduct.discount}
                onChange={(val) => setEditedProduct({ ...editedProduct, discount: val })}
                precision={2}
                min={0}
              />
            </div>

            <div className="form-section">
              <NumberInput
                label="Quantity"
                value={editedProduct.quantity}
                onChange={(val) => setEditedProduct({ ...editedProduct, quantity: val })}
                required
                min={0}
              />

              <Select
                label="Status"
                data={['Pending', 'Completed', 'Refund']}
                value={editedProduct.status}
                onChange={(val) => setEditedProduct({ ...editedProduct, status: val })}
                required
              />
            </div>

            <div className="form-section full-width">
              <Select
                label="Category"
                data={categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))}
                value={editedProduct.category_id?.toString()}
                onChange={(val) => setEditedProduct({ ...editedProduct, category_id: parseInt(val) })}
                required
              />
            </div>

            {/* IMAGE MANAGEMENT SECTION */}
            <div className="image-management-section full-width">
              <h3 className="image-section-title">
                <ImageIcon size={20} />
                Product Images
              </h3>
              
              {/* Current Images */}
              {editedProduct.images && editedProduct.images.length > 0 && (
                <div className="current-images-section">
                  <Text className="subsection-label">Current Images</Text>
                  <div className="current-images-grid">
                    {editedProduct.images.map((img, index) => (
                      <div key={index} className="current-image-item">
                        <img
                          src={`http://127.0.0.1:8000/storage/${img.image_path}`}
                          alt={`Product ${index + 1}`}
                          className="current-image"
                        />
                        <button
                          type="button"
                          className="delete-image-btn"
                          onClick={() => {
                            const imagesToDelete = editedProduct.imagesToDelete || [];
                            const updatedImagesToDelete = [...imagesToDelete, img.id];
                            const updatedImages = editedProduct.images.filter((_, i) => i !== index);
                            setEditedProduct({
                              ...editedProduct,
                              images: updatedImages,
                              imagesToDelete: updatedImagesToDelete
                            });
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images Upload */}
              <div className="new-images-section">
                <Text className="subsection-label">Add New Images</Text>
                <FileInput
                  label="Upload Images"
                  placeholder="Click to select images"
                  multiple
                  accept="image/*"
                  value={editedProduct.newImages || []}
                  onChange={(files) => setEditedProduct({ ...editedProduct, newImages: files })}
                  classNames={{
                    input: 'image-upload-input',
                    label: 'image-upload-label'
                  }}
                />
                
                {/* Preview New Images */}
                {editedProduct.newImages && editedProduct.newImages.length > 0 && (
                  <div className="new-images-preview">
                    <Text className="subsection-label">New Images Preview</Text>
                    <div className="new-images-grid">
                      {editedProduct.newImages.map((file, index) => (
                        <div key={index} className="new-image-item">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`New ${index + 1}`}
                            className="new-image-preview"
                          />
                          <button
                            type="button"
                            className="remove-new-image-btn"
                            onClick={() => {
                              const updatedNewImages = editedProduct.newImages.filter((_, i) => i !== index);
                              setEditedProduct({ ...editedProduct, newImages: updatedNewImages });
                            }}
                          >
                            <X size={14} />
                          </button>
                          <div className="image-name">{file.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="category-creation-section">
              <TextInput
                placeholder="New category name"
                value={editedProduct.newCategory || ''}
                onChange={(e) => setEditedProduct({ ...editedProduct, newCategory: e.target.value })}
                style={{ flex: 1 }}
              />
              <Button
                onClick={async () => {
                  if (!editedProduct.newCategory?.trim()) return;
                  try {
                    const res = await axios.post('http://127.0.0.1:8000/api/categories', {
                      name: editedProduct.newCategory,
                    });
                    const newCat = res.data;
                    setCategories((prev) => [...prev, newCat]);
                    setEditedProduct((prev) => ({
                      ...prev,
                      category_id: newCat.id,
                      newCategory: ''
                    }));
                    notifications.show({
                      title: '✅ Category Added',
                      message: `Category "${newCat.name}" created.`,
                      color: 'teal',
                    });
                  } catch (error) {
                    notifications.show({
                      title: '❌ Error',
                      message: 'Failed to create category.',
                      color: 'red',
                    });
                  }
                }}
              >
                ➕ Add
              </Button>
            </div>

            <Button type="submit" mt="md" fullWidth color="orange" className="form-section full-width">
              Update Product
            </Button>
          </form>
        )}
      </Modal>
    </>
  );
}

export default ProductTable;