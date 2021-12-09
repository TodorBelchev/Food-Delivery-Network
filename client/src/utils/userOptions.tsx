import env from "./env";

const login = (email: string, password: string) => {
    return {
        url: `${env.BASE_URL}/user/login`,
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
        url: `${env.BASE_URL}/user/register`,
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
    return { url: `${env.BASE_URL}/user/logout` };
};

const userOptions = {
    login,
    register,
    logout
}

export default userOptions;