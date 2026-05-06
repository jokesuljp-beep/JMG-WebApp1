import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const get = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id("profiles"),
      _creationTime: v.number(),
      userId: v.id("users"),
      fullName: v.optional(v.string()),
      avatarUrl: v.optional(v.string()),
      isAdmin: v.boolean(),
      handicap: v.optional(v.number()),
      goals: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;
    return await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
  },
});

export const upsert = mutation({
  args: {
    fullName: v.optional(v.string()),
    handicap: v.optional(v.number()),
    goals: v.optional(v.string()),
  },
  returns: v.id("profiles"),
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("profiles", {
        userId,
        fullName: args.fullName,
        handicap: args.handicap,
        goals: args.goals,
        isAdmin: false,
      });
    }
  },
});
