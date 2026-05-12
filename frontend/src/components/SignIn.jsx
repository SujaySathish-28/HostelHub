import { Form, Link, redirect, useActionData, useNavigation } from 'react-router-dom';
import { useState } from 'react';
import './SignIn.css';
import { signIn } from '../services/hostelService';

const SignIn = () => {
    const actionData = useActionData();
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        userName: '',
        password: ''
    });
    const [userType, setUserType] = useState(null);

    const errorMessage = actionData?.error || actionData?.message || '';
    const isLoading = navigation.state === 'submitting';

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleUserType = (type) => () => setUserType(type);


    return (
        <div className="signin-container">
            <div className="signin-card">
                <div className="signin-header">
                    <h1 className="signin-title">Welcome Back</h1>
                    <p className="signin-subtitle">Sign in to your account</p>
                </div>

                {errorMessage && (
                    <div className="error-box" role="alert">
                        <strong>Login error:</strong> {errorMessage}
                    </div>
                )}

                <Form method="POST" className="signin-form">
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">
                            <span className="label-icon">👤</span>
                            Username
                        </label>
                        <input
                            type="text"
                            name="userName"
                            id="username"
                            value={formData.userName}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            <span className="label-icon">🔒</span>
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="form-input"
                            required
                        />
                        <Link to="/forgot-password" className="forgot-password">
                            Forgot Password?
                        </Link>
                    </div>

                    <div className="button-group">
                        <button
                            type="submit"
                            name="userType"
                            value="student"
                            onClick={handleUserType('student')}
                            className={`signin-btn btn-student ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading  ? (
                                <>
                                    <span className="spinner"></span>
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    <span className="btn-icon">🎓</span>
                                    Sign In 
                                </>
                            )}
                        </button>

                        {/* <button
                            type="submit"
                            name="userType"
                            value="admin"
                            onClick={handleUserType('admin')}
                            className={`signin-btn btn-admin ${isLoading && userType === 'admin' ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading && userType === 'admin' ? (
                                <>
                                    <span className="spinner"></span>
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    <span className="btn-icon">⚙️</span>
                                    Sign In as Admin
                                </>
                            )}
                        </button> */}
                    </div>
                </Form>

                <div className="signin-footer">
                    <p className="signup-link">
                        Don't have an account?
                        <Link to="/sign-up" className="link"> Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export const postSignIn = async (data) => {
    const formData = await data.request.formData();
    const signData = Object.fromEntries(formData);
    const response = await signIn(signData);

    const hasError = response?.status !== 200 || response?.payload?.error || response?.payload?.success === false;
    if (hasError) {
        const errorMessage = response?.payload?.error || response?.payload?.message || 'Login failed. Please check your credentials.';
        return new Response(JSON.stringify({ error: errorMessage }), { status: response?.status || 400, headers: { 'Content-Type': 'application/json' } });
    }
    if(response.payload.userType==='student'){
        return redirect('/student');
    }else if(response.payload.userType==='admin'){
        return redirect('/admin');
    }
    
};

export default SignIn;