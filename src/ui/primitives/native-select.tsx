import type * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/ui/utils";
import { fieldControlClass, fieldFocusClass } from "@/ui/primitives/field-control";

/** A native select, so it needs no portal: the right pick inside a table row or a dense form. */
function NativeSelect({
  className,
  size = "default",
  ...props
}: Omit<React.ComponentProps<"select">, "size"> & { size?: "sm" | "default" }) {
  return (
    <div
      data-slot="native-select-wrapper"
      className="group/native-select relative w-full has-[select:disabled]:opacity-50"
    >
      <select
        data-slot="native-select"
        data-size={size}
        className={cn(
          "h-10 w-full min-w-0 appearance-none py-2 pr-10 pl-3 text-sm disabled:pointer-events-none disabled:cursor-not-allowed data-[size=sm]:h-8 data-[size=sm]:py-1 data-[size=sm]:pr-8 data-[size=sm]:pl-2 data-[size=sm]:text-xs",
          fieldControlClass,
          fieldFocusClass,
          className,
        )}
        {...props}
      />
      <ChevronDown
        aria-hidden="true"
        data-slot="native-select-icon"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground select-none group-has-[[data-size=sm]]/native-select:right-2 group-has-[[data-size=sm]]/native-select:size-3.5"
      />
    </div>
  );
}

function NativeSelectOption({ className, ...props }: React.ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn("bg-popover text-popover-foreground", className)}
      {...props}
    />
  );
}

function NativeSelectOptGroup({ className, ...props }: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn("bg-popover text-popover-foreground", className)}
      {...props}
    />
  );
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption };
