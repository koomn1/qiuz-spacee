import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Mail, Lock, ShieldCheck, ArrowRight, RefreshCw, Sparkles, User, LogIn, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn, verifyOtp, isMfaChallenged, mfaUid } = useAuth();
  
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<'ar' | 'en'>(() => {
    return (localStorage.getItem('quiz_language') as 'ar' | 'en') || 'ar';
  });

  const isAr = lang === 'ar';

  const handleToggleLang = () => {
    const nextLang = lang === 'ar' ? 'en' : 'ar';
    setLang(nextLang);
    localStorage.setItem('quiz_language', nextLang);
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = nextLang;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    
    try {
      if (isRegister) {
        // Handle registration via backup API
        if (!username.trim()) {
          setError(isAr ? 'يرجى إدخال اسم مستخدم مميز للبدء.' : 'Username is required.');
          setLoading(false);
          return;
        }

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: username.trim(), email: cleanEmail, password })
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || (isAr ? 'فشلت عملية إنشاء الحساب.' : 'Failed to register account.'));
        }

        const data = await res.json();
        // Login immediately after register
        await signIn(cleanEmail, password);
        window.location.hash = '#/dashboard/landing';
      } else {
        // Handle login with Supabase simulator (checks and prompts for 2FA automatically)
        const result = await signIn(cleanEmail, password);
        if (result.status === 'SUCCESS') {
          // Route immediately to dashboard (Scenario A)
          window.location.hash = '#/dashboard/landing';
        }
        // Scenario B (MFA Enabled) will automatically set isMfaChallenged = true in useAuth
      }
    } catch (err: any) {
      setError(err.message || (isAr ? 'حدث خطأ غير متوقع أثناء الدخول.' : 'An error occurred during authentication.'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setError(isAr ? 'رمز التحقق يجب أن يكون مكوناً من 6 أرقام.' : 'Verification code must be 6 digits.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await verifyOtp(otpCode);
      // Route immediately to dashboard on successful verification
      window.location.hash = '#/dashboard/landing';
    } catch (err: any) {
      setError(err.message || (isAr ? 'رمز التحقق غير صحيح أو منتهي الصلاحية.' : 'Invalid or expired code.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full bg-[#070412] text-white flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans select-none"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Dynamic atmospheric orbits in background */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-violet-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      {/* Floating Header Actions */}
      <div className="absolute top-6 inset-x-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-1.5 text-xs font-black tracking-widest text-primary/80 uppercase">
          <Sparkles className="w-4 h-4 text-violet-400 animate-spin-slow" />
          <span>كوزمو كويز • CosmoQuiz</span>
        </div>
        <button
          onClick={handleToggleLang}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          {isAr ? 'English 🇺🇸' : 'العربية 🇸🇦'}
        </button>
      </div>

      <div className="w-full max-w-md relative z-10">
        
          {!isMfaChallenged ? (
            /* Standard Auth form */
            <div
              
              
              
              
              
              className="bg-[#0c071e]/90 border border-white/10 rounded-[32px] p-8 shadow-[0_25px_60px_-15px_rgba(155,81,224,0.25)] relative overflow-hidden"
            >
              {/* Premium Top Glow Border */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />

              <div className="text-center mb-6">
                <h2 className="text-3xl font-black bg-gradient-to-r from-white via-purple-300 to-slate-300 bg-clip-text text-transparent">
                  {isRegister 
                    ? (isAr ? 'انضم للمنصة الأكاديمية 🚀' : 'Create Your Space Orbit 🚀') 
                    : (isAr ? 'مرحباً بعودتك! 👋' : 'Welcome Back Scholar! 👋')}
                </h2>
                <p className="text-xs text-slate-400 mt-2 font-medium">
                  {isRegister 
                    ? (isAr ? 'أنشئ حساباً مجانياً لبدء رحلة التحدي والتعلم' : 'Create a free workspace account to log achievements') 
                    : (isAr ? 'سجل دخولك فوراً للمتابعة وحصد الأوسمة' : 'Login to pursue interactive quizzes and climb ranks')}
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                {isRegister && (
                  <div
                    
                    
                    className="space-y-1.5 overflow-hidden"
                  >
                    <label className="block text-xs font-bold text-slate-300 px-1">
                      {isAr ? 'اسم المستخدم' : 'Username'}
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required={isRegister}
                        placeholder={isAr ? 'مثال: أحمد الدوسري' : 'e.g., Alex Scholar'}
                        className="w-full pl-4 pr-11 py-3.5 bg-slate-900/40 border border-white/10 rounded-2xl focus:ring-4 focus:ring-primary/15 focus:border-primary text-sm transition-all text-white outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 px-1">
                    {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="scholar@space.edu"
                      className="w-full pl-4 pr-11 py-3.5 bg-slate-900/40 border border-white/10 rounded-2xl focus:ring-4 focus:ring-primary/15 focus:border-primary text-sm transition-all text-white outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 px-1">
                    {isAr ? 'كلمة المرور' : 'Password'}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full pl-4 pr-11 py-3.5 bg-slate-900/40 border border-white/10 rounded-2xl focus:ring-4 focus:ring-primary/15 focus:border-primary text-sm transition-all text-white outline-none"
                    />
                  </div>
                </div>

                {error && (
                  <div
                    
                    
                    className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs font-bold text-red-400 flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0 animate-ping" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-primary to-violet-600 hover:from-primary-hover hover:to-violet-700 text-white rounded-2xl font-black text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogIn className="w-4 h-4" />
                  )}
                  <span>{isRegister ? (isAr ? 'إنشاء حساب جديد' : 'Register Orbit') : (isAr ? 'تسجيل الدخول' : 'Sign In')}</span>
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-white/5 text-center">
                <button
                  onClick={() => {
                    setIsRegister(!isRegister);
                    setError('');
                  }}
                  className="text-xs text-primary font-black hover:underline cursor-pointer"
                >
                  {isRegister 
                    ? (isAr ? 'لديك حساب بالفعل؟ سجل دخولك' : 'Already have an orbit? Sign in') 
                    : (isAr ? 'مستخدم جديد؟ أنشئ حسابك الآن' : 'New to CosmoQuiz? Register here')}
                </button>
              </div>
            </div>
          ) : (
            /* Multi-factor authentication View (Scenario B) */
            <div
              
              
              
              
              
              className="bg-[#0c071e]/90 border border-white/10 rounded-[32px] p-8 shadow-[0_25px_60px_-15px_rgba(155,81,224,0.25)] relative overflow-hidden text-center"
            >
              {/* Premium Top Glow Border */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />

              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <ShieldCheck className="w-8 h-8 text-violet-400 animate-pulse" />
              </div>

              <h2 className="text-2xl font-black bg-gradient-to-r from-white via-purple-300 to-slate-300 bg-clip-text text-transparent">
                {isAr ? 'المصادقة الثنائية النشطة 🛡️' : 'MFA Authentication Required 🛡️'}
              </h2>
              <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                {isAr 
                  ? 'تم حماية هذا الحساب عبر المصادقة الثنائية. يرجى إدخال الرمز السري المكون من 6 أرقام من تطبيق التحقق لمتابعة تسجيل الدخول.'
                  : 'Your account is secured with two-factor locks. Please enter the 6-digit TOTP code from your authenticator app.'}
              </p>

              <form onSubmit={handleVerify2FA} className="space-y-5 mt-6">
                <div className="space-y-2">
                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000 000"
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3 text-center text-xl font-mono font-black tracking-[0.4em] text-white outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>

                {error && (
                  <div
                    
                    
                    className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs font-bold text-red-400 flex items-center justify-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0 animate-ping" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  className="w-full py-3.5 bg-gradient-to-r from-primary to-violet-600 hover:from-primary-hover hover:to-violet-700 text-white rounded-2xl font-black text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                  <span>{isAr ? 'تأكيد الرمز والمتابعة' : 'Verify and Confirm'}</span>
                </button>
              </form>

              <button
                type="button"
                onClick={() => {
                  window.location.reload();
                }}
                className="mt-6 text-xs text-slate-500 hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5 mx-auto hover:underline"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>{isAr ? 'العودة لصفحة الدخول' : 'Back to Login Screen'}</span>
              </button>
            </div>
          )}
        
      </div>
    </div>
  );
}
