import React from "react";

// Modal for selecting which columns to display in a table
export default function SettingsModal({
	open,
	onClose,
	allColumns,
	visibleColumns,
	onColumnToggle,
	onClearAll,
	onResetDefault,
	defaultColumns,
	title = "Choose columns to display",
}) {
	if (!open) return null;

	return (
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
					maxHeight: "90vh",
					boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
					position: "relative",
					overflowY: "auto",
				}}>
				<h3 style={{ fontWeight: "bold" }}>{title}</h3>
				{/* List of all columns with checkboxes */}
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
						gap: "8px 24px",
						maxWidth: "100%",
					}}>
					{allColumns.map((col) => (
						<div key={col.key}>
							<label>
								<input
									type="checkbox"
									checked={visibleColumns.includes(col.key)}
									onChange={() => onColumnToggle(col.key)}
								/>
								{col.label}
							</label>
						</div>
					))}
				</div>
				{/* Action buttons for clearing, resetting, or closing */}
				<div
					style={{
						display: "flex",
						gap: 8,
						marginTop: 16,
						flexWrap: "wrap",
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
						}}
						onClick={onClearAll}>
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
						onClick={onResetDefault}>
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
						onClick={onClose}>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}
