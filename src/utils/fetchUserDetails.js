// Fetches user details and related data from your secure Next.js API route
export async function fetchUserDetails() {
	const res = await fetch("/api/user-details");
	if (!res.ok) {
		throw new Error("Failed to fetch user details");
	}
	return res.json();
}
