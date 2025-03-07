const API_BASE_URL = "http://localhost:8080";

export async function fetchHotels(data) {
    const response = await fetch(`${API_BASE_URL}/hotel`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
}