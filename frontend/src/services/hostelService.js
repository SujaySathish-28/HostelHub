export const createUserAtServer=async (data)=>{
    const res=await fetch('https://hostelhub-8wba.onrender.com/sign-up',{
        method:'POST',
        headers:{
            'content-type':'application/json'
        },
        body:JSON.stringify({data}),
    });
    const response=await res.json();
    return response;
}
export const signIn=async (data)=>{
    try {
        const res=await fetch('https://hostelhub-8wba.onrender.com/sign-in',{
            method:'POST',
            credentials: 'include',
            headers:{
                'content-type':'application/json',
            },
            body:JSON.stringify({data}),
        });
        const payload = await res.json();
        return { status: res.status, payload };
    } catch (err) {
        return { status: 0, payload: { error: 'Unable to reach backend. Please make sure the server is running and CORS is enabled.' } };
    }
}

export const authenticateForStudent=async ()=>{
    const res=await fetch('https://hostelhub-8wba.onrender.com/auth-student',{
        credentials:"include"
    });
    const resp=await res.json();
    return {isAuthenticated:resp.isAuthenticated,isAuthorizedAsStudent:resp.isAuthorizedAsStudent};
}
export const authenticateForAdmin=async ()=>{
    const res=await fetch('https://hostelhub-8wba.onrender.com/auth-admin',{
        credentials:"include"
    });
    const resp=await res.json();
    return {isAuthenticated:resp.isAuthenticated,isAuthorizedAsAdmin:resp.isAuthorizedAsAdmin};
}

export const logout=async ()=>{
    const res=await fetch('https://hostelhub-8wba.onrender.com/logout',{
        method:'POST',
        credentials:"include"
    });
    const response=await res.json();
    return res;
}
