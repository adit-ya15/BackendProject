import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const DB_NAME = "videotube";

const seedDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("✅ Connected to MongoDB");

        const db = mongoose.connection.db;

        // Clean existing data
        const collections = ["users", "videos", "comments", "likes", "tweets", "playlists", "subscriptions"];
        for (const col of collections) {
            try { await db.collection(col).drop(); } catch { /* ignore if doesn't exist */ }
        }
        console.log("🗑️  Cleared old data");

        // ─── USERS ───
        const hashedPassword = await bcrypt.hash("password123", 10);
        const usersData = [
            {
                username: "alexcreates",
                email: "alex@example.com",
                fullName: "Alex Johnson",
                avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Alex",
                coverImage: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=1200&h=400&fit=crop",
                password: hashedPassword,
                watchHistory: [],
            },
            {
                username: "sarahdev",
                email: "sarah@example.com",
                fullName: "Sarah Chen",
                avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah",
                coverImage: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=400&fit=crop",
                password: hashedPassword,
                watchHistory: [],
            },
            {
                username: "miketech",
                email: "mike@example.com",
                fullName: "Mike Rivera",
                avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Mike",
                coverImage: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=400&fit=crop",
                password: hashedPassword,
                watchHistory: [],
            },
            {
                username: "priyacode",
                email: "priya@example.com",
                fullName: "Priya Sharma",
                avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Priya",
                coverImage: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1200&h=400&fit=crop",
                password: hashedPassword,
                watchHistory: [],
            },
        ];

        const users = await db.collection("users").insertMany(
            usersData.map((u) => ({ ...u, createdAt: new Date(), updatedAt: new Date() }))
        );
        const userIds = Object.values(users.insertedIds);
        console.log(`👤 Created ${userIds.length} users`);

        // ─── VIDEOS ───
        const videosData = [
            {
                videoFile: "https://www.w3schools.com/html/mov_bbb.mp4",
                thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=640&h=360&fit=crop",
                title: "React 19 — What's New and Why It Matters",
                description: "Deep dive into React 19's new features including Server Components, Actions, and the new use() hook. Learn how these changes will transform your development workflow.",
                duration: 845,
                views: 14250,
                isPublished: true,
                owner: userIds[0],
            },
            {
                videoFile: "https://www.w3schools.com/html/mov_bbb.mp4",
                thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&h=360&fit=crop",
                title: "Build a Full-Stack App in 30 Minutes",
                description: "Speed-coding challenge! We build a complete MERN stack application from scratch in just 30 minutes. Follow along and ship your next project faster.",
                duration: 1820,
                views: 32100,
                isPublished: true,
                owner: userIds[1],
            },
            {
                videoFile: "https://www.w3schools.com/html/mov_bbb.mp4",
                thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=640&h=360&fit=crop",
                title: "The Art of Clean Code — 10 Principles",
                description: "Writing clean, maintainable code is a skill every developer needs. Here are 10 battle-tested principles I use in every project.",
                duration: 1240,
                views: 8900,
                isPublished: true,
                owner: userIds[2],
            },
            {
                videoFile: "https://www.w3schools.com/html/mov_bbb.mp4",
                thumbnail: "https://images.unsplash.com/photo-1550439062-609e1531270e?w=640&h=360&fit=crop",
                title: "MongoDB Aggregation Pipeline — Advanced Guide",
                description: "Master MongoDB aggregation pipelines with real-world examples. From $lookup to $facet, we cover everything you need to build powerful queries.",
                duration: 2100,
                views: 5670,
                isPublished: true,
                owner: userIds[0],
            },
            {
                videoFile: "https://www.w3schools.com/html/mov_bbb.mp4",
                thumbnail: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=640&h=360&fit=crop",
                title: "CSS Animations That Will Blow Your Mind",
                description: "Learn to create stunning CSS animations with keyframes, transitions, and modern techniques. No JavaScript needed for these smooth effects!",
                duration: 920,
                views: 19500,
                isPublished: true,
                owner: userIds[3],
            },
            {
                videoFile: "https://www.w3schools.com/html/mov_bbb.mp4",
                thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=640&h=360&fit=crop",
                title: "System Design Interview — Ultimate Prep Guide",
                description: "Everything you need to ace your next system design interview. Covers distributed systems, databases, caching, load balancing, and more.",
                duration: 3600,
                views: 42300,
                isPublished: true,
                owner: userIds[1],
            },
            {
                videoFile: "https://www.w3schools.com/html/mov_bbb.mp4",
                thumbnail: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=640&h=360&fit=crop",
                title: "Node.js Performance Optimization Tips",
                description: "Your Node.js app feeling slow? Here are 12 proven techniques to squeeze every bit of performance out of your server code.",
                duration: 1560,
                views: 11200,
                isPublished: true,
                owner: userIds[2],
            },
            {
                videoFile: "https://www.w3schools.com/html/mov_bbb.mp4",
                thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=640&h=360&fit=crop",
                title: "Git Workflow Every Team Should Use",
                description: "Stop merge conflicts and chaotic repos. Learn the branching strategy and Git workflow that keeps teams productive and code clean.",
                duration: 780,
                views: 7800,
                isPublished: true,
                owner: userIds[3],
            },
            {
                videoFile: "https://www.w3schools.com/html/mov_bbb.mp4",
                thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=640&h=360&fit=crop",
                title: "TypeScript Generics Explained Simply",
                description: "Generics don't have to be confusing. I break down TypeScript generics with simple examples that finally make them click.",
                duration: 1100,
                views: 15600,
                isPublished: true,
                owner: userIds[0],
            },
            {
                videoFile: "https://www.w3schools.com/html/mov_bbb.mp4",
                thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=640&h=360&fit=crop",
                title: "Docker & Kubernetes for Beginners",
                description: "Containerize your apps like a pro. This beginner-friendly guide takes you from zero Docker knowledge to deploying on Kubernetes.",
                duration: 2400,
                views: 28900,
                isPublished: true,
                owner: userIds[1],
            },
        ];

        const videos = await db.collection("videos").insertMany(
            videosData.map((v) => ({ ...v, createdAt: new Date(), updatedAt: new Date() }))
        );
        const videoIds = Object.values(videos.insertedIds);
        console.log(`🎬 Created ${videoIds.length} videos`);

        // ─── COMMENTS ───
        const commentsData = [
            { content: "This is exactly what I needed! Great explanation of Server Components.", video: videoIds[0], owner: userIds[1] },
            { content: "Finally someone explains this properly. Subscribed!", video: videoIds[0], owner: userIds[2] },
            { content: "The speed coding is insane. How do you type that fast?", video: videoIds[1], owner: userIds[0] },
            { content: "I followed along and built my own version. Thanks for the tutorial!", video: videoIds[1], owner: userIds[3] },
            { content: "Principle #7 changed how I think about naming variables.", video: videoIds[2], owner: userIds[0] },
            { content: "Can you do a video on clean architecture patterns?", video: videoIds[2], owner: userIds[1] },
            { content: "The $facet example was mind-blowing. Never knew MongoDB could do that.", video: videoIds[3], owner: userIds[3] },
            { content: "Pure CSS magic! The hover effect at 3:24 is incredible.", video: videoIds[4], owner: userIds[0] },
            { content: "Used these tips in my interview last week and got the offer! 🎉", video: videoIds[5], owner: userIds[2] },
            { content: "This helped me optimize our API response time from 2s to 200ms.", video: videoIds[6], owner: userIds[3] },
            { content: "Our team adopted this workflow and merge conflicts dropped 90%.", video: videoIds[7], owner: userIds[1] },
            { content: "Generics finally make sense. That box analogy was perfect.", video: videoIds[8], owner: userIds[2] },
            { content: "Deployed my first app on k8s thanks to this. Amazing tutorial!", video: videoIds[9], owner: userIds[0] },
        ];

        await db.collection("comments").insertMany(
            commentsData.map((c) => ({ ...c, createdAt: new Date(), updatedAt: new Date() }))
        );
        console.log(`💬 Created ${commentsData.length} comments`);

        // ─── LIKES ───
        const likesData = [];
        for (let i = 0; i < videoIds.length; i++) {
            for (let j = 0; j < userIds.length; j++) {
                if (Math.random() > 0.3) {
                    likesData.push({ video: videoIds[i], likedBy: userIds[j], createdAt: new Date(), updatedAt: new Date() });
                }
            }
        }
        await db.collection("likes").insertMany(likesData);
        console.log(`❤️  Created ${likesData.length} likes`);

        // ─── TWEETS ───
        const tweetsData = [
            { content: "Just shipped a new feature using React Server Components. The DX is incredible! 🚀", owner: userIds[0] },
            { content: "Hot take: TypeScript generics are easier than people think. You just need the right mental model.", owner: userIds[0] },
            { content: "Spent 3 hours debugging a CSS issue. Turns out it was a missing semicolon. Classic. 😭", owner: userIds[1] },
            { content: "New video dropping tomorrow! We're building something cool with WebSockets. Stay tuned! 🎬", owner: userIds[1] },
            { content: "Clean code isn't about writing less code — it's about writing code that communicates intent.", owner: userIds[2] },
            { content: "MongoDB aggregation pipelines are incredibly powerful once you get past the syntax.", owner: userIds[2] },
            { content: "CSS container queries are going to change responsive design forever. Mark my words.", owner: userIds[3] },
            { content: "Just hit 10k subscribers! Thank you all for the support. More content incoming! 🎉", owner: userIds[3] },
        ];

        await db.collection("tweets").insertMany(
            tweetsData.map((t) => ({ ...t, createdAt: new Date(Date.now() - Math.random() * 7 * 86400000), updatedAt: new Date() }))
        );
        console.log(`🐦 Created ${tweetsData.length} tweets`);

        // ─── SUBSCRIPTIONS ───
        const subsData = [
            { subscriber: userIds[1], channel: userIds[0] },
            { subscriber: userIds[2], channel: userIds[0] },
            { subscriber: userIds[3], channel: userIds[0] },
            { subscriber: userIds[0], channel: userIds[1] },
            { subscriber: userIds[2], channel: userIds[1] },
            { subscriber: userIds[3], channel: userIds[1] },
            { subscriber: userIds[0], channel: userIds[2] },
            { subscriber: userIds[1], channel: userIds[2] },
            { subscriber: userIds[0], channel: userIds[3] },
            { subscriber: userIds[1], channel: userIds[3] },
            { subscriber: userIds[2], channel: userIds[3] },
        ];

        await db.collection("subscriptions").insertMany(
            subsData.map((s) => ({ ...s, createdAt: new Date(), updatedAt: new Date() }))
        );
        console.log(`🔔 Created ${subsData.length} subscriptions`);

        // ─── PLAYLISTS ───
        const playlistsData = [
            { name: "Frontend Essentials", description: "Must-watch videos for frontend developers", videos: [videoIds[0], videoIds[4], videoIds[8]], owner: userIds[0] },
            { name: "Backend Deep Dives", description: "Advanced backend concepts and tutorials", videos: [videoIds[3], videoIds[6], videoIds[9]], owner: userIds[1] },
            { name: "Interview Prep", description: "Everything you need to ace your tech interviews", videos: [videoIds[2], videoIds[5]], owner: userIds[2] },
            { name: "DevOps Starter Pack", description: "Get started with Docker, Kubernetes, and CI/CD", videos: [videoIds[7], videoIds[9]], owner: userIds[3] },
        ];

        await db.collection("playlists").insertMany(
            playlistsData.map((p) => ({ ...p, createdAt: new Date(), updatedAt: new Date() }))
        );
        console.log(`📋 Created ${playlistsData.length} playlists`);

        // Update watch history
        await db.collection("users").updateOne({ _id: userIds[0] }, { $set: { watchHistory: [videoIds[1], videoIds[4], videoIds[5]] } });
        await db.collection("users").updateOne({ _id: userIds[1] }, { $set: { watchHistory: [videoIds[0], videoIds[2], videoIds[6]] } });

        console.log("\n🎉 Database seeded successfully!");
        console.log("─────────────────────────────────");
        console.log("Test accounts (all use password: password123):");
        console.log("  📧 alex@example.com    (alexcreates)");
        console.log("  📧 sarah@example.com   (sarahdev)");
        console.log("  📧 mike@example.com    (miketech)");
        console.log("  📧 priya@example.com   (priyacode)");
        console.log("─────────────────────────────────\n");

        process.exit(0);
    } catch (error) {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    }
};

seedDB();
