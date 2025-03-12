const API_BASE_URL = "http://localhost:8080";
// const API_BASE_URL = "https://akkorhotel-api.up.railway.app"

export async function getUserBookings() {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
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

export async function createBooking(bookingData) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    const formattedData = {
        ...bookingData,
        checkInDate: new Date(bookingData.checkInDate).toISOString(),
        checkOutDate: new Date(bookingData.checkOutDate).toISOString()
    };

    const response = await fetch(`${API_BASE_URL}/private/booking`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(formattedData)
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return responseData;
}

export const deleteBooking = async (bookingId) => {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/private/booking/${bookingId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }
    });

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return responseData;
};