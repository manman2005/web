import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { saveToken } from './authUtils';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // เพิ่ม state สำหรับข้อความข้อผิดพลาด
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // ล้างข้อความข้อผิดพลาดเก่า

    // Client-side Validation
    if (!username || !password) {
      setErrorMessage('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }

    if (username.length < 3) {
      setErrorMessage('ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 3 ตัวอักษร');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });

      const { token } = response.data;
      saveToken(token);
      
      const decoded = jwtDecode(token);
      login(decoded.user);
      navigate('/');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ'); // แสดงข้อความข้อผิดพลาดใน UI
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          เข้าสู่ระบบ
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Username</label>
            <input
              type="text"
              placeholder="กรอกชื่อผู้ใช้"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrorMessage(''); // ล้างข้อความข้อผิดพลาดเมื่อมีการเปลี่ยนแปลง
              }}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              type="password"
              placeholder="กรอกรหัสผ่าน"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage(''); // ล้างข้อความข้อผิดพลาดเมื่อมีการเปลี่ยนแปลง
              }}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          {errorMessage && ( // แสดงข้อความข้อผิดพลาดถ้ามี
            <p className="text-red-500 text-sm text-center">{errorMessage}</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition duration-200"
          >
            เข้าสู่ระบบ
          </button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-4">
          ยังไม่มีบัญชี? <a href="/register" className="text-blue-500 hover:underline">สมัครสมาชิก</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
