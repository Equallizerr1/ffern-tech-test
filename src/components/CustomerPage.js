import React, { useState } from "react";
import OrderDetailsModal from "./OrderDetailsModal";
import CustomerDetailsModal from "./CustomerDetailsModal";
import DataTable from "./DataTable";

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

const DEFAULT_COLUMNS = ["first_name", "last_name", "email", "user_uuid"];

export default function CustomerPage({
	users,
	orders,
	ledgerMemberships,
	orderLineItems,
	selectedUser,
	setSelectedUser,
	selectedOrder,
	setSelectedOrder,
	search,
	setSearch,
}) {
	const [showSettings, setShowSettings] = useState(false);
	const [visibleColumns, setVisibleColumns] = useState(DEFAULT_COLUMNS);
	const [sortKey, setSortKey] = useState(null);
	const [sortDirection, setSortDirection] = useState("asc");

	const filteredUsers = users.filter(
		(user) =>
			user.email?.toLowerCase().includes(search.toLowerCase()) ||
			user.first_name?.toLowerCase().includes(search.toLowerCase()) ||
			user.last_name?.toLowerCase().includes(search.toLowerCase()) ||
			user.user_uuid?.toLowerCase().includes(search.toLowerCase())
	);

	const sortedUsers = React.useMemo(() => {
		if (!sortKey) return filteredUsers;
		const sorted = [...filteredUsers].sort((a, b) => {
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
	}, [filteredUsers, sortKey, sortDirection]);

	const handleColumnToggle = (key) => {
		setVisibleColumns((cols) =>
			cols.includes(key) ? cols.filter((col) => col !== key) : [...cols, key]
		);
	};

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
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}>
				<button
					style={{
						border: "2px solid #222",
						borderRadius: 4,
						padding: "4px 12px",
						background: "#fff",
						color: "#222",
						cursor: "pointer",
						outline: "2px solid #222",
						fontWeight: "bold",
						marginLeft: 8,
					}}
					onClick={() => setShowSettings(true)}>
					Settings
				</button>
			</div>

			{/* Settings Modal */}
			{showSettings && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100vw",
						height: "100vh",
						background: "rgba(0,0,0,0.3)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 1000,
					}}>
					<div
						style={{
							background: "#fff",
							color: "#222",
							padding: 24,
							borderRadius: 8,
							minWidth: 320,
							maxWidth: "90vw",
							boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
							position: "relative",
						}}>
						<h3 style={{ fontWeight: "bold" }}>Choose columns to display</h3>
						{ALL_COLUMNS.map((col) => (
							<div key={col.key}>
								<label>
									<input
										type="checkbox"
										checked={visibleColumns.includes(col.key)}
										onChange={() => handleColumnToggle(col.key)}
									/>
									{col.label}
								</label>
							</div>
						))}
						<div style={{ display: "flex", gap: 8, marginTop: 16 }}>
							<button
								style={{
									border: "2px solid #222",
									borderRadius: 4,
									padding: "4px 12px",
									background: "#fff",
									color: "#222",
									cursor: "pointer",
									outline: "2px solid #222",
									fontWeight: "bold",
								}}
								onClick={() => setVisibleColumns([])}>
								Clear All
							</button>
							<button
								style={{
									border: "2px solid #222",
									borderRadius: 4,
									padding: "4px 12px",
									background: "#fff",
									color: "#222",
									cursor: "pointer",
									outline: "2px solid #222",
									fontWeight: "bold",
								}}
								onClick={() => setVisibleColumns(DEFAULT_COLUMNS)}>
								Reset to Default
							</button>
							<button
								style={{
									border: "2px solid #222",
									borderRadius: 4,
									padding: "4px 12px",
									background: "#fff",
									color: "#222",
									cursor: "pointer",
									outline: "2px solid #222",
									fontWeight: "bold",
								}}
								onClick={() => setShowSettings(false)}>
								Close
							</button>
						</div>
					</div>
				</div>
			)}

			<DataTable
				data={sortedUsers}
				columns={ALL_COLUMNS}
				visibleColumns={visibleColumns}
				sortKey={sortKey}
				sortDirection={sortDirection}
				onSort={handleSort}
				onRowClick={setSelectedUser}
				selectedRow={selectedUser}
			/>

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
