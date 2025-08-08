// This API route runs only on the server, so secrets are safe here.
export default async function handler(req, res) {
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
		return res
			.status(apiRes.status)
			.json({ error: "Failed to fetch user details" });
	}

	const data = await apiRes.json();
	res.status(200).json(data);
}
