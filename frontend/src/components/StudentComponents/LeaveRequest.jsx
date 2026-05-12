import { Form, redirect, useActionData } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './LeaveRequest.css';
import { postLeaveRequest } from '../../services/studentServices';

const LeaveRequest = () => {
    const profile = useSelector((state) => state.student.profile) || {};
    const actionData = useActionData();
    const [studentID, setStudentID] = useState(profile.studentID || '');
    const [leaveType, setLeaveType] = useState('medical');
    const [formError, setFormError] = useState('');

    useEffect(() => {
        if (actionData?.message || actionData?.error) {
            setFormError(actionData.message || actionData.error);
        }
    }, [actionData]);

    useEffect(() => {
        if (profile.studentID) {
            setStudentID(profile.studentID);
        }
    }, [profile.studentID]);

    return (
        <div className="leave-container">
            <div className="leave-card">
                <div className="leave-header">
                    <h1>Leave Request</h1>
                    <p>Please complete the form below to submit your leave request.</p>
                    {formError && <div className="leave-error">{formError}</div>}
                </div>

                <Form className="leave-form" method="POST">
                    <div>
                        <label htmlFor="studentID" className="form-label">Student ID</label>
                        <input
                            type="text"
                            id="studentID"
                            name="studentID"
                            placeholder="12345678901"
                            className="form-field"
                            value={studentID}
                            onChange={(e) => setStudentID(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <label htmlFor="reason" className="form-label">Reason for Leave</label>
                        <textarea
                            id="reason"
                            name="reason"
                            rows="4"
                            placeholder="Enter the reason for your leave"
                            className="form-field"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <label htmlFor="leaveType" className="form-label">Leave Type</label>
                        <select
                            id="leaveType"
                            name="leaveType"
                            className="form-field"
                            value={leaveType}
                            onChange={(e) => setLeaveType(e.target.value)}
                            required
                        >
                            <option value="medical">Medical</option>
                            <option value="home out">Home Out</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-row form-grid">
                        <div>
                            <label htmlFor="leaveDate" className="form-label">Date of Leave</label>
                            <input
                                type="date"
                                id="leaveDate"
                                name="leaveDate"
                                className="form-field"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="returnDate" className="form-label">Return Date</label>
                            <input
                                type="date"
                                id="returnDate"
                                name="returnDate"
                                className="form-field"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <label htmlFor="address" className="form-label">Address While on Leave</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            placeholder="Enter the address where you will stay"
                            className="form-field"
                            required
                        />
                    </div>

                    <div className="form-row form-grid">
                        <div>
                            <label htmlFor="studentMobile" className="form-label">Student Mobile Number</label>
                            <input
                                type="tel"
                                id="studentMobile"
                                name="studentMobile"
                                placeholder="e.g. +1 234 567 8901"
                                className="form-field"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="parentMobile" className="form-label">Parent Mobile Number</label>
                            <input
                                type="tel"
                                id="parentMobile"
                                name="parentMobile"
                                placeholder="e.g. +1 234 567 8901"
                                className="form-field"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="submit-btn">Submit Leave Request</button>
                </Form>
            </div>
        </div>
    );
};

export const leaveRequestAction = async ({ request }) => {
    const formData = await request.formData();
    const actionData = Object.fromEntries(formData);
    const response = await postLeaveRequest(actionData);

    if (response?.message || response?.error) {
        return response;
    }

    return redirect('/student/leave-status');
}

export default LeaveRequest;