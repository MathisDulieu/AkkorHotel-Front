const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function createHotel(formData, mainImage, additionalImages) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error("No authentication token found");
    }

    const formDataToSend = new FormData();
    formDataToSend.append("request", JSON.stringify(formData));

    formDataToSend.append("pictures", mainImage);
    additionalImages.forEach(image => {
        formDataToSend.append("pictures", image);
    });


    const response = await fetch(`${API_BASE_URL}/private/admin/hotel`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authToken}`
        },
        body: formDataToSend,
    });

    if (!response.ok) {
        throw await response.json();
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
}

export async function deleteHotel(hotelId) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/private/admin/hotel/${hotelId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }
    });

    if (!response.ok) {
        throw await response.json();
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
}

export async function getUserById(userId) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/private/admin/user/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }
    });

    if (!response.ok) {
        throw await response.json();
    }

    return await response.json();
}

export async function updateUserById(userId, userData) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/private/admin/user/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        throw await response.json();
    }

    return await response.json();
}

export async function getAllUsers(keyword = "", page = 0, pageSize = 10) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    const queryParams = new URLSearchParams({
        keyword,
        page,
        pageSize
    });

    const response = await fetch(`${API_BASE_URL}/private/admin/users?${queryParams}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

export async function getUserBookings(userId) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/private/admin/users/${userId}/bookings`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

export async function getHotelBookings(hotelId) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/private/admin/hotels/${hotelId}/bookings`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

export async function addRoomToHotel(roomData) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/private/admin/hotel/room`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(roomData)
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

export async function deleteRoomFromHotel(hotelId, hotelRoomId) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/private/admin/hotel/room`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
            hotelId: hotelId,
            hotelRoomId: hotelRoomId
        })
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

export async function addImageToHotel(hotelId, pictureFile) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    const formData = new FormData();
    formData.append('picture', pictureFile);

    const response = await fetch(`${API_BASE_URL}/private/admin/hotel/${hotelId}/picture`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authToken}`
        },
        body: formData
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

export async function deleteImageFromHotel(hotelId, pictureLink) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/private/admin/hotel/${hotelId}/picture`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
            pictureLink: pictureLink
        })
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