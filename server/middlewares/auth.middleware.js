import jsonwebtoken from 'jsonwebtoken';

export default (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
        req.user = jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};
