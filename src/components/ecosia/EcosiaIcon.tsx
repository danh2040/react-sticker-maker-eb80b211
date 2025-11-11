import { cn } from "@/lib/utils";
import {
  Check,
  CheckCircle,
  Info,
  AlertTriangle,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Menu,
  Home,
  Settings,
  User,
  Mail,
  Bell,
  Heart,
  Star,
  Loader2,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Download,
  Upload,
  Share2,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Plus,
  Minus,
  type LucideIcon,
} from "lucide-react";

type IconSize = "s" | "m" | "l";

interface EcosiaIconProps {
  name: string;
  size?: IconSize;
  className?: string;
  spinning?: boolean;
}

const sizeClasses = {
  s: "w-4 h-4",
  m: "w-5 h-5",
  l: "w-6 h-6",
};

const iconMap: Record<string, LucideIcon> = {
  check: Check,
  "check-circle": CheckCircle,
  "info-circle": Info,
  problem: AlertTriangle,
  close: X,
  "chevron-down": ChevronDown,
  "chevron-up": ChevronUp,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  search: Search,
  menu: Menu,
  home: Home,
  settings: Settings,
  user: User,
  mail: Mail,
  bell: Bell,
  heart: Heart,
  star: Star,
  spinner: Loader2,
  play: Play,
  pause: Pause,
  "skip-forward": SkipForward,
  "skip-back": SkipBack,
  volume: Volume2,
  "volume-x": VolumeX,
  download: Download,
  upload: Upload,
  share: Share2,
  edit: Edit,
  trash: Trash2,
  eye: Eye,
  "eye-off": EyeOff,
  lock: Lock,
  unlock: Unlock,
  plus: Plus,
  minus: Minus,
};

export function EcosiaIcon({ name, size = "m", className, spinning = false }: EcosiaIconProps) {
  const Icon = iconMap[name] || Info;

  return (
    <Icon
      className={cn(
        sizeClasses[size],
        spinning && "animate-spin",
        "align-middle",
        className
      )}
    />
  );
}
