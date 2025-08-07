"use client";
import { useState, useEffect } from "react";
import { fetchUserDetails } from "../utils/fetchUserDetails";
import CustomerPage from "../components/CustomerPage";
import OrdersPage from "../components/OrdersPage";
import ReturnsPage from "../components/ReturnsPage";

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
			{loading && <p>Loading...</p>}
			{error && <p style={{ color: "red" }}>{error}</p>}
			{page === "customers" && (
				<CustomerPage
					users={users}
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
					orders={orders}
					users={users}
					selectedOrder={selectedOrder}
					setSelectedOrder={setSelectedOrder}
					orderLineItems={orderLineItems}
				/>
			)}
			{page === "returns" && (
				<ReturnsPage
					returns={returns}
					users={users}
					reverseShipments={reverseShipments}
					exchanges={exchanges}
				/>
			)}
		</div>
	);
}
