import React from "react";

// Modal to display detailed information about a customer/user
export default function CustomerDetailsModal({
	user,
	orders,
	ledgerMemberships,
	setSelectedOrder,
	onClose,
}) {
	if (!user) return null;

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
			}}
			onClick={onClose}>
			<div
				style={{
					background: "#fff",
					color: "#222",
					padding: 32,
					borderRadius: 8,
					minWidth: 640,
					maxWidth: "90vw",
					maxHeight: "90vh",
					overflowY: "auto",
					boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
					position: "relative",
				}}
				onClick={(e) => e.stopPropagation()}>
				{/* Close button */}
				<button
					style={{
						position: "absolute",
						top: 16,
						right: 16,
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
				<div style={{ display: "flex", gap: 32 }}>
					{/* Customer Profile */}
					<div style={{ minWidth: 260, flex: "0 0 260px" }}>
						<h2 style={{ marginTop: 12, fontSize: "1.5rem" }}>
							Customer Profile
						</h2>
						<p>Name: {`${user.first_name} ${user.last_name}`}</p>
						<p>Email: {user.email}</p>
						<p>Phone: {user.phone || "N/A"}</p>
						<p>Address: {user.address || "N/A"}</p>
						<p>Membership: {user.is_active ? "Active" : "Inactive"}</p>
					</div>
					{/* Memberships */}
					<div style={{ minWidth: 260, flex: "0 0 260px" }}>
						<h3 style={{ marginTop: 12, fontSize: "1.2rem" }}>Memberships</h3>
						<ul>
							{ledgerMemberships
								.filter(
									(m) => m.user_id === user.id || m.user_uuid === user.user_uuid
								)
								.map((membership) => (
									<li key={membership.id} style={{ marginBottom: 8 }}>
										Membership ID: {membership.id}
										<br />
										Member Since:{" "}
										{user.created_at
											? new Date(user.created_at).toLocaleDateString()
											: "N/A"}
										<br />
										Membership Type: {membership.season_type}
										<br />
										Items Type: {membership.items_type}
										<br />
										Chargebee ID: {membership.chargebee_customer_id || "N/A"}
										<br />
										Chargebee Status:{" "}
										{membership.chargebee_subscription_status || "N/A"}
										<br />
										Next Billing Date:{" "}
										{membership.chargebee_next_billing_at
											? new Date(
													membership.chargebee_next_billing_at
											  ).toLocaleDateString()
											: "N/A"}
									</li>
								))}
						</ul>
					</div>
				</div>
				{/* Orders below */}
				<div>
					<h3 style={{ marginTop: 24, fontSize: "1.2rem" }}>Orders</h3>
					<ul>
						{orders
							.filter((order) => order.user_id === user.id)
							.map((order) => (
								<li key={order.id} style={{ marginBottom: 8 }}>
									<button
										style={{
											marginRight: 8,
											border: "2px solid #222",
											borderRadius: 4,
											padding: "4px 12px",
											background: "#fff",
											color: "#222",
											cursor: "pointer",
											outline: "2px solid #222",
											fontWeight: "bold",
										}}
										onClick={() => setSelectedOrder(order)}>
										View
									</button>
									Order #{order.id} - Status:{" "}
									{order.delivery_status ? (
										order.delivery_status
									) : order.tracking_url ? (
										<a
											href={order.tracking_url}
											target="_blank"
											rel="noopener noreferrer"
											style={{
												color: "#0074d9",
												textDecoration: "underline",
												fontWeight: "bold",
											}}>
											Track
										</a>
									) : (
										"N/A"
									)}
								</li>
							))}
					</ul>
				</div>
			</div>
		</div>
	);
}
