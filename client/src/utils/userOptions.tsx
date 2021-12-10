const { REACT_APP_BASE_URL } = process.env;

const login = (email: string, password: string) => {
    return {
        url: `${REACT_APP_BASE_URL}/user/login`,
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
        url: `${REACT_APP_BASE_URL}/user/register`,
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
    return { url: `${REACT_APP_BASE_URL}/user/logout` };
};

const verify = () => {
    return { url: `${REACT_APP_BASE_URL}/user/verify` }
}

const userOptions = {
    login,
    register,
    logout,
    verify
}

export default userOptions;