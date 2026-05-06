import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  
  // Custom user profiles linked to auth
  profiles: defineTable({
    userId: v.id("users"),
    fullName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    isAdmin: v.boolean(),
    handicap: v.optional(v.number()),
    goals: v.optional(v.string()),
  }).index("by_userId", ["userId"]),

  // Course Library
  series: defineTable({
    title: v.string(),
    description: v.string(),
    thumbnailUrl: v.optional(v.string()),
    trailerUrl: v.optional(v.string()),
    priceCents: v.number(),
    category: v.string(),
    isPublished: v.boolean(),
  }),

  lessons: defineTable({
    seriesId: v.id("series"),
    title: v.string(),
    description: v.optional(v.string()),
    videoUrl: v.string(),
    thumbnailUrl: v.optional(v.string()),
    position: v.number(),
    durationSeconds: v.optional(v.number()),
  }).index("by_series", ["seriesId"]),

  // Access Control
  subscriptions: defineTable({
    userId: v.id("users"),
    stripeSubscriptionId: v.optional(v.string()),
    status: v.string(), // active, trialing, past_due, canceled
    priceId: v.optional(v.string()),
    currentPeriodEnd: v.optional(v.number()),
  }).index("by_userId", ["userId"]),

  purchases: defineTable({
    userId: v.id("users"),
    seriesId: v.id("series"),
    stripeCheckoutId: v.optional(v.string()),
    amountPaidCents: v.number(),
  }).index("by_userId_and_series", ["userId", "seriesId"]),

  // Coaching Communication
  coachMessages: defineTable({
    userId: v.id("users"),
    coachId: v.optional(v.id("users")),
    content: v.string(),
    videoUrl: v.optional(v.string()),
    isFromCoach: v.boolean(),
    parentId: v.optional(v.id("coachMessages")),
  }).index("by_userId", ["userId"]),
});
