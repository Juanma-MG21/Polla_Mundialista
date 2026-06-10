export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getUserDisplayName(user) {
  if (!user) return 'Usuario';
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
  return fullName || user.username || 'Usuario';
}

export async function fetchCurrentUser() {
  const token = localStorage.getItem('token');
  if (!token) return getStoredUser();

  try {
    const response = await fetch('http://localhost:3000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.data) {
        localStorage.setItem('user', JSON.stringify(data.data));
        return data.data;
      }
    }
  } catch {
    // Usar datos locales si la API no responde
  }

  return getStoredUser();
}
