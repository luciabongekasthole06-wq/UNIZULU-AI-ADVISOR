import React, { useState, useEffect } from 'react';
import { 
  User, 
  X, 
  Sparkles, 
  LogOut, 
  ArrowRight, 
  Check, 
  Mail, 
  AtSign, 
  History, 
  ShieldCheck,
  UserCheck,
  RotateCcw,
  Compass,
  GraduationCap
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onSaveProfile: (profileData: {
    name: string;
    email: string;
    username: string;
  }) => Promise<{ isReturning: boolean; messageCount: number }>;
  onGoogleSignIn?: () => Promise<void>;
  onSelectUser?: (profile: UserProfile, conversation?: any[]) => void;
  onContinueAsGuest?: () => Promise<void> | void;
  onSignOut: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  onGoogleSignIn,
  onContinueAsGuest,
  onSignOut
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [lookupNotice, setLookupNotice] = useState<string | null>(null);
  const [isCheckingLookup, setIsCheckingLookup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [authMode, setAuthMode] = useState<'student' | 'guest'>('student');

  const handleGoogleClick = async () => {
    if (!onGoogleSignIn) return;
    setError('');
    setIsSubmitting(true);
    try {
      await onGoogleSignIn();
      onClose();
    } catch (err: any) {
      console.error('Google Sign-In error:', err);
      setError(err?.message || 'Could not complete Google Sign-In. Please try again or use email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      if (userProfile && !userProfile.isGuest) {
        setName(userProfile.name || '');
        setEmail(userProfile.email && !userProfile.email.includes('@student.unizulu') ? userProfile.email : '');
        setUsername(userProfile.username || '');
        setIsEditing(false);
      } else {
        setName('');
        setEmail('');
        setUsername('');
        setIsEditing(false);
      }
      setError('');
      setLookupNotice(null);
    }
  }, [isOpen, userProfile]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!username && val.trim().length > 1) {
      const generated = val.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 16);
      setUsername(generated);
    }
  };

  const handleQuickLookup = async (identifier: string) => {
    const clean = identifier.trim().toLowerCase().replace(/^@/, '');
    if (!clean || clean.length < 3) return;

    setIsCheckingLookup(true);
    try {
      const res = await fetch('/api/users/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: clean })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.found && data.profile) {
          setName(data.profile.name || '');
          setEmail(data.profile.email || '');
          setUsername(data.profile.username || clean);
          const historyCount = data.previousConversation?.length || 0;
          setLookupNotice(`Returning student recognized! ${historyCount > 0 ? `${historyCount} past chat messages ready to restore.` : 'Profile found on data.'}`);
        }
      }
    } catch {
      // Non-blocking
    } finally {
      setIsCheckingLookup(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '');

    if (!cleanEmail) {
      setError('Please provide your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address (e.g. student@example.com).');
      return;
    }
    if (!cleanName) {
      setError('Please provide your full name or nickname.');
      return;
    }
    if (!cleanUsername || cleanUsername.length < 2) {
      setError('Please choose a username (at least 2 characters).');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await onSaveProfile({
        name: cleanName,
        email: cleanEmail,
        username: cleanUsername
      });

      setIsEditing(false);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Could not sign in. Please verify your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuest = async () => {
    setIsSubmitting(true);
    try {
      if (onContinueAsGuest) {
        await onContinueAsGuest();
      }
      onClose();
    } catch (err) {
      console.error('Guest continue failed:', err);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center min-h-screen">
      <div 
        id="student-sign-in-modal"
        className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] sm:max-h-[88vh] flex flex-col shadow-[0_25px_60px_-15px_rgba(0,33,56,0.5),0_0_0_1px_rgba(255,255,255,0.9)_inset] border-2 border-sky-100 my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-[#001829] via-[#002f52] to-[#004e85] text-white px-5 sm:px-6 pt-5 pb-4 relative overflow-hidden flex-shrink-0">
          <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-sky-400/20 blur-2xl pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-sky-200 hover:text-white hover:bg-white/15 transition-colors cursor-pointer shadow-xs"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5 mb-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#002138] p-1.5 flex items-center justify-center shadow-md border border-white/40 flex-shrink-0">
              <img
                src="/unizulu-emblem.svg"
                alt="UNIZULU Emblem"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-white drop-shadow-xs">
                {userProfile && !userProfile.isGuest && !isEditing ? `Welcome, ${userProfile.name}` : 'Student Sign In'}
              </h3>
              <p className="text-xs text-sky-200 font-medium">
                {userProfile && !userProfile.isGuest && !isEditing
                  ? `Active account: @${userProfile.username}`
                  : 'University of Zululand • Admissions Portal'}
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs - Clean 2-Option Layout */}
          {(!userProfile || userProfile.isGuest || isEditing) && (
            <div className="grid grid-cols-2 p-1 bg-black/30 rounded-xl border border-white/15 text-xs font-bold gap-1">
              <button
                type="button"
                onClick={() => setAuthMode('student')}
                className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  authMode === 'student'
                    ? 'bg-sky-400 text-[#002138] shadow-xs'
                    : 'text-sky-200 hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Save History</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('guest')}
                className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  authMode === 'guest'
                    ? 'bg-white text-[#002138] shadow-xs'
                    : 'text-sky-200 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Guest Mode</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          
          {error && (
            <div className="p-3 bg-rose-50 border-2 border-rose-200 text-rose-800 text-xs rounded-2xl flex items-start gap-2 shadow-xs">
              <span className="text-sm">⚠️</span>
              <span className="font-semibold leading-relaxed">{error}</span>
            </div>
          )}

          {lookupNotice && (
            <div className="p-3 bg-emerald-50 border-2 border-emerald-300 text-emerald-900 text-xs rounded-2xl flex items-center gap-2 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-bold">{lookupNotice}</span>
            </div>
          )}

          {/* ACTIVE CONNECTED STUDENT VIEW */}
          {userProfile && !userProfile.isGuest && !isEditing ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-slate-50 via-sky-50/50 to-blue-50/40 border-2 border-sky-200 rounded-2xl p-4.5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-sky-200/60">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      @
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Username</span>
                      <span className="text-sm font-black text-[#002138]">@{userProfile.username}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-2xs">
                    <UserCheck className="w-3 h-3 text-emerald-600" />
                    Verified On Record
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-sky-600" />
                    Full Name:
                  </span>
                  <span className="font-bold text-[#002138]">{userProfile.name}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-sky-600" />
                    Email Address:
                  </span>
                  <span className="font-mono text-slate-700 text-[11px] font-semibold">{userProfile.email}</span>
                </div>

                {userProfile.apsScore !== undefined && (
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-sky-100">
                    <span className="text-slate-500 font-medium">Calculated APS Score:</span>
                    <span className="font-black text-sky-900 bg-sky-100 px-2 py-0.5 rounded-lg border border-sky-200">
                      {userProfile.apsScore} points
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-sky-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1 text-sky-800">
                    <History className="w-3.5 h-3.5" />
                    Chat History Sync:
                  </span>
                  <span className="text-emerald-700 font-bold">Enabled &amp; Linked</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 px-4 bg-[#002138] hover:bg-[#003459] text-white rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-sky-400/30"
                >
                  <Check className="w-4 h-4 text-sky-300" />
                  <span>Continue Chatting with Active Profile</span>
                </button>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                    <span>Switch Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSignOut();
                      onClose();
                    }}
                    className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>

          /* GUEST EXPLORATION */
          ) : authMode === 'guest' ? (
            <div className="space-y-4 py-1">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Compass className="w-4 h-4 text-sky-600" />
                  <span>Quick Guest Exploration</span>
                </div>
                <p className="leading-relaxed text-slate-600 text-xs">
                  Want to explore admissions without signing in right now? You can chat freely as a guest student.
                </p>
                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                  <span>You can sign in anytime to link your profile and restore conversations.</span>
                </div>
              </div>

              <div className="pt-2 space-y-2.5">
                <button
                  type="button"
                  onClick={handleGuest}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#002138] hover:bg-[#003459] text-white rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
                >
                  <User className="w-4 h-4" />
                  <span>{isSubmitting ? 'Starting Session...' : 'Start Instant Guest Chat'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode('student')}
                  className="w-full text-center py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline cursor-pointer"
                >
                  Prefer to save conversations? Switch to Student Sign In
                </button>
              </div>
            </div>

          /* SIGN IN / SAVE FORM */
          ) : (
            <div className="space-y-4">
              {/* Google Sign-In Primary Button (Firebase Auth) */}
              <button
                type="button"
                id="btn-google-signin"
                onClick={handleGoogleClick}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-300 hover:border-slate-400 rounded-2xl font-bold text-xs sm:text-sm shadow-xs active:translate-y-0.5 transition-all cursor-pointer group"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="group-hover:text-slate-900">Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  or with email handle
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-sky-600" />
                    <span>Email Address</span>
                    <span className="text-rose-500 font-bold">*</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Identifies your profile</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleQuickLookup(email)}
                  placeholder="student@example.com"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-sky-500 focus:bg-white focus:ring-3 focus:ring-sky-400/20 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-sky-600" />
                    <span>Full Name or Preferred Name</span>
                    <span className="text-rose-500 font-bold">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Sipho Khumalo"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-sky-500 focus:bg-white focus:ring-3 focus:ring-sky-400/20 transition-all font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                    <AtSign className="w-3.5 h-3.5 text-sky-600" />
                    <span>Username</span>
                    <span className="text-rose-500 font-bold">*</span>
                  </label>
                  {isCheckingLookup ? (
                    <span className="text-[10px] text-sky-600 animate-pulse font-semibold">Checking data...</span>
                  ) : (
                    <span className="text-[10px] text-slate-400">Unique student handle</span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-sky-600 font-bold text-sm select-none">@</span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ''))}
                    onBlur={() => handleQuickLookup(username)}
                    placeholder="siphok"
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-8 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-sky-500 focus:bg-white focus:ring-3 focus:ring-sky-400/20 transition-all font-bold"
                  />
                </div>
              </div>

              <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-3 text-[11px] text-slate-700 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong>Automatic Conversation Memory:</strong> Your chats, calculated APS, and documents are securely saved to your profile so you can resume whenever you return.
                </span>
              </div>

              <div className="pt-2 space-y-2.5">
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim() || !email.trim() || !username.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#002138] hover:bg-[#002f52] text-white rounded-xl font-bold text-xs sm:text-sm disabled:opacity-40 disabled:pointer-events-none cursor-pointer border border-sky-400/30 shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-[#F1B82D]" />
                  <span>{isSubmitting ? 'Signing In...' : 'Sign In & Save History'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center text-xs text-slate-500 pt-1">
                  <button
                    type="button"
                    onClick={handleGuest}
                    className="font-semibold text-slate-600 hover:text-slate-900 hover:underline cursor-pointer"
                  >
                    Continue as Guest
                  </button>
                </div>
              </div>

            </form>
          </div>
        )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 sm:px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 flex-shrink-0">
          <span className="text-[11px]">University of Zululand</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg text-slate-600 hover:bg-slate-200 font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
