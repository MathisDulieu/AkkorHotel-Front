import Cookies from "js-cookie";

const API_BASE_URL = "http://localhost:8080";

export async function getUserData() {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        return {};
    }

    const response = await fetch(`${API_BASE_URL}/private/user`, {
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

export async function updateUser(username, email, oldPassword, newPassword) {
    const cookiesAccepted = localStorage.getItem('cookiesAccepted') === 'true';
    const authToken = cookiesAccepted ? Cookies.get('authToken') : localStorage.getItem('authToken');

    if (!authToken) {
        return {};
    }

    const response = await fetch(`${API_BASE_URL}/user/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ username, email, oldPassword, newPassword }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
}

export async function updateProfileImage(imageFile) {
    const cookiesAccepted = localStorage.getItem('cookiesAccepted') === 'true';
    const authToken = cookiesAccepted ? Cookies.get('authToken') : localStorage.getItem('authToken');

    if (!authToken) {
        return {};
    }

    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await fetch(`${API_BASE_URL}/user/profile-image`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
}