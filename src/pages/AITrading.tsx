import { useState } from "react";
import { Bot, Sparkles, TrendingUp, BarChart3, Target, Brain, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecommendationCard } from "@/components/RecommendationCard";

export default function AITrading() {
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([
    { role: "assistant", content: "Olá! Sou seu assistente de trading com IA. Como posso ajudar você hoje?" },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const recommendations = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      action: "buy" as const,
      confidence: 87,
      price: 178.45,
      change: 2.3,
      targetPrice: 195.50,
      stopLoss: 172.00,
      entryPrices: {
        conservative: 176.80,
        moderate: 178.10,
        aggressive: 179.40,
      },
      reason:
        "Análise técnica: MACD cruzamento positivo + RSI em 58 (zona neutra-positiva). Fundamentos: EPS crescente 12% YoY. Sentimento: 78% positivo nas notícias.",
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      action: "buy" as const,
      confidence: 91,
      price: 495.22,
      change: 5.7,
      targetPrice: 580.00,
      stopLoss: 470.00,
      entryPrices: {
        conservative: 490.00,
        moderate: 495.00,
        aggressive: 500.00,
      },
      reason:
        "Forte momentum de alta sustentado. Volume 2.3x acima da média. Padrão de rompimento de resistência confirmado. Setor de IA em expansão.",
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      action: "hold" as const,
      confidence: 72,
      price: 242.15,
      change: -1.2,
      targetPrice: 260.00,
      stopLoss: 230.00,
      entryPrices: {
        conservative: 240.00,
        moderate: 242.00,
        aggressive: 244.00,
      },
      reason:
        "Consolidação após rally recente. RSI em 52 sugere lateralização. Aguardar confirmação de tendência antes de entrar/sair.",
    },
  ];

  const aiMetrics = [
    { label: "Taxa de Acerto", value: "87%", icon: Target, color: "success" },
    { label: "Sharpe Ratio", value: "1.8", icon: TrendingUp, color: "primary" },
    { label: "Operações (30d)", value: "247", icon: BarChart3, color: "gold" },
    { label: "Retorno Médio", value: "+3.2%", icon: Sparkles, color: "success" },
  ];

  const backtestResults = [
    { strategy: "Momentum + IA", return: 18.5, sharpe: 1.9, maxDrawdown: -8.2, trades: 342 },
    { strategy: "Mean Reversion", return: 12.3, sharpe: 1.4, maxDrawdown: -12.5, trades: 289 },
    { strategy: "Trend Following", return: 15.8, sharpe: 1.6, maxDrawdown: -10.1, trades: 198 },
  ];

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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold mb-2">
            Análises <span className="gradient-gold">Públicas da IA</span>
          </h1>
          <p className="text-muted-foreground">Análises inteligentes para suas decisões de trading</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/10 border border-gold/20">
          <Brain className="w-5 h-5 text-gold animate-pulse" />
          <span className="font-semibold text-gold">IA Ativa</span>
        </div>
      </div>

      {/* AI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {aiMetrics.map((metric, i) => (
          <div
            key={metric.label}
            className="glass-card p-6 hover-glow"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${metric.color}/10 border border-${metric.color}/20`}>
                <metric.icon className={`w-6 h-6 text-${metric.color}`} />
              </div>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
            <p className="text-3xl font-display font-bold">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs System */}
      <Tabs defaultValue="analyses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-secondary/50 p-1">
          <TabsTrigger value="analyses" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
            Principais Análises
          </TabsTrigger>
          <TabsTrigger value="chat" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
            Assistente IA
          </TabsTrigger>
          <TabsTrigger value="backtest" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
            Backtesting
          </TabsTrigger>
        </TabsList>

        {/* Analyses Tab */}
        <TabsContent value="analyses" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gold/10 border border-gold/20 animate-glow-pulse">
                <Sparkles className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold">Principais Análises</h2>
                <p className="text-sm text-muted-foreground">
                  Análise multi-fatores: técnica, fundamental e sentimento
                </p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/analyses-public')}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white"
            >
              Ver todas as análises
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {recommendations.map((rec, index) => (
              <div key={rec.symbol} className="animate-slide-up" style={{ animationDelay: `${index * 150}ms` }}>
                <RecommendationCard {...rec} />
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gold/10 border border-gold/20">
                <Bot className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold">Assistente IA</h2>
                <p className="text-sm text-muted-foreground">Pergunte qualquer coisa sobre trading</p>
              </div>
            </div>

            <div className="space-y-4 mb-6 h-[400px] overflow-y-auto p-4 bg-secondary/30 rounded-lg">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-gold" />
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 rounded-lg max-w-[70%] ${
                      msg.role === "user"
                        ? "bg-primary/20 border border-primary/30"
                        : "bg-secondary/50 border border-gold/20"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Pergunte sobre análise técnica, estratégias, ou ações específicas..."
                className="bg-secondary/50 border-gold/30"
              />
              <Button onClick={handleSendMessage} className="bg-gradient-gold text-background">
                <Sparkles className="w-4 h-4 mr-2" />
                Enviar
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Backtest Tab */}
        <TabsContent value="backtest">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gold/10 border border-gold/20">
                <BarChart3 className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold">Resultados de Backtesting</h2>
                <p className="text-sm text-muted-foreground">
                  Performance de estratégias em dados históricos (2020-2024)
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Estratégia</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Retorno Total</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Sharpe Ratio</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Max Drawdown</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Operações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {backtestResults.map((result, i) => (
                    <tr key={i} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {i === 0 && (
                            <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                          )}
                          <span className="font-semibold">{result.strategy}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold text-success">
                          +{result.return.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold">{result.sharpe}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-danger">{result.maxDrawdown.toFixed(1)}%</span>
                      </td>
                      <td className="px-6 py-4 text-right text-muted-foreground">
                        {result.trades}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-gold/10 border border-gold/20 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold text-gold">💡 Insight:</span> A estratégia
                "Momentum + IA" apresentou o melhor desempenho ajustado ao risco nos últimos 4
                anos, com Sharpe Ratio de 1.9 e retorno de 18.5%.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
