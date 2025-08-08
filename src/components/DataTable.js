import React from "react";

export default function DataTable({
	data,
	columns,
	visibleColumns,
	sortKey,
	sortDirection,
	onSort,
	onRowClick,
	selectedRow,
	getRowKey = (row) => row.id,
	rowHighlight = (row) => selectedRow && selectedRow.id === row.id,
}) {
	return (
		<table
			border="1"
			cellPadding="8"
			cellSpacing="0"
			style={{
				marginTop: 16,
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
									cursor: "pointer",
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
				{data.map((row) => (
					<tr
						key={getRowKey(row)}
						style={{
							border: "2px solid #333",
							cursor: "pointer",
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
	);
}
