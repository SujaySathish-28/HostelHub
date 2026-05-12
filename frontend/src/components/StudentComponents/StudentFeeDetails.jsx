import { useSelector } from 'react-redux';
import './StudentFee.css';

const StudentFeeDetails = () => {
  const profile = useSelector((state) => state.student.profile) || {};
  const totalFee = Number(profile.totalFee || 110000);
  const feePaid = Number(profile.feePaid || 110000);
  const feeDue = Number(profile.feeDue ?? Math.max(totalFee - feePaid, 0));

  return (
    <div className="student-fee-details-container">
      <h2>Fee Details</h2>
      <p className="student-fee-detail-description">Review your current hostel fee status and payment history.</p>
      <div className="student-fee-grid">
        <div className="student-fee-box">
          <p className="student-fee-label">Total Hostel Fee</p>
          <p className="student-fee-value">₹{totalFee.toLocaleString()}</p>
        </div>

        <div className="student-fee-box">
          <p className="student-fee-label">Amount Paid</p>
          <p className="student-fee-value">₹{feePaid.toLocaleString()}</p>
        </div>

        <div className="student-fee-box student-fee-due-box">
          <p className="student-fee-label">Amount Due</p>
          <p className="student-fee-value">₹{feeDue.toLocaleString()}</p>
        </div>
      </div>

      <div className="student-fee-details-summary">
        <p><strong>Billing summary:</strong></p>
        <p>Total hostel fee is the full amount assigned during admission.</p>
        <p>Fee paid is the amount you have already submitted.</p>
        <p>Amount due is the remaining fee balance.</p>
      </div>
    </div>
  );
};

export default StudentFeeDetails;
