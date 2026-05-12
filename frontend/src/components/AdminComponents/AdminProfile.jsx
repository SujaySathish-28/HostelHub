import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAdminProfile } from '../../store/adminSlice';

const AdminProfile = () => {
    const dispatch = useDispatch();
    const profile = useSelector((state) => state.admin.profile);
    const loading = useSelector((state) => state.admin.status) === 'loading';
    const error = useSelector((state) => state.admin.error);
    const displayedProfile = profile || {};

    useEffect(() => {
        if (!profile && !loading) {
            dispatch(fetchAdminProfile());
        }
    }, [dispatch, profile, loading]);

    const getPhotoSrc = (photo) => {
        if (!photo) {
            return 'https://via.placeholder.com/180?text=No+Photo';
        }

        if (photo.startsWith('data:')) {
            return photo;
        }

        if (photo.startsWith('http') || photo.startsWith('/')) {
            return photo;
        }

        return `data:image/jpeg;base64,${photo}`;
    };

    if (loading && !profile) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <h1 style={styles.heading}>Admin Profile</h1>
                    <p style={styles.loadingText}>Loading profile...</p>
                </div>
            </div>
        );
    }

    if ((!loading && !profile) || error) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <h1 style={styles.heading}>Admin Profile</h1>
                    <p style={styles.errorText}>{error || 'No admin profile available.'}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.profileHeader}>
                    <div style={styles.photoFrame}>
                        <img
                            src={getPhotoSrc(displayedProfile.profilePhoto)}
                            alt="Admin profile"
                            style={styles.profileImage}
                            onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/180?text=No+Photo';
                            }}
                        />
                    </div>
                    <div style={styles.profileSummary}>
                        <h1 style={styles.heading}>{`${displayedProfile.firstName || ''} ${displayedProfile.lastName || ''}`.trim() || 'Admin Profile'}</h1>
                        <p style={styles.description}>Manage your personal information and account details for admin access.</p>
                        <div style={styles.badges}>
                            <span style={styles.badge}>{displayedProfile.userType?.toUpperCase() || 'ADMIN'}</span>
                            <span style={styles.badge}>Admin ID: {displayedProfile.adminId || '-'}</span>
                        </div>
                    </div>
                </div>

                <div style={styles.detailsGrid}>
                    <div style={styles.detailCard}>
                        <h2 style={styles.detailTitle}>Contact Details</h2>
                        <div style={styles.detailRow}>
                            <span style={styles.detailLabel}>Email</span>
                            <span style={styles.detailValue}>{displayedProfile.email || '-'}</span>
                        </div>
                        <div style={styles.detailRow}>
                            <span style={styles.detailLabel}>Username</span>
                            <span style={styles.detailValue}>{displayedProfile.userName || '-'}</span>
                        </div>
                    </div>

                    <div style={styles.detailCard}>
                        <h2 style={styles.detailTitle}>Admin Details</h2>
                        <div style={styles.detailRow}>
                            <span style={styles.detailLabel}>First Name</span>
                            <span style={styles.detailValue}>{displayedProfile.firstName || '-'}</span>
                        </div>
                        <div style={styles.detailRow}>
                            <span style={styles.detailLabel}>Last Name</span>
                            <span style={styles.detailValue}>{displayedProfile.lastName || '-'}</span>
                        </div>
                        <div style={styles.detailRow}>
                            <span style={styles.detailLabel}>Admin Identifier</span>
                            <span style={styles.detailValue}>{displayedProfile.adminId || '-'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '28px',
        minHeight: 'calc(100vh - 120px)',
        backgroundColor: 'var(--page-bg)',
    },
    card: {
        maxWidth: '980px',
        margin: '0 auto',
        padding: '28px',
        borderRadius: '22px',
        backgroundColor: 'var(--card-bg)',
        boxShadow: 'var(--shadow)',
    },
    heading: {
        marginBottom: '10px',
        fontSize: '28px',
        color: 'var(--text-h)',
    },
    description: {
        color: 'var(--text)',
        fontSize: '16px',
        lineHeight: '1.7',
        maxWidth: '700px',
    },
    loadingText: {
        color: 'var(--text)',
        fontSize: '16px',
    },
    errorText: {
        color: '#b91c1c',
        fontSize: '16px',
    },
    profileHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '28px',
        marginBottom: '30px',
        flexWrap: 'wrap',
    },
    photoFrame: {
        width: '180px',
        height: '180px',
        borderRadius: '28px',
        overflow: 'hidden',
        boxShadow: '0 16px 40px rgba(15, 23, 42, 0.12)',
        border: '1px solid var(--border)',
        backgroundColor: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    profileSummary: {
        flex: 1,
    },
    badges: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        marginTop: '18px',
    },
    badge: {
        backgroundColor: 'var(--accent-bg)',
        color: 'var(--accent)',
        padding: '10px 14px',
        borderRadius: '999px',
        fontWeight: 600,
        fontSize: '14px',
    },
    detailsGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
    },
    detailCard: {
        padding: '22px',
        borderRadius: '18px',
        border: '1px solid var(--border)',
        backgroundColor: 'var(--bg)',
    },
    detailTitle: {
        margin: 0,
        fontSize: '18px',
        fontWeight: 700,
        color: 'var(--text-h)',
        marginBottom: '18px',
    },
    detailRow: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '14px',
        fontSize: '15px',
    },
    detailLabel: {
        color: 'var(--muted)',
        fontWeight: 600,
    },
    detailValue: {
        color: 'var(--text-h)',
        textAlign: 'right',
        minWidth: '120px',
    },
};

export default AdminProfile;
