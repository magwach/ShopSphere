import redis from "../db/redis.js";
import User from "../models/user.model.js";
import {
  generateToken,
  setCookies,
  storeToken,
} from "../utils/token.handler.js";
import jwt from "jsonwebtoken";

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateToken(user._id);
      await storeToken(user._id, refreshToken);
      setCookies(res, accessToken, refreshToken);
      user.password = undefined;
      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: user,
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function logout(req, res) {
  try {
    const refresh_token = req.cookies.refreshToken;
    if (!refresh_token) {
      return res
        .status(400)
        .json({ success: false, message: "No refresh token found" });
    }

    const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);

    const userId = decoded.id;
    await redis.del(`refresh_token:${userId}`);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function signup(req, res) {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    let user = await User.create({ name, email, password });
    user.password = undefined;
    const { accessToken, refreshToken } = generateToken(user._id);
    await storeToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export async function refreshToken(req, res) {
  try {
    const refresh_token = req.cookies.refreshToken;
    if (!refresh_token) {
      return res
        .status(400)
        .json({ success: false, message: "No refresh token found" });
    }
    const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
    const userId = decoded.id;
    const storedToken = await redis.get(`refresh_token:${userId}`);
    if (!storedToken || storedToken !== refresh_token) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });
    }
    const { accessToken, refreshToken } = generateToken(userId);
    await storeToken(userId, refreshToken);
    setCookies(res, accessToken, refreshToken);
    return res.status(200).json({
      success: true,
      message: "Tokens refreshed successfully",
    });
  } catch (error) {
    console.error("Error in refreshToken:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}