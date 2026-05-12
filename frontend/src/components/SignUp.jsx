import { Form, Link, redirect, useActionData } from "react-router-dom";
import { useState } from "react";
import './SignUp.css';
import { createUserAtServer } from "../services/hostelService";

const SignUp = () => {
    const actionData=useActionData();
    const errorMessage=actionData?.message || null;
    const validationErrors = actionData?.errors || [];
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        studentID: '',
        adminId: '',
        userType: 'student'
    });
    const [passwordChecks, setPasswordChecks] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });
    const [isLoading, setIsLoading] = useState(false);

    const errorMap = {};
    validationErrors.forEach(err => {
        errorMap[err.param] = err.msg;
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'password') {
            setPasswordChecks({
                length: value.length >= 8,
                uppercase: /[A-Z]/.test(value),
                lowercase: /[a-z]/.test(value),
                number: /\d/.test(value),
                special: /[@$!%*?&]/.test(value)
            });
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <div className="signup-header">
                    <h1 className="signup-title">Create Account</h1>
                    <p className="signup-subtitle">Join us today and get started</p>
                </div>
                <div>
                    {(errorMessage!==null)&& <div className="sign-up-error">{errorMessage}</div> }
                </div>

                <Form method="POST" className="signup-form">
                    <div className="form-group">
                        <label htmlFor="userName" className="form-label">
                            <span className="label-icon">👤</span>
                            Username
                        </label>
                        <input
                            type="text"
                            name="userName"
                            id="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            className="form-input"
                            required
                        />
                        {errorMap['data.userName'] && <div className="error">{errorMap['data.userName']}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            <span className="label-icon">📧</span>
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="form-input"
                            required
                        />
                        {errorMap['data.email'] && <div className="error">{errorMap['data.email']}</div>}
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
                            placeholder="Create a strong password"
                            className="form-input"
                            required
                        />
                        <div className="password-requirements">
                            <div className={`requirement ${passwordChecks.length ? 'met' : ''}`}>
                                ✓ At least 8 characters
                            </div>
                            <div className={`requirement ${passwordChecks.uppercase ? 'met' : ''}`}>
                                ✓ One uppercase letter
                            </div>
                            <div className={`requirement ${passwordChecks.lowercase ? 'met' : ''}`}>
                                ✓ One lowercase letter
                            </div>
                            <div className={`requirement ${passwordChecks.number ? 'met' : ''}`}>
                                ✓ One number
                            </div>
                            <div className={`requirement ${passwordChecks.special ? 'met' : ''}`}>
                                ✓ One special character (@$!%*?&)
                            </div>
                        </div>
                        {errorMap['data.password'] && <div className="error">{errorMap['data.password']}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <span className="label-icon">🎓</span>
                            Register as
                        </label>
                        <div className="role-selector">
                            <label className="role-option">
                                <input
                                    type="radio"
                                    name="userType"
                                    value="student"
                                    checked={formData.userType === 'student'}
                                    onChange={handleChange}
                                />
                                Student
                            </label>
                            <label className="role-option">
                                <input
                                    type="radio"
                                    name="userType"
                                    value="admin"
                                    checked={formData.userType === 'admin'}
                                    onChange={handleChange}
                                />
                                Admin
                            </label>
                        </div>
                    </div>

                    {formData.userType === 'student' && (
                        <div className="form-group fade-in">
                            <label htmlFor="studentId" className="form-label">
                                <span className="label-icon">🆔</span>
                                Student ID
                            </label>
                            <input
                                type="text"
                                name="studentID"
                                id="studentID"
                                value={formData.studentID}
                                onChange={handleChange}
                                placeholder="Enter your student ID"
                                className="form-input"
                                required={formData.userType === 'student'}
                            />
                            {errorMap['data.studentID'] && <div className="error">{errorMap['data.studentID']}</div>}
                        </div>
                    )}

                    {formData.userType === 'admin' && (
                        <div className="form-group fade-in">
                            <label htmlFor="adminId" className="form-label">
                                <span className="label-icon">🆔</span>
                                Admin ID
                            </label>
                            <input
                                type="text"
                                name="adminId"
                                id="adminId"
                                value={formData.adminId}
                                onChange={handleChange}
                                placeholder="Enter your admin ID"
                                className="form-input"
                                required={formData.userType === 'admin'}
                            />
                            {errorMap['data.adminId'] && <div className="error">{errorMap['data.adminId']}</div>}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`signup-btn ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Creating Account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </Form>

                <div className="signup-footer">
                    <p className="signin-link">
                        Already have an account?
                        <Link to="/signin" className="link"> Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export const postSignUp = async (data) => {
    //console.log(data)
    const formData = await data.request.formData();
    const signData = Object.fromEntries(formData);
    // Add your signup logic here
    const res=await createUserAtServer(signData);
    console.log(res)
    if(res.errors){
        return { errors: res.errors };
    }
    if(res.message){
        return { message: res.message };
    }
    return redirect('/sign-in');
};

export default SignUp;