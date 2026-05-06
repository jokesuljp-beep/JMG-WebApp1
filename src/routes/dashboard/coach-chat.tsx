import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Navbar } from "~/components/layout/navbar";
import { Footer } from "~/components/layout/footer";
import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Paperclip, Loader2, Video } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { useMutation, useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";

export const Route = createFileRoute("/dashboard/coach-chat")({
  component: CoachChatPage,
});

function CoachChatPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const navigate = useNavigate();
  
  const { data: messages } = useSuspenseQuery(convexQuery(api.chat.getMessages, {}));
  const sendMessage = useMutation(api.chat.sendMessage);
  const generateUploadUrl = useMutation(api.chat.generateUploadUrl);
  
  const [content, setContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    await sendMessage({ content: content.trim() });
    setContent("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const postUrl = await generateUploadUrl();
      
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      
      await sendMessage({ 
        content: `Uploaded a swing video: ${file.name}`,
        videoUrl: storageId 
      });
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (isAuthLoading) return null;

  return (
    <div className="flex flex-col h-screen bg-black">
      <Navbar />
      <main className="flex-grow flex flex-col max-w-5xl mx-auto w-full p-4 overflow-hidden">
        <div className="flex items-center justify-between mb-4 px-4 py-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Coach Chat</h1>
            <p className="text-white/40 text-sm">Direct feedback from James Martin</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-golf-green rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Connected</span>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto space-y-6 px-4 py-8 custom-scrollbar"
        >
          {messages.length === 0 && (
            <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-white/5 border-dashed">
              <Bot className="w-12 h-12 text-golf-green/20 mx-auto mb-4" />
              <p className="text-white/40 font-medium">Ready to master your game? Send your first message or upload a 10s swing video!</p>
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg._id} className={`flex ${!msg.isFromCoach ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-4 max-w-[85%] ${!msg.isFromCoach ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center border border-white/5 ${
                  !msg.isFromCoach ? 'bg-zinc-800' : 'bg-golf-green/10 text-golf-green'
                }`}>
                  {!msg.isFromCoach ? <User size={18} /> : <Bot size={18} />}
                </div>
                <div>
                  <div className={`p-4 rounded-2xl text-sm shadow-xl ${
                    !msg.isFromCoach 
                      ? 'bg-golf-green text-black font-semibold' 
                      : 'bg-zinc-900 text-white border border-white/5'
                  }`}>
                    {msg.content}
                    {msg.videoUrl && (
                      <div className="mt-3 p-3 bg-black/20 rounded-xl border border-black/10 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center">
                          <Video size={16} className="text-golf-green" />
                        </div>
                        <div>
                          <span className="text-[10px] block font-black uppercase tracking-widest opacity-40">Swing Analysis</span>
                          <span className="text-xs font-bold">Video Clip Attached</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={`text-[10px] mt-2 text-white/20 font-bold uppercase tracking-widest ${
                    !msg.isFromCoach ? 'text-right' : 'text-left'
                  }`}>
                    {new Date(msg._creationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 py-6">
          <form onSubmit={handleSend} className="p-2 bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-2xl flex gap-3 items-center shadow-2xl ring-1 ring-white/5">
            <input 
              type="file" 
              accept="video/*" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
            />
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-11 h-11 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all disabled:opacity-50"
              title="Upload Swing Video"
            >
              {isUploading ? <Loader2 size={20} className="animate-spin text-golf-green" /> : <Paperclip size={20} />}
            </button>
            <input 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ask James about your swing..."
              className="flex-grow bg-transparent border-none focus:ring-0 text-white text-sm py-3 px-2"
            />
            <Button 
              type="submit" 
              disabled={!content.trim() || isUploading}
              className="bg-golf-green hover:bg-golf-green/90 text-black font-bold h-11 px-5 rounded-xl transition-all"
            >
              <Send size={18} className="mr-2" />
              Send
            </Button>
          </form>
          <p className="text-[10px] text-center text-white/20 mt-4 font-bold uppercase tracking-[0.2em]">
            James Martin Golf Academy • Premium Support
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
