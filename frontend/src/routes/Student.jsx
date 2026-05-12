import StudentDashboard from '../components/StudentComponents/StudentDashboard.jsx';
import ProtectedRouteForStudent from '../components/ProtectedRouteForStudent.jsx'
const Student = () => {
  return <ProtectedRouteForStudent><StudentDashboard /></ProtectedRouteForStudent>;
};

export default Student;
