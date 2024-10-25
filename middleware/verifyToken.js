import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authToken = req.headers.token;
    if (authToken) {
        const token = authToken.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if (err) return res.status(403).json({ message: "Token no válido" });
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({message: "No está autenticado"});
    }
}


// Middleware to verify  is the user is logged in or admin
export const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin || req.user.userId === req.params.id) {
            next();
        } else {
            return res.status(403).json({message: "No está autorizado"});
        }
    });
}

// Middleware to verify if the user is an admin
export const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({message: "No está autorizado"});
        }
    });
}