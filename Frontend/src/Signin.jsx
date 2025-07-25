import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faApple } from '@fortawesome/free-brands-svg-icons';
import App from './App';
import Signup from './Signup.jsx';

const SignIn = () => {
        const [email, setEmail] = React.useState('');
        const [password, setPassword] = React.useState('');
        const [isAuthenticated, setIsAuthenticated] = React.useState(false);
        const [showSignup, setShowSignup] = React.useState(false);

        const handleEmailChange = (e) => setEmail(e.target.value);
        const handlePasswordChange = (e) => setPassword(e.target.value);

        const handleSignupClick = (e) => {
                e.preventDefault();
                setShowSignup(true);
        };

        const handleSubmit = (e) => {
                e.preventDefault();

                // Dummy authentication logic
                if (email === 'admin' && password === '1234') {
                        console.log('Login successful! Redirecting to dashboard...');
                        setIsAuthenticated(true);
                } else {

                        alert('Invalid credentials! Please use:\nUsername: admin\nPassword: 1234');
                        console.log('Login failed - Invalid credentials');
                }

                console.log('Login attempt - Email:', email, 'Password:', password);
        };



        // If authenticated, render the main App
        if (isAuthenticated) {
                return <App />;
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
                                                Don’t have an account? <a href="#" onClick={handleSignupClick}>Create an account</a><br />
                                                It takes less than a minute!
                                        </p>

                                        <form onSubmit={handleSubmit}>
                                                <input
                                                        type="text"
                                                        placeholder="Username or Email "
                                                        value={email}
                                                        onChange={handleEmailChange}
                                                        required
                                                />
                                                <input
                                                        type="password"
                                                        placeholder="Password "
                                                        value={password}
                                                        onChange={handlePasswordChange}
                                                        required
                                                />
                                                <a href="#" className="forgot-password">Forgot password?</a>
                                                <button type="submit" className="btn primary-btn">Sign in</button>
                                        </form>
                                        <button className="btn google-btn">
                                                <FontAwesomeIcon icon={faGoogle} /> Sign in with Google
                                        </button>
                                        <button className="btn apple-btn">
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
                        /* Changed from center to top center */
                        }

                .signin-container {
                        position:absolute;
                        top:0%;
                        left:10%;
                        display: flex;
                        height: 100vh;
                        align-items: center;
                        justify-content: center;
                        }
                .signin-container a {
                        text-decoration:underline;
                        color:#555;
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

                .signin-form input {
                        width: 100%;
                        padding: 0.8rem;
                        margin: 10px 0;
                        border-radius: 8px;
                        border: 1px solid #ccc;
                        font-size: 1rem;
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
                        }

                .primary-btn {
                        background-color: #1a8f3d;
                        color: white;
                        }
                .primary-btn:hover {
                        transition: background-color 0.5s ease;

                .google-btn, .apple-btn {
                        background-color: white;  
                        border: 1px solid #ccc;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        }
                .google-btn:hover, .apple-btn:hover {
                        transition: background-color 0.3s ease;

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
