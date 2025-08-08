import React, { useState } from "react";
import DataTable from "./DataTable";
import ReturnDetailsModal from "./ReturnDetailsModal";
import SettingsModal from "./SettingsModal"; // <-- Import the SettingsModal
import SettingsButton from "./SettingsButton";

const ALL_RETURN_COLUMNS = [
	{ key: "id", label: "Return ID" },
	{ key: "customer", label: "Customer" },
	{ key: "status", label: "Status" },
	{ key: "reason", label: "Reason" },
	{ key: "created_at", label: "Created" },
	{ key: "exchange_tracking", label: "Exchange Tracking" },
	{ key: "replacement_item", label: "Replacement Item" },
];

const DEFAULT_RETURN_COLUMNS = [
	"id",
	"customer",
	"status",
	"reason",
	"created_at",
	"exchange_tracking",
	"replacement_item",
];

export default function ReturnsPage({
	returns,
	reverseShipments,
	exchanges,
	exchangeLineItems,
	orderLineItems,
}) {
	const [selectedReturn, setSelectedReturn] = useState(null);
	const [showSettings, setShowSettings] = useState(false);
	const [visibleColumns, setVisibleColumns] = useState(DEFAULT_RETURN_COLUMNS);

	const handleColumnToggle = (key) => {
		setVisibleColumns((cols) =>
			cols.includes(key) ? cols.filter((col) => col !== key) : [...cols, key]
		);
	};

	const tableData = returns.map((r) => {
		// Find all reverse shipments for this return
		const shipments = reverseShipments.filter((rs) => rs.return_id === r.id);
		// Find all exchanges for this return
		const relatedExchanges = exchanges.filter((e) => e.return_id === r.id);

		// Get all exchange IDs for this return
		const relatedExchangeIds = relatedExchanges.map((e) => e.id);

		// Only show exchangeLineItems for exchanges belonging to this return
		const replacementItems = exchangeLineItems
			.filter((item) => relatedExchangeIds.includes(item.exchange_id))
			.filter((item) => item.product_id)
			.map((item, i) => (
				<div key={`ship-repl-${i}`}>
					<b>{item.product_id}</b>
				</div>
			));

		const customer =
			shipments.length && shipments[0].sender_name
				? shipments[0].sender_name
				: r.user_id || "Unknown";

		const exchangeTracking = shipments.length
			? shipments.map((shipment, idx) => [
					shipment.tracking_number && (
						<div key={`num-${idx}`}>
							<b>{shipment.tracking_number}</b>
						</div>
					),
					shipment.tracking_url && (
						<div key={`url-${idx}`}>
							<a
								href={shipment.tracking_url}
								target="_blank"
								rel="noopener noreferrer"
								style={{
									color: "#0074d9",
									textDecoration: "underline",
									fontWeight: "bold",
								}}>
								Track
							</a>
						</div>
					),
			  ])
			: "N/A";

		return {
			...r,
			customer,
			exchange_tracking: exchangeTracking,
			replacement_item: replacementItems,
			status: r.status || "Pending",
			created_at: new Date(r.created_at).toLocaleString(),
		};
	});

	return (
		<div>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}>
				<h1 style={{ fontWeight: "bold", fontSize: "1.5rem" }}>Returns Page</h1>
				<SettingsButton onClick={() => setShowSettings(true)} />
			</div>
			<SettingsModal
				open={showSettings}
				onClose={() => setShowSettings(false)}
				allColumns={ALL_RETURN_COLUMNS}
				visibleColumns={visibleColumns}
				onColumnToggle={handleColumnToggle}
				onClearAll={() => setVisibleColumns([])}
				onResetDefault={() => setVisibleColumns(DEFAULT_RETURN_COLUMNS)}
				defaultColumns={DEFAULT_RETURN_COLUMNS}
			/>
			<DataTable
				data={tableData}
				columns={ALL_RETURN_COLUMNS}
				visibleColumns={visibleColumns}
				onRowClick={(row) => setSelectedReturn(row)}
				// ...other props
			/>
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
		</div>
	);
}
