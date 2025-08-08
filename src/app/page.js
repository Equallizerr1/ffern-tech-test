"use client";
import { useState, useEffect } from "react";
import { fetchUserDetails } from "../utils/fetchUserDetails";
import CustomerPage from "../components/CustomerPage";
import OrdersPage from "../components/OrdersPage";
import ReturnsPage from "../components/ReturnsPage";
import SearchBar from "../components/SearchBar";

export default function Home() {
	const [users, setUsers] = useState([]);
	const [orders, setOrders] = useState([]);
	const [orderLineItems, setOrderLineItems] = useState([]);
	const [ledgerMemberships, setLedgerMemberships] = useState([]);
	const [returns, setReturns] = useState([]);
	const [reverseShipments, setReverseShipments] = useState([]);
	const [exchanges, setExchanges] = useState([]);
	const [search, setSearch] = useState("");
	const [selectedUser, setSelectedUser] = useState(null);
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [page, setPage] = useState("customers");

	useEffect(() => {
		setLoading(true);
		fetchUserDetails()
			.then((data) => {
				setUsers(data.users || []);
				setOrders(data.orders || []);
				setLedgerMemberships(data.ledgerMemberships || []);
				setOrderLineItems(data.orderLineItems || []);
				setReturns(data.returns || []);
				setReverseShipments(data.reverseShipments || []);
				setExchanges(data.exchanges || []);
				setError(null);
			})
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, []);

	// Filtering logic
	const searchLower = search.toLowerCase();

	const filteredUsers = users.filter(
		(u) =>
			u.first_name?.toLowerCase().includes(searchLower) ||
			u.last_name?.toLowerCase().includes(searchLower) ||
			u.email?.toLowerCase().includes(searchLower) ||
			u.user_uuid?.toLowerCase().includes(searchLower)
	);

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

	const filteredReturns = returns.filter(
		(r) =>
			r.id?.toString().includes(searchLower) ||
			r.user_id?.toString().includes(searchLower) ||
			r.status?.toLowerCase().includes(searchLower) ||
			r.reason?.toLowerCase().includes(searchLower)
	);

	return (
		<div>
			<h1 style={{ fontSize: "2.5rem" }}>Customer Service Dashboard</h1>
			<div style={{ marginBottom: 12 }}>
				<button
					onClick={() => setPage("customers")}
					style={{
						marginRight: 8,
						border: "2px solid #222",
						borderRadius: 4,
						padding: "4px 12px",
						background: "#fff",
						color: "#222",
						cursor: "pointer",
						outline: "2px solid #222",
						fontWeight: "bold",
					}}>
					Customers
				</button>
				<button
					onClick={() => setPage("orders")}
					style={{
						border: "2px solid #222",
						borderRadius: 4,
						padding: "4px 12px",
						background: "#fff",
						color: "#222",
						cursor: "pointer",
						outline: "2px solid #222",
						fontWeight: "bold",
					}}>
					Orders
				</button>
				<button
					onClick={() => setPage("returns")}
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
					}}>
					Returns
				</button>
			</div>
			<SearchBar
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				placeholder="Search an order, user, or return"
				style={{ marginBottom: "1rem" }}
			/>
			{loading && <p>Loading...</p>}
			{error && <p style={{ color: "red" }}>{error}</p>}
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
				/>
			)}
		</div>
	);
}
