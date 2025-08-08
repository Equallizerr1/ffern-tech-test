import React, { useState } from "react";

export default function SupportModal({ open, onClose }) {
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [status, setStatus] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setStatus("");
		try {
			const res = await fetch("/api/support", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, message }),
			});
			if (res.ok) {
				setStatus("Your message has been sent. Support will contact you soon.");
				setEmail("");
				setMessage("");
			} else {
				setStatus("There was an error sending your message. Please try again.");
			}
		} catch {
			setStatus("There was an error sending your message. Please try again.");
		}
		setLoading(false);
	};

	if (!open) return null;
	return (
		<div className="modal-overlay" onClick={onClose}>
			<div
				className="modal"
				style={{ paddingTop: 56, position: "relative", maxWidth: 400 }}
				onClick={(e) => e.stopPropagation()}>
				<button
					className="btn btn-ghost close"
					style={{
						position: "absolute",
						top: 14,
						right: 14,
						zIndex: 2,
					}}
					onClick={onClose}>
					Close
				</button>
				<h2>Contact Support</h2>
				<p>
					If you are experiencing issues with the app, please contact our
					support team:
				</p>
				<ul style={{ margin: "16px 0" }}>
					<li>
						<b>Email:</b>{" "}
						<a
							href="mailto:support@yourcompany.com"
							style={{ color: "#5b8cff" }}>
							support@yourcompany.com
						</a>
					</li>
					<li>
						<b>Phone:</b> 0800 123 4567
					</li>
				</ul>
				<p>
					Please include a description of the issue and any error messages you
					see.
				</p>
				<hr style={{ margin: "24px 0" }} />
				<h3 style={{ marginBottom: 8 }}>Or send a message directly:</h3>
				<form onSubmit={handleSubmit}>
					<label style={{ display: "block", marginBottom: 8 }}>
						Your Email:
						<input
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							style={{
								width: "100%",
								marginTop: 4,
								marginBottom: 12,
								border: "1.5px solid #5b8cff",
								borderRadius: 6,
								padding: "8px 10px",
								background: "var(--bg-elev, #fff)",
								color: "var(--text, #222)",
								boxSizing: "border-box",
							}}
						/>
					</label>
					<label style={{ display: "block", marginBottom: 8 }}>
						Message:
						<textarea
							required
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							rows={4}
							style={{
								width: "100%",
								marginTop: 4,
								marginBottom: 12,
								border: "1.5px solid #5b8cff",
								borderRadius: 6,
								padding: "8px 10px",
								background: "var(--bg-elev, #fff)",
								color: "var(--text, #222)",
								boxSizing: "border-box",
								resize: "vertical",
							}}
						/>
					</label>
					<button
						className="btn btn-primary"
						type="submit"
						disabled={loading}
						style={{ width: "100%" }}>
						{loading ? "Sending..." : "Send Message"}
					</button>
					{status && (
						<div
							style={{
								marginTop: 12,
								color: status.startsWith("Your") ? "green" : "red",
							}}>
							{status}
						</div>
					)}
				</form>
			</div>
		</div>
	);
}
