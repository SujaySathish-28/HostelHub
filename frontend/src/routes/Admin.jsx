import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminProfile } from '../store/adminSlice';
import AdminDashboard from '../components/AdminComponents/AdminDashboard';

const Admin = () => {
    const dispatch = useDispatch();
    const { status, error } = useSelector((state) => state.admin);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAdminProfile());
        }
    }, [dispatch, status]);

    if (status === 'loading') {
        return (
            <div style={styles.container}>
                <p style={styles.message}>Loading admin profile...</p>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div style={styles.container}>
                <p style={styles.error}>{error || 'Unable to load admin profile.'}</p>
            </div>
        );
    }

    return <AdminDashboard />;
};

const styles = {
    container: {
        minHeight: 'calc(100vh - 100px)',
        padding: '24px',
        backgroundColor: 'var(--bg)',
        color: 'var(--text)'
    },
    message: {
        color: 'var(--text)',
        fontSize: '18px',
        textAlign: 'center',
        marginTop: '40px',
    },
    error: {
        color: '#f87171',
        fontSize: '18px',
        textAlign: 'center',
        marginTop: '40px',
    },
};

export default Admin;