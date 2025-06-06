import React, { useState, useContext, createContext, useEffect } from 'react';
import './App.css';

// Theme Context for dark/light mode
const ThemeContext = createContext();

// PUBLIC_INTERFACE
function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <div className="app" style={{ background: 'var(--primary)', minHeight: '100vh' }}>
        <SecureChatMainContainer />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;

// PUBLIC_INTERFACE
function SecureChatMainContainer() {
  // Navigation screens: 'chats', 'status', 'calls', 'settings', 'starred', 'contacts', 'devices', 'profile-edit'
  const [screen, setScreen] = useState('chats');
  const [activeChat, setActiveChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Enhanced states for new features
  const [chats, setChats] = useState(sampleChats());
  const [contacts, setContacts] = useState(sampleContacts());
  const [statusUpdates] = useState(sampleStatus());
  const [callHistory] = useState(sampleCalls());
  const [starredMessages, setStarredMessages] = useState([]);
  const [user, setUser] = useState({ 
    id: 1, 
    name: "Alex Rivera", 
    avatar: "https://i.pravatar.cc/300?img=5",
    phone: "+1 555 0123",
    status: "Available"
  });

  // Handler functions
  const handleSelectChat = (chatId) => setActiveChat(chatId);
  const handleBackToChats = () => setActiveChat(null);
  const handleStarMessage = (messageId, chatId) => {
    const chat = chats.find(c => c.id === chatId);
    const message = chat?.messages?.find(m => m.id === messageId);
    if (message) {
      setStarredMessages(prev => 
        prev.some(m => m.id === messageId) 
          ? prev.filter(m => m.id !== messageId)
          : [...prev, { ...message, chatId, chatName: chat.name }]
      );
    }
  };

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="sc-mainbox">
      <SCHeader 
        user={user} 
        screen={screen} 
        activeChat={activeChat} 
        onBack={handleBackToChats}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showSearch={showSearch}
        setShowSearch={setShowSearch}
        setScreen={setScreen}
      />

      <div className="sc-content">
        {/* Main screen routing */}
        {screen === 'chats' && !activeChat && (
          <ChatListScreen
            chats={filteredChats}
            onSelectChat={handleSelectChat}
            user={user}
            searchQuery={searchQuery}
          />
        )}

        {screen === 'chats' && activeChat && (
          <ChatRoomScreen
            chat={chats.find(c => c.id === activeChat)}
            user={user}
            onBack={handleBackToChats}
            onStarMessage={handleStarMessage}
            starredMessages={starredMessages}
          />
        )}

        {screen === 'status' && (
          <StatusScreen statusUpdates={statusUpdates} user={user} />
        )}

        {screen === 'calls' && (
          <CallsScreen callHistory={callHistory} />
        )}

        {screen === 'settings' && (
          <SettingsScreen 
            user={user} 
            contacts={contacts} 
            setScreen={setScreen}
          />
        )}

        {screen === 'starred' && (
          <StarredMessagesScreen 
            starredMessages={starredMessages}
            onBack={() => setScreen('chats')}
          />
        )}

        {screen === 'contacts' && (
          <ContactsScreen 
            contacts={contacts}
            onBack={() => setScreen('settings')}
          />
        )}

        {screen === 'devices' && (
          <DevicesScreen onBack={() => setScreen('settings')} />
        )}

        {screen === 'profile-edit' && (
          <ProfileEditScreen 
            user={user}
            setUser={setUser}
            onBack={() => setScreen('settings')}
          />
        )}

        <FloatingActionButton
          screen={screen}
          onClick={() => {
            if (screen === 'chats') {
              alert("Start a new chat");
            } else if (screen === 'calls') {
              alert("Start a new call");
            } else if (screen === 'status') {
              alert("Add new status");
            }
          }}
        />
      </div>

      <SCBottomNav screen={screen} setScreen={setScreen} activeChat={activeChat} />
    </div>
  );
}

// Enhanced Header Component
function SCHeader({ user, screen, activeChat, onBack, searchQuery, setSearchQuery, showSearch, setShowSearch, setScreen }) {
  const { isDarkMode } = useContext(ThemeContext);

  if (activeChat !== null) {
    return (
      <header className="sc-header">
        <button className="sc-icon-btn" onClick={onBack} aria-label="Back">
          ←
        </button>
        <img src={sampleChatAvatar(activeChat)} alt="Chat" className="sc-avatar" />
        <div className="sc-header-info">
          <span className="sc-chat-name">{sampleChatName(activeChat)}</span>
          <span className="sc-chat-status">online</span>
        </div>
        <div className="sc-header-actions">
          <button className="sc-icon-btn" onClick={() => alert('Voice call')} title="Voice call">
            📞
          </button>
          <button className="sc-icon-btn" onClick={() => alert('Video call')} title="Video call">
            🎥
          </button>
          <button className="sc-icon-btn" onClick={() => alert('More options')} title="More">
            ⋮
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="sc-header">
      {showSearch ? (
        <div className="sc-search-bar">
          <button className="sc-icon-btn" onClick={() => setShowSearch(false)}>
            ←
          </button>
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sc-search-input"
            autoFocus
          />
        </div>
      ) : (
        <>
          <span className="sc-app-title">
            <span className="sc-brand">SecureChat</span> Connect
          </span>
          <div className="sc-header-actions">
            {screen === 'chats' && (
              <button className="sc-icon-btn" onClick={() => setShowSearch(true)} title="Search">
                🔍
              </button>
            )}
            {screen === 'chats' && (
              <button className="sc-icon-btn" onClick={() => setScreen('starred')} title="Starred messages">
                ⭐
              </button>
            )}
            <button className="sc-icon-btn" onClick={() => alert('More options')} title="More">
              ⋮
            </button>
          </div>
        </>
      )}
    </header>
  );
}

// Enhanced Bottom Navigation
function SCBottomNav({ screen, setScreen, activeChat }) {
  if (activeChat !== null) return null;
  
  return (
    <nav className="sc-bottom-nav">
      <NavTab icon="💬" label="Chats" active={screen==='chats'} onClick={() => setScreen('chats')}/>
      <NavTab icon="📢" label="Status" active={screen==='status'} onClick={() => setScreen('status')}/>
      <NavTab icon="📞" label="Calls" active={screen==='calls'} onClick={() => setScreen('calls')}/>
      <NavTab icon="⚙️" label="Settings" active={screen==='settings'} onClick={() => setScreen('settings')}/>
    </nav>
  );
}

function NavTab({ icon, label, active, onClick }) {
  return (
    <div className={`sc-navtab ${active ? 'active' : ''}`} onClick={onClick}>
      <span className="sc-nav-icon">{icon}</span>
      <span className="sc-nav-label">{label}</span>
    </div>
  );
}

// Enhanced Chat List Screen
function ChatListScreen({ chats, onSelectChat, user, searchQuery }) {
  return (
    <div className="sc-chat-list-screen">
      {chats.length === 0 ? (
        <div className="sc-empty-state">
          <div className="sc-empty-icon">💬</div>
          <div className="sc-empty-title">
            {searchQuery ? 'No chats found' : 'No chats yet'}
          </div>
          <div className="sc-empty-subtitle">
            {searchQuery ? 'Try a different search term' : 'Start a new chat to begin messaging'}
          </div>
        </div>
      ) : (
        chats.map(chat => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            onClick={() => onSelectChat(chat.id)}
          />
        ))
      )}
    </div>
  );
}

function ChatListItem({ chat, onClick }) {
  return (
    <div className="sc-chat-item" onClick={onClick}>
      <div className="sc-chat-avatar-container">
        <img 
          src={chat.group ? groupAvatar(chat) : chat.avatar} 
          alt="" 
          className="sc-avatar"
        />
        {!chat.group && <div className="sc-online-indicator"></div>}
      </div>
      <div className="sc-chat-content">
        <div className="sc-chat-header">
          <span className="sc-chat-name">{chat.name}</span>
          <span className="sc-chat-time">{chat.lastTime}</span>
        </div>
        <div className="sc-chat-preview">
          <span className="sc-last-message">{chat.lastMessage}</span>
          {chat.unread > 0 && (
            <span className="sc-unread-badge">{chat.unread}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// Enhanced Chat Room Screen
function ChatRoomScreen({ chat, user, onBack, onStarMessage, starredMessages }) {
  const [messages, setMessages] = useState(chat.messages || []);
  const [input, setInput] = useState('');
  const [attached, setAttached] = useState(null);
  const [showReactions, setShowReactions] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleSend = () => {
    if (!input.trim() && !attached) return;
    
    const newMessage = {
      id: Math.random().toString(36).substr(2,8),
      from: user.id,
      text: input,
      time: formatShortTime(new Date()),
      attachment: attached,
      encrypted: true,
      reactions: {}
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setAttached(null);
  };

  const handleReaction = (messageId, emoji) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...msg.reactions };
        if (reactions[emoji]) {
          reactions[emoji] = reactions[emoji].filter(id => id !== user.id);
          if (reactions[emoji].length === 0) delete reactions[emoji];
        } else {
          reactions[emoji] = [user.id];
        }
        return { ...msg, reactions };
      }
      return msg;
    }));
    setShowReactions(null);
  };

  const handleAttach = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttached({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type
      });
    }
  };

  return (
    <div className="sc-chat-room">
      <div className="sc-room-messages">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.from === user.id}
            onStar={() => onStarMessage(msg.id, chat.id)}
            isStarred={starredMessages.some(m => m.id === msg.id)}
            onReact={(emoji) => handleReaction(msg.id, emoji)}
            showReactionPicker={showReactions === msg.id}
            onToggleReactions={() => setShowReactions(showReactions === msg.id ? null : msg.id)}
          />
        ))}
      </div>

      <MessageInput
        input={input}
        setInput={setInput}
        attached={attached}
        setAttached={setAttached}
        onSend={handleSend}
        onAttach={handleAttach}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
      />
    </div>
  );
}

// Message Bubble Component
function MessageBubble({ message, isOwn, onStar, isStarred, onReact, showReactionPicker, onToggleReactions }) {
  return (
    <div className={`sc-message ${isOwn ? 'own' : 'other'}`}>
      <div className="sc-message-bubble">
        {message.encrypted && (
          <span className="sc-encryption-icon" title="Encrypted">🔒</span>
        )}
        
        {message.attachment && (
          <div className="sc-message-attachment">
            {message.attachment.type.startsWith("image/") ? (
              <img src={message.attachment.url} alt="attachment" className="sc-attachment-image" />
            ) : message.attachment.type.startsWith("audio/") ? (
              <VoiceNotePlayer audioUrl={message.attachment.url} />
            ) : (
              <span className="sc-attachment-file">[{message.attachment.name}]</span>
            )}
          </div>
        )}
        
        {message.text && <div className="sc-message-text">{message.text}</div>}
        
        <div className="sc-message-footer">
          <span className="sc-message-time">{message.time}</span>
          {isOwn && <span className="sc-message-status">✓✓</span>}
        </div>

        {Object.keys(message.reactions || {}).length > 0 && (
          <div className="sc-message-reactions">
            {Object.entries(message.reactions).map(([emoji, users]) => (
              <span key={emoji} className="sc-reaction">
                {emoji} {users.length}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="sc-message-actions">
        <button className="sc-action-btn" onClick={onStar} title={isStarred ? "Unstar" : "Star"}>
          {isStarred ? '⭐' : '☆'}
        </button>
        <button className="sc-action-btn" onClick={onToggleReactions} title="React">
          😊
        </button>
      </div>

      {showReactionPicker && (
        <ReactionPicker onSelect={onReact} />
      )}
    </div>
  );
}

// Reaction Picker Component
function ReactionPicker({ onSelect }) {
  const reactions = ['❤️', '😂', '😮', '😢', '😡', '👍', '👎'];
  
  return (
    <div className="sc-reaction-picker">
      {reactions.map(emoji => (
        <button
          key={emoji}
          className="sc-reaction-btn"
          onClick={() => onSelect(emoji)}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

// Voice Note Player Component
function VoiceNotePlayer({ audioUrl }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  return (
    <div className="sc-voice-note">
      <button 
        className="sc-voice-play-btn"
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? '⏸️' : '▶️'}
      </button>
      <div className="sc-voice-waveform">
        <WaveformDisplay isPlaying={isPlaying} progress={progress} />
      </div>
      <span className="sc-voice-duration">0:23</span>
    </div>
  );
}

// Waveform Display Component
function WaveformDisplay({ isPlaying, progress }) {
  const bars = Array.from({ length: 20 }, (_, i) => Math.random() * 0.8 + 0.2);
  
  return (
    <div className="sc-waveform">
      {bars.map((height, index) => (
        <div
          key={index}
          className={`sc-waveform-bar ${isPlaying && index <= progress * bars.length ? 'active' : ''}`}
          style={{ height: `${height * 100}%` }}
        />
      ))}
    </div>
  );
}

// Message Input Component
function MessageInput({ input, setInput, attached, setAttached, onSend, onAttach, isRecording, setIsRecording }) {
  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate voice recording
      setTimeout(() => {
        setIsRecording(false);
        setAttached({
          name: 'voice-note.m4a',
          url: '#',
          type: 'audio/m4a'
        });
      }, 2000);
    }
  };

  return (
    <div className="sc-room-input">
      <label className="sc-attach-btn">
        <input type="file" style={{display: 'none'}} accept="image/*,video/*" onChange={onAttach} />
        📎
      </label>

      {attached && (
        <div className="sc-attachment-preview">
          {attached.type.startsWith("image/") ? (
            <img src={attached.url} alt="preview" className="sc-attachment-thumbnail" />
          ) : (
            <span className="sc-attachment-name">{attached.name}</span>
          )}
          <button onClick={() => setAttached(null)} className="sc-remove-attachment">×</button>
        </div>
      )}

      <input
        className="sc-input"
        placeholder={isRecording ? "Recording..." : "Type a message"}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
        disabled={isRecording}
      />

      <button 
        className={`sc-voice-btn ${isRecording ? 'recording' : ''}`}
        onClick={handleVoiceRecord}
        title={isRecording ? "Stop recording" : "Record voice note"}
      >
        🎤
      </button>

      <button className="sc-send-btn" onClick={onSend} disabled={!input.trim() && !attached}>
        ➤
      </button>
    </div>
  );
}

// Starred Messages Screen
function StarredMessagesScreen({ starredMessages, onBack }) {
  return (
    <div className="sc-screen">
      <div className="sc-screen-header">
        <button className="sc-icon-btn" onClick={onBack}>←</button>
        <h2>Starred Messages</h2>
      </div>
      <div className="sc-screen-content">
        {starredMessages.length === 0 ? (
          <div className="sc-empty-state">
            <div className="sc-empty-icon">⭐</div>
            <div className="sc-empty-title">No starred messages</div>
            <div className="sc-empty-subtitle">Star messages to find them easily later</div>
          </div>
        ) : (
          starredMessages.map(msg => (
            <div key={msg.id} className="sc-starred-message">
              <div className="sc-starred-header">
                <span className="sc-starred-chat">{msg.chatName}</span>
                <span className="sc-starred-time">{msg.time}</span>
              </div>
              <div className="sc-starred-content">{msg.text}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Contacts Screen
function ContactsScreen({ contacts, onBack }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="sc-screen">
      <div className="sc-screen-header">
        <button className="sc-icon-btn" onClick={onBack}>←</button>
        <h2>Contacts</h2>
      </div>
      <div className="sc-search-container">
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="sc-search-input"
        />
      </div>
      <div className="sc-screen-content">
        {filteredContacts.map(contact => (
          <div key={contact.id} className="sc-contact-item">
            <img src={contact.avatar} alt="" className="sc-avatar" />
            <div className="sc-contact-info">
              <span className="sc-contact-name">{contact.name}</span>
              <span className="sc-contact-phone">{contact.phone}</span>
            </div>
            <button className="sc-contact-action">💬</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Devices Screen
function DevicesScreen({ onBack }) {
  const devices = [
    { id: 1, name: "iPhone 13", lastSeen: "Active now", type: "mobile" },
    { id: 2, name: "MacBook Pro", lastSeen: "2 hours ago", type: "desktop" },
    { id: 3, name: "iPad Air", lastSeen: "Yesterday", type: "tablet" }
  ];

  return (
    <div className="sc-screen">
      <div className="sc-screen-header">
        <button className="sc-icon-btn" onClick={onBack}>←</button>
        <h2>Linked Devices</h2>
      </div>
      <div className="sc-screen-content">
        <div className="sc-info-box">
          <div className="sc-info-title">Multi-device access</div>
          <div className="sc-info-text">
            Use SecureChat on multiple devices. Your messages sync securely across all devices.
          </div>
        </div>
        {devices.map(device => (
          <div key={device.id} className="sc-device-item">
            <div className="sc-device-icon">
              {device.type === 'mobile' ? '📱' : device.type === 'desktop' ? '💻' : '📱'}
            </div>
            <div className="sc-device-info">
              <span className="sc-device-name">{device.name}</span>
              <span className="sc-device-status">{device.lastSeen}</span>
            </div>
            <button className="sc-device-action">⋮</button>
          </div>
        ))}
        <button className="sc-btn sc-btn-outline">+ Link a device</button>
      </div>
    </div>
  );
}

// Profile Edit Screen
function ProfileEditScreen({ user, setUser, onBack }) {
  const [editedUser, setEditedUser] = useState({ ...user });
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="sc-screen">
      <div className="sc-screen-header">
        <button className="sc-icon-btn" onClick={onBack}>←</button>
        <h2>Profile</h2>
        <button 
          className="sc-header-action"
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>
      <div className="sc-screen-content">
        <div className="sc-profile-avatar-section">
          <div className="sc-profile-avatar-container">
            <img src={editedUser.avatar} alt="Profile" className="sc-profile-avatar" />
            {isEditing && (
              <button className="sc-avatar-edit-btn">📷</button>
            )}
          </div>
        </div>
        
        <div className="sc-profile-fields">
          <div className="sc-profile-field">
            <label className="sc-field-label">Name</label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.name}
                onChange={(e) => setEditedUser(prev => ({ ...prev, name: e.target.value }))}
                className="sc-field-input"
              />
            ) : (
              <span className="sc-field-value">{editedUser.name}</span>
            )}
          </div>
          
          <div className="sc-profile-field">
            <label className="sc-field-label">Status</label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.status}
                onChange={(e) => setEditedUser(prev => ({ ...prev, status: e.target.value }))}
                className="sc-field-input"
                placeholder="What's on your mind?"
              />
            ) : (
              <span className="sc-field-value">{editedUser.status}</span>
            )}
          </div>
          
          <div className="sc-profile-field">
            <label className="sc-field-label">Phone</label>
            <span className="sc-field-value">{editedUser.phone}</span>
            <span className="sc-field-note">Phone number cannot be changed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Settings Screen
function SettingsScreen({ user, contacts, setScreen }) {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);

  const settingsOptions = [
    { icon: '👤', title: 'Profile', subtitle: 'Name, status, photo', action: () => setScreen('profile-edit') },
    { icon: '👥', title: 'Contacts', subtitle: `${contacts.length} contacts`, action: () => setScreen('contacts') },
    { icon: '📱', title: 'Linked Devices', subtitle: 'Multi-device access', action: () => setScreen('devices') },
    { icon: '🔒', title: 'Privacy', subtitle: 'Security settings', action: () => alert('Privacy settings') },
    { icon: '📢', title: 'Notifications', subtitle: 'Messages, calls', action: () => alert('Notification settings') },
    { icon: '💾', title: 'Storage', subtitle: 'Manage chat storage', action: () => alert('Storage settings') },
    { icon: '❓', title: 'Help', subtitle: 'FAQ, contact support', action: () => alert('Help & Support') }
  ];

  return (
    <div className="sc-screen">
      <div className="sc-screen-content">
        <div className="sc-settings-profile" onClick={() => setScreen('profile-edit')}>
          <img src={user.avatar} alt="Profile" className="sc-settings-avatar" />
          <div className="sc-settings-user-info">
            <span className="sc-settings-name">{user.name}</span>
            <span className="sc-settings-status">{user.status}</span>
          </div>
        </div>

        <div className="sc-settings-group">
          <div className="sc-setting-item">
            <div className="sc-setting-icon">🌙</div>
            <div className="sc-setting-content">
              <span className="sc-setting-title">Dark Mode</span>
              <span className="sc-setting-subtitle">Switch to dark theme</span>
            </div>
            <label className="sc-toggle">
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={(e) => setIsDarkMode(e.target.checked)}
              />
              <span className="sc-toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="sc-settings-group">
          {settingsOptions.map((option, index) => (
            <div key={index} className="sc-setting-item" onClick={option.action}>
              <div className="sc-setting-icon">{option.icon}</div>
              <div className="sc-setting-content">
                <span className="sc-setting-title">{option.title}</span>
                <span className="sc-setting-subtitle">{option.subtitle}</span>
              </div>
              <span className="sc-setting-arrow">›</span>
            </div>
          ))}
        </div>

        <div className="sc-settings-group">
          <div className="sc-setting-item danger" onClick={() => alert('Sign out confirmation')}>
            <div className="sc-setting-icon">🚪</div>
            <div className="sc-setting-content">
              <span className="sc-setting-title">Sign Out</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Status Screen
function StatusScreen({ statusUpdates, user }) {
  return (
    <div className="sc-screen">
      <div className="sc-screen-content">
        <div className="sc-status-section">
          <h3 className="sc-section-title">My Status</h3>
          <div className="sc-status-item add-status">
            <div className="sc-status-avatar-container">
              <img src={user.avatar} alt="My Status" className="sc-avatar" />
              <div className="sc-add-status-icon">+</div>
            </div>
            <div className="sc-status-info">
              <span className="sc-status-name">My Status</span>
              <span className="sc-status-subtitle">Tap to add status update</span>
            </div>
          </div>
        </div>

        {statusUpdates.length > 0 && (
          <div className="sc-status-section">
            <h3 className="sc-section-title">Recent Updates</h3>
            {statusUpdates.map(status => (
              <div key={status.id} className="sc-status-item">
                <div className="sc-status-avatar-container">
                  <img src={status.avatar} alt={status.name} className="sc-avatar" />
                  <div className="sc-status-ring"></div>
                </div>
                <div className="sc-status-info">
                  <span className="sc-status-name">{status.name}</span>
                  <span className="sc-status-time">{status.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Enhanced Calls Screen
function CallsScreen({ callHistory }) {
  return (
    <div className="sc-screen">
      <div className="sc-screen-content">
        {callHistory.length === 0 ? (
          <div className="sc-empty-state">
            <div className="sc-empty-icon">📞</div>
            <div className="sc-empty-title">No calls yet</div>
            <div className="sc-empty-subtitle">Make your first call to get started</div>
          </div>
        ) : (
          callHistory.map(call => (
            <div key={call.id} className="sc-call-item">
              <img src={call.avatar} alt={call.name} className="sc-avatar" />
              <div className="sc-call-info">
                <span className="sc-call-name">{call.name}</span>
                <div className="sc-call-details">
                  <span className="sc-call-type">{call.type}</span>
                  <span className="sc-call-time">{call.time}</span>
                </div>
              </div>
              <button className="sc-call-action" title={`Call ${call.name}`}>
                {call.type === 'Video' ? '🎥' : '📞'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Floating Action Button
function FloatingActionButton({ screen, onClick }) {
  const getIcon = () => {
    switch(screen) {
      case 'chats': return '✚';
      case 'status': return '📷';
      case 'calls': return '📞';
      default: return null;
    }
  };

  const icon = getIcon();
  if (!icon) return null;

  return (
    <button className="sc-fab" onClick={onClick} aria-label="New">
      {icon}
    </button>
  );
}

/** Enhanced Sample Data Helpers */
function sampleChats() {
  return [
    {
      id: 1,
      name: "Alice Johnson",
      avatar: "https://i.pravatar.cc/100?img=1",
      lastMessage: "Hey! How's your day going? 😊",
      lastTime: "09:11",
      unread: 2,
      group: false,
      messages: [
        { id: "m1", from: 2, text: "Hey! How's your day going? 😊", time: "09:11", reactions: { "❤️": [1] } },
        { id: "m2", from: 1, text: "Pretty good! Just finished a meeting. How about you?", time: "09:12", reactions: {} },
        { id: "m3", from: 2, text: "Same here! Want to grab coffee later?", time: "09:15", reactions: {} }
      ]
    },
    {
      id: 2,
      name: "Dev Team",
      avatar: "",
      lastMessage: "Sprint meeting in 10 minutes! 🚀",
      lastTime: "08:45",
      unread: 0,
      group: true,
      messages: [
        { id: "g1", from: 3, text: "Sprint meeting in 10 minutes! 🚀", time: "08:45", reactions: { "👍": [1, 2] } },
        { id: "g2", from: 2, text: "I'll be there!", time: "08:46", reactions: {} },
        { id: "g3", from: 4, text: "Same here 👍", time: "08:47", reactions: {} }
      ]
    },
    {
      id: 3,
      name: "Carol Smith",
      avatar: "https://i.pravatar.cc/100?img=3",
      lastMessage: "Check out this photo!",
      lastTime: "Yesterday",
      unread: 1,
      group: false,
      messages: [
        { 
          id: "x1", 
          from: 3, 
          text: "Check out this photo!", 
          time: "Yesterday", 
          attachment: { 
            type: "image/png", 
            name: "sunset.png", 
            url: "https://picsum.photos/300/200?random=1" 
          },
          reactions: { "😮": [1], "❤️": [1] }
        }
      ]
    },
    {
      id: 4,
      name: "Mom",
      avatar: "https://i.pravatar.cc/100?img=4",
      lastMessage: "Don't forget dinner tonight!",
      lastTime: "2 hours ago",
      unread: 0,
      group: false,
      messages: [
        { id: "m4", from: 4, text: "Don't forget dinner tonight!", time: "2 hours ago", reactions: {} },
        { id: "m5", from: 1, text: "I'll be there! What time?", time: "1 hour ago", reactions: {} }
      ]
    }
  ];
}

function sampleContacts() {
  return [
    { id: 1, name: "Alice Johnson", phone: "+1 555 0101", avatar: "https://i.pravatar.cc/100?img=1" },
    { id: 2, name: "Bob Wilson", phone: "+1 555 0102", avatar: "https://i.pravatar.cc/100?img=2" },
    { id: 3, name: "Carol Smith", phone: "+1 555 0103", avatar: "https://i.pravatar.cc/100?img=3" },
    { id: 4, name: "David Brown", phone: "+1 555 0104", avatar: "https://i.pravatar.cc/100?img=6" },
    { id: 5, name: "Emma Davis", phone: "+1 555 0105", avatar: "https://i.pravatar.cc/100?img=8" }
  ];
}

function sampleStatus() {
  return [
    { id: "s1", avatar: "https://i.pravatar.cc/100?img=1", name: "Alice Johnson", time: "Today, 08:45" },
    { id: "s2", avatar: "https://i.pravatar.cc/100?img=2", name: "Bob Wilson", time: "Yesterday, 21:19" },
    { id: "s3", avatar: "https://i.pravatar.cc/100?img=3", name: "Carol Smith", time: "Yesterday, 18:30" }
  ];
}

function sampleCalls() {
  return [
    { id: 'c1', avatar: "https://i.pravatar.cc/100?img=1", name: "Alice Johnson", type: "Voice", time: "Today, 09:22" },
    { id: 'c2', avatar: "https://i.pravatar.cc/100?img=3", name: "Carol Smith", type: "Video", time: "Yesterday, 17:05" },
    { id: 'c3', avatar: "https://i.pravatar.cc/100?img=2", name: "Bob Wilson", type: "Voice", time: "2 days ago, 14:30" }
  ];
}

function sampleChatAvatar(id) {
  const avatars = {
    1: "https://i.pravatar.cc/100?img=1",
    2: "https://cdn-icons-png.flaticon.com/512/9131/9131529.png",
    3: "https://i.pravatar.cc/100?img=3",
    4: "https://i.pravatar.cc/100?img=4"
  };
  return avatars[id] || "https://i.pravatar.cc/100?img=7";
}

function groupAvatar(chat) {
  return "https://cdn-icons-png.flaticon.com/512/9131/9131529.png";
}

function sampleChatName(id) {
  const names = {
    1: "Alice Johnson",
    2: "Dev Team",
    3: "Carol Smith",
    4: "Mom"
  };
  return names[id] || "SecureChat";
}

function formatShortTime(dateOrStr) {
  if (typeof dateOrStr === "string") return dateOrStr;
  return dateOrStr.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
