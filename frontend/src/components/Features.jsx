import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticateForStudent, authenticateForAdmin } from '../services/hostelService';
import './Features.css';

const Features = () => {
  const [activeTab, setActiveTab] = useState('students');
  const navigate = useNavigate();

  const handleGetStarted = async () => {
    try {
      if (activeTab === 'students') {
        // Check if student is authenticated
        const studentAuth = await authenticateForStudent();
        if (studentAuth.isAuthenticated && studentAuth.isAuthorizedAsStudent) {
          navigate('/student');
        } else {
          navigate('/sign-in');
        }
      } else {
        // Check if admin is authenticated
        const adminAuth = await authenticateForAdmin();
        if (adminAuth.isAuthenticated && adminAuth.isAuthorizedAsAdmin) {
          navigate('/admin');
        } else {
          navigate('/sign-in');
        }
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      navigate('/sign-in');
    }
  };

  const studentFeatures = [
    {
      category: 'Dashboard & Profile',
      icon: '📊',
      features: [
        {
          title: 'Personal Dashboard',
          description: 'Comprehensive overview of student information, attendance, fees, and recent activities',
          details: ['Profile summary', 'Fee status overview', 'Attendance percentage', 'Recent complaints and alerts', 'Mess menu preview', 'Leave request status']
        },
        {
          title: 'Profile Management',
          description: 'View and update personal information and hostel details',
          details: ['Personal information', 'Hostel room assignment', 'Contact details', 'Academic information']
        }
      ]
    },
    {
      category: 'Academic & Attendance',
      icon: '📚',
      features: [
        {
          title: 'Attendance Tracking',
          description: 'Monitor daily attendance records and performance statistics',
          details: ['Daily attendance marking', 'Monthly attendance reports', 'Attendance percentage calculation', 'Admitted date tracking']
        },
        {
          title: 'Academic Modules',
          description: 'Access to academic resources and study materials',
          details: ['Study materials', 'Academic announcements', 'Exam schedules', 'Study hall bookings']
        }
      ]
    },
    {
      category: 'Leave Management',
      icon: '📅',
      features: [
        {
          title: 'Leave Request Submission',
          description: 'Submit leave requests with detailed information and approval tracking',
          details: ['Online leave application', 'Reason specification', 'Date range selection', 'Supporting documents upload']
        },
        {
          title: 'Leave Status Tracking',
          description: 'Monitor the status of submitted leave requests',
          details: ['Real-time status updates', 'Approval/rejection notifications', 'Leave history', 'Remaining leave balance']
        },
        {
          title: 'Leave History',
          description: 'View complete history of all leave requests and their outcomes',
          details: ['Past leave records', 'Approval details', 'Rejection reasons', 'Leave duration tracking']
        }
      ]
    },
    {
      category: 'Financial Management',
      icon: '💰',
      features: [
        {
          title: 'Fee Details & Payment',
          description: 'View fee structure, payment history, and outstanding dues',
          details: ['Fee breakdown', 'Payment history', 'Outstanding amount', 'Payment receipts', 'Due date reminders']
        },
        {
          title: 'Fee Payment Tracking',
          description: 'Monitor fee payment status and transaction history',
          details: ['Payment confirmations', 'Transaction records', 'Fee waiver information', 'Payment method options']
        }
      ]
    },
    {
      category: 'Communication & Support',
      icon: '💬',
      features: [
        {
          title: 'Complaint Submission',
          description: 'Submit complaints and issues for resolution by administration',
          details: ['Multiple complaint categories', 'Priority levels', 'File attachments', 'Anonymous reporting option']
        },
        {
          title: 'Notice Board Access',
          description: 'View important notices, announcements, and updates from administration',
          details: ['Hostel announcements', 'Important notices', 'Event notifications', 'Policy updates']
        },
        {
          title: 'Alerts & Notifications',
          description: 'Receive important alerts and emergency notifications',
          details: ['Emergency alerts', 'Maintenance notifications', 'Important updates', 'Deadline reminders']
        }
      ]
    },
    {
      category: 'Facilities & Services',
      icon: '🏨',
      features: [
        {
          title: 'Mess Menu Access',
          description: 'View daily mess menu and meal information',
          details: ['Breakfast, lunch, dinner menus', 'Nutritional information', 'Special diet options', 'Menu feedback']
        },
        {
          title: 'Rules & Regulations',
          description: 'Access hostel rules, regulations, and code of conduct',
          details: ['Hostel rules', 'Disciplinary policies', 'Facility usage guidelines', 'Safety protocols']
        },
        {
          title: 'Settings & Preferences',
          description: 'Customize app settings and manage account preferences',
          details: ['Theme selection (Light/Dark)', 'Password change', 'Notification preferences', 'Language settings']
        }
      ]
    }
  ];

  const adminFeatures = [
    {
      category: 'Student Management',
      icon: '👥',
      features: [
        {
          title: 'Student Admission',
          description: 'Admit new students to the hostel with complete profile setup',
          details: ['Student registration', 'Room allocation', 'Profile creation', 'Document verification', 'Fee structure assignment']
        },
        {
          title: 'Attendance Management',
          description: 'Mark and manage student attendance records',
          details: ['Daily attendance marking', 'Bulk attendance updates', 'Attendance reports', 'Defaulter identification', 'Attendance analytics']
        },
        {
          title: 'Student Reports & Remarks',
          description: 'Create and manage student reports and performance remarks',
          details: ['Academic performance reports', 'Behavioral reports', 'Disciplinary actions', 'Progress tracking', 'Parent notifications']
        }
      ]
    },
    {
      category: 'Leave Administration',
      icon: '📋',
      features: [
        {
          title: 'Leave Request Management',
          description: 'Review, approve, and reject student leave requests',
          details: ['Leave request review', 'Approval workflow', 'Rejection with reasons', 'Leave policy enforcement', 'Emergency leave handling']
        },
        {
          title: 'Leave History Tracking',
          description: 'Maintain complete records of all leave requests and approvals',
          details: ['Leave request history', 'Approval records', 'Rejection analytics', 'Leave pattern analysis', 'Policy compliance reports']
        },
        {
          title: 'Bulk Leave Operations',
          description: 'Handle multiple leave requests efficiently',
          details: ['Bulk approvals', 'Holiday declarations', 'Emergency leave policies', 'Leave balance management']
        }
      ]
    },
    {
      category: 'Communication & Announcements',
      icon: '📢',
      features: [
        {
          title: 'Notice Board Management',
          description: 'Create, edit, and manage notices for students',
          details: ['Notice creation', 'Priority settings', 'Target audience selection', 'Notice archiving', 'Read confirmation tracking']
        },
        {
          title: 'Announcements System',
          description: 'Broadcast important announcements to all students',
          details: ['Emergency announcements', 'Event notifications', 'Policy updates', 'Important deadlines', 'Broadcast messaging']
        },
        {
          title: 'Alert Management',
          description: 'Create and manage system-wide alerts and notifications',
          details: ['Emergency alerts', 'Maintenance alerts', 'Weather warnings', 'Security alerts', 'Custom notifications']
        }
      ]
    },
    {
      category: 'Complaint Resolution',
      icon: '🔧',
      features: [
        {
          title: 'Complaint Management',
          description: 'Handle and resolve student complaints efficiently',
          details: ['Complaint categorization', 'Priority assignment', 'Resolution tracking', 'Feedback collection', 'Escalation procedures']
        },
        {
          title: 'Issue Resolution Workflow',
          description: 'Streamlined process for complaint resolution',
          details: ['Assignment to staff', 'Progress updates', 'Resolution confirmation', 'Follow-up procedures', 'Quality assurance']
        }
      ]
    },
    {
      category: 'Facility Management',
      icon: '🏢',
      features: [
        {
          title: 'Mess Menu Management',
          description: 'Create and update daily mess menus for students',
          details: ['Menu planning', 'Nutritional balance', 'Dietary restrictions', 'Seasonal menu updates', 'Feedback analysis']
        },
        {
          title: 'Rules & Regulations',
          description: 'Manage and update hostel rules and regulations',
          details: ['Rule creation', 'Policy updates', 'Code of conduct', 'Safety guidelines', 'Regular reviews']
        }
      ]
    },
    {
      category: 'System Administration',
      icon: '⚙️',
      features: [
        {
          title: 'Admin User Management',
          description: 'Manage administrator accounts and permissions',
          details: ['Admin registration', 'Role assignment', 'Permission management', 'Access control', 'Account deactivation']
        },
        {
          title: 'System Monitoring',
          description: 'Monitor system performance and user activities',
          details: ['User activity logs', 'System performance', 'Error tracking', 'Security monitoring', 'Audit trails']
        },
        {
          title: 'Reports & Analytics',
          description: 'Generate comprehensive reports and analytics',
          details: ['Student statistics', 'Attendance reports', 'Financial reports', 'Complaint analytics', 'Performance metrics']
        }
      ]
    }
  ];

  const currentFeatures = activeTab === 'students' ? studentFeatures : adminFeatures;

  return (
    <div className="features-container">
      <div className="features-header">
        <h1 className="features-title">HostelHub Features</h1>
        <p className="features-subtitle">
          Comprehensive platform designed to streamline hostel management and enhance student experience
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          <span className="tab-icon">🎓</span>
          Student Features
        </button>
        <button
          className={`tab-button ${activeTab === 'admins' ? 'active' : ''}`}
          onClick={() => setActiveTab('admins')}
        >
          <span className="tab-icon">👨‍💼</span>
          Admin Features
        </button>
      </div>

      {/* Features Grid */}
      <div className="features-grid">
        {currentFeatures.map((category, categoryIndex) => (
          <div key={categoryIndex} className="feature-category">
            <div className="category-header">
              <div className="category-icon">{category.icon}</div>
              <h2 className="category-title">{category.category}</h2>
            </div>

            <div className="category-features">
              {category.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="feature-card">
                  <div className="feature-header">
                    <h3 className="feature-title">{feature.title}</h3>
                    <div className="feature-icon">✨</div>
                  </div>

                  <p className="feature-description">{feature.description}</p>

                  <div className="feature-details">
                    <h4 className="details-title">Key Features:</h4>
                    <ul className="details-list">
                      {feature.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="detail-item">
                          <span className="detail-bullet">•</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">
            {activeTab === 'students' ? 'Ready to Experience HostelHub?' : 'Ready to Manage Your Hostel?'}
          </h2>
          <p className="cta-description">
            {activeTab === 'students'
              ? 'Join thousands of students who are already enjoying seamless hostel management with HostelHub.'
              : 'Streamline your hostel operations with our comprehensive admin dashboard and powerful management tools.'
            }
          </p>
          <div className="cta-buttons">
            <button className="cta-button primary" onClick={handleGetStarted}>
              {activeTab === 'students' ? 'Get Started' : 'Admin Login'}
            </button>
            <button className="cta-button secondary">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;