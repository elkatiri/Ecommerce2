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
  Image,
  FileInput,
  MultiSelect,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import AddProductModal from './addproduct';

export default function ProductTable() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const fetchProducts = () => {
    axios
      .get('http://127.0.0.1:8000/api/products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  };

  const fetchCategories = () => {
    axios
      .get('http://127.0.0.1:8000/api/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/products/${id}`);
      fetchProducts();
      notifications.show({
        title: '✅ Product Deleted',
        message: 'Product was deleted successfully.',
        color: 'red',
      });
    } catch {
      notifications.show({
        title: '❌ Delete Failed',
        message: 'Failed to delete product.',
        color: 'red',
      });
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
      <div className="table-title">
        <h2>📦 Products</h2>
        <button className="add-btn" onClick={() => setAddModalOpen(true)}>
          + Add Product
        </button>
      </div>

      <AddProductModal
        opened={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        categories={categories}
        onSuccess={fetchProducts}
      />

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
            <th>Colors dispo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const discount = parseFloat(p.discount || 0);
            const final = (parseFloat(p.price) - discount).toFixed(2);
            return (
              <tr key={p.id}>
                <td>#{p.id}</td>
                <td className="product-cell">
                  <div className="product-img-group">
                    {p.images.slice(0, 3).map((img, i) => (
                      <img
                        key={i}
                        src={`http://127.0.0.1:8000/storage/${img.image_path}`}
                        alt={`prod-${p.id}`}
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
                  {p.colors.length ? (
                    p.colors.map((c) => (
                      <Badge
                        key={c.id}
                        color={c.color}
                        variant="light"
                        style={{ marginRight: 4, textTransform: 'capitalize' }}
                      >
                        {c.color}
                      </Badge>
                    ))
                  ) : (
                    <span>—</span>
                  )}
                </td>
                <td className="action-buttons">
                  <Pencil
                    size={16}
                    className="edit"
                    onClick={() =>
                      setEditedProduct({
                        ...p,
                        category_id: p.category?.id || '',
                        colors: Array.isArray(p.colors)
                          ? p.colors.map((col) => col.color)
                          : [],
                        newImages: [],
                        imagesToDelete: [],
                      })
                    }
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

      {/* VIEW MODAL */}
      {/* VIEW MODAL */}
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
            selectedProduct.images.map((img, i) => (
              <img
                key={i}
                src={`http://127.0.0.1:8000/storage/${img.image_path}`}
                alt={`${selectedProduct.name}-${i}`}
                className="product-view-image"
              />
            ))
          ) : (
            <div className="no-image-placeholder">No images available</div>
          )}
        </div>
        <div className="product-view-info">
          <h2 className="product-view-name">{selectedProduct.name}</h2>
          <Badge size="lg" className="product-view-category">
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
        {[
          ['Product ID', `#${selectedProduct.id}`],
          ['Price', `$${parseFloat(selectedProduct.price).toFixed(2)}`],
          [
            'Discount',
            `$${parseFloat(selectedProduct.discount || 0).toFixed(2)}`,
          ],
          [
            'Final Price',
            `$${(
              parseFloat(selectedProduct.price) -
              parseFloat(selectedProduct.discount || 0)
            ).toFixed(2)}`,
          ],
          ['Stock Quantity', `${selectedProduct.quantity} units`],
          [
            'Created Date',
            new Date(selectedProduct.created_at).toLocaleDateString(),
          ],
          [
            'Last Updated',
            new Date(selectedProduct.updated_at).toLocaleDateString(),
          ],
        ].map(([label, value]) => (
          <div className="product-detail-item" key={label}>
            <div className="product-detail-label">{label}</div>
            <div className="product-detail-value">{value}</div>
          </div>
        ))}

        {/* ← NEW COLORS ROW ↓ */}
        {selectedProduct.colors && selectedProduct.colors.length > 0 && (
          <div className="product-detail-item">
            <div className="product-detail-label">Colors dispo</div>
            <div className="product-detail-value">
              {selectedProduct.colors.map((c) => (
                <Badge
                  key={c.id}
                  color={c.color}
                  variant="light"
                  style={{ marginRight: 6, textTransform: 'capitalize' }}
                >
                  {c.color}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )}
</Modal>


      {/* EDIT MODAL */}
      <Modal
        opened={!!editedProduct}
        onClose={() => setEditedProduct(null)}
        title={`Edit: ${editedProduct?.name || ''}`}
        size="xl"
      >
        {editedProduct && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const fd = new FormData();
                fd.append('_method', 'PUT');
                fd.append('name', editedProduct.name);
                fd.append('description', editedProduct.description || '');
                fd.append('price', editedProduct.price);
                fd.append('quantity', editedProduct.quantity);
                fd.append('discount', editedProduct.discount || 0);
                fd.append('category_id', editedProduct.category_id);

                // colors
                editedProduct.colors.forEach((col, i) =>
                  fd.append(`colors[${i}]`, col)
                );
                // new images
                editedProduct.newImages.forEach((file, i) =>
                  fd.append(`images[${i}]`, file)
                );
                // images to delete
                editedProduct.imagesToDelete.forEach((id, i) =>
                  fd.append(`images_to_delete[${i}]`, id)
                );

                await axios.post(
                  `http://127.0.0.1:8000/api/products/${editedProduct.id}`,
                  fd,
                  { headers: { 'Content-Type': 'multipart/form-data' } }
                );

                notifications.show({
                  title: '✅ Product Updated',
                  message: 'Product was updated successfully.',
                  color: 'teal',
                });
                setEditedProduct(null);
                fetchProducts();
              } catch (error) {
                notifications.show({
                  title: '❌ Update Failed',
                  message: error.response?.data?.message || 'An error occurred.',
                  color: 'red',
                });
              }
            }}
          >
            <Stack spacing="md">
              <Group grow>
                <TextInput
                  label="Product Name"
                  value={editedProduct.name}
                  onChange={(e) =>
                    setEditedProduct({ ...editedProduct, name: e.target.value })
                  }
                  required
                />
                <TextInput
                  label="Description"
                  value={editedProduct.description || ''}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      description: e.target.value,
                    })
                  }
                />
              </Group>

              <Group grow>
                <NumberInput
                  label="Price"
                  value={editedProduct.price}
                  onChange={(val) =>
                    setEditedProduct({ ...editedProduct, price: val })
                  }
                  precision={2}
                  min={0}
                  required
                />
                <NumberInput
                  label="Discount"
                  value={editedProduct.discount}
                  onChange={(val) =>
                    setEditedProduct({ ...editedProduct, discount: val })
                  }
                  precision={2}
                  min={0}
                />
              </Group>

              <Group grow>
                <NumberInput
                  label="Quantity"
                  value={editedProduct.quantity}
                  onChange={(val) =>
                    setEditedProduct({ ...editedProduct, quantity: val })
                  }
                  min={0}
                  required
                />
                <Select
                  label="Category"
                  data={categories.map((cat) => ({
                    value: cat.id.toString(),
                    label: cat.name,
                  }))}
                  value={editedProduct.category_id.toString()}
                  onChange={(val) =>
                    setEditedProduct({
                      ...editedProduct,
                      category_id: parseInt(val, 10),
                    })
                  }
                  required
                />
              </Group>

              <MultiSelect
                label="Colors disponibles"
                placeholder="Pick or create colors"
                data={['red', 'green', 'blue', 'yellow', 'black', 'white']}
                creatable
                getCreateLabel={(query) => `+ Create ${query}`}
                onCreate={(query) => query}
                value={editedProduct.colors}
                onChange={(val) =>
                  setEditedProduct({ ...editedProduct, colors: val })
                }
              />

              {/* Image management */}
              <div className="image-management-section">
                <h3 className="image-section-title">
                  <ImageIcon size={20} /> Product Images
                </h3>

                {/* Current images */}
                {editedProduct.images && editedProduct.images.length > 0 && (
                  <div className="current-images-section">
                    <Text className="subsection-label">Current Images</Text>
                    <div className="current-images-grid">
                      {editedProduct.images.map((img, idx) => (
                        <div key={idx} className="current-image-item">
                          <img
                            src={`http://127.0.0.1:8000/storage/${img.image_path}`}
                            alt={`Product ${idx + 1}`}
                            className="current-image"
                          />
                          <button
                            type="button"
                            className="delete-image-btn"
                            onClick={() => {
                              const imagesToDelete =
                                editedProduct.imagesToDelete || [];
                              setEditedProduct({
                                ...editedProduct,
                                images: editedProduct.images.filter(
                                  (_, i) => i !== idx
                                ),
                                imagesToDelete: [
                                  ...imagesToDelete,
                                  img.id,
                                ],
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

                {/* New images upload */}
                <div className="new-images-section">
                  <Text className="subsection-label">Add New Images</Text>
                  <FileInput
                    label="Upload Images"
                    placeholder="Click to select images"
                    multiple
                    accept="image/*"
                    value={editedProduct.newImages || []}
                    onChange={(files) =>
                      setEditedProduct({
                        ...editedProduct,
                        newImages: files,
                      })
                    }
                  />

                  {editedProduct.newImages &&
                    editedProduct.newImages.length > 0 && (
                      <div className="new-images-preview">
                        <Text className="subsection-label">
                          New Images Preview
                        </Text>
                        <div className="new-images-grid">
                          {editedProduct.newImages.map((file, idx) => (
                            <div key={idx} className="new-image-item">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`New ${idx + 1}`}
                                className="new-image-preview"
                              />
                              <button
                                type="button"
                                className="remove-new-image-btn"
                                onClick={() =>
                                  setEditedProduct({
                                    ...editedProduct,
                                    newImages: editedProduct.newImages.filter(
                                      (_, i) => i !== idx
                                    ),
                                  })
                                }
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

              {/* Category creation */}
              <div className="category-creation-section">
                <TextInput
                  placeholder="New category name"
                  value={editedProduct.newCategory || ''}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      newCategory: e.target.value,
                    })
                  }
                  style={{ flex: 1 }}
                />
                <Button
                  onClick={async () => {
                    if (!editedProduct.newCategory?.trim()) return;
                    try {
                      const res = await axios.post(
                        'http://127.0.0.1:8000/api/categories',
                        { name: editedProduct.newCategory }
                      );
                      setCategories((prev) => [...prev, res.data]);
                      setEditedProduct({
                        ...editedProduct,
                        category_id: res.data.id,
                        newCategory: '',
                      });
                      notifications.show({
                        title: '✅ Category Added',
                        message: `Category "${res.data.name}" created.`,
                        color: 'teal',
                      });
                    } catch {
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

              <Button type="submit" mt="md" fullWidth color="orange">
                Update Product
              </Button>
            </Stack>
          </form>
        )}
      </Modal>
    </>
  );
}
