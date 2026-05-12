import { useEffect, useState } from "react";
import { getLeaveRequests, updateLeaveRequestStatus } from "../../services/adminServices";

const AdminAcceptedLeaveRequests = () => {
    const [acceptedRequests, setAcceptedRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeRejectId, setActiveRejectId] = useState(null);
    const [reasonText, setReasonText] = useState("");
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [submittingId, setSubmittingId] = useState(null);

    useEffect(() => {
        const fetchAcceptedRequests = async () => {
            try {
                const allRequests = await getLeaveRequests();
                const accepted = allRequests.filter(req => req.status === 'accepted');
                setAcceptedRequests(accepted);
            } catch (error) {
                console.error('Error fetching accepted leave requests:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAcceptedRequests();
    }, []);

    const handleReReject = async (request) => {
        if (!reasonText.trim()) {
            setErrorMessage('Please enter a rejection reason before submitting.');
            return;
        }

        setErrorMessage('');
        setSubmittingId(request._id || request.studentID);

        try {
            await updateLeaveRequestStatus('rejected', request.studentID, reasonText.trim(), request._id);
            setAcceptedRequests(prev => prev.filter(req => req._id !== request._id));
            setFeedbackMessage(`${request.firstName} ${request.lastName}'s leave request has been re-rejected.`);
            setActiveRejectId(null);
            setReasonText("");
        } catch (error) {
            console.error('Error re-rejecting leave request:', error);
            setErrorMessage('Failed to submit the rejection reason. Please try again.');
        } finally {
            setSubmittingId(null);
        }
    };

    const handleMarkReturned = async (request) => {
        setErrorMessage('');
        setSubmittingId(request._id || request.studentID);

        try {
            await updateLeaveRequestStatus('returned', request.studentID, 'NA', request._id);
            setAcceptedRequests(prev => prev.filter(req => req._id !== request._id));
            setFeedbackMessage(`${request.firstName} ${request.lastName}'s leave request has been marked returned and added to leave history.`);
        } catch (error) {
            console.error('Error marking leave request returned:', error);
            setErrorMessage('Failed to mark the leave request as returned. Please try again.');
        } finally {
            setSubmittingId(null);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateString).toLocaleDateString("en-IN", options);
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <h2 style={styles.heading}>Accepted Leave Requests</h2>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Accepted Leave Requests</h2>
            {feedbackMessage && <div style={styles.successBanner}>{feedbackMessage}</div>}
            {acceptedRequests.length > 0 ? (
                <div style={styles.tableContainer}>
                    {/* Table Header */}
                    <div style={styles.tableHeader}>
                        <div style={styles.headerCell}>Name</div>
                        <div style={styles.headerCell}>Student ID</div>
                        <div style={styles.headerCell}>Room No</div>
                        <div style={styles.headerCell}>Date of Leave</div>
                        <div style={styles.headerCell}>Return Date</div>
                        <div style={styles.headerCell}>Address</div>
                        <div style={styles.headerCell}>Status</div>
                        <div style={styles.headerCell}>Actions</div>
                    </div>
                    {/* Table Rows */}
                    {acceptedRequests.map((request, index) => (
                        <div key={request._id || index} style={styles.tableRow}>
                            <div style={styles.cell}>
                                {request.firstName} {request.lastName}
                            </div>
                            <div style={styles.cell}>{request.studentID}</div>
                            <div style={styles.cell}>{request.roomNo}</div>
                            <div style={styles.cell}>{formatDate(request.dateOfLeave)}</div>
                            <div style={styles.cell}>{formatDate(request.returnDate)}</div>
                            <div style={styles.cell}>{request.addressOnLeave}</div>
                            <div style={styles.cell}>
                                <span style={styles.statusBadge}>
                                    {request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : 'Accepted'}
                                </span>
                            </div>
                            <div style={styles.cell}>
                                <div style={styles.actionStack}>
                                    <button
                                        onClick={() => handleMarkReturned(request)}
                                        style={styles.returnButton}
                                        disabled={submittingId === request._id || submittingId === request.studentID}
                                    >
                                        {submittingId === request._id || submittingId === request.studentID ? 'Processing...' : 'Mark Returned'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setActiveRejectId(request.studentID);
                                            setReasonText('');
                                            setErrorMessage('');
                                            setFeedbackMessage('');
                                        }}
                                        style={styles.reRejectButton}
                                    >
                                        Re-reject
                                    </button>

                                    {activeRejectId === request.studentID && (
                                        <div style={styles.rejectionBox}>
                                            <h4 style={styles.boxTitle}>Reason for re-rejection</h4>
                                            <textarea
                                                rows={5}
                                                name="reason"
                                                value={reasonText}
                                                onChange={(e) => setReasonText(e.target.value)}
                                                style={styles.reasonTextarea}
                                                placeholder="Enter the reason for re-rejection"
                                            />
                                            {errorMessage && <p style={styles.errorText}>{errorMessage}</p>}
                                            <div style={styles.formActions}>
                                                <button
                                                    onClick={() => handleReReject(request)}
                                                    style={styles.submitButton}
                                                    disabled={submittingId === request._id || submittingId === request.studentID}
                                                >
                                                    {submittingId === request._id || submittingId === request.studentID ? 'Submitting...' : 'Submit'}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setActiveRejectId(null);
                                                        setReasonText('');
                                                        setErrorMessage('');
                                                    }}
                                                    style={styles.cancelButton}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={styles.emptyState}>
                    <p>No accepted leave requests found</p>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '24px',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
    },
    heading: {
        fontSize: '28px',
        marginBottom: '24px',
        color: '#1f2937',
        textAlign: 'center',
    },
    tableContainer: {
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'auto',
        width: '100%',
        maxWidth: '1600px',
    },
    tableHeader: {
        display: 'flex',
        backgroundColor: '#f3f4f6',
        borderBottom: '2px solid #e5e7eb',
        fontWeight: 'bold',
        color: '#374151',
        minWidth: '900px',
    },
    headerCell: {
        flex: 1,
        padding: '0.4%',
        textAlign: 'left',
        minWidth: '120px',
    },
    tableRow: {
        display: 'flex',
        borderBottom: '1px solid #e5e7eb',
        transition: 'background-color 0.2s ease',
        minWidth: '900px',
    },
    cell: {
        flex: 1,
        padding: '0.4%',
        textAlign: 'left',
        minWidth: '120px',
        display: 'flex',
        alignItems: 'center',
    },
    statusBadge: {
        backgroundColor: '#dcfce7',
        color: '#166534',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '500',
    },
    actionStack: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '12px',
        width: '100%',
        flexWrap: 'wrap',
    },
    reRejectButton: {
        backgroundImage: 'linear-gradient(135deg, #dc2626 0%, #f97316 100%)',
        color: '#fff',
        border: '1px solid rgba(154, 52, 18, 0.18)',
        padding: '10px 18px',
        borderRadius: '999px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '700',
        letterSpacing: '0.02em',
        minWidth: '120px',
        boxShadow: '0 12px 24px rgba(234, 88, 12, 0.22)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease',
    },
    returnButton: {
        backgroundImage: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        color: '#fff',
        border: '1px solid rgba(16, 185, 129, 0.18)',
        padding: '10px 18px',
        borderRadius: '999px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '700',
        letterSpacing: '0.02em',
        minWidth: '120px',
        boxShadow: '0 12px 24px rgba(16, 185, 129, 0.2)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease',
    },
    rejectionBox: {
        width: '100%',
        maxWidth: '280px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '14px',
        background: 'linear-gradient(180deg, #fff7ed 0%, #ffffff 100%)',
        border: '1px solid #fdba74',
        borderRadius: '16px',
        boxShadow: '0 12px 28px rgba(249, 115, 22, 0.1)',
    },
    reasonTextarea: {
        width: '100%',
        minHeight: '110px',
        padding: '12px 14px',
        borderRadius: '12px',
        border: '1px solid #fdba74',
        backgroundColor: '#fff',
        color: '#1f2937',
        fontSize: '14px',
        lineHeight: '1.5',
        resize: 'vertical',
        boxSizing: 'border-box',
        outline: 'none',
    },
    submitButton: {
        backgroundImage: 'linear-gradient(135deg, #1d4ed8 0%, #0f766e 100%)',
        color: '#fff',
        border: '1px solid rgba(29, 78, 216, 0.16)',
        padding: '10px 18px',
        borderRadius: '999px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '700',
        letterSpacing: '0.02em',
        minWidth: '120px',
        alignSelf: 'flex-start',
        boxShadow: '0 12px 24px rgba(29, 78, 216, 0.2)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease',
    },
    cancelButton: {
        backgroundColor: '#f3f4f6',
        color: '#111827',
        border: '1px solid #d1d5db',
        padding: '10px 18px',
        borderRadius: '999px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '700',
        minWidth: '120px',
        alignSelf: 'flex-start',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease',
    },
    formActions: {
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    boxTitle: {
        margin: 0,
        fontSize: '15px',
        fontWeight: '700',
        color: '#b45309',
    },
    errorText: {
        margin: 0,
        color: '#b91c1c',
        fontSize: '13px',
    },
    successBanner: {
        marginBottom: '18px',
        padding: '14px 18px',
        borderRadius: '14px',
        backgroundColor: '#ecfdf5',
        color: '#14532d',
        border: '1px solid #bbf7d0',
        fontWeight: '600',
    },
    emptyState: {
        textAlign: 'center',
        padding: '40px',
        color: '#6b7280',
        fontSize: '18px',
    },
};

export default AdminAcceptedLeaveRequests;
