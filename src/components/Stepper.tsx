import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = ["Milhas", "Cotação", "Acesso", "Dados"];

export function Stepper({ current }: { current: number }) {
  return (
    <div className="w-full px-4 py-5 bg-card/80 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {steps.map((label, i) => {
          const idx = i + 1;
          const completed = idx < current;
          const active = idx === current;
          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300",
                    completed && "bg-gradient-navy border-transparent text-navy-foreground shadow-soft",
                    active && "bg-gradient-navy border-transparent text-navy-foreground scale-110 shadow-elegant ring-4 ring-navy/15",
                    !completed && !active && "bg-card border-border text-muted-foreground",
                  )}
                >
                  {completed ? <Check className="w-4 h-4" strokeWidth={3} /> : idx}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-semibold tracking-wide uppercase",
                    (active || completed) ? "text-navy" : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 mb-5 rounded-full bg-border overflow-hidden">
                  <div
                    className={cn(
                      "h-full bg-gradient-navy transition-all duration-500",
                      completed ? "w-full" : "w-0",
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
