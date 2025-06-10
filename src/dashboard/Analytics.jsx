import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  Paper,
  Title,
  Grid,
  Card,
  Text,
  Group,
  Badge,
  ThemeIcon,
  Progress,
} from '@mantine/core';
import { BarChart, Sparkline, DonutChart } from '@mantine/charts';
import {
  PackageCheck,
  PackageX,
  TrendingUp,
  TrendingDown,
  Truck,
  DollarSign,
  Calendar as CalendarIcon,
  Star,
  PieChart,
} from 'lucide-react';
import '../styles/chartAnalytics.css';

// ---------------------------------------
// Sparkline + Custom Tooltip Component
// ---------------------------------------
const RevenueSparklineChart = ({ data, monthLabels, orders }) => {
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: null });
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const index = Math.round((x / rect.width) * (data.length - 1));
    if (index >= 0 && index < data.length) {
      const month = monthLabels[index];
      const revenue = data[index];
      const monthOrders = orders.filter(o => new Date(o.created_at).getMonth() === index);
      const deliveredCount = monthOrders.filter(o => ['completed','delivered'].includes(o.status)).length;
      const returnedCount  = monthOrders.filter(o => ['returned','cancelled'].includes(o.status)).length;
      setTooltip({ show: true, x: event.clientX, y: event.clientY - 10, content: { month, revenue, deliveredCount, returnedCount } });
      setHoveredIndex(index);
    }
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, x: 0, y: 0, content: null });
    setHoveredIndex(-1);
  };

  // Calculate min/max for Y axis ticks
  const minY = Math.min(...data);
  const maxY = Math.max(...data);
  const yTicks = [maxY, (minY + maxY) / 2, minY];

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Y-axis labels */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 20, width: 40, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 1 }}>
        {yTicks.map((tick, i) => (
          <span key={i} style={{ fontSize: 10, color: '#64748b' }}>
            ${tick.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
        ))}
      </div>
      {/* Chart */}
      <div 
        style={{ marginLeft: 40, cursor: 'crosshair', width: 'calc(100% - 40px)' }} 
        onMouseMove={handleMouseMove} 
        onMouseLeave={handleMouseLeave}
      >
        <Sparkline
          w="100%"
          h={120}
          data={data}
          curveType="monotone"
          color="pink"
          fillOpacity={0.47}
          strokeWidth={3}
        />
      </div>
      {/* X-axis labels - FIXED */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginLeft: 40, 
        width: 'calc(100% - 40px)', 
        marginTop: 4 
      }}>
        {monthLabels.map((month, idx) => (
          <span
            key={month}
            style={{
              fontSize: 10,
              color: '#64748b',
              flex: '1',
              textAlign: 'center',
              minWidth: '40px', // Added minimum width
              whiteSpace: 'nowrap'
            }}
          >
            {month}
          </span>
        ))}
      </div>
      {tooltip.show && tooltip.content && (
        <div style={{
          position: 'fixed',
          left: tooltip.x,
          top: tooltip.y,
          transform: 'translate(-50%, -100%)',
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 1000,
          minWidth: '140px'
        }}>
          <Text fw={600} size="sm" mb="xs">{tooltip.content.month}</Text>
          <Text size="xs" c="dimmed">Revenue</Text>
          <Text fw={700} c="pink" size="md">${tooltip.content.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          <Group spacing="xs" mt="xs">
            <Badge color="green" size="xs">Delivered</Badge>
            <Text size="xs">{tooltip.content.deliveredCount} orders</Text>
          </Group>
          <Group spacing="xs" mt="xs">
            <Badge color="red" size="xs">Returned</Badge>
            <Text size="xs">{tooltip.content.returnedCount} orders</Text>
          </Group>
        </div>
      )}
    </div>
  );
};

// Enhanced Custom tooltip for DonutChart - matches SparklineChart style and shows percentage
const DonutTooltip = ({ label, payload, categoryData }) => {
  if (!payload || !payload[0]) return null;

  const data = payload[0].payload;
  const total = categoryData && categoryData.length
    ? categoryData.reduce((sum, item) => sum + item.value, 0)
    : 1;

  return (
    <Paper 
      p="sm" 
      withBorder 
      shadow="md"
      style={{
        backgroundColor: 'white',
        minWidth: '160px',
        zIndex: 1000,
        borderRadius: '8px'
      }}
    >
      <Group spacing="xs" mb="xs" align="center">
        <div style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: data.color,
          border: '1px solid #e5e7eb',
          flexShrink: 0
        }} />
        <Text fw={600} size="sm">{data.name}</Text>
      </Group>
      <Text size="xs" c="dimmed" mb={4}>Units Ordered</Text>
      <Text fw={700} c="pink" size="md">{data.value.toLocaleString()} units</Text>
      <Text size="xs" c="dimmed" mt={4}>
        {total > 0 ? ((data.value / total) * 100).toFixed(1) : 0}%
      </Text>
    </Paper>
  );
};

// ---------------------------------------
// Main Analytics Component
// ---------------------------------------
export default function Analytics() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/orders')
      .then(res => setOrders(res.data))
      .catch(console.error);
  }, []);

  // KPI calculations
  const totalOrders    = orders.length;
  const totalDelivered = orders.filter(o => ['completed','delivered'].includes(o.status)).length;
  const totalReturned  = orders.filter(o => ['returned','cancelled'].includes(o.status)).length;
  const returnRate     = totalOrders ? ((totalReturned/totalOrders)*100).toFixed(1) : '0';

  // Month labels
  const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const {
    chartData,
    deliveredPeak,
    returnedPeak,
    revenueData,
    totalRevenue,
    topMonth,
    topMonthValue,
    topProducts,
    categoryData,
    topCategory,
  } = useMemo(() => {
    const dCount = monthLabels.reduce((acc,m)=>({ ...acc, [m]:0 }), {});
    const rCount = monthLabels.reduce((acc,m)=>({ ...acc, [m]:0 }), {});
    const rev    = monthLabels.reduce((acc,m)=>({ ...acc, [m]:0 }), {});

    orders.forEach(o => {
      const m = monthLabels[new Date(o.created_at).getMonth()];
      if (['completed','delivered'].includes(o.status)) {
        dCount[m]++;
        const orderRev = o.products.reduce((sum,p)=>sum + (parseFloat(p.pivot.price) * p.pivot.quantity), 0);
        rev[m] += orderRev;
      }
      if (['returned','cancelled'].includes(o.status)) {
        rCount[m]++;
      }
    });

    const chartArr = monthLabels.map(m => ({ month: m, Delivered: dCount[m], Returned: rCount[m] }));
    const revArr   = monthLabels.map(m => rev[m]);
    const totRev   = revArr.reduce((sum,v)=>sum+v, 0);
    const maxRev   = Math.max(...revArr);
    const idx      = revArr.findIndex(v=>v===maxRev);
    const topM     = idx >= 0 ? monthLabels[idx] : 'N/A';

    const maxD = Math.max(...monthLabels.map(m=>dCount[m]));
    const maxR = Math.max(...monthLabels.map(m=>rCount[m]));

    // Calculate top products by quantity ordered
    const productCounts = {};
    orders.forEach(order => {
      if (['completed', 'delivered'].includes(order.status)) {
        order.products.forEach(product => {
          const productId = product.id;
          const productName = product.name;
          const quantity = parseInt(product.pivot.quantity) || 0;
          
          if (!productCounts[productId]) {
            productCounts[productId] = {
              id: productId,
              name: productName,
              totalQuantity: 0
            };
          }
          productCounts[productId].totalQuantity += quantity;
        });
      }
    });

    // Get top 5 products and calculate percentages
    const sortedProducts = Object.values(productCounts)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5);

    const maxQuantity = sortedProducts.length > 0 ? sortedProducts[0].totalQuantity : 1;
    const topProductsWithPercent = sortedProducts.map(product => ({
      ...product,
      percentage: (product.totalQuantity / maxQuantity) * 100
    }));

    // Calculate category data for donut chart
    const categoryCounts = {};
    orders.forEach(order => {
      if (['completed', 'delivered'].includes(order.status)) {
        order.products.forEach(product => {
          const category = product.category?.name || 'Uncategorized';
          const quantity = parseInt(product.pivot.quantity) || 0;
          
          if (!categoryCounts[category]) {
            categoryCounts[category] = 0;
          }
          categoryCounts[category] += quantity;
        });
      }
    });

    // Convert to array format for DonutChart with colors
    const colors = ['#e11d48', '#0ea5e9', '#22c55e', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];
    const categoryArray = Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)
      .map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length]
      }));

    const topCat = categoryArray.length > 0 ? categoryArray[0] : { name: 'N/A', value: 0 };

    return {
      chartData: chartArr,
      deliveredPeak: { month: monthLabels.find(m=>dCount[m]===maxD) || 'N/A', count: maxD },
      returnedPeak:  { month: monthLabels.find(m=>rCount[m]===maxR) || 'N/A', count: maxR },
      revenueData: revArr,
      totalRevenue: totRev,
      topMonth: topM,
      topMonthValue: maxRev,
      topProducts: topProductsWithPercent,
      categoryData: categoryArray,
      topCategory: topCat,
    };
  }, [orders]);

  // Bar chart tooltip
  const CustomTooltip = ({ label, payload }) => {
    if (!payload?.length) return null;
    return (
      <Paper p="sm" withBorder shadow="sm">
        <Text fw={500} mb="xs">{label}</Text>
        {payload.map(e => (
          <Group key={e.name} position="apart" mb="xs">
            <Badge color={e.name==='Delivered' ? 'green' : 'red'} variant="light">{e.name}</Badge>
            <Text>{e.value} orders</Text>
          </Group>
        ))}
      </Paper>
    );
  };

  return (
    <div className="analytics-container">
      {/* ===== Header ===== */}
      <Paper p="md" shadow="sm" mb="lg">
        <Group mb="md">
          <ThemeIcon size="lg" radius="md" variant="light" color="blue">
            <Truck size={20} />
          </ThemeIcon>
          <Title order={3}>Orders Analytics</Title>
        </Group>
        <Grid columns={4} gutter="md">
          <Grid.Col span={1}>
            <Card withBorder p="xs" shadow="sm">
              <Group position="apart" mb="xs">
                <Text size="xs" c="dimmed">Total Orders</Text>
                <Truck size={16} color="#3b82f6" />
              </Group>
              <Text size="lg" fw={700}>{totalOrders}</Text>
              <Text size="xs" c="dimmed">All orders</Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={1}>
            <Card withBorder p="xs" shadow="sm">
              <Group position="apart" mb="xs">
                <Text size="xs" c="dimmed">Deliveries</Text>
                <PackageCheck size={16} color="#10b981" />
              </Group>
              <Text size="lg" fw={700}>{totalDelivered}</Text>
              <Text size="xs" c="dimmed">Delivered orders</Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={1}>
            <Card withBorder p="xs" shadow="sm">
              <Group position="apart" mb="xs">
                <Text size="xs" c="dimmed">Returns</Text>
                <PackageX size={16} color="#ef4444" />
              </Group>
              <Text size="lg" fw={700}>{totalReturned}</Text>
              <Text size="xs" c="dimmed">Returned/cancelled</Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={1}>
            <Card withBorder p="xs" shadow="sm">
              <Group position="apart" mb="xs">
                <Text size="xs" c="dimmed">Return Rate</Text>
                {returnRate > 10 ? <TrendingUp color="#ef4444" size={16}/> : <TrendingDown color="#10b981" size={16}/>} 
              </Group>
              <Text size="lg" fw={700} c={returnRate>10?'red':'green'}>{returnRate}%</Text>
              <Text size="xs" c="dimmed">of total</Text>
            </Card>
          </Grid.Col>
        </Grid>
      </Paper>

      {/* ===== Orders by Month ===== */}
      <div className="chart-container analytics-chart">
        <Title order={4} mb="md">Orders by Month</Title>
        <BarChart
          h={300}
          data={chartData}
          dataKey="month"
          series={[{ name:'Delivered',color:'#22c55e'},{name:'Returned',color:'#ef4444'}]}
          barSize={40}
          tooltipProps={{ shared:true, content:CustomTooltip }}
          yAxisProps={{ domain:[0,'dataMax'], stroke:'#E5E7EB' }}
          xAxisProps={{ stroke:'#E5E7EB' }}
          gridProps={{ vertical:false,horizontal:true,stroke:'#E5E7EB',opacity:0.5 }}
          withLegend={false}
          style={{
          overflow: 'visible',
          '--chart-cursor-fill': '#f1f5f9',
          '--chart-grid-color' : '#e2e8f0',
          '--chart-text-color' : '#64748b',
        }}
        />
      </div>

      {/* ===== Orders by Category ===== */}
      <Paper p="md" shadow="sm" mt="lg">
        <Group mb="md">
          <ThemeIcon size="lg" radius="md" variant="light" color="purple">
            <PieChart size={20} />
          </ThemeIcon>
          <Title order={4}>Orders by Category</Title>
        </Group>
        <Grid columns={2} gutter="md">
          <Grid.Col span={1}>
            <Card withBorder p="lg" shadow="sm">
              <Group position="apart" mb="xs">
                <Text size="lg" c="dimmed">Top Category</Text>
                <PieChart size={20} color="#8b5cf6" />
              </Group>
              <Text size="2xl" fw={700} c="purple">
                {topCategory.name}
              </Text>
              <Text size="xs" c="dimmed">
                {topCategory.value} units ordered
              </Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={1}>
            <Card withBorder p="lg" shadow="sm">
              <Group position="apart" mb="xs">
                <Text size="lg" c="dimmed">Categories</Text>
                <Badge color="purple" variant="light">
                  {categoryData.length}
                </Badge>
              </Group>
              <Text size="2xl" fw={700} c="blue">
                {categoryData.length} Categories
              </Text>
              <Text size="xs" c="dimmed">
                active product categories
              </Text>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Donut Chart with Enhanced Tooltip */}
        <div style={{ marginTop: '24px' }}>
          {categoryData.length > 0 ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'flex-start',
              width: '100%',
              height: '400px'
            }}>
              <DonutChart
                data={categoryData}
                withLabels={true}
                withTooltip={true}
                labelsType="percent" 
                tooltipDataSource="segment"
                size={300}
                thickness={50}
                strokeWidth={1}
                paddingAngle={2}
                mx="auto"
                style={{ 
                  width: 550, 
                  height: 500,
                  cursor: 'pointer'
                }}
                tooltipProps={{
                  content: (props) => <DonutTooltip {...props} categoryData={categoryData} />,
                  wrapperStyle: { zIndex: 1000 }
                }}
              />
            </div>
          ) : (
            <Card withBorder p="xl" shadow="sm" style={{ width: '100%', textAlign: 'center' }}>
              <Text c="dimmed">No category data available</Text>
            </Card>
          )}
        </div>

        {/* Category Legend */}
        {categoryData.length > 0 && (
          <div style={{ marginTop: '80px' }}>
            <Text size="sm" fw={500} mb="md">Category Breakdown:</Text>
            <Grid gutter="xs">
              {categoryData.map((category, index) => (
                <Grid.Col span={6} key={category.name}>
                  <Group spacing={8} style={{ justifyContent: 'flex-start' }}>
                    <div 
                      style={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        backgroundColor: category.color 
                      }} 
                    />
                    <Text size="sm" style={{ marginRight: 8 }}>
                      {category.name}
                    </Text>
                    <Text size="sm" fw={500} c="dimmed">
                      {category.value} units
                    </Text>
                  </Group>
                </Grid.Col>
              ))}
            </Grid>
          </div>
        )}
      </Paper>

      {/* ===== Revenue Analysis ===== */}
      <Paper p="md" shadow="sm" mt="lg">
        <Group mb="md">
          <ThemeIcon size="lg" radius="md" variant="light" color="green">
            <DollarSign size={20} />
          </ThemeIcon>
          <Title order={4}>Revenue Analysis</Title>
        </Group>
        <Grid columns={2} gutter="md">
          <Grid.Col span={1}>
            <Card withBorder p="lg" shadow="sm">
              <Group position="apart" mb="xs">
                <Text size="lg" c="dimmed">Total Revenue</Text>
                <DollarSign size={20} color="#16a34a" />
              </Group>
              <Text size="2xl" fw={700} c="green">
                ${totalRevenue.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
              </Text>
              <Text size="xs" c="dimmed">from delivered orders</Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={1}>
            <Card withBorder p="lg" shadow="sm">
              <Group position="apart" mb="xs">
                <Text size="lg" c="dimmed">Top Revenue Month</Text>
                <CalendarIcon size={20} color="#2563eb" />
              </Group>
              <Text size="2xl" fw={700} c="blue">
                {topMonth} – ${topMonthValue.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
              </Text>
              <Text size="xs" c="dimmed">highest monthly revenue</Text>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Sparkline Chart */}
        <div style={{ marginTop: '24px' }}>
          <RevenueSparklineChart data={revenueData} monthLabels={monthLabels} orders={orders} />
        </div>
      </Paper>

      {/* ===== Top Products ===== */}
      <Paper p="md" shadow="sm" mt="lg">
        <Group mb="md">
          <ThemeIcon size="lg" radius="md" variant="light" color="yellow">
            <Star size={20} />
          </ThemeIcon>
          <Title order={4}>Best Seller Products</Title>
        </Group>
        
        <Card withBorder p="lg" shadow="sm">
          <Group position="apart" mb="md">
            <Group spacing="xs">
              {[1,2,3,4].map(i => <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />)}
              <Star size={16} color="#fbbf24" />
            </Group>
            <Text size="lg" fw={700}>
              {topProducts.length > 0 ? (topProducts[0].totalQuantity / topProducts.reduce((sum, p) => sum + p.totalQuantity, 0) * 5).toFixed(1) : '0.0'} out of 5 star
            </Text>
          </Group>

          <div style={{ marginTop: '20px' }}>
            {topProducts.map((product, index) => {
              const progressConfig = [
                { color: 'green', label: 'Excellent' },
                { color: 'teal', label: 'Good' },
                { color: 'yellow', label: 'Average' },
                { color: 'orange', label: 'Avg-below' },
                { color: 'red', label: 'Poor' }
              ];
              
              const config = progressConfig[index] || progressConfig[4];
              
              return (
                <div key={product.id} style={{ marginBottom: '16px' }}>
                  <Group position="apart" mb="xs">
                    <Group spacing="xs">
                      <Text size="sm" fw={500} style={{ 
                        maxWidth: '180px', 
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis' 
                      }}>
                        {product.name}
                      </Text>
                      <Badge 
                        color={config.color} 
                        variant="light" 
                        size="xs"
                      >
                        {config.label}
                      </Badge>
                    </Group>
                    <Text size="xs" c="dimmed">
                      {product.totalQuantity} units
                    </Text>
                  </Group>
                  <Progress
                    value={product.percentage}
                    color={config.color}
                    size="md"
                    radius="sm"
                    striped={index === 0}
                    animated={index === 0}
                  />
                </div>
              );
            })}
            
            {topProducts.length === 0 && (
              <Text c="dimmed" ta="center" py="xl">
                No product data available
              </Text>
            )}
          </div>
        </Card>
      </Paper>
    </div>
  );
}