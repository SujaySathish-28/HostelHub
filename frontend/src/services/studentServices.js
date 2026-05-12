export const postLeaveRequest=async (data)=>{
    const res=await fetch('https://hostelhub-8wba.onrender.com/student-leave',{
        method:'POST',
        credentials: "include",
        headers:{
            'content-type':'application/json',
        },
        body:JSON.stringify({data}),
    });
    const resp=await res.json();
    return resp;
}

export const getStudentProfile = async () => {
    const res = await fetch('https://hostelhub-8wba.onrender.com/student/profile', {
        credentials: 'include'
    });
    return await res.json();
}

export const postComplaint = async (data) => {
    const res = await fetch('https://hostelhub-8wba.onrender.com/student/complaint', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return await res.json();
}

export const getLeaveRequestStatus=async (studentID)=>{
    const res = await fetch(`https://hostelhub-8wba.onrender.com/student/leave-status?studentID=${encodeURIComponent(studentID)}`, {
        credentials: 'include'
    });
    const response = await res.json();
    return response;
}

export const getStudentLeaveHistory = async () => {
    const res = await fetch('https://hostelhub-8wba.onrender.com/student/leave-history', {
        credentials: 'include'
    });
    return await res.json();
}

export const cancelLeaveRequest=async (requestId)=>{
    const res = await fetch(`https://hostelhub-8wba.onrender.com/student/cancel-leave/${encodeURIComponent(requestId)}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
    });
    const response = await res.json();
    return response;
}

export const getNoticeBoard = async () => {
    const res = await fetch('https://hostelhub-8wba.onrender.com/admin/notices', {
        credentials: 'include',
    });
    return await res.json();
}

export const getRulesAndRegulations = async (itemType) => {
    const url = new URL('https://hostelhub-8wba.onrender.com/admin/rules-regulations');
    if (itemType) {
        url.searchParams.append('type', itemType);
    }
    const res = await fetch(url.toString(), {
        credentials: 'include',
    });
    return await res.json();
}

export const getStudentAlerts = async () => {
    const res = await fetch('https://hostelhub-8wba.onrender.com/student/alerts', {
        credentials: 'include',
    });
    return await res.json();
}

export const getStudentAttendanceStats = async () => {
    const res = await fetch('https://hostelhub-8wba.onrender.com/student/attendance-stats', {
        credentials: 'include',
    });
    return await res.json();
}

export const getStudentComplaints = async () => {
    const res = await fetch('https://hostelhub-8wba.onrender.com/student/complaints', {
        credentials: 'include',
    });
    return await res.json();
}

export const getAnnouncements = async () => {
    const res = await fetch('https://hostelhub-8wba.onrender.com/admin/announcements', {
        credentials: 'include',
    });
    return await res.json();
};

export const updateStudentTheme = async (theme) => {
    const res = await fetch('https://hostelhub-8wba.onrender.com/student/update-theme', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({ theme }),
    });
    return await res.json();
};
