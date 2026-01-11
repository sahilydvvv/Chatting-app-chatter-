import jwt from "jsonwebtoken";

export const generateToken = (id, res) => {
    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in the environment variables");
        }

        const token = jwt.sign(
            { id },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

    } catch (error) {
        console.error("Error generating token:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
