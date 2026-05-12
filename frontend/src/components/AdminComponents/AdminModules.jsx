import { useNavigate } from 'react-router-dom';

const AdminModules = () => {
    const navigate = useNavigate();

    const cards = [
        {
            title: 'Mark Attendance',
            description: 'Mark attendance of students',
            path: '/admin/mark-attendance'
        },
        {
            title: 'Admit a Student',
            description: 'Add new students to the hostel database.',
            path: '/admin/admit-student'
        },
        {
            title: 'Report a Student',
            description: 'Submit and manage student reports.',
            path: '/admin/report-student'
        },
        {
            title: 'Complaints From Students',
            description: 'Take a look at the issues and fix them',
            path: '/admin/admin-complaints'
        },
        {
            title: 'Remarks of Student',
            description: 'View and add remarks for students.',
            path: '/admin/remarks-of-student'
        },
        {
            title: 'Pending Leave Requests',
            description: 'Review and action student pending leave requests.',
            path: '/admin/pending-leave-requests'
        },
        {
            title: 'Accepted Leave Requests',
            description: 'View all accepted leave requests.',
            path: '/admin/accepted-leave-requests'
        },
        {
            title: 'Rejected Leave Requests',
            description: 'View all rejected leave requests.',
            path: '/admin/rejected-leave-requests'
        },
        {
            title: 'leave history',
            description: 'Leave history of each student',
            path: '/admin/leave-history'
        },
        {
            title: 'Notice Board',
            description: 'Add, edit, and delete admin notices.',
            path: '/admin/notice-board'
        },
        {
            title: 'Rules & Regulations',
            description: 'Manage rules and regulations separately.',
            path: '/admin/rules-regulations'
        },
        {
            title: 'Alerts',
            description: 'Create and manage admin alerts.',
            path: '/admin/alerts'
        },
        {
            title: 'Announcements',
            description: 'Create, edit, and remove announcements for students.',
            path: '/admin/announcements'
        },
        {
            title: 'Mess Menu',
            description: 'Add and manage mess menu items with veg/non-veg selection.',
            path: '/admin/mess-menu'
        },
        {
            title: 'Add Admin',
            description: 'Add new administrators to the system.',
            path: '/admin/add-admin'
        },
    ];

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.heading}>Admin Modules</h2>
                <p style={styles.subtext}>Select a module to manage student operations.</p>
            </div>
            <div style={styles.row}>
                {cards.map((card, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => navigate(card.path)}
                        style={styles.card}
                        aria-label={card.title}
                    >
                        <div>
                            <h3 style={styles.cardTitle}>{card.title}</h3>
                            <p style={styles.cardDescription}>{card.description}</p>
                        </div>
                        <span style={styles.arrow}>&#8594;</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '30px',
        maxWidth: '1240px',
        margin: '0 auto'
    },
    header: {
        marginBottom: '24px'
    },
    heading: {
        margin: '0 0 8px 0',
        fontSize: '32px',
        color: 'var(--text-h)'
    },
    subtext: {
        margin: 0,
        color: 'var(--muted)',
        fontSize: '16px'
    },
    row: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'space-between'
    },
    card: {
        flex: '1 1 250px',
        minWidth: '250px',
        maxWidth: '300px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px',
        border: '1px solid var(--border)',
        borderRadius: '18px',
        backgroundColor: 'var(--card-bg)',
        boxShadow: 'var(--shadow)',
        cursor: 'pointer',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
        textAlign: 'left'
    },
    cardTitle: {
        margin: '0 0 10px 0',
        fontSize: '22px',
        color: 'var(--text-h)'
    },
    cardDescription: {
        margin: 0,
        color: 'var(--text)',
        fontSize: '15px',
        lineHeight: '1.7'
    },
    arrow: {
        marginTop: '20px',
        fontSize: '24px',
        color: 'var(--accent)',
        alignSelf: 'flex-end'
    }
};

export default AdminModules;