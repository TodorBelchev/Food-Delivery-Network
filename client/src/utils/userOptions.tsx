const login = (email: string, password: string) => {
    return {
        url: 'http://localhost:3030/api/user/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    }
};

const register = (email: string, password: string, rePassword: string) => {
    return {
        url: 'http://localhost:3030/api/user/register',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password,
            rePassword
        })
    }
};

const logout = () => {
    return { url: 'http://localhost:3030/api/user/logout' };
};

const userOptions = {
    login,
    register,
    logout
}

export default userOptions;