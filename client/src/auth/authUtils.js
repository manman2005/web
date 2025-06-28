// บริหารจัดการ token mock (localStorage)

export const saveToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const clearToken = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!getToken(); // คืนค่า true ถ้ามี token
};
