import { BookOpen, Sparkles } from "lucide-react";

export default function Education() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl font-bold mb-2">
          <span className="gradient-gold">Educação Financeira</span>
        </h1>
        <p className="text-muted-foreground">Conteúdo exclusivo em desenvolvimento</p>
      </div>

      {/* Coming Soon Card */}
      <div className="glass-card p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-gold" />
          </div>
          
          <h2 className="font-display text-3xl font-bold mb-4 gradient-gold">
            Em Breve
          </h2>
          
          <p className="text-lg text-muted-foreground mb-6">
            Estamos preparando um conteúdo educacional exclusivo para você dominar o mercado financeiro
          </p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gold-light">
            <Sparkles className="w-4 h-4" />
            <span>Cursos, vídeos, certificações e muito mais</span>
          </div>
        </div>
      </div>
    </div>
  );
}
