import React, { useState } from "react";
import RefundModal from "./RefundModal"; // Adjust the import path as necessary

// Modal to display detailed information about an order, including customer and line items
export default function OrderDetailsModal({
	order,
	users,
	orderLineItems,
	onClose,
	canRefund, // New prop to determine if refund is possible
	onRefundSuccess, // Callback for refund success
}) {
	const [showRefundModal, setShowRefundModal] = useState(false);

	if (!order) return null;

	// Find the user associated with this order
	const user = users.find((u) => u.id === order.user_id);

	// Get all line items for this order
	const lineItems = orderLineItems.filter((item) => item.order_id === order.id);

	// Calculate the total price for the order
	const totalPrice = lineItems.reduce(
		(sum, item) => sum + (item.price ? Number(item.price) : 0),
		0
	);

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
					{/* Order Details Section */}
					<div style={{ minWidth: 320, flex: "0 0 320px" }}>
						<h2 style={{ marginTop: 12, fontSize: "1.5rem" }}>Order Details</h2>
						<p>
							Order ID: <b>{order.id}</b>
						</p>
						<p>
							Status: <b>{order.delivery_status || "N/A"}</b>
						</p>
						<p>
							Created:{" "}
							{order.created_at
								? new Date(order.created_at).toLocaleString()
								: "N/A"}
						</p>
						<p>
							Shipping Date:{" "}
							{order.shipping_date
								? new Date(order.shipping_date).toLocaleDateString()
								: "N/A"}
						</p>
						<p>Delivery Service: {order.delivery_service || "N/A"}</p>
						<p>Tracking Number: {order.tracking_number || "N/A"}</p>
						<p>
							Tracking URL:{" "}
							{order.tracking_url ? (
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
						</p>
						<p>Delivery Status: {order.delivery_status || "N/A"}</p>
					</div>
					{/* Customer Details Section */}
					<div style={{ minWidth: 320, flex: "0 0 320px" }}>
						<h3 style={{ marginTop: 12, fontSize: "1.2rem" }}>Customer</h3>
						{user ? (
							<>
								<p>
									Name: {user.first_name} {user.last_name}
								</p>
								<p>Email: {user.email}</p>
								<p>Phone: {user.phone || "N/A"}</p>
							</>
						) : (
							<p>Unknown User</p>
						)}
					</div>
				</div>
				{/* Order Line Items Section */}
				<div>
					<h3 style={{ marginTop: 24, fontSize: "1.2rem" }}>Order Items</h3>
					<ul>
						{lineItems.map((item) => (
							<li key={item.id} style={{ marginBottom: 8 }}>
								<>
									{/* Product info and quantity */}
									{item.product_id || "Unnamed Product"}{" "}
									{item.quantity ? `x${item.quantity}` : ""}
									{/* Unit price if available */}
									{item.unit_price && <> - £{item.unit_price}</>}
									<p>
										Total:
										{item.price && <> £{item.price}</>}
									</p>
								</>
							</li>
						))}
					</ul>
					{/* Order total price */}
					<p style={{ fontWeight: "bold", marginTop: 12 }}>
						Order Total: £{totalPrice}
					</p>
				</div>
				{/* Refund button - always visible */}
				<button
					className="btn btn-danger"
					onClick={() => setShowRefundModal(true)}
					style={{
						marginTop: 16,
						padding: "8px 16px",
						background: "red",
						color: "#fff",
						border: "none",
						borderRadius: 4,
						cursor: "pointer",
						fontWeight: "bold",
					}}>
					Initiate Refund
				</button>
				{/* Refund modal - controlled by showRefundModal state */}
				{showRefundModal && (
					<RefundModal
						order={order}
						onClose={() => setShowRefundModal(false)}
						onRefundSuccess={onRefundSuccess}
					/>
				)}
			</div>
		</div>
	);
}
