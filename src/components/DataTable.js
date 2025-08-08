import React from "react";
import SettingsButton from "./SettingsButton";

// Generic data table component with sorting, pagination, row selection, and settings
export default function DataTable({
	data,
	columns,
	visibleColumns,
	sortKey,
	sortDirection,
	onSort,
	onRowClick,
	selectedRow,
	currentPage = 1,
	rowsPerPage = 20,
	onPageChange,
	getRowKey = (row) => row.id,
	rowHighlight = (row) => selectedRow && selectedRow.id === row.id,
	onShowSettings, // <-- Add this prop to trigger settings modal
}) {
	const totalPages = Math.ceil(data.length / rowsPerPage);
	const paginatedData = data.slice(
		(currentPage - 1) * rowsPerPage,
		currentPage * rowsPerPage
	);

	return (
		<>
			{/* Table header row with settings button */}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginTop: 16,
				}}>
				<div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Table</div>
				{onShowSettings && <SettingsButton onClick={onShowSettings} />}
			</div>
			{/* Main table */}
			<table
				border="1"
				cellPadding="8"
				cellSpacing="0"
				style={{
					marginTop: 8,
					width: "100%",
					padding: "8px",
					boxSizing: "border-box",
					fontSize: "1rem",
					border: "2px solid #555",
					borderRadius: 8,
				}}>
				<thead>
					<tr>
						{columns
							.filter((col) => visibleColumns.includes(col.key))
							.map((col) => (
								<th
									key={col.key}
									style={{
										padding: "16px",
										textAlign: "left",
										cursor: onSort ? "pointer" : "default",
										userSelect: "none",
										background: sortKey === col.key ? "#222" : "transparent",
										color: "#fff",
									}}
									onClick={() => onSort && onSort(col.key)}>
									{col.label}
									{sortKey === col.key && (
										<span style={{ marginLeft: 4 }}>
											{sortDirection === "asc" ? "▲" : "▼"}
										</span>
									)}
								</th>
							))}
					</tr>
				</thead>
				<tbody>
					{paginatedData.map((row) => (
						<tr
							key={getRowKey(row)}
							style={{
								border: "2px solid #333",
								cursor: onRowClick ? "pointer" : "default",
								background: rowHighlight(row) ? "#222" : undefined,
								transition: "background 0.2s",
							}}
							onClick={() => onRowClick && onRowClick(row)}
							tabIndex={0}
							onKeyDown={(e) => {
								if ((e.key === "Enter" || e.key === " ") && onRowClick)
									onRowClick(row);
							}}
							onMouseEnter={(e) => (e.currentTarget.style.background = "#222")}
							onMouseLeave={(e) =>
								(e.currentTarget.style.background = rowHighlight(row)
									? "#222"
									: "")
							}>
							{columns
								.filter((col) => visibleColumns.includes(col.key))
								.map((col) => (
									<td key={col.key} style={{ padding: "16px" }}>
										{row[col.key] || "N/A"}
									</td>
								))}
						</tr>
					))}
				</tbody>
			</table>
			{/* Pagination Controls */}
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					margin: "16px 0",
				}}>
				<button
					onClick={() => onPageChange && onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
					style={{
						marginRight: 8,
						padding: "4px 12px",
						border: "2px solid #222",
						borderRadius: 4,
						background: "#fff",
						color: "#222",
						cursor: currentPage === 1 ? "not-allowed" : "pointer",
						fontWeight: "bold",
					}}>
					Prev
				</button>
				<span style={{ fontWeight: "bold", margin: "0 8px" }}>
					Page {currentPage} of {totalPages}
				</span>
				<button
					onClick={() => onPageChange && onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					style={{
						marginLeft: 8,
						padding: "4px 12px",
						border: "2px solid #222",
						borderRadius: 4,
						background: "#fff",
						color: "#222",
						cursor: currentPage === totalPages ? "not-allowed" : "pointer",
						fontWeight: "bold",
					}}>
					Next
				</button>
			</div>
		</>
	);
}
