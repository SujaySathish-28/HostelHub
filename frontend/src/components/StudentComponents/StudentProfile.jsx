import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStudentProfile } from '../../store/studentSlice';

const StudentProfile = () => {
    const dispatch = useDispatch();
    const profile = useSelector((state) => state.student.profile);
    const loading = useSelector((state) => state.student.status) === 'loading';
    const error = useSelector((state) => state.student.error);
    const displayedProfile = profile || {};

    useEffect(() => {
        if (!profile && !loading) {
            dispatch(fetchStudentProfile());
        }
    }, [dispatch, profile, loading]);

    if (loading && !profile) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <h1 style={styles.heading}>Student Profile</h1>
                    <p style={styles.loadingText}>Loading profile...</p>
                </div>
            </div>
        );
    }

    if ((!loading && !profile) || error) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <h1 style={styles.heading}>Student Profile</h1>
                    <p style={styles.errorText}>{error || 'No student profile available.'}</p>
                </div>
            </div>
        );
    }

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

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.profileSummary}>
                    <div style={styles.profileInfo}>
                        <div style={styles.photoWrapper}>
                            <img
                                src={getPhotoSrc(displayedProfile.profilePhoto)}
                                alt="Profile"
                                style={styles.profilePhoto}
                                onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/180?text=No+Photo';
                                }}
                            />
                        </div>
                        <div style={styles.profileText}>
                            <h1 style={styles.heading}>{`${displayedProfile.firstName || ''} ${displayedProfile.lastName || ''}`.trim() || 'Student Profile'}</h1>
                            <p style={styles.description}>
                                A polished overview of the student’s personal data, hostel placement, and account details.
                            </p>
                            <div style={styles.metaRow}>
                                <div style={styles.metaItem}>
                                    <span style={styles.metaIcon}>🆔</span>
                                    <div>
                                        <div style={styles.metaLabel}>Student ID</div>
                                        <div style={styles.metaValue}>{displayedProfile.studentID || '-'}</div>
                                    </div>
                                </div>
                                <div style={styles.metaItem}>
                                    <span style={styles.metaIcon}>🧑‍🎓</span>
                                    <div>
                                        <div style={styles.metaLabel}>Year</div>
                                        <div style={styles.metaValue}>{displayedProfile.year ? `${displayedProfile.year}${displayedProfile.year === '1' ? 'st' : displayedProfile.year === '2' ? 'nd' : displayedProfile.year === '3' ? 'rd' : 'th'}` : '-'}</div>
                                    </div>
                                </div>
                            </div>
                            <div style={styles.barcodeCard}>
                                <div style={styles.barcodeLabel}>Student ID</div>
                                <div style={styles.barcodeLines}>
                                    {Array.from({ length: 24 }).map((_, index) => (
                                        <div
                                            key={index}
                                            style={index % 4 === 0 ? styles.barcodeBarTall : styles.barcodeBarShort}
                                        />
                                    ))}
                                </div>
                                <div style={styles.barcodeText}>{displayedProfile.studentID || '000000'}</div>
                            </div>
                        </div>
                    </div>
                    <div style={styles.statusCard}>
                        <div style={styles.statusTitle}>Student Status</div>
                        <div style={styles.statusValue}>{displayedProfile.userType?.toUpperCase() || 'STUDENT'}</div>
                        <div style={styles.statusDetails}>{displayedProfile.branch || 'Unknown branch'} • Room {displayedProfile.roomNo || '-'}</div>
                    </div>
                </div>

                <div style={styles.sectionRow}>
                    <div style={styles.sectionCard}>
                        <div style={styles.sectionHeader}>
                            <span style={styles.sectionIcon}>👤</span>
                            <span style={styles.sectionTitle}>Personal Info</span>
                        </div>
                        <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Name</span>
                            <span style={styles.detailValue}>{`${displayedProfile.firstName || '-'} ${displayedProfile.lastName || '-'}`}</span>
                        </div>
                        <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Email</span>
                            <span style={styles.detailValue}>{displayedProfile.email || '-'}</span>
                        </div>
                        <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Username</span>
                            <span style={styles.detailValue}>{displayedProfile.userName || '-'}</span>
                        </div>
                    </div>

                    <div style={styles.sectionCard}>
                        <div style={styles.sectionHeader}>
                            <span style={styles.sectionIcon}>🏠</span>
                            <span style={styles.sectionTitle}>Academic Details</span>
                        </div>
                        <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Branch</span>
                            <span style={styles.detailValue}>{displayedProfile.branch || '-'}</span>
                        </div>
                        <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Year</span>
                            <span style={styles.detailValue}>{displayedProfile.year ? `${displayedProfile.year}${displayedProfile.year === '1' ? 'st' : displayedProfile.year === '2' ? 'nd' : displayedProfile.year === '3' ? 'rd' : 'th'}` : '-'}</span>
                        </div>
                        <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Room no.</span>
                            <span style={styles.detailValue}>{displayedProfile.roomNo || '-'}</span>
                        </div>
                    </div>
                </div>

                <div style={styles.sectionCardWide}>
                    <div style={styles.sectionHeader}>
                        <span style={styles.sectionIcon}>📍</span>
                        <span style={styles.sectionTitle}>Address</span>
                    </div>
                    <p style={styles.addressText}>{displayedProfile.address || 'No address saved yet.'}</p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '28px',
        minHeight: 'calc(100vh - 120px)',
        backgroundColor: '#f5f7ff',
    },
    card: {
        maxWidth: '980px',
        margin: '0 auto',
        padding: '28px',
        borderRadius: '22px',
        backgroundColor: '#ffffff',
        boxShadow: '0 18px 48px rgba(15, 23, 42, 0.08)',
    },
    heading: {
        marginBottom: '16px',
        fontSize: '28px',
        color: '#111827',
    },
    description: {
        marginBottom: '24px',
        fontSize: '16px',
        color: '#4b5563',
        lineHeight: '1.7',
        maxWidth: '760px',
    },
    summaryChips: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '24px',
    },
    chip: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 14px',
        backgroundColor: '#eef2ff',
        color: '#3730a3',
        borderRadius: '999px',
        fontSize: '14px',
        fontWeight: 600,
        border: '1px solid #c7d2fe',
    },
    chipIcon: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '20px',
        height: '20px',
        borderRadius: '999px',
        backgroundColor: '#c7d2fe',
        color: '#4338ca',
        fontSize: '12px',
    },
    profileSummary: {
        display: 'grid',
        gap: '24px',
        gridTemplateColumns: '1.8fr 1fr',
        marginBottom: '28px',
        alignItems: 'center',
    },
    profileInfo: {
        display: 'flex',
        gap: '24px',
        alignItems: 'center',
    },
    profileText: {
        flex: 1,
    },
    photoWrapper: {
        width: '180px',
        height: '180px',
        borderRadius: '28px',
        overflow: 'hidden',
        boxShadow: '0 16px 40px rgba(15, 23, 42, 0.12)',
        border: '1px solid rgba(99, 102, 241, 0.18)',
        backgroundColor: '#eef2ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profilePhoto: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    metaRow: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        marginTop: '20px',
    },
    metaItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 18px',
        borderRadius: '16px',
        backgroundColor: '#eef2ff',
        border: '1px solid #dbeafe',
        minWidth: '150px',
    },
    metaIcon: {
        width: '34px',
        height: '34px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px',
        backgroundColor: '#c7d2fe',
        color: '#3730a3',
        fontSize: '16px',
    },
    metaLabel: {
        color: '#475569',
        fontSize: '12px',
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        marginBottom: '4px',
    },
    metaValue: {
        color: '#0f172a',
        fontSize: '15px',
        fontWeight: 700,
    },
    statusCard: {
        padding: '24px',
        borderRadius: '24px',
        background: 'linear-gradient(180deg, #eef2ff 0%, #e0f2fe 100%)',
        border: '1px solid #c7d2fe',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    statusTitle: {
        color: '#4338ca',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        fontSize: '12px',
    },
    statusValue: {
        color: '#0f172a',
        fontSize: '28px',
        fontWeight: 800,
    },
    statusDetails: {
        color: '#475569',
        fontSize: '14px',
        lineHeight: '1.6',
    },
    sectionRow: {
        display: 'grid',
        gap: '22px',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        marginBottom: '22px',
    },
    sectionCard: {
        padding: '24px',
        borderRadius: '24px',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        boxShadow: '0 18px 40px rgba(15, 23, 42, 0.05)',
    },
    sectionCardWide: {
        padding: '24px',
        borderRadius: '24px',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        boxShadow: '0 18px 40px rgba(15, 23, 42, 0.05)',
    },
    sectionHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '18px',
    },
    sectionIcon: {
        width: '36px',
        height: '36px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px',
        backgroundColor: '#e0f2fe',
        color: '#0c4a6e',
        fontSize: '18px',
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: 700,
        color: '#0f172a',
    },
    detailItem: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '12px',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid #e2e8f0',
    },
    detailLabel: {
        color: '#475569',
        fontSize: '14px',
    },
    detailValue: {
        color: '#0f172a',
        fontSize: '15px',
        fontWeight: 700,
    },
    barcodeCard: {
        marginTop: '20px',
        padding: '16px',
        borderRadius: '20px',
        backgroundColor: '#71757f',
        border: '1px solid rgba(255, 255, 255, 0.12)',
    },
    barcodeLabel: {
        color: '#cbd5e1',
        fontSize: '12px',
        fontWeight: 700,
        marginBottom: '10px',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
    },
    barcodeLines: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: '4px',
        marginBottom: '10px',
        minHeight: '70px',
        padding: '10px',
        backgroundColor: '#8795b6',
        borderRadius: '14px',
    },
    barcodeBarTall: {
        width: '5px',
        height: '100%',
        backgroundColor: '#f8fafc',
        borderRadius: '2px',
    },
    barcodeBarShort: {
        width: '4px',
        height: '55%',
        backgroundColor: '#f8fafc',
        borderRadius: '2px',
    },
    barcodeText: {
        color: '#f8fafc',
        fontSize: '13px',
        letterSpacing: '0.32em',
        textTransform: 'uppercase',
    },
    addressText: {
        color: '#334155',
        fontSize: '15px',
        lineHeight: '1.9',
    },
    label: {
        display: 'block',
        marginBottom: '10px',
        color: '#6b7280',
        fontSize: '14px',
        fontWeight: 600,
    },
    value: {
        color: '#111827',
        fontSize: '16px',
        fontWeight: 700,
    },
    loadingText: {
        color: '#4b5563',
        fontSize: '16px',
        marginTop: '12px',
    },
    errorText: {
        color: '#b91c1c',
        fontSize: '16px',
        marginTop: '12px',
    },
};

export default StudentProfile;