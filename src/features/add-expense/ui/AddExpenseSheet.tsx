'use client'

import { useState } from 'react'
import type { Expense } from '@/entities/expense'
import { useCurrency, useMembers, useWarikanActions } from '@/entities/warikan'
import { formatAmount } from '@/shared/lib'
import type { MemberId } from '@/shared/types'
import { Button, Checkbox, Input, RadioGroup, Sheet } from '@/shared/ui'
import { useCalculator } from '../model/use-calculator'
import { CalculatorKeypad } from './CalculatorKeypad'

export interface AddExpenseSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingExpense?: Expense
}

export function AddExpenseSheet({
  open,
  onOpenChange,
  editingExpense,
}: AddExpenseSheetProps) {
  return (
    <Sheet.Root open={open} onOpenChange={onOpenChange}>
      <Sheet.Content>
        <AddExpenseForm
          key={editingExpense?.id ?? 'new'}
          {...(editingExpense && { editingExpense })}
          onClose={() => onOpenChange(false)}
        />
      </Sheet.Content>
    </Sheet.Root>
  )
}

interface AddExpenseFormProps {
  editingExpense?: Expense
  onClose: () => void
}

function AddExpenseForm({ editingExpense, onClose }: AddExpenseFormProps) {
  const members = useMembers()
  const currency = useCurrency()
  const { addExpense, updateExpense } = useWarikanActions()

  const isEditing = !!editingExpense

  const [name, setName] = useState(editingExpense?.name ?? '')
  const [paidBy, setPaidBy] = useState<MemberId | null>(
    editingExpense?.paidBy ?? members[0]?.id ?? null,
  )
  const [allParticipants, setAllParticipants] = useState(
    editingExpense ? editingExpense.participants.length === 0 : true,
  )
  const [selectedParticipants, setSelectedParticipants] = useState<
    Set<MemberId>
  >(() => new Set(editingExpense?.participants ?? []))

  const calculator = useCalculator(editingExpense?.amount ?? 0)

  const handleSubmit = () => {
    if (!paidBy || calculator.numericValue <= 0) return

    const participants = allParticipants ? [] : Array.from(selectedParticipants)

    if (isEditing && editingExpense) {
      updateExpense(editingExpense.id, {
        name: name || '会計',
        amount: calculator.numericValue,
        paidBy,
        participants,
      })
    } else {
      addExpense({
        name: name || '会計',
        amount: calculator.numericValue,
        paidBy,
        participants,
      })
    }

    onClose()
  }

  const toggleParticipant = (memberId: MemberId) => {
    setSelectedParticipants((prev) => {
      const next = new Set(prev)
      if (next.has(memberId)) {
        next.delete(memberId)
      } else {
        next.add(memberId)
      }
      return next
    })
  }

  const isValid =
    paidBy &&
    calculator.numericValue > 0 &&
    (allParticipants || selectedParticipants.size > 0)

  return (
    <>
      <Sheet.Header>
        <Sheet.Title>{isEditing ? '会計を編集' : '会計を追加'}</Sheet.Title>
      </Sheet.Header>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="expense-name"
            className="mb-2 block text-sm font-medium text-foreground-muted"
          >
            名前
          </label>
          <Input
            id="expense-name"
            value={name}
            onChange={setName}
            placeholder="1次会"
          />
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-foreground-muted">
            金額
          </span>
          <div className="mb-4 rounded-xl bg-surface-elevated p-4 text-right text-3xl font-bold text-foreground">
            {formatAmount(calculator.numericValue, currency)}
          </div>
          <CalculatorKeypad onKeyPress={calculator.handleKey} />
        </div>

        {members.length > 0 && (
          <div>
            <span className="mb-2 block text-sm font-medium text-foreground-muted">
              立て替えた人
            </span>
            <RadioGroup
              name="paidBy"
              value={paidBy ?? ''}
              options={members.map((m) => ({ value: m.id, label: m.name }))}
              onChange={(value) => setPaidBy(value as MemberId)}
            />
          </div>
        )}

        {members.length > 1 && (
          <div>
            <span className="mb-2 block text-sm font-medium text-foreground-muted">
              参加者
            </span>
            <div className="space-y-2">
              <Checkbox
                label="全員"
                checked={allParticipants}
                onChange={setAllParticipants}
              />
              {!allParticipants && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {members.map((member) => (
                    <Checkbox
                      key={member.id}
                      label={member.name}
                      checked={selectedParticipants.has(member.id)}
                      onChange={() => toggleParticipant(member.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <Button className="w-full" onClick={handleSubmit} disabled={!isValid}>
          {isEditing ? '更新する' : '追加する'}
        </Button>
      </div>
    </>
  )
}
