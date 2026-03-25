import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const channelStats = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes",
            },
        },
        {
            $project: {
                totalLikes: { $size: "$likes" },
                totalViews: "$views",
            },
        },
        {
            $group: {
                _id: null,
                totalLikes: { $sum: "$totalLikes" },
                totalViews: { $sum: "$totalViews" },
                totalVideos: { $sum: 1 },
            },
        },
    ]);

    const totalSubscribers = await Subscription.countDocuments({
        channel: userId,
    });

    const stats = {
        totalSubscribers,
        totalLikes: channelStats[0]?.totalLikes || 0,
        totalViews: channelStats[0]?.totalViews || 0,
        totalVideos: channelStats[0]?.totalVideos || 0,
    };

    return res
        .status(200)
        .json(
            new ApiResponse(200, stats, "Channel stats fetched successfully")
        );
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const videos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes",
            },
        },
        {
            $addFields: {
                likesCount: { $size: "$likes" },
            },
        },
        {
            $sort: { createdAt: -1 },
        },
        {
            $project: {
                videoFile: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                createdAt: 1,
                duration: 1,
                views: 1,
                isPublished: 1,
                likesCount: 1,
            },
        },
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(200, videos, "Channel videos fetched successfully")
        );
});

export { getChannelStats, getChannelVideos };
