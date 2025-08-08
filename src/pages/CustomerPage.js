import React, { useState } from "react";
import OrderDetailsModal from "../components/OrderDetailsModal";
import CustomerDetailsModal from "../components/CustomerDetailsModal";
import DataTable from "../components/DataTable";
import SettingsModal from "../components/SettingsModal";

// Define all possible columns for the customers table
const ALL_COLUMNS = [
	{ key: "id", label: "ID" },
	{ key: "created_at", label: "Created At" },
	{ key: "updated_at", label: "Updated At" },
	{ key: "chargebee_id", label: "Chargebee ID" },
	{ key: "shopify_id", label: "Shopify ID" },
	{ key: "firebase_id", label: "Firebase ID" },
	{ key: "firestore_id", label: "Firestore ID" },
	{ key: "stripe_cus_id", label: "Stripe Customer ID" },
	{ key: "supabase_auth_id", label: "Supabase Auth ID" },
	{ key: "first_name", label: "First Name" },
	{ key: "last_name", label: "Last Name" },
	{ key: "user_uuid", label: "UUID" },
	{ key: "browser_timezone", label: "Browser Timezone" },
	{ key: "assigned_region", label: "Assigned Region" },
	{ key: "region", label: "Region" },
	{ key: "country_id", label: "Country ID" },
	{ key: "ip_address", label: "IP Address" },
	{ key: "email", label: "Email" },
	{ key: "phone", label: "Phone" },
	{ key: "is_active", label: "Active" },
	{ key: "discount_amount", label: "Discount Amount" },
	{ key: "discount_type", label: "Discount Type" },
	{ key: "is_employee", label: "Is Employee" },
	{ key: "anon_id", label: "Anon ID" },
];

// Default columns to show in the table
const DEFAULT_COLUMNS = ["first_name", "last_name", "email", "user_uuid"];

// Main Customers Page component
export default function CustomerPage({
	users = [],
	orders,
	ledgerMemberships,
	orderLineItems,
	selectedUser,
	setSelectedUser,
	selectedOrder,
	setSelectedOrder,
	search,
}) {
	const [showSettings, setShowSettings] = useState(false);
	const [visibleColumns, setVisibleColumns] = useState(DEFAULT_COLUMNS);
	const [sortKey, setSortKey] = useState(null);
	const [sortDirection, setSortDirection] = useState("asc");
	const [currentPage, setCurrentPage] = useState(1);
	const rowsPerPage = 20;

	// Filter users based on search input
	const filteredUsers = Array.isArray(users)
		? users.filter(
				(user) =>
					user.email?.toLowerCase().includes(search.toLowerCase()) ||
					user.first_name?.toLowerCase().includes(search.toLowerCase()) ||
					user.last_name?.toLowerCase().includes(search.toLowerCase()) ||
					user.user_uuid?.toLowerCase().includes(search.toLowerCase())
		  )
		: [];

	// Sort users by selected column and direction
	const sortedUsers = React.useMemo(() => {
		const filtered = users.filter(
			(user) =>
				user.email?.toLowerCase().includes(search.toLowerCase()) ||
				user.first_name?.toLowerCase().includes(search.toLowerCase()) ||
				user.last_name?.toLowerCase().includes(search.toLowerCase()) ||
				user.user_uuid?.toLowerCase().includes(search.toLowerCase())
		);
		if (!sortKey) return filtered;
		const sorted = [...filtered].sort((a, b) => {
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
	}, [users, search, sortKey, sortDirection]);

	// Toggle column visibility in settings modal
	const handleColumnToggle = (key) => {
		setVisibleColumns((cols) =>
			cols.includes(key) ? cols.filter((col) => col !== key) : [...cols, key]
		);
	};

	// Handle page change for pagination
	const handlePageChange = (page) => {
		const totalPages = Math.ceil(sortedUsers.length / rowsPerPage);
		if (page >= 1 && page <= totalPages) setCurrentPage(page);
	};

	// Reset to first page when search, sort, or filter changes
	React.useEffect(() => {
		setCurrentPage(1);
	}, [search, sortKey, sortDirection, visibleColumns]);

	// Handle sorting when a column header is clicked
	const handleSort = (key) => {
		if (sortKey === key) {
			setSortDirection((dir) => (dir === "asc" ? "desc" : "asc"));
		} else {
			setSortKey(key);
			setSortDirection("asc");
		}
	};

	return (
		<>
			{/* Page header */}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}>
				<h1 style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
					Customers Page
				</h1>
			</div>

			{/* Settings modal for choosing visible columns */}
			<SettingsModal
				open={showSettings}
				onClose={() => setShowSettings(false)}
				allColumns={ALL_COLUMNS}
				visibleColumns={visibleColumns}
				setVisibleColumns={setVisibleColumns}
				onColumnToggle={handleColumnToggle}
				onClearAll={() => setVisibleColumns([])}
				onResetDefault={() => setVisibleColumns(DEFAULT_COLUMNS)}
				defaultColumns={DEFAULT_COLUMNS}
			/>

			{/* Main data table */}
			<DataTable
				tableType="Customers"
				data={users}
				columns={ALL_COLUMNS}
				visibleColumns={visibleColumns}
				setVisibleColumns={setVisibleColumns}
				sortKey={sortKey}
				sortDirection={sortDirection}
				onSort={handleSort}
				onRowClick={setSelectedUser}
				selectedRow={selectedUser}
				currentPage={currentPage}
				rowsPerPage={rowsPerPage}
				onPageChange={handlePageChange}
				onShowSettings={() => setShowSettings(true)}
			/>

			{/* Modal for detailed customer info */}
			{selectedUser && (
				<CustomerDetailsModal
					user={selectedUser}
					orders={orders}
					ledgerMemberships={ledgerMemberships}
					setSelectedUser={setSelectedUser}
					setSelectedOrder={setSelectedOrder}
					orderLineItems={orderLineItems}
					onClose={() => setSelectedUser(null)}
				/>
			)}
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
