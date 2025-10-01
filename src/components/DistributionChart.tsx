import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface DistributionData {
  name: string;
  value: number;
  color: string;
}

interface DistributionChartProps {
  data: DistributionData[];
}

export function DistributionChart({ data }: DistributionChartProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate SVG path for donut chart
  const radius = 80;
  const strokeWidth = 15;
  const center = 100;
  const circumference = 2 * Math.PI * radius;
  
  let currentAngle = -90; // Start at top

  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const segmentAngle = (item.value / total) * 360;
    const startAngle = currentAngle;
    currentAngle += segmentAngle;

    // Calculate path for segment
    const startX = center + radius * Math.cos((startAngle * Math.PI) / 180);
    const startY = center + radius * Math.sin((startAngle * Math.PI) / 180);
    const endX = center + radius * Math.cos((currentAngle * Math.PI) / 180);
    const endY = center + radius * Math.sin((currentAngle * Math.PI) / 180);
    
    const largeArcFlag = segmentAngle > 180 ? 1 : 0;

    return {
      ...item,
      percentage,
      startAngle,
      endAngle: currentAngle,
      path: `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
    };
  });

  const icons = {
    'Ações': '📈',
    'FIIs': '🏢',
    'RF': '💰',
  };

  return (
    <>
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <button
          onClick={() => setIsModalOpen(true)}
          className="relative transition-all duration-500 hover:scale-105 cursor-pointer"
        >
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            className="transform -rotate-90"
          >
            {/* Background circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="hsl(214 50% 22%)"
              strokeWidth={strokeWidth}
              opacity="0.2"
            />
            
            {/* Segments */}
            {segments.map((segment, index) => (
              <path
                key={index}
                d={segment.path}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                className="transition-all duration-300"
                style={{
                  opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.4,
                  strokeDasharray: circumference,
                  strokeDashoffset: circumference,
                  animation: `fillSegment 1.5s ease-out forwards ${index * 0.2}s`,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-muted-foreground font-light">Total</p>
              <p className="text-xl font-display font-bold text-foreground">100%</p>
            </div>
          </div>
        </button>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 justify-center">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 glass-card px-4 py-2 transition-all duration-300 hover:scale-105"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.5,
              }}
            >
              <span className="text-lg">{icons[item.name as keyof typeof icons]}</span>
              <span className="text-sm font-medium text-foreground">{item.name}</span>
              <span
                className="text-sm font-bold"
                style={{ color: item.color }}
              >
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal with Details */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass-card border-gold/30">
          <DialogHeader>
            <DialogTitle>Distribuição da Carteira</DialogTitle>
            <DialogDescription>
              Composição detalhada dos seus investimentos
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {data.map((item, index) => (
              <div key={index} className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{icons[item.name as keyof typeof icons]}</span>
                    <span className="font-semibold">{item.name}</span>
                  </div>
                  <span className="text-xl font-bold" style={{ color: item.color }}>
                    {item.value}%
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${item.value}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes fillSegment {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </>
  );
}
