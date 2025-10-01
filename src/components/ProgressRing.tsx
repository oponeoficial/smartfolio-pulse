import { useState } from "react";
import { Progress } from "@/components/ui/progress";

type GoalType = "retirement" | "house" | "education";

interface Goal {
  type: GoalType;
  label: string;
  progress: number;
  target: string;
  secondaryGoals: { label: string; progress: number }[];
}

const goals: Goal[] = [
  {
    type: "retirement",
    label: "Rumo à Aposentadoria",
    progress: 65,
    target: "R$ 1.000.000",
    secondaryGoals: [
      { label: "Reserva Emergência", progress: 100 },
      { label: "Previdência Privada", progress: 45 },
      { label: "Renda Passiva", progress: 30 }
    ]
  },
  {
    type: "house",
    label: "Casa Própria",
    progress: 42,
    target: "R$ 500.000",
    secondaryGoals: [
      { label: "Entrada", progress: 80 },
      { label: "Documentação", progress: 60 },
      { label: "Reforma", progress: 0 }
    ]
  },
  {
    type: "education",
    label: "Educação dos Filhos",
    progress: 38,
    target: "R$ 300.000",
    secondaryGoals: [
      { label: "Ensino Fundamental", progress: 100 },
      { label: "Ensino Médio", progress: 55 },
      { label: "Faculdade", progress: 15 }
    ]
  }
];

export default function ProgressRing() {
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);
  const currentGoal = goals[currentGoalIndex];

  const handleToggle = () => {
    setCurrentGoalIndex((prev) => (prev + 1) % goals.length);
  };

  return (
    <div className="flex flex-col items-center space-y-6 animate-slide-up" style={{ animationDelay: "300ms" }}>
      <button
        onClick={handleToggle}
        className="relative group cursor-pointer transition-transform duration-300 hover:scale-105"
      >
        <div className="w-[140px] h-[140px] md:w-[180px] md:h-[180px] relative">
          {/* Circular Progress Background */}
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - currentGoal.progress / 100)}`}
              className="transition-all duration-1000 ease-out"
              style={{
                animation: currentGoal.progress >= 100 ? "pulse 2s ease-in-out infinite" : "none"
              }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2196F3" />
                <stop offset="100%" stopColor="#03A9F4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl md:text-4xl font-semibold text-foreground">
              {currentGoal.progress}%
            </span>
          </div>
        </div>
      </button>

      <div className="text-center space-y-3 px-4 w-full max-w-xs">
        <h3 className="text-lg md:text-xl font-medium text-foreground animate-fade-in">
          {currentGoal.label}
        </h3>
        <p className="text-sm text-muted-foreground">
          Meta: {currentGoal.target}
        </p>

        {/* Secondary Goals */}
        <div className="space-y-2 pt-2">
          {currentGoal.secondaryGoals.map((goal, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{goal.label}</span>
                <span>{goal.progress}%</span>
              </div>
              <Progress value={goal.progress} className="h-1.5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
