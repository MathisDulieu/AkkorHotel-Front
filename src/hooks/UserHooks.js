const API_BASE_URL = "http://localhost:8080";
// const API_BASE_URL = "https://akkorhotel-api.up.railway.app"

export async function getUserData() {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error("No authentication token found");
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
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/private/user`, {
        method: 'PATCH',
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
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error("No authentication token found");
    }

    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await fetch(`${API_BASE_URL}/private/user/profile-image`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authToken}`
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
}

export async function deleteUser() {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/private/user`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data ? data : {};
}
