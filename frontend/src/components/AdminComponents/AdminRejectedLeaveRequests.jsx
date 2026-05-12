import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLeaveRequests, updateLeaveRequestStatus } from "../../services/adminServices";

const AdminRejectedLeaveRequests = () => {
    const [rejectedRequests, setRejectedRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRejectedRequests = async () => {
            try {
                const allRequests = await getLeaveRequests();
                const rejected = allRequests.filter(req => req.status === 'rejected');
                setRejectedRequests(rejected);
            } catch (error) {
                console.error('Error fetching rejected leave requests:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRejectedRequests();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateString).toLocaleDateString("en-IN", options);
    };

    const handleReAccept = async (studentID) => {
        try {
            await updateLeaveRequestStatus('accepted', studentID, 'NA');
            navigate('/admin');
        } catch (error) {
            console.error('Error re-accepting leave request:', error);
            alert('Failed to re-accept the leave request. Please try again.');
        }
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <h2 style={styles.heading}>Rejected Leave Requests</h2>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Rejected Leave Requests</h2>
            {rejectedRequests.length > 0 ? (
                <div style={styles.tableContainer}>
                    {/* Table Header */}
                    <div style={styles.tableHeader}>
                        <div style={styles.headerCell}>Name</div>
                        <div style={styles.headerCell}>Student ID</div>
                        <div style={styles.headerCell}>Room No</div>
                        <div style={styles.headerCell}>Date of Leave</div>
                        <div style={styles.headerCell}>Return Date</div>
                        <div style={styles.headerCell}>Status</div>
                        <div style={styles.headerCell}>Actions</div>
                    </div>
                    {/* Table Rows */}
                    {rejectedRequests.map((request, index) => (
                        <div key={request._id || index} style={styles.tableRow}>
                            <div style={styles.cell}>
                                {request.firstName} {request.lastName}
                            </div>
                            <div style={styles.cell}>{request.studentID}</div>
                            <div style={styles.cell}>{request.roomNo}</div>
                            <div style={styles.cell}>{formatDate(request.dateOfLeave)}</div>
                            <div style={styles.cell}>{formatDate(request.returnDate)}</div>
                            <div style={styles.cell}>
                                <span style={styles.statusBadge}>
                                    {request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : 'Rejected'}
                                </span>
                            </div>
                            <div style={styles.cell}>
                                <button
                                    onClick={() => handleReAccept(request.studentID)}
                                    style={styles.reAcceptButton}
                                >
                                    Re-accept
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={styles.emptyState}>
                    <p>No rejected leave requests found</p>
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
        padding: '16px',
        textAlign: 'left',
        minWidth: '140px',
    },
    tableRow: {
        display: 'flex',
        borderBottom: '1px solid #e5e7eb',
        transition: 'background-color 0.2s ease',
        minWidth: '900px',
    },
    cell: {
        flex: 1,
        padding: '16px',
        textAlign: 'left',
        minWidth: '140px',
        display: 'flex',
        alignItems: 'center',
    },
    statusBadge: {
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '500',
    },
    reAcceptButton: {
        backgroundImage: 'linear-gradient(135deg, #0f766e 0%, #22c55e 100%)',
        color: '#fff',
        border: '1px solid rgba(6, 95, 70, 0.14)',
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
    actionStack: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '12px',
        width: '100%',
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
    emptyState: {
        textAlign: 'center',
        padding: '40px',
        color: '#6b7280',
        fontSize: '18px',
    },
};

export default AdminRejectedLeaveRequests;
