import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTractor } from '@fortawesome/free-solid-svg-icons';

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const handleNameChange = (e) => setName(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle signup logic here
        console.log('Name:', name, 'Email:', email, 'Username:', username, 'Password:', password);
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
                    <form className="signup-form">
                        <label>Your Name</label>
                        <input type="text" placeholder="First Last" value={name} onChange={handleNameChange} />

                        <label>Email</label>
                        <input type="email" placeholder="you@mail.com" value={email} onChange={handleEmailChange} />

                        <label>Username</label>
                        <input type="text" placeholder="first_last" value={username} onChange={handleUsernameChange} />

                        <label>Password</label>
                        <p className="password-note">
                            Must include an uppercase letter and a number. Don’t forget your password!
                        </p>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="********"
                            />
                            <FontAwesomeIcon
                                icon={faEye}
                                className="eye-icon"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                        </div>

                        <button type="submit" className="next-button">Next</button>
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
                    top: 15%;
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
                }
                .eye-icon {
                    cursor: pointer;
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
                    }

                .next-button:hover {
                    background-color: #157b33;
                    }   
                `}
            </style>
        </>
    );
};

export default Signup;
