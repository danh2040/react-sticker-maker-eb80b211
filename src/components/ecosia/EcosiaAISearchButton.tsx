import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EcosiaAISearchButtonProps {
  onClick?: () => void;
  showText?: boolean;
  href?: string;
}

export function EcosiaAISearchButton({
  onClick,
  showText = true,
  href,
}: EcosiaAISearchButtonProps) {
  const buttonContent = (
    <Button
      variant="outline"
      size="sm"
      className="mr-1 bg-white dark:bg-white text-foreground hover:bg-white/90 border-white"
      onClick={onClick}
      asChild={!!href}
    >
      {href ? (
        <a href={href}>
          <Sparkles className="h-4 w-4" />
          {showText && <span className="ml-2 hidden md:inline">AI Search</span>}
        </a>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          {showText && <span className="ml-2 hidden md:inline">AI Search</span>}
        </>
      )}
    </Button>
  );

  if (!showText) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
          <TooltipContent>
            <p>AI Search</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return buttonContent;
}
