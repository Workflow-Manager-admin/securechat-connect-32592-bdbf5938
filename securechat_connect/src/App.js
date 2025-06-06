import React, { useState } from 'react';
import './App.css';

// PUBLIC_INTERFACE
function App() {
  return (
    <div className="app" style={{ background: 'var(--primary, #075E54)', minHeight: '100vh' }}>
      <SecureChatMainContainer />
    </div>
  );
}

export default App;

// PUBLIC_INTERFACE
function SecureChatMainContainer() {
  // Navigation screens: 'chats', 'status', 'calls', 'settings'
  const [screen, setScreen] = useState('chats');
  const [activeChat, setActiveChat] = useState(null); // null = show chat list, otherwise show chat window

  // Simulated states for demonstration (fake data)
  const [chats, setChats] = useState(sampleChats());
  const [contacts, setContacts] = useState(sampleContacts());
  const [statusUpdates] = useState(sampleStatus());
  const [callHistory] = useState(sampleCalls());
  const [user, ] = useState({ id: 1, name: "Me", avatar: "https://i.pravatar.cc/300?img=5" });

  // Simulate switching chat window
  const handleSelectChat = (chatId) => {
    setActiveChat(chatId);
  };

  // Handler for going back to chat list
  const handleBackToChats = () => {
    setActiveChat(null);
  };

  // Main layout wrapper
  return (
    <div className="sc-mainbox" style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: 'var(--sc-bg, #ece5dd)'
    }}>
      <SCHeader user={user} screen={screen} activeChat={activeChat} onBack={handleBackToChats} />

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        overflow: 'hidden', position: 'relative'
      }}>
        {/* Conditionally render the correct main content */}
        {screen === 'chats' && (
          activeChat === null ? (
            <ChatListScreen
              chats={chats}
              onSelectChat={handleSelectChat}
              user={user}
            />
          ) : (
            <ChatRoomScreen
              chat={chats.find(c => c.id === activeChat)}
              user={user}
              onBack={handleBackToChats}
            />
          )
        )}

        {screen === 'status' && (
          <StatusScreen statusUpdates={statusUpdates} user={user} />
        )}

        {screen === 'calls' && (
          <CallsScreen callHistory={callHistory} />
        )}

        {screen === 'settings' && (
          <SettingsScreen user={user} contacts={contacts} />
        )}

        <FloatingActionButton
          screen={screen}
          onClick={() => {
            if (screen === 'chats') {
              alert("Start a new chat (UI placeholder)");
            }
            if (screen === 'calls') {
              alert("Start a new call (UI placeholder)");
            }
            if (screen === 'status') {
              alert("Add new status (UI placeholder)");
            }
          }}
        />
      </div>

      <SCBottomNav screen={screen} setScreen={setScreen} activeChat={activeChat} />
    </div>
  );
}

// -- Header with App Title and optional Back button & Chat Info --
function SCHeader({ user, screen, activeChat, onBack }) {
  // Display avatar and info for active chat, app name otherwise
  return (
    <header className="sc-header" style={{
      background: 'var(--primary, #075E54)', color: 'white',
      padding: '12px 18px', display: 'flex', alignItems: 'center',
      height: 62, minHeight: 62, position: 'sticky', top: 0, zIndex: 20
    }}>
      {activeChat !== null ? (
        <>
          <button className="sc-icon-btn" aria-label="Back" style={{ marginRight: 12 }} onClick={onBack}>
            <span style={{fontWeight:"bold",fontSize:22}}>&larr;</span>
          </button>
          <img src={sampleChatAvatar(activeChat)} alt="Chat" className="sc-avatar" />
          <span style={{fontWeight: 500, marginLeft: 9}}>{sampleChatName(activeChat)}</span>
        </>
      ) : (
        <>
          <span style={{
            fontWeight: 600, fontSize: '1.2rem', letterSpacing: "0.01em"
          }}>
            <span style={{color: '#25D366', fontWeight: 700}}>SecureChat</span> Connect
          </span>
        </>
      )}
      {/* Placeholder for icons (search/settings etc.) */}
      <span style={{marginLeft:'auto',display:"flex",gap:8,alignItems:"center"}}>
        {/* Notification badge etc. */}
        <span style={{ fontSize: 18, cursor: 'pointer' }} title="Settings">&#9881;</span>
      </span>
    </header>
  );
}

// -- Bottom Navigation Bar --
function SCBottomNav({ screen, setScreen, activeChat }) {
  // Hide navbar on chat open (like WhatsApp)
  if (activeChat !== null) return null;
  return (
    <nav className="sc-bottom-nav" style={{
      position: 'fixed', bottom: 0, left: 0, width: '100%', background: 'white',
      boxShadow: '0 -2px 12px #0001', display: 'flex', justifyContent: 'space-around',
      borderTop: '1px solid #d3d3d3', height: 55, zIndex: 40
    }}>
      <NavTab icon="💬" label="Chats" active={screen==='chats'} onClick={() => setScreen('chats')}/>
      <NavTab icon="� status" label="Status" active={screen==='status'} onClick={() => setScreen('status')}/>
      <NavTab icon="📞" label="Calls" active={screen==='calls'} onClick={() => setScreen('calls')}/>
      <NavTab icon="⚙️" label="Settings" active={screen==='settings'} onClick={() => setScreen('settings')}/>
    </nav>
  );
}
function NavTab({ icon, label, active, onClick }) {
  return (
    <div className="sc-navtab" style={{
      flex: 1, padding: 0, cursor: 'pointer', textAlign: 'center',
      color: active ? 'var(--primary, #075E54)' : '#888', fontWeight: active ? 600 : 400,
      fontSize: 12, display:'flex',flexDirection:"column", alignItems:'center',justifyContent:"center"
    }} onClick={onClick}>
      <span style={{ fontSize: 21 }}>
        {icon}
      </span>
      <span>{label}</span>
    </div>
  );
}

// -- Floating Action Button (FAB) --
function FloatingActionButton({screen, onClick}) {
  // Show FAB only on certain screens, adjust icon
  const icon = screen==='chats' ? "✚"
    : screen==='status' ? "⦙"
    : screen==='calls' ? "📞"
    : null;
  if (!icon) return null;
  return (
    <button
      onClick={onClick}
      className="sc-fab"
      style={{
        position: 'fixed', right: 22, bottom: 74,
        background: 'var(--secondary, #25D366)',
        color: 'white', borderRadius: '50%', border: 'none',
        width: 54, height: 54, fontSize: 28, fontWeight: 700,
        display:"flex",alignItems:"center",justifyContent:"center",
        boxShadow: '0 4px 16px #008b3922',
        zIndex: 50, cursor: "pointer"
      }}
      aria-label="New"
    >
      {icon}
    </button>
  );
}

// -- Chat List Screen --
function ChatListScreen({ chats, onSelectChat, user }) {
  return (
    <div className="sc-chat-list-screen" style={{
      position:'relative',top:0, left:0, right:0, bottom:0,
      width: '100%', maxWidth: 420, margin: 'auto', background:"white", height: "calc(100vh - 62px - 55px)", overflowY: "auto"
    }}>
      {chats.length === 0 &&
        <div className="sc-empty" style={{
          padding: 48, textAlign: "center", color: "#888", marginTop: 50
        }}>
          No chats yet. Start a new chat!
        </div>
      }
      {chats.map(chat => (
        <div
          className="sc-chat-item"
          key={chat.id}
          style={{
            display: "flex", alignItems: "center", gap: 14, padding: "14px 20px",
            borderBottom: "1px solid #eee", cursor: "pointer", background: "#fff"
          }}
          onClick={() => onSelectChat(chat.id)}
        >
          <img src={chat.group ? groupAvatar(chat) : chat.avatar} alt="" style={{
            width: 48, height: 48, borderRadius: "50%", objectFit: "cover"
          }}/>
          <div style={{flex:1}}>
            <div style={{
              fontWeight: chat.unread ? 600 : 500,
              fontSize: 16,
              color: "#222"
            }}>{chat.name}</div>
            <div style={{
              color: "#777", fontSize: 13,
              overflow: 'hidden', textOverflow: "ellipsis", whiteSpace: "nowrap"
            }}>{chat.lastMessage}</div>
          </div>
          <div style={{ minWidth: 64, textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#25D366", fontWeight: 500 }}>
              {chat.lastTime}
            </div>
            {chat.unread &&
              <div style={{
                background: "#25D366", color: "white",
                fontWeight: 700, fontSize: 10, display: "inline-block",
                padding: "3px 6px", borderRadius: 12, minWidth: 24, marginTop: 4
              }}>{chat.unread}</div>
            }
          </div>
        </div>
      ))}
    </div>
  );
}

// -- Chat Room Screen (active conversation) --
function ChatRoomScreen({ chat, user, onBack }) {
  const [messages, setMessages] = useState(chat.messages || []);
  const [input, setInput] = useState('');
  const [attached, setAttached] = useState(null); // For simulated media/file

  // Simulate sending message
  const handleSend = () => {
    if (!input && !attached) return;
    setMessages(arr => [
      ...arr,
      {
        id: Math.random().toString(36).substr(2,8),
        from: user.id,
        text: input,
        time: formatShortTime(new Date()),
        attachment: attached,
        encrypted: true // Always E2E (fake for demo)
      }
    ]);
    setInput('');
    setAttached(null);
  };

  // Simulate media upload
  const handleAttach = e => {
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
    <div className="sc-chat-room" style={{
      height: "calc(100vh - 62px - env(safe-area-inset-bottom))", background: "#ece5dd",
      display: "flex", flexDirection: "column"
    }}>
      <div className="sc-room-messages" style={{
        flex:1, overflowY:"auto", padding: "18px 8px 8px 8px",
        display: "flex", flexDirection: "column", gap: 10
      }}>
        {messages.map((msg, i) => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.from === user.id ? "flex-end" : "flex-start",
              maxWidth: "82%", display: "inline-block"
            }}
          >
            <div style={{
              background: msg.from === user.id ? "#dcf8c6" : "#fff",
              color: "#222", fontSize: 15, borderRadius: 15,
              padding: "8px 16px", boxShadow: "0 2px 6px #07ae5416", position:"relative"
            }}>
              {msg.encrypted &&
                <span title="Encrypted" style={{position:"absolute",left:6,top:4,fontSize:11,opacity:0.4}}>
                  🔒
                </span>
              }
              {msg.attachment && (
                <div style={{marginBottom:5}}>
                  {msg.attachment.type.startsWith("image/") ?
                    <img src={msg.attachment.url} alt="media" style={{
                      maxHeight: 120, maxWidth:"100%", borderRadius:6
                    }}/>
                    : <span>[{msg.attachment.name}]</span>
                  }
                </div>
              )}
              {msg.text}
              <div style={{
                fontSize: 10, color: "#777", marginTop: 4, textAlign: "right"
              }}>{msg.time}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Input bar */}
      <div className="sc-room-input" style={{
        display:"flex", gap: 7, padding: "10px 10px", background: "#f7f7f7",
        alignItems: "center", borderTop: '1px solid #eee'
      }}>
        <label style={{cursor:"pointer"}}>
          <input type="file" style={{display:"none"}}
            accept="image/*,video/*"
            onChange={handleAttach}
          />
          <span role="img" aria-label="Attach" style={{fontSize:22,color:"#25D366"}}>📎</span>
        </label>
        {/* Show attached file thumbnail if present */}
        {attached && (
          <span>
            {attached.type.startsWith("image/") ?
              <img src={attached.url} alt="" style={{width:24,height:24,objectFit:"cover",borderRadius:3,marginRight:4}}/>
              : <span style={{fontSize:14}}>{attached.name}</span>
            }
            <button onClick={()=>setAttached(null)} style={{
              marginLeft:4,border:"none",background:"none",color:"#888",fontWeight:600,cursor:"pointer"
            }}>×</button>
          </span>
        )}
        <input
          className="sc-input"
          style={{
            flex: 1, fontSize: 15, borderRadius: 16, border: "1px solid #ddd", outline:"none",
            padding: "7px 13px"
          }}
          placeholder="Type a message"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { handleSend(); }}}
        />
        <button
          className="btn"
          style={{
            background:"var(--secondary, #25D366)",color:"white",padding:"8px 18px",borderRadius:15,marginLeft:5
          }}
          onClick={handleSend}
        >Send</button>
      </div>
    </div>
  );
}

// -- Status Screen (stories) --
function StatusScreen({ statusUpdates, user }) {
  return (
    <div style={{
      paddingTop:22, background:"white", minHeight:"calc(100vh - 62px - 55px)",
      maxWidth:400, margin:"auto"
    }}>
      <h2 style={{fontSize:17,paddingLeft:16,marginBottom:8,color:"#128C7E"}}>Status Updates</h2>
      <div>
        <div style={{
          display:'flex',alignItems:'center',gap:12,padding:"10px 16px",
          borderBottom:"1px solid #eee",background:"#fff"
        }}>
          <img className="sc-avatar" src={user.avatar} alt="" style={{width:42,height:42}} />
          <span style={{fontWeight:"500"}}>My Status<span style={{color:"#888",fontWeight:400,fontSize:14,paddingLeft:10}}>Tap to add status</span></span>
        </div>
        {statusUpdates.map(s => (
          <div key={s.id} style={{
            display:'flex',alignItems:'center',gap:12,padding:"10px 16px",
            borderBottom:"1px solid #eee",background:"#fff"
          }}>
            <img className="sc-avatar" src={s.avatar} alt="" style={{width:42,height:42,objectFit:"cover",border:"2px solid #25D366"}} />
            <span style={{fontWeight:"500"}}>{s.name}</span>
            <span style={{marginLeft:"auto",fontSize:12,color:"#888"}}>{s.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// -- Calls Screen --
function CallsScreen({ callHistory }) {
  return (
    <div style={{
      paddingTop:18, background:"white", minHeight:"calc(100vh - 62px - 55px)",
      maxWidth:400, margin:"auto"
    }}>
      <h2 style={{fontSize:17,paddingLeft:16,marginBottom:8,color:"#128C7E"}}>Calls</h2>
      <div>
        {callHistory.length === 0 && <div style={{ color:"#888", padding: 34, textAlign:"center" }}>No calls yet.</div>}
        {callHistory.map(c => (
          <div key={c.id} style={{
            display:'flex',alignItems:'center',gap:12,padding:"10px 16px",background:"#fff",
            borderBottom:"1px solid #eee"
          }}>
            <img className="sc-avatar" src={c.avatar} alt="" style={{
              width:38,height:38,objectFit:"cover",borderRadius:"50%"
            }} />
            <span style={{fontWeight:"500"}}>{c.name}
              <span style={{fontWeight:400,color:"#888",fontSize:13}}> ({c.type})</span>
            </span>
            <span style={{
              marginLeft:"auto",fontSize:12,color:"#888"
            }}>{c.time}</span>
            <span style={{
              marginLeft: 14, fontSize: 20, color: c.type==='Video'?'#128C7E':'#25D366'
            }}>{c.type==='Video'?'🎥':'📞'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// -- Settings Screen --
function SettingsScreen({ user, contacts }) {
  return (
    <div style={{
      paddingTop:18, background:"white", minHeight:"calc(100vh - 62px - 55px)",
      maxWidth:400, margin:"auto"
    }}>
      <h2 style={{fontSize:17,paddingLeft:16,marginBottom:8,color:"#128C7E"}}>Settings</h2>
      <div style={{
        padding:"0 16px", display:'flex',alignItems:'center',gap:12,marginBottom:22
      }}>
        <img src={user.avatar} alt="" className="sc-avatar" style={{width:54,height:54}}/>
        <div>
          <div style={{fontWeight:600,fontSize:16}}>{user.name}</div>
          <div style={{color:"#25D366",fontWeight:500,fontSize:12}}>
            {user.phone || "Profile"}
          </div>
        </div>
      </div>
      <div style={{paddingLeft:16,paddingBottom:8,color:"#222"}}>Contacts: {contacts.length}</div>
      <div style={{
        border: "1px solid #eee", padding: 14, borderRadius: 6, margin: "0 16px 16px 16px"
      }}>
        <div style={{color:"#128C7E",fontWeight:600}}>End-to-end encryption</div>
        <div style={{fontSize:13,marginTop:4,color:"#888"}}>
          All chats and calls are encrypted. (Simulated)
        </div>
      </div>
      <button className="btn" style={{
        background: "#e54444", color:"white",marginLeft:16,marginTop:24
      }} onClick={()=>alert("Sign out placeholder")}>Sign Out</button>
    </div>
  );
}

/** ----- SAMPLE DATA HELPERS ----- */
function sampleChats() {
  return [
    {
      id: 1,
      name: "Alice",
      avatar: "https://i.pravatar.cc/100?img=1",
      lastMessage: "Hey, how are you?",
      lastTime: "09:11",
      unread: 2,
      group: false,
      messages: [
        { id: "m1", from: 2, text: "Hey, how are you?", time: "09:11" },
        { id: "m2", from: 1, text: "Doing well! You?", time: "09:12" },
      ]
    },
    {
      id: 2,
      name: "Bob & Group",
      avatar: "",
      lastMessage: "Group call in 10 minutes!",
      lastTime: "08:05",
      unread: 0,
      group: true,
      messages: [
        { id: "g1", from: 3, text: "Group call in 10 minutes!", time: "08:05" },
        { id: "g2", from: 2, text: "I'll join!", time: "08:08" },
      ]
    },
    {
      id: 3,
      name: "Carol",
      avatar: "https://i.pravatar.cc/100?img=3",
      lastMessage: "Sent a photo",
      lastTime: "Yesterday",
      unread: 1,
      group: false,
      messages: [
        { id: "x1", from: 3, text: "Sent a photo", time: "Yesterday", attachment: { type:"image/png",name:"photo.png",url:"https://placekitten.com/64/64" } }
      ]
    }
  ]
}
function sampleContacts() {
  return [
    { id: 1, name: "Alice", phone: "555-0101", avatar: "https://i.pravatar.cc/100?img=1" },
    { id: 2, name: "Bob", phone: "555-0102", avatar: "https://i.pravatar.cc/100?img=2" },
    { id: 3, name: "Carol", phone: "555-0103", avatar: "https://i.pravatar.cc/100?img=3" },
  ];
}
function sampleStatus() {
  return [
    { id: "s1", avatar: "https://i.pravatar.cc/100?img=1", name: "Alice", time:"Today, 08:45" },
    { id: "s2", avatar: "https://i.pravatar.cc/100?img=2", name: "Bob", time:"Yesterday, 21:19" },
  ]
}
function sampleCalls() {
  return [
    { id: 'c1', avatar: "https://i.pravatar.cc/100?img=1", name: "Alice", type:"Voice", time:"Today, 09:22" },
    { id: 'c2', avatar: "https://i.pravatar.cc/100?img=3", name: "Carol", type:"Video", time:"Yesterday, 17:05" },
  ]
}
function sampleChatAvatar(id) {
  if (id === 1) return "https://i.pravatar.cc/100?img=1";
  if (id === 2) return groupAvatar({name:"Bob & Group"});
  if (id === 3) return "https://i.pravatar.cc/100?img=3";
  return "https://i.pravatar.cc/100?img=7";
}
function groupAvatar(chat) {
  // Simulate a group avatar as two overlapping avatars (real apps use a canvas or SVG/composite)
  return "https://cdn-icons-png.flaticon.com/512/9131/9131529.png";
}
function sampleChatName(id) {
  if (id === 1) return "Alice";
  if (id === 2) return "Bob & Group";
  if (id === 3) return "Carol";
  return "SecureChat";
}
function formatShortTime(dateOrStr) {
  if (typeof dateOrStr === "string") return dateOrStr;
  return dateOrStr.toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});
}