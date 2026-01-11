import jwt from "jsonwebtoken"

export const authMiddleware = (req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Unauthorized"})
        }
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET not defined");
        }
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        req.user = {id:decodedToken.id};
        next();
    } catch (error) {
        console.log("Error verifying token",error)
        return res.status(401).json({message:"Unauthorized"})
    }
}