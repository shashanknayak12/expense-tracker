import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Search, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CATEGORIES } from "@/components/ExpenseDialog";
import { useDebounce } from "@/lib/utils";

const CATEGORY_STYLE = {
  "Food & Dining": "bg-orange-100 text-orange-700",
  Transportation: "bg-blue-100 text-blue-700",
  Shopping: "bg-pink-100 text-pink-700",
  Entertainment: "bg-purple-100 text-purple-700",
  "Health & Fitness": "bg-green-100 text-green-700",
  "Housing & Utilities": "bg-yellow-100 text-yellow-700",
  Education: "bg-indigo-100 text-indigo-700",
  Travel: "bg-sky-100 text-sky-700",
  "Personal Care": "bg-rose-100 text-rose-700",
  Other: "bg-gray-100 text-gray-700",
};

function fmt(v) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(v);
}

export default function ExpenseList({
  expenses,
  loading,
  filters,
  onFiltersChange,
  onEdit,
  onDelete,
}) {
  const [pendingDelete, setPendingDelete] = useState(null);
  const [searchInput, setSearchInput] = useState(filters?.search || "");
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    onFiltersChange({ ...filters, search: debouncedSearch || undefined });
  }, [debouncedSearch]);

  function handleCategory(val) {
    onFiltersChange({ ...filters, category: val === "All" ? undefined : val });
  }

  async function confirmDelete() {
    if (pendingDelete) {
      await onDelete(pendingDelete);
      setPendingDelete(null);
    }
  }

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  return (
    <>
      {/* Filter bar */}
      <Card className="mb-4">
        <CardContent className="py-3 px-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search title or notes…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              defaultValue={filters?.category || "All"}
              onValueChange={handleCategory}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-10 text-center text-muted-foreground text-sm">
              Loading…
            </div>
          ) : expenses.length === 0 ? (
            <div className="p-14 text-center">
              <p className="font-medium text-muted-foreground">
                No expenses found
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {filters?.search || filters?.category
                  ? "Try adjusting your filters."
                  : 'Click "Add Expense" to get started.'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      {["Date", "Title", "Category", "Amount", "Notes", ""].map(
                        (h) => (
                          <th
                            key={h}
                            className={`px-4 py-2.5 text-xs font-medium text-muted-foreground ${
                              h === "Amount"
                                ? "text-right"
                                : h === ""
                                  ? "text-right"
                                  : "text-left"
                            } ${h === "Notes" ? "hidden md:table-cell" : ""}`}
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {expenses.map((exp) => (
                      <tr
                        key={exp?._id}
                        className="hover:bg-muted/20 transition-colors group"
                      >
                        <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                          {format(new Date(exp?.date), "MMM d, yyyy")}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium max-w-[180px] truncate">
                          {exp?.title}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                              CATEGORY_STYLE[exp.category] ||
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {exp?.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-right tabular-nums whitespace-nowrap">
                          {fmt(exp?.amount)}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell max-w-[200px] truncate">
                          {exp?.description || (
                            <span className="opacity-30">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => onEdit(exp)}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => setPendingDelete(exp)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t bg-muted/10 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {expenses.length}{" "}
                  {expenses.length === 1 ? "entry" : "entries"}
                </span>
                <span className="text-sm font-semibold">{fmt(total)}</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete confirm */}
      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(o) => !o && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this expense?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
