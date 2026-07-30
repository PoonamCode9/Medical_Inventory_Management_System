import React, { useState, useRef, useEffect } from 'react';
import API from '../services/api';
import { FiMessageCircle, FiSend, FiX, FiMinus } from 'react-icons/fi';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'bot',
      text: "Hello! I am your **MediStock AI Assistant**. Ask me about:\n\n- 📊 *\"Dashboard summary\"*\n- ⚠️ *\"Show low stock alerts\"*\n- 📅 *\"Show expiring batches\"*\n- 🔍 *\"Search Paracetamol\"*\n- 🏢 *\"Who supplies Paracetamol?\"*",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = {
      sender: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    const inputMessage = message;
    setMessage('');
    setLoading(true);

    try {
      const res = await API.post('/api/chat', { message: inputMessage });
      const botMsg = {
        sender: 'bot',
        text: res.data.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = {
        sender: 'bot',
        text: "Sorry, I ran into an error connecting to the backend service. Make sure the backend is running!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format basic markdown to HTML safely
  const formatMarkdown = (text) => {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-sm font-bold text-teal-400 mt-2 mb-1">$1</h3>');
    html = html.replace(/^#### (.*$)/gim, '<h4 class="text-xs font-bold text-emerald-400 mt-2 mb-1">$1</h4>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em class="italic text-slate-300">$1</em>');
    // Inline code
    html = html.replace(/`(.*?)`/g, '<code class="bg-slate-800 text-teal-300 px-1 py-0.5 rounded font-mono text-[10px]">$1</code>');

    // Lists
    html = html.replace(/^\s*-\s+(.*$)/gim, '<li class="ml-4 list-disc text-slate-300 my-0.5">$1</li>');

    // Tables
    const lines = html.split('\n');
    let inTable = false;
    let tableHtml = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('|') && line.endsWith('|')) {
        if (!inTable) {
          inTable = true;
          tableHtml += '<div class="overflow-x-auto my-2 rounded-lg border border-slate-800"><table class="w-full text-[11px] border-collapse bg-slate-900/60">';
        }
        
        // Skip separator line
        if (line.includes('---')) continue;

        const cells = line.split('|').slice(1, -1);
        const cellTag = tableHtml.includes('</thead>') ? 'td' : 'th';
        
        if (cellTag === 'th') {
          tableHtml += '<thead class="bg-slate-850 border-b border-slate-800 text-left"><tr class="text-teal-400">';
        } else {
          tableHtml += '<tr class="border-b border-slate-850/60 hover:bg-slate-850/20">';
        }

        cells.forEach(cell => {
          tableHtml += `<${cellTag} class="px-2 py-1.5">${cell.trim()}</${cellTag}>`;
        });

        if (cellTag === 'th') {
          tableHtml += '</tr></thead><tbody>';
        } else {
          tableHtml += '</tr>';
        }
      } else {
        if (inTable) {
          inTable = false;
          tableHtml += '</tbody></table></div>';
          lines[i] = tableHtml + lines[i];
          tableHtml = '';
        }
      }
    }

    if (inTable) {
      tableHtml += '</tbody></table></div>';
      html = lines.join('\n') + tableHtml;
    } else {
      html = lines.join('\n');
    }

    return html;
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans">
      {/* Trigger button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white flex items-center justify-center shadow-xl shadow-teal-500/20 hover:scale-105 transition-all duration-300 ring-4 ring-teal-500/10 group animate-bounce"
        >
          <FiMessageCircle size={26} className="group-hover:rotate-12 transition-transform duration-300" />
        </button>
      )}

      {/* Expanded panel */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[480px] bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-teal-900/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <div>
                <h3 className="font-bold text-sm text-slate-100">AI Inventory Assistant</h3>
                <p className="text-[10px] text-teal-400 font-semibold tracking-wide uppercase">Connected to Database</p>
              </div>
            </div>
            <div className="flex items-center space-x-1.5">
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <FiMinus size={16} />
              </button>
              <button 
                onClick={() => {
                  setChatHistory([
                    {
                      sender: 'bot',
                      text: "Hello! I am your **MediStock AI Assistant**. Ask me about:\n\n- 📊 *\"Dashboard summary\"*\n- ⚠️ *\"Show low stock alerts\"*\n- 📅 *\"Show expiring batches\"*\n- 🔍 *\"Search Paracetamol\"*\n- 🏢 *\"Who supplies Paracetamol?\"*",
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  ]);
                  setIsOpen(false);
                }}
                className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.map((chat, index) => (
              <div 
                key={index} 
                className={`flex flex-col ${chat.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    chat.sender === 'user' 
                      ? 'bg-teal-600 text-white rounded-tr-none' 
                      : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-750'
                  }`}
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(chat.text) }}
                />
                <span className="text-[9px] text-slate-500 mt-1 px-1">{chat.time}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 bg-slate-800 border border-slate-750 text-slate-300 rounded-2xl rounded-tl-none px-4 py-3.5 max-w-[50%]">
                <div className="h-1.5 w-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-1.5 w-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="h-1.5 w-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-950 flex items-center space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about stock, expiry, revenue..."
              className="flex-1 bg-slate-900 border border-slate-850 hover:border-slate-800 focus:border-teal-500 text-xs rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
            />
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:bg-slate-850 text-white disabled:text-slate-600 flex items-center justify-center transition-all duration-200"
            >
              <FiSend size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
