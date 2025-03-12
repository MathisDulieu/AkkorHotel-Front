const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

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

export async function getHotelById(hotelId) {
    const response = await fetch(`${API_BASE_URL}/hotel/${hotelId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors) {
            throw new Error(errorData.errors.join(', '));
        } else if (errorData.error) {
            throw new Error(errorData.error);
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }

    return await response.json();
}