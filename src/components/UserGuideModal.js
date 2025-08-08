// UserGuideModal.js
import React from "react";
import ReactMarkdown from "react-markdown";

const userGuideMarkdown = `
# Customer Service Dashboard – User Guide

## Overview

This platform is designed to help customer service representatives efficiently handle customer inquiries, orders, returns, and exchanges. It provides a unified dashboard to search, view, and manage customer-related data.

---

## Getting Started

1. **Login** to the dashboard (if authentication is enabled).
2. Use the navigation buttons at the top to switch between:
   - **Customers**
   - **Orders**
   - **Returns**

---

## Searching for Customers, Orders, or Returns

- Use the **search bar** at the top of the dashboard to find customers, orders, or returns.
- You can search by:
  - Customer name, email, or UUID
  - Order ID, tracking number, or customer details
  - Return ID, status, reason, or customer details

---

## Viewing Details

- Click on any row in the table to open a detailed modal.
- In the modal, you can view:
  - **Customer Details:** Profile, memberships, and related orders.
  - **Order Details:** Customer info, shipping/tracking, and line items.
  - **Return Details:** Refunds, reverse shipments, exchanges, and original order items.

---

## Handling Customer Inquiries

1. **Search** for the customer or order in question.
2. **Open the relevant details** by clicking the row.
3. **Review all information** (order status, tracking, returns, exchanges, etc.).
4. Use the information to answer the customer’s inquiry or resolve their issue.

---

## Managing Columns

- Click the **Settings** button to choose which columns are visible in each table.
- You can reset to default columns or clear all columns for a custom view.

---

## Troubleshooting

- If data is not loading, check your internet connection and refresh the page.
- If you see an error message, use the **Retry** button or contact your technical team.

---

## Security

- Sensitive API credentials are securely stored and never exposed to the browser.
- Only authorized users should have access to the dashboard.

---

## FAQ

**Q: How do I find a customer by email?**  
A: Enter the email address in the search bar and select the Customers tab.

**Q: How do I check the status of a return?**  
A: Go to the Returns tab, search by return ID or customer, and click the row for details.

**Q: Can I see what was exchanged for a return?**  
A: Yes, open the return details modal to see all related exchanges and original order items.

---

For further assistance, contact your technical support team.
`;

export default function UserGuideModal({ open, onClose }) {
	if (!open) return null;
	return (
		<div className="modal-overlay" onClick={onClose}>
			<div
				className="modal"
				style={{
					paddingTop: 56, // add extra top padding for the close button
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
					{userGuideMarkdown}
				</ReactMarkdown>
			</div>
		</div>
	);
}
