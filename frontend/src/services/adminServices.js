export const postAdmit=async (data)=>{
    const res=await fetch('http://localhost:3001/admit-student',{
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

export const getLeaveRequests=async ()=>{
    const res=await fetch('http://localhost:3001/leave-requests',{
        credentials:'include',
    });
    const resp=await res.json();
    return resp;
}

export const getComplaints=async ()=>{
    const res = await fetch('http://localhost:3001/admin/admin-complaints', {
        credentials: 'include',
    });
    const resp = await res.json();
    return resp;
}

export const completeComplaint = async (id) => {
    const res = await fetch(`http://localhost:3001/admin/admin-complaints/${encodeURIComponent(id)}/complete`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const resp = await res.json();
    return resp;
}

export const getAttendanceRooms = async () => {
    const res = await fetch('http://localhost:3001/admin/attendance-rooms', {
        credentials: 'include',
    });
    const resp = await res.json();
    return resp;
}

export const saveAttendance = async (attendance) => {
    const res = await fetch('http://localhost:3001/admin/attendance', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attendance }),
    });
    const resp = await res.json();
    return resp;
}

export const getAdminProfile = async () => {
    const res = await fetch('http://localhost:3001/admin/profile', {
        credentials: 'include',
    });
    return await res.json();
}

export const getLeaveHistoryStudents = async () => {
    const res = await fetch('http://localhost:3001/admin/leave-history/students', {
        credentials: 'include',
    });
    const resp = await res.json();
    return resp;
}

export const getLeaveHistoryByStudent = async (studentID) => {
    const url = new URL('http://localhost:3001/admin/leave-history');
    url.searchParams.append('studentID', studentID);
    const res = await fetch(url.toString(), {
        credentials: 'include',
    });
    const resp = await res.json();
    return resp;
}

export const updateLeaveRequestStatus=async (status,studentID,reason,requestId)=>{
    const url = new URL('http://localhost:3001/admin/leave-requests-status-update');
    if (studentID) url.searchParams.append('studentID', studentID);
    if (requestId) url.searchParams.append('requestId', requestId);
    url.searchParams.append('status', status);
    url.searchParams.append('reason', reason);

    const res=await fetch(url.toString(),{
        credentials:'include',
    });
    const resp=await res.json();
    return resp;
}

export const getNoticeBoard = async () => {
    const res = await fetch('http://localhost:3001/admin/notices', {
        credentials: 'include',
    });
    return await res.json();
};

export const createNotice = async (notice) => {
    const res = await fetch('http://localhost:3001/admin/notices', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(notice),
    });
    return await res.json();
};

export const updateNotice = async (id, notice) => {
    const res = await fetch(`http://localhost:3001/admin/notices/${encodeURIComponent(id)}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(notice),
    });
    return await res.json();
};

export const deleteNotice = async (id) => {
    const res = await fetch(`http://localhost:3001/admin/notices/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    return await res.json();
};

export const getRulesRegulations = async (itemType) => {
    const url = new URL('http://localhost:3001/admin/rules-regulations');
    if (itemType) {
        url.searchParams.append('type', itemType);
    }
    const res = await fetch(url.toString(), {
        credentials: 'include',
    });
    return await res.json();
};

export const createRuleRegulation = async (item) => {
    const res = await fetch('http://localhost:3001/admin/rules-regulations', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(item),
    });
    return await res.json();
};

export const updateRuleRegulation = async (id, item) => {
    const res = await fetch(`http://localhost:3001/admin/rules-regulations/${encodeURIComponent(id)}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(item),
    });
    return await res.json();
};

export const deleteRuleRegulation = async (id) => {
    const res = await fetch(`http://localhost:3001/admin/rules-regulations/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    return await res.json();
};

export const getAlerts = async () => {
    const res = await fetch('http://localhost:3001/admin/alerts', {
        credentials: 'include',
    });
    return await res.json();
};

export const createAlert = async (alert) => {
    const res = await fetch('http://localhost:3001/admin/alerts', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(alert),
    });
    return await res.json();
};

export const updateAlert = async (id, alert) => {
    const res = await fetch(`http://localhost:3001/admin/alerts/${encodeURIComponent(id)}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(alert),
    });
    return await res.json();
};

export const deleteAlert = async (id) => {
    const res = await fetch(`http://localhost:3001/admin/alerts/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    return await res.json();
};

export const getAnnouncements = async () => {
    const res = await fetch('http://localhost:3001/admin/announcements', {
        credentials: 'include',
    });
    return await res.json();
};

export const createAnnouncement = async (announcement) => {
    const res = await fetch('http://localhost:3001/admin/announcements', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(announcement),
    });
    return await res.json();
};

export const updateAnnouncement = async (id, announcement) => {
    const res = await fetch(`http://localhost:3001/admin/announcements/${encodeURIComponent(id)}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(announcement),
    });
    return await res.json();
};

export const deleteAnnouncement = async (id) => {
    const res = await fetch(`http://localhost:3001/admin/announcements/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    return await res.json();
};

export const updateAdminTheme = async (theme) => {
    const res = await fetch('http://localhost:3001/admin/update-theme', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({ theme }),
    });
    return await res.json();
};

export const getDashboardStats = async () => {
    const res = await fetch('http://localhost:3001/admin/dashboard-stats', {
        credentials: 'include',
    });
    return await res.json();
};

export const getAllStudents = async () => {
    const res = await fetch('http://localhost:3001/admin/students', {
        credentials: 'include',
    });
    return await res.json();
};

export const getAttendanceHistory = async () => {
    const res = await fetch('http://localhost:3001/admin/attendance-history', {
        credentials: 'include',
    });
    return await res.json();
};

export const getAllAdmins = async () => {
    const res = await fetch('http://localhost:3001/admin/admins', {
        credentials: 'include',
    });
    return await res.json();
};