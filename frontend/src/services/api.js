const API_BASE_URL = 'http://localhost:8080/api';

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
}

export async function fetchNotifications() {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        throw new Error('Failed to fetch notifications');
    }
    return response.json();
}

export async function markNotificationAsRead(id) {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: getAuthHeaders()
    });
    if (!response.ok) {
        throw new Error('Failed to update notification');
    }
    return response.json();
}