import React, { useState } from "react";
import ReturnDetailsModal from "../components/ReturnDetailsModal";
import DataTable from "../components/DataTable";
import SettingsModal from "../components/SettingsModal";

// Define all possible columns for the returns table
const ALL_COLUMNS = [
	{ key: "id", label: "Return ID" },
	{ key: "order_id", label: "Order ID" },
	{ key: "created_at", label: "Created At" },
	{ key: "status", label: "Status" },
	{ key: "reason", label: "Reason" },
	{ key: "refund_amount", label: "Refund Amount" },
	{ key: "refund_status", label: "Refund Status" },
	{ key: "credit_issued", label: "Credit Issued" },
	{ key: "user_id", label: "User ID" },
	// Add more columns as needed
];

// Default columns to show in the table
const DEFAULT_COLUMNS = ["id", "order_id", "created_at", "status", "reason"];

export default function ReturnsPage({
	returns,
	reverseShipments,
	exchanges,
	exchangeLineItems,
	orderLineItems,
	selectedReturn,
	setSelectedReturn,
	search,
}) {
	const [showSettings, setShowSettings] = useState(false);
	const [visibleColumns, setVisibleColumns] = useState(DEFAULT_COLUMNS);
	const [sortKey, setSortKey] = useState(null);
	const [sortDirection, setSortDirection] = useState("asc");
	const [currentPage, setCurrentPage] = useState(1);
	const rowsPerPage = 20;

	// Filter returns based on search input
	const filteredReturns = returns.filter(
		(ret) =>
			String(ret.id).includes(search) ||
			String(ret.order_id).includes(search) ||
			(ret.reason && ret.reason.toLowerCase().includes(search.toLowerCase())) ||
			(ret.status && ret.status.toLowerCase().includes(search.toLowerCase()))
	);

	// Sort returns by selected column and direction
	const sortedReturns = React.useMemo(() => {
		if (!sortKey) return filteredReturns;
		const sorted = [...filteredReturns].sort((a, b) => {
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
	}, [filteredReturns, sortKey, sortDirection]);

	// Toggle column visibility in settings modal
	const handleColumnToggle = (key) => {
		setVisibleColumns((cols) =>
			cols.includes(key) ? cols.filter((col) => col !== key) : [...cols, key]
		);
	};

	// Handle page change for pagination
	const handlePageChange = (page) => {
		const totalPages = Math.ceil(sortedReturns.length / rowsPerPage);
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
				<h1 style={{ fontWeight: "bold", fontSize: "1.5rem" }}>Returns Page</h1>
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
				tableType="Returns"
				data={returns}
				columns={ALL_COLUMNS}
				visibleColumns={visibleColumns}
				setVisibleColumns={setVisibleColumns} // <-- Enable drag-and-drop column order
				sortKey={sortKey}
				sortDirection={sortDirection}
				onSort={handleSort}
				onRowClick={setSelectedReturn}
				selectedRow={selectedReturn}
				currentPage={currentPage}
				rowsPerPage={rowsPerPage}
				onPageChange={handlePageChange}
				onShowSettings={() => setShowSettings(true)}
			/>

			{/* Modal for detailed return info */}
			{selectedReturn && (
				<ReturnDetailsModal
					returnOrder={selectedReturn}
					reverseShipments={reverseShipments}
					exchanges={exchanges}
					exchangeLineItems={exchangeLineItems}
					orderLineItems={orderLineItems}
					onClose={() => setSelectedReturn(null)}
				/>
			)}
		</>
	);
}
