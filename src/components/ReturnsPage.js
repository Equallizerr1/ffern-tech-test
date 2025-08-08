import React from "react";
import DataTable from "./DataTable";

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
	users,
}) {
	const tableData = returns.map((r) => {
		// Find all reverse shipments for this return
		const shipments = reverseShipments.filter((rs) => rs.return_id === r.id);
		// Find all exchanges for this return
		const relatedExchanges = exchanges.filter((e) => e.return_id === r.id);

		// Get customer name from the first shipment's sender_name, fallback to user_id
		const customer =
			shipments.length && shipments[0].sender_name
				? shipments[0].sender_name
				: r.user_id || "Unknown";

		// Combine tracking numbers and replacement items from all shipments/exchanges
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

		const replacementItems = [
			...shipments
				.filter((s) => s.replacement_item)
				.map((s, i) => (
					<div key={`ship-repl-${i}`}>
						<b>{s.replacement_item}</b>
					</div>
				)),
			...relatedExchanges
				.filter((e) => e.replacement_item)
				.map((e, i) => (
					<div key={`exch-repl-${i}`}>
						<b>{e.replacement_item}</b>
					</div>
				)),
		];

		return {
			...r,
			customer,
			exchange_tracking: exchangeTracking,
			replacement_item: replacementItems.length ? replacementItems : "N/A",
			status: r.status || "Pending",
			created_at: new Date(r.created_at).toLocaleString(),
		};
	});

	return (
		<div>
			<h1>Returns Page</h1>
			<DataTable
				data={tableData}
				columns={ALL_RETURN_COLUMNS}
				visibleColumns={DEFAULT_RETURN_COLUMNS}
				// Optionally add sorting, row click, etc.
			/>
		</div>
	);
}
