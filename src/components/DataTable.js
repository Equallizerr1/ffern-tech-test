import React, { useEffect, useRef, useState } from "react";
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
	onShowSettings,
	minTableWidth, // optional min width to trigger horizontal scroll
}) {
	const totalPages = Math.ceil(data.length / rowsPerPage);
	const paginatedData = data.slice(
		(currentPage - 1) * rowsPerPage,
		currentPage * rowsPerPage
	);

	// NEW: dual-scrollbar sync + real scrollable width
	const topScrollRef = useRef(null);
	const bottomWrapRef = useRef(null);
	const tableRef = useRef(null);
	const [contentWidth, setContentWidth] = useState(0);

	useEffect(() => {
		const parseMin = () =>
			typeof minTableWidth === "string"
				? parseInt(minTableWidth, 10)
				: minTableWidth || 0;

		const updateWidths = () => {
			const minW = parseMin();
			const tableW = tableRef.current ? tableRef.current.scrollWidth : 0;
			const bottomW = bottomWrapRef.current
				? bottomWrapRef.current.scrollWidth
				: 0;
			const widest = Math.max(minW, tableW, bottomW);
			setContentWidth(widest || 0);
		};

		updateWidths();

		// Keep scroll positions in sync
		const topEl = topScrollRef.current;
		const bottomEl = bottomWrapRef.current;
		if (!topEl || !bottomEl) return;

		// Initial sync
		topEl.scrollLeft = bottomEl.scrollLeft;

		let syncing = false;
		const onTopScroll = () => {
			if (syncing) return;
			syncing = true;
			bottomEl.scrollLeft = topEl.scrollLeft;
			syncing = false;
		};
		const onBottomScroll = () => {
			if (syncing) return;
			syncing = true;
			topEl.scrollLeft = bottomEl.scrollLeft;
			syncing = false;
		};

		topEl.addEventListener("scroll", onTopScroll, { passive: true });
		bottomEl.addEventListener("scroll", onBottomScroll, { passive: true });

		const ro = new ResizeObserver(updateWidths);
		tableRef.current && ro.observe(tableRef.current);
		bottomEl && ro.observe(bottomEl);
		window.addEventListener("resize", updateWidths);

		return () => {
			topEl.removeEventListener("scroll", onTopScroll);
			bottomEl.removeEventListener("scroll", onBottomScroll);
			window.removeEventListener("resize", updateWidths);
			ro.disconnect();
		};
	}, [columns, visibleColumns, data, minTableWidth, rowsPerPage, currentPage]);

	// Optional: drag-to-scroll for the top scrollbar
	const isDraggingRef = useRef(false);
	const dragStartXRef = useRef(0);
	const startScrollLeftRef = useRef(0);
	const onMouseDown = (e) => {
		isDraggingRef.current = true;
		dragStartXRef.current = e.clientX;
		startScrollLeftRef.current = topScrollRef.current.scrollLeft;
		topScrollRef.current.style.cursor = "grabbing";
		e.preventDefault();
	};
	const onMouseMove = (e) => {
		if (!isDraggingRef.current) return;
		const delta = e.clientX - dragStartXRef.current;
		topScrollRef.current.scrollLeft = startScrollLeftRef.current - delta;
	};
	const onMouseUpLeave = () => {
		isDraggingRef.current = false;
		if (topScrollRef.current) topScrollRef.current.style.cursor = "grab";
	};

	return (
		<>
			{/* Header + settings */}
			<div className="toolbar" style={{ marginTop: 8 }}>
				<div style={{ fontWeight: 700 }}>Table</div>
				{onShowSettings && <SettingsButton onClick={onShowSettings} />}
			</div>

			{/* TOP horizontal scrollbar with real scrollable content width */}
			<div
				ref={topScrollRef}
				className="table-scroll-top"
				onWheel={(e) => {
					// translate vertical wheel to horizontal scroll for convenience
					if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
						topScrollRef.current.scrollLeft += e.deltaY;
					}
				}}
				onMouseDown={onMouseDown}
				onMouseMove={onMouseMove}
				onMouseLeave={onMouseUpLeave}
				onMouseUp={onMouseUpLeave}
				style={{ cursor: "grab" }}>
				{/* The spacer div creates the actual scrollable width */}
				<div style={{ width: (contentWidth || 1) + "px", height: 1 }} />
			</div>

			{/* Main table with bottom scrollbar */}
			<div
				ref={bottomWrapRef}
				className="card table-wrap"
				style={{ maxWidth: "100%", overflowX: "auto" }}>
				<table
					ref={tableRef}
					className="table"
					style={{ minWidth: minTableWidth }}>
					<thead>
						<tr>
							{columns
								.filter((col) => visibleColumns.includes(col.key))
								.map((col) => (
									<th
										key={col.key}
										onClick={() => onSort && onSort(col.key)}
										style={{
											cursor: onSort ? "pointer" : "default",
											userSelect: "none",
										}}>
										{col.label}
										{sortKey === col.key && (
											<span style={{ marginLeft: 6 }}>
												{sortDirection === "asc" ? "▲" : "▼"}
											</span>
										)}
									</th>
								))}
						</tr>
					</thead>
					<tbody>
						{paginatedData.map((row) => {
							const selected = rowHighlight(row);
							return (
								<tr
									key={getRowKey(row)}
									className={selected ? "is-selected" : ""}
									style={{ cursor: onRowClick ? "pointer" : "default" }}
									onClick={() => onRowClick && onRowClick(row)}
									tabIndex={0}
									onKeyDown={(e) => {
										if ((e.key === "Enter" || e.key === " ") && onRowClick)
											onRowClick(row);
									}}>
									{columns
										.filter((col) => visibleColumns.includes(col.key))
										.map((col) => (
											<td key={col.key}>{row[col.key] ?? "N/A"}</td>
										))}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className="pagination">
				<button
					className="btn btn-ghost"
					onClick={() => onPageChange && onPageChange(currentPage - 1)}
					disabled={currentPage === 1}>
					Prev
				</button>
				<span style={{ fontWeight: 700 }}>
					Page {currentPage} of {totalPages || 1}
				</span>
				<button
					className="btn btn-ghost"
					onClick={() => onPageChange && onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}>
					Next
				</button>
			</div>
		</>
	);
}
