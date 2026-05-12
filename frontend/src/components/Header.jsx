import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogIn, UserPlus, Menu, X } from 'lucide-react';
import { authenticateForStudent, authenticateForAdmin } from '../services/hostelService';
import './Header.css';

const Header = () => {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState(null);
    const isStudentRoute = location.pathname.startsWith('/student');
    const isAdminRoute = location.pathname.startsWith('/admin');
    const isOnProtectedRoute = isStudentRoute || isAdminRoute;

    useEffect(() => {
        const checkAuth = async () => {
            const studentAuth = await authenticateForStudent();
            const adminAuth = await authenticateForAdmin();
            if (studentAuth.isAuthenticated) {
                setIsAuthenticated(true);
                setUserType('student');
            } else if (adminAuth.isAuthenticated) {
                setIsAuthenticated(true);
                setUserType('admin');
            } else {
                setIsAuthenticated(false);
                setUserType(null);
            }
        };
        checkAuth();
    }, []);

    const publicNavItems = [
        { label: 'Home', path: '/#home' },
        { label: 'About', path: '/#about' },
        { label: 'Facilities', path: '/#facilities' },
        { label: 'Rooms', path: '/#rooms' },
        { label: 'Gallery', path: '/#gallery' },
        { label: 'Contact', path: '/contact-us' },
    ];

    const studentMenuItems = [
        { icon: '🏠', label: 'Student Home', path: '/student' },
        { icon: '👤', label: 'Profile', path: '/student/profile' },
        { icon: '📚', label: 'Modules', path: '/student/modules' },
        { icon: '📝', label: 'Feedback', path: '/student/complaint' },
        { icon: '🔒', label: 'Sign Out', path: '/logout' },
    ];

    const adminMenuItems = [
        { icon: '🏠', label: 'Admin Home', path: '/admin' },
        { icon: '🛠️', label: 'Admin Profile', path: '/admin/profile' },
        { icon: '📦', label: 'Modules', path: '/admin/modules' },
        { icon: '📣', label: 'Feedback', path: '/admin/feedback' },
        { icon: '🔒', label: 'Sign Out', path: '/logout' },
    ];

    const menuItems = isAdminRoute ? adminMenuItems : isStudentRoute ? studentMenuItems : publicNavItems;

    return (
        <header className="header">
            <div className="header-container">
                <button
                    className={`menu-toggle ${menuOpen ? 'open' : ''}`}
                    aria-label="Toggle navigation menu"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen(prev => !prev)}
                >
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>

                <div className="header-logo">
                    <Link to="/" className="logo">
                        <span className="logo-icon">🏨</span>
                        <span className="logo-text">HostelHub</span>
                    </Link>
                </div>

                {menuOpen && (
                    <div className={`menu-panel ${isOnProtectedRoute ? '' : 'public-menu-panel'}`}>
                        {menuItems.map((item) => (
                            isOnProtectedRoute ? (
                                <Link
                                    key={item.label}
                                    to={item.path}
                                    className="menu-link"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <span className="menu-icon">{item.icon || '•'}</span>
                                    {item.label}
                                </Link>
                            ) : (
                                <a
                                    key={item.label}
                                    href={item.path}
                                    className="menu-link"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {item.label}
                                </a>
                            )
                        ))}
                    </div>
                )}

                <nav className="header-nav">
                    {publicNavItems.map((item) => (
                        <a key={item.label} href={item.path} className="nav-link">
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="header-auth">
                    {isAuthenticated ? (
                        <>
                            <Link to={userType === 'admin' ? '/admin' : '/student'} className="btn btn-dashboard">
                                <span className="btn-icon">🏠</span>
                                Dashboard
                            </Link>
                            <Link to="/logout" className="btn btn-logout">
                                <span className="btn-icon">🔓</span>
                                Logout
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/sign-in" className="btn btn-signin">
                                <LogIn size={16} />
                                Student Login
                            </Link>
                            <Link to="/sign-in" className="btn btn-admin">
                                <UserPlus size={16} />
                                Admin Login
                            </Link>
                            <Link to="/sign-up" className="btn btn-signup">
                                Apply Now
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;