import { useState, useEffect, useCallback } from "react";
import { PlusCircle, TrendingUp, List, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import SummaryCards from "@/components/SummaryCards";
import ExpenseDialog from "@/components/ExpenseDialog";
import ExpenseList from "@/components/ExpenseList";
import MonthlyTrends from "@/components/MonthlyTrends";
import CategoryBreakdown from "@/components/CategoryBreakdown";
import AuthPage from "@/components/AuthPage";
import AdminPanel from "@/components/AdminPanel";

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleAuth = (loggedInUser) => setUser(loggedInUser);

  const handleLogout = async () => {
    await api.logout().catch(() => {});
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const refresh = useCallback(
    async (activeFilters = filters) => {
      try {
        const [exps, sum] = await Promise.all([
          api.getExpenses(activeFilters),
          api.getSummary(),
        ]);
        setExpenses(exps);
        setSummary(sum);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    refresh();
  }, []); // initial load

  const handleFiltersChange = (next) => {
    setFilters(next);
    setLoading(true);
    api
      .getExpenses(next)
      .then(setExpenses)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSave = async (data) => {
    if (editing) {
      await api.updateExpense(editing?._id, data);
    } else {
      await api.createExpense(data);
    }
    setDialogOpen(false);
    setEditing(null);
    refresh();
  };

  const openEdit = (expense) => {
    setEditing(expense);
    setDialogOpen(true);
  };

  const handleDelete = async ({ _id }) => {
    await api.deleteExpense(_id);
    refresh();
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
  };

  if (!user) return <AuthPage onAuth={handleAuth} />;

  return (
    <div className="min-h-screen bg-gray-50/60">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-bold text-sm">
                $
              </span>
            </div>
            <span className="font-semibold text-lg tracking-tight">
              Expense Tracker
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Hi, {user.name}
            </span>
            <Button size="sm" onClick={() => setDialogOpen(true)}>
              <PlusCircle className="w-4 h-4" />
              Add Expense
            </Button>
            <Button size="sm" variant="ghost" onClick={handleLogout} title="Logout">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <SummaryCards summary={summary} loading={loading && !summary} />

        <Tabs defaultValue="overview">
          <TabsList className="mb-1">
            <TabsTrigger value="overview" className="gap-1.5">
              <TrendingUp className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="expenses" className="gap-1.5">
              <List className="w-4 h-4" />
              All Expenses
            </TabsTrigger>
            {user.role === "admin" && (
              <TabsTrigger value="admin" className="gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Admin
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <MonthlyTrends summary={summary} />
              <CategoryBreakdown summary={summary} />
            </div>
          </TabsContent>

          <TabsContent value="expenses">
            <ExpenseList
              expenses={expenses}
              loading={loading}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          </TabsContent>

          {user.role === "admin" && (
            <TabsContent value="admin">
              <AdminPanel />
            </TabsContent>
          )}
        </Tabs>
      </main>

      <ExpenseDialog
        open={dialogOpen}
        onClose={closeDialog}
        onSave={handleSave}
        expense={editing}
      />
    </div>
  );
}
