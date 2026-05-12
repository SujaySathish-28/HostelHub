import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postComplaint } from '../../services/studentServices';
import './Complaint.css';

const complaintCategories = [
  {
    id: 'housekeeping',
    label: 'Housekeeping',
    description: 'Room cleaning, linen changes, and cleanliness issues.',
  },
  {
    id: 'electricals',
    label: 'Electricals',
    description: 'Power failures, lights, outlets or wiring problems.',
  },
  {
    id: 'food-accessories',
    label: 'Food & Accessories',
    description: 'Mess food, trays, utensils, or dining supplies.',
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    description: 'Repairs, plumbing, furniture or campus fixtures.',
  },
];

const Complaint = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const [complaintText, setComplaintText] = useState('');
  const [reason, setReason] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const selectedCategory = category || '';
  const categoryData = complaintCategories.find((item) => item.id === selectedCategory);

  const handleCategorySelect = (categoryId) => {
    setMessage('');
    setError('');
    navigate(`/student/complaint/${categoryId}`);
  };

  const handleBack = () => {
    setMessage('');
    setError('');
    setComplaintText('');
    setReason('');
    setFile(null);
    navigate('/student/complaint');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!selectedCategory) {
      setError('Please select a complaint category.');
      return;
    }

    if (!complaintText.trim()) {
      setError('Please describe your complaint.');
      return;
    }

    if (!reason.trim()) {
      setError('Please provide a reason for your complaint.');
      return;
    }

    const payload = {
      category: selectedCategory,
      complaint: complaintText.trim(),
      reason: reason.trim(),
      attachmentName: file ? file.name : '',
      attachmentProvided: Boolean(file),
    };

    try {
      const response = await postComplaint(payload);
      if (response?.message) {
        setMessage(response.message);
        setComplaintText('');
        setReason('');
        setFile(null);
      } else {
        setError('Unable to submit complaint. Please try again.');
      }
    } catch (err) {
      setError('Unable to submit complaint. Please try again.');
    }
  };

  return (
    <div className="complaint-container">
      <div className="complaint-card">
        <div className="complaint-topbar">
          <span className="complaint-tag">Student Service</span>
          <span className="step-pill">Step {selectedCategory ? '2' : '1'} / 2</span>
        </div>

        <div className="complaint-header">
          <h1>{selectedCategory ? 'Submit your complaint' : 'Choose a complaint type'}</h1>
          <p>
            {selectedCategory
              ? 'Fill in the details below so our team can resolve the issue quickly.'
              : 'Select one of the categories to continue to the complaint form.'}
          </p>
        </div>

        {!selectedCategory ? (
          <div className="category-grid">
            {complaintCategories.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className="category-card"
                onClick={() => handleCategorySelect(item.id)}
              >
                <div className="category-card-top">
                  <span className="category-badge">{index + 1}</span>
                  <span className="category-card-title">{item.label}</span>
                </div>
                <p className="category-card-text">{item.description}</p>
              </button>
            ))}
          </div>
        ) : (
          <form className="complaint-form" onSubmit={handleSubmit}>
            <div className="selected-header">
              <div>
                <span className="category-pill">{categoryData?.label || 'Unknown category'}</span>
                <p className="category-subtitle">{categoryData?.description}</p>
              </div>
              <button type="button" className="secondary-btn" onClick={handleBack}>
                Change category
              </button>
            </div>

            <div className="complaint-row">
              <div className="field-block">
                <label htmlFor="complaintText" className="form-label">
                  What is the complaint?
                </label>
                <textarea
                  id="complaintText"
                  name="complaintText"
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  placeholder="Describe the issue clearly"
                  className="form-field"
                  required
                />
              </div>
            </div>

            <div className="complaint-row">
              <div className="field-block">
                <label htmlFor="reason" className="form-label">
                  Why is this important?
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain the impact or urgency"
                  className="form-field"
                  required
                />
              </div>
            </div>

            <div className="complaint-row">
              <label htmlFor="attachment" className="form-label">
                Optional attachment
              </label>
              <input
                id="attachment"
                type="file"
                className="form-field file-input"
                onChange={(e) => setFile(e.target.files[0] || null)}
              />
              <p className="optional-note">Upload a photo or document to clarify the issue if available.</p>
            </div>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <button type="submit" className="submit-btn full-width">
              Submit Complaint
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Complaint;
