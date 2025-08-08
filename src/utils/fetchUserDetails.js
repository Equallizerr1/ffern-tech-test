// Fetches user details and related data from the backend API
export async function fetchUserDetails() {
	const username = "cs-tech-test";
	const password = "mypasswordissecure";
	const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

	const res = await fetch(
		"https://backend.ffern.co/api/tech-test/cs/user-details",
		{
			headers: {
				Authorization: `Basic ${basicAuth}`,
			},
			cache: "no-store", // Optional: disables caching for fresh data
		}
	);

	if (!res.ok) {
		throw new Error("Failed to fetch user details");
	}
	return res.json();
}
