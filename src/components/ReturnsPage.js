import React from "react";

export default function ReturnsPage({
	returns,
	users,
	reverseShipments,
	exchanges,
}) {
	return (
		<div>
			<h1>Returns Page</h1>
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
						<th>Return ID</th>
						<th>Customer</th>
						<th>Status</th>
						<th>Reason</th>
						<th>Created</th>
						<th>Exchange Tracking</th>
						<th>Replacement Item</th>
					</tr>
				</thead>
				<tbody>
					{returns.map((ret) => {
						const user = users.find((u) => u.id === ret.user_id);
						const shipments = ret.reverseShipments || [];
						return (
							<tr key={ret.id}>
								<td>{ret.id}</td>
								<td>
									{user
										? `${user.first_name} ${user.last_name}`
										: ret.user_id || "Unknown"}
								</td>
								<td>{ret.status || "N/A"}</td>
								<td>{ret.reason || "N/A"}</td>
								<td>
									{ret.created_at
										? new Date(ret.created_at).toLocaleDateString()
										: "N/A"}
								</td>
								<td>
									{shipments.length > 0
										? shipments.map((shipment, idx) => (
												<div key={shipment.id || idx}>
													{shipment.tracking_number && (
														<div>
															<b>{shipment.tracking_number}</b>
														</div>
													)}
													{shipment.tracking_url && (
														<div>
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
													)}
												</div>
										  ))
										: "—"}
								</td>
								<td>
									{shipments.length > 0 &&
									shipments.some((s) => s.replacement_item)
										? shipments
												.filter((s) => s.replacement_item)
												.map((s, i) => (
													<div key={i}>
														<b>{s.replacement_item}</b>
													</div>
												))
										: "—"}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
