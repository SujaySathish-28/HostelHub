import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getLeaveRequestStatus, cancelLeaveRequest } from '../../services/studentServices';
import { fetchStudentProfile } from '../../store/studentSlice';

const LeaveRequestStatus = () => {
    const dispatch = useDispatch();
    const profile = useSelector((state) => state.student.profile);
    const profileStatus = useSelector((state) => state.student.status);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [expandedReasons, setExpandedReasons] = useState({});

    const toggleReason = (requestKey) => {
        setExpandedReasons((prev) => ({
            ...prev,
            [requestKey]: !prev[requestKey],
        }));
    };

    const loadRequests = async () => {
        setError('');
        if (!profile?.studentID) {
            return;
        }

        setLoading(true);
        try {
            const response = await getLeaveRequestStatus(profile.studentID);
            if (Array.isArray(response)) {
                setRequests(response);
            } else {
                setError('Unable to fetch leave status. Please try again.');
                setRequests([]);
            }
        } catch (err) {
            setError('Unable to fetch leave status. Please try again later.');
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!profile && profileStatus === 'idle') {
            dispatch(fetchStudentProfile());
        }
    }, [dispatch, profile, profileStatus]);

    useEffect(() => {
        if (profile?.studentID) {
            loadRequests();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile?.studentID]);

    const handleCancel = async (requestId) => {
        try {
            const response = await cancelLeaveRequest(requestId);
            if (response.message === 'Leave request cancelled successfully') {
                // Refresh the list
                await loadRequests();
            } else {
                setError('Failed to cancel leave request.');
            }
        } catch (err) {
            setError('Unable to cancel leave request. Please try again later.');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Leave Request Status</h2>
            <p style={styles.description}>Your leave requests are loaded automatically from your student profile.</p>

            {error && <div style={styles.error}>{error}</div>}

            {!profile?.studentID ? (
                <div style={styles.messageBox}>
                    {profileStatus === 'loading' ? 'Loading your student profile...' : 'Unable to find your student profile. Please sign in again or contact support.'}
                </div>
            ) : loading ? (
                <div style={styles.messageBox}>Loading your leave requests...</div>
            ) : requests.length > 0 ? (
                <div style={styles.requestList}>
                    {requests.map((request, index) => (
                        <div key={request._id || index} style={styles.requestCard}>
                            <div style={styles.requestHeader}>
                                <div>
                                    <div style={styles.requestTitle}>Request #{index + 1}</div>
                                    <div style={styles.requestMeta}>Submitted for leave on {new Date(request.dateOfLeave).toLocaleDateString('en-IN')}</div>
                                </div>
                                <div style={styles.requestStatus}>
                                    <span>{request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : 'Pending'}</span>
                                    {request.status && request.status.toLowerCase() === 'pending' && (
                                        <button 
                                            onClick={() => handleCancel(request._id)} 
                                            style={styles.cancelButton}
                                            disabled={loading}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    {request.status && request.status.toLowerCase() === 'rejected' && (
                                        <button
                                            onClick={() => toggleReason(request._id || index)}
                                            style={styles.reasonToggleButton}
                                            type="button"
                                        >
                                            {expandedReasons[request._id || index] ? 'Hide rejection reason' : 'View rejection reason'}
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div style={styles.requestBody}>
                                <p><strong>Student ID:</strong> {request.studentID}</p>
                                <p><strong>Leave Date:</strong> {new Date(request.dateOfLeave).toLocaleDateString('en-IN')}</p>
                                <p><strong>Return Date:</strong> {new Date(request.returnDate).toLocaleDateString('en-IN')}</p>
                                <p><strong>Reason:</strong> {request.reason}</p>
                                <p><strong>Leave Type:</strong> {request.leaveType}</p>
                                <p><strong>Address while on leave:</strong> {request.addressOnLeave}</p>
                                {request.status && request.status.toLowerCase() === 'rejected' && expandedReasons[request._id || index] && (
                                    <div style={styles.rejectionReason}>
                                        <strong>Rejection Reason:</strong>
                                        <div style={styles.rejectionReasonText}>
                                            {request.rejectReason?.trim() || 'No rejection reason provided.'}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : !error ? (
                <div style={styles.emptyState}>
                    <h3 style={styles.emptyTitle}>No leave requests found</h3>
                    <p style={styles.emptyText}>
                        You don’t have any leave requests registered under your student account right now.
                    </p>
                </div>
            ) : null}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '24px',
    },
    heading: {
        fontSize: '32px',
        marginBottom: '10px',
        color: '#1f2937',
    },
    description: {
        marginBottom: '20px',
        color: '#4b5563',
        lineHeight: 1.6,
    },
    searchContainer: {
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '20px',
    },
    input: {
        flex: '1 1 240px',
        padding: '12px 14px',
        borderRadius: '8px',
        border: '1px solid #d1d5db',
        fontSize: '16px',
        outline: 'none',
    },
    button: {
        backgroundColor: '#2563eb',
        color: '#fff',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        cursor: 'pointer',
        minWidth: '160px',
    },
    error: {
        marginBottom: '20px',
        color: '#b91c1c',
        backgroundColor: '#fee2e2',
        padding: '12px 16px',
        borderRadius: '8px',
    },
    requestList: {
        display: 'grid',
        gap: '16px',
    },
    requestCard: {
        border: '1px solid #e5e7eb',
        borderRadius: '16px',
        padding: '20px',
        backgroundColor: '#ffffff',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
    },
    requestHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        gap: '12px',
    },
    requestTitle: {
        fontSize: '18px',
        fontWeight: 700,
        color: '#111827',
    },
    requestMeta: {
        color: '#6b7280',
        fontSize: '14px',
    },
    requestStatus: {
        backgroundColor: '#e0f2fe',
        color: '#0369a1',
        borderRadius: '999px',
        padding: '8px 14px',
        fontWeight: 600,
        textTransform: 'capitalize',
        whiteSpace: 'nowrap',
    },
    cancelButton: {
        backgroundColor: '#824e38',
        color: '#fff',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        marginLeft: '10px',
        fontSize: '14px',
    },
    reasonToggleButton: {
        backgroundColor: '#1f2937',
        color: '#fff',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        marginLeft: '10px',
        fontSize: '14px',
    },
    rejectionReason: {
        marginTop: '16px',
        padding: '14px',
        backgroundColor: '#fef3c7',
        borderRadius: '12px',
        border: '1px solid #fde68a',
    },
    rejectionReasonText: {
        marginTop: '8px',
        color: '#92400e',
        lineHeight: '1.75',
    },
    requestBody: {
        color: '#374151',
        lineHeight: 1.75,
    },
    messageBox: {
        border: '1px solid #c7d2fe',
        borderRadius: '16px',
        padding: '24px',
        backgroundColor: '#eff6ff',
        color: '#1d4ed8',
        fontSize: '16px',
        textAlign: 'center',
        margin: '16px 0',
    },
    emptyState: {
        border: '1px solid #e5e7eb',
        borderRadius: '20px',
        padding: '32px',
        backgroundColor: '#f8fafc',
        textAlign: 'center',
        marginTop: '20px',
    },
    emptyTitle: {
        fontSize: '22px',
        marginBottom: '12px',
        color: '#111827',
    },
    emptyText: {
        color: '#475569',
        fontSize: '16px',
        lineHeight: 1.75,
        maxWidth: '600px',
        margin: '0 auto',
    },
};

export default LeaveRequestStatus;