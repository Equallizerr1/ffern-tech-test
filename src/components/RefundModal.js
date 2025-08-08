import React, { useState } from "react";

export default function RefundModal({ order, onClose, onRefundSuccess }) {
	const [amount, setAmount] = useState(order.total || "");
	const [reason, setReason] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleRefund = async () => {
		setLoading(true);
		setError("");
		try {
			const res = await fetch("/api/refund", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ orderId: order.id, amount, reason }),
			});
			if (!res.ok) throw new Error("Refund failed");
			onRefundSuccess && onRefundSuccess();
			onClose();
		} catch (e) {
			setError(e.message || "Refund failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal" onClick={(e) => e.stopPropagation()}>
				<h2>Initiate Refund</h2>
				<label>
					Amount:
					<input
						type="number"
						value={amount}
						min={0}
						max={order.total}
						onChange={(e) => setAmount(e.target.value)}
					/>
				</label>
				<label>
					Reason:
					<input
						type="text"
						value={reason}
						onChange={(e) => setReason(e.target.value)}
					/>
				</label>
				{error && <div style={{ color: "red" }}>{error}</div>}
				<button
					className="btn btn-danger"
					onClick={handleRefund}
					disabled={loading}>
					{loading ? "Processing..." : "Confirm Refund"}
				</button>
				<button className="btn btn-ghost" onClick={onClose}>
					Cancel
				</button>
			</div>
		</div>
	);
}
