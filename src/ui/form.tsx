import { ChevronRight } from "lucide-react";
import { cloneElement, isValidElement, useEffect, useId, useState, type ReactNode } from "react";
import { Button } from "@/ui/primitives/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/ui/primitives/collapsible";
import {
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  Field as ShadcnField,
} from "@/ui/primitives/field";
import { Input } from "@/ui/primitives/input";
import { RadioGroup, RadioGroupItem } from "@/ui/primitives/radio-group";
import { Switch } from "@/ui/primitives/switch";
import { cn } from "@/ui/utils";

/** Label above the control, unit in the label, hint or error below. */
export function Field({
  label,
  hint,
  error,
  className,
  children,
}: {
  label: string;
  hint?: ReactNode;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  const controlId = useId();
  const messageId = useId();
  // The control is named by the label, marked invalid and pointed at the message,
  // so the error is more than red text.
  const control = isValidElement<ControlAria>(children)
    ? cloneElement(children, {
        id: children.props.id ?? controlId,
        "aria-invalid": error ? true : children.props["aria-invalid"],
        "aria-describedby": error || hint ? messageId : children.props["aria-describedby"],
      })
    : children;
  const id = isValidElement<ControlAria>(children) ? (children.props.id ?? controlId) : undefined;
  return (
    <ShadcnField data-invalid={error ? true : undefined} className={className}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {control}
      {error ? (
        <FieldError id={messageId}>{error}</FieldError>
      ) : hint ? (
        <FieldDescription id={messageId}>{hint}</FieldDescription>
      ) : null}
    </ShadcnField>
  );
}

type ControlAria = { id?: string; "aria-invalid"?: boolean; "aria-describedby"?: string };

/**
 * Whole-number input. Keeps the typed text while it is being edited so the field
 * can be emptied and retyped, and reports a number only when the text is one.
 */
export function NumberInput({
  value,
  onChange,
  min,
  max,
  disabled,
  className,
  id,
  "aria-label": ariaLabel,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
} & ControlAria) {
  const [text, setText] = useState(String(value));
  useEffect(() => {
    setText((current) => (Number(current) === value && current !== "" ? current : String(value)));
  }, [value]);
  return (
    <Input
      id={id}
      inputMode="numeric"
      aria-label={ariaLabel}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedBy}
      disabled={disabled}
      className={cn("tabular-nums", className)}
      value={text}
      onChange={(event) => {
        const next = event.target.value.replace(/[^\d]/g, "");
        setText(next);
        if (next !== "") {
          let parsed = Number(next);
          if (max != null) parsed = Math.min(parsed, max);
          onChange(parsed);
        }
      }}
      onBlur={() => {
        const parsed = text === "" ? (min ?? 0) : Math.max(min ?? 0, Number(text));
        setText(String(parsed));
        if (parsed !== value) onChange(parsed);
      }}
    />
  );
}

/** A switch with its label and description beside it. */
export function SwitchField({
  checked,
  onCheckedChange,
  label,
  description,
  disabled,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}) {
  const id = useId();
  const descriptionId = useId();
  return (
    <ShadcnField orientation="horizontal" data-disabled={disabled ? true : undefined}>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-describedby={description ? descriptionId : undefined}
        className="disabled:cursor-not-allowed disabled:opacity-40"
      />
      <FieldContent>
        <FieldLabel htmlFor={id} className="cursor-pointer text-sm font-normal text-foreground">
          {label}
        </FieldLabel>
        {description ? <FieldDescription id={descriptionId}>{description}</FieldDescription> : null}
      </FieldContent>
    </ShadcnField>
  );
}

/** Advanced fields sit behind this, closed by default. */
export function Disclosure({
  title,
  children,
  defaultOpen = false,
  forceOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  /** Keeps it open while a field inside has an error to show. */
  forceOpen?: boolean;
}) {
  const [chosen, setOpen] = useState(defaultOpen);
  const open = chosen || forceOpen;
  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="rounded-lg shadow-[var(--shadow-border)]"
    >
      <CollapsibleTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="group/disclosure h-auto w-full justify-start rounded-lg px-3 py-2.5 text-left text-xs"
        >
          <ChevronRight className="size-3.5 transition-transform group-data-[state=open]/disclosure:rotate-90" />
          {title}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="grid gap-4 border-t border-border px-3 py-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

/** A choice between a few options drawn as cards, for the first step of the create flow. */
export function ChoiceCards<T extends string>({
  value,
  onChange,
  options,
  "aria-label": ariaLabel,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { id: T; label: string; description: string; icon: ReactNode }[];
  "aria-label"?: string;
}) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(next) => onChange(next as T)}
      aria-label={ariaLabel}
      className="gap-2 sm:grid-cols-2"
    >
      {options.map((option) => (
        <RadioGroupItem
          key={option.id}
          value={option.id}
          className={cn(
            "flex items-start gap-3 rounded-lg px-3 py-3 text-left shadow-[var(--shadow-border)] transition-[background-color,box-shadow] hover:bg-secondary/50",
            "data-[state=checked]:bg-secondary data-[state=checked]:shadow-[var(--shadow-border-hover)]",
          )}
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-md bg-inset text-muted-foreground shadow-[var(--shadow-border)] [&_svg]:size-4">
            {option.icon}
          </span>
          <span className="grid gap-0.5">
            <span className="text-sm font-medium">{option.label}</span>
            <span className="text-xs text-muted-foreground">{option.description}</span>
          </span>
        </RadioGroupItem>
      ))}
    </RadioGroup>
  );
}
