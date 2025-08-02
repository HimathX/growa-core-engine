import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTractor, faSpinner, faCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const Signup = ({ onBackToSignin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleNameChange = (e) => setName(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePhoneNumberChange = (e) => setPhoneNumber(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    // Validation functions
    const validatePassword = (password) => {
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const minLength = password.length >= 6;
        return hasUppercase && hasNumber && minLength;
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhoneNumber = (phone) => {
        // Remove all non-digit characters
        const cleanPhone = phone.replace(/\D/g, '');
        // Check if it's a valid length (10-15 digits) and starts with appropriate digits
        return cleanPhone.length >= 10 && cleanPhone.length <= 15;
    };

    const showMessage = (text, type) => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 5000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous messages
        setMessage('');
        setMessageType('');

        // Client-side validation
        if (!name.trim()) {
            showMessage('Please enter your full name', 'error');
            return;
        }
        if (!validateEmail(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }
        if (!username.trim()) {
            showMessage('Please enter a username', 'error');
            return;
        }
        if (username.length < 3) {
            showMessage('Username must be at least 3 characters long', 'error');
            return;
        }
        if (!phoneNumber.trim()) {
            showMessage('Please enter your phone number', 'error');
            return;
        }
        if (!validatePhoneNumber(phoneNumber)) {
            showMessage('Please enter a valid phone number (10-15 digits)', 'error');
            return;
        }
        if (!validatePassword(password)) {
            showMessage('Password must include an uppercase letter, a number, and be at least 6 characters long', 'error');
            return;
        }

        setIsLoading(true);

        try {
            console.log('🚀 Attempting to register user...');
            console.log('📡 API Endpoint: http://127.0.0.1:8081/auth/signup');

            // Match your backend's expected payload structure
            const payload = {
                full_name: name.trim(),
                email: email.trim().toLowerCase(),
                username: username.trim().toLowerCase(),
                phone_number: phoneNumber.trim(),
                password: password
            };

            console.log('📦 Payload:', { ...payload, password: '***hidden***' });

            const response = await fetch('http://127.0.0.1:8081/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            console.log('📊 Response status:', response.status);
            console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

            const data = await response.json();
            console.log('📄 Response data:', data);

            if (response.ok) {
                showMessage('🎉 Account created successfully! Redirecting to sign in...', 'success');
                console.log('✅ User registered successfully:', data);

                // Clear form
                setName('');
                setEmail('');
                setUsername('');
                setPhoneNumber('');
                setPassword('');

                // Redirect to signin after 2 seconds
                setTimeout(() => {
                    onBackToSignin();
                }, 2000);
            } else {
                // Handle specific error messages from your backend
                console.error('❌ Registration failed:', data);

                if (data.detail) {
                    if (data.detail.includes('Email already registered')) {
                        showMessage('This email is already registered. Please use a different email or try signing in.', 'error');
                    } else if (data.detail.includes('Username already taken')) {
                        showMessage('This username is already taken. Please choose a different username.', 'error');
                    } else {
                        showMessage(data.detail, 'error');
                    }
                } else {
                    showMessage('Registration failed. Please try again.', 'error');
                }
            }
        } catch (error) {
            console.error('🔥 Signup error:', error);

            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                showMessage('❌ Cannot connect to server. Please make sure the backend is running on http://127.0.0.1:8081', 'error');
            } else if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
                showMessage('❌ Server response error. Please try again.', 'error');
            } else {
                showMessage('❌ Network error. Please check your connection and try again.', 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="signup-page">
                <div className="left-panel">
                    <FontAwesomeIcon icon={faTractor} className="tractor-icon" />
                    <h2>Sign up for</h2>
                    <h1 className="logo-text">growa</h1>
                    <p className="tagline">You're one step closer to a smarter farming experience!</p>
                </div>

                <div className="right-panel">
                    <form className="signup-form" onSubmit={handleSubmit}>
                        {/* Message Display */}
                        {message && (
                            <div className={`message ${messageType}`}>
                                <FontAwesomeIcon
                                    icon={messageType === 'success' ? faCheck : faExclamationTriangle}
                                    className="message-icon"
                                />
                                {message}
                            </div>
                        )}

                        <label>Your Name</label>
                        <input
                            type="text"
                            placeholder="First Last"
                            value={name}
                            onChange={handleNameChange}
                            disabled={isLoading}
                            required
                            minLength="2"
                        />

                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="you@mail.com"
                            value={email}
                            onChange={handleEmailChange}
                            disabled={isLoading}
                            required
                        />

                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="first_last"
                            value={username}
                            onChange={handleUsernameChange}
                            disabled={isLoading}
                            required
                            minLength="3"
                        />

                        <label>Phone Number</label>
                        <input
                            type="tel"
                            placeholder="+94 71 234 5678"
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            disabled={isLoading}
                            required
                        />

                        <label>Password</label>
                        <p className="password-note">
                            Must include an uppercase letter, a number, and be at least 6 characters long.
                        </p>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="********"
                                value={password}
                                onChange={handlePasswordChange}
                                disabled={isLoading}
                                required
                                minLength="6"
                            />
                            <FontAwesomeIcon
                                icon={faEye}
                                className="eye-icon"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                        </div>

                        <button type="submit" className="next-button" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} className="spinner" />
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>

                        <p className="back-to-signin">
                            Already have an account? <a href="#" onClick={onBackToSignin}>Back to Sign In</a>
                        </p>
                    </form>
                </div>
            </div>
            <style>
                {`
                .body{
                    margin: 0;
                    background-image: url('./Frame 19.png');
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                }

                .signup-page {
                    display: flex;
                    height: 100vh;
                    background-color: #f8fef7;
                    font-family: 'Poppins', sans-serif;
                    justify-content: center;
                    align-items: center;
                    padding: 2rem;
                }

                .left-panel {
                    position: absolute;
                    top: 50%;
                    left:20%;
                    flex: 1;
                    text-align: center;
                    color: #1a8f3d;
                    transform: translateY(-50%);
                }
                
                .left-panel p{
                    text-align: center;
                    margin: 0 auto;
                    font-size: 1.1rem;
                    color: #1a8f3d;
                }

                .tractor-icon {
                    font-size: 3.5rem;
                    margin-bottom: 1rem;
                }

                .logo-text {
                    font-size: 2rem;
                    font-weight: 700;
                    margin: 0.5rem 0;
                }

                .tagline {
                    font-size: 0.95rem;
                    color: #0d5c29;
                    max-width: 260px;
                    margin: 0 auto;
                }

                .right-panel {
                    position: absolute;
                    top: 10%;
                    right: 15%;
                    background-color: white;
                    padding: 2rem;
                    border-radius: 20px;
                    width: 420px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }

                .signup-form {
                    display: flex;
                    flex-direction: column;
                }

                .message {
                    padding: 0.75rem;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    line-height: 1.4;
                }

                .message.success {
                    background-color: #d4edda;
                    color: #155724;
                    border: 1px solid #c3e6cb;
                }

                .message.error {
                    background-color: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                }

                .message-icon {
                    font-size: 1rem;
                    flex-shrink: 0;
                }

                .signup-form label {
                    font-weight: 600;
                    margin-top: 1rem;
                    margin-bottom: 0.3rem;
                    font-size: 0.95rem;
                }

                .signup-form input {
                    padding: 0.75rem;
                    border-radius: 10px;
                    border: 1px solid #e0e0e0;
                    font-size: 1rem;
                    transition: border-color 0.3s ease;
                }

                .signup-form input:focus {
                    outline: none;
                    border-color: #1a8f3d;
                    box-shadow: 0 0 0 2px rgba(26, 143, 61, 0.1);
                }

                .signup-form input:disabled {
                    background-color: #f5f5f5;
                    cursor: not-allowed;
                }

                .password-note {
                    font-size: 0.8rem;
                    color: #555;
                    margin: 0.3rem 0 0.5rem;
                }

                .password-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .password-wrapper input {
                    width: 100%;
                    padding-right: 2.5rem;
                }

                .eye-icon {
                    position: absolute;
                    right: 10px;
                    color: #888;
                    cursor: pointer;
                    transition: color 0.3s ease;
                }

                .eye-icon:hover {
                    color: #1a8f3d;
                }

                .next-button {
                    margin-top: 1.5rem;
                    background-color: #1a8f3d;
                    color: white;
                    font-size: 1rem;
                    font-weight: 500;
                    padding: 0.9rem;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }

                .next-button:hover:not(:disabled) {
                    background-color: #157b33;
                }

                .next-button:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                }

                .spinner {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .back-to-signin {
                    text-align: center;
                    margin-top: 1rem;
                    color: #666;
                    font-size: 0.9rem;
                }

                .back-to-signin a {
                    color: #1a8f3d;
                    text-decoration: underline;
                    cursor: pointer;
                    font-weight: 500;
                    transition: color 0.3s ease;
                }

                .back-to-signin a:hover {
                    color: #157b33;
                    text-decoration: none;
                }   
                `}
            </style>
        </>
    );
};

export default Signup;
