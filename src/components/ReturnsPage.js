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
	users,
	reverseShipments,
	exchanges,
}) {
	const tableData = returns.map((ret) => {
		const user = users.find((u) => u.id === ret.user_id);
		const shipments = ret.reverseShipments || [];
		return {
			id: ret.id,
			customer: user
				? `${user.first_name} ${user.last_name}`
				: ret.user_id || "Unknown",
			status: ret.status || "N/A",
			reason: ret.reason || "N/A",
			created_at: ret.created_at
				? new Date(ret.created_at).toLocaleDateString()
				: "N/A",
			exchange_tracking:
				shipments.length > 0
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
					: "—",
			replacement_item:
				shipments.length > 0 && shipments.some((s) => s.replacement_item)
					? shipments
							.filter((s) => s.replacement_item)
							.map((s, i) => (
								<div key={i}>
									<b>{s.replacement_item}</b>
								</div>
							))
					: "—",
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
