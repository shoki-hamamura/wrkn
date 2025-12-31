import { z } from 'zod/v4'
import {
  MAX_BIAS,
  MAX_EXPENSE_NAME_LENGTH,
  MAX_EXPENSES,
  MAX_GROUP_COUNT,
  MAX_GROUP_NAME_LENGTH,
  MAX_GROUPS,
  MAX_MEMBER_NAME_LENGTH,
  MAX_MEMBERS,
  MAX_SESSION_NAME_LENGTH,
  MAX_SESSIONS,
  MIN_BIAS,
  MIN_GROUP_COUNT,
} from '@/shared/constants'

const MemberIdSchema = z.string().uuid()
const ExpenseIdSchema = z.string().uuid()
const GroupIdSchema = z.string().uuid()
const SessionIdSchema = z.string().uuid()

const MemberSchema = z.object({
  id: MemberIdSchema,
  name: z.string().min(1).max(MAX_MEMBER_NAME_LENGTH),
  bias: z.number().min(MIN_BIAS).max(MAX_BIAS),
})

const ExpenseSchema = z.object({
  id: ExpenseIdSchema,
  name: z.string().max(MAX_EXPENSE_NAME_LENGTH),
  amount: z.number().nonnegative(),
  paidBy: MemberIdSchema,
  participants: z.array(MemberIdSchema),
  createdAt: z.number().nonnegative(),
})

const ParticipantGroupSchema = z.object({
  id: GroupIdSchema,
  name: z.string().min(1).max(MAX_GROUP_NAME_LENGTH),
  count: z.number().int().min(MIN_GROUP_COUNT).max(MAX_GROUP_COUNT),
  bias: z.number().min(MIN_BIAS).max(MAX_BIAS),
})

const CurrencyCodeSchema = z.enum([
  'JPY',
  'USD',
  'EUR',
  'GBP',
  'CNY',
  'KRW',
  'TWD',
])

const RoundingUnitSchema = z.union([
  z.literal(1),
  z.literal(10),
  z.literal(100),
])

const SettingsSchema = z.object({
  currency: CurrencyCodeSchema,
  roundingUnit: RoundingUnitSchema,
})

const SessionSchema = z.object({
  id: SessionIdSchema,
  name: z.string().min(1).max(MAX_SESSION_NAME_LENGTH),
  members: z.array(MemberSchema).max(MAX_MEMBERS),
  groups: z.array(ParticipantGroupSchema).max(MAX_GROUPS),
  expenses: z.array(ExpenseSchema).max(MAX_EXPENSES),
  settings: SettingsSchema,
  createdAt: z.number().nonnegative(),
  updatedAt: z.number().nonnegative(),
})

export const WarikanStateSchema = z.object({
  sessions: z.array(SessionSchema).min(1).max(MAX_SESSIONS),
  currentSessionId: SessionIdSchema.nullable(),
})

export type ValidatedWarikanState = z.infer<typeof WarikanStateSchema>

export function validateWarikanState(
  data: unknown,
): ValidatedWarikanState | null {
  const result = WarikanStateSchema.safeParse(data)
  if (result.success) {
    return result.data
  }
  console.error('[Warikan] Invalid stored data:', result.error.format())
  return null
}
