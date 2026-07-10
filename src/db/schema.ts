import { pgTable, text, integer, boolean, timestamp, numeric, jsonb } from 'drizzle-orm/pg-core';

// 1. Users Table
export const users = pgTable('users', {
  uid: text('uid').primaryKey(), // Firebase Auth UID acts as the primary key
  name: text('name'),
  email: text('email'),
  photoUrl: text('photo_url'),
  isPremium: boolean('is_premium').default(false),
  planName: text('plan_name').default('Free'),
  renewalDate: text('renewal_date'),
  bio: text('bio'),
  location: text('location'),
  joinedDate: text('joined_date'),
  badgeSymbol: text('badge_symbol').default('🛡️'),
  badgeColor: text('badge_color').default('#3b82f6'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  customId: text('custom_id'),
  password: text('password'),
  twoFactorEnabled: boolean('two_factor_enabled').default(false),
  twoFactorSecret: text('two_factor_secret'),
  twoFactorTempSecret: text('two_factor_temp_secret'),
});

// 1.5. Follows Table
export const follows = pgTable('follows', {
  id: text('id').primaryKey(), // followerId_followingId
  followerId: text('follower_id').notNull(),
  followingId: text('following_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. Quizzes Table
export const quizzes = pgTable('quizzes', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').default(''),
  creatorId: text('creator_id'),
  creatorName: text('creator_name'),
  questions: jsonb('questions').notNull(), // jsonb match database
  totalPlays: integer('total_plays').default(0),
  avgRating: numeric('avg_rating', { precision: 2, scale: 1 }).default('0.0'),
  ratingsCount: integer('ratings_count').default(0),
  timeLimit: integer('time_limit').default(0),
  createdAt: text('created_at').notNull(),
  category: text('category').default('عام'),
  distributionRouting: text('distribution_routing').default('public'),
  classroomId: text('classroom_id'),
});

// 3. Completions Table
export const completions = pgTable('completions', {
  id: text('id').primaryKey(),
  quizId: text('quiz_id').notNull(),
  quizTitle: text('quiz_title').notNull(),
  takerId: text('taker_id').notNull(),
  takerName: text('taker_name').notNull(),
  score: integer('score').notNull(),
  totalQuestions: integer('total_questions').notNull(),
  rating: integer('rating'),
  feedback: text('feedback').default(''),
  createdAt: text('created_at').notNull(),
});

// 3.5. Quiz Results Table (Mandatory evaluation tracking)
export const quizResults = pgTable('quiz_results', {
  id: text('id').primaryKey(),
  quizId: text('quiz_id').notNull(),
  quizTitle: text('quiz_title').notNull(),
  studentName: text('student_name').notNull(),
  score: integer('score').notNull(),
  totalQuestions: integer('total_questions').notNull(),
  rating: integer('rating'),
  feedback: text('feedback').default(''),
  createdAt: text('created_at').notNull(),
});

// 4. Question Ratings Table
export const questionRatings = pgTable('question_ratings', {
  id: text('id').primaryKey(), // e.g. "userId_questionId"
  userId: text('user_id').notNull(),
  quizId: text('quiz_id').notNull(),
  quizTitle: text('quiz_title').notNull(),
  questionId: text('question_id').notNull(),
  questionText: text('question_text').notNull(),
  ratingValue: text('rating_value').notNull(), // 'like' | 'dislike'
  createdAt: text('created_at').notNull(),
});

// 5. Notifications Table
export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  senderName: text('sender_name').notNull(),
  type: text('type').notNull(), // 'quiz' | etc.
  createdAt: text('created_at').notNull(),
});

// 6. Premium Requests Table
export const premiumRequests = pgTable('premium_requests', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name'),
  email: text('email'),
  planName: text('plan_name'),
  paymentScreenshot: text('payment_screenshot'),
  status: text('status'), // 'pending' | 'approved' | 'rejected'
  rejectReason: text('reject_reason'),
  promoCodeUsed: text('promo_code_used'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at'),
});

// 7. Promotions Table
export const promotions = pgTable('promotions', {
  id: text('id').primaryKey(),
  discountPercent: integer('discount_percent').notNull(),
  endDate: text('end_date').notNull(),
  applicablePlans: jsonb('applicable_plans').notNull(), // jsonb array of matching plans
  isActive: boolean('is_active').default(true),
  createdAt: text('created_at').notNull(),
});

// 8. Coupon Codes Table
export const couponCodes = pgTable('coupon_codes', {
  id: text('id').primaryKey(),
  code: text('code').notNull(),
  discountPercent: integer('discount_percent').notNull(),
  maxUses: integer('max_uses').default(9999),
  usedCount: integer('used_count').default(0),
  expiryDate: text('expiry_date').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: text('created_at').notNull(),
  applicablePlans: text('applicable_plans'), // Comma-separated or serialized plans e.g. "silver,gold,diamond"
});

// 9. Direct Messages Table
export const directMessages = pgTable('direct_messages', {
  id: text('id').primaryKey(),
  senderId: text('sender_id').notNull(),
  senderName: text('sender_name').notNull(),
  receiverId: text('receiver_id').notNull(),
  receiverName: text('receiver_name').notNull(),
  text: text('text').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: text('created_at').notNull(),
});

// 10. Community Posts Table
export const communityPosts = pgTable('community_posts', {
  id: text('id').primaryKey(),
  text: text('text').notNull(),
  authorName: text('author_name').notNull(),
  authorId: text('author_id').notNull(),
  authorBadgeSymbol: text('author_badge_symbol'),
  authorBadgeColor: text('author_badge_color'),
  likes: integer('likes').default(0),
  likedBy: jsonb('liked_by').notNull(), // Array of user IDs who liked
  createdAt: text('created_at').notNull(),
});

// 10.5. Message Views Table (community_message_views)
export const messageViews = pgTable('community_message_views', {
  id: text('id').primaryKey(), // e.g. "postId_userId"
  postId: text('post_id').notNull(),
  userId: text('user_id').notNull(),
  userName: text('user_name').notNull(),
  userPhotoUrl: text('user_photo_url'),
  createdAt: text('created_at').notNull(),
});

// 11. User Sessions Table for security monitoring
export const userSessions = pgTable('user_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  device: text('device').notNull(),
  location: text('location').notNull(),
  ipAddress: text('ip_address'),
  lastActive: text('last_active').notNull(), // text description, e.g. 'نشط الآن' or 'Active now'
  current: boolean('current').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// 12. User Notification Tokens Table
export const userNotificationTokens = pgTable('user_notification_tokens', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  subscription: text('subscription').notNull(), // stringified PushSubscription
  createdAt: timestamp('created_at').defaultNow(),
});

// 13. Classrooms Table
export const classroomsTable = pgTable('classrooms', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  code: text('code').notNull(),
  createdBy: text('created_by').notNull(),
  creatorName: text('creator_name').notNull(),
  createdAt: text('created_at').notNull(),
  allowStudentMessages: boolean('allow_student_messages').default(true),
  allowStudentMedia: boolean('allow_student_media').default(true),
});

// 14. Classroom Students Table
export const classroomStudentsTable = pgTable('classroom_students', {
  id: text('id').primaryKey(),
  classId: text('class_id'),
  classCode: text('class_code').notNull(),
  studentId: text('student_id').notNull(),
  studentName: text('student_name').notNull(),
  studentPhoto: text('student_photo'),
  joinedAt: text('joined_at').notNull(),
  completedQuizzes: integer('completed_quizzes').default(0),
  avgScore: numeric('avg_score', { precision: 5, scale: 2 }).default('0.0'),
  lastActive: text('last_active'),
  role: text('role').default('student'), // 'student', 'co-moderator'
});

// 15. Classroom Messages Table (E2EE Chat)
export const classroomMessagesTable = pgTable('classroom_messages', {
  id: text('id').primaryKey(),
  classId: text('class_id').notNull(),
  senderId: text('sender_id').notNull(),
  senderName: text('sender_name').notNull(),
  senderPhoto: text('sender_photo'),
  encryptedText: text('encrypted_text').notNull(),
  isMedia: boolean('is_media').default(false),
  mediaUrl: text('media_url'),
  createdAt: timestamp('created_at').defaultNow(),
});
