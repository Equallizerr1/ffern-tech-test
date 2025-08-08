import React from "react";

// Modal to display detailed information about a customer/user
export default function CustomerDetailsModal({
	user,
	orders,
	ledgerMemberships,
	setSelectedUser,
	setSelectedOrder,
	orderLineItems,
	onClose,
}) {
	if (!user) return null;

	// Orders for this user
	const userOrders = (orders || []).filter((o) => o.user_id === user.id);

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
				className="modal"
				style={{
					background: "var(--card, #fff)",
					color: "var(--text, #222)",
					padding: 32,
					borderRadius: 8,
					minWidth: 640,
					maxWidth: "90vw",
					maxHeight: "90vh",
					overflowY: "auto",
					boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
					position: "relative",
					border: "1px solid var(--border, #222)",
				}}
				onClick={(e) => e.stopPropagation()}>
				{/* Close button */}
				<button
					style={{
						position: "absolute",
						top: 16,
						right: 16,
						border: "2px solid var(--border, #222)",
						borderRadius: 4,
						padding: "4px 12px",
						background: "var(--card, #fff)",
						color: "var(--text, #222)",
						cursor: "pointer",
						outline: "2px solid var(--border, #222)",
						fontWeight: "bold",
					}}
					onClick={onClose}>
					Close
				</button>

				{/* Basic user info */}
				<h2 style={{ marginTop: 12, fontSize: "1.2rem" }}>Customer Profile</h2>
				<p>
					<b>Name:</b> {user.first_name} {user.last_name}
				</p>
				<p>
					<b>Email:</b> {user.email}
				</p>
				<p>
					<b>UUID:</b> {user.user_uuid}
				</p>

				{/* Membership details */}
				<h3 style={{ marginTop: 16, fontSize: "1.2rem" }}>Membership</h3>
				{ledgerMemberships.length ? (
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
				) : (
					<p>No membership found.</p>
				)}

				{/* Orders for this customer */}
				<h3 style={{ marginTop: 16, fontSize: "1.2rem" }}>Orders</h3>
				{userOrders.length ? (
					<ul>
						{userOrders.map((o) => (
							<li key={o.id} style={{ marginBottom: 8 }}>
								<div>
									<b>Order:</b> {o.id}
								</div>
								<div>
									<b>Status:</b>{" "}
									{o.delivery_status ?? o.fulfillment_status ?? "N/A"}
								</div>
								<div>
									<b>Created:</b>{" "}
									{o.created_at
										? new Date(o.created_at).toLocaleString()
										: "N/A"}
								</div>
								<button
									style={{
										marginTop: 4,
										border: "2px solid var(--border, #222)",
										borderRadius: 4,
										padding: "2px 8px",
										background: "var(--card, #fff)",
										color: "var(--text, #222)",
										cursor: "pointer",
										fontWeight: "bold",
									}}
									onClick={() => setSelectedOrder && setSelectedOrder(o)}>
									View details
								</button>
							</li>
						))}
					</ul>
				) : (
					<p>No orders for this customer.</p>
				)}
			</div>
		</div>
	);
}
