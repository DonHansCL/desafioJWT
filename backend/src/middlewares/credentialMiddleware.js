const credentialMiddleware = (req, res, next) => { 
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email y password son obligatorios.' });
    }
    next();
}

module.exports = credentialMiddleware;