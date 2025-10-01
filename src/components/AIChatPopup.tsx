import { useState } from "react";
import { Bot, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function AIChatPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([
    { role: "assistant", content: "Olá! Sou seu assistente de trading com IA. Como posso ajudar você hoje?" },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: inputMessage },
      {
        role: "assistant",
        content:
          "Analisando sua pergunta usando modelos de IA avançados. Baseado nos dados atuais do mercado, recomendo...",
      },
    ]);
    setInputMessage("");
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-[60px] h-[60px] md:w-[70px] md:h-[70px] rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-105 z-50"
        aria-label="Abrir chat IA"
      >
        <Bot className="w-7 h-7 md:w-8 md:h-8 text-white group-hover:scale-110 transition-transform" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold rounded-full animate-pulse" />
      </button>

      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[400px] h-[600px] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gold/10 border border-gold/20">
                <Bot className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold">Assistente IA</h2>
                <p className="text-sm text-muted-foreground font-normal">Pergunte sobre trading</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-secondary/20">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 animate-fade-in ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-gold" />
                  </div>
                )}
                <div
                  className={`px-4 py-3 rounded-lg max-w-[75%] ${
                    msg.role === "user"
                      ? "bg-primary/20 border border-primary/30"
                      : "bg-background border border-gold/20"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-6 pt-4 border-t">
            <div className="flex gap-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Pergunte sobre análises..."
                className="bg-secondary/50 border-gold/30"
              />
              <Button onClick={handleSendMessage} className="bg-gradient-to-r from-gold to-gold/80 text-background hover:from-gold/90">
                <Sparkles className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
