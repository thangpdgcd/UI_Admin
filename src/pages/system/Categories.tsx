import { useEffect, useState } from "react";
import { Table, Input, Button, Space, Modal, Form } from "antd";
import type { PaginationProps } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import { categoryApi } from "@/api/categoryApi";

interface CategoryRow {
  key: string;
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

const { Search } = Input;

export function Categories() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [form] = Form.useForm();

  const fetchCategories = async (
    pageParam = page,
    pageSizeParam = pageSize,
    searchParam = search
  ) => {
    try {
      setLoading(true);
      const res = await categoryApi.getCategories({
        page: pageParam,
        limit: pageSizeParam,
        search: searchParam || undefined,
      });

      // Backend wraps categories array in successResponse({ data: categories })
      const data = (res as { data?: unknown } & Record<string, unknown>).data || res;
      const list =
        (data as { data?: CategoryRow[] }).data ??
        (data as { results?: CategoryRow[] }).results ??
        (Array.isArray(data) ? data : []);

      setTotal(list.length);

      const mapped: CategoryRow[] = list.map((c: any) => ({
        key: c._id,
        id: c._id,
        name: c.name,
        description: c.description || "",
        createdAt: c.createdAt,
      }));
      setCategories(mapped);
    } catch {
      // handled globally
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(1, pageSize, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const current = pagination.current || 1;
    const size = pagination.pageSize || 10;
    setPage(current);
    setPageSize(size);
    fetchCategories(current, size, search);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    fetchCategories(1, pageSize, value);
  };

  const openCreateModal = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (row: CategoryRow) => {
    setEditing(row);
    form.setFieldsValue({ name: row.name, description: row.description });
    setModalOpen(true);
  };

  const handleDelete = async (row: CategoryRow) => {
    try {
      await categoryApi.deleteCategory(row.id);
      fetchCategories(page, pageSize, search);
    } catch {
      // handled globally
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await categoryApi.updateCategory(editing.id, values);
      } else {
        await categoryApi.createCategory(values);
      }
      setModalOpen(false);
      fetchCategories(page, pageSize, search);
    } catch {
      // validation or API errors
    }
  };

  const columns: ColumnsType<CategoryRow> = [
    {
      title: "Category Name",
      dataIndex: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      render: (value: string) => dayjs(value).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button size="small" onClick={() => openEditModal(record)}>
            Edit
          </Button>
          <Button
            size="small"
            danger
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
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
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">
            Manage product categories.
          </p>
        </div>
        <Space>
          <Search
            placeholder="Search by name"
            onSearch={handleSearch}
            allowClear
            style={{ maxWidth: 260 }}
          />
          <Button type="primary" onClick={openCreateModal}>
            New Category
          </Button>
        </Space>
      </div>

      <Table<CategoryRow>
        columns={columns}
        dataSource={categories}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="key"
      />

      <Modal
        title={editing ? "Edit Category" : "New Category"}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

