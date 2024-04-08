import jwt from 'jsonwebtoken';




export default async function Auth(req, res, next){
    try {
        const token = req.headers.authorization.split(" ")[1];

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodedToken;

        req.session = {
            userId: decodedToken.userId, // Assuming userId is stored in token
            username: decodedToken.username, // Assuming username is stored in token
            loggedInAt: new Date() // Add any other session data you need
        };
        
        next();
    } catch (error) {
        res.status(401).json({error: "Authentication failed"});
    }
}


export function localVariables(req, res, next){
    req.app.locals = {
        OTP : null,
        resetSession: false
    }
    next()
}