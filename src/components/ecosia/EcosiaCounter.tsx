import { cn } from "@/lib/utils";

type CounterSize = "s" | "m" | "l";

interface EcosiaCounterProps {
  icon: React.ReactNode;
  count: string | number;
  description: string;
  size?: CounterSize;
  glass?: boolean;
  border?: boolean;
  vertical?: boolean;
}

const iconSizeClasses = {
  s: "w-6 h-6",
  m: "w-8 h-8",
  l: "w-10 h-10",
};

export function EcosiaCounter({
  icon,
  count,
  description,
  size = "m",
  glass = false,
  border = false,
  vertical = false,
}: EcosiaCounterProps) {
  return (
    <div
      className={cn(
        "grid p-4 rounded-2xl min-h-[69px]",
        vertical ? "grid-cols-1 grid-rows-[auto_auto_auto] gap-2" : "grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-x-2",
        glass && "bg-[hsl(var(--background-glass))] backdrop-blur-[24px]",
        !glass && "bg-[hsl(var(--background-elevation-1))]",
        border && "border border-[hsl(var(--decorative-border-1))]"
      )}
      style={{
        gridTemplateAreas: vertical
          ? "'icon' 'count' 'description'"
          : "'icon count' 'icon description'",
      }}
    >
      <div className="flex items-center justify-center" style={{ gridArea: "icon" }}>
        <div className={cn(iconSizeClasses[size])}>{icon}</div>
      </div>
      <div className="text-2xl font-bold font-brand text-foreground" style={{ gridArea: "count" }}>
        {count}
      </div>
      <div className="text-sm text-muted-foreground" style={{ gridArea: "description" }}>
        {description}
      </div>
    </div>
  );
}
