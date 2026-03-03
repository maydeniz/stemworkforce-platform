// ===========================================
// Messaging Tab
// HIPAA-compliant secure messaging with schools
// ===========================================

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  X,
  User,
  Building2,
  Loader2,
  Check,
  CheckCheck,
  Shield,
  Lock,
  Plus,
  ChevronLeft
} from 'lucide-react';
import { healthcareProviderApi } from '@/services/healthcareProviderApi';
import type { MessageThread } from '@/types/healthcareProvider';

interface MessagingTabProps {
  providerId: string;
}

const MessagingTab: React.FC<MessagingTabProps> = ({ providerId }) => {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadThreads();
  }, [providerId]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedThread?.messages]);

  const loadThreads = async () => {
    setLoading(true);
    try {
      const data = await healthcareProviderApi.getMessageThreads(providerId);
      setThreads(data);
      // Auto-select first thread if exists
      if (data.length > 0 && !selectedThread) {
        setSelectedThread(data[0]);
      }
    } catch (error) {
      console.error('Error loading threads:', error);
    }
    setLoading(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredThreads = threads.filter(thread =>
    (thread.participantName || thread.participants?.[0]?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (thread.studentName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedThread) return;

    setSending(true);
    try {
      await healthcareProviderApi.sendMessage({
        threadId: selectedThread.id,
        senderId: providerId,
        senderName: 'Provider',
        senderRole: 'provider',
        recipientId: selectedThread.participantId || selectedThread.participants?.[0]?.id || '',
        content: newMessage.trim(),
        isHIPAAProtected: true
      });
      setNewMessage('');
      await loadThreads();
      // Re-select the thread to get updated messages
      const updatedThread = threads.find(t => t.id === selectedThread.id);
      if (updatedThread) setSelectedThread(updatedThread);
    } catch (error) {
      console.error('Error sending message:', error);
    }
    setSending(false);
  };

  const getRelativeTime = (date: string) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffMs = now.getTime() - messageDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return messageDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            Secure Messages
          </h2>
          <p className="text-gray-400">HIPAA-compliant communication with school nurses</p>
        </div>
        <button
          onClick={() => setShowNewMessage(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Message
        </button>
      </div>

      {/* Encryption Notice */}
      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-3">
        <Lock className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <p className="text-sm text-emerald-400">
          All messages are end-to-end encrypted and HIPAA compliant. Messages are automatically logged for audit purposes.
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="flex h-[600px]">
          {/* Thread List */}
          <div className={`w-full md:w-80 border-r border-gray-800 flex flex-col ${
            selectedThread ? 'hidden md:flex' : 'flex'
          }`}>
            <div className="p-4 border-b border-gray-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredThreads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => setSelectedThread(thread)}
                  className={`w-full p-4 text-left border-b border-gray-800/50 transition-colors ${
                    selectedThread?.id === thread.id
                      ? 'bg-indigo-500/10 border-l-2 border-l-indigo-500'
                      : 'hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-white truncate">{thread.participantName || thread.participants?.[0]?.name || 'Unknown'}</p>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {thread.lastMessageAt ? getRelativeTime(thread.lastMessageAt) : ''}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">Re: {thread.studentName || 'General'}</p>
                      {thread.messages && thread.messages.length > 0 && (
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {thread.messages[thread.messages.length - 1].content || thread.messages[thread.messages.length - 1].body}
                        </p>
                      )}
                    </div>
                    {typeof thread.unreadCount === 'number' && thread.unreadCount > 0 && (
                      <span className="w-5 h-5 bg-indigo-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              ))}
              {filteredThreads.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <p>No conversations found</p>
                </div>
              )}
            </div>
          </div>

          {/* Message View */}
          <div className={`flex-1 flex flex-col ${
            selectedThread ? 'flex' : 'hidden md:flex'
          }`}>
            {selectedThread ? (
              <>
                {/* Thread Header */}
                <div className="p-4 border-b border-gray-800 flex items-center gap-3">
                  <button
                    onClick={() => setSelectedThread(null)}
                    className="md:hidden p-1 text-gray-400 hover:text-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{selectedThread.participantName || selectedThread.participants?.[0]?.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {selectedThread.schoolName || selectedThread.participants?.[0]?.organization || 'School'} • Re: {selectedThread.studentName || 'General'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
                    <Lock className="w-3 h-3" />
                    Encrypted
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedThread.messages?.map((message) => {
                    const isOwn = message.senderId === providerId;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                          <div
                            className={`p-3 rounded-xl ${
                              isOwn
                                ? 'bg-indigo-600 text-white rounded-br-none'
                                : 'bg-gray-800 text-gray-100 rounded-bl-none'
                            }`}
                          >
                            {message.subject && (
                              <p className="text-sm font-medium mb-1 opacity-80">{message.subject}</p>
                            )}
                            <p className="text-sm">{message.content || message.body}</p>
                          </div>
                          <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                            isOwn ? 'justify-end' : 'justify-start'
                          }`}>
                            <span>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {isOwn && (
                              (message.isRead || message.read)
                                ? <CheckCheck className="w-3 h-3 text-indigo-400" />
                                : <Check className="w-3 h-3" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-800">
                  <div className="flex items-end gap-3">
                    <div className="flex-1 relative">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type your message..."
                        rows={1}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
                        style={{ minHeight: '48px', maxHeight: '120px' }}
                      />
                    </div>
                    <button
                      className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
                      title="Attach file"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sending}
                      className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors disabled:opacity-50"
                    >
                      {sending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    This message will be encrypted and logged for HIPAA compliance
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-lg">Select a conversation</p>
                  <p className="text-sm mt-1">Choose a thread from the list to view messages</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Message Modal */}
      <AnimatePresence>
        {showNewMessage && (
          <NewMessageModal
            providerId={providerId}
            onClose={() => setShowNewMessage(false)}
            onSent={() => {
              setShowNewMessage(false);
              loadThreads();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ===========================================
// NEW MESSAGE MODAL
// ===========================================

interface NewMessageModalProps {
  providerId: string;
  onClose: () => void;
  onSent: () => void;
}

const NewMessageModal: React.FC<NewMessageModalProps> = ({ providerId, onClose, onSent }) => {
  const [recipient, setRecipient] = useState('');
  const [_school, _setSchool] = useState(''); // School context for future use
  const [student, setStudent] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Suppress unused variable warnings
  void _school;
  void _setSchool;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !message.trim()) return;

    setSending(true);
    try {
      // In a real app, this would create a new thread and send the message
      await healthcareProviderApi.sendMessage({
        senderId: providerId,
        senderName: 'Provider',
        senderRole: 'provider',
        recipientId: recipient,
        subject,
        content: message.trim(),
        isHIPAAProtected: true
      });
      onSent();
    } catch (error) {
      console.error('Error sending message:', error);
    }
    setSending(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-lg"
      >
        <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">New Secure Message</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSend} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Recipient *</label>
            <select
              required
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">Select school nurse...</option>
              <option value="nurse-1">Sarah Johnson - Lincoln Elementary</option>
              <option value="nurse-2">Michael Chen - Washington Middle School</option>
              <option value="nurse-3">Emily Davis - Roosevelt High School</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Regarding Student</label>
            <input
              type="text"
              value={student}
              onChange={(e) => setStudent(e.target.value)}
              placeholder="Enter student name (optional)"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Message subject"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Message *</label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Type your message..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-start gap-2">
            <Lock className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-emerald-400">
              This message will be encrypted end-to-end and logged for HIPAA compliance. Only the recipient will be able to read it.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending || !recipient || !message.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default MessagingTab;
