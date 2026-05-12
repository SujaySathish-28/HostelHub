import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './routes/App.jsx'
import Home from './components/Home.jsx'
import SignUp, { postSignUp } from './components/SignUp.jsx'
import SignIn from './components/SignIn.jsx'
import ForgotPassword from './components/ForgotPassword.jsx'
import FeeDetails from './components/FeeDetails.jsx'
import Features from './components/Features.jsx'
import ContactUs from './components/ContactUs.jsx'
import Student from './routes/Student.jsx'
import Admin from './routes/Admin.jsx'
import AdminSubPage from './routes/AdminSubPage.jsx'
import StudentSubPage from './routes/StudentSubPage.jsx'
import StudentProfile from './components/StudentComponents/StudentProfile.jsx'
import MarkAttendance from './components/AdminComponents/MarkAttendance.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { postSignIn } from './components/SignIn.jsx'
import { leaveRequestAction } from './components/StudentComponents/LeaveRequest.jsx'
import ProtectedRouteForStudent from './components/ProtectedRouteForStudent.jsx'
import ProtectedRouteForAdmin from './components/ProtectedRouteForAdmin.jsx'
import LogOut from './components/LogOut.jsx'
import { admitAction } from './components/AdminComponents/AdmitStudent.jsx'
import Modules from './components/StudentComponents/Modules.jsx'
import AdminModules from './components/AdminComponents/AdminModules.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { ThemeProvider } from './store/ThemeContext.jsx'
import Error404 from './components/404.jsx'
const router=createBrowserRouter([
  {path:'/',element:<App/>,children:[
    {path:'/',element:<Home/>},
    {path:'/sign-up',element:<SignUp/>,action:postSignUp},
    {path:'/sign-in',element:<SignIn/>,action:postSignIn},
    {path:'/forgot-password',element:<ForgotPassword/>},
    {path:'/reset-password',element:<ForgotPassword/>},
    {path:'/pricing',element:<FeeDetails/>},
    {path:'/features',element:<Features/>},
    {path:'/contact-us', element:<ContactUs/>},
    {path:'/logout',element:<LogOut/>},
    {path:'/student',element:<ProtectedRouteForStudent ><Student/></ProtectedRouteForStudent>},
    {path:'/student/profile',element:<ProtectedRouteForStudent ><StudentProfile/></ProtectedRouteForStudent>},
    {path:'/student/mark-attendance',element:<ProtectedRouteForStudent ><MarkAttendance/></ProtectedRouteForStudent>},
    {path:'/student/modules',element:<ProtectedRouteForStudent ><Modules/></ProtectedRouteForStudent>},
 
    {path:'/student/leave',element:<ProtectedRouteForStudent ><StudentSubPage/></ProtectedRouteForStudent>,action:leaveRequestAction},
    {path:'/student/:page',element:<ProtectedRouteForStudent ><StudentSubPage/></ProtectedRouteForStudent>},
    {path:'/admin/mark-attendance',element:<ProtectedRouteForAdmin ><MarkAttendance/></ProtectedRouteForAdmin>},
    {path:'/admin/:page',element:<ProtectedRouteForAdmin ><AdminSubPage/></ProtectedRouteForAdmin>,action:admitAction},
    {path:'/admin',element:<ProtectedRouteForAdmin ><Admin/></ProtectedRouteForAdmin>},
    {path:'/admin/modules',element:<ProtectedRouteForAdmin ><AdminModules/></ProtectedRouteForAdmin>,},
    {path:'*',element:<Error404/>}
  ]}
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router}/>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
