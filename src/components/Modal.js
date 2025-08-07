import React from "react";

export default function Modal({ children, onClose }) {
	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100vw",
				height: "100vh",
				background: "rgba(10,10,10,0.3)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				zIndex: 1000,
			}}>
			<div
				style={{
					background: "#fff",
					color: "#222", // Ensures text is visible in dark mode
					padding: 24,
					borderRadius: 8,
					minWidth: 320,
					maxWidth: "90vw",
					maxHeight: "90vh",
					overflowY: "auto",
					boxShadow: "0 2px 16px rgba(0,0,0,0.4)", // Stronger shadow for contrast
					position: "relative",
				}}>
				<button
					onClick={onClose}
					style={{
						position: "absolute",
						top: 12,
						right: 12,
						background: "#222",
						color: "#fff",
						border: "2px solid #fff", // Add white outline
						borderRadius: 4,
						padding: "4px 12px",
						cursor: "pointer",
						outline: "2px solid #222", // Extra outline for accessibility
						boxShadow: "0 0 0 2px #222", // Subtle shadow for more contrast
					}}>
					Close
				</button>
				{children}
			</div>
		</div>
	);
}
