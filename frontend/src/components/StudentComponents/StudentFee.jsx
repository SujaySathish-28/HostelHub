import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './StudentFee.css';

const StudentFee = () => {
  const navigate = useNavigate();
  const profile = useSelector((state) => state.student.profile);
  const totalFee = profile?.totalFee ?? 0;
  const feePaid = profile?.feePaid ?? 0;
  const feeDue = profile?.feeDue ?? Math.max(totalFee - feePaid, 0);

  const handleFeeNavigation = () => {
    navigate('/student/fees');
  };

  return (
    <section className="student-fee-card" onClick={handleFeeNavigation} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleFeeNavigation()}>
      <div className="student-fee-header">
        <div>
          <p className="student-fee-title">Fee Summary</p>
          <p className="student-fee-subtitle">Your current hostel fee status</p>
        </div>
      </div>

      <div className="student-fee-grid">
        <div className="student-fee-box">
          <p className="student-fee-label">Total Fee</p>
          <p className="student-fee-value">₹{totalFee.toLocaleString()}</p>
        </div>

        <div className="student-fee-box">
          <p className="student-fee-label">Fee Paid</p>
          <p className="student-fee-value">₹{feePaid.toLocaleString()}</p>
        </div>

        <div className="student-fee-box student-fee-due-box">
          <p className="student-fee-label">Due Fee</p>
          <p className="student-fee-value">₹{feeDue.toLocaleString()}</p>
        </div>
      </div>
    </section>
  );
};

export default StudentFee;
