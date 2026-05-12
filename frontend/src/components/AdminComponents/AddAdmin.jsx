import { useState } from 'react';
import './AddAdmin.css';

const AddAdmin = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        adminId: '',
        profilePhoto: ''
    });
    const [photoPreview, setPhotoPreview] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            setFormData(prevState => ({ ...prevState, profilePhoto: '' }));
            setPhotoPreview('');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result?.toString() || '';
            setFormData(prevState => ({ ...prevState, profilePhoto: base64 }));
            setPhotoPreview(base64);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const response = await fetch('http://localhost:3001/admin/add-admin', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: formData }),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage('Admin added successfully!');
                setFormData({
                    firstName: '',
                    lastName: '',
                    adminId: '',
                    profilePhoto: ''
                });
                setPhotoPreview('');
            } else {
                setMessage(result.message || 'Failed to add admin');
            }
        } catch (error) {
            console.error('Error adding admin:', error);
            setMessage('An error occurred while adding the admin');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="add-admin-container">
            <div className="add-admin-card">
                <div className="add-admin-header">
                    <h2 className="add-admin-title">Add New Admin</h2>
                    <p className="add-admin-subtitle">Create a new administrator account</p>
                </div>

                {message && (
                    <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="add-admin-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName" className="form-label">
                                <span className="label-icon">👤</span>
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                id="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Enter first name"
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName" className="form-label">
                                <span className="label-icon">👤</span>
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                id="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Enter last name"
                                className="form-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
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
                            placeholder="Enter admin ID"
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="profilePhoto" className="form-label">
                            <span className="label-icon">📷</span>
                            Profile Photo (Optional)
                        </label>
                        <input
                            type="file"
                            name="profilePhotoFile"
                            id="profilePhoto"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="form-input"
                        />
                        {photoPreview && (
                            <img
                                src={photoPreview}
                                alt="Admin profile preview"
                                className="photo-preview"
                            />
                        )}
                    </div>

                    <button
                        type="submit"
                        className={`add-admin-btn ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Adding Admin...
                            </>
                        ) : (
                            'Add Admin'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddAdmin;