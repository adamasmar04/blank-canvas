import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Send, Clock, User, Minimize2, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
const ChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [messages, setMessages] = useState<Array<{
    id: number;
    text: string;
    sender: 'user' | 'support';
    time: string;
  }>>([]);
  const {
    toast
  } = useToast();
  const quickReplies = ["How do I create an ad?", "What payment methods do you accept?", "How long does my ad stay live?", "I need help with my account"];
  const handleSendMessage = () => {
    if (!message.trim()) return;
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'user' as const,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Simulate support response
    setTimeout(() => {
      const supportResponse = {
        id: Date.now() + 1,
        text: "Thank you for your message! A support agent will respond shortly. In the meantime, you can check our FAQ page for quick answers.",
        sender: 'support' as const,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setMessages(prev => [...prev, supportResponse]);
    }, 1000);
    toast({
      title: "Message sent",
      description: "Our support team will respond shortly"
    });
  };
  const handleQuickReply = (reply: string) => {
    setMessage(reply);
  };
  if (!isOpen) {
    return <div className="fixed bottom-6 left-6 z-50">
        <Button onClick={() => setIsOpen(true)} className="glass-button w-16 h-16 rounded-full shadow-lg hover:scale-110 transition-all duration-300 bg-gradient-to-br from-cyan-400 to-blue-500 border-0 text-gray-900 text-base">
          <MessageCircle className="w-6 h-6" />
        </Button>
        
        {/* Notification dot */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-bold">!</span>
        </div>
      </div>;
  }
  return <div className="fixed bottom-6 left-6 z-50">
      <Card className={`glass-card border-white/20 shadow-2xl transition-all duration-300 ${isMinimized ? 'w-80 h-16' : 'w-80 h-[500px]'}`}>
        {/* Header */}
        <CardHeader className="p-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <CardTitle className="text-lg">SomAdz Support</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Online
              </Badge>
              <Button variant="ghost" size="sm" onClick={() => setIsMinimized(!isMinimized)} className="text-white hover:bg-white/20 p-1">
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 p-1">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && <CardContent className="p-0 flex flex-col h-[436px]">
            {/* Status bar */}
            <div className="p-3 bg-gray-50 border-b text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Avg. response time: 5 minutes</span>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
              {messages.length === 0 ? <div className="text-center">
                  <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm mb-4">
                    Hi! How can we help you today?
                  </p>
                  
                  {/* Quick replies */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-medium">Quick questions:</p>
                    {quickReplies.map((reply, index) => <Button key={index} variant="outline" size="sm" onClick={() => handleQuickReply(reply)} className="w-full text-left justify-start text-xs py-2 h-auto">
                        {reply}
                      </Button>)}
                  </div>
                </div> : messages.map(msg => <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white border shadow-sm'}`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>)}
            </div>

            {/* Input area */}
            <div className="p-4 border-t bg-white">
              {messages.length === 0 && <div className="space-y-2 mb-3">
                  <Input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} className="text-sm" />
                  <Input placeholder="Your email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="text-sm" />
                </div>}
              
              <div className="flex gap-2">
                <Textarea placeholder="Type your message..." value={message} onChange={e => setMessage(e.target.value)} className="resize-none text-sm" rows={2} onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }} />
                <Button onClick={handleSendMessage} disabled={!message.trim()} className="glass-button text-gray-800 hover:text-gray-900 self-end">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>}
      </Card>
    </div>;
};
export default ChatSupport;