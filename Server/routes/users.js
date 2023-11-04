import express from "express";
import {
    getUsers,
    getUserFriends,
    addRemoveFriend,
} from "../controller/users.js";
import { verifyToken } from "../middleware/auth.js";