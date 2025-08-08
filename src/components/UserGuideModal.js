// UserGuideModal.js
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function UserGuideModal({ open, onClose }) {
	const [markdown, setMarkdown] = useState("");

	useEffect(() => {
		if (!open) return;
		fetch("/userguide.md")
			.then((res) => res.text())
			.then(setMarkdown)
			.catch(() => setMarkdown("Failed to load user guide."));
	}, [open]);

	if (!open) return null;
	return (
		<div className="modal-overlay" onClick={onClose}>
			<div
				className="modal"
				style={{
					paddingTop: 56,
					position: "relative",
				}}
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
				<ReactMarkdown
					components={{
						h1: ({ node, ...props }) => (
							<h1
								style={{
									fontSize: "2.2rem",
									fontWeight: "800",
									margin: "0 0 12px",
								}}
								{...props}
							/>
						),
						h2: ({ node, ...props }) => (
							<h2
								style={{
									fontSize: "1.5rem",
									fontWeight: "700",
									margin: "18px 0 8px",
								}}
								{...props}
							/>
						),
					}}>
					{markdown}
				</ReactMarkdown>
			</div>
		</div>
	);
}
