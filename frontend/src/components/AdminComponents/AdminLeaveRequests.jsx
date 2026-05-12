import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLeaveRequests, updateLeaveRequestStatus } from "../../services/adminServices";
// { leaveRequests = [] }
const AdminLeaveRequests = () => {
    let [leaveRequests,setLeaveRequests]=useState([]);
    const [requestStates, setRequestStates] = useState({});
    const navigate = useNavigate();

    useEffect(()=>{
        const leaveRequest=async ()=>{
            leaveRequests=await getLeaveRequests();
            setLeaveRequests(leaveRequests.filter(req => req.status === 'pending'))
        }
        leaveRequest();
    },[])
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString("en-IN", options);
    };

    const handleAction =async (index, action,studentID) => {
        setRequestStates((prev) => ({
            ...prev,
            [index]: {
                ...prev[index],
                status: action,
                submitted: action === "accepted" ? true : false,
                reason: action === "rejected" ? prev[index]?.reason || "" : "",
            },
        }));
        if(action==='accepted'){
          const res=await updateLeaveRequestStatus('accepted',studentID,'NA');
          navigate('/admin');
        }
    };

    const handleReasonChange = (index, value) => {
        setRequestStates((prev) => ({
            ...prev,
            [index]: {
                ...prev[index],
                reason: value,
            },
        }));
    };

    const handleSubmitResponse = async (index, studentID) => {
        const state = requestStates[index] || {};
        if (!state.reason || !state.reason.trim()) {
            alert("Please enter a reason for rejection.");
            return;
        }
        setRequestStates((prev) => ({
            ...prev,
            [index]: {
                ...prev[index],
                submitted: true,
            },
        }));
        const res = await updateLeaveRequestStatus('rejected', studentID, state.reason);
        console.log('returned')
        navigate('/admin');
    };

    const calculateDays = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const differenceTime = Math.abs(end - start);
        const differenceDays =
        Math.ceil(differenceTime / (1000 * 60 * 60 * 24)) + 1;
        return differenceDays;
    };

    return (
        <div style={styles.container}>
        {leaveRequests && leaveRequests.length > 0 ? (
            leaveRequests.map((request, index) => (
            <div key={index} style={styles.letterWrapper}>
                <div style={styles.letterContainer}>
                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.institutionName}>HOSTEL LEAVE REQUEST</div>
                    <div style={styles.letterNumber}>Letter No. {index + 1}</div>
                </div>

                {/* Date Section */}
                <div style={styles.dateSection}>
                    <p style={styles.dateText}>
                    Date: {formatDate(new Date().toISOString().split("T")[0])}
                    </p>
                </div>

                {/* Recipient Section */}
                <div style={styles.recipientSection}>
                    <p style={styles.recipientText}>To,</p>
                    <p style={styles.recipientText}>The Hostel Warden,</p>
                    <p style={styles.recipientText}>Hostel Administration,</p>
                    <p style={styles.recipientText}>College Campus,</p>
                </div>

                {/* Subject Line */}
                <div style={styles.subjectSection}>
                    <p style={styles.subjectText}>
                    <strong>Subject: </strong>Request for Leave of Absence from
                    Hostel
                    </p>
                </div>

                {/* Salutation */}
                <div style={styles.salutation}>
                    <p>Dear Sir/Madam,</p>
                </div>

                {/* Body */}
                <div style={styles.body}>
                    <p>
                    I,{" "}
                    <strong>
                        {request.firstName} {request.lastName}
                    </strong>
                    , a student of the <strong>{request.branch}</strong> branch in{" "}
                    <strong>Year {request.year}</strong>, bearing Student ID{" "}
                    <strong>{request.studentID}</strong> and residing in Room No.{" "}
                    <strong>{request.roomNo}</strong>, hereby formally request
                    permission to take leave of absence from the hostel premises.
                    </p>

                    <p>
                    <strong>Leave Details:</strong>
                    </p>
                    <div style={styles.detailsBox}>
                    <table style={styles.detailsTable}>
                        <tbody>
                        <tr>
                            <td style={styles.tableLabel}>Date of Leave:</td>
                            <td style={styles.tableValue}>
                            {formatDate(request.dateOfLeave)}
                            </td>
                        </tr>
                        <tr>
                            <td style={styles.tableLabel}>Return Date:</td>
                            <td style={styles.tableValue}>
                            {formatDate(request.returnDate)}
                            </td>
                        </tr>
                        <tr>
                            <td style={styles.tableLabel}>Duration:</td>
                            <td style={styles.tableValue}>
                            {calculateDays(
                                request.dateOfLeave,
                                request.returnDate,
                            )}{" "}
                            days
                            </td>
                        </tr>
                        <tr>
                            <td style={styles.tableLabel}>Address During Leave:</td>
                            <td style={styles.tableValue}>
                            {request.addressOnLeave}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </div>

                    <p>
                    <strong>Reason for Leave:</strong>
                    </p>
                    <p style={styles.reasonBox}>{request.reason}</p>

                    <p>
                    <strong>Leave Type:</strong> {request.leaveType}
                    </p>

                    <p>
                    <strong>Contact Information:</strong>
                    </p>
                    <div style={styles.detailsBox}>
                    <table style={styles.detailsTable}>
                        <tbody>
                        <tr>
                            <td style={styles.tableLabel}>Student Mobile:</td>
                            <td style={styles.tableValue}>
                            {request.studentMobile}
                            </td>
                        </tr>
                        <tr>
                            <td style={styles.tableLabel}>
                            Parent/Guardian Mobile:
                            </td>
                            <td style={styles.tableValue}>
                            {request.parentMobile}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </div>

                    <p>
                    I assure you that I will comply with all hostel rules and
                    regulations during my absence and will return to the hostel as
                    per the specified date. I shall ensure that my room is secured
                    and all personal belongings are kept safely before my
                    departure.
                    </p>

                    <p>Thanking you and awaiting your favorable response.</p>
                </div>

                {/* Closing */}
                <div style={styles.closing}>
                    <p>Yours faithfully,</p>
                    <p style={styles.signature}>_______________________</p>
                    <p style={styles.signatureText}>
                    {request.firstName} {request.lastName}
                    </p>
                    <p style={styles.signatureSubText}>
                    Student ID: {request.studentID}
                    </p>
                </div>

                {/* Accept / Reject Actions */}
                <div style={styles.actionsContainer}>
                    <button
                        style={{
                            ...styles.actionButton,
                            ...styles.acceptButton,
                            opacity: requestStates[index]?.submitted ? 0.65 : 1,
                        }}
                        onClick={() => handleAction(index, "accepted",request.studentID)}
                        disabled={requestStates[index]?.submitted}
                    >
                        Accept
                    </button>
                    <button
                        style={{
                            ...styles.actionButton,
                            ...styles.rejectButton,
                            opacity: requestStates[index]?.submitted ? 0.65 : 1,
                        }}
                        onClick={() => handleAction(index, "rejected",request.studentID)}
                        disabled={requestStates[index]?.submitted}
                    >
                        Reject
                    </button>
                </div>

                {requestStates[index]?.status === "rejected" && !requestStates[index]?.submitted && (
                    <div style={styles.rejectionContainer}>
                        <label style={styles.rejectionLabel} htmlFor={`rejection-${index}`}>
                            Reason for rejection
                        </label>
                        <textarea
                            id={`rejection-${index}`}
                            style={styles.reasonInput}
                            value={requestStates[index]?.reason || ""}
                            onChange={(e) => handleReasonChange(index, e.target.value)}
                            placeholder="Enter rejection reason"
                            rows={3}
                        />
                        <button
                            style={{ ...styles.actionButton, ...styles.submitButton }}
                            onClick={() => handleSubmitResponse(index, request.studentID)}
                        >
                            Submit Response
                        </button>
                    </div>
                )}

                {requestStates[index]?.submitted && requestStates[index]?.status === "rejected" && (
                    <div style={styles.responseNotice}>
                        Rejection response submitted.
                    </div>
                )}

                {requestStates[index]?.submitted && requestStates[index]?.status === "accepted" && (
                    <div style={styles.responseNotice}>
                        Leave request accepted for {request.studentID}.
                    </div>
                )}

                {/* Print Button */}
                <div style={styles.printButtonContainer}>
                    <button
                    style={styles.printButton}
                    onClick={() => window.print()}
                    title="Print this letter"
                    >
                    🖨️ Print Letter
                    </button>
                </div>
                </div>

                {/* Page Break */}
                {index < leaveRequests.length - 1 && (
                <div style={styles.pageBreak}></div>
                )}
            </div>
            ))
        ) : (
            <div style={styles.emptyState}>
            <p>No pending leave requests available</p>
            </div>
        )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  },
  letterWrapper: {
    marginBottom: "24px",
  },
  letterContainer: {
    backgroundColor: "#fff",
    padding: "36px 28px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    borderRadius: "8px",
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    lineHeight: "1.75",
    color: "#222",
    maxWidth: "900px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "18px",
    borderBottom: "2px solid #333",
    paddingBottom: "12px",
  },
  institutionName: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#1a3a52",
    marginBottom: "4px",
  },
  letterNumber: {
    fontSize: "12px",
    color: "#666",
  },
  dateSection: {
    marginBottom: "16px",
  },
  dateText: {
    margin: "0",
    fontSize: "14px",
  },
  recipientSection: {
    marginBottom: "16px",
  },
  recipientText: {
    margin: "0",
    fontSize: "14px",
  },
  subjectSection: {
    marginBottom: "16px",
    backgroundColor: "#f0f0f0",
    padding: "10px 14px",
    borderRadius: "4px",
  },
  subjectText: {
    margin: "0",
    fontSize: "14px",
    color: "#333",
  },
  salutation: {
    marginBottom: "14px",
  },
  body: {
    marginBottom: "22px",
    textAlign: "justify",
  },
  detailsBox: {
    backgroundColor: "#f9f9f9",
    padding: "12px",
    borderLeft: "4px solid #1a3a52",
    marginBottom: "12px",
    borderRadius: "4px",
  },
  detailsTable: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableLabel: {
    fontWeight: "bold",
    padding: "6px",
    width: "40%",
    color: "#333",
    fontSize: "14px",
  },
  tableValue: {
    padding: "6px",
    color: "#555",
    fontSize: "14px",
  },
  reasonBox: {
    backgroundColor: "#f9f9f9",
    padding: "10px",
    borderRadius: "4px",
    borderLeft: "4px solid #ff9800",
    marginBottom: "12px",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
  },
  closing: {
    marginTop: "24px",
    marginBottom: "16px",
  },
  signature: {
    marginTop: "24px",
    marginBottom: "5px",
    fontFamily: "cursive",
    fontSize: "16px",
  },
  signatureText: {
    fontWeight: "bold",
    margin: "5px 0",
    fontSize: "14px",
  },
  signatureSubText: {
    fontSize: "12px",
    color: "#666",
    margin: "0",
  },  actionsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "8px",
    marginBottom: "16px",
  },
  actionButton: {
    padding: "10px 18px",
    border: "1px solid transparent",
    borderRadius: "28px",
    fontSize: "14px",
    cursor: "pointer",
    minWidth: "120px",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  acceptButton: {
    backgroundImage: "linear-gradient(135deg, #1a7f3a 0%, #2fb13b 100%)",
    color: "#fff",
    borderColor: "rgba(0,0,0,0.08)",
    boxShadow: "0 8px 18px rgba(35, 147, 55, 0.18)",
  },
  rejectButton: {
    backgroundImage: "linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)",
    color: "#fff",
    borderColor: "rgba(0,0,0,0.08)",
    boxShadow: "0 8px 18px rgba(192, 57, 43, 0.18)",
  },
  submitButton: {
    backgroundColor: "#1a3a52",
    color: "#fff",
    borderColor: "#142a3f",
    marginTop: "10px",
  },
  rejectionContainer: {
    marginBottom: "18px",
  },
  rejectionLabel: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
  },
  reasonInput: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    minHeight: "80px",
    fontSize: "14px",
    color: "#222",
    resize: "vertical",
  },
  responseNotice: {
    backgroundColor: "#e6f7ff",
    color: "#0a4f7d",
    border: "1px solid #b3d8ee",
    padding: "12px 14px",
    borderRadius: "4px",
    marginTop: "10px",
    fontSize: "14px",
  },  printButtonContainer: {
    textAlign: "center",
    marginTop: "18px",
  },
  printButton: {
    backgroundColor: "#1a3a52",
    color: "#fff",
    padding: "10px 25px",
    border: "none",
    borderRadius: "4px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  pageBreak: {
    pageBreakAfter: "always",
    height: "12px",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px",
    color: "#999",
    fontSize: "16px",
  },
};

export default AdminLeaveRequests;
//printf("hi sujay")
