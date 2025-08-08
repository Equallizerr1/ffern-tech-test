import React from "react";

// Reusable search bar component for filtering data
export default function SearchBar({
	value,
	onChange,
	placeholder = "Search...",
	style = {},
	inputStyle = {},
	buttons = null,
}) {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				...style,
			}}>
			{/* Search input field */}
			<input
				type="text"
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				style={{
					width: "100%",
					padding: "8px",
					boxSizing: "border-box",
					fontSize: "1rem",
					border: "2px solid #555",
					borderRadius: 8,
					marginRight: 16,
					...inputStyle,
				}}
			/>
			{/* Optional buttons (e.g., clear, advanced search) */}
			{buttons}
		</div>
	);
}
