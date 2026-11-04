import { useNavigate } from "@tanstack/react-router";
import { CornerDownLeft } from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/ui/primitives/command";
import type { Command } from "./command-palette-state";
import { matchesTokens, searchTokens } from "./command-search";
import { navItems, type NavConfig } from "./nav";

export function CommandPalette({
  open,
  onOpenChange,
  nav,
  commands,
  placeholder = "Search pages and actions…",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nav: NavConfig;
  commands: Command[];
  placeholder?: string;
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const tokens = useMemo(() => searchTokens(query), [query]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const pages = navItems(nav).filter((item) =>
    matchesTokens(tokens, { name: item.label, keywords: (item.keywords ?? []).join(" ") }),
  );
  const groups = useMemo(() => {
    const byGroup = new Map<string, Command[]>();
    for (const command of commands) {
      const fields = {
        name: command.label,
        description: command.description ?? "",
        keywords: (command.keywords ?? []).join(" "),
      };
      if (!matchesTokens(tokens, fields)) continue;
      byGroup.set(command.group, [...(byGroup.get(command.group) ?? []), command]);
    }
    return [...byGroup];
  }, [commands, tokens]);

  function close() {
    onOpenChange(false);
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Command palette"
      description="Search pages and actions."
      className="sm:max-w-xl"
      commandProps={{ loop: true, shouldFilter: false }}
    >
      <CommandInput value={query} onValueChange={setQuery} placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>Nothing matches.</CommandEmpty>
        {groups.map(([group, items], index) => (
          <Fragment key={group}>
            {index > 0 ? <CommandSeparator /> : null}
            <CommandGroup heading={group}>
              {items.map((command) => {
                const Icon = command.icon ?? CornerDownLeft;
                return (
                  <CommandItem
                    key={command.id}
                    value={`command-${command.id}`}
                    onSelect={() => {
                      close();
                      command.run();
                    }}
                  >
                    <Icon className="text-muted-foreground" />
                    <span className="truncate">{command.label}</span>
                    {command.description ? (
                      <CommandShortcut>{command.description}</CommandShortcut>
                    ) : null}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Fragment>
        ))}
        {pages.length ? (
          <>
            {groups.length > 0 ? <CommandSeparator /> : null}
            <CommandGroup heading={tokens.length ? "Navigate" : "Pages"}>
              {pages.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={item.to}
                    value={`page-${item.to}`}
                    onSelect={() => {
                      close();
                      void navigate({ to: item.to });
                    }}
                  >
                    <Icon className="text-muted-foreground" />
                    {item.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </>
        ) : null}
      </CommandList>
    </CommandDialog>
  );
}
