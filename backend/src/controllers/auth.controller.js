import User from "../models/User.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/generateToken.js"

export const signup = async (req, res) => {
    try {
        const { email, password, name, phoneNumber } = req.body;
        if (!email || !password || !name || !phoneNumber) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const emailToLowerCase = email.toLowerCase()
        const existingUser = await User.findOne({ email: emailToLowerCase })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email: emailToLowerCase,
            password: hashedPassword,
            phoneNumber
        })
        generateToken(newUser._id, res)

        return res.status(201).json({
            message: "User created successfully",
            user: {
                name: newUser.name,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
                id: newUser._id,
                _id: newUser._id,
            }
        })
    } catch (error) {
        console.log("Error creating user", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const emailToLowerCase = email.toLowerCase()
        const user = await User.findOne({ email: emailToLowerCase }).select("+password")
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" })
        }
        generateToken(user._id, res)

        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                id: user._id,
                _id: user._id,
            }
        })
    } catch (error) {
        console.log("Error logging in", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        })
        return res.status(200).json({ message: "User logged out successfully" })

    } catch (error) {
        console.log("Error logging out", error)
        return res.status(500).json({ message: "Internal server error" })

    }
}

export const updateProfile = async (req, res) => {
    try {
        const { name, bio, profilePicture } = req.body;

        if (name === undefined && bio === undefined && profilePicture === undefined) {
            return res.status(400).json({ message: "NO fields to update" })
        }
        const userId = req.user.id;
        const user = await User.findOne({ _id: userId });
        if (!user) {
            console.log("user does not exist");
            return res.status(400).json({ message: "user does not exist" });
        }
        if (name !== undefined) user.name = name;
        if (bio !== undefined) user.bio = bio;
        if (profilePicture !== undefined) user.profilePicture = profilePicture;

        await user.save();
        return res.status(200).json({ message: "User updated successfully", user: { name: user.name, email: user.email, phoneNumber: user.phoneNumber, id: user._id, bio: user.bio, profilePicture: user.profilePicture } })
    } catch (error) {
        console.log("Error updating user", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const deleteProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findOne({ _id: userId });
        if (!user) {
            console.log("user does not exist");
            return res.status(400).json({ message: "user does not exist" });
        }
        await user.deleteOne();
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        })
        return res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
        console.log("Error deleting user", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const authenticate = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User fetched successfully", user });
    } catch (error) {
        console.log("Error fetching user", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({
            _id: { $ne: req.user.id }, // exclude logged-in user
        }).select("-password");

        res.status(200).json(users);
    } catch (error) {
        console.log("Error fetching users", error);
        res.status(500).json({ message: "Error fetching users" });
    }
};
