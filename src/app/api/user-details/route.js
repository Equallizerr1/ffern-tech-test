// This API route runs only on the server, so secrets are safe here.
export async function GET(request) {
	const username = process.env.FFERN_API_USERNAME;
	const password = process.env.FFERN_API_PASSWORD;
	const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

	// Fetch data from the protected backend API
	const apiRes = await fetch(
		"https://backend.ffern.co/api/tech-test/cs/user-details",
		{
			headers: {
				Authorization: `Basic ${basicAuth}`,
			},
			cache: "no-store",
		}
	);

	if (!apiRes.ok) {
		return new Response(
			JSON.stringify({ error: "Failed to fetch user details" }),
			{ status: apiRes.status }
		);
	}

	const data = await apiRes.json();
	return new Response(JSON.stringify(data), { status: 200 });
}
