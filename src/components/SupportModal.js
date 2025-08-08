import React from "react";

export default function SupportModal({ open, onClose }) {
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
			</div>
		</div>
	);
}
