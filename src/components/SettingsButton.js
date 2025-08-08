import React from "react";

export default function SettingsButton({ onClick }) {
	return (
		<button
			style={{
				border: "2px solid #222",
				borderRadius: 4,
				padding: "4px 12px",
				background: "#fff",
				color: "#222",
				cursor: "pointer",
				outline: "2px solid #222",
				fontWeight: "bold",
				marginLeft: 8,
			}}
			onClick={onClick}>
			Settings
		</button>
	);
}
