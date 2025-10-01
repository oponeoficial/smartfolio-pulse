import { useState } from "react";
import { ChevronLeft, ChevronRight, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DividendMonth {
  month: string;
  amount: string;
  next: string;
  nextDate: string;
  details: { asset: string; amount: string; date: string }[];
}

const dividendHistory: DividendMonth[] = [
  {
    month: "Outubro 2025",
    amount: "R$ 1.250",
    next: "R$ 580",
    nextDate: "15/10",
    details: [
      { asset: "ITSA4", amount: "R$ 450", date: "05/10" },
      { asset: "BBDC4", amount: "R$ 380", date: "08/10" },
      { asset: "TAEE11", amount: "R$ 420", date: "12/10" }
    ]
  },
  {
    month: "Setembro 2025",
    amount: "R$ 1.180",
    next: "R$ 620",
    nextDate: "22/09",
    details: [
      { asset: "ITSA4", amount: "R$ 430", date: "03/09" },
      { asset: "BBDC4", amount: "R$ 380", date: "10/09" },
      { asset: "TAEE11", amount: "R$ 370", date: "18/09" }
    ]
  },
  {
    month: "Agosto 2025",
    amount: "R$ 1.320",
    next: "R$ 590",
    nextDate: "25/08",
    details: [
      { asset: "ITSA4", amount: "R$ 470", date: "05/08" },
      { asset: "BBDC4", amount: "R$ 400", date: "12/08" },
      { asset: "TAEE11", amount: "R$ 450", date: "20/08" }
    ]
  }
];

export default function DividendsCard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const current = dividendHistory[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? dividendHistory.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === dividendHistory.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div 
        className="glass-card p-6 md:p-8 animate-slide-up cursor-pointer group hover:shadow-lg transition-all duration-300"
        style={{ animationDelay: "400ms" }}
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-gold/10 group-hover:bg-gold/20 transition-colors">
              <DollarSign className="w-6 h-6 text-gold" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Dividendos Recebidos</p>
              <p className="text-2xl md:text-3xl font-semibold text-foreground">
                {current.amount}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {current.month}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="hover:bg-primary/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="hover:bg-primary/10"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Próximo: <span className="text-foreground font-medium">{current.nextDate}</span> - {current.next}
          </p>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-gold" />
              Detalhes dos Dividendos - {current.month}
            </DialogTitle>
            <DialogDescription className="text-left pt-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <span className="font-medium">Total Recebido</span>
                  <span className="text-lg font-semibold text-gold">{current.amount}</span>
                </div>

                <div className="space-y-2">
                  {current.details.map((detail, index) => (
                    <div key={index} className="flex justify-between items-center p-2 rounded border border-border">
                      <div>
                        <p className="font-medium">{detail.asset}</p>
                        <p className="text-xs text-muted-foreground">{detail.date}</p>
                      </div>
                      <span className="text-success font-medium">{detail.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
