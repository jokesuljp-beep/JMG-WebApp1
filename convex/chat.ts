import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const getMessages = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("coachMessages"),
      _creationTime: v.number(),
      userId: v.id("users"),
      coachId: v.optional(v.id("users")),
      content: v.string(),
      videoUrl: v.optional(v.string()),
      isFromCoach: v.boolean(),
      parentId: v.optional(v.id("coachMessages")),
    })
  ),
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];
    
    return await ctx.db
      .query("coachMessages")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("asc")
      .collect();
  },
});

export const sendMessage = mutation({
  args: {
    content: v.string(),
    videoUrl: v.optional(v.string()),
  },
  returns: v.id("coachMessages"),
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("coachMessages", {
      userId,
      content: args.content,
      videoUrl: args.videoUrl,
      isFromCoach: false,
    });
  },
});

export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
