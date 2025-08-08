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
		<div
			className="modal-overlay"
			onClick={onClose}
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
			}}>
			<div
				className="modal"
				onClick={(e) => e.stopPropagation()}
				style={{
					background: "var(--card, #fff)",
					color: "var(--text, #222)",
					padding: 32,
					borderRadius: 8,
					minWidth: 340,
					maxWidth: "90vw",
					maxHeight: "90vh",
					overflowY: "auto",
					boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
					position: "relative",
					border: "1px solid var(--border, #222)",
				}}>
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
				<h2>Initiate Refund</h2>
				<label style={{ display: "block", marginBottom: 12 }}>
					Amount:
					<input
						type="number"
						value={amount}
						min={0}
						max={order.total}
						onChange={(e) => setAmount(e.target.value)}
						style={{
							width: "100%",
							marginTop: 4,
							marginBottom: 8,
							border: "1.5px solid #5b8cff",
							borderRadius: 6,
							padding: "8px 10px",
							background: "var(--bg-elev, #fff)",
							color: "var(--text, #222)",
							boxSizing: "border-box",
						}}
					/>
				</label>
				<label style={{ display: "block", marginBottom: 12 }}>
					Reason:
					<input
						type="text"
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						style={{
							width: "100%",
							marginTop: 4,
							marginBottom: 8,
							border: "1.5px solid #5b8cff",
							borderRadius: 6,
							padding: "8px 10px",
							background: "var(--bg-elev, #fff)",
							color: "var(--text, #222)",
							boxSizing: "border-box",
						}}
					/>
				</label>
				{error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
				<button
					className="btn btn-danger"
					onClick={handleRefund}
					disabled={loading}
					style={{
						marginRight: 8,
						padding: "8px 16px",
						background: "red",
						color: "#fff",
						border: "none",
						borderRadius: 4,
						cursor: "pointer",
						fontWeight: "bold",
					}}>
					{loading ? "Processing..." : "Confirm Refund"}
				</button>
				<button
					className="btn btn-ghost"
					onClick={onClose}
					style={{
						padding: "8px 16px",
						marginLeft: 0,
						border: "2px solid var(--border, #222)",
						borderRadius: 4,
						background: "var(--card, #fff)",
						color: "var(--text, #222)",
						cursor: "pointer",
						fontWeight: "bold",
					}}>
					Cancel
				</button>
			</div>
		</div>
	);
}
