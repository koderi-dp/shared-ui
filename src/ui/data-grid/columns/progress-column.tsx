import { Progress } from "@/ui/primitives/progress";
import { cn } from "@/ui/utils";
import { metricBarLabelClass, usageBarFillClass, type ProgressVariant } from "./progress-level";

/** A usage bar for a table cell: shadcn Progress with the level colour and the value on top. */
export function ProgressCell({
  percent,
  label,
  variant = "cpu",
}: {
  percent: number;
  label: string;
  variant?: ProgressVariant;
}) {
  const width = Math.min(100, Math.max(0, percent));

  return (
    <Progress
      value={width}
      aria-label={label}
      className="h-6 rounded-sm bg-secondary/90"
      indicatorClassName={cn("absolute inset-0 duration-300", usageBarFillClass(percent, variant))}
    >
      <div
        className={cn(
          "relative z-10 flex h-full items-center justify-center px-2 text-[10px] tabular-nums",
          "truncate",
          metricBarLabelClass(percent, width),
        )}
        title={label}
      >
        {label}
      </div>
    </Progress>
  );
}
