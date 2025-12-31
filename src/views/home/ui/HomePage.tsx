import { ExpenseList } from '@/widgets/expense-list'
import { GroupList } from '@/widgets/group-list'
import { MemberList } from '@/widgets/member-list'
import { HeaderActions } from './HeaderActions'
import { SettlementButton } from './SettlementButton'

export function HomePage() {
  return (
    <div className="mx-auto min-h-screen max-w-lg bg-background px-4 py-6">
      <header className="relative mb-8 hidden items-center justify-center lg:flex">
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 shadow-md">
            <span className="text-2xl font-bold text-white">¥</span>
          </div>
          <h1 className="text-3xl font-black italic text-foreground">
            なかよしわりかん
          </h1>
        </div>
        <div className="absolute right-0 top-0 flex items-center gap-1">
          <HeaderActions />
        </div>
      </header>

      <div className="mb-4 flex justify-end gap-1 lg:hidden">
        <HeaderActions />
      </div>

      <main className="space-y-8">
        <MemberList />
        <GroupList />
        <ExpenseList />
        <SettlementButton />
      </main>
    </div>
  )
}
