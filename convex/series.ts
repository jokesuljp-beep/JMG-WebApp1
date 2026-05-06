import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("series"),
      _creationTime: v.number(),
      title: v.string(),
      description: v.string(),
      thumbnailUrl: v.optional(v.string()),
      trailerUrl: v.optional(v.string()),
      priceCents: v.number(),
      category: v.string(),
      isPublished: v.boolean(),
      lessonCount: v.number(),
    })
  ),
  handler: async (ctx) => {
    const series = await ctx.db
      .query("series")
      .filter((q) => q.eq(q.field("isPublished"), true))
      .collect();

    const result = [];
    for (const s of series) {
      const lessons = await ctx.db
        .query("lessons")
        .withIndex("by_series", (q) => q.eq("seriesId", s._id))
        .collect();
      result.push({
        ...s,
        lessonCount: lessons.length,
      });
    }
    return result;
  },
});

export const getById = query({
  args: { id: v.id("series") },
  returns: v.union(
    v.object({
      _id: v.id("series"),
      _creationTime: v.number(),
      title: v.string(),
      description: v.string(),
      thumbnailUrl: v.optional(v.string()),
      trailerUrl: v.optional(v.string()),
      priceCents: v.number(),
      category: v.string(),
      isPublished: v.boolean(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getLessons = query({
  args: { seriesId: v.id("series") },
  returns: v.array(
    v.object({
      _id: v.id("lessons"),
      _creationTime: v.number(),
      seriesId: v.id("series"),
      title: v.string(),
      description: v.optional(v.string()),
      videoUrl: v.string(),
      thumbnailUrl: v.optional(v.string()),
      position: v.number(),
      durationSeconds: v.optional(v.number()),
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lessons")
      .withIndex("by_series", (q) => q.eq("seriesId", args.seriesId))
      .order("asc")
      .collect();
  },
});

export const seed = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const existing = await ctx.db.query("series").collect();
    for (const s of existing) {
      await ctx.db.delete(s._id);
    }
    const existingLessons = await ctx.db.query("lessons").collect();
    for (const l of existingLessons) {
      await ctx.db.delete(l._id);
    }

    const seriesData = [
      {
        title: "The Ultimate Drive",
        description: "Master your driver with pro mechanics and distance tips.",
        thumbnailUrl: "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?auto=format&fit=crop&q=80",
        priceCents: 9900,
        category: "Driving",
        isPublished: true,
      },
      {
        title: "Short Game Secrets",
        description: "Shave strokes off your game with better chipping and putting.",
        thumbnailUrl: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80",
        priceCents: 7900,
        category: "Chipping",
        isPublished: true,
      },
      {
        title: "Course Management 101",
        description: "Think like a pro on the course and lower your scores.",
        thumbnailUrl: "https://images.unsplash.com/photo-1623514030095-20076269f88c?auto=format&fit=crop&q=80",
        priceCents: 4900,
        category: "Strategy",
        isPublished: true,
      },
      {
        title: "Mental Performance",
        description: "Stay calm under pressure and conquer the mental game.",
        thumbnailUrl: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80",
        priceCents: 3900,
        category: "Mindset",
        isPublished: true,
      },
    ];

    for (const data of seriesData) {
      const seriesId = await ctx.db.insert("series", data);
      
      // Add a couple of dummy lessons for each series
      await ctx.db.insert("lessons", {
        seriesId,
        title: "Introduction & Fundamentals",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        position: 1,
        durationSeconds: 180,
      });
      await ctx.db.insert("lessons", {
        seriesId,
        title: "Advanced Techniques",
        videoUrl: "https://www.w3schools.com/html/movie.mp4",
        position: 2,
        durationSeconds: 320,
      });
    }
    return null;
  },
});
