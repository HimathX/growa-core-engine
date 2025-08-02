import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faApple } from '@fortawesome/free-brands-svg-icons';
import { faSpinner, faExclamationTriangle, faCheck } from '@fortawesome/free-solid-svg-icons';
import App from './App';
import Signup from './Signup.jsx';

const SignIn = () => {
        const [email, setEmail] = React.useState('');
        const [password, setPassword] = React.useState('');
        const [isAuthenticated, setIsAuthenticated] = React.useState(false);
        const [showSignup, setShowSignup] = React.useState(false);
        const [isLoading, setIsLoading] = React.useState(false);
        const [message, setMessage] = React.useState('');
        const [messageType, setMessageType] = React.useState('');
        const [userToken, setUserToken] = React.useState(null);
        const [userData, setUserData] = React.useState(null);

        const handleEmailChange = (e) => setEmail(e.target.value);
        const handlePasswordChange = (e) => setPassword(e.target.value);

        const handleSignupClick = (e) => {
                e.preventDefault();
                setShowSignup(true);
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

                // Basic validation
                if (!email.trim()) {
                        showMessage('Please enter your username or email', 'error');
                        return;
                }
                if (!password.trim()) {
                        showMessage('Please enter your password', 'error');
                        return;
                }

                setIsLoading(true);

                try {
                        console.log('🔐 Attempting to login...');
                        console.log('📡 API Endpoint: http://127.0.0.1:8081/auth/login');

                        const response = await fetch('http://127.0.0.1:8081/auth/login', {
                                method: 'POST',
                                headers: {
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json',
                                },
                                body: JSON.stringify({
                                        username_or_email: email.trim(),
                                        password: password
                                }),
                        });

                        console.log('📊 Response status:', response.status);

                        const data = await response.json();
                        console.log('📄 Response data:', data);

                        if (response.ok) {
                                console.log('✅ Login successful:', data);
                                showMessage('🎉 Login successful! Welcome back!', 'success');

                                // Store authentication data
                                setUserToken(data.access_token);
                                setUserData({
                                        user_id: data.user_id,
                                        crop_id: data.crop_id,
                                        token_type: data.token_type
                                });

                                // Store in localStorage for persistence
                                localStorage.setItem('access_token', data.access_token);
                                localStorage.setItem('user_id', data.user_id);
                                if (data.crop_id) {
                                        localStorage.setItem('crop_id', data.crop_id);
                                }

                                // Dispatch custom event to notify other components about user change
                                window.dispatchEvent(new CustomEvent('userChanged', {
                                        detail: { userId: data.user_id, action: 'login' }
                                }));

                                console.log('🎉 User logged in successfully:', data.user_id);

                                // Clear form
                                setEmail('');
                                setPassword('');

                                // Redirect to dashboard after short delay
                                setTimeout(() => {
                                        setIsAuthenticated(true);
                                }, 1000);

                        } else {
                                console.error('❌ Login failed:', data);

                                if (data.detail) {
                                        if (data.detail.includes('Incorrect username/email or password')) {
                                                showMessage('Invalid username/email or password. Please try again.', 'error');
                                        } else {
                                                showMessage(data.detail, 'error');
                                        }
                                } else {
                                        showMessage('Login failed. Please try again.', 'error');
                                }
                        }
                } catch (error) {
                        console.error('🔥 Login error:', error);

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

        // Check for existing authentication on component mount
        React.useEffect(() => {
                const token = localStorage.getItem('access_token');
                const userId = localStorage.getItem('user_id');

                console.log('🔍 Signin component mounted - checking for existing auth...');
                console.log('access_token found:', token ? 'YES' : 'NO');
                console.log('user_id found:', userId ? 'YES' : 'NO');

                if (token && userId) {
                        console.log('🔍 Found existing authentication, logging in...');
                        setUserToken(token);
                        setUserData({
                                user_id: userId,
                                crop_id: localStorage.getItem('crop_id'),
                                token_type: 'bearer'
                        });
                        setIsAuthenticated(true);
                } else {
                        console.log('🚫 No existing authentication found');
                }
        }, []);

        // If authenticated, render the main App
        if (isAuthenticated) {
                return <App userToken={userToken} userData={userData} />;
        }

        // If showSignup is true, render the Signup component
        if (showSignup) {
                return <Signup onBackToSignin={() => setShowSignup(false)} />;
        }

        return (
                <>
                        <div className="signin-container">
                                <div className="signin-form">
                                        <h2>Sign in to</h2>
                                        <h1 className="logo">growa</h1>
                                        <p>
                                                Don't have an account? <a href="#" onClick={handleSignupClick}>Create an account</a><br />
                                                It takes less than a minute!
                                        </p>

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

                                        <form onSubmit={handleSubmit}>
                                                <input
                                                        type="text"
                                                        placeholder="Username or Email"
                                                        value={email}
                                                        onChange={handleEmailChange}
                                                        disabled={isLoading}
                                                        required
                                                />
                                                <input
                                                        type="password"
                                                        placeholder="Password"
                                                        value={password}
                                                        onChange={handlePasswordChange}
                                                        disabled={isLoading}
                                                        required
                                                />
                                                <a href="#" className="forgot-password">Forgot password?</a>

                                                <button type="submit" className="btn primary-btn" disabled={isLoading}>
                                                        {isLoading ? (
                                                                <>
                                                                        <FontAwesomeIcon icon={faSpinner} className="spinner" />
                                                                        Signing in...
                                                                </>
                                                        ) : (
                                                                'Sign in'
                                                        )}
                                                </button>
                                        </form>

                                        <button className="btn google-btn" disabled={isLoading}>
                                                <FontAwesomeIcon icon={faGoogle} /> Sign in with Google
                                        </button>
                                        <button className="btn apple-btn" disabled={isLoading}>
                                                <FontAwesomeIcon icon={faApple} /> Sign in with Apple ID
                                        </button>
                                </div>
                        </div>
                        <style>
                                {`body {
                    margin: 0;
                    font-family: 'Poppins', sans-serif;
                    background-color: #f8fef7;
                    background-image: url('./Frame 20.png');
                    background-size: 90%;
                    background-repeat: no-repeat;
                }

                .signin-container {
                    position: absolute;
                    top: 0%;
                    left: 10%;
                    display: flex;
                    height: 100vh;
                    align-items: center;
                    justify-content: center;
                }

                .signin-container a {
                    text-decoration: underline;
                    color: #555;
                }

                .signin-form {
                    width: 400px;
                    padding: 2rem;
                }

                .signin-form h2 {
                    text-align: center;
                    margin-bottom: 0.2rem;
                    font-size: 3.0rem;
                    font-weight: 600;
                }

                .signin-form h1 {
                    text-align: center;
                    color: #1a8f3d;
                    font-size: 2.5rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                }

                .logo {
                    color: #1a8f3d;
                    font-size: 2rem;
                    margin-bottom: 1rem;
                }

                .signin-form p {
                    color: #555;
                    font-size: 0.9rem;
                    text-align: center;
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

                .signin-form input {
                    width: 100%;
                    padding: 0.8rem;
                    margin: 10px 0;
                    border-radius: 8px;
                    border: 1px solid #ccc;
                    font-size: 1rem;
                    transition: border-color 0.3s ease;
                }

                .signin-form input:focus {
                    outline: none;
                    border-color: #1a8f3d;
                    box-shadow: 0 0 0 2px rgba(26, 143, 61, 0.1);
                }

                .signin-form input:disabled {
                    background-color: #f5f5f5;
                    cursor: not-allowed;
                }

                .forgot-password {
                    display: block;
                    text-align: center;
                    font-size: 0.8rem;
                    font-weight: 500;
                    margin-bottom: 1rem;
                    text-decoration: underline;
                }

                .btn {
                    width: 100%;
                    padding: 0.8rem;
                    margin: 8px 0;
                    border-radius: 8px;
                    font-size: 1rem;
                    cursor: pointer;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    transition: background-color 0.3s ease;
                }

                .primary-btn {
                    background-color: #1a8f3d;
                    color: white;
                }

                .primary-btn:hover:not(:disabled) {
                    background-color: #157b33;
                }

                .primary-btn:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                }

                .google-btn, .apple-btn {
                    background-color: white;  
                    border: 1px solid #ccc;
                    color: #333;
                }

                .google-btn:hover:not(:disabled), .apple-btn:hover:not(:disabled) {
                    background-color: #f5f5f5;
                }

                .google-btn:disabled, .apple-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .spinner {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .signin-image {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .signin-image img {
                    max-width: 400px;
                    width: 100%;
                }`}
                        </style>
                </>
        );
};

export default SignIn;
