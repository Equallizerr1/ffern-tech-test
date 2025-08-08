// UserGuideModal.js
import React from "react";

export default function UserGuideModal({ open, onClose }) {
	if (!open) return null;
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
					minWidth: 320,
					maxWidth: "90vw",
					maxHeight: "90vh",
					overflowY: "auto",
					boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
					position: "relative",
				}}
				onClick={(e) => e.stopPropagation()}>
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
				<h2>Customer Service Dashboard – User Guide</h2>
				<hr />
				<h3>Overview</h3>
				<p>
					This platform is designed to help customer service representatives
					efficiently handle customer inquiries, orders, returns, and exchanges.
					It provides a unified dashboard to search, view, and manage
					customer-related data.
				</p>
				<h3>Getting Started</h3>
				<ol>
					<li>
						<b>Login</b> to the dashboard (if authentication is enabled).
					</li>
					<li>
						Use the navigation buttons at the top to switch between:
						<ul>
							<li>
								<b>Customers</b>
							</li>
							<li>
								<b>Orders</b>
							</li>
							<li>
								<b>Returns</b>
							</li>
						</ul>
					</li>
				</ol>
				<h3>Searching for Customers, Orders, or Returns</h3>
				<ul>
					<li>
						Use the <b>search bar</b> at the top of the dashboard to find
						customers, orders, or returns.
					</li>
					<li>
						You can search by:
						<ul>
							<li>Customer name, email, or UUID</li>
							<li>Order ID, tracking number, or customer details</li>
							<li>Return ID, status, reason, or customer details</li>
						</ul>
					</li>
				</ul>
				<h3>Viewing Details</h3>
				<ul>
					<li>Click on any row in the table to open a detailed modal.</li>
					<li>
						In the modal, you can view:
						<ul>
							<li>
								<b>Customer Details:</b> Profile, memberships, and related
								orders.
							</li>
							<li>
								<b>Order Details:</b> Customer info, shipping/tracking, and line
								items.
							</li>
							<li>
								<b>Return Details:</b> Refunds, reverse shipments, exchanges,
								and original order items.
							</li>
						</ul>
					</li>
				</ul>
				<h3>Handling Customer Inquiries</h3>
				<ol>
					<li>
						<b>Search</b> for the customer or order in question.
					</li>
					<li>
						<b>Open the relevant details</b> by clicking the row.
					</li>
					<li>
						<b>Review all information</b> (order status, tracking, returns,
						exchanges, etc.).
					</li>
					<li>
						Use the information to answer the customer’s inquiry or resolve
						their issue.
					</li>
				</ol>
				<h3>Managing Columns</h3>
				<ul>
					<li>
						Click the <b>Settings</b> button to choose which columns are visible
						in each table.
					</li>
					<li>
						You can reset to default columns or clear all columns for a custom
						view.
					</li>
				</ul>
				<h3>Troubleshooting</h3>
				<ul>
					<li>
						If data is not loading, check your internet connection and refresh
						the page.
					</li>
					<li>
						If you see an error message, use the <b>Retry</b> button or contact
						your technical team.
					</li>
				</ul>
				<h3>Security</h3>
				<ul>
					<li>
						Sensitive API credentials are securely stored and never exposed to
						the browser.
					</li>
					<li>Only authorized users should have access to the dashboard.</li>
				</ul>
				<h3>FAQ</h3>
				<ul>
					<li>
						<b>How do I find a customer by email?</b>
						<br />
						Enter the email address in the search bar and select the Customers
						tab.
					</li>
					<li>
						<b>How do I check the status of a return?</b>
						<br />
						Go to the Returns tab, search by return ID or customer, and click
						the row for details.
					</li>
					<li>
						<b>Can I see what was exchanged for a return?</b>
						<br />
						Yes, open the return details modal to see all related exchanges and
						original order items.
					</li>
				</ul>
				<p>For further assistance, contact your technical support team.</p>
			</div>
		</div>
	);
}
