import { useEffect, useState } from "react";
import { Table, Input, Button, Space, Modal, Form, InputNumber, Select, Upload, Popconfirm } from "antd";
import type { PaginationProps } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { productApi } from "@/api/productApi";
import { categoryApi } from "@/api/categoryApi";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface ProductRow {
  key: string;
  id: string;
  name: string;
  categoryName: string;
  price: number;
  stock: number;
  imageUrl?: string;
  createdAt: string;
  raw: any;
}

const { Search } = Input;
const { Option } = Select;

export function Products() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [search, setSearch] = useState<string>("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getCategories({ limit: 100 });
      const data = (res as { data?: unknown } & Record<string, unknown>).data || res;
      const list =
        (data as { data?: any[] }).data ??
        (data as { results?: any[] }).results ??
        (Array.isArray(data) ? data : []);
      setCategories(
        list.map((c: any) => ({
          id: c._id,
          name: c.name,
        }))
      );
    } catch {
      // handled globally
    }
  };

  const fetchProducts = async (
    pageParam = page,
    pageSizeParam = pageSize,
    categoryParam = categoryFilter,
    searchParam = search
  ) => {
    try {
      setLoading(true);
      const res = await productApi.getProducts({
        page: pageParam,
        limit: pageSizeParam,
        search: searchParam || undefined,
        category: categoryParam,
      });

      // Backend wraps { products, total, page, limit } in successResponse
      const data = (res as { data?: unknown } & Record<string, unknown>).data || res;
      const payload =
        (data as { data?: unknown } & Record<string, unknown>).data || data;
      const list =
        (payload as { products?: any[] }).products ??
        (payload as { results?: any[] }).results ??
        (Array.isArray(payload) ? payload : []);

      const totalItems = (payload as { total?: number }).total ?? list.length ?? 0;
      setTotal(totalItems);

      const mapped: ProductRow[] = list.map((p: any) => ({
        key: p._id,
        id: p._id,
        name: p.name,
        categoryName: p.category?.name || "",
        price: p.price || 0,
        stock: p.stock || 0,
        imageUrl: p.image,
        createdAt: p.createdAt,
        raw: p,
      }));
      setProducts(mapped);
    } catch {
      // handled globally
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts(1, pageSize, categoryFilter, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const current = pagination.current || 1;
    const size = pagination.pageSize || 10;
    setPage(current);
    setPageSize(size);
    fetchProducts(current, size, categoryFilter, search);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    fetchProducts(1, pageSize, categoryFilter, value);
  };

  const handleCategoryFilterChange = (value?: string) => {
    setCategoryFilter(value);
    setPage(1);
    fetchProducts(1, pageSize, value, search);
  };

  const openCreateModal = () => {
    setEditing(null);
    form.resetFields();
    setFileList([]);
    setModalOpen(true);
  };

  const openEditModal = (row: ProductRow) => {
    setEditing(row);
    form.setFieldsValue({
      name: row.name,
      price: row.price,
      stock: row.stock,
      category: categories.find((c) => c.name === row.categoryName)?.id,
    });
    setFileList([]);
    setModalOpen(true);
  };

  const handleDelete = async (row: ProductRow) => {
    try {
      await productApi.deleteProduct(row.id);
      toast.success("Deleted successfully");
      fetchProducts(page, pageSize, categoryFilter, search);
    } catch {
      // handled globally
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append("title", values.name);
      formData.append("price", String(values.price));
      formData.append("quantity", String(values.stock));
      if (values.category) {
        formData.append("category", values.category);
      }
      if (fileList[0]?.originFileObj) {
        formData.append("imageCover", fileList[0].originFileObj);
      }

      if (editing) {
        await productApi.updateProduct(editing.id, formData);
        toast.success("Updated successfully");
      } else {
        await productApi.createProduct(formData);
        toast.success("Created successfully");
      }

      setModalOpen(false);
      fetchProducts(page, pageSize, categoryFilter, search);
    } catch {
      // validation or API errors
    }
  };

  const columns: ColumnsType<ProductRow> = [
    {
      title: t("products.image", { defaultValue: "Image" }),
      dataIndex: "imageUrl",
      render: (value?: string) =>
        value ? (
          <img
            src={value}
            alt="product"
            className="h-10 w-10 rounded-md object-cover"
          />
        ) : null,
    },
    {
      title: t("products.name", { defaultValue: "Product Name" }),
      dataIndex: "name",
    },
    {
      title: t("products.category", { defaultValue: "Category" }),
      dataIndex: "categoryName",
    },
    {
      title: t("products.price", { defaultValue: "Price" }),
      dataIndex: "price",
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: t("products.stock", { defaultValue: "Stock" }),
      dataIndex: "stock",
    },
    {
      title: t("common.createdAt", { defaultValue: "Created Date" }),
      dataIndex: "createdAt",
      render: (value: string) => dayjs(value).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: t("common.actions", { defaultValue: "Actions" }),
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button size="small" onClick={() => openEditModal(record)}>
            {t("common.edit", { defaultValue: "Edit" })}
          </Button>
          <Popconfirm
            title={t("common.confirmDeleteTitle", { defaultValue: "Delete this item?" })}
            description={t("common.confirmDeleteDesc", { defaultValue: "This action cannot be undone." })}
            okText={t("common.delete", { defaultValue: "Delete" })}
            cancelText={t("common.cancel", { defaultValue: "Cancel" })}
            onConfirm={() => handleDelete(record)}
          >
            <Button size="small" danger>
              {t("common.delete", { defaultValue: "Delete" })}
            </Button>
          </Popconfirm>
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
          <h2 className="text-2xl font-bold tracking-tight">
            {t("menu.products", { defaultValue: "Products" })}
          </h2>
          <p className="text-muted-foreground">
            {t("products.subtitle", { defaultValue: "Manage coffee products and menu items." })}
          </p>
        </div>
        <Space>
          <Search
            placeholder={t("products.searchPlaceholder", { defaultValue: "Search products" })}
            onSearch={handleSearch}
            allowClear
            style={{ maxWidth: 260 }}
          />
          <Select
            allowClear
            placeholder={t("products.filterCategory", { defaultValue: "Filter by category" })}
            style={{ minWidth: 180 }}
            value={categoryFilter}
            onChange={handleCategoryFilterChange}
          >
            {categories.map((c) => (
              <Option key={c.id} value={c.id}>
                {c.name}
              </Option>
            ))}
          </Select>
          <Button type="primary" onClick={openCreateModal}>
            {t("products.new", { defaultValue: "New Product" })}
          </Button>
        </Space>
      </div>

      <Table<ProductRow>
        columns={columns}
        dataSource={products}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="key"
      />

      <Modal
        title={
          editing
            ? t("products.editTitle", { defaultValue: "Edit Product" })
            : t("products.newTitle", { defaultValue: "New Product" })
        }
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        okText={t("common.save", { defaultValue: "Save" })}
        cancelText={t("common.cancel", { defaultValue: "Cancel" })}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label={t("products.name", { defaultValue: "Product Name" })}
            rules={[
              { required: true, message: t("products.nameRequired", { defaultValue: "Please enter a product name" }) },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label={t("products.price", { defaultValue: "Price" })}
            rules={[{ required: true, message: t("products.priceRequired", { defaultValue: "Please enter a price" }) }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="stock"
            label={t("products.stock", { defaultValue: "Stock" })}
            rules={[
              { required: true, message: t("products.stockRequired", { defaultValue: "Please enter stock quantity" }) },
            ]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="category" label={t("products.category", { defaultValue: "Category" })}>
            <Select allowClear placeholder={t("products.selectCategory", { defaultValue: "Select category" })}>
              {categories.map((c) => (
                <Option key={c.id} value={c.id}>
                  {c.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="image" label={t("products.image", { defaultValue: "Product Image" })}>
            <Upload
              fileList={fileList}
              beforeUpload={() => false}
              onChange={({ fileList: newList }) => setFileList(newList)}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>
                {t("products.selectImage", { defaultValue: "Select Image" })}
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

