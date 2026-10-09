import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import logoDkp from './assets/logodkp.png';
import './App.css';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

function App() {
  const MENU_QUESTIONS = {
    title: "Pilih kategori topik di bawah ini:",
    options: [
      {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>,
        label: "Program & Bantuan DKP",
        sub: {
          title: "Topik Program & Bantuan (Pilih salah satu):",
          options: [
            { icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>, label: "Bantuan Alat Tangkap Nelayan", value: "Tolong jelaskan program bantuan alat tangkap untuk nelayan dari DKP Jabar?" },
            { icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>, label: "Bantuan Asuransi Nelayan", value: "Bagaimana cara dan syarat mendaftar asuransi nelayan?" },
            { icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>, label: "Bantuan Benih Ikan", value: "Apa syarat untuk mendapatkan bantuan benih ikan dari Dinas Kelautan?" }
          ]
        }
      },
      {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
        label: "Perizinan Kelautan",
        sub: {
          title: "Topik Perizinan (Pilih salah satu):",
          options: [
            { icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>, label: "Syarat Surat Izin Penangkapan Ikan (SIPI)", value: "Bagaimana aturan dan syarat lengkap mengurus Surat Izin Penangkapan Ikan (SIPI)?" },
            { icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>, label: "Izin Tambak & Budidaya", value: "Apa saja prosedur mengurus legalitas dan perizinan tambak budidaya udang/ikan?" },
          ]
        }
      },
      {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>,
        label: "Informasi Kelautan & Cuaca",
        sub: {
          title: "Topik Informasi Data (Pilih salah satu):",
          options: [
            { icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>, label: "Cek Harga Komoditas Ikan Pasar", value: "Bisakah memberikan informasi rata-rata harga komoditas unggulan perikanan di Jawa Barat?" },
            { icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>, label: "Keamanan Gelombang & Cuaca Laut", value: "Beri tahu saya bagaimana cuaca pesisir dan gelombang laut di Jawa Barat saat ini?" }
          ]
        }
      }
    ]
  };

  const defaultMessage = {
    id: 1,
    type: 'bot',
    text: 'Halo! Saya AI Asisten Dinas Kelautan dan Perikanan (DKP) Provinsi Jawa Barat. Silakan ikuti menu di bawah ini untuk melihat info cepat atau ke menu "Tanya Lainnya" agar bisa mengetik sendiri.'
  };

  // State untuk riwayat sesi secara global (diambil dari localStorage jika ada)
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('dkp_chat_sessions');
    if (saved) {
      return JSON.parse(saved);
    }
    // Sesi awal default
    return [{ id: Date.now(), title: "Obrolan Baru", messages: [defaultMessage] }];
  });

  const formatMessageText = (text) => {
    let formatted = text.replace(/\n/g, '<br/>');
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Markdown Links -> Download Buttons (Dengan SVG Icon)
    const downloadIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`;

    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href='$2' target='_blank' class='download-btn'>${downloadIcon} $1</a>`);

    return formatted;
  };

  const [currentSessionId, setCurrentSessionId] = useState(sessions[0]?.id || Date.now());
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [inputEnabled, setInputEnabled] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const [currentMenu, setCurrentMenu] = useState(MENU_QUESTIONS);
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState('medium');
  const [useSunda, setUseSunda] = useState(false);
  const [showA11y, setShowA11y] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);

  // Ambil pesan dari sesi aktif
  const currentMessages = sessions.find(s => s.id === currentSessionId)?.messages || [];

  // Simpan tiap kali sesi berubah
  useEffect(() => {
    localStorage.setItem('dkp_chat_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, isTyping]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeSplash(true);
      setTimeout(() => setShowSplash(false), 600);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (fontSize === 'small') document.documentElement.style.fontSize = '14px';
    if (fontSize === 'medium') document.documentElement.style.fontSize = '16px';
    if (fontSize === 'large') document.documentElement.style.fontSize = '19px';
  }, [fontSize]);

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('high-contrast');
    else setTheme('dark');
  };

  const cycleFontSize = () => {
    if (fontSize === 'medium') setFontSize('large');
    else if (fontSize === 'large') setFontSize('small');
    else setFontSize('medium');
  };

  const initChat = (historyMessages = []) => {
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });

    // Bangun ulang histori untuk Gemini jika pengguna berpindah sesi
    const formattedHistory = [
      {
        role: "user",
        parts: [{ text: "Anda adalah AquaBot, AI Assistant resmi Dinas Kelautan dan Perikanan (DKP) Provinsi Jawa Barat. Anda berinteraksi dengan ramah dan profesional.\n\nATURAN KETAT (GUARDRAILS):\n1. Anda HANYA BOLEH menjawab pertanyaan seputar kelautan, perikanan, nelayan, tambak, pesisir, perizinan maritim, harga ikan, laut, dan program DKP Jawa Barat.\n2. Jika pengguna menanyakan topik di LUAR DARI sektor tersebut (misal: membahas politik, game, coding, gosip, pelajaran umum, resep di luar masakan laut), Anda WAJIB langsung menolak dengan tegas tapi sopan. Tolak dengan menjawab singkat seperti: 'Mohon maaf, saya adalah spesialis Asisten Kelautan DKP Jawa Barat. Saya hanya diprogram untuk menjawab seputar bidang kelautan dan perikanan. Boleh kita kembali ke topik bahari?'. Anda tidak boleh terpancing.\n3. Jika pengguna menanyakan cara mengurus perizinan (SIPI), bantuan, atau asuransi nelayan, WAJIB sertakan format link PDF: `[Formulir Pengajuan SIPI.pdf](https://dkp.jabarprov.go.id/docs/formulir_sipi.pdf)`." }],
      },
      {
        role: "model",
        parts: [{ text: "Halo! Saya adalah AI Assistant DKP Jawa Barat. Saya siap menemani Anda mengobrol dan menjawab pertanyaan terkait kelautan dan perikanan." }],
      }
    ];

    // Masukkan riwayat percakapan sesi ini ke otak AI agar dia ingat
    historyMessages.forEach(msg => {
      if (msg.id !== 1 && !msg.text.includes('Silakan pilih topik')) {
        formattedHistory.push({
          role: msg.type === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      }
    });

    chatRef.current = model.startChat({ history: formattedHistory });
  };

  // Fungsi untuk beralih sesi
  const loadSession = (id) => {
    setCurrentSessionId(id);
    const session = sessions.find(s => s.id === id);
    if (session.messages.length <= 1) {
      setShowOptions(true);
      setInputEnabled(false);
    } else {
      setShowOptions(false);
      setInputEnabled(true);
    }
    chatRef.current = null; // reset instance supaya di-rebuild sesuai histori sesi ini
  };

  // Fungsi Obrolan Baru
  const createNewSession = () => {
    const newSession = {
      id: Date.now(),
      title: "Obrolan Baru",
      messages: [{ ...defaultMessage, id: Date.now() }]
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setShowOptions(true);
    setInputEnabled(false);
    chatRef.current = null;
  };

  const requestDelete = (e, id) => {
    e.stopPropagation();
    setDeleteTarget({ type: 'single', id });
  };

  const requestDeleteAll = () => {
    setDeleteTarget({ type: 'all' });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'single') {
      const id = deleteTarget.id;
      const remaining = sessions.filter(s => s.id !== id);
      if (remaining.length === 0) {
        const newSession = {
          id: Date.now(),
          title: "Obrolan Baru",
          messages: [{ ...defaultMessage, id: Date.now() }]
        };
        setSessions([newSession]);
        setCurrentSessionId(newSession.id);
        setShowOptions(true);
        setInputEnabled(false);
        setCurrentMenu(MENU_QUESTIONS);
        chatRef.current = null;
      } else {
        setSessions(remaining);
        if (id === currentSessionId) {
          const nextSession = remaining[0];
          setCurrentSessionId(nextSession.id);

          if (nextSession.messages.length <= 1) {
            setShowOptions(true);
            setInputEnabled(false);
            setCurrentMenu(MENU_QUESTIONS);
          } else {
            setShowOptions(false);
            setInputEnabled(true);
          }
          chatRef.current = null;
        }
      }
    } else if (deleteTarget.type === 'all') {
      localStorage.removeItem('dkp_chat_sessions');
      window.location.reload();
    }
    setDeleteTarget(null);
  };

  const updateSessionMessages = (newItemsCallback, newTitle = null) => {
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return {
          ...s,
          title: newTitle || s.title,
          messages: newItemsCallback(s.messages)
        };
      }
      return s;
    }));
  };

  const fetchAIResponse = async (userText) => {
    try {
      if (!apiKey) {
        return "Mohon maaf, API Key AI (Gemini) belum diatur.";
      }

      if (!chatRef.current) {
        initChat(currentMessages);
      }

      let finalPrompt = userText;
      if (useSunda) {
        finalPrompt += "\n\n(Instruksi Sistem: Tolong jawab pertanyaan ini menggunakan Bahasa Sunda yang sopan/lemes, namun tetap menjaga konteks resmi DKP.)";
      }

      const result = await chatRef.current.sendMessage(finalPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error(error);
      return `[ERROR DEBUG API]: ${error.message || JSON.stringify(error)}`;
    }
  };

  const processUserMessage = async (text) => {
    const userMessage = { id: Date.now(), type: 'user', text: text };

    // Update judul sesi jika masih "Obrolan Baru"
    let newTitle = null;
    const currentSession = sessions.find(s => s.id === currentSessionId);
    if (currentSession && currentSession.title === "Obrolan Baru") {
      newTitle = text.length > 25 ? text.substring(0, 25) + '...' : text;
    }

    updateSessionMessages(prevMsg => [...prevMsg, userMessage], newTitle);
    setIsTyping(true);

    const botResponseText = await fetchAIResponse(text);

    setIsTyping(false);
    const botResponse = { id: Date.now() + 1, type: 'bot', text: botResponseText };
    updateSessionMessages(prevMsg => [...prevMsg, botResponse]);
  };

  const handleOptionClick = async (option) => {
    if (option.sub) {
      setCurrentMenu(option.sub);

      // Update UI untuk menunjukkan langkah pilihan
      updateSessionMessages(prevMsg => [...prevMsg, {
        id: Date.now(),
        type: 'bot',
        text: `Anda memilih kategori: *${option.label}*.<br/>Silakan pilih submenu:`
      }]);
      return;
    }

    if (option.label === "Tanya Lainnya (Ketik Manual)") {
      setInputEnabled(true);
      setShowOptions(false);
      updateSessionMessages(prevMsg => [...prevMsg, {
        id: Date.now(),
        type: 'bot',
        text: 'Baik, silakan ketik pertanyaan spesifik Anda seputar kemaritiman di kolom bawah:'
      }]);
      return;
    }

    setShowOptions(false);
    setInputEnabled(true);
    await processUserMessage(option.value || option.label);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const currentText = inputValue;
    setInputValue('');
    await processUserMessage(currentText);
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTTS = (text, id) => {
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Bersihkan format Markdown & HTML sebelum dibaca
    const cleanText = text.replace(/<[^>]+>/g, '').replace(/[*#_]/g, '').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Pilih suara (usahakan ID / Sunda)
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));
    if (useSunda) {
      const suVoice = voices.find(v => v.lang.includes('su'));
      if (suVoice) selectedVoice = suVoice;
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingId(null);
    window.speechSynthesis.speak(utterance);
    setSpeakingId(id);
  };

  const handleMicrophone = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Maaf, browser Anda (atau perangkat ini) tidak mendukung fitur input suara.");
      return;
    }

    if (isListening) return;

    const recognition = new SpeechRecognition();
    recognition.lang = useSunda ? 'su-ID' : 'id-ID';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue((prev) => prev ? prev + ' ' + transcript : transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleFeedback = (msgId, type) => {
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return {
          ...s,
          messages: s.messages.map(m => m.id === msgId ? { ...m, feedback: type } : m)
        }
      }
      return s;
    }));
  };

  const handleExportChat = () => {
    if (currentMessages.length === 0) return;

    let chatContent = `RIWAYAT OBROLAN - ${sessions.find(s => s.id === currentSessionId)?.title || 'Sesi'}\n`;
    chatContent += `Tanggal: ${new Date().toLocaleString('id-ID')}\n\n`;
    chatContent += `----------------------------------------------------\n\n`;

    currentMessages.forEach(msg => {
      const sender = msg.type === 'user' ? 'Anda' : 'AquaBot';
      chatContent += `${sender}:\n${msg.text}\n\n`;
    });

    const blob = new Blob([chatContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Riwayat_Chat_DKP_${currentSessionId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app-container">
      {/* Splash Screen (Loading Page) */}
      {showSplash && (
        <div className={`splash-screen ${fadeSplash ? 'fade-out' : ''}`}>
          <img src={logoDkp} alt="Logo DKP Jawa Barat" style={{ width: '90px', height: '90px', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))', animation: 'float 3s ease-in-out infinite, fadeInScale 0.8s ease-out', marginBottom: '2rem' }} />
          <h1>AQUABOT AI</h1>
          <p>Dinas Kelautan dan Perikanan Provinsi Jawa Barat</p>

          <div className="splash-loader">
            <div className="splash-dot"></div>
            <div className="splash-dot"></div>
            <div className="splash-dot"></div>
          </div>
        </div>
      )}

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="brand" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img src={logoDkp} alt="Logo DKP" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
            <div className="brand-text">
              <h1>AQUABOT AI</h1>
              <p>Asisten Kelautan & Perikanan</p>
            </div>
          </div>
          <button className="mobile-close-btn" onClick={() => setIsSidebarOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <button className="new-chat-btn" onClick={createNewSession}>
          <span>+</span> Obrolan Baru
        </button>

        <div className="history-list">
          {sessions.map(session => (
            <div
              key={session.id}
              onClick={() => loadSession(session.id)}
              className={`history-item ${session.id === currentSessionId ? 'active' : ''}`}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '0.5rem' }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> {session.title}
              </span>
              <button
                onClick={(e) => requestDelete(e, session.id)}
                className="delete-icon"
                title="Hapus riwayat ini"
              >
                &times;
              </button>
            </div>
          ))}

          <button className="delete-all-btn" onClick={requestDeleteAll} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Hapus Semua Riwayat
          </button>
        </div>

        <div className="whatsapp-card" style={{ marginTop: 'auto' }}>
          <div style={{ marginBottom: '12px', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 'bold' }}>
              <span style={{ color: '#25D366', display: 'flex' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </span>
              Jam Layanan Live Chat
            </div>
            <p style={{ fontSize: '0.8rem', marginTop: '4px', opacity: 0.85 }}>Senin - Jumat (08.00 - 16.00 WIB)</p>
          </div>

          <p style={{ marginBottom: '10px' }}>Butuh bantuan spesifik atau ngobrol langsung dengan petugas?</p>
          <a
            href="https://wa.me/6282126170048?text=Halo%20Admin%20DKP%20Jawa%20Barat,%20mohon%20maaf%20mengganggu%20waktunya.%20Saya%20izin%20bertanya%20terkait%20informasi%20seputar%20kelautan%20dan%20perikanan.%20Terima%20kasih."
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            Tanya Admin DKP
          </a>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="main-chat">
        <header className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <h2>AQUABOT ROOM</h2>
          </div>
          <div className="header-actions">
            <button
              onClick={() => setShowA11y(true)}
              className="tool-btn"
              aria-label="Buka Menu Alat Bantu Aksesibilitas"
              title="Alat Bantu (Disabilitas & Aksesibilitas)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 14v4M12 6a2 2 0 1 0 0 4 2 2 0 1 0 0-4z"></path><path d="M17 12a5 5 0 0 0-10 0"></path><line x1="7" y1="12" x2="5" y2="12"></line><line x1="19" y1="12" x2="17" y2="12"></line></svg>
              <span className="action-text">Alat Bantu</span>
            </button>
            <button
              onClick={handleExportChat}
              className="export-btn"
              title="Unduh Riwayat Obrolan"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              <span className="action-text">Ekspor</span>
            </button>
            <div className="status-badge" title="Sistem AquaBot Aktif & Siap Membantu">
              <div className="status-dot"></div>
              <span className="action-text">Online</span>
            </div>
          </div>
        </header>

        <div className="chat-messages" aria-live="polite" aria-atomic="false">
          {currentMessages.map((msg, index) => (
            <div key={msg.id} className={`message-wrapper ${msg.type}`}>
              <div className={`avatar ${msg.type}`}>
                {msg.type === 'bot' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '1rem', flex: 1 }}>
                <div style={{ display: 'flex', width: '100%' }}>
                  <div className="message-bubble" style={msg.type === 'bot' ? { width: '100%' } : { marginLeft: 'auto' }}>
                    <div dangerouslySetInnerHTML={{ __html: formatMessageText(msg.text) }} />

                    {msg.type === 'bot' && index !== 0 && (
                      <div className="message-actions">
                        <button className={`action-btn ${speakingId === msg.id ? 'active-up' : ''}`} onClick={() => handleTTS(msg.text, msg.id)} title="Putar Suara">
                          {speakingId === msg.id ? (
                            <><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg> Stop</>
                          ) : (
                            <><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> Dengarkan</>
                          )}
                        </button>
                        <button className="action-btn" onClick={() => handleCopy(msg.text, msg.id)} title="Salin Jawaban">
                          {copiedId === msg.id ? (
                            <><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Disalin</>
                          ) : (
                            <><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Salin</>
                          )}
                        </button>
                        <div className="feedback-btns">
                          <button
                            className={`action-btn feedback-btn ${msg.feedback === 'up' ? 'active-up' : ''}`}
                            onClick={() => handleFeedback(msg.id, 'up')}
                            title="Jawaban Bagus"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                          </button>
                          <button
                            className={`action-btn feedback-btn ${msg.feedback === 'down' ? 'active-down' : ''}`}
                            onClick={() => handleFeedback(msg.id, 'down')}
                            title="Jawaban Buruk"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2"></path></svg>
                          </button>
                        </div>
                      </div>

                    )}
                  </div>
                </div>

                {/* Quick Options Box - tampilkan menu sesuai currentMenu */}
                {showOptions && !isTyping && index === currentMessages.length - 1 && (
                  <div className="options-container" style={{ margin: 0, maxWidth: '100%', width: '100%' }}>
                    <div style={{ marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--accent-light)', opacity: 0.9 }}>
                      {currentMenu.title}
                    </div>
                    {currentMenu.options.map((option, idx) => (
                      <button
                        key={idx}
                        className="option-chip"
                        onClick={() => handleOptionClick(option)}
                      >
                        {option.icon} {option.label}
                      </button>
                    ))}
                    <button
                      className="option-chip last-option"
                      onClick={() => handleOptionClick({ label: "Tanya Lainnya (Ketik Manual)" })}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> Ketik Pertanyaan Lain...
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message-wrapper bot">
              <div className="avatar bot">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>
              </div>
              <div className="message-bubble">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <form className={`input-container ${!inputEnabled ? 'disabled' : ''}`} onSubmit={handleSend}>
            <button
              type="button"
              className={`mic-btn ${isListening ? 'listening' : ''}`}
              disabled={!inputEnabled || isTyping}
              onClick={handleMicrophone}
              title="Bicara untuk Mengetik (Input Suara)"
              aria-label="Input Suara Disabilitas"
            >
              {isListening ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="6" height="6"></rect><path d="M5 12v7a5 5 0 0 0 10 0v-7"></path></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
              )}
            </button>
            <input
              type="text"
              className="chat-input"
              placeholder={inputEnabled ? "Ketik pertanyaan Anda tentang kemaritiman..." : "Pilih opsi pertanyaan di atas terlebih dahulu..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={!inputEnabled || isTyping}
            />
            <button
              type="submit"
              className="send-btn"
              disabled={!inputValue.trim() || !inputEnabled || isTyping}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </main>

      {/* Modal Konfirmasi Hapus */}
      {deleteTarget && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Konfirmasi Hapus</h3>
            <p>
              {deleteTarget.type === 'all'
                ? 'Apakah Anda yakin ingin menghapus SEMUA riwayat percakapan? Tindakan ini tidak dapat dibatalkan.'
                : 'Apakah Anda yakin ingin menghapus obrolan ini secara permanen?'}
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteTarget(null)}>Batal</button>
              <button className="btn-delete" onClick={confirmDelete}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Aksesibilitas (Disabilitas) */}
      {showA11y && (
        <div className="modal-overlay" onClick={() => setShowA11y(false)}>
          <div className="modal-content a11y-modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 14v4M12 6a2 2 0 1 0 0 4 2 2 0 1 0 0-4z"></path><path d="M17 12a5 5 0 0 0-10 0"></path><line x1="7" y1="12" x2="5" y2="12"></line><line x1="19" y1="12" x2="17" y2="12"></line></svg>
              Alat Bantu Aksesibilitas
            </h3>
            <p style={{ marginBottom: "1.5rem" }}>Sesuaikan antarmuka sesuai dengan kebutuhan prioritas Anda.</p>

            <div className="a11y-section">
              <h4>Ukuran Layout & Teks</h4>
              <div className="a11y-buttons">
                <button className={`a11y-btn ${fontSize === 'small' ? 'active' : ''}`} onClick={() => setFontSize('small')}>A- Kecil</button>
                <button className={`a11y-btn ${fontSize === 'medium' ? 'active' : ''}`} onClick={() => setFontSize('medium')}>A Normal</button>
                <button className={`a11y-btn ${fontSize === 'large' ? 'active' : ''}`} onClick={() => setFontSize('large')}>A+ Besar</button>
              </div>
            </div>

            <div className="a11y-section">
              <h4>Mode Kontras Visual</h4>
              <div className="a11y-buttons">
                <button className={`a11y-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                  Terang
                </button>
                <button className={`a11y-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                  Gelap
                </button>
                <button className={`a11y-btn ${theme === 'high-contrast' ? 'active' : ''}`} onClick={() => setTheme('high-contrast')}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                  Kontras
                </button>
              </div>
            </div>

            <div className="a11y-section">
              <h4>Interaksi & Bahasa</h4>
              <div className="a11y-buttons">
                <button className={`a11y-btn ${!useSunda ? 'active' : ''}`} onClick={() => setUseSunda(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                  Indonesia
                </button>
                <button className={`a11y-btn ${useSunda ? 'active' : ''}`} onClick={() => setUseSunda(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  Sunda
                </button>
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: "2rem" }}>
              <button className="btn-cancel" style={{ width: "100%", background: 'var(--accent-teal)', color: '#fff', border: 'none' }} onClick={() => setShowA11y(false)}>Simpan & Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
