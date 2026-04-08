import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Health & Fitness',
  'Housing & Utilities',
  'Education',
  'Travel',
  'Personal Care',
  'Other',
]

const empty = () => ({
  title: '',
  category: '',
  amount: '',
  date: format(new Date(), 'yyyy-MM-dd'),
  description: '',
})

export default function ExpenseDialog({ open, onClose, onSave, expense }) {
  const [form, setForm] = useState(empty())
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setErrors({})
      if (expense) {
        setForm({
          title: expense.title,
          category: expense.category,
          amount: String(expense.amount),
          date: format(new Date(expense.date), 'yyyy-MM-dd'),
          description: expense.description || '',
        })
      } else {
        setForm(empty())
      }
    }
  }, [open, expense])

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.title.trim()) e.title = 'Required'
    if (!form.category) e.category = 'Required'
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = 'Enter a valid amount'
    if (!form.date) e.date = 'Required'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try {
      await onSave(form)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{expense ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. Lunch, Spotify, Gym"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              className={errors.title ? 'border-destructive focus-visible:ring-destructive' : ''}
              autoFocus
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
          </div>

          {/* Category + Amount */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => set('category', v)}>
                <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => set('amount', e.target.value)}
                className={errors.amount ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
              {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
            </div>
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
              className={errors.date ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
            {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="desc">
              Description{' '}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="desc"
              placeholder="Add any notes…"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : expense ? 'Save Changes' : 'Add Expense'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
