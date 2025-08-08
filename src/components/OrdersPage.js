import React, { useState } from "react";
import OrderDetailsModal from "./OrderDetailsModal";
import DataTable from "./DataTable";
import SettingsModal from "./SettingsModal";

// Define all possible columns for the orders table
const ALL_ORDER_COLUMNS = [
	{ key: "id", label: "Order ID" },
	{ key: "user_id", label: "User ID" },
	{ key: "customer_name", label: "Customer Name" },
	{ key: "created_at", label: "Created At" },
	{ key: "updated_at", label: "Updated At" },
	{ key: "chargebee_order_id", label: "Chargebee Order ID" },
	{
		key: "chargebee_order_processed_at",
		label: "Chargebee Order Processed At",
	},
	{ key: "shopify_order_id", label: "Shopify Order ID" },
	{ key: "shopify_order_number", label: "Shopify Order Number" },
	{ key: "shopify_order_name", label: "Shopify Order Name" },
	{ key: "shopify_order_created_at", label: "Shopify Order Created At" },
	{ key: "region", label: "Region" },
	{ key: "country_id", label: "Country ID" },
	{ key: "hold_fulfillment", label: "Hold Fulfillment" },
	{ key: "error_message", label: "Error Message" },
	{ key: "type", label: "Type" },
	{ key: "cancelled_at", label: "Cancelled At" },
	{ key: "resent_order_id", label: "Resent Order ID" },
	{ key: "chargebee_customer_id", label: "Chargebee Customer ID" },
	{ key: "exchanged_order_id", label: "Exchanged Order ID" },
	{ key: "billing_day_group", label: "Billing Day Group" },
	{ key: "fulfillment_held_at", label: "Fulfillment Held At" },
	{ key: "currency", label: "Currency" },
	{ key: "fulfillment_status", label: "Fulfillment Status" },
	{ key: "fulfilled_at", label: "Fulfilled At" },
	{ key: "delivery_status", label: "Delivery Status" },
	{ key: "delivered_at", label: "Delivered At" },
	{ key: "tracking_number", label: "Tracking Number" },
	{ key: "tracking_url", label: "Tracking URL" },
	{ key: "delivery_service", label: "Delivery Service" },
	{ key: "raw_status", label: "Raw Status" },
	{ key: "external_id", label: "External ID" },
	{ key: "is_processed", label: "Is Processed" },
	{ key: "processed_at", label: "Processed At" },
	{ key: "shipping_date", label: "Shipping Date" },
	{ key: "fulfillment_id", label: "Fulfillment ID" },
	{ key: "fulfillment_service", label: "Fulfillment Service" },
	{ key: "shipping_address_id", label: "Shipping Address ID" },
];

// Default columns to show in the table
const DEFAULT_ORDER_COLUMNS = [
	"id",
	"user_id",
	"customer_name",
	"created_at",
	"type",
	"fulfillment_status",
	"fulfilled_at",
	"delivery_status",
	"delivered_at",
	"tracking_number",
	"tracking_url",
	"delivery_service",
	"shipping_date",
	"fulfillment_id",
	"fulfillment_service",
];

// Main Orders Page component
export default function OrdersPage({
	orders,
	users,
	selectedOrder,
	setSelectedOrder,
	orderLineItems,
	search,
}) {
	const [showSettings, setShowSettings] = useState(false); // Show/hide settings modal
	const [visibleColumns, setVisibleColumns] = useState(DEFAULT_ORDER_COLUMNS); // Columns to display
	const [sortKey, setSortKey] = useState(null); // Current sort column
	const [sortDirection, setSortDirection] = useState("asc"); // Sort direction
	const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
	const rowsPerPage = 20; // Change this value for more/less rows per page

	// Filter orders based on search input and user info
	const filteredOrders = orders.filter((order) => {
		const user = users.find((u) => u.id === order.user_id);
		const userName = user ? `${user.first_name} ${user.last_name}` : "";
		return (
			order.id.toString().includes(search) ||
			order.fulfillment_status?.toLowerCase().includes(search.toLowerCase()) ||
			userName.toLowerCase().includes(search.toLowerCase())
		);
	});

	// Sort orders by selected column and direction
	const sortedOrders = React.useMemo(() => {
		if (!sortKey) return filteredOrders;
		const sorted = [...filteredOrders].sort((a, b) => {
			const aValue = a[sortKey] ?? "";
			const bValue = b[sortKey] ?? "";
			if (typeof aValue === "number" && typeof bValue === "number") {
				return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
			}
			return sortDirection === "asc"
				? String(aValue).localeCompare(String(bValue))
				: String(bValue).localeCompare(String(aValue));
		});
		return sorted;
	}, [filteredOrders, sortKey, sortDirection]);

	// Pagination logic
	const totalPages = Math.ceil(sortedOrders.length / rowsPerPage);

	// Toggle column visibility in settings modal
	const handleColumnToggle = (key) => {
		setVisibleColumns((cols) =>
			cols.includes(key) ? cols.filter((col) => col !== key) : [...cols, key]
		);
	};

	// Handle sorting when a column header is clicked
	const handleSort = (key) => {
		if (sortKey === key) {
			setSortDirection((dir) => (dir === "asc" ? "desc" : "asc"));
		} else {
			setSortKey(key);
			setSortDirection("asc");
		}
	};

	// Handle page change for pagination
	const handlePageChange = (page) => {
		if (page >= 1 && page <= totalPages) setCurrentPage(page);
	};

	// Reset to first page when search, sort, or filter changes
	React.useEffect(() => {
		setCurrentPage(1);
	}, [search, sortKey, sortDirection, visibleColumns]);

	// Add customer name to each order for display
	const ordersWithUser = sortedOrders.map((order) => {
		const user = users.find((u) => u.id === order.user_id);
		return {
			...order,
			customer_name: user
				? `${user.first_name} ${user.last_name}`
				: "Unknown User",
			user_id: order.user_id,
			// add any other user fields you want to display
		};
	});

	return (
		<>
			{/* Page header */}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}>
				<h1 style={{ fontWeight: "bold", fontSize: "1.5rem" }}>Orders Page</h1>
			</div>

			{/* Settings Modal for choosing visible columns */}
			<SettingsModal
				open={showSettings}
				onClose={() => setShowSettings(false)}
				allColumns={ALL_ORDER_COLUMNS}
				visibleColumns={visibleColumns}
				onColumnToggle={handleColumnToggle}
				onClearAll={() => setVisibleColumns([])}
				onResetDefault={() => setVisibleColumns(DEFAULT_ORDER_COLUMNS)}
				defaultColumns={DEFAULT_ORDER_COLUMNS}
			/>

			{/* Main data table and pagination */}
			<DataTable
				data={ordersWithUser}
				users={users}
				columns={ALL_ORDER_COLUMNS}
				visibleColumns={visibleColumns}
				setVisibleColumns={setVisibleColumns}
				sortKey={sortKey}
				sortDirection={sortDirection}
				onSort={handleSort}
				onRowClick={setSelectedOrder}
				selectedRow={selectedOrder}
				currentPage={currentPage}
				rowsPerPage={rowsPerPage}
				onPageChange={handlePageChange}
				onShowSettings={() => setShowSettings(true)}
				minTableWidth="1600px" // ensure horizontal scrollbar appears
			/>

			{/* Modal for detailed order info */}
			{selectedOrder && (
				<OrderDetailsModal
					order={selectedOrder}
					users={users}
					orderLineItems={orderLineItems}
					onClose={() => setSelectedOrder(null)}
				/>
			)}
		</>
	);
}
