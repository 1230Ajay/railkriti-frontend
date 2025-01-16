import React, { useState } from 'react';
import TextInput from './text-fields/TextInput';

const LoginForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Handle login logic here
        console.log('Logging in with:', { username, password });
    };

    const handleForgotPassword = () => {
        // Handle forgot password logic here
        console.log('Forgot password');
    };

    const handleSignup = () => {
        // Handle signup logic here
        console.log('Signing up');
    };

    return (
        <div className="max-w-xs mx-auto mt-8 p-4 bg-gray-900 rounded-md shadow-md">
            <h2 className="text-white text-2xl font-bold mb-4">Login</h2>
            <TextInput
                label="Username"
                htmlFor="username"
                value={username}
                onChange={setUsername}
                className="mb-4"
                required
            />
            <TextInput
                label="Password"
                htmlFor="password"
                value={password}
                onChange={setPassword}
                type="password"
                className="mb-4"
                required
            />
            <div className="flex justify-between items-center">
                <button onClick={handleLogin} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Login
                </button>
                <div className="flex space-x-2">
                    <button onClick={handleForgotPassword} className="text-gray-400 hover:text-gray-300 focus:outline-none">
                        Forgot Password
                    </button>
                    <button onClick={handleSignup} className="text-gray-400 hover:text-gray-300 focus:outline-none">
                        Signup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
