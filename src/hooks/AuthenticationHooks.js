// const API_BASE_URL = "http://localhost:8080";
const API_BASE_URL = "https://akkorhotel-api.up.railway.app"

async function handleResponse(response) {
    let errorMessage = `HTTP error! status: ${response.status}`;

    try {
        const text = await response.text();
        if (text) {
            const data = JSON.parse(text);
            errorMessage = data.error || data.message || errorMessage;
        }
    } catch (error) {
        console.warn("Error parsing response JSON", error);
    }

    throw new Error(errorMessage);
}

export async function verifyEmail(token) {
    const response = await fetch(`${API_BASE_URL}/auth/confirm-email?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) await handleResponse(response);
    return response.json();
}

export async function sendValidationEmailAgain(email) {
    const response = await fetch(`${API_BASE_URL}/auth/resend-confirmation-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) await handleResponse(response);
    return response.json();
}

export async function login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) await handleResponse(response);

    const data = await response.json();

    if (data.token) {
        localStorage.setItem("authToken", data.token);
    }

    return data;
}

export async function register(username, email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) await handleResponse(response);

    return response.json();
}

export async function resendConfirmationEmail(email) {
    const response = await fetch(`${API_BASE_URL}/auth/resend-confirmation-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) await handleResponse(response);

    return response.json();
}

export async function confirmEmail(token) {
    const response = await fetch(`${API_BASE_URL}/auth/confirm-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
    });

    if (!response.ok) await handleResponse(response);

    return response.json();
}