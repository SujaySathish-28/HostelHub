import { useState } from 'react';
import './FeeDetails.css';

const FeeDetails = () => {
  const [selectedYear, setSelectedYear] = useState(2024);

  // Base fee structure for 2024
  const baseFees = [
    {
      type: 'Admission Fee',
      description: 'One-time joining fee',
      amount: 25000,
      isRefundable: false,
      frequency: 'One-time'
    },
    {
      type: 'Security Deposit',
      description: 'Refundable caution deposit',
      amount: 30000,
      isRefundable: true,
      frequency: 'One-time'
    },
    {
      type: 'Mess Fee',
      description: 'Food charges',
      amount: 25000,
      isRefundable: false,
      frequency: 'Annual'
    },
    {
      type: 'Electricity Bill',
      description: 'Power consumption charges',
      amount: 15000,
      isRefundable: false,
      frequency: 'Annual'
    },
    {
      type: 'WiFi Fee',
      description: 'Internet connectivity charges',
      amount: 10000,
      isRefundable: false,
      frequency: 'Annual'
    },
    {
      type: 'Maintenance Fee',
      description: 'Cleaning and repairs',
      amount: 16000,
      isRefundable: false,
      frequency: 'Annual'
    }
  ];

  // Calculate fees for selected year with 10% annual increase
  const calculateYearlyFees = (baseFees, year) => {
    const yearsSince2024 = year - 2024;
    const increaseFactor = Math.pow(1.10, yearsSince2024); // 10% annual increase

    return baseFees.map(fee => ({
      ...fee,
      amount: Math.round(fee.amount * increaseFactor)
    }));
  };

  const currentFees = calculateYearlyFees(baseFees, selectedYear);
  const totalAmount = currentFees.reduce((sum, fee) => sum + fee.amount, 0);
  const oneTimeFees = currentFees.filter(fee => fee.frequency === 'One-time');
  const annualFees = currentFees.filter(fee => fee.frequency === 'Annual');

  const oneTimeTotal = oneTimeFees.reduce((sum, fee) => sum + fee.amount, 0);
  const annualTotal = annualFees.reduce((sum, fee) => sum + fee.amount, 0);

  return (
    <div className="fee-details-container">
      <div className="fee-details-header">
        <h1 className="fee-details-title">Hostel Fee Structure</h1>
        <p className="fee-details-subtitle">
          Complete fee breakdown and payment requirements for hostel accommodation
        </p>
      </div>

      {/* Year Selector */}
      <div className="year-selector">
        <label htmlFor="year-select" className="year-label">Select Academic Year:</label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="year-dropdown"
        >
          {Array.from({ length: 5 }, (_, i) => 2024 + i).map(year => (
            <option key={year} value={year}>{year}-{year + 1}</option>
          ))}
        </select>
        <div className="year-note">
          <span className="info-icon">ℹ️</span>
          10% annual price increase applied
        </div>
      </div>

      {/* Important Notice */}
      <div className="important-notice">
        <div className="notice-icon">⚠️</div>
        <div className="notice-content">
          <h3 className="notice-title">Admission Requirement</h3>
          <p className="notice-text">
            Students will only be allowed hostel accommodation after <strong>complete fee payment</strong>.
            All one-time fees and first-year annual fees must be paid before check-in.
          </p>
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="fee-breakdown">
        {/* One-time Fees */}
        <div className="fee-section">
          <h2 className="section-title">One-time Fees</h2>
          <div className="fee-cards">
            {oneTimeFees.map((fee, index) => (
              <div key={index} className="fee-card">
                <div className="fee-card-header">
                  <h3 className="fee-type">{fee.type}</h3>
                  <span className={`fee-badge ${fee.isRefundable ? 'refundable' : 'non-refundable'}`}>
                    {fee.isRefundable ? 'Refundable' : 'Non-refundable'}
                  </span>
                </div>
                <p className="fee-description">{fee.description}</p>
                <div className="fee-amount">
                  <span className="currency">₹</span>
                  <span className="amount">{fee.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="section-total">
            <span className="total-label">One-time Total:</span>
            <span className="total-amount">₹{oneTimeTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Annual Fees */}
        <div className="fee-section">
          <h2 className="section-title">Annual Fees (Recurring)</h2>
          <div className="fee-cards">
            {annualFees.map((fee, index) => (
              <div key={index} className="fee-card">
                <div className="fee-card-header">
                  <h3 className="fee-type">{fee.type}</h3>
                  <span className="fee-badge annual">Annual</span>
                </div>
                <p className="fee-description">{fee.description}</p>
                <div className="fee-amount">
                  <span className="currency">₹</span>
                  <span className="amount">{fee.amount.toLocaleString()}</span>
                  <span className="per-year">/year</span>
                </div>
              </div>
            ))}
          </div>
          <div className="section-total">
            <span className="total-label">Annual Total:</span>
            <span className="total-amount">₹{annualTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Grand Total */}
      <div className="grand-total">
        <div className="total-card">
          <h2 className="total-title">Total First Year Cost</h2>
          <div className="total-breakdown">
            <div className="total-row">
              <span>One-time Fees:</span>
              <span>₹{oneTimeTotal.toLocaleString()}</span>
            </div>
            <div className="total-row">
              <span>First Year Annual Fees:</span>
              <span>₹{annualTotal.toLocaleString()}</span>
            </div>
            <div className="total-divider"></div>
            <div className="total-row grand">
              <span>Total Amount:</span>
              <span className="grand-amount">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Price Increase Notice */}
      <div className="price-increase-notice">
        <div className="increase-icon">📈</div>
        <div className="increase-content">
          <h3 className="increase-title">Annual Fee Adjustment</h3>
          <p className="increase-text">
            All annual fees are subject to a <strong>10% increase</strong> every academic year.
            This ensures we maintain high-quality services and facilities for all students.
          </p>
          <div className="increase-example">
            <p>Example: Mess Fee for {selectedYear}-{selectedYear + 1} academic year</p>
            <div className="example-calculation">
              <span>Base Amount (2024): ₹25,000</span>
              <span>× (1.10)^{selectedYear - 2024}</span>
              <span>= ₹{Math.round(25000 * Math.pow(1.10, selectedYear - 2024)).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="payment-info">
        <h2 className="payment-title">Payment Information</h2>
        <div className="payment-grid">
          <div className="payment-card">
            <div className="payment-icon">💳</div>
            <h3>Payment Methods</h3>
            <p>Online banking, UPI, credit/debit cards, and bank transfers accepted</p>
          </div>
          <div className="payment-card">
            <div className="payment-icon">📅</div>
            <h3>Due Dates</h3>
            <p>One-time fees due before admission. Annual fees due at the start of each academic year</p>
          </div>
          <div className="payment-card">
            <div className="payment-icon">🔄</div>
            <h3>Refunds</h3>
            <p>Security deposit refundable upon completion of course (subject to deductions for damages)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeDetails;