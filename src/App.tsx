import React, { useState, useEffect } from 'react';
import { Sparkles, X, History, UserCheck, User } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { ApsCalculatorPanel } from './components/ApsCalculatorPanel';
import { DocumentChecklistPanel } from './components/DocumentChecklistPanel';
import { FacultyExplorerPanel } from './components/FacultyExplorerPanel';
import { LearningPanel } from './components/LearningPanel';
import { ApsCalculatorModal } from './components/ApsCalculatorModal';
import { DocumentChecklistModal } from './components/DocumentChecklistModal';
import { AuthModal } from './components/AuthModal';
import { FeedbackStatsModal } from './components/FeedbackStatsModal';
import { FacultyExplorerModal } from './components/FacultyExplorerModal';
import { LearningModal } from './components/LearningModal';
import { ChatMessage, UserProfile, FeedbackPayload } from './types';
import { detectSouthAfricanLanguage, getLanguageByCode } from './data/languages';
import { LanguageSelectModal } from './components/LanguageSelectModal';
import { 
  signInWithGoogle, 
  signOutUser, 
  subscribeToAuthState, 
  syncUserProfileToFirestore, 
  loadUserProfileFromFirestore, 
  saveChatMessageToFirestore, 
  loadChatMessagesFromFirestore,
  saveFeedbackToFirestore
} from './lib/firebase';

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'msg-welcome',
  sender: 'assistant',
  text: `Hello and welcome! 👋🎓✨ I am your UNIZULU Academic & Admissions Advisor, proudly designed and developed by the **UNIZULU IT Team** (University of Zululand Information Technology & Systems Division)! 💻💙

I'm here to give you friendly, step-by-step guidance on undergraduate admissions, calculating your matric APS score (excluding Life Orientation), CAO codes, certified documents, and vibrant campus life across KwaDlangezwa and Richards Bay! 🏛️📚

Feel free to ask in English, isiZulu, Afrikaans, or any official language. What qualification or faculty would you like to explore today?`,
  timestamp: new Date().toISOString(),
  detectedLanguage: 'en',
  detectedLanguageName: 'English'
};

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('unizulu_chat_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not restore chat history:', e);
    }
    return [INITIAL_WELCOME_MESSAGE];
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('unizulu_student_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not restore profile:', e);
    }
    return null;
  });

  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('unizulu_chat_language');
      if (saved) return saved;
      return 'auto';
    } catch (e) {
      return 'auto';
    }
  });

  const [detectedLanguageCode, setDetectedLanguageCode] = useState<string>(() => {
    try {
      return localStorage.getItem('unizulu_detected_lang_code') || 'en';
    } catch {
      return 'en';
    }
  });

  const [detectedLanguageName, setDetectedLanguageName] = useState<string>(() => {
    try {
      return localStorage.getItem('unizulu_detected_lang_name') || 'English';
    } catch {
      return 'English';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('unizulu_detected_lang_code', detectedLanguageCode);
      localStorage.setItem('unizulu_detected_lang_name', detectedLanguageName);
    } catch (e) {
      console.warn('Could not persist detected language:', e);
    }
  }, [detectedLanguageCode, detectedLanguageName]);

  const [isLoading, setIsLoading] = useState(false);

  // Left Navigation Panel Active Tab & Collapsible State
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isApsOpen, setIsApsOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isFacultiesOpen, setIsFacultiesOpen] = useState(false);
  const [isLearningOpen, setIsLearningOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  // Stored conversation / memory banner state
  const [historyBannerNotice, setHistoryBannerNotice] = useState<string | null>(null);

  // Firebase Authentication & Firestore Persistence Observer
  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (fbUser) => {
      if (fbUser) {
        try {
          const remote = await loadUserProfileFromFirestore(fbUser.uid);
          setUserProfile((prev) => {
            const active: UserProfile = {
              id: fbUser.uid,
              uid: fbUser.uid,
              name: fbUser.displayName || remote?.name || prev?.name || 'UNIZULU Student',
              email: fbUser.email || remote?.email || prev?.email || '',
              username: (fbUser.displayName || remote?.name || prev?.name || 'student')
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '_')
                .slice(0, 16),
              photoURL: fbUser.photoURL || undefined,
              apsScore: remote?.apsScore ?? prev?.apsScore,
              prospectiveFaculty: remote?.prospectiveFaculty || prev?.prospectiveFaculty,
              targetProgram: remote?.targetProgram || prev?.targetProgram,
              documentsChecklist: remote?.documentsChecklist || prev?.documentsChecklist || {
                certifiedId: false,
                matricResults: false,
                caoProofOfPayment: false,
                proofOfAddress: false,
                academicTranscript: false
              },
              createdAt: remote?.createdAt || prev?.createdAt || new Date().toISOString()
            };
            syncUserProfileToFirestore(fbUser.uid, active);
            return active;
          });

          // Restore cloud conversation messages from Firestore if available
          const cloudMsgs = await loadChatMessagesFromFirestore(fbUser.uid);
          if (cloudMsgs && cloudMsgs.length > 0) {
            setMessages(cloudMsgs);
            setHistoryBannerNotice(`Firebase Firestore: Restored ${cloudMsgs.length} messages from your secure cloud account.`);
            setTimeout(() => setHistoryBannerNotice(null), 5000);
          }
        } catch (e) {
          console.warn('Firebase state listener error:', e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Auto-sync stored conversation from UNIZULU data on initial load if user exists
  useEffect(() => {
    const identifier = userProfile?.username || userProfile?.email;
    if (!identifier) return;

    const fetchStoredHistory = async () => {
      try {
        const res = await fetch(`/api/conversations/${encodeURIComponent(identifier)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.conversation && Array.isArray(data.conversation) && data.conversation.length > 0) {
            setMessages(prev => {
              // If only initial welcome message is currently present, restore previous chat
              if (prev.length <= 1) {
                return data.conversation;
              }
              return prev;
            });
          }
        }
      } catch (err) {
        console.warn('Could not sync initial conversation from server data:', err);
      }
    };

    fetchStoredHistory();
  }, [userProfile?.username, userProfile?.email]);

  // Persist chat messages
  useEffect(() => {
    try {
      localStorage.setItem('unizulu_chat_messages', JSON.stringify(messages.slice(-20)));
    } catch (e) {
      console.warn('Could not persist messages:', e);
    }
  }, [messages]);

  // Persist profile
  useEffect(() => {
    try {
      if (userProfile) {
        localStorage.setItem('unizulu_student_profile', JSON.stringify(userProfile));
      } else {
        localStorage.removeItem('unizulu_student_profile');
      }
    } catch (e) {
      console.warn('Could not persist profile:', e);
    }
  }, [userProfile]);

  // Persist selected language
  useEffect(() => {
    try {
      localStorage.setItem('unizulu_chat_language', selectedLanguage);
    } catch (e) {
      console.warn('Could not persist language preference:', e);
    }
  }, [selectedLanguage]);

  // Send message to Gemini / Express API with language support
  const handleSendMessage = async (text: string, language?: string) => {
    const userText = text.trim();
    if (!userText || isLoading) return;

    // Detect what language the user is texting in right away (with conversation memory)
    const clientDetected = detectSouthAfricanLanguage(userText, detectedLanguageCode);
    setDetectedLanguageCode(clientDetected.code);
    setDetectedLanguageName(clientDetected.name);

    const langToUse = language || (selectedLanguage === 'auto' ? clientDetected.code : selectedLanguage);

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toISOString(),
      detectedLanguage: clientDetected.code,
      detectedLanguageName: clientDetected.name
    };

    setMessages(prev => [...prev, userMessage]);
    if (userProfile?.uid) {
      saveChatMessageToFirestore(userProfile.uid, userMessage);
    }
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: messages.slice(-6),
          userProfile: userProfile,
          preferredLanguage: langToUse,
          clientDetectedLanguage: clientDetected.code
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      
      // Update detected language from server response if provided
      if (data.detectedLanguage && data.detectedLanguageName) {
        setDetectedLanguageCode(data.detectedLanguage);
        setDetectedLanguageName(data.detectedLanguageName);
      }

      // Auto-retrieve and synchronize profile when chatbot identifies a user record
      if (data.identifiedUser) {
        setUserProfile(data.identifiedUser);
        if (data.identifiedUser.uid) {
          syncUserProfileToFirestore(data.identifiedUser.uid, data.identifiedUser);
        }
        setHistoryBannerNotice(`Retrieved student record for ${data.identifiedUser.name} (@${data.identifiedUser.username})${data.identifiedUser.apsScore !== undefined ? ` • APS: ${data.identifiedUser.apsScore}` : ''}.`);
      }

      const assistantMessage: ChatMessage = {
        id: data.id || `ast-${Date.now()}`,
        sender: 'assistant',
        text: data.text,
        timestamp: new Date().toISOString(),
        suggestedActions: [],
        detectedLanguage: data.detectedLanguage,
        detectedLanguageName: data.detectedLanguageName,
        sources: [],
        isSearchGrounded: false,
        searchQueries: []
      };

      setMessages(prev => [...prev, assistantMessage]);
      if (userProfile?.uid) {
        saveChatMessageToFirestore(userProfile.uid, assistantMessage);
      }
    } catch (err: any) {
      console.error('Chat request failed:', err);
      const isZulu = langToUse === 'zu' || userText.toLowerCase().includes('ngifuna') || userText.toLowerCase().includes('amaphuzu');
      const isAfrikaans = langToUse === 'af' || userText.toLowerCase().includes('vereistes');

      let fallbackText = `Oops! I had a momentary hiccup connecting to the server. 🙈✨

Don't worry, your UNIZULU IT Team advisor is still right here! 💻💙 Feel free to send your message again or ask any question about UNIZULU courses, admissions, and campus life! 🎓🏛️`;

      if (isZulu) {
        fallbackText = `Hawu! Kube nenkingana yesikhashana yokuxhumana neseva. 🙈✨

Ungakhathazeki, umeluleki wakho we-UNIZULU IT Team usekhona lapha! 💻💙 Sicela uphinde uthumele umlayezo wakho noma ubuze ngamakhodi e-CAO kanye neziqu zase-UNIZULU! 🎓🏛️`;
      } else if (isAfrikaans) {
        fallbackText = `Oeps! Daar was 'n tydelike verbindingsprobleem met die bediener. 🙈✨

Moenie bekommerd wees nie, jou UNIZULU IT-span adviseur is steeds hier! 💻💙 Stuur gerus jou boodskap weer of vra enige vraag oor UNIZULU kwalifikasies en studentelewe! 🎓🏛️`;
      }

      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: fallbackText,
        timestamp: new Date().toISOString(),
        detectedLanguage: isZulu ? 'zu' : isAfrikaans ? 'af' : 'en',
        detectedLanguageName: isZulu ? 'isiZulu' : isAfrikaans ? 'Afrikaans' : 'English',
        sources: []
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Feedback Submission handler
  const handleFeedbackSubmit = async (feedback: FeedbackPayload) => {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback)
      });
      // Also persist to Firebase Firestore
      saveFeedbackToFirestore(feedback, userProfile?.uid);
    } catch (e) {
      console.warn('Failed to submit feedback:', e);
    }
  };

  // Google Sign-In with Firebase Auth & Cloud Firestore Persistence
  const handleGoogleSignIn = async () => {
    try {
      const fbUser = await signInWithGoogle();
      const remote = await loadUserProfileFromFirestore(fbUser.uid);
      const active: UserProfile = {
        id: fbUser.uid,
        uid: fbUser.uid,
        name: fbUser.displayName || remote?.name || 'UNIZULU Student',
        email: fbUser.email || remote?.email || '',
        username: (fbUser.displayName || remote?.name || 'student')
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '_')
          .slice(0, 16),
        photoURL: fbUser.photoURL || undefined,
        apsScore: remote?.apsScore,
        prospectiveFaculty: remote?.prospectiveFaculty,
        targetProgram: remote?.targetProgram,
        documentsChecklist: remote?.documentsChecklist || {
          certifiedId: false,
          matricResults: false,
          caoProofOfPayment: false,
          proofOfAddress: false,
          academicTranscript: false
        },
        createdAt: remote?.createdAt || new Date().toISOString()
      };

      setUserProfile(active);
      await syncUserProfileToFirestore(fbUser.uid, active);

      const cloudMsgs = await loadChatMessagesFromFirestore(fbUser.uid);
      if (cloudMsgs && cloudMsgs.length > 0) {
        setMessages(cloudMsgs);
        setHistoryBannerNotice(`Welcome back ${active.name}! Restored ${cloudMsgs.length} messages from Firebase Firestore.`);
      } else {
        setHistoryBannerNotice(`Signed in with Google as ${active.name}! Cloud chat persistence is active.`);
      }
      setTimeout(() => setHistoryBannerNotice(null), 5000);
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      throw err;
    }
  };

  // Profile / Sign-in update handler linking to server persistence & conversation memory
  const handleSaveProfile = async (profileData: {
    name: string;
    email: string;
    username: string;
  }) => {
    try {
      const res = await fetch('/api/users/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userProfile,
          name: profileData.name,
          email: profileData.email,
          username: profileData.username
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to sign in. Please verify your details.');
      }

      const data = await res.json();
      setUserProfile(data.profile);

      // If previous conversation was stored in UNIZULU data, restore it immediately
      if (data.previousConversation && Array.isArray(data.previousConversation) && data.previousConversation.length > 0) {
        setMessages(data.previousConversation);
        setHistoryBannerNotice(`Welcome back, ${data.profile.name}! Restored your previous conversation (${data.previousConversation.length} messages) from UNIZULU data.`);
        setTimeout(() => setHistoryBannerNotice(null), 6000);
      } else if (data.isReturning) {
        setHistoryBannerNotice(`Welcome back, ${data.profile.name} (@${data.profile.username})! Ready for your academic questions.`);
        setTimeout(() => setHistoryBannerNotice(null), 4000);
      } else {
        setHistoryBannerNotice(`Welcome to UNIZULU, ${data.profile.name} (@${data.profile.username})! Your chats are now being stored to your data.`);
        setTimeout(() => setHistoryBannerNotice(null), 4000);
      }

      return {
        isReturning: Boolean(data.isReturning),
        messageCount: data.previousConversation?.length || 0
      };
    } catch (e: any) {
      console.warn('Failed to sign in and load conversation:', e);
      throw e;
    }
  };

  // Direct multi-user switcher / retrieval handler
  const handleSelectUser = (profile: UserProfile, conversation?: any[]) => {
    setUserProfile(profile);
    if (conversation && Array.isArray(conversation) && conversation.length > 0) {
      setMessages(conversation);
      setHistoryBannerNotice(`Loaded profile & ${conversation.length} chat messages for ${profile.name} (@${profile.username}).`);
      setTimeout(() => setHistoryBannerNotice(null), 5000);
    } else {
      setHistoryBannerNotice(`Active student record: ${profile.name} (@${profile.username}).`);
      setTimeout(() => setHistoryBannerNotice(null), 4000);
    }
  };

  // Continue as guest handler
  const handleContinueAsGuest = async () => {
    try {
      const res = await fetch('/api/users/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentProfile: userProfile })
      });

      if (res.ok) {
        const data = await res.json();
        setUserProfile(data.profile);
        setHistoryBannerNotice(`Guest Session Active: You can chat freely! Link your email and username anytime to preserve and restore conversations.`);
        setTimeout(() => setHistoryBannerNotice(null), 5000);
      }
    } catch (err) {
      console.warn('Guest initialization failed, falling back to local guest:', err);
      const guestFallback: UserProfile = {
        id: `guest_${Date.now()}`,
        name: 'Guest Student',
        email: `guest_${Date.now()}@student.unizulu.ac.za`,
        username: `guest_${Math.floor(1000 + Math.random() * 9000)}`,
        isGuest: true,
        documentsChecklist: {
          certifiedId: false,
          matricResults: false,
          caoProofOfPayment: false,
          proofOfAddress: false,
          academicTranscript: false
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setUserProfile(guestFallback);
    }
  };

  // Toggle document checklist
  const handleToggleDocument = async (docKey: keyof UserProfile['documentsChecklist']) => {
    if (!userProfile) {
      setIsAuthOpen(true);
      return;
    }

    const updatedChecklist = {
      ...userProfile.documentsChecklist,
      [docKey]: !userProfile.documentsChecklist[docKey]
    };

    const updatedProfile: UserProfile = {
      ...userProfile,
      documentsChecklist: updatedChecklist,
      updatedAt: new Date().toISOString()
    };

    setUserProfile(updatedProfile);

    try {
      await fetch('/api/users/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile)
      });
      if (updatedProfile.uid) {
        syncUserProfileToFirestore(updatedProfile.uid, updatedProfile);
      }
    } catch (e) {
      console.warn('Failed to sync checklist to server:', e);
    }
  };

  // Save calculated APS
  const handleSaveAps = async (score: number) => {
    if (userProfile) {
      const updated = { ...userProfile, apsScore: score };
      setUserProfile(updated);
      try {
        await fetch('/api/users/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated)
        });
        if (updated.uid) {
          syncUserProfileToFirestore(updated.uid, updated);
        }
      } catch (e) {
        console.warn('Failed to save APS to server:', e);
      }
    }
  };

  // Reset chat conversation back to clean initial state
  const handleResetChat = () => {
    const freshWelcome: ChatMessage = {
      id: `msg-welcome-${Date.now()}`,
      sender: 'assistant',
      text: `Hello and welcome to the University of Zululand Admissions Assistant! 🎓

I'm here to give you friendly, step-by-step guidance on admissions, APS requirements, certified documents, and CAO applications.

Feel free to ask questions in any of South Africa's 11 official languages (such as isiZulu, English, or Afrikaans), and don't worry about spelling mistakes—I predict and understand typos automatically.

What qualification or faculty would you like to explore today?`,
      timestamp: new Date().toISOString()
    };
    setMessages([freshWelcome]);
    try {
      localStorage.removeItem('unizulu_chat_messages');
    } catch (e) {
      console.warn('Could not clear stored messages:', e);
    }
  };

  // Sign out back to anonymous
  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (e) {
      console.warn('Firebase signout warning:', e);
    }
    setUserProfile(null);
    localStorage.removeItem('unizulu_student_profile');
    setMessages([INITIAL_WELCOME_MESSAGE]);
    setHistoryBannerNotice('Signed out of student account.');
    setTimeout(() => setHistoryBannerNotice(null), 3500);
  };

  // Apply APS score question to chat
  const handleApplyScoreToChat = (score: number, details: string) => {
    handleSaveAps(score);
    handleSendMessage(details, selectedLanguage);
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 font-sans overflow-hidden">
      
      {/* Left Navigation Panel */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onNewChat={handleResetChat}
        userProfile={userProfile}
        onOpenAuth={() => setIsAuthOpen(true)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        selectedLanguage={selectedLanguage}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white">
        
        {/* Sleek Top Navbar */}
        <Navbar
          userProfile={userProfile}
          activeTab={activeTab}
          isSidebarOpen={isSidebarOpen}
          onOpenAuth={() => setIsAuthOpen(true)}
          onResetChat={handleResetChat}
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          selectedLanguage={selectedLanguage}
          onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        />

        {/* Active Student Session Bar */}
        {userProfile && (
          userProfile.isGuest ? (
            <div className="bg-[#001726] text-slate-300 text-xs px-4 py-2 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                <span>
                  Guest Student Session: <strong className="text-white">@{userProfile.username}</strong>
                </span>
              </div>
              <button 
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-semibold text-[11px] transition-colors cursor-pointer"
              >
                Sign In to Save Chats
              </button>
            </div>
          ) : (
            <div className="bg-[#001726] text-slate-300 text-xs px-4 py-2 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  Student Account: <strong className="text-white">{userProfile.name}</strong> (@{userProfile.username})
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-sky-300">
                <span className="flex items-center gap-1">
                  <History className="w-3.5 h-3.5" />
                  <span>Persistent Chat Saved</span>
                </span>
                <button 
                  type="button"
                  onClick={() => setIsAuthOpen(true)}
                  className="underline hover:text-white cursor-pointer"
                >
                  Manage
                </button>
              </div>
            </div>
          )
        )}

        {/* Notification Toast */}
        {historyBannerNotice && (
          <div className="max-w-xl mx-auto w-full px-4 pt-2.5 z-20 animate-in fade-in slide-in-from-top-2">
            <div className="bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm flex items-center justify-between border border-emerald-600">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                <span>{historyBannerNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setHistoryBannerNotice(null)}
                className="p-1 rounded-md hover:bg-emerald-800 text-emerald-200 hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Primary View Area */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          
          {/* 1. Admissions Chat View */}
          {activeTab === 'chat' && (
            <>
              <ChatWindow
                messages={messages}
                isLoading={isLoading}
                userProfile={userProfile}
                onSendSuggestedAction={(action) => handleSendMessage(action, selectedLanguage)}
                onFeedbackSubmit={handleFeedbackSubmit}
                onOpenAps={() => setActiveTab('aps')}
                onOpenDocs={() => setActiveTab('documents')}
                onOpenFaculties={() => setActiveTab('faculties')}
                onResetChat={handleResetChat}
                onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
              />

              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
                onResetChat={handleResetChat}
                detectedLanguageCode={detectedLanguageCode}
                detectedLanguageName={detectedLanguageName}
                onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
              />
            </>
          )}

          {/* 2. APS Calculator Panel (Amber / Gold Theme) */}
          {activeTab === 'aps' && (
            <ApsCalculatorPanel
              currentScore={userProfile?.apsScore}
              onApplyScoreToChat={(score, details) => {
                handleApplyScoreToChat(score, details);
                setActiveTab('chat');
              }}
              onSaveToProfile={handleSaveAps}
              onBackToChat={() => setActiveTab('chat')}
            />
          )}

          {/* 3. Required Documents Panel (Emerald / Teal Theme) */}
          {activeTab === 'documents' && (
            <DocumentChecklistPanel
              userProfile={userProfile}
              onToggleDocument={handleToggleDocument}
              onAskDocQuestion={(q) => {
                handleSendMessage(q, selectedLanguage);
                setActiveTab('chat');
              }}
              onBackToChat={() => setActiveTab('chat')}
            />
          )}

          {/* 4. Faculties & Degrees Panel (Indigo / Royal Blue Theme) */}
          {activeTab === 'faculties' && (
            <FacultyExplorerPanel
              onSelectProgramQuery={(prog, fac) => {
                handleSendMessage(`What are the detailed admission requirements, minimum APS, and CAO code for ${prog} in the ${fac} at UNIZULU?`, selectedLanguage);
                setActiveTab('chat');
              }}
              onBackToChat={() => setActiveTab('chat')}
            />
          )}

          {/* 5. AI Knowledge & Learning Insights Panel (Violet / Purple Theme) */}
          {activeTab === 'learning' && (
            <LearningPanel
              onAskQuestion={(q) => {
                handleSendMessage(q, selectedLanguage);
                setActiveTab('chat');
              }}
              onBackToChat={() => setActiveTab('chat')}
            />
          )}
        </main>

        {/* Profile & Authentication Modal */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          userProfile={userProfile}
          onSaveProfile={handleSaveProfile}
          onGoogleSignIn={handleGoogleSignIn}
          onSelectUser={handleSelectUser}
          onContinueAsGuest={handleContinueAsGuest}
          onSignOut={handleSignOut}
        />

        {/* Feedback Statistics Modal */}
        <FeedbackStatsModal
          isOpen={isStatsOpen}
          onClose={() => setIsStatsOpen(false)}
          onAskQuestion={(q) => handleSendMessage(q, selectedLanguage)}
        />

        {/* Dedicated Language Selection Modal (All 11 South African official languages) */}
        <LanguageSelectModal
          isOpen={isLanguageModalOpen}
          onClose={() => setIsLanguageModalOpen(false)}
          selectedLanguage={selectedLanguage}
          onSelectLanguage={(langCode) => {
            setSelectedLanguage(langCode);
            try {
              localStorage.setItem('unizulu_selected_lang', langCode);
            } catch (e) {
              console.warn('Could not persist language to localStorage:', e);
            }

            if (langCode !== 'auto') {
              const langInfo = getLanguageByCode(langCode);
              setDetectedLanguageCode(langInfo.code);
              setDetectedLanguageName(langInfo.name);
              setHistoryBannerNotice(`Language preference set to ${langInfo.name} (${langInfo.nativeName}) ${langInfo.flagOrIcon}. The advisor will converse 100% in ${langInfo.name}.`);
            } else {
              setHistoryBannerNotice('Language set to Auto-detect. The advisor will match whatever language you type.');
            }
          }}
          detectedLanguageCode={detectedLanguageCode}
          detectedLanguageName={detectedLanguageName}
        />

      </div>
    </div>
  );
}
