import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/productstable.css';
import {
  Modal,
  Group,
  Badge,
  Button,
  ScrollArea,
  Text,
  Stack,
  Image,
  Avatar,
  Tooltip,
  Divider,
  Card,
  Select
} from '@mantine/core';
import { Eye, Trash2, User, Package, MapPin, Calendar, DollarSign } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import '../styles/orderstable.css';

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      notifications.show({ 
        title: 'Error', 
        message: 'Failed to fetch orders', 
        color: 'red' 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/orders/${orderId}`);
      notifications.show({ 
        title: 'Success', 
        message: 'Order deleted successfully', 
        color: 'green' 
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
      notifications.show({ 
        title: 'Error', 
        message: 'Failed to delete order', 
        color: 'red' 
      });
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  // Enhanced status configuration with colors and icons
  const statusConfig = {
    pending: {
      color: '#f59e0b',
      bgColor: '#fef3c7',
      textColor: '#92400e',
      label: 'Pending',
      icon: '⏳'
    },
    processing: {
      color: '#3b82f6',
      bgColor: '#dbeafe',
      textColor: '#1e40af',
      label: 'Processing',
      icon: '⚙️'
    },
    shipped: {
      color: '#8b5cf6',
      bgColor: '#e9d5ff',
      textColor: '#7c3aed',
      label: 'Shipped',
      icon: '🚚'
    },
    delivered: {
      color: '#10b981',
      bgColor: '#d1fae5',
      textColor: '#047857',
      label: 'Delivered',
      icon: '✅'
    },
    cancelled: {
      color: '#ef4444',
      bgColor: '#fee2e2',
      textColor: '#dc2626',
      label: 'Cancelled',
      icon: '❌'
    },
    completed: {
      color: '#059669',
      bgColor: '#ccfbf1',
      textColor: '#0d9488',
      label: 'Completed',
      icon: '🎉'
    }
  };

  // Helper to get status configuration
  const getStatusConfig = (status) => {
    return statusConfig[status] || {
      color: '#6b7280',
      bgColor: '#f3f4f6',
      textColor: '#374151',
      label: status,
      icon: '❓'
    };
  };

  // Helper to get Mantine color for status
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'yellow';
      case 'processing': return 'blue';
      case 'shipped': return 'violet';
      case 'delivered': return 'green';
      case 'cancelled': return 'red';
      case 'completed': return 'teal';
      default: return 'gray';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateAddress = (address, maxLength = 30) => {
    if (!address) return '—';
    return address.length > maxLength ? address.substring(0, maxLength) + '...' : address;
  };

  // Handle status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/orders/${orderId}/status`, {
        status: newStatus,
      });
      notifications.show({
        title: 'Status Updated',
        message: `Order status updated to "${newStatus}"`,
        color: 'teal',
      });
      fetchOrders();
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update order status',
        color: 'red',
      });
    }
  };

  // Custom item for Select dropdown
  const StatusSelectItem = React.forwardRef(({ value, label, ...others }, ref) => {
    const config = getStatusConfig(value);
    return (
      <div ref={ref} {...others} className="status-select-item">
        <Group spacing="xs">
          <span className="status-icon">{config.icon}</span>
          <Badge color={getStatusColor(value)} variant="filled" size="sm">
            {label}
          </Badge>
        </Group>
      </div>
    );
  });

  return (
    <div className="orders-table-wrapper">
      <div className="orders-table-header">
        <div className="header-content">
          <h2>
            <Package size={24} />
            Orders Management
          </h2>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{orders.length}</span>
              <span className="stat-label">Total Orders</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                ${orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0).toFixed(2)}
              </span>
              <span className="stat-label">Total Revenue</span>
            </div>
          </div>
        </div>
      </div>

      <div className="orders-table-content">
        <ScrollArea>
          <table className="orders-table">
            <thead>
              <tr>
                <th className="th-id">Order ID</th>
                <th className="th-customer">Customer</th>
                <th className="th-products">Products</th>
                <th className="th-quantity">Items</th>
                <th className="th-total">Total Amount</th>
                <th className="th-status">Status</th>
                <th className="th-date">Date</th>
                <th className="th-shipping">Shipping Address</th>
                <th className="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="table-loading">
                    <div className="loading-spinner"></div>
                    <span>Loading orders...</span>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="empty-state">
                    <Package size={48} />
                    <h3>No Orders Found</h3>
                    <p>Orders will appear here once customers start placing them.</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="order-row">
                    <td className="td-id">
                      <div className="order-id">
                        #{String(order.id).padStart(4, '0')}
                      </div>
                    </td>
                    <td className="td-customer">
                      <div className="customer-info">
                        <Avatar size="sm" color="blue" radius="xl">
                          <User size={16} />
                        </Avatar>
                        <div className="customer-details">
                          <div className="customer-name">
                            {order.user?.name || 'Unknown User'}
                          </div>
                          <div className="customer-id">
                            ID: {order.user_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="td-products">
                      <div className="products-preview">
                        <div className="product-images">
                          {order.products.slice(0, 3).map((product) => (
                            <Tooltip 
                              key={product.id} 
                              label={`${product.name} (Qty: ${product.pivot.quantity})`}
                            >
                              <div className="product-image-container">
                                <Image
                                  src={
                                    product.images && product.images.length > 0
                                      ? `http://127.0.0.1:8000/storage/${product.images[0].image_path}`
                                      : '/api/placeholder/36/36'
                                  }
                                  alt={product.name}
                                  width={36}
                                  height={36}
                                  radius="md"
                                  fallbackSrc="/api/placeholder/36/36"
                                />
                              </div>
                            </Tooltip>
                          ))}
                          {order.products.length > 3 && (
                            <div className="more-products">
                              +{order.products.length - 3}
                            </div>
                          )}
                        </div>
                        <div className="product-names">
                          {order.products.slice(0, 2).map((product, index) => (
                            <div key={product.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                              <Badge
                                variant="light"
                                size="xs"
                                className="product-badge"
                              >
                                {product.name}
                              </Badge>
                              {product.category && (
                                <Badge
                                  variant="outline"
                                  size="xs"
                                  color="gray"
                                  style={{ marginTop: 2 }}
                                >
                                  {product.category.name}
                                </Badge>
                              )}
                            </div>
                          ))}
                          {order.products.length > 2 && (
                            <Badge variant="outline" size="xs">
                              +{order.products.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="td-quantity">
                      <div className="quantity-info">
                        <span className="quantity-number">
                          {order.products.reduce((sum, p) => sum + p.pivot.quantity, 0)}
                        </span>
                        <span className="quantity-label">items</span>
                      </div>
                    </td>
                    <td className="td-total">
                      <div className="total-amount">
                        <DollarSign size={14} />
                        {parseFloat(order.total_price).toFixed(2)}
                      </div>
                    </td>
                    <td className="td-status">
                      <div className="status-cell">
                        <Select
                          data={[
                            { value: 'pending', label: 'Pending' },
                            { value: 'processing', label: 'Processing' },
                            { value: 'shipped', label: 'Shipped' },
                            { value: 'delivered', label: 'Delivered' },
                            { value: 'cancelled', label: 'Cancelled' },
                            { value: 'completed', label: 'Completed' },
                          ]}
                          value={order.status}
                          onChange={(val) => handleStatusUpdate(order.id, val)}
                          size="sm"
                          withinPortal
                          className="status-select-dropdown"
                          itemComponent={StatusSelectItem}
                          valueComponent={({ value }) => {
                            const config = getStatusConfig(value);
                            return (
                              <Group spacing="xs" className="status-value-display">
                                <span className="status-icon">{config.icon}</span>
                                <Badge color={getStatusColor(value)} variant="filled" size="sm">
                                  {config.label}
                                </Badge>
                              </Group>
                            );
                          }}
                          styles={{
                            input: { 
                              minWidth: 140,
                              border: 'none',
                              background: 'transparent',
                              padding: '4px 8px'
                            },
                            dropdown: {
                              border: '1px solid #e5e7eb',
                              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                            }
                          }}
                        />
                      </div>
                    </td>
                    <td className="td-date">
                      <div className="date-info">
                        <Calendar size={14} />
                        {formatDate(order.created_at)}
                      </div>
                    </td>
                    <td className="td-shipping">
                      <Tooltip label={order.shipping_address || 'No address provided'}>
                        <div className="shipping-address">
                          <MapPin size={14} />
                          {truncateAddress(order.shipping_address)}
                        </div>
                      </Tooltip>
                    </td>
                    <td className="td-actions">
                      <div className="action-buttons">
                        <Tooltip label="View Details">
                          <Button
                            variant="subtle"
                            size="xs"
                            onClick={() => openModal(order)}
                            className="action-btn view-btn"
                          >
                            <Eye size={16} />
                          </Button>
                        </Tooltip>
                        <Tooltip label="Delete Order">
                          <Button
                            variant="subtle"
                            size="xs"
                            color="red"
                            onClick={() => handleDelete(order.id)}
                            className="action-btn delete-btn"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </ScrollArea>
      </div>

      <Modal 
        opened={showModal} 
        onClose={closeModal} 
        title={`Order #${String(selectedOrder?.id || '').padStart(4, '0')}`}
        size="xl"
        className="order-detail-modal"
      >
        {selectedOrder && (
          <div className="order-detail-content">
            <div className="order-header">
              <Group position="apart" mb="lg">
                <div>
                  <Text size="lg" weight={600}>
                    Order #{String(selectedOrder.id).padStart(4, '0')}
                  </Text>
                  <Text size="sm" color="dimmed">
                    Placed on {formatDate(selectedOrder.created_at)}
                  </Text>
                </div>
                <div className="modal-status-section">
                  <Text size="sm" weight={500} mb={8}>Current Status:</Text>
                  <Badge color={getStatusColor(selectedOrder.status)} variant="filled" size="lg">
                    {getStatusConfig(selectedOrder.status).icon} {getStatusConfig(selectedOrder.status).label}
                  </Badge>
                </div>
              </Group>
            </div>

            <Divider mb="lg" />

            <div className="order-sections">
              <Card className="order-section" p="md" mb="md">
                <Group mb="sm">
                  <User size={18} />
                  <Text weight={500}>Customer Information</Text>
                </Group>
                <Text><strong>Name:</strong> {selectedOrder.user?.name || 'Unknown User'}</Text>
                <Text><strong>User ID:</strong> #{selectedOrder.user_id}</Text>
              </Card>

              <Card className="order-section" p="md" mb="md">
                <Group mb="sm">
                  <Package size={18} />
                  <Text weight={500}>Order Items</Text>
                </Group>
                <Stack spacing="sm">
                  {selectedOrder.products.map((product) => (
                    <div key={product.id} className="product-detail-item">
                      <Group>
                        <Image
                          src={
                            product.images && product.images.length > 0
                              ? `http://127.0.0.1:8000/storage/${product.images[0].image_path}`
                              : '/api/placeholder/60/60'
                          }
                          alt={product.name}
                          width={60}
                          height={60}
                          radius="md"
                          fallbackSrc="/api/placeholder/60/60"
                        />
                        <div className="product-info">
                          <Text weight={500}>{product.name}</Text>
                          {product.category && (
                            <Badge variant="light" size="xs" color="gray" mt={4}>
                              {product.category.name}
                            </Badge>
                          )}
                          <Group spacing="xs">
                            <Badge variant="outline" size="sm">
                              Qty: {product.pivot.quantity}
                            </Badge>
                            <Badge variant="outline" size="sm">
                              ${parseFloat(product.pivot.price).toFixed(2)} each
                            </Badge>
                            <Badge color="blue" size="sm">
                              Total: ${(product.pivot.quantity * parseFloat(product.pivot.price)).toFixed(2)}
                            </Badge>
                          </Group>
                        </div>
                      </Group>
                    </div>
                  ))}
                </Stack>
              </Card>

              <Card className="order-section" p="md" mb="md">
                <Group mb="sm">
                  <MapPin size={18} />
                  <Text weight={500}>Shipping Information</Text>
                </Group>
                <Text>{selectedOrder.shipping_address || 'No shipping address provided'}</Text>
              </Card>

              <Card className="order-section" p="md">
                <Group mb="sm">
                  <DollarSign size={18} />
                  <Text weight={500}>Order Summary</Text>
                </Group>
                <Group position="apart">
                  <Text size="lg" weight={600}>Total Amount:</Text>
                  <Text size="lg" weight={600} color="blue">
                    ${parseFloat(selectedOrder.total_price).toFixed(2)}
                  </Text>
                </Group>
              </Card>
            </div>

            <Group position="right" mt="lg">
              <Button variant="default" onClick={closeModal}>
                Close
              </Button>
            </Group>
          </div>
        )}
      </Modal>
    </div>
  );
}