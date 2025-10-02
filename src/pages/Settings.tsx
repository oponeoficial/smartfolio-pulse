import { Settings as SettingsIcon, User, Bell, Shield, Palette } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl font-bold mb-2">
          <span className="gradient-gold">Configurações</span>
        </h1>
        <p className="text-muted-foreground">Personalize sua experiência</p>
      </div>

      {/* Seções de Configuração */}
      <div className="grid gap-6">
        {/* Perfil */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
              <User className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Perfil</h2>
              <p className="text-sm text-muted-foreground">Gerencie suas informações pessoais</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nome</label>
              <p className="text-foreground">Investidor</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">E-mail</label>
              <p className="text-foreground">investidor@email.com</p>
            </div>
          </div>
        </div>

        {/* Notificações */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Notificações</h2>
              <p className="text-sm text-muted-foreground">Configure alertas e avisos</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Em breve...</p>
        </div>

        {/* Segurança */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Segurança</h2>
              <p className="text-sm text-muted-foreground">Proteja sua conta</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Em breve...</p>
        </div>

        {/* Aparência */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple/10 flex items-center justify-center">
              <Palette className="w-5 h-5 text-purple" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Aparência</h2>
              <p className="text-sm text-muted-foreground">Personalize o visual</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Em breve...</p>
        </div>
      </div>
    </div>
  );
}
