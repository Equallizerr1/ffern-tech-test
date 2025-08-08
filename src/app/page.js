"use client";
import { useState, useEffect } from "react";
import { fetchUserDetails } from "../utils/fetchUserDetails";
import CustomerPage from "../components/CustomerPage";
import OrdersPage from "../components/OrdersPage";
import ReturnsPage from "../components/ReturnsPage";
import SearchBar from "../components/SearchBar";
import UserGuideModal from "../components/UserGuideModal";

// Theme toggle component
function ThemeToggle() {
	const [theme, setTheme] = useState("dark"); // Always "dark" on server

	useEffect(() => {
		const stored = localStorage.getItem("theme");
		if (stored && stored !== theme) {
			setTheme(stored);
		}
	}, []);

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem("theme", theme);
	}, [theme]);

	return (
		<button
			className="btn btn-ghost"
			style={{ marginLeft: 12 }}
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			aria-label="Toggle light/dark mode">
			{theme === "dark" ? "🌙 Dark" : "🌞 Light"}
		</button>
	);
}

// Main dashboard component for the Customer Service app
export default function Home() {
	// State for all data entities
	const [users, setUsers] = useState([]);
	const [orders, setOrders] = useState([]);
	const [orderLineItems, setOrderLineItems] = useState([]);
	const [ledgerMemberships, setLedgerMemberships] = useState([]);
	const [returns, setReturns] = useState([]);
	const [reverseShipments, setReverseShipments] = useState([]);
	const [exchanges, setExchanges] = useState([]);
	const [exchangeLineItems, setExchangeLineItems] = useState([]);

	// UI state
	const [search, setSearch] = useState(""); // Search input value
	const [selectedUser, setSelectedUser] = useState(null); // Currently selected user for modal/details
	const [selectedOrder, setSelectedOrder] = useState(null); // Currently selected order for modal/details
	const [loading, setLoading] = useState(false); // Loading indicator
	const [error, setError] = useState(null); // Error message
	const [page, setPage] = useState("customers"); // Current page/tab
	const [showGuide, setShowGuide] = useState(false); // User guide modal state

	// Fetch all data on mount
	useEffect(() => {
		let isMounted = true;
		setLoading(true);
		setError(null);
		fetchUserDetails()
			.then((data) => {
				if (!isMounted) return;
				// Populate state with fetched data or empty arrays if missing
				setUsers(data.users || []);
				setOrders(data.orders || []);
				setLedgerMemberships(data.ledgerMemberships || []);
				setOrderLineItems(data.orderLineItems || []);
				setReturns(data.returns || []);
				setReverseShipments(data.reverseShipments || []);
				setExchanges(data.exchanges || []);
				setExchangeLineItems(data.exchangeLineItems || []);
				setError(null);
			})
			.catch((err) => {
				if (!isMounted) return;
				setError(
					err?.message
						? `Failed to load data: ${err.message}`
						: "Failed to load data. Please try again."
				);
			})
			.finally(() => {
				if (isMounted) setLoading(false);
			});
		return () => {
			isMounted = false;
		};
	}, []);

	// --- Filtering logic for search ---

	const searchLower = search.toLowerCase();

	// Filter users by name, email, or UUID
	const filteredUsers = users.filter(
		(u) =>
			u.first_name?.toLowerCase().includes(searchLower) ||
			u.last_name?.toLowerCase().includes(searchLower) ||
			u.email?.toLowerCase().includes(searchLower) ||
			u.user_uuid?.toLowerCase().includes(searchLower)
	);

	// Filter orders by order fields or associated user fields
	const filteredOrders = orders.filter((o) => {
		const user = users.find((u) => u.id === o.user_id);
		return (
			o.id?.toString().includes(searchLower) ||
			o.user_id?.toString().includes(searchLower) ||
			o.chargebee_order_id?.toLowerCase().includes(searchLower) ||
			o.tracking_number?.toLowerCase().includes(searchLower) ||
			o.tracking_url?.toLowerCase().includes(searchLower) ||
			(user &&
				(user.first_name?.toLowerCase().includes(searchLower) ||
					user.last_name?.toLowerCase().includes(searchLower) ||
					user.email?.toLowerCase().includes(searchLower)))
		);
	});

	// Filter returns by ID, user, status, or reason
	const filteredReturns = returns.filter(
		(r) =>
			r.id?.toString().includes(searchLower) ||
			r.user_id?.toString().includes(searchLower) ||
			r.status?.toLowerCase().includes(searchLower) ||
			r.reason?.toLowerCase().includes(searchLower)
	);

	return (
		<div className="page">
			<div className="toolbar">
				<div className="seg">
					<button
						className={page === "customers" ? "active" : ""}
						onClick={() => setPage("customers")}>
						Customers
					</button>
					<button
						className={page === "orders" ? "active" : ""}
						onClick={() => setPage("orders")}>
						Orders
					</button>
					<button
						className={page === "returns" ? "active" : ""}
						onClick={() => setPage("returns")}>
						Returns
					</button>
				</div>
				<div style={{ display: "flex", alignItems: "center" }}>
					<button className="btn btn-ghost" onClick={() => setShowGuide(true)}>
						User Guide
					</button>
					<ThemeToggle />
				</div>
			</div>

			<h1>Customer Service Dashboard</h1>

			{/* Search */}
			<SearchBar
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				placeholder="Search an order, user, or return"
			/>

			{/* Loading and error states */}
			{loading && (
				<div style={{ margin: "2rem 0", textAlign: "center" }}>
					<p style={{ fontSize: "1.2rem" }}>Loading data, please wait...</p>
				</div>
			)}
			{error && (
				<div style={{ margin: "2rem 0", textAlign: "center", color: "red" }}>
					<p style={{ fontWeight: "bold" }}>{error}</p>
					<button
						onClick={() => window.location.reload()}
						style={{
							marginTop: 8,
							border: "2px solid #222",
							borderRadius: 4,
							padding: "4px 12px",
							background: "#fff",
							color: "#222",
							cursor: "pointer",
							outline: "2px solid #222",
							fontWeight: "bold",
						}}>
						Retry
					</button>
				</div>
			)}
			{/* Render the selected page/component only if not loading or error */}
			{!loading && !error && (
				<>
					{page === "customers" && (
						<CustomerPage
							users={filteredUsers}
							orders={orders}
							ledgerMemberships={ledgerMemberships}
							orderLineItems={orderLineItems}
							selectedUser={selectedUser}
							setSelectedUser={setSelectedUser}
							selectedOrder={selectedOrder}
							setSelectedOrder={setSelectedOrder}
							search={search}
							setSearch={setSearch}
						/>
					)}
					{page === "orders" && (
						<OrdersPage
							orders={filteredOrders}
							users={users}
							selectedOrder={selectedOrder}
							setSelectedOrder={setSelectedOrder}
							orderLineItems={orderLineItems}
							search={search}
							setSearch={setSearch}
						/>
					)}
					{page === "returns" && (
						<ReturnsPage
							returns={filteredReturns}
							users={users}
							reverseShipments={reverseShipments}
							exchanges={exchanges}
							exchangeLineItems={exchangeLineItems}
							orderLineItems={orderLineItems}
							search={search}
						/>
					)}
				</>
			)}
			<UserGuideModal open={showGuide} onClose={() => setShowGuide(false)} />
		</div>
	);
}
