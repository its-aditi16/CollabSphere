import ChatPanel from '../components/ChatPanel';

const Chat = () => {
  return (
    <div className="h-screen p-8 bg-slate-950">
       <div className="h-full max-w-4xl mx-auto">
          <ChatPanel />
       </div>
    </div>
  );
};

export default Chat;
