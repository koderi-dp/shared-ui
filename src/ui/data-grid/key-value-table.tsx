import type { ComponentProps, ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/primitives/table";
import { cn } from "@/ui/utils";

export type KeyValueColumn = {
  id: string;
  header: ReactNode;
  /** Class on the `<col>` element (e.g. "w-[23%]"); no class renders a plain `<col />`. */
  colClassName?: string;
  /** Extra classes for this column's `<th>`. */
  headerClassName?: string;
  /** "right" adds `text-right` to the `<th>`. */
  align?: "left" | "right";
};

export type KeyValueTableProps = {
  caption: string;
  columns: KeyValueColumn[];
  classNames?: {
    wrapper?: string;
    table?: string;
    thead?: string;
    headerRow?: string;
    headerCell?: string;
    tbody?: string;
  };
  /** The rows: compose them from `KeyValueTable.Row`, `.Key` and `.Cell`. */
  children: ReactNode;
};

// The grid owns no padding or type here: the primitives' defaults are reset so the
// caller's classes are the whole look, as before.
function Row({ className, ...props }: ComponentProps<"tr">) {
  return <TableRow className={cn("hover:bg-transparent", className)} {...props} />;
}

function Key({ className, ...props }: ComponentProps<"th">) {
  return (
    <TableHead scope="row" className={cn("p-0 [font-weight:inherit]", className)} {...props} />
  );
}

function Cell({ className, ...props }: ComponentProps<"td">) {
  return <TableCell className={cn("h-auto p-0", className)} {...props} />;
}

/**
 * A plain table for form and key/value layouts that do not fit a row-per-record
 * DataGrid. No sorting, resizing or selection; the caller owns every class.
 */
export function KeyValueTable({ caption, columns, classNames, children }: KeyValueTableProps) {
  return (
    <Table
      containerClassName={classNames?.wrapper ?? "contents"}
      className={cn("w-auto text-[length:inherit]", classNames?.table)}
    >
      <caption className="sr-only">{caption}</caption>
      <colgroup>
        {columns.map((column) => (
          <col key={column.id} className={column.colClassName} />
        ))}
      </colgroup>
      <TableHeader className={cn("text-[length:inherit] text-inherit", classNames?.thead)}>
        <TableRow className={cn("hover:bg-transparent", classNames?.headerRow)}>
          {columns.map((column) => (
            <TableHead
              key={column.id}
              scope="col"
              className={cn(
                "p-0 [font-weight:inherit]",
                classNames?.headerCell,
                column.align === "right" && "text-right",
                column.headerClassName,
              )}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className={classNames?.tbody}>{children}</TableBody>
    </Table>
  );
}

KeyValueTable.Row = Row;
KeyValueTable.Key = Key;
KeyValueTable.Cell = Cell;
