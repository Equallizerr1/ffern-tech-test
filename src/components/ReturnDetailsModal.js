import React from "react";

// Modal to display detailed information about a return, including shipments and exchanges
export default function ReturnDetailsModal({
	returnOrder,
	reverseShipments,
	exchanges,
	exchangeLineItems,
	orderLineItems,
	onClose,
}) {
	if (!returnOrder) return null;

	// Scope related records to this return to avoid undefined refs
	const relatedReverseShipments = Array.isArray(reverseShipments)
		? reverseShipments.filter((rs) => rs.return_id === returnOrder.id)
		: [];

	const relatedExchanges = Array.isArray(exchanges)
		? exchanges.filter((ex) => ex.return_id === returnOrder.id)
		: [];

	// Example fields; adjust to your actual return schema
	const refundAmount =
		returnOrder.refund_amount ?? returnOrder.credit_amount ?? null;
	const refundStatus =
		returnOrder.refund_status ?? returnOrder.credit_status ?? null;
	const refundMethod = returnOrder.refund_method ?? null;

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
				<h2 style={{ marginTop: 12, fontSize: "1.5rem" }}>Return Details</h2>
				{/* Basic return info */}
				<p>
					Return ID: <b>{returnOrder.id}</b>
				</p>
				<p>
					Status: <b>{returnOrder.status || "N/A"}</b>
				</p>
				<p>
					Reason: <b>{returnOrder.reason || "N/A"}</b>
				</p>
				<p>
					Created:{" "}
					{returnOrder.created_at
						? new Date(returnOrder.created_at).toLocaleString()
						: "N/A"}
				</p>
				<p>
					Refund Amount:{" "}
					<b>
						{returnOrder.refund_amount !== undefined
							? `£${returnOrder.refund_amount}`
							: "N/A"}
					</b>
				</p>
				<p>
					Refund Status: <b>{returnOrder.refund_status || "N/A"}</b>
				</p>
				<p>
					Credit Issued: <b>{returnOrder.credit_issued ? "Yes" : "No"}</b>
				</p>
				{/* Refund / Credit section */}
				<h3 style={{ marginTop: 16 }}>Refund / Credit</h3>
				<p>
					<b>Amount:</b> {refundAmount != null ? `£${refundAmount}` : "N/A"}
				</p>
				<p>
					<b>Status:</b> {refundStatus || "N/A"}
				</p>
				<p>
					<b>Method:</b> {refundMethod || "N/A"}
				</p>

				{/* Reverse Shipments section */}
				<h3 style={{ marginTop: 24, fontSize: "1.2rem", fontWeight: "bold" }}>
					Reverse Shipments
				</h3>
				<ul>
					{relatedReverseShipments.length === 0 && (
						<li>No reverse shipments found.</li>
					)}
					{relatedReverseShipments.map((shipment) => (
						<li key={shipment.id} style={{ marginBottom: 8 }}>
							<p>
								Tracking Number: <b>{shipment.tracking_number || "N/A"}</b>
							</p>
							<p>
								Tracking URL:{" "}
								{shipment.tracking_url ? (
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
								) : (
									"N/A"
								)}
							</p>
							<p>
								Replacement Item: <b>{shipment.replacement_item || "N/A"}</b>
							</p>
							<p>
								Sender Name: <b>{shipment.sender_name || "N/A"}</b>
							</p>
							<p>
								Sender Postcode: <b>{shipment.sender_postcode || "N/A"}</b>
							</p>
							<p>
								Postage Cost:{" "}
								<b>
									{shipment.postage_cost !== undefined
										? `£${shipment.postage_cost}`
										: "N/A"}
								</b>
							</p>
							<p>
								Carrier: <b>{shipment.carrier || "N/A"}</b>
							</p>
							<p>
								Fulfillment Service:{" "}
								<b>{shipment.fulfillment_service || "N/A"}</b>
							</p>
							<p>
								Delivery Status: <b>{shipment.delivery_status || "N/A"}</b>
							</p>
							<p>
								Label URL:{" "}
								{shipment.label_url ? (
									<a
										href={shipment.label_url}
										target="_blank"
										rel="noopener noreferrer"
										style={{
											color: "#0074d9",
											textDecoration: "underline",
											fontWeight: "bold",
										}}>
										Label
									</a>
								) : (
									"N/A"
								)}
							</p>
							<p>
								Processed By: <b>{shipment.processed_by || "N/A"}</b>
							</p>
							<p>
								Received At:{" "}
								<b>
									{shipment.received_at
										? new Date(shipment.received_at).toLocaleString()
										: "N/A"}
								</b>
							</p>
							<p>
								Received By: <b>{shipment.received_by || "N/A"}</b>
							</p>
						</li>
					))}
				</ul>

				{/* Exchanges section */}
				<h3 style={{ marginTop: 24, fontSize: "1.2rem", fontWeight: "bold" }}>
					Exchanges
				</h3>
				<ul>
					{relatedExchanges.length === 0 && <li>No exchanges found.</li>}
					{relatedExchanges.map((exch) => {
						// Find original order line items for this exchange
						const originalOrderItems = orderLineItems
							? orderLineItems.filter(
									(item) => item.order_id === exch.exchanged_order_id
							  )
							: [];
						return (
							<li key={exch.id} style={{ marginBottom: 24 }}>
								<div
									style={{
										display: "flex",
										gap: 32,
										alignItems: "flex-start",
									}}>
									{/* Exchange Details */}
									<div
										style={{
											minWidth: 260,
											flex: "0 0 260px",
											background: "#f8f8f8",
											padding: 12,
											borderRadius: 6,
										}}>
										<p>
											<b>Exchange ID:</b> {exch.id}
										</p>
										<p>
											<b>Replacement Item:</b> {exch.replacement_item || "N/A"}
										</p>
										<p>
											<b>Status:</b> {exch.status || "N/A"}
										</p>
										{/* Exchange Line Items */}
										{exchangeLineItems &&
											exchangeLineItems
												.filter((item) => item.exchange_id === exch.id)
												.map((item, idx) => (
													<div
														key={item.id || idx}
														style={{ marginLeft: 8, marginBottom: 4 }}>
														<p>
															Product:{" "}
															<b>
																{item.product_name || item.product_id || "N/A"}
															</b>
														</p>
														<p>
															Quantity: <b>{item.quantity || "N/A"}</b>
														</p>
														<p>
															Unit Price:{" "}
															<b>
																{item.unit_price !== undefined
																	? `£${item.unit_price}`
																	: "N/A"}
															</b>
														</p>
														<p>
															Total:{" "}
															<b>
																{item.amount !== undefined
																	? `£${item.amount}`
																	: "N/A"}
															</b>
														</p>
													</div>
												))}
									</div>
									{/* Original Order Details */}
									{originalOrderItems.length > 0 && (
										<div
											style={{
												minWidth: 260,
												flex: "0 0 260px",
												background: "#f4f4f4",
												padding: 12,
												borderRadius: 6,
											}}>
											<p style={{ fontWeight: "bold" }}>
												Original Order Items:
											</p>
											{originalOrderItems.map((item, idx) => (
												<div key={item.id || idx} style={{ marginBottom: 4 }}>
													<p>
														Product:{" "}
														<b>
															{item.product_name || item.product_id || "N/A"}
														</b>
													</p>
													<p>
														Quantity: <b>{item.quantity || "N/A"}</b>
													</p>
													<p>
														Unit Price:{" "}
														<b>
															{item.unit_price !== undefined
																? `£${item.unit_price}`
																: "N/A"}
														</b>
													</p>
													<p>
														Total:{" "}
														<b>
															{item.unit_price !== undefined &&
															item.quantity !== undefined
																? `£${item.unit_price * item.quantity}`
																: "N/A"}
														</b>
													</p>
												</div>
											))}
										</div>
									)}
								</div>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
