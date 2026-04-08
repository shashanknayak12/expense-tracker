import express from 'express'
import { Expense } from '../models/Expense.js'

const router = express.Router()

// GET /api/expenses/summary — before /:id
router.get('/summary', async (_req, res) => {
  try {
    const expenses = await Expense.find().lean()

    const total = expenses.reduce((s, e) => s + e.amount, 0)

    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const thisMonthTotal = expenses
      .filter((e) => new Date(e.date) >= thisMonthStart)
      .reduce((s, e) => s + e.amount, 0)

    const byCategory = {}
    const monthly = {}

    for (const e of expenses) {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount

      const d = new Date(e.date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      monthly[key] = (monthly[key] || 0) + e.amount
    }

    res.json({ total, thisMonthTotal, byCategory, monthly })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/expenses
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query
    const filter = {}

    if (category) filter.category = category
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    const expenses = await Expense.find(filter).sort({ date: -1 })
    res.json(expenses)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/expenses
router.post('/', async (req, res) => {
  try {
    const { title, category, amount, date, description } = req.body
    const expense = await Expense.create({
      title,
      category,
      amount: parseFloat(amount),
      date: new Date(date),
      description: description || null,
    })
    res.status(201).json(expense)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/expenses/:id
router.put('/:id', async (req, res) => {
  try {
    const { title, category, amount, date, description } = req.body
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        title,
        category,
        amount: parseFloat(amount),
        date: new Date(date),
        description: description || null,
      },
      { new: true, runValidators: true }
    )
    if (!expense) return res.status(404).json({ error: 'Expense not found' })
    res.json(expense)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/expenses/:id
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id)
    if (!expense) return res.status(404).json({ error: 'Expense not found' })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
