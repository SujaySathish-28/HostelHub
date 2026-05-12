import { useNavigate } from 'react-router-dom';

const Modules = () => {
    const navigate = useNavigate();
    const modules = [
        { name: 'Leave Request', description: 'Submit a leave request', path: '/student/leave' },
        { name: 'Leave Request Status', description: 'View the status of your leave requests', path: '/student/leave-status' },
        { name: 'Complaint', description: 'File a complaint', path: '/student/complaint' },
        { name: 'Fee Details', description: 'View your current fee breakdown', path: '/student/fees' },
        { name: 'Leave History', description: 'View your leave history', path: '/student/leave-history' },
        { name: 'Notice Board', description: 'View all student notices', path: '/student/notices' },
        { name: 'Rules & Regulations', description: 'Read hostel rules and regulations', path: '/student/rules-regulations' },
        { name: 'Alerts', description: 'View all student alerts', path: '/student/alerts' },
        { name: 'Mess Menu', description: 'View the weekly mess menu', path: '/student/mess-menu' }
    ];

    const handleClick = (path) => {
        navigate(path);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>Available Modules</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                {modules.map((module, index) => (
                    <div key={index} style={{
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '20px',
                        textAlign: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>{module.name}</h3>
                        <p style={{ margin: '0 0 15px 0', color: '#666' }}>{module.description}</p>
                        <button 
                            style={{
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleClick(module.path)}
                        >
                            Access
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Modules;