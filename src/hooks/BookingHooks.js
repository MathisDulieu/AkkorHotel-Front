// const API_BASE_URL = "http://localhost:8080";
const API_BASE_URL = "https://akkorhotel-api.up.railway.app"

export async function getUserBookings() {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_BASE_URL}/private/booking`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
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