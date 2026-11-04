import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/ui/primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/primitives/dropdown-menu";
import { useTheme, type Theme } from "@/ui/theme";
import { cn } from "@/ui/utils";

const OPTIONS: { theme: Theme; label: string; icon: typeof Sun }[] = [
  { theme: "light", label: "Light", icon: Sun },
  { theme: "dark", label: "Dark", icon: Moon },
  { theme: "system", label: "System", icon: Monitor },
];

/** shadcn's mode toggle: a sun or moon button with Light, Dark and System in a menu. */
export function ModeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" className={cn("shrink-0", className)}>
          <Sun className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {OPTIONS.map(({ theme: option, label, icon: Icon }) => (
          <DropdownMenuItem
            key={option}
            onSelect={() => setTheme(option)}
            aria-current={theme === option ? "true" : undefined}
            className={cn(theme === option && "text-foreground")}
          >
            <Icon className="size-4" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
