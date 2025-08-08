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
}) {
	if (!open) return null;
	return (
		<div
			className="modal-overlay"
			onClick={onClose} // <-- Clicking the overlay closes the modal
			style={{
				position: "fixed",
				inset: 0,
				background: "rgba(0,0,0,0.5)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				zIndex: 1000,
			}}>
			<div
				className="modal"
				style={{
					position: "relative",
					minWidth: 340,
					maxWidth: 480,
					paddingTop: 56,
				}}
				onClick={(e) => e.stopPropagation()} // <-- Prevent click inside modal from closing
			>
				<button
					className="btn btn-ghost close"
					style={{
						position: "absolute",
						top: 14,
						right: 14,
						zIndex: 2,
					}}
					onClick={onClose}>
					Close
				</button>
				<h2 style={{ marginBottom: 16 }}>Table Settings</h2>
				<div style={{ marginBottom: 16 }}>
					{allColumns.map((col) => (
						<div key={col.key} style={{ marginBottom: 8 }}>
							<label>
								<input
									type="checkbox"
									checked={visibleColumns.includes(col.key)}
									onChange={() => onColumnToggle(col.key)}
									style={{ marginRight: 8 }}
								/>
								{col.label}
							</label>
						</div>
					))}
				</div>
				<div style={{ display: "flex", gap: 8 }}>
					<button className="btn btn-ghost" onClick={onClearAll}>
						Clear All
					</button>
					<button className="btn btn-ghost" onClick={onResetDefault}>
						Reset to Default
					</button>
				</div>
			</div>
		</div>
	);
}
