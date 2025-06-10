import React, { useState, useRef } from 'react';
import {
  Modal,
  Box,
  Text,
  TextInput,
  NumberInput,
  MultiSelect,
  Textarea,
  Button,
  Group,
  Stack,
  Select,
  ActionIcon,
  Image,
} from '@mantine/core';
import { X } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import '../styles/addproduct.css';

export default function AddProductModal({ opened, onClose, categories, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    category_id: '',
    price: null,
    quantity: null,
    discount: null,
    colors: [],
    description: '', // <-- use description instead of details
    images: [],
  });
  const fileInputRef = useRef(null);

  const handleChange = (field) => (value) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleFilesSelect = (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setForm((f) => ({ ...f, images: [...f.images, ...files] }));
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const removeImage = (idx) => {
    setForm((f) => {
      const imgs = [...f.images];
      imgs.splice(idx, 1);
      return { ...f, images: imgs };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.price === null || form.price === '' || isNaN(form.price)) {
      notifications.show({
        title: '❌ Validation Error',
        message: 'Price is required.',
        color: 'red',
      });
      return;
    }
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('category_id', form.category_id);
      fd.append('price', form.price);
      fd.append('quantity', form.quantity);
      fd.append('discount', form.discount || 0);
      fd.append('description', form.description); // <-- changed from details to description
      form.colors.forEach((c, i) => fd.append(`colors[${i}]`, c));
      form.images.forEach((file, i) => fd.append(`images[${i}]`, file));

      await axios.post('http://127.0.0.1:8000/api/products', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      notifications.show({
        title: '✅ Product Created',
        message: `"${form.name}" has been added.`,
        color: 'teal',
      });
      setForm({
        name: '',
        category_id: '',
        price: null,
        quantity: null,
        discount: null,
        colors: [],
        description: '', // <-- reset description
        images: [],
      });
      onSuccess();
      onClose();
    } catch (err) {
      notifications.show({
        title: '❌ Creation Failed',
        message: err.response?.data?.message || err.message,
        color: 'red',
      });
    }
  };

  return (
    <Modal
      className="add-product-modal"
      opened={opened}
      onClose={onClose}
      size="lg"
      title={
        <Group spacing="xs" align="center">
          <Box
            sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#FAA96C' }}
          />
          <Text size="sm" weight={500}>product info</Text>
        </Group>
      }
    >
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Stack spacing="sm">
          <Group grow>
            <TextInput
              required
              label="Product name"
              placeholder="ex. Birthday Offer"
              value={form.name}
              onChange={(e) => handleChange('name')(e.target.value)}
            />
            <Select
              required
              label="Category"
              placeholder="Choose category"
              data={categories.map(c => ({ value: c.id.toString(), label: c.name }))}
              value={form.category_id?.toString()}
              onChange={(val) => handleChange('category_id')(val)}
            />
            <NumberInput
              required
              label="Prix"
              placeholder="ex. 19.99"
              value={form.price}
              onChange={handleChange('price')}
              precision={2}
              min={0}
            />
          </Group>

          <Group grow>
            <NumberInput
              required
              label="Stock"
              placeholder="5,000"
              value={form.quantity}
              onChange={handleChange('quantity')}
            />
            <NumberInput
              label="Discount"
              placeholder="2,750"
              value={form.discount}
              onChange={handleChange('discount')}
            />
            <MultiSelect
              label="Colors disponibles"
              placeholder="red, green, blue"
              data={['red', 'green', 'blue', 'yellow', 'black', 'white']}
              searchable
              creatable
              getCreateLabel={(query) => `+ Create ${query}`}
              onCreate={(query) => query}
              value={form.colors}
              onChange={handleChange('colors')}
            />
          </Group>

          <Textarea
            label="Description"
            placeholder="Enter product description…"
            minRows={3}
            value={form.description}
            onChange={(e) => handleChange('description')(e.target.value)}
          />

          {/* Native multiple file input */}
          <Group direction="column" spacing="xs">
            <Text size="sm">Images</Text>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFilesSelect}
            />
          </Group>

          {/* Preview thumbnails */}
         {form.images.length > 0 && (
  <Group className="preview-grid">
    {form.images.map((file, idx) => (
      <Box className="preview-item" key={idx}>
        <Image src={URL.createObjectURL(file)} alt={file.name} fit="cover" />
        <ActionIcon
          size="xs"
          variant="filled"
          color="red"
          className="remove-btn"
          onClick={() => removeImage(idx)}
        >
          <X size={10} />
        </ActionIcon>
      </Box>
    ))}
  </Group>
)}

        </Stack>

        <Group position="right" mt="md">
          <Button variant="default" onClick={onClose}>Cancel</Button>
          <Button type="submit" color="orange">Save Product</Button>
        </Group>
      </form>
    </Modal>
  );
}
