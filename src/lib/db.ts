/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { auth } from './firebase';
import { Quiz, QuizCompletion, UserStats, QuestionRating, Promotion, Coupon } from '../types';
import { getApiUrl } from './origin';
import { fetchWithAuth } from './authFetch';

// ---------------- QUIZ HANDLERS (POSTGRES REST BACKEND) ----------------

export async function getQuizzes(): Promise<Quiz[]> {
  try {
    const res = await fetch(getApiUrl('/api/quizzes'));
    if (res.ok) {
      return await res.json();
    }
    throw new Error('Failed to fetch quizzes from server');
  } catch (err) {
    console.warn('Error inside getQuizzes REST call, returning empty array:', err);
    return [];
  }
}

export async function getQuizById(id: string): Promise<Quiz | null> {
  if (!id) return null;
  try {
    const res = await fetch(getApiUrl(`/api/quizzes/${id}`));
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`Error in getQuizById for ${id}:`, err);
  }
  return null;
}

export async function createQuiz(quiz: Omit<Quiz, 'id' | 'createdAt' | 'totalPlays' | 'avgRating' | 'ratingsCount'> & { id?: string; timeLimit?: number }): Promise<Quiz> {
  const finalId = quiz.id || 'quiz-' + Math.random().toString(36).substring(2, 11);
  const creatorId = auth.currentUser?.uid || quiz.creatorId || 'anonymous';
  const creatorName = quiz.creatorName || auth.currentUser?.displayName || 'صانع متميز';

  try {
    const res = await fetchWithAuth(getApiUrl('/api/quizzes'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...quiz,
        id: finalId,
        creatorId,
        creatorName
      })
    });
    if (res.ok) {
      const parsed = await res.json();
      return parsed.quiz;
    }
    throw new Error('Backend failed to create quiz');
  } catch (err: any) {
    console.error('Error creating quiz:', err);
    throw err;
  }
}

export async function updateQuiz(quizId: string, updatedQuiz: Partial<Quiz>): Promise<void> {
  if (!quizId) return;
  try {
    const res = await fetchWithAuth(getApiUrl(`/api/quizzes/${quizId}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedQuiz)
    });
    if (!res.ok) {
      throw new Error('Failed to update quiz on backend');
    }
  } catch (err) {
    console.error('Error updating quiz:', err);
  }
}

export async function deleteQuiz(quizId: string): Promise<void> {
  if (!quizId) return;
  try {
    const res = await fetchWithAuth(getApiUrl(`/api/quizzes/${quizId}`), {
      method: 'DELETE'
    });
    if (!res.ok) {
      throw new Error('Failed to delete quiz on backend');
    }
  } catch (err) {
    console.error('Error deleting quiz:', err);
  }
}

export async function submitQuizAttempt(
  quizId: string, 
  data: { 
    takerId: string; 
    takerName: string; 
    score: number; 
    rating?: number; 
    feedback?: string; 
  }
): Promise<any> {
  try {
    const response = await fetch(getApiUrl(`/api/quizzes/${quizId}/submit`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Backend submit fails');
  } catch (err) {
    console.error('Error submitting quiz attempt:', err);
    throw err;
  }
}

// ---------------- PROFILE STATS & MANAGEMENT HANDLERS (POSTGRES REST BACKEND) ----------------

export async function getUserProfileStats(userId: string): Promise<UserStats> {
  if (!userId) {
    return {
      userId: '',
      name: 'طالب متميز',
      createdQuizzes: [],
      completions: [],
      isPremium: false,
      planName: ''
    };
  }

  try {
    const res = await fetch(getApiUrl(`/api/profiles/${userId}`));
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error(`Error in getUserProfileStats for ${userId}:`, err);
  }

  return {
    userId,
    name: 'طالب متميز',
    createdQuizzes: [],
    completions: [],
    isPremium: false,
    planName: ''
  };
}

export async function saveUserProfile(
  userId: string,
  name: string,
  photoURL?: string,
  email?: string,
  bio?: string,
  location?: string,
  badgeSymbol?: string,
  badgeColor?: string,
  customId?: string,
  isStartupSync?: boolean
): Promise<void> {
  if (!userId) return;
  try {
    const res = await fetchWithAuth(getApiUrl(`/api/profiles/${userId}`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        photoURL,
        email,
        bio,
        location,
        badgeSymbol,
        badgeColor,
        customId,
        isStartupSync
      })
    });
    if (!res.ok) {
      throw new Error('Failed to save profile on server');
    }
  } catch (err) {
    console.error(`Error saving user profile for ${userId}:`, err);
  }
}

export async function checkUserPremiumStatus(userId: string): Promise<boolean> {
  if (!userId) return false;
  try {
    const res = await fetch(getApiUrl(`/api/profiles/${userId}/premium`));
    if (res.ok) {
      const data = await res.json();
      return !!data.isPremium;
    }
  } catch (err) {
    console.warn('Error checking premium status over REST:', err);
  }
  return false;
}

// ---------------- PREMIUM TRIAL ACTIVATION REQUEST HANDLERS (POSTGRES REST) ----------------

export async function createPremiumRequest(requestId: string, reqData: any): Promise<void> {
  try {
    const res = await fetch(getApiUrl('/api/premium-requests'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: requestId,
        ...reqData
      })
    });
    if (!res.ok) {
      throw new Error('Failed write to premium-requests');
    }
  } catch (err) {
    console.error('Error creating premium request:', err);
  }
}

export async function getPremiumRequests(): Promise<any[]> {
  try {
    const res = await fetch(getApiUrl('/api/premium-requests'));
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Error getting premium requests:', err);
  }
  return [];
}

export async function updatePremiumRequest(
  requestId: string,
  status: 'approved' | 'rejected',
  userId: string,
  rejectReason?: string,
  planName?: string
): Promise<void> {
  try {
    const res = await fetch(getApiUrl(`/api/premium-requests/${requestId}/status`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        rejectReason,
        userId,
        planName: planName || 'الباقة الذهبية لمعلمي المستقبل (مفعّلة)'
      })
    });
    if (!res.ok) {
      throw new Error('Failed to update premium activation status');
    }
  } catch (err) {
    console.error('Error updating premium activation status:', err);
  }
}

// ---------------- CLASSIFIED QUESTION RATINGS HANDLERS (POSTGRES REST) ----------------

export async function rateQuestion(
  userId: string,
  quizId: string,
  quizTitle: string,
  questionId: string,
  questionText: string,
  ratingValue: 'like' | 'dislike'
): Promise<void> {
  try {
    const res = await fetch(getApiUrl('/api/question-ratings'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        quizId,
        quizTitle,
        questionId,
        questionText,
        ratingValue
      })
    });
    if (!res.ok) {
      throw new Error('Failed to submit question rating');
    }
  } catch (err) {
    console.error('Error in rateQuestion:', err);
  }
}

export async function getUserRatedQuestions(userId: string): Promise<QuestionRating[]> {
  if (!userId) return [];
  try {
    const res = await fetch(getApiUrl(`/api/question-ratings/${userId}`));
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Error fetching question ratings:', err);
  }
  return [];
}

// ---------------- MARKETING PROMOTIONS SYSTEMS (POSTGRES REST) ----------------

export async function getPromotions(): Promise<Promotion[]> {
  try {
    const res = await fetch(getApiUrl('/api/promotions'));
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Error fetching promotions:', err);
  }
  return [];
}

export async function savePromotion(promo: Promotion): Promise<void> {
  try {
    const res = await fetchWithAuth(getApiUrl('/api/promotions'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(promo)
    });
    if (!res.ok) {
      throw new Error('Failed to save promotion');
    }
  } catch (err) {
    console.error('Error saving promotion:', err);
  }
}

export async function deletePromotion(promoId: string): Promise<void> {
  try {
    const res = await fetchWithAuth(getApiUrl(`/api/promotions/${promoId}`), {
      method: 'DELETE'
    });
    if (!res.ok) {
      throw new Error('Failed to delete promotion');
    }
  } catch (err) {
    console.error('Error deleting promotion:', err);
  }
}

// ---------------- COUPONS CODES REDUCTIONS (POSTGRES REST) ----------------

export async function getCoupons(): Promise<Coupon[]> {
  try {
    const res = await fetchWithAuth(getApiUrl('/api/coupons'));
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Error loading coupons:', err);
  }
  return [];
}

export async function getCouponByCode(code: string): Promise<Coupon | null> {
  if (!code) return null;
  try {
    const res = await fetchWithAuth(getApiUrl(`/api/coupons/${code}`));
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`Error getting coupon ${code}:`, err);
  }
  return null;
}

export async function saveCoupon(coupon: Coupon): Promise<void> {
  try {
    const res = await fetchWithAuth(getApiUrl('/api/coupons'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(coupon)
    });
    if (!res.ok) {
      throw new Error('Failed to save coupon');
    }
  } catch (err) {
    console.error('Error saving coupon:', err);
  }
}

export async function deleteCoupon(couponId: string): Promise<void> {
  try {
    const res = await fetchWithAuth(getApiUrl(`/api/coupons/${couponId}`), {
      method: 'DELETE'
    });
    if (!res.ok) {
      throw new Error('Failed to delete coupon');
    }
  } catch (err) {
    console.error('Error deleting coupon:', err);
  }
}

// ---------------- SCORE METRICS INTEGRATION (POSTGRES REST) ----------------

export async function getBestScoreByQuizId(quizId: string): Promise<number> {
  try {
    const res = await fetch(getApiUrl(`/api/quizzes/${quizId}/best-score`));
    if (res.ok) {
      const data = await res.json();
      return typeof data.score === 'number' ? data.score : 0;
    }
  } catch (err) {
    console.warn(`Error getting best score for ${quizId}:`, err);
  }
  return 0;
}

export async function getCompletionsByQuizId(quizId: string): Promise<QuizCompletion[]> {
  try {
    const res = await fetch(getApiUrl(`/api/quizzes/${quizId}/completions`));
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`Error getting completions for quiz ${quizId}:`, err);
  }
  return [];
}

export async function getRecentCompletions(limitCount = 10): Promise<QuizCompletion[]> {
  try {
    const res = await fetch(getApiUrl('/api/completions/recent'));
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data.slice(0, limitCount);
      }
    }
  } catch (err) {
    console.warn('Error getting recent completions:', err);
  }
  return [];
}

// ---------------- SOCIAL: MOODS & COMMUNITY NETWORK POSTS ----------------

export async function getCommunityPosts(): Promise<any[]> {
  try {
    const res = await fetch(getApiUrl('/api/community-posts'));
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Error loading community posts:', err);
  }
  return [];
}

export async function createCommunityPost(
  text: string,
  authorId: string,
  authorName: string,
  authorBadgeSymbol?: string,
  authorBadgeColor?: string
): Promise<any> {
  try {
    const res = await fetch(getApiUrl('/api/community-posts'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        authorId,
        authorName,
        authorBadgeSymbol,
        authorBadgeColor
      })
    });
    if (res.ok) {
      const parsed = await res.json();
      return parsed.post;
    }
  } catch (err) {
    console.error('Error creating community post:', err);
  }
  return null;
}

export async function likeCommunityPost(postId: string, userId: string): Promise<any> {
  try {
    const res = await fetch(getApiUrl(`/api/community-posts/${postId}/like`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Error liking community post:', err);
  }
  return null;
}

export async function deleteCommunityPost(postId: string): Promise<boolean> {
  try {
    const res = await fetch(getApiUrl(`/api/community-posts/${postId}`), {
      method: 'DELETE'
    });
    return res.ok;
  } catch (err) {
    console.error('Error deleting community post:', err);
  }
  return false;
}

// ---------------- COMMUNICATION: CHATS & DIRECT MESSAGES ----------------

export async function getDirectMessages(userId: string): Promise<any[]> {
  if (!userId) return [];
  try {
    const res = await fetch(getApiUrl(`/api/direct-messages?userId=${userId}`));
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Error fetching direct messages:', err);
  }
  return [];
}

export async function sendDirectMessage(
  senderId: string,
  senderName: string,
  receiverId: string,
  receiverName: string,
  text: string
): Promise<any> {
  try {
    const res = await fetch(getApiUrl('/api/direct-messages'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId,
        senderName,
        receiverId,
        receiverName,
        text
      })
    });
    if (res.ok) {
      const parsed = await res.json();
      return parsed.message;
    }
  } catch (err) {
    console.error('Error transmitting direct message:', err);
  }
  return null;
}

export async function markMessagesAsRead(userId: string, contactId: string): Promise<void> {
  if (!userId || !contactId) return;
  try {
    const res = await fetch(getApiUrl('/api/direct-messages/mark-read'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, contactId })
    });
    if (!res.ok) {
      throw new Error('Failed to mark direct messages as read');
    }
  } catch (err) {
    console.error('Failed resetting read metrics:', err);
  }
}

// ---------------- ALERTS & GENERAL NOTIFICATIONS ----------------

export async function getNotifications(): Promise<any[]> {
  try {
    const res = await fetch(getApiUrl('/api/notifications'));
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Error reading notification alerts:', err);
  }
  return [];
}

export async function createNotification(
  title: string,
  body: string,
  senderName?: string,
  type?: string
): Promise<any> {
  try {
    const res = await fetch(getApiUrl('/api/notifications'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        body,
        senderName,
        type
      })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Error broadcasting system notification:', err);
  }
  return null;
}

export async function getAllProfiles(): Promise<any[]> {
  try {
    const res = await fetch(getApiUrl('/api/profiles'));
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Error fetching all profiles:', err);
  }
  return [];
}
