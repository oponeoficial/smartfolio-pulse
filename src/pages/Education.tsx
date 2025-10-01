import { BookOpen, PlayCircle, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function Education() {
  const courses = [
    {
      title: "Fundamentos do Trading",
      level: "Iniciante",
      progress: 75,
      lessons: 12,
      duration: "3h",
      color: "success",
    },
    {
      title: "Análise Técnica Avançada",
      level: "Intermediário",
      progress: 40,
      lessons: 18,
      duration: "6h",
      color: "primary",
    },
    {
      title: "Gestão de Risco",
      level: "Intermediário",
      progress: 0,
      lessons: 10,
      duration: "4h",
      color: "warning",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl font-bold mb-2">
          Centro de <span className="gradient-text">Educação</span>
        </h1>
        <p className="text-muted-foreground">Aprenda trading com conteúdo profissional e certificado</p>
      </div>

      {/* Learning Path */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">Sua Trilha de Aprendizado</h2>
            <p className="text-sm text-muted-foreground">Continue de onde parou</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <div key={course.title} className="glass-card p-5 hover-scale">
              <div className="flex items-start justify-between mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-${course.color}/10 text-${course.color}`}>
                  {course.level}
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{course.lessons} aulas</p>
                  <p className="text-xs text-muted-foreground">{course.duration}</p>
                </div>
              </div>

              <h3 className="font-display text-lg font-bold mb-3">{course.title}</h3>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Progresso</span>
                  <span className="text-xs font-semibold">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>

              <Button variant={course.progress > 0 ? "default" : "glass"} className="w-full">
                <PlayCircle className="w-4 h-4 mr-2" />
                {course.progress > 0 ? "Continuar" : "Começar"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-display text-lg font-bold mb-2">Conteúdo Premium</h3>
          <p className="text-sm text-muted-foreground">
            Artigos, vídeos e tutoriais criados por traders profissionais
          </p>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-4">
            <PlayCircle className="w-6 h-6 text-success" />
          </div>
          <h3 className="font-display text-lg font-bold mb-2">Prática Interativa</h3>
          <p className="text-sm text-muted-foreground">
            Simuladores e quizzes para fixar o conhecimento
          </p>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-warning/10 border border-warning/20 flex items-center justify-center mx-auto mb-4">
            <Award className="w-6 h-6 text-warning" />
          </div>
          <h3 className="font-display text-lg font-bold mb-2">Certificação</h3>
          <p className="text-sm text-muted-foreground">
            Conquiste certificados reconhecidos ao completar cursos
          </p>
        </div>
      </div>
    </div>
  );
}
