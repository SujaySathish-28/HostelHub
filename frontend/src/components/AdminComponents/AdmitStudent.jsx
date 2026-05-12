import { useState } from 'react';
import { Form, redirect } from 'react-router-dom';
import { postAdmit } from '../../services/adminServices';

const AdmitStudent = () => {
    const [formData, setFormData] = useState({
        studentID: '',
        firstName: '',
        lastName: '',
        address: '',
        branch: '',
        year: '',
        roomNo: '',
        totalFee: '',
        feePaid: '',
        profilePhoto: ''
    });

    const [photoPreview, setPhotoPreview] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add API call here to submit the form data
        setSubmitted(true);
        
        // Reset form after 2 seconds
        setTimeout(() => {
            setFormData({
                studentID: '',
                firstName: '',
                lastName: '',
                address: '',
                branch: '',
                year: '',
                roomNo: '',
                totalFee: '',
                feePaid: '',
                profilePhoto: ''
            });
            setPhotoPreview('');
            setSubmitted(false);
        }, 2000);
    };

    return (
        <div style={styles.container}>
            <div style={styles.formWrapper}>
                <h2 style={styles.heading}>Admit Student</h2>
                
                {submitted && (
                    <div style={styles.successMessage}>
                        ✓ Student admitted successfully!
                    </div>
                )}

                <Form method='POST' style={styles.form}>
                    <div style={styles.formGroup}>
                        <label htmlFor="studentID" style={styles.label}>Student ID *</label>
                        <input
                            type="text"
                            id="studentID"
                            name="studentID"
                            value={formData.studentID}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            placeholder="Enter student ID"
                        />
                    </div>

                    <div style={styles.row}>
                        <div style={styles.formGroup}>
                            <label htmlFor="firstName" style={styles.label}>First Name *</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                style={styles.input}
                                placeholder="Enter first name"
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label htmlFor="lastName" style={styles.label}>Last Name *</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                style={styles.input}
                                placeholder="Enter last name"
                            />
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="address" style={styles.label}>Address *</label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            style={{...styles.input, minHeight: '80px', resize: 'vertical'}}
                            placeholder="Enter address"
                        />
                    </div>

                    <div style={styles.row}>
                        <div style={styles.formGroup}>
                            <label htmlFor="branch" style={styles.label}>Branch *</label>
                            <select
                                id="branch"
                                name="branch"
                                value={formData.branch}
                                onChange={handleChange}
                                required
                                style={styles.input}
                            >
                                <option value="">Select Branch</option>
                                <option value="CSE">Computer Science Engineering</option>
                                <option value="ECE">Electronics & Communication</option>
                                <option value="AD">Artificial Intelligence and Data Science</option>
                                <option value="ML">Artificial Intelligence and Machine Learning</option>
                                <option value="ME">Mechanical Engineering</option>
                                <option value="CE">Civil Engineering</option>
                                <option value="EE">Electrical Engineering</option>
                            </select>
                        </div>

                        <div style={styles.formGroup}>
                            <label htmlFor="year" style={styles.label}>Year *</label>
                            <select
                                id="year"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                required
                                style={styles.input}
                            >
                                <option value="">Select Year</option>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div style={styles.formGroup}>
                            <label htmlFor="totalFee" style={styles.label}>Total Fee *</label>
                            <input
                                type="number"
                                id="totalFee"
                                name="totalFee"
                                value={formData.totalFee}
                                onChange={handleChange}
                                required
                                min="0"
                                style={styles.input}
                                placeholder="Enter total fee"
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label htmlFor="feePaid" style={styles.label}>Fee Paid *</label>
                            <input
                                type="number"
                                id="feePaid"
                                name="feePaid"
                                value={formData.feePaid}
                                onChange={handleChange}
                                required
                                min="0"
                                style={styles.input}
                                placeholder="Enter amount paid"
                            />
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="roomNo" style={styles.label}>Room Number *</label>
                        <input
                            type="text"
                            id="roomNo"
                            name="roomNo"
                            value={formData.roomNo}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            placeholder="Enter room number"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="profilePhoto" style={styles.label}>Student Profile Photo</label>
                        <input
                            type="file"
                            id="profilePhoto"
                            name="profilePhotoFile"
                            accept="image/*"
                            capture="user"
                            onChange={handleFileChange}
                            style={styles.input}
                        />
                        <input type="hidden" name="profilePhoto" value={formData.profilePhoto} />
                        {photoPreview && (
                            <img
                                src={photoPreview}
                                alt="Student profile preview"
                                style={styles.photoPreview}
                            />
                        )}
                    </div>

                    <button type="submit" style={styles.submitBtn}>
                        Admit Student
                    </button>
                </Form>
            </div>
        </div>
    );
};


export const admitAction=async (data)=>{
    const formData=await data.request.formData();
    const admitData=Object.fromEntries(formData);
    await postAdmit(admitData);
    return redirect('/admin/modules');
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#f5f5f5'
    },
    formWrapper: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '600px'
    },
    heading: {
        textAlign: 'center',
        color: '#ac3636',
        marginBottom: '30px',
        fontSize: '28px',
        fontWeight: '600'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    row: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px'
    },
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '4px'
    },
    input: {
        padding: '10px 12px',
        border: '1px solid #fffefe',
        borderRadius: '4px',
        fontSize: '14px',
        fontFamily: 'inherit',
        transition: 'border-color 0.3s ease',
        boxSizing: 'border-box'
    },
    submitBtn: {
        padding: '12px 24px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '20px',
        transition: 'background-color 0.3s ease'
    },
    photoPreview: {
        marginTop: '12px',
        width: '100px',
        height: '100px',
        objectFit: 'cover',
        borderRadius: '12px',
        border: '1px solid rgba(0, 0, 0, 0.1)'
    },
    successMessage: {
        padding: '12px 16px',
        backgroundColor: '#d4edda',
        color: '#155724',
        borderRadius: '4px',
        marginBottom: '20px',
        fontSize: '14px',
        fontWeight: '500',
        textAlign: 'center'
    }
};

export default AdmitStudent;