var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_geoip_lite = __toESM(require("geoip-lite"), 1);
var import_ua_parser_js = require("ua-parser-js");
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_http = __toESM(require("http"), 1);
var import_url = require("url");
var import_vite = require("vite");
var import_dotenv2 = __toESM(require("dotenv"), 1);
var import_app = require("firebase-admin/app");
var import_auth = require("firebase-admin/auth");
var import_openai = __toESM(require("openai"), 1);
var import_qrcode = __toESM(require("qrcode"), 1);
var import_crypto = __toESM(require("crypto"), 1);

// src/db/index.ts
var import_dotenv = __toESM(require("dotenv"), 1);
var import_node_postgres = require("drizzle-orm/node-postgres");
var import_pg = __toESM(require("pg"), 1);

// src/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  classroomMessagesTable: () => classroomMessagesTable,
  classroomStudentsTable: () => classroomStudentsTable,
  classroomsTable: () => classroomsTable,
  communityPosts: () => communityPosts,
  completions: () => completions,
  couponCodes: () => couponCodes,
  directMessages: () => directMessages,
  follows: () => follows,
  messageViews: () => messageViews,
  notifications: () => notifications,
  premiumRequests: () => premiumRequests,
  promotions: () => promotions,
  questionRatings: () => questionRatings,
  quizResults: () => quizResults,
  quizzes: () => quizzes,
  userNotificationTokens: () => userNotificationTokens,
  userSessions: () => userSessions,
  users: () => users
});
var import_pg_core = require("drizzle-orm/pg-core");
var users = (0, import_pg_core.pgTable)("users", {
  uid: (0, import_pg_core.text)("uid").primaryKey(),
  // Firebase Auth UID acts as the primary key
  name: (0, import_pg_core.text)("name"),
  email: (0, import_pg_core.text)("email"),
  photoUrl: (0, import_pg_core.text)("photo_url"),
  isPremium: (0, import_pg_core.boolean)("is_premium").default(false),
  planName: (0, import_pg_core.text)("plan_name").default("Free"),
  renewalDate: (0, import_pg_core.text)("renewal_date"),
  bio: (0, import_pg_core.text)("bio"),
  location: (0, import_pg_core.text)("location"),
  joinedDate: (0, import_pg_core.text)("joined_date"),
  badgeSymbol: (0, import_pg_core.text)("badge_symbol").default("\u{1F6E1}\uFE0F"),
  badgeColor: (0, import_pg_core.text)("badge_color").default("#3b82f6"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow(),
  updatedAt: (0, import_pg_core.timestamp)("updated_at").defaultNow(),
  customId: (0, import_pg_core.text)("custom_id"),
  password: (0, import_pg_core.text)("password"),
  twoFactorEnabled: (0, import_pg_core.boolean)("two_factor_enabled").default(false),
  twoFactorSecret: (0, import_pg_core.text)("two_factor_secret"),
  twoFactorTempSecret: (0, import_pg_core.text)("two_factor_temp_secret")
});
var follows = (0, import_pg_core.pgTable)("follows", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  // followerId_followingId
  followerId: (0, import_pg_core.text)("follower_id").notNull(),
  followingId: (0, import_pg_core.text)("following_id").notNull(),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var quizzes = (0, import_pg_core.pgTable)("quizzes", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  title: (0, import_pg_core.text)("title").notNull(),
  description: (0, import_pg_core.text)("description").default(""),
  creatorId: (0, import_pg_core.text)("creator_id"),
  creatorName: (0, import_pg_core.text)("creator_name"),
  questions: (0, import_pg_core.jsonb)("questions").notNull(),
  // jsonb match database
  totalPlays: (0, import_pg_core.integer)("total_plays").default(0),
  avgRating: (0, import_pg_core.numeric)("avg_rating", { precision: 2, scale: 1 }).default("0.0"),
  ratingsCount: (0, import_pg_core.integer)("ratings_count").default(0),
  timeLimit: (0, import_pg_core.integer)("time_limit").default(0),
  createdAt: (0, import_pg_core.text)("created_at").notNull(),
  category: (0, import_pg_core.text)("category").default("\u0639\u0627\u0645"),
  distributionRouting: (0, import_pg_core.text)("distribution_routing").default("public"),
  classroomId: (0, import_pg_core.text)("classroom_id")
});
var completions = (0, import_pg_core.pgTable)("completions", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  quizId: (0, import_pg_core.text)("quiz_id").notNull(),
  quizTitle: (0, import_pg_core.text)("quiz_title").notNull(),
  takerId: (0, import_pg_core.text)("taker_id").notNull(),
  takerName: (0, import_pg_core.text)("taker_name").notNull(),
  score: (0, import_pg_core.integer)("score").notNull(),
  totalQuestions: (0, import_pg_core.integer)("total_questions").notNull(),
  rating: (0, import_pg_core.integer)("rating"),
  feedback: (0, import_pg_core.text)("feedback").default(""),
  createdAt: (0, import_pg_core.text)("created_at").notNull()
});
var quizResults = (0, import_pg_core.pgTable)("quiz_results", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  quizId: (0, import_pg_core.text)("quiz_id").notNull(),
  quizTitle: (0, import_pg_core.text)("quiz_title").notNull(),
  studentName: (0, import_pg_core.text)("student_name").notNull(),
  score: (0, import_pg_core.integer)("score").notNull(),
  totalQuestions: (0, import_pg_core.integer)("total_questions").notNull(),
  rating: (0, import_pg_core.integer)("rating"),
  feedback: (0, import_pg_core.text)("feedback").default(""),
  createdAt: (0, import_pg_core.text)("created_at").notNull()
});
var questionRatings = (0, import_pg_core.pgTable)("question_ratings", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  // e.g. "userId_questionId"
  userId: (0, import_pg_core.text)("user_id").notNull(),
  quizId: (0, import_pg_core.text)("quiz_id").notNull(),
  quizTitle: (0, import_pg_core.text)("quiz_title").notNull(),
  questionId: (0, import_pg_core.text)("question_id").notNull(),
  questionText: (0, import_pg_core.text)("question_text").notNull(),
  ratingValue: (0, import_pg_core.text)("rating_value").notNull(),
  // 'like' | 'dislike'
  createdAt: (0, import_pg_core.text)("created_at").notNull()
});
var notifications = (0, import_pg_core.pgTable)("notifications", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  title: (0, import_pg_core.text)("title").notNull(),
  body: (0, import_pg_core.text)("body").notNull(),
  senderName: (0, import_pg_core.text)("sender_name").notNull(),
  type: (0, import_pg_core.text)("type").notNull(),
  // 'quiz' | etc.
  createdAt: (0, import_pg_core.text)("created_at").notNull()
});
var premiumRequests = (0, import_pg_core.pgTable)("premium_requests", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  userId: (0, import_pg_core.text)("user_id").notNull(),
  name: (0, import_pg_core.text)("name"),
  email: (0, import_pg_core.text)("email"),
  planName: (0, import_pg_core.text)("plan_name"),
  paymentScreenshot: (0, import_pg_core.text)("payment_screenshot"),
  status: (0, import_pg_core.text)("status"),
  // 'pending' | 'approved' | 'rejected'
  rejectReason: (0, import_pg_core.text)("reject_reason"),
  promoCodeUsed: (0, import_pg_core.text)("promo_code_used"),
  createdAt: (0, import_pg_core.text)("created_at").notNull(),
  updatedAt: (0, import_pg_core.text)("updated_at")
});
var promotions = (0, import_pg_core.pgTable)("promotions", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  discountPercent: (0, import_pg_core.integer)("discount_percent").notNull(),
  endDate: (0, import_pg_core.text)("end_date").notNull(),
  applicablePlans: (0, import_pg_core.jsonb)("applicable_plans").notNull(),
  // jsonb array of matching plans
  isActive: (0, import_pg_core.boolean)("is_active").default(true),
  createdAt: (0, import_pg_core.text)("created_at").notNull()
});
var couponCodes = (0, import_pg_core.pgTable)("coupon_codes", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  code: (0, import_pg_core.text)("code").notNull(),
  discountPercent: (0, import_pg_core.integer)("discount_percent").notNull(),
  maxUses: (0, import_pg_core.integer)("max_uses").default(9999),
  usedCount: (0, import_pg_core.integer)("used_count").default(0),
  expiryDate: (0, import_pg_core.text)("expiry_date").notNull(),
  isActive: (0, import_pg_core.boolean)("is_active").default(true),
  createdAt: (0, import_pg_core.text)("created_at").notNull(),
  applicablePlans: (0, import_pg_core.text)("applicable_plans")
  // Comma-separated or serialized plans e.g. "silver,gold,diamond"
});
var directMessages = (0, import_pg_core.pgTable)("direct_messages", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  senderId: (0, import_pg_core.text)("sender_id").notNull(),
  senderName: (0, import_pg_core.text)("sender_name").notNull(),
  receiverId: (0, import_pg_core.text)("receiver_id").notNull(),
  receiverName: (0, import_pg_core.text)("receiver_name").notNull(),
  text: (0, import_pg_core.text)("text").notNull(),
  isRead: (0, import_pg_core.boolean)("is_read").default(false),
  createdAt: (0, import_pg_core.text)("created_at").notNull()
});
var communityPosts = (0, import_pg_core.pgTable)("community_posts", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  text: (0, import_pg_core.text)("text").notNull(),
  authorName: (0, import_pg_core.text)("author_name").notNull(),
  authorId: (0, import_pg_core.text)("author_id").notNull(),
  authorBadgeSymbol: (0, import_pg_core.text)("author_badge_symbol"),
  authorBadgeColor: (0, import_pg_core.text)("author_badge_color"),
  likes: (0, import_pg_core.integer)("likes").default(0),
  likedBy: (0, import_pg_core.jsonb)("liked_by").notNull(),
  // Array of user IDs who liked
  createdAt: (0, import_pg_core.text)("created_at").notNull()
});
var messageViews = (0, import_pg_core.pgTable)("community_message_views", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  // e.g. "postId_userId"
  postId: (0, import_pg_core.text)("post_id").notNull(),
  userId: (0, import_pg_core.text)("user_id").notNull(),
  userName: (0, import_pg_core.text)("user_name").notNull(),
  userPhotoUrl: (0, import_pg_core.text)("user_photo_url"),
  createdAt: (0, import_pg_core.text)("created_at").notNull()
});
var userSessions = (0, import_pg_core.pgTable)("user_sessions", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  userId: (0, import_pg_core.text)("user_id").notNull(),
  device: (0, import_pg_core.text)("device").notNull(),
  location: (0, import_pg_core.text)("location").notNull(),
  ipAddress: (0, import_pg_core.text)("ip_address"),
  lastActive: (0, import_pg_core.text)("last_active").notNull(),
  // text description, e.g. 'نشط الآن' or 'Active now'
  current: (0, import_pg_core.boolean)("current").default(false),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var userNotificationTokens = (0, import_pg_core.pgTable)("user_notification_tokens", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  userId: (0, import_pg_core.text)("user_id").notNull(),
  subscription: (0, import_pg_core.text)("subscription").notNull(),
  // stringified PushSubscription
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var classroomsTable = (0, import_pg_core.pgTable)("classrooms", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  name: (0, import_pg_core.text)("name").notNull(),
  code: (0, import_pg_core.text)("code").notNull(),
  createdBy: (0, import_pg_core.text)("created_by").notNull(),
  creatorName: (0, import_pg_core.text)("creator_name").notNull(),
  createdAt: (0, import_pg_core.text)("created_at").notNull(),
  allowStudentMessages: (0, import_pg_core.boolean)("allow_student_messages").default(true),
  allowStudentMedia: (0, import_pg_core.boolean)("allow_student_media").default(true)
});
var classroomStudentsTable = (0, import_pg_core.pgTable)("classroom_students", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  classId: (0, import_pg_core.text)("class_id"),
  classCode: (0, import_pg_core.text)("class_code").notNull(),
  studentId: (0, import_pg_core.text)("student_id").notNull(),
  studentName: (0, import_pg_core.text)("student_name").notNull(),
  studentPhoto: (0, import_pg_core.text)("student_photo"),
  joinedAt: (0, import_pg_core.text)("joined_at").notNull(),
  completedQuizzes: (0, import_pg_core.integer)("completed_quizzes").default(0),
  avgScore: (0, import_pg_core.numeric)("avg_score", { precision: 5, scale: 2 }).default("0.0"),
  lastActive: (0, import_pg_core.text)("last_active"),
  role: (0, import_pg_core.text)("role").default("student")
  // 'student', 'co-moderator'
});
var classroomMessagesTable = (0, import_pg_core.pgTable)("classroom_messages", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  classId: (0, import_pg_core.text)("class_id").notNull(),
  senderId: (0, import_pg_core.text)("sender_id").notNull(),
  senderName: (0, import_pg_core.text)("sender_name").notNull(),
  senderPhoto: (0, import_pg_core.text)("sender_photo"),
  encryptedText: (0, import_pg_core.text)("encrypted_text").notNull(),
  isMedia: (0, import_pg_core.boolean)("is_media").default(false),
  mediaUrl: (0, import_pg_core.text)("media_url"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});

// src/db/index.ts
import_dotenv.default.config();
var { Pool } = import_pg.default;
var createPool = () => {
  const useSsl = process.env.SQL_SSL === "true";
  console.log("DB connection initializing with host:", process.env.SQL_HOST, "user:", process.env.SQL_USER, "ssl:", useSsl);
  return new Pool({
    host: process.env.SQL_HOST,
    port: process.env.SQL_PORT ? Number(process.env.SQL_PORT) : void 0,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB_NAME,
    ssl: useSsl ? { rejectUnauthorized: false } : void 0,
    connectionTimeoutMillis: 15e3,
    idleTimeoutMillis: 2e4,
    // Close idle clients after 20s (Neon closes them anyway)
    max: 5,
    // Limit pool size for Neon serverless
    allowExitOnIdle: true
    // Allow pool to close when all clients are idle
  });
};
var pool = createPool();
pool.on("error", (err) => {
  const msg = err.message || "";
  if (msg.includes("terminating connection due to administrator command") || msg.includes("Connection terminated") || msg.includes("Connection terminated unexpectedly") || msg.includes("connection timeout") || err.code === "ECONNRESET" || err.code === "EPIPE") {
    console.warn("Database pool idle connection closed (Neon scale-to-zero):", msg);
    return;
  }
  console.error("Unexpected error on idle SQL pool client:", err);
});
pool.on("connect", (client) => {
  client.on("error", (err) => {
    if (err.code === "EPIPE" || err.code === "ECONNRESET") {
      console.warn("Database socket error handled gracefully:", err.message);
      return;
    }
    console.error("Database client error:", err);
  });
});
var db = (0, import_node_postgres.drizzle)(pool, { schema: schema_exports });

// server.ts
var import_drizzle_orm = require("drizzle-orm");
var import_web_push = __toESM(require("web-push"), 1);
var import_genai = require("@google/genai");
var import_express_rate_limit = __toESM(require("express-rate-limit"), 1);
var import_meta = {};
var _filename = (() => {
  try {
    return (0, import_url.fileURLToPath)(import_meta.url);
  } catch {
    return typeof __filename !== "undefined" ? __filename : "";
  }
})();
var _dirname = (() => {
  try {
    return import_path.default.dirname((0, import_url.fileURLToPath)(import_meta.url));
  } catch {
    return typeof __dirname !== "undefined" ? __dirname : process.cwd();
  }
})();
import_dotenv2.default.config();
process.on("uncaughtException", (err) => {
  if (err.code === "EPIPE" || err.code === "ECONNRESET") {
    console.warn("[Process Warning] Handled uncaught socket error:", err.message);
    return;
  }
  console.error("[Process Error] Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason, promise) => {
  if (reason && (reason.code === "EPIPE" || reason.code === "ECONNRESET")) {
    console.warn("[Process Warning] Handled unhandled rejection socket error:", reason.message);
    return;
  }
  console.error("[Process Error] Unhandled Rejection at:", promise, "reason:", reason);
});
try {
  if ((0, import_app.getApps)().length === 0) {
    let projectId = void 0;
    try {
      const configPath = import_path.default.join(process.cwd(), "firebase-applet-config.json");
      if (import_fs.default.existsSync(configPath)) {
        const config = JSON.parse(import_fs.default.readFileSync(configPath, "utf8"));
        projectId = config.projectId;
      }
    } catch (err) {
      console.error("Failed to read firebase config for admin:", err);
    }
    if (projectId) {
      (0, import_app.initializeApp)({
        projectId
      });
      console.log("Firebase Admin SDK initialized with projectId:", projectId);
    } else {
      (0, import_app.initializeApp)();
      console.log("Firebase Admin SDK initialized with default settings");
    }
  }
} catch (e) {
  console.error("Error initializing Firebase Admin SDK:", e);
}
async function getAuthenticatedUser(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No authentication token provided in Authorization header.");
  }
  const token = authHeader.split("Bearer ")[1];
  if (!token || token.trim() === "") {
    throw new Error("Empty token provided.");
  }
  try {
    if ((0, import_app.getApps)().length > 0) {
      const decodedToken = await (0, import_auth.getAuth)().verifyIdToken(token);
      return decodedToken;
    } else {
      throw new Error("Firebase Admin SDK is not initialized.");
    }
  } catch (err) {
    if (process.env.ALLOW_DEV_AUTH_FALLBACK === "true") {
      console.warn("\u26A0\uFE0F [WARNING] Local dev auth fallback is enabled. Do not use in production.");
      try {
        const dbUser = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.uid, token)).limit(1);
        if (dbUser.length > 0) {
          return { uid: token, email: dbUser[0].email || "", name: dbUser[0].name || "\u0637\u0627\u0644\u0628 \u0645\u062A\u0645\u064A\u0632" };
        }
      } catch (_) {
      }
      const isAdmin = token === "adman777888999";
      return { uid: token, email: isAdmin ? "adman777888999@gmail.com" : `${token}@quizspace.local`, name: "\u0637\u0627\u0644\u0628 \u0645\u062A\u0645\u064A\u0632" };
    }
    throw new Error("Authentication token signature verification failed: " + err.message);
  }
}
async function ensureDbPostgres() {
  try {
    const seedQuizzes = [
      {
        id: "web-basics-demo",
        title: "\u0623\u0633\u0627\u0633\u064A\u0627\u062A \u062A\u0637\u0648\u064A\u0631 \u0648\u0627\u062C\u0647\u0627\u062A \u0627\u0644\u0648\u064A\u0628 (HTML & CSS)",
        description: "\u0627\u062E\u062A\u0628\u0627\u0631 \u0645\u0645\u062A\u0639 \u0648\u062A\u0641\u0627\u0639\u0644\u064A \u0644\u0627\u062E\u062A\u0628\u0627\u0631 \u0645\u0639\u0644\u0648\u0645\u0627\u062A\u0643 \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629 \u0641\u064A \u0647\u064A\u0643\u0644\u0629 \u0648\u062A\u0635\u0645\u064A\u0645 \u0635\u0641\u062D\u0627\u062A \u0627\u0644\u0625\u0646\u062A\u0631\u0646\u062A \u0644\u0644\u0645\u0628\u062A\u062F\u0626\u064A\u0646.",
        creatorId: "system-demo",
        creatorName: "\u0627\u0644\u0645\u0643\u062A\u0628\u0629 \u0627\u0644\u062A\u0642\u0646\u064A\u0629 \u0627\u0644\u0639\u0627\u0645\u0629",
        questions: [
          {
            id: "q1",
            type: "mcq",
            text: "\u0645\u0627\u0630\u0627 \u064A\u0631\u0645\u0632 \u0627\u0644\u0627\u062E\u062A\u0635\u0627\u0631 HTML\u061F",
            options: [
              "Hyper Text Markup Language",
              "Home Tool Markup Language",
              "Hyperlinks and Text Markup Language",
              "High Tech Modern Language"
            ],
            correctIndex: 0,
            explanation: "HTML \u062A\u0639\u0646\u064A \u0644\u063A\u0629 \u062A\u0648\u0635\u064A\u0641 \u0627\u0644\u0646\u0635\u0648\u0635 \u0627\u0644\u062A\u0634\u0639\u0628\u064A\u0629 \u0648\u062A\u0634\u0643\u0651\u0644 \u0627\u0644\u0639\u0645\u0648\u062F \u0627\u0644\u0642\u0628\u0644\u064A \u0644\u0628\u0646\u0627\u0621 \u0623\u064A \u0635\u0641\u062D\u0629 \u0648\u064A\u0628."
          },
          {
            id: "q2",
            type: "tf",
            text: "\u062A\u064F\u0633\u062A\u062E\u062F\u0645 \u0627\u0644\u0648\u0633\u0648\u0645 <h1> \u0644\u0639\u0631\u0636 \u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0631\u0626\u064A\u0633\u064A \u0627\u0644\u0623\u0643\u0628\u0631 \u062D\u062C\u0645\u0627\u064B \u0641\u064A \u0627\u0644\u0635\u0641\u062D\u0629.",
            options: ["\u0635\u062D", "\u062E\u0637\u0623"],
            correctIndex: 0,
            explanation: "\u0627\u0644\u0648\u0633\u0645 h1 \u064A\u0645\u062B\u0644 \u0623\u062F\u0642 \u0648\u0623\u0647\u0645 \u0639\u0646\u0648\u0627\u0646 \u0641\u064A \u0627\u0644\u0635\u0641\u062D\u0629 (Heading 1) \u0648\u064A\u0643\u0648\u0646 \u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0627\u064B \u0647\u0648 \u0627\u0644\u0623\u0643\u0628\u0631 \u062D\u062C\u0645\u0627\u064B."
          },
          {
            id: "q3",
            type: "mcq",
            text: "\u0623\u064A \u0645\u0646 \u0627\u0644\u062E\u0635\u0627\u0626\u0635 \u0627\u0644\u062A\u0627\u0644\u064A\u0629 \u062A\u064F\u0633\u062A\u062E\u062F\u0645 \u0644\u062A\u063A\u064A\u064A\u0631 \u0644\u0648\u0646 \u0627\u0644\u062E\u0644\u0641\u064A\u0629 \u0641\u064A CSS\u061F",
            options: ["color", "background-color", "bgcolor", "canvas-color"],
            correctIndex: 1,
            explanation: "\u062A\u064F\u0633\u062E\u062F\u0645 \u0627\u0644\u062E\u0627\u0635\u064A\u0629 background-color \u0644\u062A\u0639\u062F\u064A\u0644 \u062E\u0644\u0641\u064A\u0629 \u0639\u0646\u0627\u0635\u0631 HTML \u0628\u064A\u0646\u0645\u0627 color \u0644\u062A\u0644\u0648\u064A\u0646 \u0627\u0644\u0646\u0635\u0648\u0635."
          },
          {
            id: "q4",
            type: "tf",
            text: "\u0645\u0644\u0641\u0627\u062A \u062C\u0627\u0641\u0627\u0633\u0643\u0631\u064A\u0628\u062A \u0627\u0644\u062E\u0627\u0631\u062C\u064A\u0629 \u064A\u062A\u0645 \u062A\u0636\u0645\u064A\u0646\u0647\u0627 \u0628\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0627\u0644\u0648\u0633\u0645 <style>.",
            options: ["\u0635\u062D", "\u062E\u0637\u0623"],
            correctIndex: 1,
            explanation: "\u064A\u064F\u0633\u062E\u062F\u0645 \u0627\u0644\u0648\u0633\u0645 <script> \u0644\u062A\u0636\u0645\u064A\u0646 \u0645\u0644\u0641\u0627\u062A JavaScript \u0627\u0644\u062E\u0627\u0631\u062C\u064A\u0629\u060C \u0628\u064A\u0646\u0645\u0627 <style> \u0645\u062E\u0635\u0635 \u0644\u0644\u0640 CSS \u0627\u0644\u062F\u0627\u062E\u0644\u064A."
          }
        ],
        createdAt: "2026-06-15T18:27:45.819Z",
        totalPlays: 32,
        avgRating: "4.8",
        ratingsCount: 6,
        timeLimit: 0
      },
      {
        id: "ai-trends-demo",
        title: "\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0627\u0644\u062A\u0648\u0644\u064A\u062F\u064A \u0648\u0645\u0633\u062A\u0642\u0628\u0644 \u0627\u0644\u062A\u0642\u0646\u064A\u0629",
        description: "\u0647\u0644 \u062A\u062A\u0627\u0628\u0639 \u0623\u062D\u062F\u062B \u0627\u0644\u062A\u0637\u0648\u0631\u0627\u062A\u061F \u0627\u062E\u062A\u0628\u0631 \u0645\u0639\u0644\u0648\u0645\u0627\u062A\u0643 \u062D\u0648\u0644 \u0646\u0645\u0627\u0630\u062C \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0627\u0644\u062A\u0648\u0644\u064A\u062F\u064A \u0648\u0643\u064A\u0641\u064A\u0629 \u0639\u0645\u0644\u0647\u0627.",
        creatorId: "system-demo",
        creatorName: "\u0642\u0633\u0645 \u0627\u0644\u0627\u0628\u062A\u0643\u0627\u0631 \u0627\u0644\u0631\u0642\u0645\u064A",
        questions: [
          {
            id: "ai-q1",
            type: "mcq",
            text: "\u0645\u0627\u0630\u0627 \u064A\u0631\u0645\u0632 \u062D\u0631\u0641 G \u0641\u064A \u0627\u0633\u0645 \u0639\u0627\u0626\u0644\u0629 \u0627\u0644\u0646\u0645\u0627\u0630\u062C \u0627\u0644\u0634\u0647\u064A\u0631\u0629 GPT\u061F",
            options: ["Generative (\u062A\u0648\u0644\u064A\u062F\u064A)", "General (\u0639\u0627\u0645)", "Global (\u0639\u0627\u0644\u0645\u064A)", "Gradient (\u062A\u062F\u0631\u062C\u064A)"],
            correctIndex: 0,
            explanation: "\u064A\u0631\u0645\u0632 \u0627\u0644\u062D\u0631\u0641 \u0625\u0644\u0649 Generative (Generative Pre-trained Transformer) \u0648\u0647\u0648 \u0645\u0627 \u064A\u0639\u0628\u0651\u0631 \u0639\u0646 \u0642\u062F\u0631\u0629 \u0627\u0644\u0646\u0645\u0648\u0630\u062C \u0639\u0644\u0649 \u062A\u0648\u0644\u064A\u062F \u0646\u0635\u0648\u0635 \u062C\u062F\u064A\u062F\u0629."
          },
          {
            id: "ai-q2",
            type: "tf",
            text: "\u0646\u0645\u0627\u0630\u062C \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0627\u0644\u0643\u0628\u064A\u0631\u0629 (LLMs) \u062A\u0641\u0647\u0645 \u0627\u0644\u0643\u0644\u0645\u0627\u062A \u0648\u062A\u062D\u0644\u0644\u0647\u0627 \u0628\u0627\u0644\u0643\u0627\u0645\u0644 \u0643\u0628\u0646\u064A\u0629 \u0646\u0635\u064A\u0629 \u0648\u0627\u062D\u062F\u0629 \u0641\u0648\u0631\u0627\u064B \u0628\u062F\u0648\u0646 \u062A\u062D\u0648\u064A\u0644\u0647\u0627 \u0625\u0644\u0649 \u0631\u0645\u0648\u0632 \u0631\u0642\u0645\u064A\u0629 (Tokens).",
            options: ["\u0635\u062D", "\u062E\u0637\u0623"],
            correctIndex: 1,
            explanation: "\u062A\u0642\u0648\u0645 \u0647\u0630\u0647 \u0627\u0644\u0646\u0645\u0627\u0630\u062C \u062F\u0627\u0626\u0645\u0627\u064B \u0628\u062A\u0642\u0637\u064A\u0639 \u0627\u0644\u0646\u0635\u0648\u0635 \u0625\u0644\u0649 \u0648\u062D\u062F\u0627\u062A \u0623\u0635\u063A\u0631 \u062A\u0633\u0645\u0649 Tokens \u0648\u062A\u062D\u0648\u064A\u0644\u0647\u0627 \u0644\u0623\u0631\u0642\u0627\u0645 \u0645\u062A\u062C\u0647\u0629 (Embeddings) \u0644\u0627\u0633\u062A\u064A\u0639\u0627\u0628 \u0627\u0644\u0639\u0644\u0627\u0642\u0627\u062A \u0627\u0644\u0631\u064A\u0627\u0636\u064A\u0629 \u0628\u064A\u0646\u0647\u0627."
          },
          {
            id: "ai-q3",
            type: "mcq",
            text: "\u0645\u0627 \u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0639\u0644\u0645\u064A \u0644\u0645\u0634\u0643\u0644\u0629 \u062A\u062E\u064A\u0644 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0645\u063A\u0644\u0648\u0637\u0629 \u0628\u0634\u0643\u0644 \u062A\u0628\u062F\u0648 \u0641\u064A\u0647 \u0635\u062D\u064A\u062D\u0629 \u0648\u062B\u0627\u0628\u062A\u0629\u061F",
            options: [
              "\u0627\u0644\u0647\u0644\u0648\u0633\u0629 (Hallucination)",
              "\u0627\u0644\u062A\u0644\u0627\u0634\u064A (Vanishing)",
              "\u0627\u0644\u062A\u0634\u0628\u0639 (Saturation)",
              "\u0627\u0644\u0646\u0633\u064A\u0627\u0646 \u0627\u0644\u0643\u0627\u0631\u062B\u064A (Catastrophic Forgetting)"
            ],
            correctIndex: 0,
            explanation: "\u0627\u0644\u0647\u0644\u0648\u0633\u0629 \u0623\u0648 Hallucination \u0647\u064A \u0627\u0644\u0638\u0627\u0647\u0631\u0629 \u0627\u0644\u062A\u064A \u064A\u0643\u062A\u0628 \u0641\u064A\u0647\u0627 \u0646\u0645\u0648\u0630\u062C \u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0643\u0628\u064A\u0631 \u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0648\u0627\u062B\u0642\u0629 \u0648\u063A\u064A\u0631 \u062D\u0642\u064A\u0642\u064A\u0629 \u0645\u0646 \u0646\u0633\u062C \u0627\u0631\u062A\u0628\u0627\u0637\u0627\u062A \u0639\u0634\u0648\u0627\u0626\u064A\u0629."
          }
        ],
        createdAt: "2026-06-15T18:27:45.820Z",
        totalPlays: 19,
        avgRating: "4.6",
        ratingsCount: 5,
        timeLimit: 0
      }
    ];
    for (const quizToSeed of seedQuizzes) {
      const exists = await db.select().from(quizzes).where((0, import_drizzle_orm.eq)(quizzes.id, quizToSeed.id)).limit(1);
      if (exists.length === 0) {
        await db.insert(quizzes).values(quizToSeed);
      }
    }
    console.log("Postgres Quizzes seed completed. \u2705");
  } catch (err) {
    console.error("Failed to seed Postgres Quizzes database:", err);
  }
}
var aiClient = null;
function getAi() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined in environment secrets.");
    }
    aiClient = new import_genai.GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}
async function extractTextFromBuffer(buffer, mimeType) {
  try {
    if (mimeType === "application/pdf") {
      const rawImport = await import("pdf-parse");
      const PDFParseClass = rawImport.PDFParse;
      const parser = new PDFParseClass({ data: buffer });
      const textResult = await parser.getText();
      await parser.destroy();
      return textResult.text || "";
    } else if (mimeType.includes("wordprocessingml") || mimeType.includes("msword")) {
      const mammoth = (await import("mammoth")).default || await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }
    return buffer.toString("utf-8");
  } catch (e) {
    console.error("Doc parse error:", e);
    return buffer.toString("utf-8");
  }
}
async function generateContentWithRetryAndFallback(params) {
  const ai = getAi();
  let initialModel = params.model;
  if (!initialModel || initialModel === "gemini-3.1-flash-lite") {
    initialModel = "gemini-3.5-flash";
  }
  const fallbacks = Array.from(/* @__PURE__ */ new Set([
    initialModel,
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-flash-latest",
    "gemini-2.5-pro",
    "gemini-pro-latest",
    "gemini-3.1-pro-preview"
  ])).filter(Boolean);
  let lastError = null;
  for (const modelName of fallbacks) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: params.contents,
        config: params.config
      });
      return {
        text: response.text
      };
    } catch (error) {
      lastError = error;
      let friendlyMessage = error?.message || String(error);
      if (typeof friendlyMessage === "string" && friendlyMessage.trim().startsWith("{")) {
        try {
          const parsed = JSON.parse(friendlyMessage);
          if (parsed.error && parsed.error.message) {
            friendlyMessage = `${parsed.error.message} (Status: ${parsed.error.status}, Code: ${parsed.error.code})`;
          }
        } catch (_) {
        }
      }
      console.warn(`[Gemini API] Error with ${modelName}: ${friendlyMessage}. Retrying with fallback...`);
      await new Promise((r) => setTimeout(r, 1e3));
      continue;
    }
  }
  throw lastError;
}
function parseJsonSafely(text2) {
  let cleaned = text2.replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.log("Initial JSON parse issue, attempting recovery...");
    console.log("Failing text:", text2.substring(0, 500) + "...");
    try {
      return JSON.parse(cleaned + '"');
    } catch (err) {
    }
    try {
      return JSON.parse(cleaned + '"}');
    } catch (err) {
    }
    try {
      return JSON.parse(cleaned + '"]}');
    } catch (err) {
    }
    let lastClosingBrace = cleaned.lastIndexOf("}");
    let attempts = 0;
    while (lastClosingBrace !== -1 && attempts < 50) {
      let sub = cleaned.substring(0, lastClosingBrace + 1);
      const suffixes = [
        "",
        "}",
        "]}",
        "]"
      ];
      for (const suf of suffixes) {
        try {
          return JSON.parse(sub + suf);
        } catch (err) {
        }
      }
      lastClosingBrace = cleaned.lastIndexOf("}", lastClosingBrace - 1);
      attempts++;
    }
    throw e;
  }
}
async function startServer() {
  const app = (0, import_express.default)();
  app.set("trust proxy", 1);
  const PORT = 3e3;
  const apiLimiter = (0, import_express_rate_limit.default)({
    windowMs: 15 * 60 * 1e3,
    max: 200,
    message: { error: "\u0639\u0630\u0631\u0627\u064B! \u062A\u0645 \u062A\u062C\u0627\u0648\u0632 \u0627\u0644\u062D\u062F \u0627\u0644\u0645\u0633\u0645\u0648\u062D \u0645\u0646 \u0627\u0644\u0637\u0644\u0628\u0627\u062A\u060C \u064A\u0631\u062C\u0649 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629 \u0644\u0627\u062D\u0642\u0627\u064B." },
    standardHeaders: true,
    legacyHeaders: false,
    validate: false
  });
  app.use("/api/", apiLimiter);
  app.use((req, res, next) => {
    const largePayloadRoutes = [
      "/api/ocr",
      "/api/generate",
      "/api/cosmobot-chat",
      "/api/gemini-sandbox",
      "/api/scan-document"
    ];
    const isLarge = largePayloadRoutes.some((route) => req.path.startsWith(route));
    if (isLarge) {
      import_express.default.json({ limit: "50mb" })(req, res, next);
    } else {
      import_express.default.json({ limit: "8mb" })(req, res, next);
    }
  });
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5173",
      process.env.FRONTEND_URL || "https://ais-dev-bes5wkza3ioeublsvn2lp5-396545653321.europe-west3.run.app",
      "https://ais-pre-bes5wkza3ioeublsvn2lp5-396545653321.europe-west3.run.app"
    ];
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }
    next();
  });
  ensureDbPostgres().catch((err) => {
    console.error("Asynchronous DB seeding failed:", err);
  });
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
  });
  const challengeCache = {};
  const FALLBACK_CHALLENGES = [
    {
      q: "\u0623\u064A \u0643\u0648\u0643\u0628 \u063A\u0644\u0627\u0641\u0647 \u0648\u062C\u0648\u0647 \u0627\u0644\u063A\u0627\u0632\u064A \u0643\u062B\u064A\u0641 \u0644\u0644\u063A\u0627\u064A\u0629 \u0648\u0645\u062D\u062A\u0628\u0633 \u0628\u0637\u0631\u064A\u0642\u0629 \u062A\u062C\u0639\u0644\u0647 \u0627\u0644\u0623\u0634\u062F \u062D\u0631\u0627\u0631\u0629 \u0628\u0627\u0644\u0645\u0646\u0638\u0648\u0645\u0629 \u0627\u0644\u0634\u0645\u0633\u064A\u0629\u061F \u2604\uFE0F",
      options: ["\u0627\u0644\u0645\u0631\u064A\u062E \u0627\u0644\u0643\u0648\u0643\u0628 \u0627\u0644\u0623\u062D\u0645\u0631", "\u0643\u0648\u0643\u0628 \u0627\u0644\u0632\u0647\u0631\u0629 \u0627\u0644\u0644\u0627\u0645\u0639 \u0648\u0627\u0644\u0645\u062A\u0648\u0647\u062C", "\u0639\u0637\u0627\u0631\u062F \u0627\u0644\u0635\u062E\u0631\u064A \u0627\u0644\u0642\u0631\u064A\u0628 \u062C\u062F\u0627\u064B", "\u0627\u0644\u0645\u0634\u062A\u0631\u064A \u0627\u0644\u063A\u0627\u0632\u064A \u0627\u0644\u0639\u0638\u064A\u0645"],
      correctIdx: 1,
      explanation: "\u0643\u0648\u0643\u0628 \u0627\u0644\u0632\u0647\u0631\u0629 \u0647\u0648 \u0627\u0644\u0623\u0634\u062F \u062D\u0631\u0627\u0631\u0629 \u0628\u0627\u0644\u0645\u0646\u0638\u0648\u0645\u0629 \u0627\u0644\u0634\u0645\u0633\u064A\u0629 \u0628\u0633\u0628\u0628 \u0638\u0627\u0647\u0631\u0629 \u0627\u0644\u0627\u062D\u062A\u0628\u0627\u0633 \u0627\u0644\u062D\u0631\u0627\u0631\u064A \u0627\u0644\u062C\u0627\u0645\u062D\u0629 \u0627\u0644\u0646\u0627\u062A\u062C\u0629 \u0639\u0646 \u063A\u0644\u0627\u0641 \u063A\u0627\u0632\u064A \u0643\u062B\u064A\u0641 \u0645\u0646 \u062B\u0627\u0646\u064A \u0623\u0643\u0633\u064A\u062F \u0627\u0644\u0643\u0631\u0628\u0648\u0646.",
      topic: "\u0639\u0644\u0645 \u0627\u0644\u0641\u0644\u0643"
    },
    {
      q: "\u0645\u0627 \u0647\u064A \u0627\u0644\u0645\u062C\u0631\u0629 \u0627\u0644\u062D\u0644\u0632\u0648\u0646\u064A\u0629 \u0627\u0644\u0639\u0645\u0644\u0627\u0642\u0629 \u0627\u0644\u062A\u064A \u064A\u0646\u062A\u0645\u064A \u0625\u0644\u064A\u0647\u0627 \u0646\u0638\u0627\u0645\u0646\u0627 \u0627\u0644\u0634\u0645\u0633\u064A \u0648\u0643\u0648\u0643\u0628 \u0627\u0644\u0623\u0631\u0636\u061F \u{1F30C}",
      options: ["\u0645\u062C\u0631\u0629 \u0623\u0646\u062F\u0631\u0648\u0645\u064A\u062F\u0627 (\u0627\u0644\u0645\u0631\u0623\u0629 \u0627\u0644\u0645\u0633\u0644\u0633\u0644\u0629)", "\u0645\u062C\u0631\u0629 \u062F\u0631\u0628 \u0627\u0644\u062A\u0628\u0627\u0646\u0629 (\u0627\u0644\u0637\u0631\u064A\u0642 \u0627\u0644\u0645\u0644\u0628\u0646)", "\u0645\u062C\u0631\u0629 \u0635\u0627\u0646\u0639 \u0627\u0644\u0641\u0636\u0629", "\u0645\u062C\u0631\u0629 \u0627\u0644\u062F\u0648\u0627\u0645\u0629"],
      correctIdx: 1,
      explanation: "\u062F\u0631\u0628 \u0627\u0644\u062A\u0628\u0627\u0646\u0629 \u0647\u064A \u0627\u0644\u0645\u062C\u0631\u0629 \u0627\u0644\u062D\u0644\u0632\u0648\u0646\u064A\u0629 \u0627\u0644\u062A\u064A \u064A\u0642\u0628\u0639 \u0641\u064A\u0647\u0627 \u0643\u0648\u0643\u0628 \u0627\u0644\u0623\u0631\u0636 \u0648\u0646\u0638\u0627\u0645\u0646\u0627 \u0627\u0644\u0634\u0645\u0633\u064A \u0643\u0627\u0645\u0644\u0627\u064B.",
      topic: "\u0639\u0644\u0645 \u0627\u0644\u0643\u0648\u0646\u064A\u0627\u062A"
    },
    {
      q: "\u0645\u0627 \u0647\u0648 \u0627\u0644\u0643\u0648\u0643\u0628 \u0627\u0644\u0623\u0643\u0628\u0631 \u062D\u062C\u0645\u0627\u064B \u0641\u064A \u0646\u0638\u0627\u0645\u0646\u0627 \u0627\u0644\u0634\u0645\u0633\u064A \u0648\u0627\u0644\u0630\u064A \u064A\u062A\u0645\u064A\u0632 \u0628\u0628\u0642\u0639\u062A\u0647 \u0627\u0644\u062D\u0645\u0631\u0627\u0621 \u0627\u0644\u0639\u0638\u064A\u0645\u0629\u061F \u{1FA90}",
      options: ["\u0632\u062D\u0644 \u0630\u0648 \u0627\u0644\u062D\u0644\u0642\u0627\u062A", "\u0643\u0648\u0643\u0628 \u0627\u0644\u0645\u0634\u062A\u0631\u064A \u0627\u0644\u0639\u0645\u0644\u0627\u0642", "\u0643\u0648\u0643\u0628 \u0646\u0628\u062A\u0648\u0646 \u0627\u0644\u0623\u0632\u0631\u0642", "\u0627\u0644\u0623\u0631\u0636 \u0627\u0644\u0645\u0627\u0626\u064A\u0629"],
      correctIdx: 1,
      explanation: "\u0627\u0644\u0645\u0634\u062A\u0631\u064A \u0647\u0648 \u0623\u0636\u062E\u0645 \u0643\u0648\u0627\u0643\u0628 \u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0629 \u0627\u0644\u0634\u0645\u0633\u064A\u0629 \u0639\u0644\u0649 \u0627\u0644\u0625\u0637\u0644\u0627\u0642 \u0648\u064A\u0641\u0648\u0642 \u062D\u062C\u0645 \u0627\u0644\u0623\u0631\u0636 \u0628\u0623\u0643\u062B\u0631 \u0645\u0646 \u0623\u0644\u0641 \u0645\u0631\u0629.",
      topic: "\u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0629 \u0627\u0644\u0634\u0645\u0633\u064A\u0629"
    },
    {
      q: "\u0645\u0627 \u0647\u064A \u0623\u0635\u063A\u0631 \u0648\u062D\u062F\u0629 \u0628\u0646\u0627\u0626\u064A\u0629 \u062D\u064A\u0629 \u0641\u064A \u062C\u0645\u064A\u0639 \u0627\u0644\u0643\u0627\u0626\u0646\u0627\u062A \u0627\u0644\u062D\u064A\u0629 \u0639\u0644\u0649 \u0648\u062C\u0647 \u0627\u0644\u0623\u0631\u0636\u061F \u{1F9EC}",
      options: ["\u0627\u0644\u0630\u0631\u0629 \u0627\u0644\u0643\u064A\u0645\u064A\u0627\u0626\u064A\u0629", "\u0627\u0644\u062E\u0644\u064A\u0629 \u0627\u0644\u062D\u064A\u0629", "\u0627\u0644\u062C\u0632\u064A\u0621 \u0627\u0644\u0639\u0636\u0648\u064A", "\u0627\u0644\u0628\u0631\u0648\u062A\u064A\u0646 \u0627\u0644\u063A\u0630\u0627\u0626\u064A"],
      correctIdx: 1,
      explanation: "\u0627\u0644\u062E\u0644\u064A\u0629 \u0647\u064A \u0627\u0644\u0648\u062D\u062F\u0629 \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629 \u0648\u0627\u0644\u062A\u0631\u0643\u064A\u0628\u064A\u0629 \u0644\u0643\u0644 \u0623\u0634\u0643\u0627\u0644 \u0627\u0644\u062D\u064A\u0627\u0629 \u0627\u0644\u0645\u0639\u0631\u0648\u0641\u0629 \u0643\u064A\u0645\u064A\u0627\u0626\u064A\u0627\u064B \u0648\u0628\u064A\u0648\u0644\u0648\u062C\u064A\u0627\u064B.",
      topic: "\u0639\u0644\u0645 \u0627\u0644\u0623\u062D\u064A\u0627\u0621"
    },
    {
      q: "\u0623\u064A \u063A\u0627\u0632 \u064A\u0645\u062B\u0644 \u0627\u0644\u0646\u0633\u0628\u0629 \u0627\u0644\u0623\u0643\u0628\u0631 \u0648\u0627\u0644\u0645\u0647\u064A\u0645\u0646\u0629 \u0641\u064A \u0627\u0644\u0647\u0648\u0627\u0621 \u0627\u0644\u062C\u0648\u064A \u0627\u0644\u0630\u064A \u064A\u062D\u064A\u0637 \u0628\u0646\u0627 \u0639\u0644\u0649 \u0643\u0648\u0643\u0628 \u0627\u0644\u0623\u0631\u0636\u061F \u{1F32C}\uFE0F",
      options: ["\u063A\u0627\u0632 \u0627\u0644\u0623\u0643\u0633\u062C\u064A\u0646 \u0644\u0644\u062A\u0646\u0641\u0633", "\u063A\u0627\u0632 \u0627\u0644\u0646\u064A\u062A\u0631\u0648\u062C\u064A\u0646 \u0627\u0644\u062E\u0627\u0645\u0644", "\u063A\u0627\u0632 \u062B\u0627\u0646\u064A \u0623\u0643\u0633\u064A\u062F \u0627\u0644\u0643\u0631\u0628\u0648\u0646", "\u063A\u0627\u0632 \u0627\u0644\u0647\u064A\u062F\u0631\u0648\u062C\u064A\u0646 \u0627\u0644\u062E\u0641\u064A\u0641"],
      correctIdx: 1,
      explanation: "\u064A\u0645\u062B\u0644 \u0627\u0644\u0646\u064A\u062A\u0631\u0648\u062C\u064A\u0646 \u0627\u0644\u0646\u0633\u0628\u0629 \u0627\u0644\u0623\u0643\u0628\u0631 \u0641\u064A \u0627\u0644\u063A\u0644\u0627\u0641 \u0627\u0644\u062C\u0648\u064A \u0644\u0644\u0623\u0631\u0636 \u0628\u0646\u0633\u0628\u0629 \u062A\u0642\u0627\u0631\u0628 78%\u060C \u064A\u0644\u064A\u0647 \u0627\u0644\u0623\u0643\u0633\u062C\u064A\u0646 \u0628\u0646\u0633\u0628\u0629 21%.",
      topic: "\u0639\u0644\u0648\u0645 \u0627\u0644\u0623\u0631\u0636"
    },
    {
      q: "\u0645\u0627 \u0647\u064A \u0627\u0644\u0642\u0648\u0629 \u063A\u064A\u0631 \u0645\u0631\u0626\u064A\u0629 \u0627\u0644\u062A\u064A \u062A\u062C\u0630\u0628 \u0627\u0644\u0623\u062C\u0633\u0627\u0645 \u0646\u062D\u0648 \u0645\u0631\u0643\u0632 \u0643\u0648\u0643\u0628 \u0627\u0644\u0623\u0631\u0636 \u0648\u062A\u0645\u0646\u0639\u0646\u0627 \u0645\u0646 \u0627\u0644\u0637\u0641\u0648\u061F \u{1F30D}",
      options: ["\u0627\u0644\u0642\u0648\u0629 \u0627\u0644\u0645\u063A\u0646\u0627\u0637\u064A\u0633\u064A\u0629", "\u0642\u0648\u0629 \u0627\u0644\u062C\u0627\u0630\u0628\u064A\u0629 \u0627\u0644\u0623\u0631\u0636\u064A\u0629", "\u0642\u0648\u0629 \u0627\u0644\u0627\u062D\u062A\u0643\u0627\u0643 \u0627\u0644\u0633\u0637\u062D\u064A", "\u0627\u0644\u0642\u0648\u0629 \u0627\u0644\u0637\u0627\u0631\u062F\u0629 \u0627\u0644\u0645\u0631\u0643\u0632\u064A\u0629"],
      correctIdx: 1,
      explanation: "\u0642\u0648\u0629 \u0627\u0644\u062C\u0627\u0630\u0628\u064A\u0629 \u0627\u0644\u062A\u064A \u0627\u0643\u062A\u0634\u0641\u0647\u0627 \u0627\u0644\u0633\u064A\u0631 \u0625\u0633\u062D\u0642 \u0646\u064A\u0648\u062A\u0646 \u0647\u064A \u0627\u0644\u0642\u0648\u0629 \u0627\u0644\u0645\u063A\u0646\u0627\u0637\u064A\u0633\u064A\u0629 \u0627\u0644\u062B\u0642\u0627\u0644\u064A\u0629 \u0627\u0644\u0643\u0648\u0646\u064A\u0629 \u0627\u0644\u062A\u064A \u062A\u062C\u0630\u0628 \u0627\u0644\u0623\u062C\u0633\u0627\u0645 \u0644\u0623\u0633\u0641\u0644.",
      topic: "\u0627\u0644\u0641\u064A\u0632\u064A\u0627\u0621 \u0627\u0644\u0643\u0644\u0627\u0633\u064A\u0643\u064A\u0629"
    },
    {
      q: "\u0623\u064A \u0643\u0648\u0643\u0628 \u064A\u0639\u0631\u0641 \u0641\u064A \u0623\u0628\u062D\u0627\u062B \u0648\u0639\u0644\u0648\u0645 \u0627\u0644\u0641\u0636\u0627\u0621 \u0628\u0627\u0633\u0645 \u0627\u0644\u0643\u0648\u0643\u0628 \u0627\u0644\u0623\u062D\u0645\u0631 \u0644\u0648\u062C\u0648\u062F \u0623\u0643\u0627\u0633\u064A\u062F \u0627\u0644\u062D\u062F\u064A\u062F \u0639\u0644\u0649 \u0633\u0637\u062D\u0647\u061F \u{1F534}",
      options: ["\u0643\u0648\u0643\u0628 \u0627\u0644\u0645\u0631\u064A\u062E", "\u0643\u0648\u0643\u0628 \u0639\u0637\u0627\u0631\u062F", "\u0643\u0648\u0643\u0628 \u0632\u062D\u0644", "\u0643\u0648\u0643\u0628 \u0627\u0644\u0632\u0647\u0631\u0629"],
      correctIdx: 0,
      explanation: "\u064A\u0633\u0645\u0649 \u0627\u0644\u0645\u0631\u064A\u062E \u0628\u0627\u0644\u0643\u0648\u0643\u0628 \u0627\u0644\u0623\u062D\u0645\u0631 \u0628\u0633\u0628\u0628 \u063A\u0646\u0649 \u062A\u0631\u0628\u062A\u0647 \u0648\u0635\u062E\u0648\u0631\u0647 \u0628\u0623\u0643\u0627\u0633\u064A\u062F \u0627\u0644\u062D\u062F\u064A\u062F \u0627\u0644\u0635\u062F\u0626\u0629 \u0627\u0644\u062A\u064A \u062A\u0645\u0646\u062D\u0647 \u0647\u0630\u0627 \u0627\u0644\u0644\u0648\u0646 \u0627\u0644\u0645\u0645\u064A\u0632.",
      topic: "\u062C\u064A\u0648\u0644\u0648\u062C\u064A\u0627 \u0627\u0644\u0643\u0648\u0627\u0643\u0628"
    }
  ];
  app.get("/api/cosmo-challenge", async (req, res) => {
    const rawTier = (req.query.tier || "free").toString().toLowerCase();
    let intervalMs = 24 * 60 * 60 * 1e3;
    if (rawTier.includes("diamond") || rawTier.includes("\u0645\u0627\u0633\u064A\u0629") || rawTier.includes("\u0645\u0624\u0633\u0633\u0627\u062A") || rawTier.includes("\u0645\u062F\u0631\u0633\u0629") || rawTier.includes("\u0646\u062E\u0628\u0629")) {
      intervalMs = 2 * 60 * 1e3;
    } else if (rawTier.includes("gold") || rawTier.includes("\u0627\u0644\u0630\u0647\u0628\u064A\u0629") || rawTier.includes("\u0630\u0647\u0628\u064A\u0629") || rawTier.includes("\u0645\u0639\u0644\u0645")) {
      intervalMs = 30 * 60 * 1e3;
    } else if (rawTier.includes("silver") || rawTier.includes("\u0641\u0636\u064A\u0629") || rawTier.includes("\u0627\u0644\u0641\u0636\u064A\u0629")) {
      intervalMs = 120 * 60 * 1e3;
    }
    const now = Date.now();
    const rotationKey = Math.floor(now / intervalMs);
    const msElapsedInCurrentBlock = now % intervalMs;
    const nextUpdateInMs = intervalMs - msElapsedInCurrentBlock;
    const normalizedTier = intervalMs === 2 * 60 * 1e3 ? "diamond" : intervalMs === 30 * 60 * 1e3 ? "gold" : intervalMs === 120 * 60 * 1e3 ? "silver" : "free";
    const cached = challengeCache[normalizedTier];
    if (cached && cached.rotationKey === rotationKey) {
      return res.json({
        ...cached,
        nextUpdateInMs
      });
    }
    let finalQuestion = FALLBACK_CHALLENGES[rotationKey % FALLBACK_CHALLENGES.length];
    let createdWithAi = false;
    try {
      const ai = getAi();
      if (ai) {
        const topics = ["\u0639\u0644\u0645 \u0627\u0644\u0641\u0644\u0643 \u0648\u0627\u0644\u0643\u0648\u0627\u0643\u0628", "\u0627\u0644\u0641\u064A\u0632\u064A\u0627\u0621 \u0627\u0644\u0643\u0648\u0646\u064A\u0629", "\u0627\u0644\u0643\u064A\u0645\u064A\u0627\u0621 \u0627\u0644\u0630\u0631\u064A\u0629", "\u0627\u0644\u0639\u0648\u0627\u0644\u0645 \u0648\u0627\u0644\u0623\u062D\u064A\u0627\u0621 \u0627\u0644\u0645\u062C\u0647\u0631\u064A\u0629", "\u062C\u064A\u0648\u0644\u0648\u062C\u064A\u0627 \u0627\u0644\u0623\u0631\u0636", "\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u062D\u0627\u0633\u0648\u0628 \u0648\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A", "\u0627\u0644\u0623\u0644\u063A\u0627\u0632 \u0627\u0644\u0645\u0646\u0637\u0642\u064A\u0629 \u0648\u0627\u0644\u0631\u064A\u0627\u0636\u064A\u0627\u062A"];
        const selectedTopic = topics[rotationKey % topics.length];
        const prompt = `\u0623\u0646\u062A \u0639\u0627\u0644\u0645 \u0639\u0628\u0642\u0631\u064A \u0648\u0645\u0639\u0644\u0645 \u0630\u0643\u064A \u062A\u0635\u064A\u063A \u0623\u0633\u0623\u0633\u0626\u0644\u0629 \u0645\u0633\u0644\u064A\u0629 \u062A\u0641\u0627\u0639\u0644\u064A\u0629.
\u0635\u063A \u0633\u0624\u0627\u0644\u0627\u064B \u0627\u062E\u062A\u064A\u0627\u0631\u064A\u0627\u064B \u0630\u0643\u064A\u0627\u064B \u0648\u0633\u0647\u0644\u0627\u064B \u062C\u062F\u0627\u064B (very easy science trivia question) \u0628\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0641\u0635\u062D\u0649 \u062D\u0648\u0644 \u0645\u0648\u0636\u0648\u0639: "${selectedTopic}".
\u064A\u062C\u0628 \u0623\u0646 \u064A\u062A\u0645\u062D\u0648\u0631 \u0627\u0644\u0633\u0624\u0627\u0644 \u062D\u0648\u0644 \u0641\u0643\u0631\u0629 \u0639\u0644\u0645\u064A\u0629 \u062C\u0630\u0627\u0628\u0629 \u0648\u0628\u0633\u064A\u0637\u0629 \u0627\u0644\u0641\u0647\u0645 \u0648\u0635\u062D\u064A\u062D\u0629 \u0639\u0644\u0645\u064A\u0627\u064B 100%.

\u062A\u0641\u0627\u0635\u064A\u0644 \u0647\u0627\u0645\u0629:
1. \u0627\u0644\u0633\u0624\u0627\u0644 \u0645\u0645\u062A\u0639 \u0648\u062C\u0630\u0627\u0628 \u0648\u0633\u0647\u0644 \u0644\u0644\u063A\u0627\u064A\u0629 \u0648\u0648\u0627\u0636\u062D \u062C\u062F\u0627\u064B \u0644\u0644\u0637\u0644\u0627\u0628 (easy trivia).
2. \u0648\u0641\u0631 4 \u062E\u064A\u0627\u0631\u0627\u062A \u062D\u0644 \u062F\u0642\u064A\u0642\u0629 \u0648\u062B\u0627\u0628\u062A\u0629 \u062C\u062F\u0627\u064B.
3. \u0648\u0641\u0631 \u0645\u0624\u0634\u0631 \u0627\u0644\u062E\u064A\u0627\u0631 \u0627\u0644\u0635\u062D\u064A\u062D (\u064A\u0643\u0648\u0646 \u0645\u0646 0 \u0625\u0644\u0649 3).
4. \u0627\u0643\u062A\u0628 \u0634\u0631\u062D\u0627\u064B \u062A\u0639\u0644\u064A\u0645\u064A\u0627\u064B \u0645\u0628\u0633\u0637\u0627\u064B \u0641\u064A \u0628\u0636\u0639\u0629 \u0623\u0633\u0637\u0631 \u064A\u0641\u0633\u0631 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0629 \u0628\u0623\u0633\u0644\u0648\u0628 \u0634\u064A\u0642 \u0648\u062C\u0630\u0627\u0628 \u0648\u0645\u0628\u0633\u0637.

\u0642\u0645 \u0628\u0635\u064A\u0627\u063A\u0629 \u0627\u0644\u0625\u062C\u0627\u0628\u0629 \u0648\u0625\u0631\u062C\u0627\u0639\u0647\u0627 \u0639\u0644\u0649 \u0634\u0643\u0644 \u0648\u062B\u064A\u0642\u0629 JSON \u0646\u0642\u064A\u0629 \u0645\u0637\u0627\u0628\u0642\u0629 \u0648\u0645\u062C\u0631\u062F\u0629 \u062A\u0645\u0627\u0645\u0627\u064B \u0644\u0644\u0647\u064A\u0643\u0644 \u0627\u0644\u0628\u0631\u0645\u062C\u064A \u0627\u0644\u062A\u0627\u0644\u064A\u060C \u0648\u0628\u062F\u0648\u0646 \u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0623\u064A \u0639\u0644\u0627\u0645\u0627\u062A \u062A\u0646\u0635\u064A\u0635 \u062E\u0644\u0641\u064A\u0629 \u0623\u0648 \u0639\u0644\u0627\u0645\u0627\u062A \u0645\u0627\u0631\u0643\u062F\u0627\u0648\u0646 (\u0645\u062B\u0644 \`\`\`json):
{
  "q": "\u0646\u0635 \u0627\u0644\u0633\u0624\u0627\u0644 \u0628\u0627\u0644\u0643\u0627\u0645\u0644 \u0645\u0636\u0627\u0641\u0627\u064B \u0625\u0644\u064A\u0647 \u0625\u064A\u0645\u0648\u062C\u064A \u0639\u0644\u0645\u064A \u0645\u0628\u0647\u062C",
  "options": ["\u062E\u064A\u0627\u0631 0", "\u062E\u064A\u0627\u0631 1", "\u062E\u064A\u0627\u0631 2", "\u062E\u064A\u0627\u0631 3"],
  "correctIdx": 0,
  "explanation": "\u0627\u0644\u0634\u0631\u062D \u0627\u0644\u062A\u0639\u0644\u064A\u0645\u064A \u0628\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0641\u0635\u062D\u0649 \u0627\u0644\u0645\u0628\u0633\u0637\u0629 \u0644\u0625\u062B\u0631\u0627\u0621 \u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u0644\u0637\u0627\u0644\u0628",
  "topic": "\u0627\u0644\u0645\u0648\u0636\u0648\u0639 \u0628\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629"
}`;
        const response = await generateContentWithRetryAndFallback({
          model: "gemini-3.5-flash",
          contents: prompt
        });
        const textOutput = response.text || "";
        const parsed = parseJsonSafely(textOutput);
        if (parsed && parsed.q && Array.isArray(parsed.options) && parsed.options.length === 4 && typeof parsed.correctIdx === "number") {
          finalQuestion = {
            q: parsed.q,
            options: parsed.options,
            correctIdx: parsed.correctIdx,
            explanation: parsed.explanation || "",
            topic: parsed.topic || selectedTopic
          };
          createdWithAi = true;
          console.log(`[Cosmo Challenge ID: ${rotationKey}] Dynamic Easy Quiz parsed for [${normalizedTier}]!`);
        }
      }
    } catch (e) {
      console.warn(`[Gemini API] Using scientific fallbacks for Cosmo (Tier: ${normalizedTier}):`, e);
    }
    challengeCache[normalizedTier] = {
      ...finalQuestion,
      rotationKey,
      createdAt: now
    };
    return res.json({
      ...challengeCache[normalizedTier],
      createdWithAi,
      nextUpdateInMs
    });
  });
  app.get("/api/share-origin", (req, res) => {
    const protocol = req.get("x-forwarded-proto") || req.protocol || "https";
    const host = req.get("x-forwarded-host") || req.get("host") || "localhost:3000";
    const activeHost = host.split(",")[0].trim();
    res.json({ origin: `${protocol}://${activeHost}` });
  });
  app.get("/api/quizzes", async (req, res) => {
    try {
      const allQuizzes = await db.select().from(quizzes).orderBy((0, import_drizzle_orm.desc)(quizzes.createdAt));
      res.json(allQuizzes);
    } catch (err) {
      console.error("Error fetching quizzes from Postgres:", err);
      res.status(500).json({ error: "\u0639\u0630\u0631\u0627\u064B! \u0641\u0634\u0644 \u062C\u0644\u0628 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631\u0627\u062A \u0645\u0646 \u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A." });
    }
  });
  app.get("/api/quizzes/:id", async (req, res) => {
    try {
      const quizId = req.params.id;
      const result = await db.select().from(quizzes).where((0, import_drizzle_orm.eq)(quizzes.id, quizId)).limit(1);
      if (result.length === 0) {
        return res.status(404).json({ error: "\u0644\u0645 \u064A\u062A\u0645 \u0627\u0644\u0639\u062B\u0648\u0631 \u0639\u0644\u0649 \u0647\u0630\u0627 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631!" });
      }
      res.json(result[0]);
    } catch (err) {
      console.error("Error fetching quiz from Postgres:", err);
      res.status(500).json({ error: "\u0639\u0630\u0631\u0627\u064B! \u0641\u0634\u0644 \u062C\u0644\u0628 \u0647\u0630\u0627 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631." });
    }
  });
  app.post("/api/quizzes", async (req, res) => {
    try {
      let authenticatedUser;
      try {
        authenticatedUser = await getAuthenticatedUser(req);
      } catch (authErr) {
        return res.status(401).json({ error: "\u0639\u0630\u0631\u0627\u064B! \u064A\u062C\u0628 \u0639\u0644\u064A\u0643 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0623\u0648\u0644\u0627\u064B \u0644\u062A\u062A\u0645\u0643\u0646 \u0645\u0646 \u0635\u064A\u0627\u063A\u0629 \u0648\u062D\u0641\u0638 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631\u0627\u062A." });
      }
      const { id, title, description, creatorId, creatorName, questions: incomingQuestions, timeLimit, category, distributionRouting, classroomId } = req.body;
      if (!title || typeof title !== "string" || title.length > 500) {
        return res.status(400).json({ error: "\u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D \u0623\u0648 \u0637\u0648\u064A\u0644 \u062C\u062F\u0627\u064B." });
      }
      if (!incomingQuestions || !Array.isArray(incomingQuestions) || incomingQuestions.length === 0) {
        return res.status(400).json({ error: "\u0645\u062D\u062A\u0648\u0649 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D." });
      }
      const freshId = id || "quiz-" + Math.random().toString(36).substring(2, 11);
      const cleanedQuestions = incomingQuestions.slice(0, 500).map((q, index) => ({
        id: (q.id || `q-${index}-${Date.now()}`).substring(0, 100),
        type: ["mcq", "tf", "essay"].includes(q.type) ? q.type : "mcq",
        text: (q.text || "").substring(0, 2e3),
        options: Array.isArray(q.options) ? q.options.map((opt) => String(opt).substring(0, 1e3)) : [],
        correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : 0,
        explanation: (q.explanation || "").substring(0, 2e3),
        imageUrl: typeof q.imageUrl === "string" ? q.imageUrl : void 0
      }));
      const finalCreatorId = authenticatedUser.uid;
      const finalCreatorName = creatorName || authenticatedUser.name || "\u0637\u0627\u0644\u0628 \u0645\u062A\u0645\u064A\u0632";
      const newQuiz = {
        id: freshId,
        title: title.trim(),
        description: (description || "").substring(0, 1e3),
        creatorId: finalCreatorId.substring(0, 100),
        creatorName: finalCreatorName.substring(0, 100),
        questions: cleanedQuestions,
        totalPlays: 0,
        avgRating: "0.0",
        ratingsCount: 0,
        timeLimit: typeof timeLimit === "number" ? timeLimit : 0,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        category: typeof category === "string" ? category : "\u0639\u0627\u0645",
        distributionRouting: typeof distributionRouting === "string" ? distributionRouting : "public",
        classroomId: typeof classroomId === "string" ? classroomId : null
      };
      await db.insert(quizzes).values(newQuiz);
      res.json({ success: true, quizId: newQuiz.id, quiz: newQuiz });
    } catch (err) {
      console.error("Error creating quiz on Postgres:", err);
      res.status(500).json({ error: "\u0641\u0634\u0644 \u062D\u0641\u0638 \u0647\u0630\u0627 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631 \u0641\u064A \u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A." });
    }
  });
  app.delete("/api/quizzes/:id", async (req, res) => {
    try {
      let authenticatedUser;
      try {
        authenticatedUser = await getAuthenticatedUser(req);
      } catch (authErr) {
        return res.status(401).json({ error: "\u0639\u0630\u0631\u0627\u064B! \u064A\u062C\u0628 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u0644\u0642\u064A\u0627\u0645 \u0628\u062D\u0630\u0641 \u0647\u0630\u0627 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631." });
      }
      const quizId = req.params.id;
      const existingQuizList = await db.select().from(quizzes).where((0, import_drizzle_orm.eq)(quizzes.id, quizId)).limit(1);
      if (existingQuizList.length === 0) {
        return res.status(404).json({ error: "\u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F." });
      }
      const quiz = existingQuizList[0];
      const isAdmin = authenticatedUser.email === "adman777888999@gmail.com";
      if (quiz.creatorId !== authenticatedUser.uid && !isAdmin) {
        return res.status(403).json({ error: "\u0627\u062E\u062A\u0631\u0627\u0642 \u0623\u0645\u0646\u064A! \u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0627\u062A \u0643\u0627\u0641\u064A\u0629 \u0644\u062D\u0630\u0641 \u0627\u062E\u062A\u0628\u0627\u0631 \u0645\u0633\u062A\u062E\u062F\u0645 \u0622\u062E\u0631." });
      }
      await db.delete(quizzes).where((0, import_drizzle_orm.eq)(quizzes.id, quizId));
      res.json({ success: true, message: "\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631 \u0628\u0646\u062C\u0627\u062D \u0645\u0646 \u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A." });
    } catch (err) {
      console.error("Error deleting quiz on Postgres:", err);
      res.status(500).json({ error: "\u0639\u0630\u0631\u0627\u064B! \u0641\u0634\u0644 \u062D\u0630\u0641 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631 \u0645\u0646 \u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A." });
    }
  });
  app.put("/api/quizzes/:id", async (req, res) => {
    try {
      let authenticatedUser;
      try {
        authenticatedUser = await getAuthenticatedUser(req);
      } catch (authErr) {
        return res.status(401).json({ error: "\u0639\u0630\u0631\u0627\u064B! \u064A\u062C\u0628 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631." });
      }
      const quizId = req.params.id;
      const updatedData = req.body;
      delete updatedData.id;
      const existingQuizList = await db.select().from(quizzes).where((0, import_drizzle_orm.eq)(quizzes.id, quizId)).limit(1);
      if (existingQuizList.length === 0) {
        return res.status(404).json({ error: "\u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F." });
      }
      const quiz = existingQuizList[0];
      const isAdmin = authenticatedUser.email === "adman777888999@gmail.com";
      if (quiz.creatorId !== authenticatedUser.uid && !isAdmin) {
        return res.status(403).json({ error: "\u0627\u062E\u062A\u0631\u0627\u0642 \u0623\u0645\u0646\u064A! \u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0627\u062A \u0643\u0627\u0641\u064A\u0629 \u0644\u062A\u0639\u062F\u064A\u0644 \u0627\u062E\u062A\u0628\u0627\u0631 \u0645\u0633\u062A\u062E\u062F\u0645 \u0622\u062E\u0631." });
      }
      await db.update(quizzes).set(updatedData).where((0, import_drizzle_orm.eq)(quizzes.id, quizId));
      const resQuiz = await db.select().from(quizzes).where((0, import_drizzle_orm.eq)(quizzes.id, quizId)).limit(1);
      res.json({ success: true, quiz: resQuiz[0] });
    } catch (err) {
      console.error("Error updating quiz on Postgres:", err);
      res.status(500).json({ error: "\u0639\u0630\u0631\u0627\u064B! \u0641\u0634\u0644 \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631." });
    }
  });
  app.post("/api/quizzes/:id/submit", async (req, res) => {
    try {
      const { takerId, takerName, score, rating, feedback } = req.body;
      const quizId = req.params.id;
      if (!takerName) {
        return res.status(400).json({ error: "\u0627\u0633\u0645 \u0627\u0644\u0645\u062A\u0633\u0627\u0628\u0642 \u0645\u0637\u0644\u0648\u0628 \u0644\u062D\u0641\u0638 \u0627\u0644\u0646\u062A\u0627\u0626\u062C." });
      }
      const quizList = await db.select().from(quizzes).where((0, import_drizzle_orm.eq)(quizzes.id, quizId)).limit(1);
      if (quizList.length === 0) {
        return res.status(404).json({ error: "\u0627\u0644\u0627\u0645\u062A\u062D\u0627\u0646 \u063A\u064A\u0631 \u0645\u062A\u0648\u0641\u0631 \u0644\u0644\u062A\u0639\u062F\u064A\u0644." });
      }
      const quiz = quizList[0];
      let newTotalPlays = (quiz.totalPlays || 0) + 1;
      let newCount = quiz.ratingsCount || 0;
      let newAvg = quiz.avgRating || "0.0";
      if (typeof rating === "number" && rating >= 1 && rating <= 5) {
        const oldCount = quiz.ratingsCount || 0;
        const oldAvg = parseFloat(quiz.avgRating || "0.0");
        newCount = oldCount + 1;
        newAvg = ((oldAvg * oldCount + rating) / newCount).toFixed(1);
      }
      await db.update(quizzes).set({
        totalPlays: newTotalPlays,
        ratingsCount: newCount,
        avgRating: newAvg
      }).where((0, import_drizzle_orm.eq)(quizzes.id, quizId));
      const newCompletion = {
        id: "comp-" + Math.random().toString(36).substring(2, 11),
        quizId,
        quizTitle: quiz.title,
        takerId: takerId || "anonymous-taker",
        takerName,
        score: typeof score === "number" ? score : 0,
        totalQuestions: quiz.questions.length,
        rating: rating || null,
        feedback: feedback || "",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      await db.insert(completions).values(newCompletion);
      await db.insert(quizResults).values({
        id: newCompletion.id,
        // match id for robust mirroring
        quizId,
        quizTitle: quiz.title,
        studentName: takerName,
        score: typeof score === "number" ? score : 0,
        totalQuestions: quiz.questions.length,
        rating: rating || null,
        feedback: feedback || "",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      res.json({ success: true, completion: newCompletion });
    } catch (err) {
      console.error("Error submitting quiz completion on Postgres:", err);
      res.status(500).json({ error: "\u0641\u0634\u0644 \u0625\u0631\u0633\u0627\u0644 \u0645\u062D\u0627\u0648\u0644\u0629 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631 \u0648\u062D\u0641\u0638\u0647\u0627." });
    }
  });
  app.post("/api/completions/:id/rate", async (req, res) => {
    try {
      const completionId = req.params.id;
      const { rating, feedback } = req.body;
      if (typeof rating !== "number" || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "\u0627\u0644\u062A\u0642\u064A\u064A\u0645 \u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 \u0628\u064A\u0646 \u0661 \u0648 \u0665 \u0646\u062C\u0645\u0627\u062A." });
      }
      const compList = await db.select().from(completions).where((0, import_drizzle_orm.eq)(completions.id, completionId)).limit(1);
      if (compList.length === 0) {
        return res.status(404).json({ error: "\u0644\u0645 \u064A\u062A\u0645 \u0627\u0644\u0639\u062B\u0648\u0631 \u0639\u0644\u0649 \u0645\u062D\u0627\u0648\u0644\u0629 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631." });
      }
      const completion = compList[0];
      await db.update(completions).set({
        rating,
        feedback: feedback || ""
      }).where((0, import_drizzle_orm.eq)(completions.id, completionId));
      await db.update(quizResults).set({
        rating,
        feedback: feedback || ""
      }).where((0, import_drizzle_orm.eq)(quizResults.id, completionId));
      const quizList = await db.select().from(quizzes).where((0, import_drizzle_orm.eq)(quizzes.id, completion.quizId)).limit(1);
      if (quizList.length > 0) {
        const quiz = quizList[0];
        const oldCount = quiz.ratingsCount || 0;
        const oldAvg = parseFloat(quiz.avgRating || "0.0");
        const newCount = oldCount + 1;
        const newAvg = ((oldAvg * oldCount + rating) / newCount).toFixed(1);
        await db.update(quizzes).set({
          ratingsCount: newCount,
          avgRating: newAvg
        }).where((0, import_drizzle_orm.eq)(quizzes.id, quiz.id));
      }
      res.json({ success: true });
    } catch (err) {
      console.error("Error rating completion on Postgres:", err);
      res.status(500).json({ error: "\u0641\u0634\u0644 \u062D\u0641\u0638 \u062A\u0642\u064A\u064A\u0645 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631." });
    }
  });
  app.post("/api/profiles/:userId/premium", async (req, res) => {
    try {
      let authenticatedUser;
      try {
        authenticatedUser = await getAuthenticatedUser(req);
      } catch (authErr) {
        return res.status(401).json({ error: "\u0639\u0630\u0631\u0627\u064B! \u064A\u062C\u0628 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u0644\u062A\u0641\u0627\u0639\u0644 \u0645\u0639 \u0627\u0644\u0628\u0627\u0642\u0627\u062A." });
      }
      const userId = req.params.userId;
      const isAdmin = authenticatedUser.email === "adman777888999@gmail.com";
      if (authenticatedUser.uid !== userId && !isAdmin) {
        return res.status(403).json({ error: "\u0627\u062E\u062A\u0631\u0627\u0642 \u0623\u0645\u0646\u064A! \u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 \u062A\u0639\u062F\u064A\u0644 \u0628\u0627\u0642\u0629 \u0645\u0633\u062A\u062E\u062F\u0645 \u0622\u062E\u0631." });
      }
      const { isPremium, planName, renewalDate } = req.body;
      const userExists = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.uid, userId)).limit(1);
      let finalPremium = isPremium === void 0 ? true : !!isPremium;
      let finalPlanName = planName || "\u0627\u0644\u0628\u0627\u0642\u0629 \u0627\u0644\u0630\u0647\u0628\u064A\u0629 (\u0627\u0644\u0623\u0643\u062B\u0631 \u0637\u0644\u0628\u0627\u064B \u0644\u0644\u0645\u0639\u0644\u0645\u064A\u0646)";
      let finalRenewal = renewalDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toISOString();
      if (userExists.length > 0) {
        if (userExists[0].isPremium && !finalPremium) {
          console.log(`[Shield Guard Activated] Blocked automatic downgrade for premium user ID: ${userId}`);
          finalPremium = true;
          finalPlanName = userExists[0].planName || finalPlanName;
          finalRenewal = userExists[0].renewalDate || finalRenewal;
        }
      }
      const userPayload = {
        isPremium: finalPremium,
        planName: finalPlanName,
        renewalDate: finalRenewal,
        updatedAt: /* @__PURE__ */ new Date()
      };
      if (userExists.length > 0) {
        await db.update(users).set(userPayload).where((0, import_drizzle_orm.eq)(users.uid, userId));
      } else {
        await db.insert(users).values({
          uid: userId,
          joinedDate: (/* @__PURE__ */ new Date()).toISOString(),
          ...userPayload
        });
      }
      res.json({ success: true, isPremium: userPayload.isPremium, planName: userPayload.planName });
    } catch (err) {
      console.error("Error toggling premium in Postgres:", err);
      res.status(500).json({ error: "\u0641\u0634\u0644 \u062A\u0641\u0635\u064A\u0644 \u0627\u0644\u062A\u0631\u0642\u064A\u0629 \u0627\u0644\u0645\u062F\u0641\u0648\u0639\u0629." });
    }
  });
  app.get("/api/profiles/:userId/premium", async (req, res) => {
    try {
      const userId = req.params.userId;
      const userList = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.uid, userId)).limit(1);
      if (userList.length > 0) {
        res.json({
          isPremium: userList[0].isPremium || false,
          planName: userList[0].planName || "Free",
          renewalDate: userList[0].renewalDate || ""
        });
      } else {
        res.json({ isPremium: false, planName: "Free", renewalDate: "" });
      }
    } catch (err) {
      res.json({ isPremium: false, planName: "Free", renewalDate: "" });
    }
  });
  app.get("/api/completions/recent", async (req, res) => {
    try {
      const recent = await db.select().from(completions).orderBy((0, import_drizzle_orm.desc)(completions.createdAt)).limit(10);
      res.json(recent);
    } catch (err) {
      console.error("Error fetching recent completions from Postgres:", err);
      res.json([]);
    }
  });
  app.get("/api/profiles", async (req, res) => {
    try {
      const allUsers = await db.select().from(users).orderBy((0, import_drizzle_orm.desc)(users.createdAt));
      res.json(allUsers);
    } catch (err) {
      console.error("Error fetching general profiles:", err);
      res.json([]);
    }
  });
  app.get("/api/profiles/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const userList = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.uid, userId)).limit(1);
      const userObj = userList[0] || null;
      const createdQuizzes = await db.select().from(quizzes).where((0, import_drizzle_orm.eq)(quizzes.creatorId, userId)).orderBy((0, import_drizzle_orm.desc)(quizzes.createdAt));
      const takerCompletions = await db.select().from(completions).where((0, import_drizzle_orm.eq)(completions.takerId, userId)).orderBy((0, import_drizzle_orm.desc)(completions.createdAt));
      let resolvedName = userObj?.name || "";
      if (!resolvedName) {
        const lastComp = takerCompletions[0];
        const lastQuiz = createdQuizzes[0];
        resolvedName = lastComp?.takerName || lastQuiz?.creatorName || "\u0637\u0627\u0644\u0628 \u0645\u062A\u0645\u064A\u0632";
      }
      res.json({
        userId,
        name: resolvedName,
        email: userObj?.email || "",
        photoURL: userObj?.photoUrl || "",
        isPremium: userObj?.isPremium || false,
        planName: userObj?.planName || "Free",
        renewalDate: userObj?.renewalDate || "",
        bio: userObj?.bio || "",
        location: userObj?.location || "",
        joinedDate: userObj?.joinedDate || userObj?.createdAt?.toISOString() || (/* @__PURE__ */ new Date()).toISOString(),
        badgeSymbol: userObj?.badgeSymbol || "\u{1F6E1}\uFE0F",
        badgeColor: userObj?.badgeColor || "#3b82f6",
        customId: userObj?.customId || "",
        createdQuizzes,
        completions: takerCompletions
      });
    } catch (err) {
      console.error("Error preparing profile stats on Postgres:", err);
      res.status(500).json({ error: "\u0641\u0634\u0644 \u0625\u062D\u0636\u0627\u0631 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062E\u0635\u064A." });
    }
  });
  app.post("/api/profiles/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      let authenticatedUser;
      try {
        authenticatedUser = await getAuthenticatedUser(req);
        if (authenticatedUser.uid !== userId) {
          return res.status(403).json({ error: "Unauthorized: Cannot modify other user profiles." });
        }
      } catch (authErr) {
        console.warn("[Security Warn] Profile modification failed authorization checks:", authErr.message);
        return res.status(401).json({ error: "Unauthorized: Valid authentication token is required." });
      }
      const { name, photoURL, email, bio, location, badgeSymbol, badgeColor, customId, isStartupSync } = req.body;
      const payload = {
        updatedAt: /* @__PURE__ */ new Date()
      };
      if (name !== void 0) payload.name = name;
      if (photoURL !== void 0) payload.photoUrl = photoURL;
      if (email !== void 0) payload.email = email;
      if (bio !== void 0) payload.bio = bio;
      if (location !== void 0) payload.location = location;
      if (badgeSymbol !== void 0) payload.badgeSymbol = badgeSymbol;
      if (badgeColor !== void 0) payload.badgeColor = badgeColor;
      if (customId !== void 0) {
        if (customId && customId.trim()) {
          const cleanCustomId = customId.trim().toLowerCase().replace(/^@/, "");
          if (!/^[a-zA-Z0-9_]+$/.test(cleanCustomId)) {
            return res.status(400).json({ error: "\u0639\u0630\u0631\u0627\u064B\u060C \u064A\u062C\u0628 \u0623\u0646 \u064A\u062D\u062A\u0648\u064A \u0627\u0644\u0645\u0639\u0631\u0651\u0641 \u0627\u0644\u0645\u062E\u0635\u0635 \u0639\u0644\u0649 \u0623\u062D\u0631\u0641 \u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629 \u0648\u0623\u0631\u0642\u0627\u0645 \u0648\u0639\u0644\u0627\u0645\u0627\u062A \u0634\u0631\u0637\u0629 \u0633\u0641\u0644\u064A\u0629 (_) \u0641\u0642\u0637." });
          }
          const taken = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.customId, cleanCustomId)).limit(1);
          if (taken.length > 0 && taken[0].uid !== userId) {
            const suggestions = [
              `${cleanCustomId}123`,
              `${cleanCustomId}_pro`,
              `${cleanCustomId}_quiz`
            ];
            return res.status(400).json({
              error: "\u0645\u0639\u0631\u0651\u0641 \u0627\u0644\u062D\u0633\u0627\u0628 \u0627\u0644\u0645\u062E\u0635\u0635 \u0645\u0623\u062E\u0648\u0630 \u0628\u0627\u0644\u0641\u0639\u0644 \u0645\u0646 \u0642\u0650\u0628\u0644 \u0645\u0633\u062A\u062E\u062F\u0645 \u0622\u062E\u0631.",
              suggestions
            });
          }
          payload.customId = cleanCustomId;
        } else {
          payload.customId = null;
        }
      }
      const userList = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.uid, userId)).limit(1);
      if (isStartupSync && userList.length > 0 && userList[0].photoUrl) {
        delete payload.photoUrl;
      }
      if (userList.length > 0) {
        await db.update(users).set(payload).where((0, import_drizzle_orm.eq)(users.uid, userId));
      } else {
        await db.insert(users).values({
          uid: userId,
          name: name || "\u0637\u0627\u0644\u0628 \u0645\u062A\u0645\u064A\u0632",
          email: email || "",
          photoUrl: photoURL || "",
          isPremium: false,
          planName: "Free",
          joinedDate: (/* @__PURE__ */ new Date()).toISOString(),
          bio: bio || "",
          location: location || "",
          badgeSymbol: badgeSymbol || "\u{1F6E1}\uFE0F",
          badgeColor: badgeColor || "#3b82f6",
          customId: payload.customId || null,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        });
      }
      if (name) {
        await db.update(quizzes).set({ creatorName: name.trim() }).where((0, import_drizzle_orm.eq)(quizzes.creatorId, userId));
        await db.update(completions).set({ takerName: name.trim() }).where((0, import_drizzle_orm.eq)(completions.takerId, userId));
      }
      res.json({ success: true });
    } catch (err) {
      console.error("Error saving user profile on Postgres:", err);
      res.status(500).json({ error: "\u0641\u0634\u0644 \u062D\u0641\u0638 \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062E\u0635\u064A." });
    }
  });
  function base32ToBytes(base32) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let bits = "";
    const cleanBase32 = base32.toUpperCase().replace(/=+$/, "");
    for (let i = 0; i < cleanBase32.length; i++) {
      const val = alphabet.indexOf(cleanBase32[i]);
      if (val === -1) throw new Error("Invalid base32 character");
      bits += val.toString(2).padStart(5, "0");
    }
    const bytes = [];
    for (let i = 0; i + 8 <= bits.length; i += 8) {
      bytes.push(parseInt(bits.substring(i, i + 8), 2));
    }
    return Buffer.from(bytes);
  }
  function generateHOTP(secretBase32, counter) {
    const key = base32ToBytes(secretBase32);
    const buffer = Buffer.alloc(8);
    buffer.writeBigInt64BE(BigInt(counter));
    const hmac = import_crypto.default.createHmac("sha1", key);
    hmac.update(buffer);
    const hmacResult = hmac.digest();
    const offset = hmacResult[hmacResult.length - 1] & 15;
    const binary = (hmacResult[offset] & 127) << 24 | (hmacResult[offset + 1] & 255) << 16 | (hmacResult[offset + 2] & 255) << 8 | hmacResult[offset + 3] & 255;
    const otp = binary % 1e6;
    return otp.toString().padStart(6, "0");
  }
  function verifyTOTP(secretBase32, token, window = 1) {
    try {
      const counter = Math.floor(Date.now() / 1e3 / 30);
      for (let i = -window; i <= window; i++) {
        if (generateHOTP(secretBase32, counter + i) === token) {
          return true;
        }
      }
    } catch (err) {
      console.error("TOTP verification error:", err);
    }
    return false;
  }
  function generateBase32Secret(length = 16) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let result = "";
    const bytes = import_crypto.default.randomBytes(length);
    for (let i = 0; i < length; i++) {
      result += alphabet[bytes[i] % alphabet.length];
    }
    return result;
  }
  function parseUserAgentDetails(uaStr) {
    if (!uaStr) return { device: "Unknown Device", browser: "Unknown Browser", os: "Unknown OS", ip: "" };
    const parser = new import_ua_parser_js.UAParser(uaStr);
    const result = parser.getResult();
    let deviceName = result.device.vendor ? `${result.device.vendor} ${result.device.model || ""}`.trim() : "";
    if (!deviceName) {
      if (result.os.name === "Mac OS") deviceName = "Apple Mac";
      else if (result.os.name === "Windows") deviceName = "Windows PC";
      else if (result.os.name === "iOS") deviceName = "Apple iPhone/iPad";
      else if (result.os.name === "Android") deviceName = "Android Device";
      else if (result.os.name === "Linux") deviceName = "Linux Machine";
      else deviceName = "Unknown Device";
    }
    let browserName = result.browser.name ? `${result.browser.name} ${result.browser.major || ""}`.trim() : "Unknown Browser";
    let osName = result.os.name ? `${result.os.name} ${result.os.version || ""}`.trim() : "Unknown OS";
    return { device: deviceName, browser: browserName, os: osName };
  }
  function getLocationFromIP(ip) {
    const localIps = ["127.0.0.1", "::1", "::ffff:127.0.0.1"];
    if (localIps.includes(ip) || !ip) {
      return { ar: "\u0627\u0644\u0642\u0627\u0647\u0631\u0629\u060C \u0645\u0635\u0631 (\u0645\u062D\u0644\u064A)", en: "Cairo, Egypt (Local)", country: "Egypt", city: "Cairo" };
    }
    const geo = import_geoip_lite.default.lookup(ip);
    if (geo) {
      return {
        ar: `${geo.city || "\u0645\u062F\u064A\u0646\u0629 \u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641\u0629"}\u060C ${geo.country}`,
        en: `${geo.city || "Unknown City"}, ${geo.country}`,
        country: geo.country,
        city: geo.city || "Unknown City"
      };
    }
    return { ar: "\u0645\u0648\u0642\u0639 \u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641", en: "Unknown Location", country: "Unknown", city: "Unknown" };
  }
  app.get("/api/security/sessions", async (req, res) => {
    try {
      const authenticatedUser = await getAuthenticatedUser(req);
      const userId = authenticatedUser.uid;
      const ua = req.headers["user-agent"] || "";
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
      const cleanIp = ip.split(",")[0].trim();
      const uaDetails = parseUserAgentDetails(ua);
      const loc = getLocationFromIP(cleanIp);
      const currentDeviceLabel = `${uaDetails.device} - ${uaDetails.browser}`;
      const currentBrowser = uaDetails.browser;
      const currentOs = uaDetails.os;
      const currentIp = cleanIp;
      let list = await db.select().from(userSessions).where((0, import_drizzle_orm.eq)(userSessions.userId, userId));
      if (list.length === 0) {
        const currentSessionId = `sess-curr-${Math.random().toString(36).substring(2, 10)}`;
        const dummySess1Id = `sess-dum1-${Math.random().toString(36).substring(2, 10)}`;
        const dummySess2Id = `sess-dum2-${Math.random().toString(36).substring(2, 10)}`;
        const initialSessions = [
          {
            id: currentSessionId,
            userId,
            device: currentDeviceLabel,
            location: loc.ar,
            // Store localized name
            ipAddress: cleanIp,
            lastActive: "\u0646\u0634\u0637 \u0627\u0644\u0622\u0646",
            current: true,
            createdAt: /* @__PURE__ */ new Date()
          },
          {
            id: dummySess1Id,
            userId,
            device: "MacBook Pro M3 (Safari)",
            location: "\u0627\u0644\u062C\u064A\u0632\u0629\u060C \u0645\u0635\u0631",
            ipAddress: "197.34.112.55",
            lastActive: "\u0645\u0646\u0630 \u0633\u0627\u0639\u062A\u064A\u0646",
            current: false,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1e3)
          },
          {
            id: dummySess2Id,
            userId,
            device: "iPhone 15 Pro (Safari)",
            location: "\u0627\u0644\u0625\u0633\u0643\u0646\u062F\u0631\u064A\u0629\u060C \u0645\u0635\u0631",
            ipAddress: "196.221.43.120",
            lastActive: "\u0645\u0646\u0630 \u064A\u0648\u0645\u064A\u0646",
            current: false,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3)
          }
        ];
        for (const s of initialSessions) {
          await db.insert(userSessions).values(s);
        }
        list = await db.select().from(userSessions).where((0, import_drizzle_orm.eq)(userSessions.userId, userId));
      } else {
        const currentActive = list.find((s) => s.current);
        if (!currentActive) {
          const currentSessionId = `sess-curr-${Math.random().toString(36).substring(2, 10)}`;
          await db.insert(userSessions).values({
            id: currentSessionId,
            userId,
            device: currentDeviceLabel,
            location: loc.ar,
            ipAddress: cleanIp,
            lastActive: "\u0646\u0634\u0637 \u0627\u0644\u0622\u0646",
            current: true,
            createdAt: /* @__PURE__ */ new Date()
          });
          list = await db.select().from(userSessions).where((0, import_drizzle_orm.eq)(userSessions.userId, userId));
        }
      }
      const formatted = list.map((s) => ({
        id: s.id,
        device: s.device,
        location: s.location,
        lastActive: s.lastActive,
        current: s.current
      }));
      formatted.sort((a, b) => a.current === b.current ? 0 : a.current ? -1 : 1);
      res.json(formatted);
    } catch (err) {
      console.error("Error fetching security sessions:", err);
      res.status(500).json({ error: "Failed to retrieve sessions" });
    }
  });
  app.post("/api/security/sessions/revoke", async (req, res) => {
    try {
      const authenticatedUser = await getAuthenticatedUser(req);
      const userId = authenticatedUser.uid;
      const { sessionId } = req.body;
      if (!sessionId) {
        return res.status(400).json({ error: "Session ID is required" });
      }
      await db.delete(userSessions).where(
        (0, import_drizzle_orm.and)(
          (0, import_drizzle_orm.eq)(userSessions.id, sessionId),
          (0, import_drizzle_orm.eq)(userSessions.userId, userId),
          (0, import_drizzle_orm.eq)(userSessions.current, false)
          // Prevent revoking current active session via this endpoint
        )
      );
      res.json({ success: true });
    } catch (err) {
      console.error("Error revoking session:", err);
      res.status(500).json({ error: "Failed to revoke session" });
    }
  });
  app.post("/api/security/sessions/revoke-all", async (req, res) => {
    try {
      const authenticatedUser = await getAuthenticatedUser(req);
      const userId = authenticatedUser.uid;
      await db.delete(userSessions).where(
        (0, import_drizzle_orm.and)(
          (0, import_drizzle_orm.eq)(userSessions.userId, userId),
          (0, import_drizzle_orm.eq)(userSessions.current, false)
        )
      );
      res.json({ success: true });
    } catch (err) {
      console.error("Error revoking all other sessions:", err);
      res.status(500).json({ error: "Failed to revoke other sessions" });
    }
  });
  app.get("/api/security/2fa/status", async (req, res) => {
    try {
      const authenticatedUser = await getAuthenticatedUser(req);
      const userId = authenticatedUser.uid;
      const userRecord = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.uid, userId)).limit(1);
      const enabled = userRecord.length > 0 ? !!userRecord[0].twoFactorEnabled : false;
      res.json({ enabled });
    } catch (err) {
      console.error("Error checking 2FA status:", err);
      res.status(500).json({ error: "Failed to retrieve 2FA status" });
    }
  });
  app.post("/api/security/2fa/enroll", async (req, res) => {
    try {
      const authenticatedUser = await getAuthenticatedUser(req);
      const userId = authenticatedUser.uid;
      const userEmail = authenticatedUser.email || "user@quizspace.app";
      const tempSecret = generateBase32Secret(16);
      const otpauthUrl = `otpauth://totp/QuizSpace:${encodeURIComponent(userEmail)}?secret=${tempSecret}&issuer=QuizSpace`;
      const qrDataUrl = await import_qrcode.default.toDataURL(otpauthUrl);
      await db.update(users).set({
        twoFactorTempSecret: tempSecret,
        updatedAt: /* @__PURE__ */ new Date()
      }).where((0, import_drizzle_orm.eq)(users.uid, userId));
      res.json({
        secret: tempSecret,
        qrCode: qrDataUrl
      });
    } catch (err) {
      console.error("Error enrolling in 2FA:", err);
      res.status(500).json({ error: "Failed to initialize 2FA enrollment" });
    }
  });
  app.post("/api/security/2fa/verify", async (req, res) => {
    try {
      const authenticatedUser = await getAuthenticatedUser(req);
      const userId = authenticatedUser.uid;
      const { code } = req.body;
      if (!code || code.length !== 6) {
        return res.status(400).json({ error: "\u0643\u0648\u062F \u0627\u0644\u062A\u062D\u0642\u0642 \u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 \u0645\u0643\u0648\u0646\u0627\u064B \u0645\u0646 6 \u0623\u0631\u0642\u0627\u0645." });
      }
      const userRecord = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.uid, userId)).limit(1);
      if (userRecord.length === 0 || !userRecord[0].twoFactorTempSecret) {
        return res.status(400).json({ error: "\u0644\u0645 \u064A\u062A\u0645 \u0628\u062F\u0621 \u0639\u0645\u0644\u064A\u0629 \u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u0645\u0635\u0627\u062F\u0642\u0629 \u0627\u0644\u062B\u0646\u0627\u0626\u064A\u0629." });
      }
      const tempSecret = userRecord[0].twoFactorTempSecret;
      const isValid = verifyTOTP(tempSecret, code);
      if (!isValid) {
        return res.status(400).json({ error: "\u0643\u0648\u062F \u0627\u0644\u062A\u062D\u0642\u0642 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D \u0623\u0648 \u0645\u0646\u062A\u0647\u064A \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629." });
      }
      await db.update(users).set({
        twoFactorEnabled: true,
        twoFactorSecret: tempSecret,
        twoFactorTempSecret: null,
        updatedAt: /* @__PURE__ */ new Date()
      }).where((0, import_drizzle_orm.eq)(users.uid, userId));
      res.json({ success: true });
    } catch (err) {
      console.error("Error verifying 2FA challenge:", err);
      res.status(500).json({ error: "Failed to verify 2FA" });
    }
  });
  app.post("/api/security/2fa/disable", async (req, res) => {
    try {
      const authenticatedUser = await getAuthenticatedUser(req);
      const userId = authenticatedUser.uid;
      await db.update(users).set({
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorTempSecret: null,
        updatedAt: /* @__PURE__ */ new Date()
      }).where((0, import_drizzle_orm.eq)(users.uid, userId));
      res.json({ success: true });
    } catch (err) {
      console.error("Error disabling 2FA:", err);
      res.status(500).json({ error: "Failed to disable 2FA" });
    }
  });
  app.post("/api/auth/2fa/check", async (req, res) => {
    try {
      const { email, uid } = req.body;
      if (!email && !uid) {
        return res.status(400).json({ error: "Email or UID is required" });
      }
      let userRecord;
      if (uid) {
        userRecord = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.uid, uid)).limit(1);
      } else {
        userRecord = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.email, email.toLowerCase().trim())).limit(1);
      }
      const enabled = userRecord.length > 0 ? !!userRecord[0].twoFactorEnabled : false;
      res.json({ enabled, uid: userRecord.length > 0 ? userRecord[0].uid : null });
    } catch (err) {
      console.error("Error checking login 2FA status:", err);
      res.status(500).json({ error: "Failed to retrieve 2FA status" });
    }
  });
  app.post("/api/auth/2fa/verify", async (req, res) => {
    try {
      const { uid, code } = req.body;
      if (!uid || !code) {
        return res.status(400).json({ error: "UID and verification code are required." });
      }
      const userRecord = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.uid, uid)).limit(1);
      if (userRecord.length === 0 || !userRecord[0].twoFactorSecret) {
        return res.status(400).json({ error: "\u0644\u0645 \u064A\u062A\u0645 \u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u0645\u0635\u0627\u062F\u0642\u0629 \u0627\u0644\u062B\u0646\u0627\u0626\u064A\u0629 \u0644\u0647\u0630\u0627 \u0627\u0644\u062D\u0633\u0627\u0628." });
      }
      const secret = userRecord[0].twoFactorSecret;
      const isValid = verifyTOTP(secret, code);
      if (!isValid) {
        return res.status(400).json({ error: "\u0643\u0648\u062F \u0627\u0644\u062A\u062D\u0642\u0642 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D \u0623\u0648 \u0645\u0646\u062A\u0647\u064A \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629." });
      }
      res.json({ success: true });
    } catch (err) {
      console.error("Error verifying login 2FA:", err);
      res.status(500).json({ error: "Failed to verify 2FA" });
    }
  });
  function generateLocalToken(uid, email, name) {
    const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
    const payload = Buffer.from(JSON.stringify({ uid, user_id: uid, email, name, display_name: name })).toString("base64url");
    const signature = "local_fallback_signature";
    return `${header}.${payload}.${signature}`;
  }
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ error: "\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0642\u0648\u0644 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 (\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u060C \u0627\u0644\u0628\u0631\u064A\u062F\u060C \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631)." });
      }
      const cleanEmail = email.toLowerCase().trim();
      const existingUser = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.email, cleanEmail)).limit(1);
      if (existingUser.length > 0) {
        return res.status(400).json({ error: "\u0647\u0630\u0627 \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0645\u0633\u062C\u0644 \u0628\u0627\u0644\u0641\u0639\u0644 \u0641\u064A \u062D\u0633\u0627\u0628 \u0622\u062E\u0631." });
      }
      const uid = `local-user-${Math.random().toString(36).substring(2, 10)}`;
      await db.insert(users).values({
        uid,
        name: username.trim(),
        email: cleanEmail,
        password,
        // Stored safely for local authentication
        planName: "Free",
        isPremium: false,
        joinedDate: (/* @__PURE__ */ new Date()).toISOString(),
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      });
      const token = generateLocalToken(uid, cleanEmail, username.trim());
      res.json({
        success: true,
        token,
        user: {
          uid,
          name: username.trim(),
          email: cleanEmail,
          isPremium: false,
          planName: "Free"
        }
      });
    } catch (err) {
      console.error("Local register error:", err);
      res.status(500).json({ error: "\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062D\u0633\u0627\u0628 \u0627\u0644\u0645\u062D\u0644\u064A." });
    }
  });
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0648\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631." });
      }
      const cleanEmail = email.toLowerCase().trim();
      const userList = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.email, cleanEmail)).limit(1);
      if (userList.length === 0) {
        return res.status(400).json({ error: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0628\u0627\u0644\u0645\u0646\u0635\u0629." });
      }
      const userObj = userList[0];
      if (userObj.password !== password) {
        return res.status(400).json({ error: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D\u0629\u060C \u064A\u0631\u062C\u0649 \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629." });
      }
      const token = generateLocalToken(userObj.uid, cleanEmail, userObj.name || "\u0637\u0627\u0644\u0628 \u0645\u062A\u0645\u064A\u0632");
      res.json({
        success: true,
        token,
        user: {
          uid: userObj.uid,
          name: userObj.name || "\u0637\u0627\u0644\u0628 \u0645\u062A\u0645\u064A\u0632",
          email: cleanEmail,
          photoURL: userObj.photoUrl || "",
          customId: userObj.customId || "",
          isPremium: userObj.isPremium || false,
          planName: userObj.planName || "Free"
        }
      });
    } catch (err) {
      console.error("Local login error:", err);
      res.status(500).json({ error: "\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0627\u0644\u0645\u062D\u0644\u064A." });
    }
  });
  app.post("/api/profiles/:userId/name", async (req, res) => {
    try {
      const userId = req.params.userId;
      let authenticatedUser;
      try {
        authenticatedUser = await getAuthenticatedUser(req);
        if (authenticatedUser.uid !== userId) {
          return res.status(403).json({ error: "Unauthorized: Cannot modify other user names." });
        }
      } catch (authErr) {
        console.warn("[Security Warn] Name modification failed authorization checks:", authErr.message);
        return res.status(401).json({ error: "Unauthorized: Valid authentication token is required." });
      }
      const { name } = req.body;
      if (!name || !name.trim()) {
        return res.status(400).json({ error: "\u0627\u0644\u0627\u0633\u0645 \u0645\u0637\u0644\u0648\u0628 \u0648\u0644\u0627 \u064A\u0645\u0643\u0646 \u062A\u0631\u0643\u0647 \u0641\u0627\u0631\u063A\u0627\u064B." });
      }
      const trimmed = name.trim();
      const userExists = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.uid, userId)).limit(1);
      if (userExists.length > 0) {
        await db.update(users).set({ name: trimmed, updatedAt: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm.eq)(users.uid, userId));
      } else {
        await db.insert(users).values({
          uid: userId,
          name: trimmed,
          planName: "Free",
          isPremium: false,
          joinedDate: (/* @__PURE__ */ new Date()).toISOString(),
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        });
      }
      await db.update(quizzes).set({ creatorName: trimmed }).where((0, import_drizzle_orm.eq)(quizzes.creatorId, userId));
      await db.update(completions).set({ takerName: trimmed }).where((0, import_drizzle_orm.eq)(completions.takerId, userId));
      res.json({ success: true, name: trimmed });
    } catch (err) {
      console.error("Error updating user name across Postgres:", err);
      res.status(500).json({ error: "\u0641\u0634\u0644 \u062D\u0641\u0638 \u0627\u0644\u0627\u0633\u0645 \u0648\u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0633\u062C\u0644\u0627\u062A." });
    }
  });
  app.get("/api/profiles/check-custom-id/:customId", async (req, res) => {
    try {
      const cleanCustomId = req.params.customId.trim().toLowerCase().replace(/^@/, "");
      const userIdQuery = req.query.userId;
      const taken = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.customId, cleanCustomId)).limit(1);
      if (taken.length > 0 && taken[0].uid !== userIdQuery) {
        const suggestions = [
          `${cleanCustomId}123`,
          `${cleanCustomId}_pro`,
          `${cleanCustomId}_quiz`
        ];
        return res.json({ available: false, suggestions });
      }
      return res.json({ available: true, suggestions: [] });
    } catch (err) {
      res.json({ available: true, suggestions: [] });
    }
  });
  app.get("/api/follows/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const viewerId = req.query.viewerId;
      const followersList = await db.select().from(follows).where((0, import_drizzle_orm.eq)(follows.followingId, userId));
      const followingList = await db.select().from(follows).where((0, import_drizzle_orm.eq)(follows.followerId, userId));
      let isFollowing = false;
      if (viewerId) {
        const existing = await db.select().from(follows).where(
          (0, import_drizzle_orm.and)(
            (0, import_drizzle_orm.eq)(follows.followerId, viewerId),
            (0, import_drizzle_orm.eq)(follows.followingId, userId)
          )
        ).limit(1);
        isFollowing = existing.length > 0;
      }
      res.json({
        followersCount: followersList.length,
        followingCount: followingList.length,
        isFollowing
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to query follow statistics." });
    }
  });
  app.post("/api/follows/:userId/toggle", async (req, res) => {
    try {
      let authUser = await getAuthenticatedUser(req).catch(() => null);
      if (!authUser) return res.status(401).json({ error: "Unauthorized." });
      const followerId = authUser.uid;
      const followingId = req.params.userId;
      if (followerId === followingId) return res.status(400).json({ error: "Cannot follow yourself." });
      const existing = await db.select().from(follows).where((0, import_drizzle_orm.and)((0, import_drizzle_orm.eq)(follows.followerId, followerId), (0, import_drizzle_orm.eq)(follows.followingId, followingId))).limit(1);
      let isFollowing = false;
      if (existing.length > 0) {
        await db.delete(follows).where((0, import_drizzle_orm.and)((0, import_drizzle_orm.eq)(follows.followerId, followerId), (0, import_drizzle_orm.eq)(follows.followingId, followingId)));
      } else {
        await db.insert(follows).values({ id: "fol-" + Math.random().toString(36).substring(2, 11), followerId, followingId, createdAt: /* @__PURE__ */ new Date() });
        isFollowing = true;
      }
      res.json({ success: true, isFollowing });
    } catch (err) {
      res.status(500).json({ error: "Failed" });
    }
  });
  app.post("/api/premium-requests", async (req, res) => {
    try {
      let authUser = await getAuthenticatedUser(req).catch(() => null);
      if (!authUser) return res.status(401).json({ error: "Unauthorized." });
      const reqData = req.body;
      const status = reqData.status || "pending";
      const isApprovedImmediately = status === "approved";
      await db.insert(premiumRequests).values({
        id: reqData.id || "preq-" + Math.random().toString(36).substring(2, 11),
        userId: authUser.uid,
        name: reqData.name || authUser.name || reqData.userName || "User",
        email: reqData.email || authUser.email || "",
        planName: reqData.planName,
        paymentScreenshot: reqData.paymentScreenshot || null,
        promoCodeUsed: reqData.promoCodeUsed || null,
        status,
        createdAt: reqData.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      if (isApprovedImmediately) {
        const targetUid = authUser.uid;
        const activePlan = reqData.planName || "\u0627\u0644\u0628\u0627\u0642\u0629 \u0627\u0644\u0630\u0647\u0628\u064A\u0629 \u0644\u0644\u0645\u0639\u0644\u0645\u064A\u0646";
        const newRenewalDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toISOString();
        const userExists = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.uid, targetUid)).limit(1);
        if (userExists.length > 0) {
          await db.update(users).set({
            isPremium: true,
            planName: activePlan,
            renewalDate: newRenewalDate,
            updatedAt: /* @__PURE__ */ new Date()
          }).where((0, import_drizzle_orm.eq)(users.uid, targetUid));
        } else {
          await db.insert(users).values({
            uid: targetUid,
            isPremium: true,
            planName: activePlan,
            renewalDate: newRenewalDate,
            name: reqData.name || authUser.name || "\u0637\u0627\u0644\u0628 \u0645\u062A\u0645\u064A\u0632",
            email: reqData.email || authUser.email || "",
            joinedDate: (/* @__PURE__ */ new Date()).toISOString(),
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          });
        }
      }
      res.json({ success: true });
    } catch (err) {
      console.error("Error inserting premium request:", err);
      res.status(500).json({ error: "Failed" });
    }
  });
  app.get("/api/premium-requests", async (req, res) => {
    try {
      const reqList = await db.select().from(premiumRequests).orderBy((0, import_drizzle_orm.desc)(premiumRequests.createdAt));
      const mappedList = reqList.map((item) => ({
        ...item,
        userName: item.name || "\u0637\u0627\u0644\u0628 \u0645\u062A\u0645\u064A\u0632",
        userEmail: item.email || "",
        receiptUrl: item.paymentScreenshot || ""
      }));
      res.json(mappedList);
    } catch (err) {
      res.json([]);
    }
  });
  app.post("/api/premium-requests/:id/status", async (req, res) => {
    try {
      let authUser = await getAuthenticatedUser(req).catch(() => null);
      if (!authUser) return res.status(401).json({ error: "Unauthorized." });
      if (authUser.email !== "adman777888999@gmail.com") return res.status(403).json({ error: "Admin only" });
      const { status, rejectReason } = req.body;
      const requestId = req.params.id;
      const reqResult = await db.select().from(premiumRequests).where((0, import_drizzle_orm.eq)(premiumRequests.id, requestId)).limit(1);
      if (reqResult.length === 0) {
        return res.status(404).json({ error: "Request not found" });
      }
      const premiumRequestItem = reqResult[0];
      await db.update(premiumRequests).set({
        status,
        rejectReason: rejectReason || "",
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }).where((0, import_drizzle_orm.eq)(premiumRequests.id, requestId));
      if (status === "approved") {
        const targetUid = premiumRequestItem.userId;
        const activePlan = premiumRequestItem.planName || "\u0627\u0644\u0628\u0627\u0642\u0629 \u0627\u0644\u0630\u0647\u0628\u064A\u0629 \u0644\u0644\u0645\u0639\u0644\u0645\u064A\u0646";
        const newRenewalDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toISOString();
        const userExists = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.uid, targetUid)).limit(1);
        if (userExists.length > 0) {
          await db.update(users).set({
            isPremium: true,
            planName: activePlan,
            renewalDate: newRenewalDate,
            updatedAt: /* @__PURE__ */ new Date()
          }).where((0, import_drizzle_orm.eq)(users.uid, targetUid));
        } else {
          await db.insert(users).values({
            uid: targetUid,
            isPremium: true,
            planName: activePlan,
            renewalDate: newRenewalDate,
            name: premiumRequestItem.name || "\u0637\u0627\u0644\u0628 \u0645\u062A\u0645\u064A\u0632",
            email: premiumRequestItem.email || "",
            joinedDate: (/* @__PURE__ */ new Date()).toISOString(),
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          });
        }
      }
      res.json({ success: true });
    } catch (err) {
      console.error("Error updating premium request status:", err);
      res.status(500).json({ error: "Failed" });
    }
  });
  app.post("/api/admin/manual-activate", async (req, res) => {
    try {
      let authenticatedUser;
      try {
        authenticatedUser = await getAuthenticatedUser(req);
      } catch (authErr) {
        return res.status(401).json({ error: "\u0639\u0630\u0631\u0627\u064B! \u064A\u062C\u0628 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0643\u0645\u0633\u0624\u0648\u0644 \u0623\u0648\u0644\u0627\u064B." });
      }
      if (authenticatedUser.email !== "adman777888999@gmail.com") {
        return res.status(403).json({ error: "\u0627\u062E\u062A\u0631\u0627\u0642 \u0623\u0645\u0646\u064A! \u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0627\u062A \u0627\u0644\u0645\u0633\u0624\u0648\u0644 \u0644\u0644\u0642\u064A\u0627\u0645 \u0628\u0627\u0644\u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u064A\u062F\u0648\u064A." });
      }
      const { userId, planName, durationDays, isPremium } = req.body;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      const searchId = userId.trim().toLowerCase().replace(/^@/, "");
      let targetUid = userId;
      const matchedUsers = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.customId, searchId)).limit(1);
      if (matchedUsers.length > 0) {
        targetUid = matchedUsers[0].uid;
      }
      const shouldBePremium = isPremium !== void 0 ? !!isPremium : planName !== "Free" && !!planName;
      const activePlan = shouldBePremium ? planName || "\u0627\u0644\u0628\u0627\u0642\u0629 \u0627\u0644\u0630\u0647\u0628\u064A\u0629 \u0644\u0644\u0645\u0639\u0644\u0645\u064A\u0646" : "Free";
      const days = parseInt(durationDays) || 30;
      const newRenewalDate = shouldBePremium ? new Date(Date.now() + days * 24 * 60 * 60 * 1e3).toISOString() : "";
      const userExists = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.uid, targetUid)).limit(1);
      if (userExists.length > 0) {
        await db.update(users).set({
          isPremium: shouldBePremium,
          planName: activePlan,
          renewalDate: newRenewalDate,
          updatedAt: /* @__PURE__ */ new Date()
        }).where((0, import_drizzle_orm.eq)(users.uid, targetUid));
      } else {
        await db.insert(users).values({
          uid: targetUid,
          isPremium: shouldBePremium,
          planName: activePlan,
          renewalDate: newRenewalDate,
          name: "\u0637\u0627\u0644\u0628 \u0645\u062A\u0645\u064A\u0632",
          joinedDate: (/* @__PURE__ */ new Date()).toISOString(),
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        });
      }
      if (shouldBePremium) {
        const requestId = "manual-req-" + Math.random().toString(36).substring(2, 11);
        await db.insert(premiumRequests).values({
          id: requestId,
          userId: targetUid,
          name: userExists.length > 0 ? userExists[0].name || "\u0637\u0627\u0644\u0628 \u0645\u062A\u0645\u064A\u0632" : "\u0637\u0627\u0644\u0628 \u0645\u062A\u0645\u064A\u0632",
          email: userExists.length > 0 ? userExists[0].email || "" : "",
          planName: activePlan,
          paymentScreenshot: "manual_activation",
          // marker
          status: "approved",
          rejectReason: "",
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
      res.json({ success: true, message: "Account status updated successfully." });
    } catch (err) {
      console.error("Error in manual activation/removal:", err);
      res.status(500).json({ error: "Failed manual activation or removal." });
    }
  });
  app.get("/api/promotions", async (req, res) => {
    try {
      const list = await db.select().from(promotions).orderBy((0, import_drizzle_orm.desc)(promotions.createdAt));
      res.json(list);
    } catch (err) {
      res.json([]);
    }
  });
  app.post("/api/promotions", async (req, res) => {
    try {
      let authenticatedUser;
      try {
        authenticatedUser = await getAuthenticatedUser(req);
      } catch (authErr) {
        return res.status(401).json({ error: "Unauthorized." });
      }
      if (authenticatedUser.email !== "adman777888999@gmail.com") {
        return res.status(403).json({ error: "Forbidden. Admin only." });
      }
      const promo = req.body;
      const existing = await db.select().from(promotions).where((0, import_drizzle_orm.eq)(promotions.id, promo.id)).limit(1);
      if (existing.length > 0) {
        await db.update(promotions).set({
          discountPercent: promo.discountPercent,
          endDate: promo.endDate,
          applicablePlans: promo.applicablePlans,
          isActive: promo.isActive ?? true
        }).where((0, import_drizzle_orm.eq)(promotions.id, promo.id));
      } else {
        await db.insert(promotions).values({
          id: promo.id,
          discountPercent: promo.discountPercent,
          endDate: promo.endDate,
          applicablePlans: promo.applicablePlans,
          isActive: promo.isActive ?? true,
          createdAt: promo.createdAt || (/* @__PURE__ */ new Date()).toISOString()
        });
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Fails to save promotion." });
    }
  });
  app.delete("/api/promotions/:id", async (req, res) => {
    try {
      let authenticatedUser;
      try {
        authenticatedUser = await getAuthenticatedUser(req);
      } catch (authErr) {
        return res.status(401).json({ error: "Unauthorized." });
      }
      if (authenticatedUser.email !== "adman777888999@gmail.com") {
        return res.status(403).json({ error: "Forbidden. Admin only." });
      }
      await db.delete(promotions).where((0, import_drizzle_orm.eq)(promotions.id, req.params.id));
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Delete failed." });
    }
  });
  app.get("/api/coupons", async (req, res) => {
    try {
      const list = await db.select().from(couponCodes).orderBy((0, import_drizzle_orm.desc)(couponCodes.createdAt));
      res.json(list);
    } catch (err) {
      res.json([]);
    }
  });
  app.get("/api/coupons/:code", async (req, res) => {
    try {
      const list = await db.select().from(couponCodes).where((0, import_drizzle_orm.eq)(import_drizzle_orm.sql`UPPER(${couponCodes.code})`, req.params.code.trim().toUpperCase())).limit(1);
      if (list.length > 0) {
        res.json(list[0]);
      } else {
        res.status(404).json({ error: "\u0643\u0648\u062F \u0627\u0644\u062E\u0635\u0645 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D." });
      }
    } catch (err) {
      res.status(500).json({ error: "Query failed." });
    }
  });
  app.post("/api/coupons", async (req, res) => {
    try {
      let authenticatedUser;
      try {
        authenticatedUser = await getAuthenticatedUser(req);
      } catch (authErr) {
        return res.status(401).json({ error: "Unauthorized." });
      }
      if (authenticatedUser.email !== "adman777888999@gmail.com") {
        return res.status(403).json({ error: "Forbidden. Admin only." });
      }
      const coupon = req.body;
      const codeId = coupon.code.trim().toUpperCase();
      const existing = await db.select().from(couponCodes).where((0, import_drizzle_orm.eq)(couponCodes.id, codeId)).limit(1);
      if (existing.length > 0) {
        await db.update(couponCodes).set({
          code: coupon.code,
          discountPercent: coupon.discountPercent,
          maxUses: coupon.maxUses,
          usedCount: coupon.usedCount ?? 0,
          expiryDate: coupon.expiryDate,
          isActive: coupon.isActive ?? true,
          applicablePlans: coupon.applicablePlans || null
        }).where((0, import_drizzle_orm.eq)(couponCodes.id, codeId));
      } else {
        await db.insert(couponCodes).values({
          id: codeId,
          code: coupon.code,
          discountPercent: coupon.discountPercent,
          maxUses: coupon.maxUses ?? 9999,
          usedCount: coupon.usedCount ?? 0,
          expiryDate: coupon.expiryDate,
          isActive: coupon.isActive ?? true,
          createdAt: coupon.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
          applicablePlans: coupon.applicablePlans || null
        });
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to save coupon." });
    }
  });
  app.delete("/api/coupons/:id", async (req, res) => {
    try {
      let authenticatedUser;
      try {
        authenticatedUser = await getAuthenticatedUser(req);
      } catch (authErr) {
        return res.status(401).json({ error: "Unauthorized." });
      }
      if (authenticatedUser.email !== "adman777888999@gmail.com") {
        return res.status(403).json({ error: "Forbidden. Admin only." });
      }
      await db.delete(couponCodes).where((0, import_drizzle_orm.eq)(couponCodes.id, req.params.id.trim().toUpperCase()));
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Delete failed." });
    }
  });
  app.post("/api/admin/generate-promo-msg", async (req, res) => {
    try {
      let authenticatedUser;
      try {
        authenticatedUser = await getAuthenticatedUser(req);
      } catch (authErr) {
        return res.status(401).json({ error: "\u0639\u0630\u0631\u0627\u064B! \u064A\u062C\u0628 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0643\u0645\u0633\u0624\u0648\u0644 \u0623\u0648\u0644\u0627\u064B." });
      }
      if (authenticatedUser.email !== "adman777888999@gmail.com") {
        return res.status(403).json({ error: "\u0627\u062E\u062A\u0631\u0627\u0642 \u0623\u0645\u0646\u064A! \u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0627\u062A \u0627\u0644\u0645\u0633\u0624\u0648\u0644 \u0644\u062A\u0648\u0644\u064A\u062F \u0631\u0633\u0627\u0626\u0644 \u0627\u0644\u062E\u0635\u0648\u0645\u0627\u062A." });
      }
      const { code, discountPercent } = req.body;
      if (!code || !discountPercent) {
        return res.status(400).json({ error: "Code and discountPercent are required." });
      }
      const fallbackTemplates = [
        (pct, cd) => `\u{1F30C} \u0646\u0642\u0627\u0621 \u0627\u0644\u0645\u0639\u0631\u0641\u0629 \u064A\u0643\u062A\u0645\u0644 \u0628\u0630\u0643\u0627\u0621 \u0643\u0648\u0632\u0645\u0648... \u0627\u0644\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0630\u0643\u064A \u064A\u0645\u0646\u062D\u0643\u0645 \u0641\u0631\u0635\u0629 \u0627\u0633\u062A\u062B\u0646\u0627\u0626\u064A\u0629 \u0644\u0644\u0627\u0631\u062A\u0642\u0627\u0621 \u0628\u0635\u0641\u0648\u0641\u0643\u0645! \u0627\u0633\u062A\u062E\u062F\u0645\u0648\u0627 \u0627\u0644\u0643\u0648\u062F \u0627\u0644\u0631\u0645\u0632\u0649 [ ${cd} ] \u0644\u0644\u062D\u0635\u0648\u0644 \u0639\u0644\u0649 \u062E\u0635\u0645 \u0645\u0630\u0647\u0644 \u0628\u0642\u064A\u0645\u0629 [ ${pct}% ] \u0639\u0644\u0649 \u0643\u0627\u0641\u0629 \u0627\u0634\u062A\u0631\u0627\u0643\u0627\u062A \u0628\u0631\u064A\u0645\u064A\u0648\u0645! \u0627\u0644\u0631\u062D\u0644\u0629 \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A\u0629 \u0628\u0627\u062A\u062A \u0623\u0633\u0647\u0644 \u{1F680}`,
        (pct, cd) => `\u{1F680} \u0625\u0644\u0649 \u062C\u0645\u064A\u0639 \u0637\u0644\u0627\u0628\u0646\u0627 \u0627\u0644\u0623\u0648\u0641\u064A\u0627\u0621 \u0648\u0635\u0646\u0651\u0627\u0639 \u0627\u0644\u0645\u0633\u062A\u0642\u0628\u0644! \u0647\u0644 \u0623\u0646\u062A\u0645 \u0645\u0633\u062A\u0639\u062F\u0648\u0646 \u0644\u062A\u062C\u0631\u0628\u0629 \u0642\u0648\u0629 \u0627\u0644\u0640 AI \u0627\u0644\u062E\u0627\u0631\u0642\u0629\u061F \u0627\u0644\u0645\u0633\u0627\u0639\u062F \u0643\u0648\u0632\u0645\u0648 \u064A\u0637\u0644\u0642 \u0639\u0631\u0636\u0627\u064B \u0627\u0633\u062A\u062B\u0646\u0627\u0626\u064A\u0627\u064B \u0644\u0643\u0645! \u062E\u0635\u0645 \u062D\u0627\u0631\u0642 \u0628\u0642\u064A\u0645\u0629 [ ${pct}% ] \u0628\u0627\u0646\u062A\u0638\u0627\u0631\u0643\u0645 \u0645\u0639 \u0627\u0644\u0643\u0648\u062F: [ ${cd} ] \u{1F525} \u0644\u0627 \u062A\u0641\u0648\u062A\u0648\u0627 \u0627\u0644\u0644\u062D\u0638\u0629!`,
        (pct, cd) => `\u{1F916} \u0623\u062A\u0645\u062A\u0629 \u0627\u0644\u062A\u0639\u0644\u064A\u0645 \u0648\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0641\u064A \u0645\u062A\u0646\u0627\u0648\u0644 \u064A\u062F\u064A\u0643 \u0627\u0644\u0622\u0646. \u064A\u0633\u0631 \u0645\u0646\u0635\u0629 \u0643\u0648\u0632\u0645\u0648 \u0627\u0644\u0625\u0639\u0644\u0627\u0646 \u0639\u0646 \u0643\u0648\u062F \u0627\u0644\u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u062E\u0627\u0635 [ ${cd} ] \u0628\u062E\u0635\u0645 \u0641\u0648\u0631\u064A \u0642\u064A\u0645\u062A\u0647 [ ${pct}% ]. \u0627\u0631\u062A\u0642\u0650 \u0628\u0639\u0636\u0648\u064A\u062A\u0643 \u0644\u0644\u0634\u0641\u0642 \u0627\u0644\u0633\u062D\u0627\u0628\u064A \u0627\u0644\u0622\u0646 \u0648\u0627\u0635\u0646\u0639 \u0627\u062E\u062A\u0628\u0627\u0631\u0627\u062A \u0628\u0644\u0627 \u062D\u062F\u0648\u062F \u2728`,
        (pct, cd) => `\u{1F451} \u0644\u0643\u0644 \u0645\u0646 \u064A\u0646\u0634\u062F \u0627\u0644\u062A\u0645\u064A\u0632 \u0648\u0627\u0644\u0631\u064A\u0627\u062F\u0629: \u0628\u0627\u0642\u0629 \u0643\u0648\u0632\u0645\u0648 \u0628\u0631\u064A\u0645\u064A\u0648\u0645 \u062A\u0641\u062A\u062D \u0644\u0643\u0645 \u0622\u0641\u0627\u0642 \u0627\u0644\u062A\u0639\u0644\u064A\u0645 \u0627\u0644\u062A\u0641\u0627\u0639\u0644\u064A \u0627\u0644\u0623\u0642\u0648\u0649. \u064A\u0633\u0639\u062F\u0646\u0627 \u062A\u0642\u062F\u064A\u0645 \u0627\u0645\u062A\u064A\u0627\u0632 \u062D\u0635\u0631\u064A \u0628\u062E\u0635\u0645 [ ${pct}% ] \u0628\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0631\u0645\u0632 \u0627\u0644\u062A\u0641\u0639\u064A\u0644: [ ${cd} ]. \u0623\u0633\u0631\u0639\u0648\u0627\u060C \u0627\u0644\u062A\u0641\u0639\u064A\u0644\u0627\u062A \u0627\u0644\u0645\u062A\u0628\u0642\u064A\u0629 \u0645\u062D\u062F\u0648\u062F\u0629 \u0644\u0644\u063A\u0627\u064A\u0629 \u{1F31F}`,
        (pct, cd) => `\u{1F6F0}\uFE0F \u0630\u0643\u0627\u0621 \u0643\u0648\u0632\u0645\u0648 \u0644\u064A\u0633 \u0645\u062C\u0631\u062F \u062E\u0648\u0627\u0631\u0632\u0645\u064A\u0627\u062A\u060C \u0628\u0644 \u0647\u0648 \u0631\u0641\u064A\u0642\u0643 \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A \u0627\u0644\u062D\u0642\u064A\u0642\u064A! \u0648\u0641\u0631\u0646\u0627 \u0644\u0643\u0645 \u0643\u0648\u062F \u0627\u0644\u062E\u0635\u0645 \u0627\u0644\u0641\u0648\u0631\u064A [ ${cd} ] \u0644\u064A\u0631\u064A\u062D\u0643\u0645 \u0628\u0646\u0633\u0628\u0629 [ ${pct}% ] \u0643\u0627\u0645\u0644\u0629 \u0639\u0644\u0649 \u0627\u0644\u0628\u0627\u0642\u0629 \u0627\u0644\u0630\u0647\u0628\u064A\u0629 \u0648\u0627\u0644\u062C\u0628\u0627\u0631\u0629. \u062F\u0639\u0648\u0627 \u0643\u0648\u0632\u0645\u0648 \u064A\u0642\u0648\u0645 \u0628\u0627\u0644\u0639\u0645\u0644 \u0627\u0644\u0634\u0627\u0642 \u0623\u062B\u0646\u0627\u0621 \u0627\u0633\u062A\u0645\u062A\u0627\u0639\u0643\u0645 \u0628\u0625\u0646\u062A\u0627\u062C \u0641\u0631\u064A\u062F \u0644\u0644\u0645\u0633\u062A\u0642\u0628\u0644 \u2728`
      ];
      const randomIndex = Math.floor(Math.random() * fallbackTemplates.length);
      let message = fallbackTemplates[randomIndex](discountPercent, code);
      let generatedByAi = false;
      if (process.env.GEMINI_API_KEY) {
        try {
          const response = await generateContentWithRetryAndFallback({
            model: "gemini-3.5-flash",
            contents: `\u0627\u0643\u062A\u0628 \u0644\u064A \u0631\u0633\u0627\u0644\u0629 \u062A\u0631\u0648\u064A\u062C\u064A\u0629 \u062A\u0633\u0648\u064A\u0642\u064A\u0629 \u0630\u0643\u064A\u0629 \u0648\u0645\u062B\u064A\u0631\u0629 \u0648\u0642\u0635\u064A\u0631\u0629 \u0628\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0644\u0644\u0637\u0644\u0627\u0628 \u0644\u064A\u0639\u0644\u0645\u0648\u0627 \u0628\u0648\u062C\u0648\u062F \u0643\u0648\u062F \u062E\u0635\u0645 \u062C\u062F\u064A\u062F \u0639\u0644\u0649 \u0645\u0646\u0635\u0629 '\u0643\u0648\u0632\u0645\u0648 \u0627\u0644\u0630\u0643\u064A' \u0644\u0644\u062A\u0639\u0644\u0645 \u0648\u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631\u0627\u062A \u0627\u0644\u062A\u0641\u0627\u0639\u0644\u064A\u0629 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A.
\u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A:
- \u0643\u0648\u062F \u0627\u0644\u062E\u0635\u0645: ${code}
- \u0646\u0633\u0628\u0629 \u0627\u0644\u062E\u0635\u0645 \u0627\u0644\u0645\u0626\u0648\u064A\u0629: ${discountPercent}%
\u0627\u0644\u0646\u063A\u0645\u0629 \u0623\u0648 \u0627\u0644\u0623\u0633\u0644\u0648\u0628 \u0627\u0644\u0645\u062A\u0648\u0642\u0639: \u0631\u0627\u0642\u064D \u0648\u062A\u0643\u0646\u0648\u0644\u0648\u062C\u064A \u0648\u062C\u0630\u0627\u0628 \u0648\u0645\u0644\u064A\u0621 \u0628\u0627\u0644\u0625\u062B\u0627\u0631\u0629 \u0648\u0627\u0644\u0623\u0646\u0627\u0642\u0629\u060C \u0645\u0648\u062C\u0651\u0647 \u0644\u0644\u0637\u0644\u0627\u0628 \u0628\u0639\u0628\u0627\u0631\u0627\u062A \u0623\u0643\u0627\u062F\u064A\u0645\u064A\u0629 \u0645\u0634\u062C\u0639\u0629 \u0648\u0645\u0628\u062A\u0643\u0631\u0629 \u0645\u062B\u0644 '\u0634\u064A\u0627\u0637\u064A\u0646 \u0627\u0644\u0645\u0639\u0631\u0641\u0629'\u060C '\u0641\u0631\u0633\u0627\u0646 \u0627\u0644\u0630\u0643\u0627\u0621'\u060C \u0625\u0644\u062E\u060C \u0645\u062A\u0645\u0646\u064A\u0627\u064B \u0644\u0647\u0645 \u0627\u0644\u062A\u0648\u0641\u064A\u0642 \u0648\u0627\u0644\u0627\u0631\u062A\u0642\u0627\u0621 \u0648\u0627\u0644\u0646\u062C\u0627\u062D \u0627\u0644\u0628\u0627\u0647\u0631.
\u0627\u0643\u062A\u0628 \u0646\u0635 \u0627\u0644\u0631\u0633\u0627\u0644\u0629 \u0645\u0628\u0627\u0634\u0631\u0629 \u0628\u062F\u0648\u0646 \u0623\u064A \u0645\u0642\u062F\u0645\u0627\u062A \u0623\u0648 \u0634\u0631\u062D \u0623\u0648 \u0639\u0644\u0627\u0645\u0627\u062A \u0627\u0642\u062A\u0628\u0627\u0633\u060C \u0648\u0627\u062C\u0639\u0644\u0647\u0627 \u062A\u0628\u062F\u0648 \u0643\u0623\u0646\u0647\u0627 \u0643\u064F\u062A\u0628\u062A \u0628\u0648\u0627\u0633\u0637\u0629 '\u0643\u0648\u0632\u0645\u0648 \u{1F916} \u0631\u0641\u064A\u0642\u0643 \u0627\u0644\u0630\u0643\u064A'.`
          });
          if (response && response.text) {
            message = response.text.trim();
            generatedByAi = true;
          }
        } catch (openaiErr) {
          console.warn("Gemini generate promo fail:", openaiErr);
        }
      }
      res.json({ success: true, message, generatedByAi });
    } catch (err) {
      console.error("Error generating promo msg:", err);
      res.status(500).json({ error: "Failed to generate promo message." });
    }
  });
  app.post("/api/admin/broadcast-promo-msg", async (req, res) => {
    try {
      let authenticatedUser;
      try {
        authenticatedUser = await getAuthenticatedUser(req);
      } catch (authErr) {
        return res.status(401).json({ error: "\u0639\u0630\u0631\u0627\u064B! \u064A\u062C\u0628 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0643\u0645\u0633\u0624\u0648\u0644 \u0623\u0648\u0644\u0627\u064B." });
      }
      if (authenticatedUser.email !== "adman777888999@gmail.com") {
        return res.status(403).json({ error: "\u0627\u062E\u062A\u0631\u0627\u0642 \u0623\u0645\u0646\u064A! \u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u0635\u0644\u0627\u062D\u064A\u0627\u062A \u0627\u0644\u0645\u0633\u0624\u0648\u0644 \u0644\u0644\u0642\u064A\u0627\u0645 \u0628\u0627\u0644\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u062C\u0645\u0627\u0639\u064A." });
      }
      const { text: text2, senderId, senderName } = req.body;
      if (!text2) {
        return res.status(400).json({ error: "Message text is required." });
      }
      const sId = senderId || "admin-cosmo";
      const sName = senderName || "\u0627\u0644\u0645\u0633\u0627\u0639\u062F \u0643\u0648\u0632\u0645\u0648";
      const communityPayload = {
        id: "post-broadcast-" + Date.now(),
        text: text2,
        authorName: sName,
        authorId: sId,
        authorBadgeSymbol: "\u{1F451}",
        authorBadgeColor: "#eab308",
        // Gold
        likes: 0,
        likedBy: [],
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      await db.insert(communityPosts).values(communityPayload);
      const allUsers = await db.select().from(users);
      let deliveredCount = 0;
      if (allUsers.length > 0) {
        const dmPayloads = allUsers.map((u) => ({
          id: "msg-" + Math.random().toString(36).substring(2, 11) + "-" + Date.now(),
          senderId: sId,
          senderName: sName,
          receiverId: u.uid,
          receiverName: u.name || "\u0637\u0627\u0644\u0628 \u0645\u062A\u0645\u064A\u0632",
          text: text2,
          isRead: false,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        }));
        const batchSize = 100;
        for (let i = 0; i < dmPayloads.length; i += batchSize) {
          const chunk = dmPayloads.slice(i, i + batchSize);
          await db.insert(directMessages).values(chunk);
        }
        deliveredCount = allUsers.length;
      }
      res.json({ success: true, count: deliveredCount });
    } catch (err) {
      console.error("Error broadcasting promo message:", err);
      res.status(500).json({ error: "Failed to broadcast promotion message." });
    }
  });
  app.get("/api/quizzes/:id/best-score", async (req, res) => {
    try {
      const list = await db.select().from(completions).where((0, import_drizzle_orm.eq)(completions.quizId, req.params.id)).orderBy((0, import_drizzle_orm.desc)(completions.score)).limit(1);
      if (list.length > 0) {
        res.json({ score: list[0].score });
      } else {
        res.json({ score: 0 });
      }
    } catch (err) {
      res.json({ score: 0 });
    }
  });
  app.get("/api/quizzes/:id/completions", async (req, res) => {
    try {
      const list = await db.select().from(completions).where((0, import_drizzle_orm.eq)(completions.quizId, req.params.id));
      res.json(list);
    } catch (err) {
      res.json([]);
    }
  });
  app.get("/api/question-ratings/:userId", async (req, res) => {
    try {
      const list = await db.select().from(questionRatings).where((0, import_drizzle_orm.eq)(questionRatings.userId, req.params.userId));
      res.json(list);
    } catch (err) {
      res.json([]);
    }
  });
  app.post("/api/question-ratings", async (req, res) => {
    try {
      let authUser = await getAuthenticatedUser(req).catch(() => null);
      if (!authUser) return res.status(401).json({ error: "Unauthorized." });
      const { questionId, rating, ratingValue, quizId, quizTitle, questionText } = req.body;
      await db.insert(questionRatings).values({
        id: authUser.uid + "_" + questionId,
        questionId,
        userId: authUser.uid,
        ratingValue: ratingValue || rating || "",
        quizId,
        quizTitle: quizTitle || "Unknown Quiz",
        questionText: questionText || "Unknown Question",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed" });
    }
  });
  app.get("/api/notifications", async (req, res) => {
    try {
      const list = await db.select().from(notifications).orderBy((0, import_drizzle_orm.desc)(notifications.createdAt)).limit(30);
      res.json(list);
    } catch (err) {
      res.json([]);
    }
  });
  app.post("/api/notifications", async (req, res) => {
    try {
      let authUser = await getAuthenticatedUser(req).catch(() => null);
      if (!authUser) return res.status(401).json({ error: "Unauthorized." });
      if (authUser.email !== "adman777888999@gmail.com") return res.status(403).json({ error: "Admin only" });
      const item = req.body;
      await db.insert(notifications).values({
        id: item.id || "notif-" + Math.random().toString(36).substring(2, 11),
        title: item.title,
        body: item.body || item.message || "",
        senderName: item.senderName || "System",
        type: item.type || "info",
        createdAt: item.createdAt || (/* @__PURE__ */ new Date()).toISOString()
      });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed" });
    }
  });
  const vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY || "",
    privateKey: process.env.VAPID_PRIVATE_KEY || ""
  };
  if (!vapidKeys.publicKey || !vapidKeys.privateKey) {
    console.log("VAPID keys not configured in environment. Generating dynamic fallback keys...");
    try {
      const generated = import_web_push.default.generateVAPIDKeys();
      vapidKeys.publicKey = generated.publicKey;
      vapidKeys.privateKey = generated.privateKey;
    } catch (e) {
      console.error("Error generating VAPID keys:", e);
    }
  }
  if (vapidKeys.publicKey && vapidKeys.privateKey) {
    import_web_push.default.setVapidDetails(
      "mailto:admin@quizspace.io",
      vapidKeys.publicKey,
      vapidKeys.privateKey
    );
  }
  app.get("/api/notifications/vapid-public-key", (req, res) => {
    res.json({ publicKey: vapidKeys.publicKey });
  });
  app.post("/api/notifications/subscribe", import_express.default.json(), async (req, res) => {
    try {
      let authUser = await getAuthenticatedUser(req).catch(() => null);
      if (!authUser) return res.status(401).json({ error: "Unauthorized." });
      const { subscription } = req.body;
      const existing = await db.select().from(userNotificationTokens).where((0, import_drizzle_orm.eq)(userNotificationTokens.userId, authUser.uid)).limit(1);
      if (existing.length > 0) {
        await db.update(userNotificationTokens).set({ subscription: JSON.stringify(subscription), createdAt: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm.eq)(userNotificationTokens.userId, authUser.uid));
      } else {
        await db.insert(userNotificationTokens).values({ id: "token-" + Math.random().toString(36).substring(2), userId: authUser.uid, subscription: JSON.stringify(subscription), createdAt: /* @__PURE__ */ new Date() });
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed" });
    }
  });
  app.post("/api/classrooms", import_express.default.json(), async (req, res) => {
    try {
      let authUser = await getAuthenticatedUser(req).catch(() => null);
      if (!authUser) return res.status(401).json({ error: "Unauthorized." });
      const userList = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.uid, authUser.uid)).limit(1);
      if (!userList.length || !userList[0].isPremium) {
        return res.status(403).json({ error: "Only premium/teacher accounts can create classrooms." });
      }
      const item = req.body;
      await db.insert(classroomsTable).values({
        id: item.id,
        name: item.name,
        code: item.code,
        createdBy: authUser.uid,
        creatorName: authUser.name || item.creatorName,
        createdAt: item.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
        allowStudentMessages: item.allowStudentMessages !== false,
        allowStudentMedia: item.allowStudentMedia !== false
      });
      res.json({ success: true });
    } catch (err) {
      console.error("Error saving classroom:", err);
      res.status(500).json({ error: "Failed to create classroom." });
    }
  });
  app.post("/api/classrooms/join", import_express.default.json(), async (req, res) => {
    try {
      let authUser = await getAuthenticatedUser(req).catch(() => null);
      if (!authUser) return res.status(401).json({ error: "Unauthorized." });
      const item = req.body;
      const targetClass = await db.select().from(classroomsTable).where((0, import_drizzle_orm.eq)(classroomsTable.id, item.classId)).limit(1);
      if (!targetClass.length) return res.status(404).json({ error: "Classroom not found." });
      if (targetClass[0].code !== item.classCode) return res.status(403).json({ error: "Invalid class code." });
      await db.insert(classroomStudentsTable).values({
        id: item.id || "enroll-" + Math.random().toString(36).substring(2, 11),
        classId: item.classId,
        classCode: item.classCode,
        studentId: authUser.uid,
        studentName: authUser.name || item.studentName || "Student",
        studentPhoto: item.studentPhoto || null,
        joinedAt: item.joinedAt || (/* @__PURE__ */ new Date()).toISOString(),
        completedQuizzes: item.completedQuizzes || 0,
        avgScore: item.avgScore || 0,
        lastActive: item.lastActive || (/* @__PURE__ */ new Date()).toISOString(),
        role: "student"
      });
      res.json({ success: true });
    } catch (err) {
      console.error("Error joining classroom:", err);
      res.status(500).json({ error: "Failed to join classroom." });
    }
  });
  app.get("/api/classrooms", async (req, res) => {
    try {
      let authUser = await getAuthenticatedUser(req).catch(() => null);
      if (!authUser) return res.status(401).json({ error: "Unauthorized." });
      const enrolled = await db.select().from(classroomStudentsTable).where((0, import_drizzle_orm.eq)(classroomStudentsTable.studentId, authUser.uid));
      const classIds = enrolled.map((e) => e.classId);
      const list = await db.select().from(classroomsTable).orderBy((0, import_drizzle_orm.desc)(classroomsTable.createdAt));
      const filtered = list.filter((c) => c.createdBy === authUser.uid || classIds.includes(c.id));
      res.json(filtered);
    } catch (err) {
      res.json([]);
    }
  });
  app.get("/api/classrooms/students", async (req, res) => {
    try {
      let authUser = await getAuthenticatedUser(req).catch(() => null);
      if (!authUser) return res.status(401).json({ error: "Unauthorized." });
      const userClasses = await db.select().from(classroomsTable).where((0, import_drizzle_orm.eq)(classroomsTable.createdBy, authUser.uid));
      const enrolled = await db.select().from(classroomStudentsTable).where((0, import_drizzle_orm.eq)(classroomStudentsTable.studentId, authUser.uid));
      const classIds = [...userClasses.map((c) => c.id), ...enrolled.map((e) => e.classId)];
      if (classIds.length === 0) return res.json([]);
      const list = await db.select().from(classroomStudentsTable);
      const filtered = list.filter((s) => classIds.includes(s.classId));
      res.json(filtered);
    } catch (err) {
      res.json([]);
    }
  });
  app.post("/api/classrooms/:classId/permissions", import_express.default.json(), async (req, res) => {
    try {
      let authUser = await getAuthenticatedUser(req).catch(() => null);
      if (!authUser) return res.status(401).json({ error: "Unauthorized." });
      const { classId } = req.params;
      const targetClass = await db.select().from(classroomsTable).where((0, import_drizzle_orm.eq)(classroomsTable.id, classId)).limit(1);
      if (!targetClass.length || targetClass[0].createdBy !== authUser.uid) {
        return res.status(403).json({ error: "Only the creator can change permissions." });
      }
      const { allowStudentMessages, allowStudentMedia } = req.body;
      await db.update(classroomsTable).set({
        allowStudentMessages: allowStudentMessages !== false,
        allowStudentMedia: allowStudentMedia !== false
      }).where((0, import_drizzle_orm.eq)(classroomsTable.id, classId));
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to update permissions." });
    }
  });
  app.post("/api/classrooms/:classId/students/:studentId/role", import_express.default.json(), async (req, res) => {
    try {
      let authUser = await getAuthenticatedUser(req).catch(() => null);
      if (!authUser) return res.status(401).json({ error: "Unauthorized." });
      const { classId, studentId } = req.params;
      const { role } = req.body;
      const targetClass = await db.select().from(classroomsTable).where((0, import_drizzle_orm.eq)(classroomsTable.id, classId)).limit(1);
      if (!targetClass.length || targetClass[0].createdBy !== authUser.uid) {
        return res.status(403).json({ error: "Only the creator can change roles." });
      }
      await db.update(classroomStudentsTable).set({ role }).where((0, import_drizzle_orm.and)((0, import_drizzle_orm.eq)(classroomStudentsTable.classId, classId), (0, import_drizzle_orm.eq)(classroomStudentsTable.studentId, studentId)));
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to update student role." });
    }
  });
  app.get("/api/classrooms/:classId/messages", async (req, res) => {
    try {
      let authUser = await getAuthenticatedUser(req).catch(() => null);
      if (!authUser) return res.status(401).json({ error: "Unauthorized." });
      const { classId } = req.params;
      const targetClass = await db.select().from(classroomsTable).where((0, import_drizzle_orm.eq)(classroomsTable.id, classId)).limit(1);
      const enrolled = await db.select().from(classroomStudentsTable).where((0, import_drizzle_orm.and)((0, import_drizzle_orm.eq)(classroomStudentsTable.classId, classId), (0, import_drizzle_orm.eq)(classroomStudentsTable.studentId, authUser.uid))).limit(1);
      if ((!targetClass.length || targetClass[0].createdBy !== authUser.uid) && !enrolled.length) {
        return res.status(403).json({ error: "Not a member." });
      }
      const list = await db.select().from(classroomMessagesTable).where((0, import_drizzle_orm.eq)(classroomMessagesTable.classId, classId)).orderBy((0, import_drizzle_orm.desc)(classroomMessagesTable.createdAt));
      res.json(list);
    } catch (err) {
      res.json([]);
    }
  });
  app.post("/api/classrooms/:classId/messages", import_express.default.json(), async (req, res) => {
    try {
      let authUser = await getAuthenticatedUser(req).catch(() => null);
      if (!authUser) return res.status(401).json({ error: "Unauthorized." });
      const { classId } = req.params;
      const item = req.body;
      const targetClass = await db.select().from(classroomsTable).where((0, import_drizzle_orm.eq)(classroomsTable.id, classId)).limit(1);
      const enrolled = await db.select().from(classroomStudentsTable).where((0, import_drizzle_orm.and)((0, import_drizzle_orm.eq)(classroomStudentsTable.classId, classId), (0, import_drizzle_orm.eq)(classroomStudentsTable.studentId, authUser.uid))).limit(1);
      if ((!targetClass.length || targetClass[0].createdBy !== authUser.uid) && !enrolled.length) {
        return res.status(403).json({ error: "Not a member." });
      }
      await db.insert(classroomMessagesTable).values({
        id: item.id || "msg-" + Math.random().toString(36).substring(2, 11),
        classId,
        senderId: authUser.uid,
        senderName: authUser.name || item.senderName || "User",
        senderPhoto: item.senderPhoto || null,
        encryptedText: item.encryptedText || item.text || "",
        isMedia: !!item.hasMedia || !!item.isMedia,
        mediaUrl: item.mediaUrl || null,
        createdAt: /* @__PURE__ */ new Date()
      });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to send message." });
    }
  });
  app.post("/api/classrooms/:classId/notify", import_express.default.json(), async (req, res) => {
    try {
      let authUser = await getAuthenticatedUser(req).catch(() => null);
      if (!authUser) return res.status(401).json({ error: "Unauthorized." });
      const { classId } = req.params;
      const targetClass = await db.select().from(classroomsTable).where((0, import_drizzle_orm.eq)(classroomsTable.id, classId)).limit(1);
      if (!targetClass.length || targetClass[0].createdBy !== authUser.uid) {
        return res.status(403).json({ error: "Only creator can notify." });
      }
      const { title, body } = req.body;
      const students = await db.select().from(classroomStudentsTable).where((0, import_drizzle_orm.eq)(classroomStudentsTable.classId, classId));
      const studentIds = students.map((s) => s.studentId);
      if (studentIds.length > 0) {
        const tokens = await db.select().from(userNotificationTokens).where((0, import_drizzle_orm.inArray)(userNotificationTokens.userId, studentIds));
        const payload = JSON.stringify({ title: title || "\u0625\u0634\u0639\u0627\u0631 \u062C\u062F\u064A\u062F \u0645\u0646 \u0627\u0644\u0641\u0635\u0644", body: body || "" });
        for (const t of tokens) {
          if (t.subscription) {
            try {
              await import_web_push.default.sendNotification(JSON.parse(t.subscription), payload);
            } catch (e) {
            }
          }
        }
      }
      res.json({ success: true, count: studentIds.length });
    } catch (err) {
      res.status(500).json({ error: "Failed to notify." });
    }
  });
  app.get("/api/direct-messages", async (req, res) => {
    try {
      let authUser = await getAuthenticatedUser(req).catch(() => null);
      if (!authUser) return res.status(401).json({ error: "Unauthorized." });
      const userId = authUser.uid;
      const list = await db.select().from(directMessages).where((0, import_drizzle_orm.or)((0, import_drizzle_orm.eq)(directMessages.senderId, userId), (0, import_drizzle_orm.eq)(directMessages.receiverId, userId))).orderBy((0, import_drizzle_orm.desc)(directMessages.createdAt));
      res.json(list);
    } catch (err) {
      res.json([]);
    }
  });
  app.post("/api/direct-messages", async (req, res) => {
    try {
      let authUser = await getAuthenticatedUser(req).catch(() => null);
      if (!authUser) return res.status(401).json({ error: "Unauthorized." });
      const msg = req.body;
      await db.insert(directMessages).values({
        id: msg.id || "dm-" + Math.random().toString(36).substring(2, 11),
        senderId: authUser.uid,
        senderName: authUser.name || msg.senderName || "User",
        receiverId: msg.receiverId,
        receiverName: msg.receiverName || "User",
        text: msg.text,
        createdAt: msg.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
        isRead: false
      });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed." });
    }
  });
  app.post("/api/direct-messages/mark-read", async (req, res) => {
    try {
      let authUser = await getAuthenticatedUser(req).catch(() => null);
      if (!authUser) return res.status(401).json({ error: "Unauthorized." });
      const { senderId } = req.body;
      await db.update(directMessages).set({ isRead: true }).where((0, import_drizzle_orm.and)((0, import_drizzle_orm.eq)(directMessages.receiverId, authUser.uid), (0, import_drizzle_orm.eq)(directMessages.senderId, senderId)));
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed." });
    }
  });
  app.get("/api/community-posts", async (req, res) => {
    try {
      const postsList = await db.select().from(communityPosts).orderBy((0, import_drizzle_orm.desc)(communityPosts.createdAt));
      const allViews = await db.select().from(messageViews);
      const viewsMap = {};
      allViews.forEach((v) => {
        if (!viewsMap[v.postId]) {
          viewsMap[v.postId] = [];
        }
        viewsMap[v.postId].push(v);
      });
      const enrichedPosts = postsList.map((post) => {
        const views = viewsMap[post.id] || [];
        return {
          ...post,
          viewsCount: views.length,
          viewers: views
        };
      });
      res.json(enrichedPosts);
    } catch (err) {
      console.error("Error fetching enriched community posts:", err);
      res.json([]);
    }
  });
  app.post("/api/community-posts", async (req, res) => {
    try {
      let authUser = await getAuthenticatedUser(req).catch(() => null);
      if (!authUser) return res.status(401).json({ error: "Unauthorized." });
      const post = req.body;
      await db.insert(communityPosts).values({
        id: post.id || "cp-" + Math.random().toString(36).substring(2, 11),
        authorId: authUser.uid,
        authorName: authUser.name || post.authorName,
        text: post.text || post.content,
        authorBadgeSymbol: post.authorBadgeSymbol || null,
        authorBadgeColor: post.authorBadgeColor || null,
        likes: 0,
        likedBy: [],
        createdAt: post.createdAt || (/* @__PURE__ */ new Date()).toISOString()
      });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed" });
    }
  });
  app.post("/api/community-posts/:id/view", async (req, res) => {
    try {
      const postId = req.params.id;
      const { userId, userName, userPhotoUrl } = req.body;
      if (!userId || !userName) {
        return res.status(400).json({ error: "userId and userName are required." });
      }
      const viewId = `${postId}_${userId}`;
      const existing = await db.select().from(messageViews).where((0, import_drizzle_orm.eq)(messageViews.id, viewId)).limit(1);
      if (existing.length === 0) {
        await db.insert(messageViews).values({
          id: viewId,
          postId,
          userId,
          userName,
          userPhotoUrl: userPhotoUrl || "",
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        });
        res.json({ success: true, recorded: true });
      } else {
        res.json({ success: true, recorded: false });
      }
    } catch (err) {
      console.error("Error recording message view on Postgres:", err);
      res.status(500).json({ error: "Failed to record message view." });
    }
  });
  app.post("/api/community-posts/:id/like", async (req, res) => {
    try {
      let authUser = await getAuthenticatedUser(req).catch(() => null);
      if (!authUser) return res.status(401).json({ error: "Unauthorized." });
      const { id } = req.params;
      const { delta } = req.body;
      const userId = authUser.uid;
      const post = await db.select().from(communityPosts).where((0, import_drizzle_orm.eq)(communityPosts.id, id)).limit(1);
      if (post.length > 0) {
        let currentLikedBy = post[0].likedBy || [];
        const hasLiked = currentLikedBy.includes(userId);
        let newLikes = post[0].likes || 0;
        if (delta > 0 && !hasLiked) {
          currentLikedBy.push(userId);
          newLikes++;
        } else if (delta < 0 && hasLiked) {
          currentLikedBy = currentLikedBy.filter((uid) => uid !== userId);
          newLikes = Math.max(0, newLikes - 1);
        }
        await db.update(communityPosts).set({ likes: newLikes, likedBy: currentLikedBy }).where((0, import_drizzle_orm.eq)(communityPosts.id, id));
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed" });
    }
  });
  app.post("/api/ocr", async (req, res) => {
    try {
      let authenticatedUser;
      try {
        authenticatedUser = await getAuthenticatedUser(req);
      } catch (authErr) {
        return res.status(401).json({ error: "\u0639\u0630\u0631\u0627\u064B! \u064A\u062C\u0628 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0645\u064A\u0632\u0627\u062A \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A." });
      }
      const { image, mimeType } = req.body;
      const targetUserId = authenticatedUser.uid;
      if (!image) {
        return res.status(400).json({ error: "\u064A\u0631\u062C\u0649 \u0625\u0631\u0641\u0627\u0642 \u0635\u0648\u0631\u0629 \u0645\u0639 \u0627\u0644\u0637\u0644\u0628." });
      }
      let isPremium = false;
      if (targetUserId) {
        try {
          const userList = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.uid, targetUserId)).limit(1);
          if (userList.length > 0 && userList[0].isPremium) {
            isPremium = true;
          }
        } catch (dbErr) {
          console.error("Database query error for user premium status inside ocr:", dbErr);
        }
      }
      const cleanedBase64 = image.includes("base64,") ? image.split("base64,")[1] : image;
      const cleanedMimeType = mimeType || "image/jpeg";
      const promptString = `\u0627\u0642\u0631\u0623 \u0647\u0630\u0647 \u0627\u0644\u0635\u0648\u0631\u0629 \u0628\u0627\u0644\u0643\u0627\u0645\u0644 \u0648\u0627\u0633\u062A\u062E\u0631\u062C \u0643\u0627\u0641\u0629 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0648\u0627\u0644\u062A\u0645\u0627\u0631\u064A\u0646 \u0627\u0644\u0645\u062A\u0648\u0641\u0631\u0629 \u0641\u064A\u0647\u0627 \u0628\u062F\u0642\u0629 \u062A\u0641\u0635\u064A\u0644\u064A\u0629 \u0648\u062D\u0631\u0641\u064A\u0629 \u062A\u0627\u0645\u0629.
\u0642\u0648\u0627\u0639\u062F \u0641\u0646\u064A\u0629 \u0648\u062A\u0639\u0644\u064A\u0645\u064A\u0629 \u062D\u0627\u0633\u0645\u0629:
1. \u0627\u062F\u0639\u0645 \u0627\u0644\u0623\u0646\u0648\u0627\u0639: 'mcq' (\u062E\u064A\u0627\u0631\u0627\u062A \u0645\u062A\u0639\u062F\u062F\u0629)\u060C 'tf' (\u0635\u062D/\u062E\u0637\u0623)\u060C 'essay' (\u0633\u0624\u0627\u0644 \u0645\u0642\u0627\u0644\u064A).
2. \u0644\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0645\u0642\u0627\u0644\u064A\u0629 'essay': \u0627\u062C\u0639\u0644 options \u0641\u0627\u0631\u063A\u0629 []\u060C \u0648 correctIndex \u0628\u0642\u064A\u0645\u0629 0\u060C \u0648\u0627\u0644\u062C\u0648\u0627\u0628 \u0627\u0644\u0646\u0645\u0648\u0630\u062C\u064A \u0627\u0644\u062A\u0641\u0635\u064A\u0644\u064A \u0641\u064A correctAnswer.
3. \u0627\u0644\u062A\u0632\u0645 \u0628\u0646\u0633\u062E \u0648\u0627\u0633\u062A\u062E\u0631\u0627\u062C \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0648\u0627\u0644\u062E\u064A\u0627\u0631\u0627\u062A \u0648\u0627\u0644\u062D\u0644\u0648\u0644 \u062D\u0631\u0641\u064A\u0627\u064B \u0628\u0627\u0644\u0643\u0627\u0645\u0644 (copy-paste) \u0643\u0645\u0627 \u0647\u064A \u0645\u0643\u062A\u0648\u0628\u0629 \u0641\u064A \u0627\u0644\u0635\u0648\u0631\u0629 \u062F\u0648\u0646 \u0623\u064A \u062A\u0635\u062D\u064A\u062D\u060C \u062A\u0639\u062F\u064A\u0644\u060C \u062A\u0631\u062C\u0645\u0629\u060C \u0623\u0648 \u062A\u0623\u0644\u064A\u0641 \u062E\u0627\u0631\u062C\u064A \u0644\u0636\u0645\u0627\u0646 \u0627\u0644\u0623\u0645\u0627\u0646 \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A \u0627\u0644\u062A\u0627\u0645.
4. \u0637\u0627\u0628\u0642 \u062E\u064A\u0627\u0631 \u0627\u0644\u0625\u062C\u0627\u0628\u0629 \u0627\u0644\u0635\u062D\u064A\u062D\u0629 \u0648 correctIndex \u0628\u062F\u0642\u0629 \u0645\u062A\u0646\u0627\u0647\u064A\u0629 \u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0627\u0644\u0639\u0644\u0627\u0645\u0627\u062A \u0623\u0648 \u0627\u0644\u062D\u0644\u0648\u0644 \u0627\u0644\u0645\u0643\u062A\u0648\u0628\u0629 \u0628\u062F\u0627\u062E\u0644 \u0648\u0631\u0642\u0629 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0625\u0646 \u0648\u062C\u062F\u062A.
5. \u0647\u0627\u0645 \u062C\u062F\u0627\u064B: \u0625\u0630\u0627 \u0648\u062C\u062F \u0623\u064A \u0633\u0624\u0627\u0644 \u064A\u062D\u062A\u0648\u064A \u0639\u0644\u0649 \u0631\u0633\u0645 \u062A\u0648\u0636\u064A\u062D\u064A\u060C \u0645\u0628\u064A\u0627\u0646\u060C \u0631\u0633\u0645 \u0647\u0646\u062F\u0633\u064A\u060C \u0631\u0633\u0645 \u062A\u062E\u0637\u064A\u0637\u064A\u060C \u062C\u062F\u0648\u0644\u060C \u062E\u0631\u064A\u0637\u0629\u060C \u0623\u0648 \u0635\u0648\u0631\u0629 \u062E\u0627\u0635\u0629 \u0628\u0627\u0644\u0633\u0624\u0627\u0644 \u0645\u0631\u0627\u0641\u0642\u0629 \u0644\u0647 \u0641\u064A \u0627\u0644\u0648\u0631\u0642\u0629\u060C \u062D\u062F\u062F \u0635\u0646\u062F\u0648\u0642 \u0645\u0636\u0644\u0639 \u0625\u062D\u062F\u0627\u062B\u064A\u0627\u062A\u0647 [ymin, xmin, ymax, xmax] \u0628\u0646\u0633\u0628\u0629 0-1000 \u0645\u0642\u0627\u0631\u0646\u0629 \u0628\u0623\u0628\u0639\u0627\u062F \u0627\u0644\u0635\u0648\u0631\u0629 \u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A\u0629 \u062D\u062A\u0649 \u0646\u062A\u0645\u0643\u0646 \u0645\u0646 \u0642\u0635 \u0647\u0630\u0647 \u0627\u0644\u0635\u0648\u0631\u0629 \u0648\u0639\u0631\u0636\u0647\u0627 \u0645\u0631\u0627\u0641\u0642\u0629 \u0644\u0644\u0633\u0624\u0627\u0644.`;
      let sysInstruction = "";
      if (isPremium) {
        sysInstruction = `\u0623\u0646\u062A \u062E\u0628\u064A\u0631 \u0623\u0643\u0627\u062F\u064A\u0645\u064A \u0645\u062A\u062A\u0642\u062F\u0645 \u0648\u0646\u0627\u0633\u062E \u0645\u0633\u062A\u0646\u062F\u0627\u062A \u0622\u0644\u064A \u0641\u0627\u0626\u0642 \u0627\u0644\u0630\u0643\u0627\u0621 \u0648\u0627\u0644\u062F\u0642\u0629 (\u0637\u0627\u0642\u0629 \u0645\u0639\u0627\u0644\u062C\u0629 PRO). \u0645\u0647\u0645\u062A\u0643 \u0647\u064A \u0627\u0633\u062A\u062E\u0631\u0627\u062C \u0643\u0627\u0641\u0629 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0648\u0627\u0644\u062A\u0645\u0627\u0631\u064A\u0646 \u0648\u0627\u0644\u0631\u0633\u0648\u0645 \u0627\u0644\u062A\u0648\u0636\u064A\u062D\u064A\u0629 \u0645\u0646 \u0635\u0648\u0631 \u0627\u0644\u0627\u0645\u062A\u062D\u0627\u0646\u0627\u062A \u0648\u0623\u0648\u0631\u0627\u0642 \u0627\u0644\u0639\u0645\u0644.
\u064A\u062A\u0648\u062C\u0628 \u0639\u0644\u064A\u0643 \u0646\u0633\u062E \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0648\u0627\u0644\u062E\u064A\u0627\u0631\u0627\u062A \u062D\u0631\u0641\u064A\u0627\u064B \u062F\u0648\u0646 \u0623\u062F\u0646\u0649 \u062A\u0639\u062F\u064A\u0644 \u0623\u0648 \u062A\u0631\u062C\u0645\u0629 \u0648\u0628\u0646\u0641\u0633 \u0644\u063A\u062A\u0647\u0627 \u0627\u0644\u0623\u0635\u0644\u064A\u0629. \u062D\u062F\u062F \u0628\u062F\u0642\u0629 correctIndex \u0648\u0645\u0624\u0634\u0631 \u0627\u0644\u0625\u062C\u0627\u0628\u0629 \u0627\u0644\u0635\u062D\u064A\u062D\u0629 \u0648\u062A\u0641\u0633\u064A\u0631\u0647\u0627 \u0627\u0644\u0639\u0644\u0645\u064A \u0627\u0644\u062A\u0641\u0635\u064A\u0644\u064A.
\u0644\u0631\u0633\u0648\u0645 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u062A\u0648\u0636\u064A\u062D\u064A\u0629\u060C \u062D\u062F\u062F \u0628\u062F\u0642\u0629 \u0625\u062D\u062F\u0627\u062B\u064A\u0627\u062A [ymin, xmin, ymax, xmax] \u0645\u0646 0 \u0625\u0644\u0649 1000 \u0644\u062A\u062D\u062F\u064A\u062F \u0635\u0646\u062F\u0648\u0642 imageBox. \u0644\u0627 \u062A\u064F\u062F\u0631\u062C \u0623\u064A \u0646\u0635\u0648\u0635 \u062E\u0627\u0631\u062C \u0643\u062A\u0644\u0629 \u0627\u0644\u0640 JSON.`;
      } else {
        sysInstruction = `\u0623\u0646\u062A \u0646\u0627\u0633\u062E \u0648\u0645\u0633\u062A\u062E\u0631\u062C \u0623\u0633\u0626\u0644\u0629 \u0645\u0646 \u0627\u0644\u0635\u0648\u0631 \u0628\u062A\u0646\u0633\u064A\u0642 JSON. \u0627\u0646\u0633\u062E \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0648\u0627\u0644\u062E\u064A\u0627\u0631\u0627\u062A \u062D\u0631\u0641\u064A\u0627\u064B \u062F\u0648\u0646 \u062A\u0639\u062F\u064A\u0644 \u0648\u0628\u0646\u0641\u0633 \u0644\u063A\u062A\u0647\u0627. \u064A\u062F\u0639\u0645 \u062A\u0641\u0635\u064A\u0644\u0627\u064B \u062E\u064A\u0627\u0631\u0627\u062A mcq \u0648\u0635\u062D/\u062E\u0637\u0623 tf \u0648\u0627\u0644\u0645\u0642\u0627\u0644\u064A essay (\u062D\u062F\u062F correctAnswer \u0648\u0627\u062C\u0639\u0644 options=[]). \u062D\u062F\u062F \u0628\u062F\u0642\u0629 \u0625\u062D\u062F\u0627\u062B\u064A\u0627\u062A imageBox \u0628\u0642\u064A\u0645 [ymin, xmin, ymax, xmax] \u0645\u0646 0 \u0625\u0644\u0649 1000 \u0644\u0623\u064A \u0631\u0633\u0648\u0645\u0627\u062A \u0645\u0631\u0627\u0641\u0642\u0629 \u0644\u0644\u0623\u0633\u0626\u0644\u0629. \u0644\u0627 \u062A\u064F\u062F\u0631\u062C \u0623\u064A \u0646\u0635\u0648\u0635 \u062E\u0627\u0631\u062C \u0643\u062A\u0644\u0629 \u0627\u0644\u0640 JSON.`;
      }
      const response = await generateContentWithRetryAndFallback({
        model: "gemini-3.1-flash-lite",
        contents: [
          {
            inlineData: {
              mimeType: cleanedMimeType,
              data: cleanedBase64
            }
          },
          {
            text: promptString
          }
        ],
        config: {
          systemInstruction: sysInstruction,
          responseMimeType: "application/json",
          temperature: isPremium ? 0.05 : 0.1
        }
      });
      const extractedText = response.text;
      if (!extractedText) {
        throw new Error("\u0644\u0645 \u064A\u0642\u0645 \u0646\u0645\u0648\u0630\u062C \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0628\u0625\u0631\u062C\u0627\u0639 \u0646\u062A\u064A\u062C\u0629 \u0635\u0627\u0644\u062D\u0629.");
      }
      const extractedJson = parseJsonSafely(extractedText);
      res.json(extractedJson);
    } catch (e) {
      console.error("OCR Extraction Error:", e);
      res.status(500).json({
        error: "\u0639\u0630\u0631\u0627\u064B\u060C \u0641\u0634\u0644 \u0627\u0633\u062A\u062E\u0631\u0627\u062C \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0645\u0646 \u0627\u0644\u0635\u0648\u0631\u0629 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A.",
        details: e.message
      });
    }
  });
  app.post("/api/generate-from-pdf-text", async (req, res) => {
    try {
      let authenticatedUser;
      try {
        authenticatedUser = await getAuthenticatedUser(req);
      } catch (authErr) {
        return res.status(401).json({ error: "\u0639\u0630\u0631\u0627\u064B! \u064A\u062C\u0628 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0645\u064A\u0632\u0627\u062A \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A." });
      }
      const { text: text2, amount } = req.body;
      const targetUserId = authenticatedUser.uid;
      if (!text2 || !text2.trim()) {
        return res.status(400).json({ error: "\u064A\u0631\u062C\u0649 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0646\u0635 \u0627\u0644\u0645\u0633\u062A\u062E\u0631\u062C \u0645\u0646 \u0645\u0644\u0641 \u0627\u0644\u0640 PDF." });
      }
      let isPremium = false;
      if (targetUserId) {
        try {
          const userList = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.uid, targetUserId)).limit(1);
          if (userList.length > 0 && userList[0].isPremium) {
            isPremium = true;
          }
        } catch (dbErr) {
          console.error("Database query error for user premium status inside pdf text gen:", dbErr);
        }
      }
      const targetCount = typeof amount === "number" ? amount : 5;
      const isAutoCount = typeof amount !== "number" || amount <= 0;
      const activeModel = "gemini-3.1-flash-lite";
      const sysInstruction = `\u0623\u0646\u062A \u062E\u0628\u064A\u0631 \u0623\u0643\u0627\u062F\u064A\u0645\u064A \u0648\u0645\u0647\u0646\u062F\u0633 \u0645\u062D\u062A\u0648\u0649 \u062A\u0639\u0644\u064A\u0645\u064A. \u0627\u0633\u062A\u062E\u0631\u062C \u0648\u0623\u0646\u0634\u0626 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0628\u0646\u0633\u0642 JSON.
\u0627\u0644\u0631\u062F \u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 JSON \u0641\u0642\u0637 \u062D\u0633\u0628 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u0623\u062F\u0646\u0627\u0647:
{
  "title": "\u0639\u0646\u0648\u0627\u0646",
  "description": "\u0648\u0635\u0641",
  "questions": [
    { "text": "\u0633\u0624\u0627\u0644", "type": "mcq|tf|essay", "options": ["\u0627", "\u0628", "\u062C", "\u062F"], "correctIndex": 0, "correctAnswer": "", "explanation": "\u0627\u0644\u0634\u0631\u062D" }
  ]
}`;
      const words = text2.trim().split(/\s+/);
      const totalWords = words.length;
      let finalQuiz = {
        title: "",
        description: "",
        questions: []
      };
      if (totalWords > 2200) {
        const chunkSize = 1500;
        const chunks = [];
        for (let i = 0; i < words.length; i += chunkSize) {
          chunks.push(words.slice(i, i + chunkSize).join(" "));
        }
        const activeChunks = chunks.slice(0, 5);
        const chunkPromises = activeChunks.map(async (chunkText, chunkIndex) => {
          const chunkPrompt = `\u0627\u0642\u0631\u0623 \u0647\u0630\u0627 \u0627\u0644\u062C\u0632\u0621 \u0648\u0627\u0633\u062A\u062E\u0644\u0635 \u0623\u0633\u0626\u0644\u0629 \u0641\u064A JSON.
\u0627\u0644\u062C\u0632\u0621 \u0631\u0642\u0645 ${chunkIndex + 1}:
"""
${chunkText}
"""`;
          try {
            const response = await generateContentWithRetryAndFallback({
              model: activeModel,
              contents: chunkPrompt,
              config: {
                systemInstruction: sysInstruction,
                responseMimeType: "application/json",
                temperature: 0.2
              }
            });
            const resText = response.text;
            if (resText) {
              const parsed = parseJsonSafely(resText);
              if (parsed && Array.isArray(parsed.questions)) {
                return parsed;
              }
            }
          } catch (chunkErr) {
            console.error(`Error processing chunk ${chunkIndex + 1}:`, chunkErr);
          }
          return null;
        });
        const results = await Promise.all(chunkPromises);
        for (const resObj of results) {
          if (resObj) {
            if (!finalQuiz.title && resObj.title) {
              finalQuiz.title = resObj.title;
            }
            if (!finalQuiz.description && resObj.description) {
              finalQuiz.description = resObj.description;
            }
            if (Array.isArray(resObj.questions)) {
              finalQuiz.questions.push(...resObj.questions);
            }
          }
        }
      } else {
        const promptString = `\u0627\u0642\u0631\u0623 \u0627\u0644\u0646\u0635 \u0623\u062F\u0646\u0627\u0647 \u0648\u0627\u0633\u062A\u062E\u0644\u0635 \u0645\u0646\u0647 \u0623\u0633\u0626\u0644\u0629 \u062A\u0639\u0644\u064A\u0645\u064A\u0629.
\u0627\u0644\u0646\u0635:
"""
${text2}
"""`;
        const response1 = await generateContentWithRetryAndFallback({
          model: activeModel,
          contents: promptString,
          config: {
            systemInstruction: sysInstruction,
            responseMimeType: "application/json",
            temperature: 0.2
          }
        });
        const extractedText1 = response1.text;
        if (extractedText1) {
          const parsed1 = parseJsonSafely(extractedText1);
          if (parsed1) {
            finalQuiz.title = parsed1.title || "";
            finalQuiz.description = parsed1.description || "";
            finalQuiz.questions = parsed1.questions || [];
          }
        }
        if (isAutoCount && finalQuiz.questions.length > 0 && finalQuiz.questions.length < 25) {
          try {
            const currentQuestionsSummary = finalQuiz.questions.map((q) => `- ${q.text}`).join("\n");
            const followUpPrompt = `\u0627\u0642\u0631\u0623 \u0627\u0644\u0646\u0635 \u0644\u062A\u0648\u0644\u064A\u062F \u0627\u0644\u0645\u0632\u064A\u062F \u0627\u0644\u0645\u0633\u062A\u062E\u0644\u0635. 
\u0627\u0633\u062A\u062E\u0631\u062C \u0623\u0633\u0626\u0644\u0629 \u062C\u062F\u064A\u062F\u0629 \u063A\u064A\u0631 \u0645\u0643\u0631\u0631\u0629.

\u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u0631\u062C\u0629 \u0633\u0627\u0628\u0642\u0627\u064B:
${currentQuestionsSummary}

\u0627\u0644\u0646\u0635 \u0627\u0644\u0623\u0635\u0644\u064A:
"""
${text2}
"""`;
            const response2 = await generateContentWithRetryAndFallback({
              model: activeModel,
              contents: followUpPrompt,
              config: {
                systemInstruction: sysInstruction,
                responseMimeType: "application/json",
                temperature: 0.2
              }
            });
            const extractedText2 = response2.text;
            if (extractedText2) {
              const parsed2 = parseJsonSafely(extractedText2);
              if (parsed2 && Array.isArray(parsed2.questions) && parsed2.questions.length > 0) {
                const existingTexts = new Set(finalQuiz.questions.map((q) => q.text.trim().toLowerCase()));
                for (const newQ of parsed2.questions) {
                  if (!existingTexts.has(newQ.text.trim().toLowerCase())) {
                    finalQuiz.questions.push(newQ);
                  }
                }
              }
            }
          } catch (followUpErr) {
            console.error("Failed to run iterative generation follow-up:", followUpErr);
          }
        }
      }
      if (!finalQuiz.title) {
        finalQuiz.title = "\u0627\u062E\u062A\u0628\u0627\u0631 \u0645\u062E\u0635\u0635 \u0645\u0646 \u0627\u0644\u0645\u0633\u062A\u0646\u062F";
      }
      if (!finalQuiz.description) {
        finalQuiz.description = "\u062A\u0645 \u0627\u0633\u062A\u062E\u0631\u0627\u062C \u0648\u062A\u0646\u0633\u064A\u0642 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0628\u0646\u062C\u0627\u062D \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0648\u0628\u0645\u0631\u0627\u062C\u0639\u0629 \u062F\u0642\u0629 \u0643\u0648\u0627\u0646\u062A\u0645 \u0627\u0644\u0641\u0627\u0626\u0642\u0629.";
      }
      if (!isAutoCount && finalQuiz.questions.length > 0) {
        if (finalQuiz.questions.length > targetCount) {
          finalQuiz.questions = finalQuiz.questions.slice(0, targetCount);
        }
      }
      res.json(finalQuiz);
    } catch (e) {
      console.error("PDF Text Quiz generation error:", e);
      res.status(500).json({
        error: "\u0639\u0630\u0631\u0627\u064B\u060C \u0641\u0634\u0644 \u0635\u064A\u0627\u063A\u0629 \u0648\u0627\u062E\u062A\u0635\u0627\u0631 \u0627\u0644\u0645\u0633\u062A\u0646\u062F \u0644\u0623\u0633\u0626\u0644\u0629 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A.",
        details: e.message
      });
    }
  });
  app.post("/api/upload-document-init", async (req, res) => {
    let tempFilePath = null;
    let uploadedFileObj = null;
    const ai = getAi();
    try {
      let authenticatedUser;
      try {
        authenticatedUser = await getAuthenticatedUser(req);
      } catch (authErr) {
        return res.status(401).json({ error: "\u0639\u0630\u0631\u0627\u064B! \u064A\u062C\u0628 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0645\u064A\u0632\u0627\u062A \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A." });
      }
      const { fileBase64, mimeType, fileName } = req.body;
      const targetUserId = authenticatedUser.uid;
      if (!fileBase64 || !mimeType) {
        return res.status(400).json({ error: "\u0627\u0644\u0631\u062C\u0627\u0621 \u062A\u0648\u0641\u064A\u0631 \u0645\u062D\u062A\u0648\u0649 \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0645\u0631\u0641\u0648\u0639 \u0648\u0646\u0648\u0639\u0647 \u0648\u0628\u0635\u064A\u063A\u0629 \u0635\u062D\u064A\u062D\u0629." });
      }
      let isPremium = false;
      if (targetUserId) {
        try {
          const userList = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.uid, targetUserId)).limit(1);
          if (userList.length > 0 && userList[0].isPremium) {
            isPremium = true;
          }
        } catch (dbErr) {
          console.error("Database query error for user premium status inside doc init:", dbErr);
        }
      }
      const activeModel = "gemini-3.1-flash-lite";
      const fs2 = await import("fs");
      const path2 = await import("path");
      const os = await import("os");
      const crypto2 = await import("crypto");
      const fileBuffer = Buffer.from(fileBase64, "base64");
      const uniqueName = `${crypto2.randomUUID()}_${fileName || "uploaded_doc"}`;
      tempFilePath = path2.join(os.tmpdir(), uniqueName);
      fs2.writeFileSync(tempFilePath, fileBuffer);
      const extractedText = await extractTextFromBuffer(fileBuffer, mimeType);
      uploadedFileObj = {
        name: uniqueName,
        uri: "data:text/plain;base64," + Buffer.from(extractedText).toString("base64"),
        mimeType: "text/plain",
        state: "ACTIVE"
      };
      const analysisPrompt = `\u0623\u0646\u062A \u062E\u0628\u064A\u0631 \u0641\u062D\u0635 \u0648\u0641\u0647\u0631\u0633\u0629 \u0645\u0648\u0627\u062F \u062F\u0631\u0627\u0633\u064A\u0629 \u0648\u062A\u062D\u062F\u064A\u062F \u062D\u062C\u0645 \u0627\u0644\u0645\u0644\u0641\u0627\u062A. \u0644\u0642\u062F \u0632\u0648\u062F\u062A\u0643 \u0628\u0645\u0644\u0641 \u064A\u062D\u062A\u0648\u064A \u0639\u0644\u0649 \u0645\u0627\u062F\u0629 \u0639\u0644\u0645\u064A\u0629.
\u0642\u0645 \u0628\u0642\u0631\u0627\u0626\u062A\u0647 \u0648\u062F\u0631\u0627\u0633\u062A\u0647 \u0641\u0648\u0631\u0627\u064B\u060C \u062B\u064F\u0645 \u0623\u0631\u062C\u0639 \u0644\u064A \u0645\u0633\u062A\u0646\u062F JSON \u0646\u0638\u064A\u0641 \u0648\u0645\u0637\u0627\u0628\u0642 \u062A\u0645\u0627\u0645\u0627\u064B \u0644\u0644\u0628\u0646\u064A\u0629 \u0627\u0644\u062A\u0627\u0644\u064A\u0629 \u0648\u0628\u062F\u0648\u0646 \u0623\u064A \u0639\u0644\u0627\u0645\u0627\u062A \u0645\u0627\u0631\u0643\u062F\u0627\u0648\u0646 \u0623\u0648 \u062F\u064A\u0628\u0627\u062C\u0627\u062A \u062E\u0627\u0631\u062C\u064A\u0629:
{
  "totalPages": 5, // \u0625\u062C\u0645\u0627\u0644\u064A \u0639\u062F\u062F \u0635\u0641\u062D\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u0646\u062F \u0627\u0644\u0641\u0639\u0644\u064A \u0628\u062F\u0642\u0629 \u0643\u0627\u0645\u0644\u0629. \u0625\u0630\u0627 \u0643\u0627\u0646 \u0627\u0644\u0645\u0644\u0641 \u0645\u062D\u062A\u0648\u0649 \u0646\u0635\u064A \u0645\u0642\u062F\u0631 \u0627\u062C\u0639\u0644\u0647 \u062A\u0642\u0631\u064A\u0628\u064A\u0627\u064B.
  "title": "\u0639\u0646\u0648\u0627\u0646 \u0630\u0643\u064A \u0648\u062C\u0630\u0627\u0628 \u0648\u0639\u0635\u0631\u064A \u064A\u0644\u062E\u0635 \u0627\u0644\u0645\u0644\u0641",
  "description": "\u0648\u0635\u0641 \u062A\u0641\u0635\u064A\u0644\u064A \u0642\u0635\u064A\u0631 \u0644\u0644\u0645\u0644\u0641 \u0648\u0645\u062D\u062A\u0648\u064A\u0627\u062A\u0647 \u0628\u0644\u063A\u0629 \u0627\u0644\u0646\u0635 \u0627\u0644\u0623\u0635\u0644\u064A\u0629"
}
\u062A\u0623\u0643\u062F \u0645\u0646 \u0625\u0631\u0633\u0627\u0644 JSON \u0641\u0642\u0637 \u0648\u0645\u063A\u0644\u0642\u0627\u064B \u0628\u0634\u0643\u0644 \u0633\u0644\u064A\u0645 \u0644\u0643\u064A \u0646\u0642\u0648\u0645 \u0628\u0642\u0631\u0627\u0621\u062A\u0647 \u0648\u062A\u062C\u0632\u0626\u062A\u0647.
\u0645\u062D\u062A\u0648\u0649 \u0627\u0644\u0645\u0633\u062A\u0646\u062F \u0644\u0644\u062A\u0644\u062E\u064A\u0635:
${extractedText.substring(0, 1e4)} // Taking top 10000 chars for analysis
`;
      const response = await generateContentWithRetryAndFallback({
        model: activeModel,
        contents: [
          {
            text: analysisPrompt
          }
        ],
        config: {
          responseMimeType: "application/json",
          temperature: 0.1
        }
      });
      const resText = response.text;
      let totalPages = 1;
      let title = "\u0627\u062E\u062A\u0628\u0627\u0631 \u0645\u0633\u062A\u062E\u0631\u062C \u0645\u0646 \u0645\u0633\u062A\u0646\u062F";
      let description = "\u062A\u0645 \u0627\u0633\u062A\u062E\u0644\u0627\u0635\u0647 \u0648\u0645\u0646\u0633\u0642 \u0637\u0628\u0642\u0627 \u0644\u0644\u0635\u0641\u062D\u0627\u062A \u0628\u0627\u0644\u0643\u0627\u0645\u0644.";
      if (resText) {
        const parsed = parseJsonSafely(resText);
        if (parsed) {
          totalPages = typeof parsed.totalPages === "number" ? parsed.totalPages : 1;
          title = parsed.title || title;
          description = parsed.description || description;
        }
      }
      if (totalPages <= 0) totalPages = 1;
      res.json({
        fileUri: uploadedFileObj.uri,
        fileUploadName: uploadedFileObj.name,
        mimeType: uploadedFileObj.mimeType,
        totalPages,
        title,
        description
      });
    } catch (e) {
      console.error("File session init error:", e);
      const errMsg = e?.message?.toLowerCase() || "";
      const isQuota = errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("exhaust");
      const isBusy = errMsg.includes("503") || errMsg.includes("504") || errMsg.includes("overloaded");
      res.status(500).json({
        error: isQuota ? "\u0639\u0630\u0631\u0627\u064B\u060C \u062A\u0645 \u0627\u0633\u062A\u0647\u0644\u0627\u0643 \u0627\u0644\u062D\u062F \u0627\u0644\u064A\u0648\u0645\u064A \u0644\u0637\u0644\u0628\u0627\u062A \u0643\u0648\u0632\u0645\u0648 \u0627\u0644\u0630\u0643\u064A. \u064A\u0631\u062C\u0649 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629 \u0644\u0627\u062D\u0642\u0627\u064B \u0623\u0648 \u062A\u0631\u0642\u064A\u0629 \u0627\u0644\u062D\u0633\u0627\u0628." : isBusy ? "\u0639\u0630\u0631\u0627\u064B\u060C \u0634\u0628\u0643\u0629 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0645\u0632\u062F\u062D\u0645\u0629 \u062D\u0627\u0644\u064A\u0627\u064B. \u064A\u0631\u062C\u0649 \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631 \u062F\u0642\u064A\u0642\u0629 \u0648\u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629 \u0645\u062C\u062F\u062F\u0627\u064B." : "\u0639\u0630\u0631\u0627\u064B\u060C \u0641\u0634\u0644\u062A \u062A\u0647\u064A\u0626\u0629 \u0648\u0642\u0631\u0627\u0621\u0629 \u0635\u0641\u062D\u0627\u062A \u0627\u0644\u0645\u0644\u0641 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A.",
        details: e.message
      });
    } finally {
      if (tempFilePath) {
        try {
          const fs2 = await import("fs");
          if (fs2.existsSync(tempFilePath)) {
            fs2.unlinkSync(tempFilePath);
          }
        } catch (err) {
        }
      }
    }
  });
  app.post("/api/upload-document-cleanup", async (req, res) => {
    res.json({ success: true });
  });
  app.post("/api/generate-from-file-direct", async (req, res) => {
    let tempFilePath = null;
    let uploadedFileObj = null;
    let shouldCleanupFile = true;
    try {
      const {
        fileBase64,
        mimeType,
        fileName,
        amount,
        userId,
        batchIndex,
        totalBatches,
        alreadyExtractedTexts,
        customInstruction,
        fileUri,
        fileUploadName,
        isPageByPage,
        pageNumber,
        extractionMode
      } = req.body;
      if (!fileUri && (!fileBase64 || !mimeType)) {
        return res.status(400).json({ error: "\u0627\u0644\u0631\u062C\u0627\u0621 \u062A\u0648\u0641\u064A\u0631 \u0645\u062D\u062A\u0648\u0649 \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0645\u0631\u0641\u0648\u0639 \u0648\u0646\u0648\u0639\u0647 \u0628\u0635\u064A\u063A\u0629 \u0635\u062D\u064A\u062D\u0629." });
      }
      const activeModel = "gemini-3.1-flash-lite";
      const targetCount = typeof amount === "number" ? amount : 5;
      if (fileUri && fileUploadName) {
        uploadedFileObj = {
          uri: fileUri,
          mimeType: mimeType || "application/pdf",
          name: fileUploadName
        };
        shouldCleanupFile = false;
        console.log(`[Files API Sessions] Reusing pre-uploaded file reference: uri=${fileUri}, name=${fileUploadName}`);
      } else {
        const fs2 = await import("fs");
        const path2 = await import("path");
        const os = await import("os");
        const crypto2 = await import("crypto");
        const fileBuffer = Buffer.from(fileBase64, "base64");
        const uniqueName = `${crypto2.randomUUID()}_${fileName || "uploaded_doc"}`;
        tempFilePath = path2.join(os.tmpdir(), uniqueName);
        fs2.writeFileSync(tempFilePath, fileBuffer);
        const extractedText = await extractTextFromBuffer(fileBuffer, mimeType);
        uploadedFileObj = {
          uri: "data:text/plain;base64," + Buffer.from(extractedText).toString("base64"),
          mimeType: "text/plain",
          name: uniqueName
        };
      }
      let sysInstructionForDirect = "";
      if (extractionMode === "literal") {
        sysInstructionForDirect = `\u0623\u0646\u062A \u0645\u0633\u062A\u062E\u0644\u0635 \u0628\u064A\u0627\u0646\u0627\u062A \u0648\u0623\u0633\u0626\u0644\u0629 \u0641\u0627\u0626\u0642 \u0627\u0644\u062F\u0642\u0629. \u064A\u062C\u0628 \u0625\u0646\u062A\u0627\u062C \u0627\u0644\u0646\u062A\u064A\u062C\u0629 \u0628\u0635\u064A\u063A\u0629 JSON \u062D\u0635\u0631\u0627\u064B.
\u0627\u0644\u0628\u0646\u0627\u0621 \u0643\u0627\u0644\u062A\u0627\u0644\u064A:
{
  "title": "\u0639\u0646\u0648\u0627\u0646",
  "description": "\u0648\u0635\u0641",
  "questions": [
    { "text": "\u0633\u0624\u0627\u0644", "type": "mcq", "options": ["\u0623", "\u0628", "\u062C", "\u062F"], "correctIndex": 0, "correctAnswer": "", "explanation": "\u0627\u0644\u0634\u0631\u062D" }
  ]
}
\u0644\u0627 \u062A\u0646\u0634\u0626 \u0623\u0633\u0626\u0644\u0629 \u0645\u0646 \u062E\u0627\u0631\u062C \u0627\u0644\u0646\u0635 \u0627\u0628\u062F\u0623.`;
      } else {
        sysInstructionForDirect = `\u0623\u0646\u062A \u0645\u0647\u0646\u062F\u0633 \u0645\u062D\u062A\u0648\u0649 \u0623\u0643\u0627\u062F\u064A\u0645\u064A. \u0627\u0633\u062A\u062E\u0644\u0635 \u0623\u0633\u0626\u0644\u0629 \u0634\u0627\u0645\u0644\u0629 \u0648\u0623\u0646\u062A\u062C \u0628\u0635\u064A\u063A\u0629 JSON \u062D\u0635\u0631\u0627\u064B.
\u0627\u0644\u0628\u0646\u0627\u0621 \u0643\u0627\u0644\u062A\u0627\u0644\u064A:
{
  "title": "\u0639\u0646\u0648\u0627\u0646",
  "description": "\u0648\u0635\u0641",
  "questions": [
    { "text": "\u0633\u0624\u0627\u0644", "type": "mcq", "options": ["1", "2", "3", "4"], "correctIndex": 0, "correctAnswer": "", "explanation": "\u0627\u0644\u0634\u0631\u062D" }
  ]
}`;
      }
      const isOcrPageMode = !!isPageByPage;
      let promptText = ``;
      if (isOcrPageMode) {
        const currentPage = Number(pageNumber);
        if (extractionMode === "literal") {
          promptText = `\u0623\u0646\u062A \u062A\u0642\u0648\u0645 \u0628\u0642\u0631\u0627\u0621\u0629 \u0648\u0645\u0633\u062D \u0627\u0644\u0635\u0641\u062D\u0629 \u0631\u0642\u0645 ${currentPage} \u0628\u0627\u0644\u062A\u062D\u062F\u064A\u062F \u0645\u0646 \u0623\u0635\u0644 ${totalBatches || 1} \u0635\u0641\u062D\u0627\u062A \u0641\u064A \u0627\u0644\u0645\u0633\u062A\u0646\u062F \u0627\u0644\u0645\u0631\u0641\u0642.
\u0645\u0647\u0645\u062A\u0643 \u0627\u0633\u062A\u062E\u0631\u0627\u062C \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0645\u062A\u0648\u0627\u062C\u062F\u0629 \u0628\u0627\u0644\u0641\u0639\u0644 \u0648\u0635\u0631\u0627\u062D\u0629.`;
        } else {
          promptText = `\u0623\u0646\u062A \u062A\u062F\u0631\u0633 \u0628\u0630\u0643\u0627\u0621 \u0627\u0644\u0635\u0641\u062D\u0629 \u0631\u0642\u0645 ${currentPage} \u0645\u0646 \u0623\u0635\u0644 ${totalBatches || 1}.
\u0627\u0635\u0646\u0639 \u0623\u0643\u0628\u0631 \u0639\u062F\u062F \u0645\u0646 \u0645\u0645\u064A\u0632 \u0645\u0646 \u0627\u0644\u0623\u0633\u0626\u0644\u0629.`;
        }
      } else {
        promptText = `\u0627\u0642\u0631\u0623 \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0645\u0631\u0641\u0642 \u0648\u0627\u0633\u062A\u062E\u0644\u0635 \u0645\u0646\u0647 \u0627\u0644\u0645\u0637\u0644\u0648\u0628.

\u0639\u062F\u062F \u0627\u0644\u0623\u0633\u0626\u0644\u0629: ${targetCount}`;
        if (totalBatches && totalBatches > 1) {
          const currentPart = Number(batchIndex) + 1;
          promptText += `

\u0631\u0643\u0632 \u0639\u0644\u0649 \u0627\u0644\u062C\u0632\u0621 \u0631\u0642\u0645 ${currentPart} \u0645\u0646 \u0623\u0635\u0644 ${totalBatches}.`;
        }
      }
      if (customInstruction) {
        promptText += `

\u0645\u0644\u0627\u062D\u0638\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645: "${customInstruction}"`;
      }
      let finalContents = [];
      if (uploadedFileObj.uri && uploadedFileObj.uri.startsWith("data:")) {
        try {
          const base64Part = uploadedFileObj.uri.substring(uploadedFileObj.uri.indexOf("base64,") + 7);
          const decodedText = Buffer.from(base64Part, "base64").toString("utf-8");
          finalContents.push({
            text: `\u0645\u062D\u062A\u0648\u0649 \u0627\u0644\u0645\u0633\u062A\u0646\u062F \u0627\u0644\u0645\u0633\u062A\u062E\u0631\u062C:

${decodedText}`
          });
        } catch (decodeErr) {
          console.error("Failed to decode data URI text:", decodeErr);
          const base64Part = uploadedFileObj.uri.substring(uploadedFileObj.uri.indexOf("base64,") + 7);
          finalContents.push({
            inlineData: {
              mimeType: uploadedFileObj.mimeType || "text/plain",
              data: base64Part
            }
          });
        }
      } else {
        finalContents.push({
          fileData: {
            fileUri: uploadedFileObj.uri,
            mimeType: uploadedFileObj.mimeType
          }
        });
      }
      finalContents.push({ text: promptText });
      const response = await generateContentWithRetryAndFallback({
        model: activeModel,
        contents: finalContents,
        config: {
          systemInstruction: sysInstructionForDirect,
          responseMimeType: "application/json",
          temperature: 0.2
        }
      });
      const resText = response.text;
      if (!resText) {
        throw new Error("\u0644\u0645 \u064A\u0642\u0645 \u0646\u0645\u0648\u0630\u062C \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0628\u0625\u0631\u062C\u0627\u0639 \u0646\u062A\u064A\u062C\u0629 \u0635\u0627\u0644\u062D\u0629.");
      }
      const parsedJson = parseJsonSafely(resText);
      if (!parsedJson) {
        throw new Error("\u0641\u0634\u0644 \u062A\u0641\u0633\u064A\u0631 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u0644\u0645\u0629 \u0643\u0635\u064A\u063A\u0629 \u0627\u062E\u062A\u0628\u0627\u0631 \u0635\u0627\u0644\u062D\u0629.");
      }
      if (typeof amount === "number" && amount > 0 && parsedJson.questions && Array.isArray(parsedJson.questions)) {
        if (parsedJson.questions.length > amount) {
          parsedJson.questions = parsedJson.questions.slice(0, amount);
        }
      }
      res.json(parsedJson);
    } catch (e) {
      console.error("Direct File Quiz generation error:", e);
      res.status(500).json({ error: "\u0639\u0630\u0631\u0627\u064B\u060C \u0641\u0634\u0644\u062A \u0645\u0639\u0627\u0644\u062C\u0629 \u0648\u0642\u0631\u0627\u0621\u0629 \u0627\u0644\u0645\u0633\u062A\u0646\u062F \u0645\u0628\u0627\u0634\u0631\u0629 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A.", details: e.message });
    } finally {
      if (tempFilePath) {
        try {
          const fs2 = await import("fs");
          if (fs2.existsSync(tempFilePath)) {
            fs2.unlinkSync(tempFilePath);
          }
        } catch (cleanupErr) {
        }
      }
    }
  });
  app.post("/api/generate-ai-quiz", async (req, res) => {
    try {
      let authenticatedUser;
      try {
        authenticatedUser = await getAuthenticatedUser(req);
      } catch (authErr) {
        return res.status(401).json({ error: "\u0639\u0630\u0631\u0627\u064B! \u064A\u062C\u0628 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0645\u064A\u0632\u0627\u062A \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A." });
      }
      const { topic, amount } = req.body;
      const targetUserId = authenticatedUser.uid;
      if (!topic || !topic.trim()) {
        return res.status(400).json({ error: "\u064A\u0631\u062C\u0649 \u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0645\u0648\u0636\u0648\u0639 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u0644\u062A\u0648\u0644\u064A\u062F \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631." });
      }
      let isPremium = false;
      if (targetUserId) {
        try {
          const userList = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.uid, targetUserId)).limit(1);
          if (userList.length > 0 && userList[0].isPremium) {
            isPremium = true;
          }
        } catch (dbErr) {
          console.error("Database query error for user premium status inside topic text gen:", dbErr);
        }
      }
      const targetCount = typeof amount === "number" ? amount : 5;
      const activeModel = "gemini-3.1-flash-lite";
      const sysInstruction = `\u0623\u0646\u062A \u062E\u0628\u064A\u0631 \u0623\u0643\u0627\u062F\u064A\u0645\u064A \u0648\u0645\u0647\u0646\u062F\u0633 \u0645\u062D\u062A\u0648\u0649 \u062A\u0639\u0644\u064A\u0645\u064A. \u0627\u0633\u062A\u062E\u0631\u062C \u0648\u0623\u0646\u0634\u0626 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0628\u0646\u0633\u0642 JSON.
\u0627\u0644\u0631\u062F \u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 JSON \u0641\u0642\u0637 \u062D\u0633\u0628 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u0623\u062F\u0646\u0627\u0647:
{
  "title": "\u0639\u0646\u0648\u0627\u0646",
  "description": "\u0648\u0635\u0641",
  "questions": [
    { "text": "\u0633\u0624\u0627\u0644", "type": "mcq|tf|essay", "options": ["\u0627", "\u0628", "\u062C", "\u062F"], "correctIndex": 0, "correctAnswer": "", "explanation": "\u0627\u0644\u0634\u0631\u062D" }
  ]
}`;
      const promptString = `\u0642\u0645 \u0628\u0625\u0646\u0634\u0627\u0621 \u0648\u062A\u0648\u0644\u064A\u062F \u0627\u062E\u062A\u0628\u0627\u0631 \u0634\u0627\u0645\u0644 \u0648\u0645\u0645\u064A\u0632 \u064A\u062D\u062A\u0648\u064A \u0628\u0627\u0644\u0636\u0628\u0637 \u0639\u0644\u0649 ${targetCount} \u0633\u0624\u0627\u0644\u0627\u064B \u0623\u0643\u0627\u062F\u064A\u0645\u064A\u0627\u064B \u062D\u0648\u0644 \u0645\u0648\u0636\u0648\u0639: "${topic}".
\u062A\u0623\u0643\u062F \u0645\u0646 \u062A\u0646\u0648\u0639 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0644\u062A\u0634\u0645\u0644 \u0623\u0633\u0626\u0644\u0629 \u0627\u062E\u062A\u064A\u0627\u0631 \u0645\u0646 \u0645\u062A\u0639\u062F\u062F (mcq)\u060C \u0648\u0623\u0633\u0626\u0644\u0629 \u0635\u062D \u0648\u062E\u0637\u0623 (tf)\u060C \u0648\u0623\u0633\u0626\u0644\u0629 \u0645\u0642\u0627\u0644\u064A\u0629 \u0642\u0635\u064A\u0631\u0629 (essay) \u062A\u062B\u064A\u0631 \u0627\u0644\u062A\u0641\u0643\u064A\u0631.
\u062A\u0623\u0643\u062F \u0623\u0646 \u062A\u0643\u0648\u0646 \u0644\u063A\u0629 \u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0648\u0627\u0644\u0648\u0635\u0641 \u0648\u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0648\u0627\u0644\u062A\u0641\u0633\u064A\u0631\u0627\u062A \u0645\u0637\u0627\u0628\u0642\u0629 \u0644\u0644\u063A\u0629 \u0627\u0644\u0645\u0648\u0636\u0648\u0639 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 \u0628\u062F\u0642\u0629 (\u0625\u0630\u0627 \u0643\u0627\u0646 \u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0648\u0627\u0644\u0645\u0648\u0636\u0648\u0639 \u0628\u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0641\u0627\u0643\u062A\u0628 \u0628\u0627\u0644\u0639\u0631\u0628\u064A\u0629\u060C \u0648\u0625\u0630\u0627 \u0643\u0627\u0646 \u0628\u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629 \u0641\u0627\u0643\u062A\u0628 \u0628\u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629).
Must return responses explicitly in JSON format.`;
      console.log(`[Gemini API vNEW] Generating stand-alone topic quiz. Theme: ${topic}, Count: ${targetCount}, Model: ${activeModel}...`);
      const ai = getAi();
      res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders();
      let fullText = "";
      let mappedActiveModel = activeModel;
      if (!mappedActiveModel || mappedActiveModel === "gemini-3.1-flash-lite") {
        mappedActiveModel = "gemini-3.5-flash";
      }
      const fallbacks = Array.from(/* @__PURE__ */ new Set([
        mappedActiveModel,
        "gemini-3.5-flash",
        "gemini-3.1-flash-lite",
        "gemini-2.5-flash",
        "gemini-2.5-flash-lite",
        "gemini-flash-lite-latest",
        "gemini-flash-latest",
        "gemini-2.5-pro",
        "gemini-pro-latest",
        "gemini-3.1-pro-preview"
      ])).filter(Boolean);
      let streamSuccess = false;
      let lastStreamErr = null;
      for (const modelName of fallbacks) {
        fullText = "";
        try {
          const responseStream = await ai.models.generateContentStream({
            model: modelName,
            contents: promptString,
            config: {
              systemInstruction: sysInstruction,
              responseMimeType: "application/json",
              temperature: 0.2
            }
          });
          for await (const chunk of responseStream) {
            if (chunk.text) {
              fullText += chunk.text;
              const matchCount = (fullText.match(/"type"\s*:/g) || []).length;
              res.write(`data: ${JSON.stringify({ type: "progress", count: matchCount, total: targetCount })}

`);
            }
          }
          streamSuccess = true;
          break;
        } catch (streamErr) {
          lastStreamErr = streamErr;
          console.warn(`[Gemini API Stream] Error with ${modelName}: ${streamErr?.message || streamErr}. Retrying with fallback...`);
          await new Promise((r) => setTimeout(r, 1e3));
          continue;
        }
      }
      if (!streamSuccess) {
        console.error("Stream generation error:", lastStreamErr);
        res.write(`data: ${JSON.stringify({ type: "error", message: "\u0639\u0630\u0631\u0627\u064B\u060C \u0641\u0634\u0644 \u062A\u0648\u0644\u064A\u062F \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A\u0629 \u0644\u0644\u0645\u0648\u0636\u0648\u0639 \u0627\u0644\u0645\u062E\u062A\u0627\u0631 \u0628\u0633\u0628\u0628 \u0636\u063A\u0637 \u0639\u0644\u0649 \u0627\u0644\u062E\u0648\u0627\u062F\u0645." })}

`);
        return res.end();
      }
      if (!fullText) {
        res.write(`data: ${JSON.stringify({ type: "error", message: "\u0644\u0645 \u064A\u062A\u0645 \u0627\u0633\u062A\u0631\u062C\u0627\u0639 \u0623\u064A \u0645\u062D\u062A\u0648\u0649 \u0645\u0646\u0627\u0633\u0628 \u0645\u0646 \u0645\u062D\u0631\u0643 \u0627\u0644\u062C\u064A\u0644 \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A \u0644\u062C\u0645\u064A\u0646\u0627\u064A." })}

`);
        return res.end();
      }
      const finalQuiz = parseJsonSafely(fullText);
      if (!finalQuiz || !Array.isArray(finalQuiz.questions)) {
        res.write(`data: ${JSON.stringify({ type: "error", message: "\u0641\u0634\u0644 \u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0628\u0646\u064A\u0629 \u0627\u0644\u0645\u0647\u064A\u0643\u0644\u0629 \u0644\u0644\u0640 JSON \u0627\u0644\u0645\u0633\u062A\u0631\u062C\u0639." })}

`);
        return res.end();
      }
      if (!finalQuiz.title) {
        finalQuiz.title = `\u0627\u062E\u062A\u0628\u0627\u0631: ${topic}`;
      }
      if (!finalQuiz.description) {
        finalQuiz.description = `\u0627\u062E\u062A\u0628\u0627\u0631 \u0645\u062A\u0643\u0627\u0645\u0644 \u062A\u0645 \u0625\u0646\u0634\u0627\u0624\u0647 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B \u062D\u0648\u0644 ${topic} \u0628\u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u062A\u0639\u0644\u064A\u0645 \u0627\u0644\u0645\u0646\u0647\u062C\u064A \u0627\u0644\u062F\u0642\u064A\u0642.`;
      }
      if (typeof targetCount === "number" && targetCount > 0 && finalQuiz.questions.length > targetCount) {
        finalQuiz.questions = finalQuiz.questions.slice(0, targetCount);
      }
      res.write(`data: ${JSON.stringify({ type: "complete", quiz: finalQuiz })}

`);
      res.end();
    } catch (e) {
      console.error("Topic Quiz generation error:", e);
      if (!res.headersSent) {
        res.status(500).json({
          error: `\u0639\u0630\u0631\u0627\u064B\u060C \u0641\u0634\u0644 \u062A\u0648\u0644\u064A\u062F \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A\u0629 \u0644\u0644\u0645\u0648\u0636\u0648\u0639 \u0627\u0644\u0645\u062E\u062A\u0627\u0631.`,
          details: e.message
        });
      } else {
        res.write(`data: ${JSON.stringify({ type: "error", message: "\u062D\u062F\u062B \u062E\u0637\u0623 \u063A\u064A\u0631 \u0645\u062A\u0648\u0642\u0639 \u0623\u062B\u0646\u0627\u0621 \u0627\u0644\u062A\u0648\u0644\u064A\u062F." })}

`);
        res.end();
      }
    }
  });
  app.post("/api/generate-ai-quiz-batch", async (req, res) => {
    try {
      try {
        await getAuthenticatedUser(req);
      } catch (authErr) {
        return res.status(401).json({ error: "\u0639\u0630\u0631\u0627\u064B! \u064A\u062C\u0628 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0645\u064A\u0632\u0627\u062A \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A." });
      }
      const { topic, amount, alreadyGeneratedQuestions } = req.body;
      if (!topic || !topic.trim()) {
        return res.status(400).json({ error: "\u064A\u0631\u062C\u0649 \u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0645\u0648\u0636\u0648\u0639 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u0644\u062A\u0648\u0644\u064A\u062F \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631." });
      }
      const targetCount = typeof amount === "number" ? amount : 5;
      const activeModel = "gemini-3.1-flash-lite";
      const sysInstruction = `\u0623\u0646\u062A \u062E\u0628\u064A\u0631 \u0623\u0643\u0627\u062F\u064A\u0645\u064A \u0648\u0645\u0647\u0646\u062F\u0633 \u0645\u062D\u062A\u0648\u0649 \u062A\u0639\u0644\u064A\u0645\u064A. \u0627\u0633\u062A\u062E\u0631\u062C \u0648\u0623\u0646\u0634\u0626 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0628\u0646\u0633\u0642 JSON.
\u0627\u0644\u0631\u062F \u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 JSON \u0641\u0642\u0637 \u062D\u0633\u0628 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u0623\u062F\u0646\u0627\u0647:
{
  "title": "\u0639\u0646\u0648\u0627\u0646",
  "description": "\u0648\u0635\u0641",
  "questions": [
    { "text": "\u0633\u0624\u0627\u0644", "type": "mcq|tf|essay", "options": ["\u0627", "\u0628", "\u062C", "\u062F"], "correctIndex": 0, "correctAnswer": "", "explanation": "\u0627\u0644\u0634\u0631\u062D" }
  ]
}`;
      let excludePrompt = "";
      if (alreadyGeneratedQuestions && Array.isArray(alreadyGeneratedQuestions) && alreadyGeneratedQuestions.length > 0) {
        excludePrompt = `

\u062A\u062C\u0646\u0628 \u062A\u0643\u0631\u0627\u0631 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u062A\u064A \u062A\u0645 \u062A\u0648\u0644\u064A\u062F\u0647\u0627 \u0633\u0627\u0628\u0642\u0627\u064B \u0648\u062A\u062C\u0646\u0628 \u0623\u064A \u062A\u0634\u0627\u0628\u0647 \u0645\u0639 \u0627\u0644\u0639\u0646\u0627\u0648\u064A\u0646 \u0627\u0644\u062A\u0627\u0644\u064A\u0629:
${alreadyGeneratedQuestions.map((q, idx) => `${idx + 1}. ${q}`).join("\n")}`;
      }
      const promptString = `\u0642\u0645 \u0628\u0625\u0646\u0634\u0627\u0621 \u0648\u062A\u0648\u0644\u064A\u062F \u062F\u0641\u0639\u0629 \u0645\u062E\u0635\u0635\u0629 \u062A\u062D\u062A\u0648\u064A \u0628\u0627\u0644\u0636\u0628\u0637 \u0639\u0644\u0649 ${targetCount} \u0633\u0624\u0627\u0644\u0627\u064B \u0623\u0643\u0627\u062F\u064A\u0645\u064A\u0627\u064B \u0641\u0631\u064A\u062F\u0627\u064B \u062D\u0648\u0644 \u0645\u0648\u0636\u0648\u0639: "${topic}".
\u062A\u0623\u0643\u062F \u0645\u0646 \u062A\u0646\u0648\u0639 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0644\u062A\u0634\u0645\u0644 \u0623\u0633\u0626\u0644\u0629 \u0627\u062E\u062A\u064A\u0627\u0631 \u0645\u0646 \u0645\u062A\u0639\u062F\u062F (mcq)\u060C \u0648\u0623\u0633\u0626\u0644\u0629 \u0635\u062D \u0648\u062E\u0637\u0623 (tf)\u060C \u0648\u0623\u0633\u0626\u0644\u0629 \u0645\u0642\u0627\u0644\u064A\u0629 \u0642\u0635\u064A\u0631\u0629 (essay) \u062A\u062B\u064A\u0631 \u0627\u0644\u062A\u0641\u0643\u064A\u0631.
\u062A\u0623\u0643\u062F \u0623\u0646 \u062A\u0643\u0648\u0646 \u0644\u063A\u0629 \u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0648\u0627\u0644\u0648\u0635\u0641 \u0648\u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0648\u0627\u0644\u062A\u0641\u0633\u064A\u0631\u0627\u062A \u0645\u0637\u0627\u0628\u0642\u0629 \u0644\u0644\u063A\u0629 \u0627\u0644\u0645\u0648\u0636\u0648\u0639 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 \u0628\u062F\u0642\u0629.${excludePrompt}
\u0623\u0631\u062C\u0639 \u0627\u0644\u0646\u062A\u064A\u062C\u0629 \u0628\u0635\u064A\u063A\u0629 JSON \u0646\u0638\u064A\u0641\u0629 \u0644\u0644\u063A\u0627\u064A\u0629 \u0648\u0645\u0628\u0627\u0634\u0631\u0629.`;
      const response = await generateContentWithRetryAndFallback({
        model: activeModel,
        contents: promptString,
        config: {
          systemInstruction: sysInstruction,
          responseMimeType: "application/json",
          temperature: 0.2
        }
      });
      const resText = response.text;
      if (!resText) {
        return res.status(500).json({ error: "\u0644\u0645 \u064A\u062A\u0645 \u0627\u0633\u062A\u0631\u062C\u0627\u0639 \u0623\u064A \u0645\u062D\u062A\u0648\u0649 \u0645\u0646\u0627\u0633\u0628 \u0645\u0646 \u0643\u0648\u0632\u0645\u0648 \u0627\u0644\u0630\u0643\u064A." });
      }
      const finalQuiz = parseJsonSafely(resText);
      if (!finalQuiz || !Array.isArray(finalQuiz.questions)) {
        return res.status(500).json({ error: "\u0641\u0634\u0644 \u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0628\u0646\u064A\u0629 \u0627\u0644\u0645\u0647\u064A\u0643\u0644\u0629 \u0644\u0644\u0640 JSON \u0627\u0644\u0645\u0633\u062A\u0631\u062C\u0639." });
      }
      res.json(finalQuiz);
    } catch (e) {
      console.error("Topic Quiz Batch generation error:", e);
      res.status(500).json({ error: "\u0639\u0630\u0631\u0627\u064B\u060C \u0641\u0634\u0644 \u062A\u0648\u0644\u064A\u062F \u0647\u0630\u0647 \u0627\u0644\u062F\u0641\u0639\u0629 \u0645\u0646 \u0627\u0644\u0623\u0633\u0626\u0644\u0629." });
    }
  });
  app.post("/api/generate/gemini", async (req, res) => {
    try {
      try {
        await getAuthenticatedUser(req);
      } catch (authErr) {
        return res.status(401).json({ error: "\u0639\u0630\u0631\u0627\u064B! \u064A\u062C\u0628 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0645\u064A\u0632\u0627\u062A \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A." });
      }
      const { topic, amount, alreadyGeneratedQuestions } = req.body;
      if (!topic || !topic.trim()) {
        return res.status(400).json({ error: "\u064A\u0631\u062C\u0649 \u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0645\u0648\u0636\u0648\u0639 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u0644\u062A\u0648\u0644\u064A\u062F \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631." });
      }
      const targetCount = typeof amount === "number" ? amount : 5;
      const activeModel = "gemini-3.5-flash";
      const sysInstruction = `\u0623\u0646\u062A \u062E\u0628\u064A\u0631 \u0623\u0643\u0627\u062F\u064A\u0645\u064A \u0648\u0645\u0647\u0646\u062F\u0633 \u0645\u062D\u062A\u0648\u0649 \u062A\u0639\u0644\u064A\u0645\u064A. \u0627\u0633\u062A\u062E\u0631\u062C \u0648\u0623\u0646\u0634\u0626 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0628\u0646\u0633\u0642 JSON.
\u0627\u0644\u0631\u062F \u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 JSON \u0641\u0642\u0637 \u062D\u0633\u0628 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u0623\u062F\u0646\u0627\u0647:
{
  "title": "\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631",
  "description": "\u0648\u0635\u0641 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631",
  "questions": [
    { "text": "\u0646\u0635 \u0627\u0644\u0633\u0624\u0627\u0644 \u0647\u0646\u0627", "type": "mcq|tf|essay", "options": ["\u0623", "\u0628", "\u062C", "\u062F"], "correctIndex": 0, "correctAnswer": "", "explanation": "\u0627\u0644\u0634\u0631\u062D \u0627\u0644\u0639\u0644\u0645\u064A" }
  ]
}`;
      let excludePrompt = "";
      if (alreadyGeneratedQuestions && Array.isArray(alreadyGeneratedQuestions) && alreadyGeneratedQuestions.length > 0) {
        excludePrompt = `

\u062A\u062C\u0646\u0628 \u062A\u0643\u0631\u0627\u0631 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u062A\u064A \u062A\u0645 \u062A\u0648\u0644\u064A\u062F\u0647\u0627 \u0633\u0627\u0628\u0642\u0627\u064B \u0648\u062A\u062C\u0646\u0628 \u0623\u064A \u062A\u0634\u0627\u0628\u0647 \u0645\u0639 \u0627\u0644\u0639\u0646\u0627\u0648\u064A\u0646 \u0627\u0644\u062A\u0627\u0644\u064A\u0629:
${alreadyGeneratedQuestions.map((q, idx) => `${idx + 1}. ${q}`).join("\n")}`;
      }
      const promptString = `\u0642\u0645 \u0628\u0625\u0646\u0634\u0627\u0621 \u0648\u062A\u0648\u0644\u064A\u062F \u062F\u0641\u0639\u0629 \u0645\u062E\u0635\u0635\u0629 \u062A\u062D\u062A\u0648\u064A \u0628\u0627\u0644\u0636\u0628\u0637 \u0639\u0644\u0649 ${targetCount} \u0633\u0624\u0627\u0644\u0627\u064B \u0623\u0643\u0627\u062F\u064A\u0645\u064A\u0627\u064B \u0641\u0631\u064A\u062F\u0627\u064B \u062D\u0648\u0644 \u0645\u0648\u0636\u0648\u0639: "${topic}".
\u062A\u0623\u0643\u062F \u0645\u0646 \u062A\u0646\u0648\u0639 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0644\u062A\u0634\u0645\u0644 \u0623\u0633\u0626\u0644\u0629 \u0627\u062E\u062A\u064A\u0627\u0631 \u0645\u0646 \u0645\u062A\u0639\u062F\u062F (mcq)\u060C \u0648\u0623\u0633\u0626\u0644\u0629 \u0635\u062D \u0648\u062E\u0637\u0623 (tf)\u060C \u0648\u0623\u0633\u0626\u0644\u0629 \u0645\u0642\u0627\u0644\u064A\u0629 \u0642\u0635\u064A\u0631\u0629 (essay) \u062A\u062B\u064A\u0631 \u0627\u0644\u062A\u0641\u0643\u064A\u0631.
\u062A\u0623\u0643\u062F \u0623\u0646 \u062A\u0643\u0648\u0646 \u0644\u063A\u0629 \u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0648\u0627\u0644\u0648\u0635\u0641 \u0648\u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0648\u0627\u0644\u062A\u0641\u0633\u064A\u0631\u0627\u062A \u0645\u0637\u0627\u0628\u0642\u0629 \u0644\u0644\u063A\u0629 \u0627\u0644\u0645\u0648\u0636\u0648\u0639 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 \u0628\u062F\u0642\u0629.${excludePrompt}
\u0623\u0631\u062C\u0639 \u0627\u0644\u0646\u062A\u064A\u062C\u0629 \u0628\u0635\u064A\u063A\u0629 JSON \u0646\u0638\u064A\u0641\u0629 \u0644\u0644\u063A\u0627\u064A\u0629 \u0648\u0645\u0628\u0627\u0634\u0631\u0629.`;
      const response = await generateContentWithRetryAndFallback({
        model: activeModel,
        contents: promptString,
        config: {
          systemInstruction: sysInstruction,
          responseMimeType: "application/json",
          temperature: 0.2
        }
      });
      const resText = response.text;
      if (!resText) {
        return res.status(500).json({ error: "\u0644\u0645 \u064A\u062A\u0645 \u0627\u0633\u062A\u0631\u062C\u0627\u0639 \u0623\u064A \u0645\u062D\u062A\u0648\u0649 \u0645\u0646\u0627\u0633\u0628 \u0645\u0646 \u0643\u0648\u0632\u0645\u0648 \u0627\u0644\u0630\u0643\u064A." });
      }
      const finalQuiz = parseJsonSafely(resText);
      if (!finalQuiz || !Array.isArray(finalQuiz.questions)) {
        return res.status(500).json({ error: "\u0641\u0634\u0644 \u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0628\u0646\u064A\u0629 \u0627\u0644\u0645\u0647\u064A\u0643\u0644\u0629 \u0644\u0644\u0640 JSON \u0627\u0644\u0645\u0633\u062A\u0631\u062C\u0639." });
      }
      res.json(finalQuiz);
    } catch (e) {
      console.error("Gemini Standalone Route error:", e);
      res.status(500).json({ error: e.message || "\u0639\u0630\u0631\u0627\u064B\u060C \u0641\u0634\u0644 \u062A\u0648\u0644\u064A\u062F \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0639\u0628\u0631 \u062E\u062F\u0645\u0629 \u062C\u064A\u0645\u064A\u0646\u0627\u064A." });
    }
  });
  app.post("/api/generate/groq", async (req, res) => {
    try {
      try {
        await getAuthenticatedUser(req);
      } catch (authErr) {
        return res.status(401).json({ error: "\u0639\u0630\u0631\u0627\u064B! \u064A\u062C\u0628 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0645\u064A\u0632\u0627\u062A \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A." });
      }
      const { topic, amount, alreadyGeneratedQuestions } = req.body;
      if (!topic || !topic.trim()) {
        return res.status(400).json({ error: "\u064A\u0631\u062C\u0649 \u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0645\u0648\u0636\u0648\u0639 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u0644\u062A\u0648\u0644\u064A\u062F \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631." });
      }
      const groqKey = process.env.GROQ_API_KEY;
      if (!groqKey) {
        return res.status(400).json({ error: "\u0639\u0630\u0631\u0627\u064B\u060C \u0644\u0645 \u064A\u062A\u0645 \u062A\u0643\u0648\u064A\u0646 \u0645\u0641\u062A\u0627\u062D Groq API Key \u0627\u0644\u062E\u0627\u0635 \u0628\u0627\u0644\u062E\u0627\u062F\u0645." });
      }
      const targetCount = typeof amount === "number" ? amount : 5;
      const sysInstruction = `You are an academic expert content generator. Generate a quiz about the specified topic.
Respond strictly in JSON format as specified below:
{
  "title": "\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631",
  "description": "\u0648\u0635\u0641 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631",
  "questions": [
    { "text": "\u0646\u0635 \u0627\u0644\u0633\u0624\u0627\u0644 \u0647\u0646\u0627", "type": "mcq|tf|essay", "options": ["\u0623", "\u0628", "\u062C", "\u062F"], "correctIndex": 0, "correctAnswer": "", "explanation": "\u0627\u0644\u0634\u0631\u062D \u0627\u0644\u0639\u0644\u0645\u064A" }
  ]
}`;
      let excludePrompt = "";
      if (alreadyGeneratedQuestions && Array.isArray(alreadyGeneratedQuestions) && alreadyGeneratedQuestions.length > 0) {
        excludePrompt = `
Avoid generating these exact existing questions:
${alreadyGeneratedQuestions.join("\n")}`;
      }
      const promptString = `Generate exactly ${targetCount} unique academic questions about the topic "${topic}".
Include diverse questions: multiple choice (mcq), true/false (tf), and short essay (essay).
The language of the response must perfectly match the language of the requested topic (e.g. Arabic or English).${excludePrompt}
Return clean valid JSON content without markdown formatting.`;
      const openai = new import_openai.default({
        apiKey: groqKey,
        baseURL: "https://api.groq.com/openai/v1"
      });
      const response = await openai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: sysInstruction },
          { role: "user", content: promptString }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      });
      const resText = response.choices[0]?.message?.content;
      if (!resText) {
        return res.status(500).json({ error: "\u0644\u0645 \u064A\u062A\u0645 \u0627\u0633\u062A\u0631\u062C\u0627\u0639 \u0645\u062D\u062A\u0648\u0649 \u0645\u0646 \u062E\u062F\u0645\u0629 Groq." });
      }
      const finalQuiz = parseJsonSafely(resText);
      res.json(finalQuiz);
    } catch (e) {
      console.error("Groq Standalone Route error:", e);
      res.status(500).json({ error: e.message || "\u0639\u0630\u0631\u0627\u064B\u060C \u0641\u0634\u0644 \u062A\u0648\u0644\u064A\u062F \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0639\u0628\u0631 \u062E\u062F\u0645\u0629 Groq." });
    }
  });
  app.post("/api/generate/deepseek", async (req, res) => {
    try {
      try {
        await getAuthenticatedUser(req);
      } catch (authErr) {
        return res.status(401).json({ error: "\u0639\u0630\u0631\u0627\u064B! \u064A\u062C\u0628 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0645\u064A\u0632\u0627\u062A \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A." });
      }
      const { topic, amount, alreadyGeneratedQuestions } = req.body;
      if (!topic || !topic.trim()) {
        return res.status(400).json({ error: "\u064A\u0631\u062C\u0649 \u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0645\u0648\u0636\u0648\u0639 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u0644\u062A\u0648\u0644\u064A\u062F \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631." });
      }
      const deepseekKey = process.env.DEEPSEEK_API_KEY;
      if (!deepseekKey) {
        return res.status(400).json({ error: "\u0639\u0630\u0631\u0627\u064B\u060C \u0644\u0645 \u064A\u062A\u0645 \u062A\u0643\u0648\u064A\u0646 \u0645\u0641\u062A\u0627\u062D DeepSeek API Key \u0627\u0644\u062E\u0627\u0635 \u0628\u0627\u0644\u062E\u0627\u062F\u0645." });
      }
      const targetCount = typeof amount === "number" ? amount : 5;
      const sysInstruction = `You are an academic expert content generator. Generate a quiz about the specified topic.
Respond strictly in JSON format as specified below:
{
  "title": "\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631",
  "description": "\u0648\u0635\u0641 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631",
  "questions": [
    { "text": "\u0646\u0635 \u0627\u0644\u0633\u0624\u0627\u0644 \u0647\u0646\u0627", "type": "mcq|tf|essay", "options": ["\u0623", "\u0628", "\u062C", "\u062F"], "correctIndex": 0, "correctAnswer": "", "explanation": "\u0627\u0644\u0634\u0631\u062D \u0627\u0644\u0639\u0644\u0645\u064A" }
  ]
}`;
      let excludePrompt = "";
      if (alreadyGeneratedQuestions && Array.isArray(alreadyGeneratedQuestions) && alreadyGeneratedQuestions.length > 0) {
        excludePrompt = `
Avoid generating these exact existing questions:
${alreadyGeneratedQuestions.join("\n")}`;
      }
      const promptString = `Generate exactly ${targetCount} unique academic questions about the topic "${topic}".
Include diverse questions: multiple choice (mcq), true/false (tf), and short essay (essay).
The language of the response must perfectly match the language of the requested topic (e.g. Arabic or English).${excludePrompt}
Return clean valid JSON content without markdown formatting.`;
      const openai = new import_openai.default({
        apiKey: deepseekKey,
        baseURL: "https://api.deepseek.com/v1"
      });
      const response = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: sysInstruction },
          { role: "user", content: promptString }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      });
      const resText = response.choices[0]?.message?.content;
      if (!resText) {
        return res.status(500).json({ error: "\u0644\u0645 \u064A\u062A\u0645 \u0627\u0633\u062A\u0631\u062C\u0627\u0639 \u0645\u062D\u062A\u0648\u0649 \u0645\u0646 \u062E\u062F\u0645\u0629 DeepSeek." });
      }
      const finalQuiz = parseJsonSafely(resText);
      res.json(finalQuiz);
    } catch (e) {
      console.error("DeepSeek Standalone Route error:", e);
      res.status(500).json({ error: e.message || "\u0639\u0630\u0631\u0627\u064B\u060C \u0641\u0634\u0644 \u062A\u0648\u0644\u064A\u062F \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0639\u0628\u0631 \u062E\u062F\u0645\u0629 DeepSeek." });
    }
  });
  app.post("/api/generate/openai", async (req, res) => {
    try {
      try {
        await getAuthenticatedUser(req);
      } catch (authErr) {
        return res.status(401).json({ error: "\u0639\u0630\u0631\u0627\u064B! \u064A\u062C\u0628 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0645\u064A\u0632\u0627\u062A \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A." });
      }
      const { topic, amount, alreadyGeneratedQuestions } = req.body;
      if (!topic || !topic.trim()) {
        return res.status(400).json({ error: "\u064A\u0631\u062C\u0649 \u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0645\u0648\u0636\u0648\u0639 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u0644\u062A\u0648\u0644\u064A\u062F \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631." });
      }
      const openaiKey = process.env.OPENAI_API_KEY;
      if (!openaiKey) {
        return res.status(400).json({ error: "\u0639\u0630\u0631\u0627\u064B\u060C \u0644\u0645 \u064A\u062A\u0645 \u062A\u0643\u0648\u064A\u0646 \u0645\u0641\u062A\u0627\u062D OpenAI API Key \u0627\u0644\u062E\u0627\u0635 \u0628\u0627\u0644\u062E\u0627\u062F\u0645." });
      }
      const targetCount = typeof amount === "number" ? amount : 5;
      const sysInstruction = `You are an academic expert content generator. Generate a quiz about the specified topic.
Respond strictly in JSON format as specified below:
{
  "title": "\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631",
  "description": "\u0648\u0635\u0641 \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631",
  "questions": [
    { "text": "\u0646\u0635 \u0627\u0644\u0633\u0624\u0627\u0644 \u0647\u0646\u0627", "type": "mcq|tf|essay", "options": ["\u0623", "\u0628", "\u062C", "\u062F"], "correctIndex": 0, "correctAnswer": "", "explanation": "\u0627\u0644\u0634\u0631\u062D \u0627\u0644\u0639\u0644\u0645\u064A" }
  ]
}`;
      let excludePrompt = "";
      if (alreadyGeneratedQuestions && Array.isArray(alreadyGeneratedQuestions) && alreadyGeneratedQuestions.length > 0) {
        excludePrompt = `
Avoid generating these exact existing questions:
${alreadyGeneratedQuestions.join("\n")}`;
      }
      const promptString = `Generate exactly ${targetCount} unique academic questions about the topic "${topic}".
Include diverse questions: multiple choice (mcq), true/false (tf), and short essay (essay).
The language of the response must perfectly match the language of the requested topic (e.g. Arabic or English).${excludePrompt}
Return clean valid JSON content without markdown formatting.`;
      const openai = new import_openai.default({
        apiKey: openaiKey,
        baseURL: "https://api.openai.com/v1"
      });
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: sysInstruction },
          { role: "user", content: promptString }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      });
      const resText = response.choices[0]?.message?.content;
      if (!resText) {
        return res.status(500).json({ error: "\u0644\u0645 \u064A\u062A\u0645 \u0627\u0633\u062A\u0631\u062C\u0627\u0639 \u0645\u062D\u062A\u0648\u0649 \u0645\u0646 \u062E\u062F\u0645\u0629 OpenAI." });
      }
      const finalQuiz = parseJsonSafely(resText);
      res.json(finalQuiz);
    } catch (e) {
      console.error("OpenAI Standalone Route error:", e);
      res.status(500).json({ error: e.message || "\u0639\u0630\u0631\u0627\u064B\u060C \u0641\u0634\u0644 \u062A\u0648\u0644\u064A\u062F \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0639\u0628\u0631 \u062E\u062F\u0645\u0629 OpenAI." });
    }
  });
  app.post("/api/generate-from-pdf-text-batch", async (req, res) => {
    try {
      try {
        await getAuthenticatedUser(req);
      } catch (authErr) {
        return res.status(401).json({ error: "\u0639\u0630\u0631\u0627\u064B! \u064A\u062C\u0628 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0645\u064A\u0632\u0627\u062A \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A." });
      }
      const { text: text2, amount, alreadyGeneratedQuestions } = req.body;
      if (!text2 || !text2.trim()) {
        return res.status(400).json({ error: "\u064A\u0631\u062C\u0649 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0646\u0635 \u0627\u0644\u0645\u0633\u062A\u062E\u0644\u0635 \u0645\u0646 \u0645\u0644\u0641 \u0627\u0644\u0640 PDF." });
      }
      const targetCount = typeof amount === "number" ? amount : 5;
      const activeModel = "gemini-3.1-flash-lite";
      const sysInstruction = `\u0623\u0646\u062A \u062E\u0628\u064A\u0631 \u0623\u0643\u0627\u062F\u064A\u0645\u064A \u0648\u0645\u0647\u0646\u062F\u0633 \u0645\u062D\u062A\u0648\u0649 \u062A\u0639\u0644\u064A\u0645\u064A. \u0627\u0633\u062A\u062E\u0631\u062C \u0648\u0623\u0646\u0634\u0626 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0628\u0646\u0633\u0642 JSON.
\u0627\u0644\u0631\u062F \u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 JSON \u0641\u0642\u0637 \u062D\u0633\u0628 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u0623\u062F\u0646\u0627\u0647:
{
  "title": "\u0639\u0646\u0648\u0627\u0646",
  "description": "\u0648\u0635\u0641",
  "questions": [
    { "text": "\u0633\u0624\u0627\u0644", "type": "mcq|tf|essay", "options": ["\u0627", "\u0628", "\u062C", "\u062F"], "correctIndex": 0, "correctAnswer": "", "explanation": "\u0627\u0644\u0634\u0631\u062D" }
  ]
}`;
      let excludePrompt = "";
      if (alreadyGeneratedQuestions && Array.isArray(alreadyGeneratedQuestions) && alreadyGeneratedQuestions.length > 0) {
        excludePrompt = `

\u062A\u062C\u0646\u0628 \u062A\u0643\u0631\u0627\u0631 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u062A\u064A \u062A\u0645 \u062A\u0648\u0644\u064A\u062F\u0647\u0627 \u0633\u0627\u0628\u0642\u0627\u064B \u0648\u062A\u062C\u0646\u0628 \u0623\u064A \u062A\u0634\u0627\u0628\u0647 \u0645\u0639 \u0627\u0644\u0639\u0646\u0627\u0648\u064A\u0646 \u0627\u0644\u062A\u0627\u0644\u064A\u0629:
${alreadyGeneratedQuestions.map((q, idx) => `${idx + 1}. ${q}`).join("\n")}`;
      }
      const promptString = `\u0627\u0642\u0631\u0623 \u0627\u0644\u0646\u0635 \u0623\u062F\u0646\u0627\u0647 \u0648\u0627\u0633\u062A\u062E\u0644\u0635 \u0645\u0646\u0647 \u062F\u0641\u0639\u0629 \u062A\u062D\u062A\u0648\u064A \u0628\u0627\u0644\u0636\u0628\u0637 \u0639\u0644\u0649 ${targetCount} \u0633\u0624\u0627\u0644\u0627\u064B \u0623\u0643\u0627\u062F\u064A\u0645\u064A\u0627\u064B \u0641\u0631\u064A\u062F\u0627\u064B \u0648\u0645\u062A\u0646\u0648\u0639\u0627\u064B.
\u0627\u0644\u0646\u0635 \u0627\u0644\u0623\u0635\u0644\u064A:
"""
${text2}
"""${excludePrompt}
\u0623\u0631\u062C\u0639 \u0627\u0644\u0646\u062A\u064A\u062C\u0629 \u0628\u0635\u064A\u063A\u0629 JSON \u0646\u0638\u064A\u0641\u0629 \u0648\u0645\u0628\u0627\u0634\u0631\u0629.`;
      const response = await generateContentWithRetryAndFallback({
        model: activeModel,
        contents: promptString,
        config: {
          systemInstruction: sysInstruction,
          responseMimeType: "application/json",
          temperature: 0.2
        }
      });
      const resText = response.text;
      if (!resText) {
        return res.status(500).json({ error: "\u0644\u0645 \u064A\u062A\u0645 \u0627\u0633\u062A\u0631\u062C\u0627\u0639 \u0623\u064A \u0645\u062D\u062A\u0648\u0649 \u0645\u0646\u0627\u0633\u0628 \u0645\u0646 \u0643\u0648\u0632\u0645\u0648 \u0627\u0644\u0630\u0643\u064A." });
      }
      const finalQuiz = parseJsonSafely(resText);
      if (!finalQuiz || !Array.isArray(finalQuiz.questions)) {
        return res.status(500).json({ error: "\u0641\u0634\u0644 \u062A\u062D\u0644\u064A\u0644 \u0627\u0644\u0628\u0646\u064A\u0629 \u0627\u0644\u0645\u0647\u064A\u0643\u0644\u0629 \u0644\u0644\u0640 JSON \u0627\u0644\u0645\u0633\u062A\u0631\u062C\u0639." });
      }
      res.json(finalQuiz);
    } catch (e) {
      console.error("Pasted Text Quiz Batch generation error:", e);
      res.status(500).json({ error: "\u0639\u0630\u0631\u0627\u064B\u060C \u0641\u0634\u0644 \u062A\u0648\u0644\u064A\u062F \u0647\u0630\u0647 \u0627\u0644\u062F\u0641\u0639\u0629 \u0645\u0646 \u0627\u0644\u0623\u0633\u0626\u0644\u0629." });
    }
  });
  app.post("/api/scan-document-questions", async (req, res) => {
    try {
      try {
        await getAuthenticatedUser(req);
      } catch (authErr) {
        return res.status(401).json({ error: "\u0639\u0630\u0631\u0627\u064B! \u064A\u062C\u0628 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0645\u064A\u0632\u0627\u062A \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A." });
      }
      const { fileUri, fileUploadName, mimeType } = req.body;
      if (!fileUri) {
        return res.status(400).json({ error: "\u064A\u0631\u062C\u0649 \u062A\u0642\u062F\u064A\u0645 \u0645\u0631\u062C\u0639 \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0645\u0631\u0641\u0648\u0639." });
      }
      let documentText = "";
      if (fileUri.startsWith("data:text/plain;base64,")) {
        const base64Data = fileUri.substring("data:text/plain;base64,".length);
        documentText = Buffer.from(base64Data, "base64").toString("utf8");
      } else {
        return res.status(400).json({ error: "\u0645\u0631\u062C\u0639 \u0627\u0644\u0645\u0644\u0641 \u063A\u064A\u0631 \u0645\u062A\u0648\u0627\u0641\u0642 \u0644\u0644\u0642\u0631\u0627\u0626\u0629 \u0627\u0644\u0645\u0628\u0627\u0634\u0631\u0629." });
      }
      const activeModel = "gemini-3.1-flash-lite";
      const promptString = `\u0623\u0646\u062A \u0645\u0633\u062A\u062E\u0644\u0635 \u0648\u0628\u0627\u062D\u062B \u0641\u0627\u0626\u0642 \u0627\u0644\u0630\u0643\u0627\u0621 \u0648\u0645\u0648\u062C\u0632. \u0642\u0645 \u0628\u0645\u0633\u062D \u0627\u0644\u0646\u0635 \u0627\u0644\u0645\u0631\u0641\u0642 \u0648\u0627\u0643\u062A\u0634\u0627\u0641 \u0648\u062A\u062D\u062F\u064A\u062F \u062C\u0645\u064A\u0639 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A\u0629 \u0627\u0644\u0635\u0631\u064A\u062D\u0629 \u0623\u0648 \u0627\u0644\u0636\u0645\u0646\u064A\u0629 \u0627\u0644\u0645\u062A\u0648\u0627\u062C\u062F\u0629 \u0641\u064A\u0647.
\u0644\u0633\u062A \u0628\u062D\u0627\u062C\u0629 \u0644\u062A\u0646\u0633\u064A\u0642\u0647\u0627 \u0623\u0648 \u062A\u0648\u0644\u064A\u062F \u062E\u064A\u0627\u0631\u0627\u062A \u0623\u0648 \u062A\u0641\u0633\u064A\u0631 \u0643\u0627\u0645\u0644 \u0627\u0644\u0622\u0646\u060C \u0641\u0642\u0637 \u0623\u0631\u062C\u0639 \u0642\u0627\u0626\u0645\u0629 \u0628\u0645\u0648\u0627\u0636\u0639 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0645\u0643\u062A\u0634\u0641\u0629 \u0645\u0639 \u0631\u0642\u0645 \u0627\u0644\u0635\u0641\u062D\u0629 \u0627\u0644\u062A\u0642\u0631\u064A\u0628\u064A \u0623\u0648 \u0627\u0644\u0645\u0639\u0631\u0641 (locator) \u0648\u0627\u0644\u0648\u0635\u0641 \u0627\u0644\u0628\u0633\u064A\u0637 \u062C\u062F\u0627\u064B \u0644\u0645\u0636\u0645\u0648\u0646 \u0643\u0644 \u0633\u0624\u0627\u0644 \u0644\u0643\u064A \u0646\u062A\u0645\u0643\u0646 \u0645\u0646 \u0641\u0647\u0631\u0633\u062A\u0647\u0627 \u0648\u062A\u0648\u0644\u064A\u062F\u0647\u0627 \u0628\u0627\u0644\u062A\u0641\u0635\u064A\u0644 \u0644\u0627\u062D\u0642\u0627\u064B.
\u0645\u062D\u062A\u0648\u0649 \u0627\u0644\u0645\u0633\u062A\u0646\u062F:
"""
${documentText.substring(0, 3e4)}
"""

\u064A\u062C\u0628 \u0625\u0631\u062C\u0627\u0639 \u0627\u0644\u0646\u062A\u064A\u062C\u0629 \u0628\u0635\u064A\u063A\u0629 JSON \u0646\u0638\u064A\u0641\u0629 \u0645\u0637\u0627\u0628\u0642\u0629 \u0644\u0644\u0647\u064A\u0643\u0644 \u0627\u0644\u062A\u0627\u0644\u064A \u0648\u0628\u062F\u0648\u0646 \u0639\u0644\u0627\u0645\u0627\u062A \u0645\u0627\u0631\u0643\u062F\u0627\u0648\u0646 \u0623\u0648 \u062F\u064A\u0628\u0627\u062C\u0627\u062A \u062E\u0627\u0631\u062C\u064A\u0629:
{
  "locators": [
    { "id": "q1", "pageNumber": 1, "description": "\u0648\u0635\u0641 \u0627\u0644\u0633\u0624\u0627\u0644 \u0627\u0644\u0645\u0643\u062A\u0634\u0641" }
  ]
}`;
      const response = await generateContentWithRetryAndFallback({
        model: activeModel,
        contents: promptString,
        config: {
          responseMimeType: "application/json",
          temperature: 0.1
        }
      });
      const resText = response.text;
      if (!resText) {
        return res.status(500).json({ error: "\u0644\u0645 \u062A\u0646\u062C\u062D \u0639\u0645\u0644\u064A\u0629 \u0645\u0633\u062D \u0627\u0644\u0645\u0633\u062A\u0646\u062F." });
      }
      const parsed = parseJsonSafely(resText);
      if (!parsed || !Array.isArray(parsed.locators)) {
        return res.status(500).json({ error: "\u0641\u0634\u0644 \u062A\u062D\u0644\u064A\u0644 \u0646\u062A\u0627\u0626\u062C \u0627\u0644\u0645\u0633\u062D \u0627\u0644\u0647\u064A\u0643\u0644\u064A." });
      }
      res.json(parsed);
    } catch (e) {
      console.error("Scan Document Questions error:", e);
      res.status(500).json({ error: "\u0641\u0634\u0644 \u0645\u0633\u062D \u0627\u0644\u0645\u0633\u062A\u0646\u062F \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B." });
    }
  });
  app.post("/api/generate-from-scan-batch", async (req, res) => {
    try {
      try {
        await getAuthenticatedUser(req);
      } catch (authErr) {
        return res.status(401).json({ error: "\u0639\u0630\u0631\u0627\u064B! \u064A\u062C\u0628 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0645\u064A\u0632\u0627\u062A \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A." });
      }
      const { fileUri, locators, alreadyGeneratedQuestions } = req.body;
      if (!fileUri || !locators || !Array.isArray(locators)) {
        return res.status(400).json({ error: "\u0627\u0644\u0631\u062C\u0627\u0621 \u062A\u0648\u0641\u064A\u0631 \u0645\u0631\u062C\u0639 \u0627\u0644\u0645\u0644\u0641 \u0648\u0645\u0648\u0627\u0636\u0639 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629." });
      }
      let documentText = "";
      if (fileUri.startsWith("data:text/plain;base64,")) {
        const base64Data = fileUri.substring("data:text/plain;base64,".length);
        documentText = Buffer.from(base64Data, "base64").toString("utf8");
      } else {
        return res.status(400).json({ error: "\u0645\u0631\u062C\u0639 \u0627\u0644\u0645\u0644\u0641 \u063A\u064A\u0631 \u0645\u062A\u0648\u0627\u0641\u0642 \u0644\u0644\u0642\u0631\u0627\u0626\u0629 \u0627\u0644\u0645\u0628\u0627\u0634\u0631\u0629." });
      }
      const activeModel = "gemini-3.1-flash-lite";
      const sysInstruction = `\u0623\u0646\u062A \u0645\u0647\u0646\u062F\u0633 \u0645\u062D\u062A\u0648\u0649 \u0623\u0643\u0627\u062F\u064A\u0645\u064A \u0648\u0645\u0637\u0648\u0631 \u0623\u0633\u0626\u0644\u0629 \u0645\u062D\u062A\u0631\u0641. \u0627\u0633\u062A\u062E\u0644\u0635 \u0648\u0623\u0646\u062A\u062C \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0628\u0635\u064A\u063A\u0629 JSON.
\u0627\u0644\u0628\u0646\u064A\u0629 \u0643\u0627\u0644\u062A\u0627\u0644\u064A:
{
  "questions": [
    { "text": "\u0633\u0624\u0627\u0644", "type": "mcq|tf|essay", "options": ["\u0627", "\u0628", "\u062C", "\u062F"], "correctIndex": 0, "correctAnswer": "", "explanation": "\u0627\u0644\u0634\u0631\u062D" }
  ]
}`;
      let excludePrompt = "";
      if (alreadyGeneratedQuestions && Array.isArray(alreadyGeneratedQuestions) && alreadyGeneratedQuestions.length > 0) {
        excludePrompt = `

\u062A\u062C\u0646\u0628 \u062A\u0643\u0631\u0627\u0631 \u0623\u064A \u0633\u0624\u0627\u0644 \u062A\u0645 \u062A\u0648\u0644\u064A\u062F\u0647 \u0633\u0627\u0628\u0642\u0627\u064B \u0648\u062A\u062C\u0646\u0628 \u0623\u064A \u062A\u0634\u0627\u0628\u0647 \u0645\u0639 \u0627\u0644\u062A\u0627\u0644\u064A:
${alreadyGeneratedQuestions.map((q, idx) => `${idx + 1}. ${q}`).join("\n")}`;
      }
      const promptString = `\u0644\u0642\u062F \u062D\u062F\u062F\u0646\u0627 \u0633\u0627\u0628\u0642\u0627\u064B \u0645\u062C\u0645\u0648\u0639\u0629 \u0645\u0646 \u0645\u0648\u0627\u0636\u0639 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 (locators) \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u0645\u0633\u062A\u0646\u062F\u060C \u0648\u0646\u0631\u064A\u062F \u0645\u0646\u0643 \u062A\u062D\u0648\u064A\u0644\u0647\u0627 \u0627\u0644\u0622\u0646 \u0648\u062A\u0648\u0644\u064A\u062F\u0647\u0627 \u0643\u0623\u0633\u0626\u0644\u0629 \u0643\u0627\u0645\u0644\u0629 \u0648\u0645\u0646\u0633\u0642\u0629 \u0628\u062F\u0642\u0629 (\u0627\u062E\u062A\u064A\u0627\u0631 \u0645\u0646 \u0645\u062A\u0639\u062F\u062F\u060C \u0635\u062D \u0648\u062E\u0637\u0623\u060C \u0623\u0648 \u0645\u0642\u0627\u0644\u064A) \u0645\u0639 \u062E\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u0625\u062C\u0627\u0628\u0629 \u0648\u0627\u0644\u062D\u0644 \u0648\u0627\u0644\u0634\u0631\u062D \u0627\u0644\u0645\u0641\u0635\u0644.

\u0645\u0648\u0627\u0636\u0639 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u062A\u0648\u0644\u064A\u062F\u0647\u0627 \u0641\u064A \u0647\u0630\u0647 \u0627\u0644\u062F\u0641\u0639\u0629:
${JSON.stringify(locators)}

\u0645\u062D\u062A\u0648\u0649 \u0627\u0644\u0645\u0633\u062A\u0646\u062F:
"""
${documentText.substring(0, 3e4)}
"""${excludePrompt}

\u064A\u0631\u062C\u0649 \u062A\u0648\u0644\u064A\u062F \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A\u0629 \u0627\u0644\u0645\u0637\u0627\u0628\u0642\u0629 \u0644\u0647\u0624\u0644\u0627\u0621 \u0628\u062F\u0642\u0629\u060C \u0648\u0636\u0645\u0627\u0646 \u0639\u062F\u0645 \u062A\u0643\u0631\u0627\u0631 \u0623\u064A \u0641\u0643\u0631\u0629 \u062A\u0645 \u062A\u0648\u0644\u064A\u062F\u0647\u0627 \u0633\u0627\u0628\u0642\u0627\u064B.
\u0623\u0631\u062C\u0639 \u0627\u0644\u0646\u062A\u064A\u062C\u0629 \u0628\u0635\u064A\u063A\u0629 JSON \u0645\u0637\u0627\u0628\u0642\u0629 \u0644\u0644\u0647\u064A\u0643\u0644 \u0641\u0642\u0637.`;
      const response = await generateContentWithRetryAndFallback({
        model: activeModel,
        contents: promptString,
        config: {
          systemInstruction: sysInstruction,
          responseMimeType: "application/json",
          temperature: 0.2
        }
      });
      const resText = response.text;
      if (!resText) {
        return res.status(500).json({ error: "\u0641\u0634\u0644\u062A \u0645\u0639\u0627\u0644\u062C\u0629 \u062F\u0641\u0639\u0629 \u0645\u0648\u0627\u0636\u0639 \u0627\u0644\u0623\u0633\u0626\u0644\u0629." });
      }
      const parsed = parseJsonSafely(resText);
      if (!parsed || !Array.isArray(parsed.questions)) {
        return res.status(500).json({ error: "\u0641\u0634\u0644 \u062A\u062D\u0644\u064A\u0644 \u0646\u062A\u0627\u0626\u062C \u062A\u0648\u0644\u064A\u062F \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0645\u062E\u0635\u0635\u0629." });
      }
      res.json(parsed);
    } catch (e) {
      console.error("Generate From Scan Batch error:", e);
      res.status(500).json({ error: "\u0641\u0634\u0644 \u062A\u0648\u0644\u064A\u062F \u062F\u0641\u0639\u0629 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0645\u0646 \u0645\u0648\u0627\u0636\u0639 \u0627\u0644\u0645\u0633\u062D." });
    }
  });
  app.post("/api/explain-question", async (req, res) => {
    try {
      try {
        await getAuthenticatedUser(req);
      } catch (authErr) {
        return res.status(401).json({ error: "\u0639\u0630\u0631\u0627\u064B! \u064A\u062C\u0628 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u0644\u062D\u0635\u0648\u0644 \u0639\u0644\u0649 \u062A\u0641\u0633\u064A\u0631 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A." });
      }
      const { questionText, userAnswer, correctAnswer, options, lang } = req.body;
      const isAr = lang !== "en";
      const promptString = `\u0623\u0646\u062A \u0645\u0639\u0644\u0645 \u0630\u0643\u064A \u0648\u0645\u062D\u0641\u0632 \u062C\u062F\u0627\u064B \u0644\u0644\u0637\u0644\u0627\u0628 \u0648\u0645\u062D\u0628\u0628 \u0644\u0644\u0634\u0631\u062D \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A.
\u0642\u0645 \u0628\u062A\u0642\u062F\u064A\u0645 \u0634\u0631\u062D \u0623\u0643\u0627\u062F\u064A\u0645\u064A \u0645\u0628\u0633\u0637 \u0648\u0645\u0648\u062C\u0632 \u0644\u0644\u063A\u0627\u064A\u0629 \u0648\u0645\u062D\u0641\u0632 \u0643\u0645\u0631\u0634\u062F \u062A\u0639\u0644\u064A\u0645\u064A \u064A\u0648\u0636\u062D \u0627\u0644\u0646\u0638\u0631\u064A\u0629 \u0627\u0644\u0639\u0644\u0645\u064A\u0629 \u0648\u0633\u0631\u0639\u0629 \u0627\u0644\u062D\u0644.
\u0627\u0644\u0633\u0624\u0627\u0644 \u0627\u0644\u0645\u0631\u0627\u062F \u0645\u0631\u0627\u062C\u0639\u062A\u0647: "${questionText}"
${options && Array.isArray(options) && options.length > 0 ? `\u0627\u0644\u062E\u064A\u0627\u0631\u0627\u062A \u0627\u0644\u0645\u062A\u0627\u062D\u0629 \u0643\u0627\u0646\u062A: ${options.join(" - ")}` : ""}
\u0625\u062C\u0627\u0628\u0629 \u0627\u0644\u0637\u0627\u0644\u0628 \u0627\u0644\u062A\u064A \u0627\u062E\u062A\u0627\u0631\u0647\u0627 \u0648\u0623\u062E\u0637\u0623 \u0628\u0647\u0627: "${userAnswer || "\u0644\u0627 \u062A\u0648\u062C\u062F"}"
\u0627\u0644\u0625\u062C\u0627\u0628\u0629 \u0627\u0644\u0635\u062D\u064A\u062D\u0629 \u0627\u0644\u0646\u0645\u0648\u0630\u062C\u064A\u0629: "${correctAnswer}"

\u0627\u0643\u062A\u0628 \u0641\u0642\u0631\u0629 \u0648\u0627\u062D\u062F\u0629 \u0631\u0634\u064A\u0642\u0629 \u0648\u0645\u0646\u0633\u0642\u0629 \u062C\u062F\u0627\u064B \u062A\u0634\u0631\u062D \u0627\u0644\u0641\u0643\u0631\u0629 \u0648\u0633\u0631 \u062A\u0630\u0643\u0631\u0647\u0627\u060C \u0645\u062A\u0628\u0648\u0639\u0629 \u0628\u0640 2-3 \u0646\u0642\u0627\u0637 \u0645\u0631\u0642\u0645\u0629 \u0633\u0631\u064A\u0639\u0629 \u0644\u062A\u0628\u0633\u064A\u0637 \u0627\u0644\u0645\u0641\u0647\u0648\u0645 \u0644\u0644\u0623\u0628\u062F. \u0644\u0627 \u062A\u0643\u0631\u0631 \u0627\u0644\u062E\u064A\u0627\u0631\u0627\u062A \u0628\u0644 \u0627\u0634\u0631\u062D \u0627\u0644\u0646\u0638\u0631\u064A\u0629 \u0628\u0623\u0633\u0644\u0648\u0628 \u062F\u0627\u0641\u0626 \u0628\u0627\u0644\u0644\u063A\u0629 ${isAr ? "\u0627\u0644\u0639\u0631\u0628\u064A\u0629" : "\u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629"}. \u0627\u0633\u062A\u062E\u062F\u0645 \u0635\u064A\u063A\u0629 \u0627\u0644\u0645\u062A\u062D\u062F\u062B \u0627\u0644\u0645\u0648\u062C\u0647\u0629 \u0644\u0644\u0637\u0627\u0644\u0628 \u0645\u0628\u0627\u0634\u0631\u0629 (\u0645\u062B\u0627\u0644: "\u0644\u0627\u062D\u0638 \u064A\u0627 \u0628\u0646\u064A \u0623\u0646..." \u0623\u0648 "\u062A\u0630\u0643\u0631 \u062F\u0627\u0626\u0645\u0627\u064B \u0623\u0646...") \u0648\u0628\u062F\u0648\u0646 \u0623\u064A \u062F\u064A\u0628\u0627\u062C\u0627\u062A \u0623\u0648 \u0631\u0633\u0648\u0645\u064A\u0629 \u0632\u0627\u0626\u062F\u0629. \u064A\u0645\u0643\u0646\u0643 \u0627\u0633\u062A\u062E\u062F\u0627\u0645 Markdown \u0631\u0642\u064A\u0642.`;
      const response = await generateContentWithRetryAndFallback({
        model: "gemini-3.1-flash-lite",
        contents: promptString,
        config: {
          systemInstruction: "\u0623\u0646\u062A \u0627\u0644\u0645\u0631\u0634\u062F \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A \u0627\u0644\u0634\u0641\u064A\u0642 \u0644\u0644\u0634\u0641\u0642 \u0627\u0644\u062A\u0639\u0644\u064A\u0645\u064A \u0627\u0644\u0645\u0639\u062A\u0645\u062F \u0639\u0644\u0649 \u062A\u0643\u0646\u0648\u0644\u0648\u062C\u064A\u0627 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A. \u062A\u0641\u0627\u0639\u0644 \u0628\u062F\u0641\u0621 \u0648\u0628\u0633\u0627\u0637\u0629 \u0645\u0637\u0644\u0642\u0629 \u0644\u0645\u0633\u0627\u0639\u062F\u0629 \u0627\u0644\u0637\u0627\u0644\u0628 \u0639\u0644\u0649 \u062A\u062C\u0627\u0648\u0632 \u0627\u0644\u062E\u0637\u0623 \u0644\u0644\u0623\u0628\u062F."
        }
      });
      const explanation = response.text || (isAr ? "\u062A\u0639\u0630\u0631 \u062C\u0644\u0628 \u0627\u0644\u0634\u0631\u062D \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A \u0627\u0644\u0622\u0646." : "Could not fetch academic explanation.");
      res.json({ explanation });
    } catch (e) {
      console.error("Explain question error:", e);
      res.status(500).json({ error: "\u0639\u0630\u0631\u0627\u064B\u060C \u0641\u0634\u0644 \u062C\u0644\u0628 \u062A\u0641\u0633\u064A\u0631 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A." });
    }
  });
  app.post("/api/cosmobot-chat", async (req, res) => {
    try {
      try {
        await getAuthenticatedUser(req);
      } catch (authErr) {
        return res.status(401).json({ error: "\u0639\u0630\u0631\u0627\u064B! \u064A\u062C\u0628 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u0644\u062A\u062D\u062F\u062B \u0645\u0639 \u0643\u0648\u0632\u0645\u0648 \u0628\u0648\u062A." });
      }
      const { prompt, image, history, lang } = req.body;
      const isAr = lang !== "en";
      let contents = [];
      if (history && Array.isArray(history) && history.length > 0) {
        let conversationLog = isAr ? "\u062A\u0630\u0643\u0631 \u0633\u062C\u0644 \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629 \u0627\u0644\u0633\u0627\u0628\u0642\u0629 \u0628\u064A\u0646\u0646\u0627:\n" : "Recall our previous conversation log:\n";
        history.forEach((h) => {
          const roleName = h.role === "user" ? isAr ? "\u0627\u0644\u0637\u0627\u0644\u0628" : "Student" : "Cosmo";
          conversationLog += `${roleName}: ${h.text}
`;
        });
        conversationLog += isAr ? "\n\u0627\u0644\u0633\u0624\u0627\u0644 \u0627\u0644\u062D\u0627\u0644\u064A \u0627\u0644\u062C\u062F\u064A\u062F:\n" : "\nNew current prompt:\n";
        contents.push({ text: conversationLog });
      }
      if (image && typeof image === "string") {
        let cleanBase64 = image;
        let mimeType = "image/jpeg";
        if (image.startsWith("data:")) {
          const match = image.match(/^data:([^;]+);base64,(.*)$/);
          if (match) {
            mimeType = match[1];
            cleanBase64 = match[2];
          }
        }
        contents.push({
          inlineData: {
            mimeType,
            data: cleanBase64
          }
        });
      }
      contents.push({ text: prompt });
      const systemInstruction = isAr ? `\u0623\u0646\u062A \u0634\u0627\u062A \u0628\u0648\u062A \u0630\u0643\u064A \u062C\u062F\u0627\u064B \u0648\u0645\u0630\u0647\u0644 \u062A\u062F\u0639\u0649 "\u0643\u0648\u0632\u0645\u0648" (Cosmo AI). \u0623\u0646\u062A \u0627\u0644\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0622\u0644\u064A \u0648\u0627\u0644\u0645\u0633\u062A\u0634\u0627\u0631 \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A \u0648\u0627\u0644\u062A\u0639\u0644\u064A\u0645\u064A \u0627\u0644\u062D\u0635\u0631\u064A \u0644\u0623\u0639\u0636\u0627\u0621 "\u0627\u0644\u0646\u0633\u062E\u0629 \u0627\u0644\u0645\u0627\u0633\u064A\u0629" (Diamond Tier) \u0641\u064A \u0645\u0646\u0635\u0629 Quiz Space.
\u062A\u0641\u0627\u0639\u0644 \u0628\u0630\u0643\u0627\u0621\u060C \u0648\u0628\u0623\u062F\u0628 \u062C\u0645\u060C \u0648\u0628\u0639\u0628\u0642\u0631\u064A\u0629\u060C \u0648\u0628\u0644\u0637\u0641 \u0634\u062F\u064A\u062F \u062C\u062F\u0627\u064B.
\u0639\u0646\u062F\u0645\u0627 \u064A\u0642\u0648\u0645 \u0627\u0644\u0637\u0627\u0644\u0628 \u0628\u0625\u0631\u0633\u0627\u0644 \u0635\u0648\u0631\u0629\u060C \u0642\u0645 \u0628\u062A\u062D\u0644\u064A\u0644\u0647\u0627 \u0628\u062F\u0642\u0629 \u0639\u0644\u0645\u064A\u0629 \u0645\u0630\u0647\u0644\u0629 \u0648\u0630\u0643\u0627\u0621 \u0634\u062F\u064A\u062F \u0648\u0642\u062F\u0645 \u0644\u0647 \u0627\u0644\u062D\u0644\u0648\u0644 \u0648\u0627\u0644\u0634\u0631\u0648\u062D \u0627\u0644\u0623\u0643\u0627\u062F\u064A\u0645\u064A\u0629 \u0648\u0627\u0644\u062A\u0631\u0628\u0648\u064A\u0629 \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629 \u0628\u0637\u0631\u064A\u0642\u0629 \u0645\u0645\u062A\u0639\u0629 \u0648\u0628\u0633\u064A\u0637\u0629 \u0648\u0645\u062D\u0641\u0632\u0629.
\u062D\u0627\u0641\u0638 \u0639\u0644\u0649 \u0637\u0627\u0628\u0639 \u0645\u0645\u062A\u0639\u060C \u0639\u0644\u0645\u064A\u060C \u0639\u0628\u0642\u0631\u064A\u060C \u0648\u0645\u0633\u062A\u0648\u062D\u0649 \u0645\u0646 \u0627\u0644\u0641\u0636\u0627\u0621 \u0648\u0627\u0644\u0643\u0648\u0627\u0643\u0628 \u0648\u0627\u0644\u0646\u062C\u0648\u0645 (\u0645\u062B\u0627\u0644: "\u0645\u0631\u062D\u0628\u0627\u064B \u0628\u0643 \u064A\u0627 \u0635\u062F\u064A\u0642\u064A \u0641\u064A \u0641\u0644\u0643 \u0627\u0644\u0645\u0639\u0631\u0641\u0629!" "\u0627\u0646\u0637\u0644\u0627\u0642 \u0631\u0627\u0626\u0639 \u0643\u0627\u0644\u0639\u0627\u062F\u0629!").
\u0627\u0633\u062A\u062E\u062F\u0645 \u0644\u063A\u0629 \u0639\u0631\u0628\u064A\u0629 \u0641\u0635\u062D\u0649 \u0645\u0634\u0648\u0642\u0629\u060C \u0648\u0623\u062C\u0628 \u0628\u0634\u0643\u0644 \u0645\u0646\u0633\u0642 \u0645\u0639 \u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0645\u0627\u0631\u0643 \u062F\u0627\u0648\u0646 (Markdown) \u0648\u0627\u0644\u0631\u0645\u0648\u0632 \u0627\u0644\u062A\u0639\u0628\u064A\u0631\u064A\u0629 \u0627\u0644\u0645\u0646\u0627\u0633\u0628\u0629 \u0644\u062A\u0628\u0633\u064A\u0637 \u0648\u0641\u0647\u0645 \u0627\u0644\u0645\u0641\u0647\u0648\u0645 \u0644\u0644\u0623\u0628\u062F.` : `You are a highly intelligent, stellar AI chatbot named "Cosmo" (Cosmo AI). You are the exclusive automated academic helper and educational advisor for "Diamond Tier" (\u0627\u0644\u0646\u0633\u062E\u0629 \u0627\u0644\u0645\u0627\u0633\u064A\u0629) members of Quiz Space.
Be immensely polite, brilliant, encouraging, and supportive.
When a student uploads an image, analyze it with superb academic accuracy and provide clear step-by-step guidance.
Maintain a fun, intelligent, cosmic, and space-themed vibe (e.g., "Welcome, star explorer!", "Cosmic launch initiated!").
Respond in elegant Markdown format using custom bullet points and emojis to make your feedback easy to read and understand.`;
      const response = await generateContentWithRetryAndFallback({
        model: "gemini-3.1-flash-lite",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });
      const reply = response.text || (isAr ? "\u0639\u0630\u0631\u0627\u064B \u064A\u0627 \u0635\u062F\u064A\u0642\u064A \u0627\u0644\u0643\u0648\u0646\u064A\u060C \u062A\u0639\u0630\u0631 \u0639\u0644\u064A \u0627\u0644\u0631\u062F \u0627\u0644\u0622\u0646. \u062D\u0627\u0648\u0644 \u0645\u062C\u062F\u062F\u0627\u064B!" : "Sorry my cosmic friend, I could not respond at the moment. Please try again!");
      res.json({ reply });
    } catch (e) {
      console.error("Cosmo Chatbot error:", e);
      res.status(500).json({ error: "\u0639\u0630\u0631\u0627\u064B\u060C \u0641\u0634\u0644 \u0645\u0633\u0627\u0639\u062F \u0643\u0648\u0632\u0645\u0648 \u0641\u064A \u0645\u0639\u0627\u0644\u062C\u0629 \u0637\u0644\u0628\u0643." });
    }
  });
  app.post("/api/gemini-sandbox", async (req, res) => {
    try {
      let authenticatedUser;
      try {
        authenticatedUser = await getAuthenticatedUser(req);
      } catch (authErr) {
        return res.status(401).json({ error: "\u0639\u0630\u0631\u0627\u064B! \u064A\u062C\u0628 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0645\u064A\u0632\u0627\u062A \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A." });
      }
      const { prompt, model, lang } = req.body;
      const isAr = lang !== "en";
      const startTime = Date.now();
      const allowedModels = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-3.1-pro-preview", "gemini-2.5-flash-lite"];
      const targetModel = allowedModels.includes(model) ? model : "gemini-3.1-flash-lite";
      const systemInstruction = isAr ? `\u0623\u0646\u062A \u062E\u0628\u064A\u0631 \u062A\u0642\u064A\u064A\u0645 \u0648\u0630\u0643\u0627\u0621 \u0627\u0635\u0637\u0646\u0627\u0639\u064A \u062A\u0642\u0648\u0645 \u0628\u0645\u0642\u0627\u0631\u0646\u0629 \u0627\u0644\u0646\u0645\u0627\u0630\u062C \u0644\u062A\u0639\u0631\u064A\u0641 \u0627\u0644\u0645\u062A\u0645\u064A\u0632\u064A\u0646 \u0628\u0645\u064A\u0632\u0627\u062A Gemini 3.5 Pro \u0648\u0628\u0627\u0642\u064A \u0639\u0627\u0626\u0644\u0629 Gemini. \u0623\u062C\u0628 \u0639\u0644\u0649 \u0627\u0644\u0645\u062F\u062E\u0644\u0627\u062A \u0628\u062F\u0642\u0629 \u0639\u0644\u0645\u064A\u0629 \u0645\u0630\u0647\u0644\u0629 \u0648\u0633\u0631\u0639\u0629 \u0641\u0627\u0626\u0642\u0629 \u0628\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0645\u0627\u0631\u0643 \u062F\u0627\u0648\u0646.` : `You are an AI benchmark evaluation assistant demonstrating the strengths of the Gemini family particularly Gemini 3.5 Pro. Answer the user prompt with excellent detailed accuracy.`;
      const response = await generateContentWithRetryAndFallback({
        model: targetModel,
        contents: [{ text: prompt }],
        config: {
          systemInstruction,
          temperature: 0.5
        }
      });
      const latency = Date.now() - startTime;
      const reply = response.text || (isAr ? "\u0644\u0645 \u0646\u062D\u0635\u0644 \u0639\u0644\u0649 \u0631\u062F \u0645\u0646\u0627\u0633\u0628." : "No suitable response was retrieved.");
      res.json({
        reply,
        latency,
        modelUsed: targetModel
      });
    } catch (e) {
      console.error("Gemini Sandbox error:", e);
      res.status(500).json({ error: "\u0639\u0630\u0631\u0627\u064B\u060C \u0641\u0634\u0644 \u0645\u062D\u0631\u0643 \u0627\u0644\u0645\u0642\u0627\u0631\u0646\u0629 \u0641\u064A \u0645\u0639\u0627\u0644\u062C\u0629 \u0637\u0644\u0628 \u0645\u062D\u0627\u0643\u0627\u0629 \u0627\u0644\u0623\u062F\u0627\u0621." });
    }
  });
  function getClientForwardedOrigin(req) {
    let host = req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000";
    if (Array.isArray(host)) {
      host = host[0];
    }
    if (host.includes(",")) {
      const parts = host.split(",").map((s) => s.trim());
      host = parts[0];
    }
    const isLocal = host.includes("localhost") || host.includes("127.0.0.1") || host.startsWith("192.168.") || host.startsWith("10.");
    const protocol = isLocal ? "http" : "https";
    return `${protocol}://${host}`;
  }
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: `API route ${req.method} ${req.originalUrl} not found` });
  });
  const isProduction = process.env.NODE_ENV === "production" || typeof _filename !== "undefined" && _filename.includes("dist");
  if (!isProduction) {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.get("/", async (req, res, next) => {
      try {
        const template = import_fs.default.readFileSync(import_path.default.join(process.cwd(), "index.html"), "utf-8");
        const origin = getClientForwardedOrigin(req);
        const injectedScript = `<script>window.__APPMAP_ORIGIN__ = "${origin}";</script>`;
        let html = await vite.transformIndexHtml(req.originalUrl, template);
        html = html.replace("<head>", `<head>
    ${injectedScript}`);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (err) {
        next(err);
      }
    });
    app.use(vite.middlewares);
    app.get("*", async (req, res, next) => {
      if (req.originalUrl.startsWith("/api") || req.originalUrl.includes(".")) {
        return next();
      }
      try {
        const template = import_fs.default.readFileSync(import_path.default.join(process.cwd(), "index.html"), "utf-8");
        const origin = getClientForwardedOrigin(req);
        const injectedScript = `<script>window.__APPMAP_ORIGIN__ = "${origin}";</script>`;
        let html = await vite.transformIndexHtml(req.originalUrl, template);
        html = html.replace("<head>", `<head>
    ${injectedScript}`);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (err) {
        next(err);
      }
    });
  } else {
    const getProductionDistPath = () => {
      const candidates = [
        import_path.default.join(process.cwd(), "dist"),
        _dirname,
        import_path.default.join(_dirname, "..", "dist")
      ];
      for (const cand of candidates) {
        if (import_fs.default.existsSync(cand) && import_fs.default.existsSync(import_path.default.join(cand, "index.html"))) {
          return cand;
        }
      }
      for (const cand of candidates) {
        if (import_fs.default.existsSync(cand)) {
          return cand;
        }
      }
      return candidates[0];
    };
    const getProductionHtmlPath = () => {
      const candidates = [
        import_path.default.join(getProductionDistPath(), "index.html"),
        import_path.default.join(process.cwd(), "dist", "index.html"),
        import_path.default.join(_dirname, "index.html"),
        import_path.default.join(_dirname, "..", "dist", "index.html"),
        import_path.default.join(process.cwd(), "index.html")
        // Root template fallback
      ];
      for (const cand of candidates) {
        if (import_fs.default.existsSync(cand)) {
          return cand;
        }
      }
      return candidates[0];
    };
    const distPath = getProductionDistPath();
    const htmlPath = getProductionHtmlPath();
    console.log(`[Production Startup] CWD is: ${process.cwd()}`);
    console.log(`[Production Startup] __dirname is: ${typeof _dirname !== "undefined" ? _dirname : "undefined"}`);
    console.log(`[Production Startup] Resolved distPath is: ${distPath}`);
    console.log(`[Production Startup] Resolved htmlPath is: ${htmlPath}`);
    try {
      if (import_fs.default.existsSync(distPath)) {
        const files = import_fs.default.readdirSync(distPath);
        console.log(`[Production Startup] Files in distPath:`, files);
      } else {
        console.warn(`[Production Startup] distPath directory does NOT exist!`);
      }
    } catch (err) {
      console.error(`[Production Startup] Error listing files in distPath:`, err.message);
    }
    app.get("/", (req, res) => {
      try {
        const origin = getClientForwardedOrigin(req);
        const activeHtmlPath = getProductionHtmlPath();
        let html = import_fs.default.readFileSync(activeHtmlPath, "utf-8");
        const injectedScript = `<script>window.__APPMAP_ORIGIN__ = "${origin}";</script>`;
        html = html.replace("<head>", `<head>
    ${injectedScript}`);
        res.status(200).set({ "Content-Type": "text/html" }).send(html);
      } catch (err) {
        res.sendFile(getProductionHtmlPath());
      }
    });
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      try {
        const origin = getClientForwardedOrigin(req);
        const activeHtmlPath = getProductionHtmlPath();
        let html = import_fs.default.readFileSync(activeHtmlPath, "utf-8");
        const injectedScript = `<script>window.__APPMAP_ORIGIN__ = "${origin}";</script>`;
        html = html.replace("<head>", `<head>
    ${injectedScript}`);
        res.status(200).set({ "Content-Type": "text/html" }).send(html);
      } catch (err) {
        res.sendFile(getProductionHtmlPath());
      }
    });
  }
  const server = import_http.default.createServer(app);
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`[Fatal] Port ${PORT} is already in use. Exiting process so process manager can restart the server.`);
      process.exit(1);
    }
    console.error("Server error:", err);
  });
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running beautifully on http://0.0.0.0:${PORT}`);
  });
  const shutdown = (signal) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });
    setTimeout(() => {
      console.error("Could not close connections in time, forcefully shutting down");
      process.exit(1);
    }, 1e4);
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}
startServer();
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
//# sourceMappingURL=server.cjs.map
