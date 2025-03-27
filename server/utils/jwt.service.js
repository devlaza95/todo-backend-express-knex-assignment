import jwt from 'jsonwebtoken';

export const jwtService = () => {
    const accessToken = (payload) => jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    const refreshToken = (payload) => jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

    return {
        accessToken,
        refreshToken,
    };
};
