import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";

function ActivityLog({ userId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getUserActivity(userId)
      .then(setActivities)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <p className="text-sm text-muted-foreground px-2 py-1">Loading...</p>;
  if (!activities.length) return <p className="text-sm text-muted-foreground px-2 py-1">No activity yet.</p>;

  return (
    <ul className="mt-2 space-y-1 max-h-48 overflow-y-auto">
      {activities.map((a) => (
        <li key={a._id} className="flex items-center justify-between text-sm px-2 py-1 rounded bg-muted/40">
          <span>
            <Badge variant="outline" className="mr-2 text-xs capitalize">
              {a.action.replace(/_/g, " ")}
            </Badge>
            {a.details}
          </span>
          <span className="text-xs text-muted-foreground ml-4 shrink-0">
            {new Date(a.createdAt).toLocaleString()}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const loadUsers = () => {
    setLoading(true);
    api.getUsers()
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this user and all their activity?")) return;
    setDeleting(id);
    try {
      await api.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      if (expanded === id) setExpanded(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const toggleExpand = (id) => setExpanded((prev) => (prev === id ? null : id));

  if (loading) return <p className="text-muted-foreground text-sm">Loading users...</p>;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">User Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {users.length === 0 && (
          <p className="text-sm text-muted-foreground">No users found.</p>
        )}
        {users.map((u) => (
          <div key={u._id} className="border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-white hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-medium text-sm">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
                <Badge variant={u.role === "admin" ? "default" : "secondary"} className="text-xs">
                  {u.role}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground hidden sm:block">
                  Joined {new Date(u.createdAt).toLocaleDateString()}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleExpand(u._id)}
                  className="gap-1 text-xs"
                >
                  Activity
                  {expanded === u._id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(u._id)}
                  disabled={deleting === u._id}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {expanded === u._id && (
              <div className="px-4 pb-3 bg-muted/10 border-t">
                <ActivityLog userId={u._id} />
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
