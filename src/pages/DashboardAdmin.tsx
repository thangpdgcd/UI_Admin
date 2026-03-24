import { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Table, Skeleton } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { orderApi } from "@/api/orderApi";
import { productApi } from "@/api/productApi";
import { categoryApi } from "@/api/categoryApi";
import { useTranslation } from "react-i18next";

interface OrderRow {
  key: string;
  id: string;
  customer: string;
  totalPrice: number;
  status: string;
  date: string;
}

export function DashboardAdmin() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [ordersRes, productsRes, categoriesRes] = await Promise.all([
          orderApi.getOrders({ limit: 10 }),
          productApi.getProducts({ limit: 1 }),
          categoryApi.getCategories({ limit: 1 }),
        ]);

        const ordersData = ordersRes.data || ordersRes;
        const productsData = productsRes.data || productsRes;
        const categoriesData = categoriesRes.data || categoriesRes;

        const ordersList = ordersData.data || ordersData.results || [];
        const productsList = productsData.data || productsData.results || [];
        const categoriesList = categoriesData.data || categoriesData.results || [];

        setTotalOrders(ordersData.results ?? ordersList.length ?? 0);
        setTotalProducts(productsData.results ?? productsList.length ?? 0);
        setTotalCategories(categoriesData.results ?? categoriesList.length ?? 0);

        const revenue = ordersList.reduce(
          (sum: number, o: any) => sum + (o.totalOrderPrice || 0),
          0
        );
        setTotalRevenue(revenue);

        const mappedOrders: OrderRow[] = ordersList.slice(0, 5).map((o: any) => ({
          key: o._id,
          id: o._id,
          customer: o.user?.name || o.user?.email || "N/A",
          totalPrice: o.totalOrderPrice || 0,
          status: o.isDelivered
            ? t("orders.delivered", { defaultValue: "Delivered" })
            : o.isPaid
              ? t("orders.paid", { defaultValue: "Paid" })
              : t("orders.pending", { defaultValue: "Pending" }),
          date: o.createdAt,
        }));

        setOrders(mappedOrders);
      } catch (error) {
        // For now, swallow errors; they will be surfaced via notifications later.
        // console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns: ColumnsType<OrderRow> = [
    {
      title: t("orders.id", { defaultValue: "Order ID" }),
      dataIndex: "id",
      render: (value: string) => value.slice(-8),
    },
    {
      title: t("orders.customer", { defaultValue: "Customer" }),
      dataIndex: "customer",
    },
    {
      title: t("orders.totalPrice", { defaultValue: "Total Price" }),
      dataIndex: "totalPrice",
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: t("orders.status", { defaultValue: "Status" }),
      dataIndex: "status",
    },
    {
      title: t("orders.date", { defaultValue: "Date" }),
      dataIndex: "date",
      render: (value: string) => dayjs(value).format("YYYY-MM-DD HH:mm"),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton active paragraph={{ rows: 2 }} />
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t("dashboard.totalOrders", { defaultValue: "Total Orders" })}
              value={totalOrders}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t("dashboard.totalProducts", { defaultValue: "Total Products" })}
              value={totalProducts}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t("dashboard.totalCategories", { defaultValue: "Total Categories" })}
              value={totalCategories}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t("dashboard.totalRevenue", { defaultValue: "Total Revenue" })}
              value={totalRevenue}
              prefix="$"
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      <Card title={t("dashboard.ordersChart", { defaultValue: "Orders chart (placeholder)" })}>
        <p className="text-muted-foreground">
          {t("dashboard.ordersChartHint", {
            defaultValue: "Integrate a chart library here to visualize orders over time.",
          })}
        </p>
      </Card>

      <Card title={t("dashboard.recentOrders", { defaultValue: "Recent Orders" })}>
        <Table<OrderRow>
          columns={columns}
          dataSource={orders}
          pagination={false}
          rowKey="key"
        />
      </Card>
    </div>
  );
}

