import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, MessageSquare, Wind, Shield, History, Send,
  Mic, Activity, Bell, Settings, User, LogOut, Trash2,
  Home, Users, Flame, Bot, Sparkles, Phone
} from 'lucide-react';

// --- INTEGRATED SYSTEM STYLES ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Spectral:ital,wght@0,300;1,400&display=swap');

  :root {
    --bg-dark: #0a0a0b;
    --card-bg: rgba(255, 255, 255, 0.02);
    --border: rgba(255, 255, 255, 0.08);
    --accent-rose: #fb7185;
    --accent-purple: #a78bfa;
    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background: var(--bg-dark);
    color: var(--text-primary);
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  .glass-card {
    background: var(--card-bg);
    backdrop-filter: blur(24px);
    border: 1px solid var(--border);
    border-radius: 24px;
  }

  .serene-text {
    font-family: 'Spectral', serif;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }

  .mood-emoji {
    transition: all 0.2s ease;
  }

  .mood-emoji:hover {
    transform: scale(1.1);
  }
`;

export default function Noracle() {
  // --- STATE MANAGEMENT ---
  const [currentView, setCurrentView] = useState('landing');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [messages, setMessages] = useState(() => JSON.parse(localStorage.getItem('noracle_chat') || '[]'));
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [screamText, setScreamText] = useState('');
  const [screamLevel, setScreamLevel] = useState(0);
  const [userStats, setUserStats] = useState(() => JSON.parse(localStorage.getItem('noracle_stats') || JSON.stringify({
    streakDays: 0,
    habitsCompleted: 0,
    weeklyProgress: [40, 70, 45, 90, 65, 80, 50],
    lastMood: null,
    sessionsCount: 0
  })));
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const canvasRef = useRef(null);

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('noracle_chat', JSON.stringify(messages));
    localStorage.setItem('noracle_stats', JSON.stringify(userStats));
  }, [messages, userStats]);

  // --- CLICK OUTSIDE HANDLER ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  // --- PARTICLE BACKGROUND ---
  useEffect(() => {
    if (currentView !== 'landing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const shootingStars = [];
    const particleCount = 80;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * 0.3 - 0.15;
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = `rgba(167, 139, 250, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class ShootingStar {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.length = Math.random() * 80 + 20;
        this.speedX = Math.random() * 8 + 4;
        this.speedY = Math.random() * 2 + 1;
        this.opacity = 1;
        this.trail = [];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= 0.02;

        // Add trail points
        this.trail.push({ x: this.x, y: this.y, opacity: this.opacity });

        // Remove old trail points
        if (this.trail.length > 10) {
          this.trail.shift();
        }

        // Reset when off screen or faded
        if (this.y > canvas.height + 50 || this.opacity <= 0) {
          this.reset();
        }
      }

      draw() {
        if (this.opacity <= 0) return;

        // Draw trail
        for (let i = 0; i < this.trail.length; i++) {
          const point = this.trail[i];
          const trailOpacity = point.opacity * (i / this.trail.length);
          ctx.strokeStyle = `rgba(255, 255, 255, ${trailOpacity})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(point.x - this.speedX * 0.5, point.y - this.speedY * 0.5);
          ctx.stroke();
        }

        // Draw main star
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw glow
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 8);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity * 0.3})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Create initial shooting stars
    for (let i = 0; i < 2; i++) {
      shootingStars.push(new ShootingStar());
    }

    let lastShootingStarTime = Date.now();

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Update and draw shooting stars
      shootingStars.forEach((star) => {
        star.update();
        star.draw();
      });

      // Add new shooting star every 3 seconds
      const currentTime = Date.now();
      if (currentTime - lastShootingStarTime > 3000) {
        shootingStars.push(new ShootingStar());
        lastShootingStarTime = currentTime;

        // Limit number of shooting stars
        if (shootingStars.length > 5) {
          shootingStars.shift();
        }
      }

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentView]);

  // --- FEATURES ---
  const handleChat = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Update stats
    setUserStats(prev => ({ ...prev, sessionsCount: prev.sessionsCount + 1 }));

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `You are Noracle AI - a compassionate, empathetic AI therapist. You listen without judgment, validate feelings, and offer gentle support. You don't give advice unless asked. You hold space for emotions. User says: ${input}`,
            },
          ],
        }),
      });

      const data = await response.json();
      const aiResponse = data.content?.[0]?.text || "I'm here with you. Take your time to express what's in your heart.";

      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        content: aiResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        content: "I'm here for you, but I'm having trouble connecting right now. Please try again. Your feelings are still valid.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const releaseScream = () => {
    if (!screamText.trim()) return;

    alert('Your emotions have been released into the void. This message will never be stored. You are safe here.');
    setScreamText('');
    setUserStats(prev => ({ ...prev, streakDays: prev.streakDays + 1 }));
  };

  const setMood = (mood) => {
    setUserStats(prev => ({ ...prev, lastMood: mood }));
  };

  const clearHistory = () => {
    if (window.confirm("Clear all emotional logs? This action cannot be undone.")) {
      setMessages([]);
    }
  };

  // --- LANDING PAGE ---
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #0a0a0b, #1a1a2e, #16213e)' }}>
        {/* Particle Background - Now properly layered with content */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 1 }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-rose-900/20" style={{ zIndex: 2 }} />

        {/* Main Content - Layered above particles */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Header */}
          <nav className="p-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-xl font-semibold tracking-tighter">NORACLE</span>
            </div>
            <button
              onClick={() => setCurrentView('app')}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-sm font-medium transition-all"
            >
              Enter →
            </button>
          </nav>

          {/* Hero - Now integrated with particle background */}
          <main className="flex-1 flex items-center justify-center px-6">
            <div className="max-w-4xl text-center space-y-8 relative">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="relative z-10"
              >
                <h1 className="serene-text text-6xl md:text-8xl font-light mb-6 bg-gradient-to-r from-white via-purple-200 to-rose-200 bg-clip-text text-transparent drop-shadow-lg">
                  Noracle
                </h1>
                <p className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed drop-shadow-md">
                  In a world that never stops talking,<br />
                  <span className="text-rose-400 font-medium">Noracle listens.</span>
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="space-y-6 text-slate-400 relative z-10"
              >
                <p className="text-lg italic drop-shadow-md">Not with answers. Not with advice. Just presence.</p>
                <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  <motion.div
                    className="glass-card p-6 hover:bg-white/5 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Bot className="text-purple-400 mx-auto mb-3" size={32} />
                    <h3 className="font-semibold mb-2">AI Therapist</h3>
                    <p className="text-sm">24/7 compassionate listening companion</p>
                  </motion.div>
                  <motion.div
                    className="glass-card p-6 hover:bg-white/5 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Flame className="text-rose-400 mx-auto mb-3" size={32} />
                    <h3 className="font-semibold mb-2">Scream Room</h3>
                    <p className="text-sm">Safe space to release built-up emotions</p>
                  </motion.div>
                  <motion.div
                    className="glass-card p-6 hover:bg-white/5 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Users className="text-blue-400 mx-auto mb-3" size={32} />
                    <h3 className="font-semibold mb-2">Community</h3>
                    <p className="text-sm">Connect with others on similar journeys</p>
                  </motion.div>
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                onClick={() => setCurrentView('app')}
                className="mt-12 px-12 py-4 bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 rounded-full text-lg font-medium transition-all transform hover:scale-105 shadow-2xl relative z-10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Begin Your Journey
              </motion.button>

              <p className="text-sm text-slate-500 mt-4 relative z-10 drop-shadow-sm">Free to explore • ₦1,500/month for full access</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // --- MAIN APP ---
  return (
    <div className="min-h-screen flex flex-col">
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* TOP NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <span className="text-lg font-semibold tracking-tighter">Noracle</span>
          </div>

          <div className="flex items-center gap-8 text-sm text-slate-400 font-medium">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: Home },
              { key: 'therapist', label: 'AI Therapist', icon: Bot },
              { key: 'scream', label: 'Scream Room', icon: Flame },
              { key: 'community', label: 'Community', icon: Users }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${activeTab === key
                  ? 'text-white bg-white/10'
                  : 'hover:text-slate-200 hover:bg-white/5'
                  }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-slate-400 relative">
            <Bell size={18} className="hover:text-white cursor-pointer" />
            <div
              className="relative cursor-pointer profile-menu-container"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center hover:border-white/20 transition-all">
                <User size={16} className="text-slate-300" />
              </div>

              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-12 w-64 glass-card border border-white/10 rounded-xl py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm font-medium text-white">Welcome back</p>
                      <p className="text-xs text-slate-400">Emotional wellness journey</p>
                    </div>

                    <div className="py-2">
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                        <User size={16} />
                        Profile Settings
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                        <Activity size={16} />
                        Wellness Stats
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                        <Settings size={16} />
                        Preferences
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                        <Bell size={16} />
                        Notifications
                      </button>
                    </div>

                    <div className="border-t border-white/10 pt-2">
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all">
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-10">
        <AnimatePresence mode="wait">

          {/* DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Welcome Section */}
              <div className="glass-card p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="serene-text text-4xl mb-2">Welcome back.</h1>
                    <p className="text-slate-400 italic">Your emotional pulse is {userStats.lastMood ? 'acknowledged' : 'steady'} today.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-rose-400">{userStats.sessionsCount}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">Sessions</p>
                  </div>
                </div>

                {/* Mood Check-in */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold mb-4">How are you feeling today?</h3>
                  <div className="flex gap-4">
                    {['😢', '😔', '😐', '🙂', '😊'].map((emoji, idx) => (
                      <button
                        key={idx}
                        onClick={() => setMood(emoji)}
                        className={`mood-emoji text-3xl p-3 rounded-xl transition-all ${userStats.lastMood === emoji ? 'bg-rose-500/20 scale-110' : 'hover:bg-white/5'
                          }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Activity Chart */}
                <div>
                  <h3 className="text-sm font-semibold mb-4">Weekly Resilience</h3>
                  <div className="h-32 flex items-end gap-2">
                    {userStats.weeklyProgress.map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className="flex-1 bg-gradient-to-t from-rose-500/20 to-rose-500/60 rounded-t-lg border-t border-rose-500/40"
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-slate-600">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <span key={day}>{day}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6">
                  <Activity className="text-rose-400 mb-4" size={24} />
                  <h3 className="font-semibold text-lg mb-2">{userStats.streakDays}</h3>
                  <p className="text-slate-500 text-sm">Days of growth</p>
                </div>

                <div className="glass-card p-6">
                  <Shield className="text-purple-400 mb-4" size={24} />
                  <h3 className="font-semibold text-lg mb-2">{userStats.habitsCompleted}</h3>
                  <p className="text-slate-500 text-sm">Habits completed</p>
                </div>

                <div className="glass-card p-6">
                  <Sparkles className="text-blue-400 mb-4" size={24} />
                  <h3 className="font-semibold text-lg mb-2">{Math.round(userStats.weeklyProgress.reduce((a, b) => a + b, 0) / 7)}</h3>
                  <p className="text-slate-500 text-sm">Avg. weekly score</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="glass-card p-6 cursor-pointer"
                  onClick={() => setActiveTab('therapist')}
                >
                  <Bot className="text-purple-400 mb-4" size={32} />
                  <h3 className="font-semibold mb-2">Talk to AI Therapist</h3>
                  <p className="text-slate-500 text-sm mb-4">24/7 compassionate listening companion</p>
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">Always available</span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="glass-card p-6 cursor-pointer"
                  onClick={() => setActiveTab('scream')}
                >
                  <Flame className="text-rose-400 mb-4" size={32} />
                  <Flame className="text-rose-400 mb-4" size={32} />
                  <h3 className="font-semibold mb-2">Enter Scream Room</h3>
                  <p className="text-slate-500 text-sm mb-4">Safe space to release built-up emotions</p>
                  <span className="text-xs bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full">Anonymous</span>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* AI THERAPIST VIEW */}
          {activeTab === 'therapist' && (
            <motion.div
              key="therapist"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-[75vh] flex flex-col glass-card overflow-hidden"
            >
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium">AI Empathy Agent v2.4</span>
                </div>
                <button onClick={clearHistory} className="text-slate-500 hover:text-rose-400 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 && (
                  <div className="text-center py-20 opacity-50">
                    <Bot size={48} className="mx-auto mb-4 text-slate-600" />
                    <p className="text-slate-400">Start typing to begin your session.</p>
                    <p className="text-xs text-slate-600 mt-2">Everything you share is held in confidence.</p>
                  </div>
                )}
                {messages.map(m => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="max-w-[80%] space-y-1">
                      <div className={`p-4 rounded-2xl ${m.role === 'user' ? 'bg-slate-800' : 'bg-white/5 border border-white/10'}`}>
                        <p className="text-md leading-relaxed">{m.content}</p>
                      </div>
                      <p className="text-[10px] text-slate-600 px-2">{m.time}</p>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <form onSubmit={handleChat} className="p-6 bg-white/5 border-t border-white/5 flex gap-4">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your current state..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-3 outline-none focus:border-purple-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={isTyping}
                  className="p-3 bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 rounded-xl disabled:opacity-50 transition-all"
                >
                  <Send size={20} />
                </button>
              </form>
            </motion.div>
          )}

          {/* SCREAM ROOM VIEW */}
          {activeTab === 'scream' && (
            <motion.div
              key="scream"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="max-w-2xl mx-auto space-y-8">
                <div>
                  <h2 className="serene-text text-5xl mb-6">Let it out.</h2>
                  <p className="text-slate-500 max-w-md mx-auto italic">
                    This room is a void. Anything you type or say here is never saved. It dissolves as soon as you leave.
                  </p>
                </div>

                {/* Text Scream */}
                <div className="glass-card p-6">
                  <textarea
                    value={screamText}
                    onChange={(e) => setScreamText(e.target.value)}
                    placeholder="Write everything you're feeling... No one will see this. It disappears when you release it."
                    className="w-full h-32 bg-transparent border border-white/10 rounded-xl p-4 outline-none focus:border-rose-500 transition-all resize-none"
                  />
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-slate-600">{screamText.length} characters</span>
                    <button
                      onClick={releaseScream}
                      disabled={!screamText.trim()}
                      className="px-6 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 rounded-lg disabled:opacity-50 transition-all"
                    >
                      Release & Delete
                    </button>
                  </div>
                </div>

                {/* Visual Scream */}
                <div className="relative">
                  <div className="text-sm text-slate-500 mb-4">Or hold to scream visually</div>
                  <div className="relative w-64 h-64 mx-auto">
                    <motion.div
                      animate={{
                        scale: screamLevel > 0 ? [1, 1.2, 1] : 1,
                        opacity: screamLevel > 0 ? [0.3, 0.8, 0.3] : 0.3
                      }}
                      transition={{ repeat: screamLevel > 0 ? Infinity : 0, duration: 1 }}
                      className="absolute inset-0 bg-rose-500/10 rounded-full blur-3xl"
                    />
                    <button
                      onMouseDown={() => setScreamLevel(100)}
                      onMouseUp={() => setScreamLevel(0)}
                      onMouseLeave={() => setScreamLevel(0)}
                      className="relative z-10 w-full h-full glass-card flex items-center justify-center group active:scale-95 transition-transform"
                    >
                      <Mic size={60} className={screamLevel > 0 ? "text-rose-500 animate-pulse" : "text-slate-500"} />
                    </button>
                  </div>
                  <p className="text-xs uppercase tracking-widest text-slate-600 mt-4">Hold to activate</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* COMMUNITY VIEW */}
          {activeTab === 'community' && (
            <motion.div
              key="community"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="glass-card p-8 text-center">
                <Users className="text-blue-400 mx-auto mb-4" size={48} />
                <h2 className="serene-text text-3xl mb-4">Community Circles</h2>
                <p className="text-slate-500 mb-8">Connect with others on similar emotional journeys</p>

                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { name: 'Post-Work Vent', members: 12, desc: 'Unwind after a long day' },
                    { name: 'Grief Support', members: 8, desc: 'Hold space for loss' },
                    { name: 'Anxiety Circle', members: 15, desc: 'Navigate uncertainty together' }
                  ].map(group => (
                    <motion.div
                      key={group.name}
                      whileHover={{ scale: 1.02 }}
                      className="glass-card p-6 cursor-pointer"
                    >
                      <h3 className="font-semibold mb-2">{group.name}</h3>
                      <p className="text-slate-500 text-sm mb-4">{group.desc}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                          {group.members} Active
                        </span>
                        <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-all">
                          Join
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* EMERGENCY FOOTER */}
      <footer className="bg-white/[0.02] border-t border-white/5 py-8 px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Heart size={16} fill="currentColor" className="text-rose-400" />
              <span className="font-bold uppercase tracking-tighter">Noracle Wellness</span>
            </div>
            <span>•</span>
            <span>Built with care for humans who feel deeply</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="flex items-center gap-2 text-rose-400 font-semibold">
                <Phone size={16} />
                <span>0800-456-4566</span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-slate-600">24/7 Crisis Hotline</p>
            </div>

            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-slate-600">© 2026 Noracle. Version 2.0.0</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}