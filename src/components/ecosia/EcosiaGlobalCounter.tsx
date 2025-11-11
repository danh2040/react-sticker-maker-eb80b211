import { cn } from "@/lib/utils";
import { EcosiaCounter } from "./EcosiaCounter";

interface EcosiaGlobalCounterProps {
  treeCount: string | number;
  investmentCount: string | number;
  treeIcon: React.ReactNode;
  moneyIcon: React.ReactNode;
  glass?: boolean;
  border?: boolean;
  vertical?: boolean;
  size?: "s" | "m" | "l";
}

export function EcosiaGlobalCounter({
  treeCount,
  investmentCount,
  treeIcon,
  moneyIcon,
  glass = false,
  border = false,
  vertical = false,
  size = "m",
}: EcosiaGlobalCounterProps) {
  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden",
        glass && "bg-[hsl(var(--background-glass))] backdrop-blur-[24px]",
        !glass && "bg-[hsl(var(--background-elevation-1))]",
        border && "border border-[hsl(var(--decorative-border-1))]"
      )}
    >
      <div className={cn("grid", vertical ? "grid-cols-1 divide-y" : "md:grid-cols-2 md:divide-x divide-y md:divide-y-0", "divide-[hsl(var(--decorative-border-1))]")}>
        <div className="p-0">
          <EcosiaCounter
            icon={treeIcon}
            count={treeCount}
            description="Trees planted"
            size={size}
            glass={false}
            border={false}
          />
        </div>
        <div className="p-0">
          <EcosiaCounter
            icon={moneyIcon}
            count={investmentCount}
            description="Climate investments"
            size={size}
            glass={false}
            border={false}
          />
        </div>
      </div>
    </div>
  );
}
