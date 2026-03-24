import { useEffect, useState } from "react";
import { Table, Input, Tag, Button, Drawer, Space } from "antd";
import type { PaginationProps } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import { orderApi } from "@/api/orderApi";

interface BackendOrder {
  _id: string;
  user?: {
    name?: string;
    email?: string;
  };
  totalOrderPrice?: number;
  isPaid?: boolean;
  isDelivered?: boolean;
  createdAt?: string;
  // allow additional properties without using `any`
  [key: string]: unknown;
}

interface OrderRow {
  key: string;
  id: string;
  customer: string;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  date: string;
  raw: BackendOrder;
}

const { Search } = Input;

export function Orders() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fetchOrders = async (pageParam = page, pageSizeParam = pageSize) => {
    try {
      setLoading(true);
      const res = await orderApi.getOrders({
        page: pageParam,
        limit: pageSizeParam,
      });

      const data = (res as { data?: unknown } | { [key: string]: unknown }).data || res;
      // successResponse wraps { orders, total, page, limit } in data
      const payload = (data as { data?: unknown } & Record<string, unknown>).data || data;
      const list = (payload as { orders?: BackendOrder[]; data?: BackendOrder[]; results?: BackendOrder[] }).orders ||
        (payload as { data?: BackendOrder[] }).data ||
        (payload as { results?: BackendOrder[] }).results ||
        [];

      setTotal(payload.total ?? list.length ?? 0);

      const mapped: OrderRow[] = list.map((o: BackendOrder & { status?: string; totalAmount?: number }) => {
        const status = o.status as string | undefined;
        const isDelivered = status === "delivered";
        const isPaid =
          status && ["confirmed", "preparing", "delivered"].includes(status);

        return {
          key: o._id,
          id: o._id,
          customer: o.user?.name || o.user?.email || "N/A",
          totalPrice: o.totalOrderPrice ?? o.totalAmount ?? 0,
          isPaid: Boolean(isPaid),
          isDelivered: Boolean(isDelivered),
          date: o.createdAt || "",
          raw: o,
        };
      });
      setOrders(mapped);
    } catch {
      // Error notifications will be handled globally.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const current = pagination.current || 1;
    const size = pagination.pageSize || 10;
    setPage(current);
    setPageSize(size);
    fetchOrders(current, size);
  };

  const handleSearch = () => {
    // Placeholder for future search implementation
    setPage(1);
    fetchOrders(1, pageSize);
  };

  const handleView = (record: OrderRow) => {
    setSelectedOrder(record);
    setDetailsOpen(true);
  };

  const handleMarkPaid = async (record: OrderRow) => {
    try {
      await orderApi.markPaid(record.id);
      fetchOrders(page, pageSize);
    } catch {
      // handled globally
    }
  };

  const handleMarkDelivered = async (record: OrderRow) => {
    try {
      await orderApi.markDelivered(record.id);
      fetchOrders(page, pageSize);
    } catch {
      // handled globally
    }
  };

  const columns: ColumnsType<OrderRow> = [
    {
      title: "Order ID",
      dataIndex: "id",
      render: (value: string) => value.slice(-8),
    },
    {
      title: "Customer",
      dataIndex: "customer",
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: "Status",
      render: (_, record) => (
        <Space size="small">
          <Tag color={record.isPaid ? "green" : "orange"}>
            {record.isPaid ? "Paid" : "Unpaid"}
          </Tag>
          <Tag color={record.isDelivered ? "blue" : "default"}>
            {record.isDelivered ? "Delivered" : "Pending"}
          </Tag>
        </Space>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (value: string) => dayjs(value).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button size="small" onClick={() => handleView(record)}>
            View
          </Button>
          {!record.isPaid && (
            <Button size="small" type="primary" onClick={() => handleMarkPaid(record)}>
              Mark Paid
            </Button>
          )}
          {!record.isDelivered && (
            <Button size="small" onClick={() => handleMarkDelivered(record)}>
              Mark Delivered
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const pagination: PaginationProps = {
    current: page,
    pageSize,
    total,
    showSizeChanger: true,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">
            Manage and view all customer orders.
          </p>
        </div>
        <Search
          placeholder="Search by customer or ID"
          onSearch={handleSearch}
          allowClear
          style={{ maxWidth: 280 }}
        />
      </div>

      <Table<OrderRow>
        columns={columns}
        dataSource={orders}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="key"
      />

      <Drawer
        title="Order details"
        size="default"
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      >
        {selectedOrder && (
          <div className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">Order ID</div>
              <div className="font-mono text-sm">{selectedOrder.id}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Customer</div>
              <div>{selectedOrder.customer}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total price</div>
              <div>${selectedOrder.totalPrice.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Status</div>
              <Space size="small">
                <Tag color={selectedOrder.isPaid ? "green" : "orange"}>
                  {selectedOrder.isPaid ? "Paid" : "Unpaid"}
                </Tag>
                <Tag color={selectedOrder.isDelivered ? "blue" : "default"}>
                  {selectedOrder.isDelivered ? "Delivered" : "Pending"}
                </Tag>
              </Space>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Created at</div>
              <div>{dayjs(selectedOrder.date).format("YYYY-MM-DD HH:mm")}</div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

