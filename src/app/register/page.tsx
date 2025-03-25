'use client';

import { TextField, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useState } from "react";

export default function RegisterPage() {
    const [first_name, setFirstname] = useState('');
    const [last_name, setLastname] = useState('');
    const [tel, setTel] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedpassword, setConfirmedPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handlerFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setFirstname(event.target.value);
    const handlerLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setLastname(event.target.value);
    const handlerTelChange = (event: React.ChangeEvent<HTMLInputElement>) => setTel(event.target.value);
    const handlerEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);
    const handlerPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);
    const handlerConfirmedPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => setConfirmedPassword(event.target.value);

    const togglePasswordVisibility = () => setShowPassword(prev => !prev);

    const registerUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Frontend validation
        if (password !== confirmedpassword) {
            setError('Passwords do not match');
            return;
        }

        if(!first_name || !email || !password || !confirmedpassword || !last_name || !tel){
            setError("Please complete all inputs");
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    first_name: first_name,
                    last_name: last_name,
                    tel: tel,
                    email: email,
                    password: password,
                    role: 'user'
                })
            });

            // Better error handling
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Registration failed');
            }

            const data = await response.json();
            setSuccess(data.message || 'Registration successful');
            setError('');
            
            // Optional: Clear form on success
            setFirstname('');
            setLastname('');
            setTel('');
            setEmail('');
            setPassword('');
            setConfirmedPassword('');

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during registration');
            setSuccess('');
            console.error('Registration error:', err);
        }
    };

    return (
        <main className="w-[100%] flex flex-col items-center space-y-2 ">
            <div className="text-[30px] font-bold font-sans mt-10">Register</div>
            <form onSubmit={registerUser}>
                <div className="bg-slate-100 rounded-lg flex flex-col justify-center w-fit space-y-10 p-10 shadow-lg shadow-gray-500 mx-10">
                    <TextField
                        type="text"
                        variant="standard"
                        name="first_name"
                        label="First Name"
                        value={first_name}
                        onChange={handlerFirstNameChange}
                        fullWidth
                    />
                    <TextField
                        type="text"
                        variant="standard"
                        name="last_name"
                        label="Last Name"
                        value={last_name}
                        onChange={handlerLastNameChange}
                        fullWidth
                    />
                    <TextField
                        type="tel"
                        variant="standard"
                        name="tel"
                        label="Telephone"
                        value={tel}
                        onChange={handlerTelChange}
                        fullWidth
                    />
                    <TextField
                        type="email"
                        variant="standard"
                        name="email"
                        label="Email"
                        value={email}
                        onChange={handlerEmailChange}
                        fullWidth
                    />
                    <div className="relative w-full items-center flex">
                        <TextField
                            type={showPassword ? 'text' : 'password'}
                            variant="standard"
                            name="password"
                            label="Password"
                            value={password}
                            onChange={handlerPasswordChange}
                            fullWidth
                        />
                        <IconButton
                            onClick={togglePasswordVisibility}
                            className="absolute right-0"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </div>
                    <div className="relative w-full items-center flex">
                        <TextField
                            type={showPassword ? 'text' : 'password'}
                            variant="standard"
                            name="confirmedpassword"
                            label="Confirm Password"
                            value={confirmedpassword}
                            onChange={handlerConfirmedPasswordChange}
                            fullWidth
                        />
                        <IconButton
                            onClick={togglePasswordVisibility}
                            className="absolute right-0"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </div>
                </div>
                <div className="flex items-center justify-center mt-10">
                    <button
                        type="submit"
                        className="w-auto h-auto p-2 bg-blue-400 text-white rounded-lg w-[120px] h-[40px] font-bold shadow-lg
                        transform transition-transform duration-500 hover:scale-[1.01] hover:bg-blue-600">
                        Create Account
                    </button>
                </div>
                {error && <div className="text-red-500 text-center mt-5">{error}</div>}
                {success && <div className="text-green-500 text-center mt-5">{success}</div>}
            </form>
        </main>
    );
}