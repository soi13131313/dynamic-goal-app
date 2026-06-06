import { useState, useEffect } from 'react'
import { LoginView } from './views/LoginView'
import { GoalSettingView } from './views/GoalSettingView'
import { DashboardView } from './views/DashboardView'
import type { BabyStep } from './types'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentView, setCurrentView] = useState<'dashboard' | 'set-goal'>('set-goal')
  const [vision, setVision] = useState('')
  const [hasGoal, setHasGoal] = useState(false)
  const [loginDays, setLoginDays] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

  const [steps, setSteps] = useState<BabyStep[]>([
    { id: 1, text: '', completed: false },
    { id: 2, text: '', completed: false },
    { id: 3, text: '', completed: false },
  ])

  useEffect(() => {
    const savedVision = localStorage.getItem('v2_vision')
    const savedSteps = localStorage.getItem('v2_steps')
    const savedLastLoginDate = localStorage.getItem('v2_last_login_date')
    const savedLoginDays = localStorage.getItem('v2_login_days')

    if (savedVision) {
      setVision(savedVision)
      setHasGoal(true)
      setCurrentView('dashboard')

      const todayStr = new Date().toDateString()
      let currentDays = savedLoginDays ? parseInt(savedLoginDays, 10) : 1

      if (savedLastLoginDate && savedLastLoginDate !== todayStr) {
        currentDays += 1
        localStorage.setItem('v2_login_days', currentDays.toString())
      }

      localStorage.setItem('v2_last_login_date', todayStr)
      setLoginDays(currentDays)
    }

    if (savedSteps) setSteps(JSON.parse(savedSteps))
  }, [])

  const handleLoginAuth = (email: string, inputPassword: string): boolean => {
    const savedPassword = localStorage.getItem('app_user_password')

    if (!savedPassword) {
      localStorage.setItem('app_user_password', inputPassword)
      localStorage.setItem('app_user_email', email)
      setIsLoggedIn(true)
      return true
    }

    if (savedPassword === inputPassword) {
      setIsLoggedIn(true)
      return true
    }

    return false
  }

  const handleSuggestAISteps = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vision }),
      })

      if (!response.ok) throw new Error('Gemini通信に失敗しました')

      const data = await response.json()
      const aiText: string = data.text || ''

      const rawSteps = aiText.includes(',')
        ? aiText.split(',').map((str) => str.trim()).filter(Boolean)
        : aiText
            .split('\n')
            .map((str) => str.replace(/^[-*0-9.\s]+/, '').trim())
            .filter(Boolean)

      const updatedSteps: BabyStep[] = [
        { id: 1, text: rawSteps[0] || '目標に関係する作業を15分進める', completed: false },
        { id: 2, text: rawSteps[1] || '今日の成果を3行で記録する', completed: false },
        { id: 3, text: rawSteps[2] || '明日続けるための準備を1つ済ませる', completed: false },
      ]

      setSteps(updatedSteps)
      localStorage.setItem('v2_steps', JSON.stringify(updatedSteps))
      alert('AIが今日の行動プランを作成しました')
    } catch (err) {
      console.error('AIエラー詳細:', err)

      const lowerVision = vision.toLowerCase()
      const isEnglish = lowerVision.includes('英語') || lowerVision.includes('英会話') || lowerVision.includes('english')
      const isTech = lowerVision.includes('プログラミング') || lowerVision.includes('コード') || lowerVision.includes('エンジニア') || lowerVision.includes('開発')

      let fallback = ['本や関連サイトを15分読む', '今日やるべきことをノートに3行書く', '次に進める作業を1つ準備する']

      if (isEnglish && isTech) {
        fallback = ['海外の技術ドキュメントを1ページ読む', '知らない技術英単語を10個メモする', '読んだ内容を英語で3文にまとめる']
      } else if (isEnglish) {
        fallback = ['英語アプリで15分学習する', '英単語を10個ノートに書く', '短い英文を声に出して録音する']
      } else if (isTech) {
        fallback = ['エディタを開いてコードを1ファイル編集する', '解説サイトのコードを1つ写して動かす', '作りたい機能を3行でメモする']
      }

      const backupSteps: BabyStep[] = [
        { id: 1, text: fallback[0], completed: false },
        { id: 2, text: fallback[1], completed: false },
        { id: 3, text: fallback[2], completed: false },
      ]

      setSteps(backupSteps)
      localStorage.setItem('v2_steps', JSON.stringify(backupSteps))
      alert('通信に失敗したため、バックアップの行動プランを作成しました')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveGoal = (visionText: string) => {
    const todayStr = new Date().toDateString()

    localStorage.setItem('v2_vision', visionText)
    localStorage.setItem('v2_login_days', '1')
    localStorage.setItem('v2_last_login_date', todayStr)

    setVision(visionText)
    setLoginDays(1)
    setHasGoal(true)
    setCurrentView('dashboard')
  }

  const handleStepTextChange = (id: number, text: string) => {
    const updated = steps.map((step) => (step.id === id ? { ...step, text } : step))
    setSteps(updated)
    localStorage.setItem('v2_steps', JSON.stringify(updated))
  }

  const handleToggleComplete = (id: number) => {
    const updated = steps.map((step) => (step.id === id ? { ...step, completed: !step.completed } : step))
    setSteps(updated)
    localStorage.setItem('v2_steps', JSON.stringify(updated))
  }

  const handleResetGoal = () => {
    if (window.confirm('パスワードを含むすべてのデータを初期化して、新しいアカウントを作りますか？')) {
      localStorage.clear()
      setVision('')
      setHasGoal(false)
      setSteps([
        { id: 1, text: '', completed: false },
        { id: 2, text: '', completed: false },
        { id: 3, text: '', completed: false },
      ])
      setIsLoggedIn(false)
      setCurrentView('set-goal')
      setIsMenuOpen(false)
      window.location.reload()
    }
  }

  if (!isLoggedIn) {
    return <LoginView onLogin={handleLoginAuth} />
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans relative">
      {loading && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex items-center justify-center z-[80]">
          <div className="bg-white px-8 py-5 rounded-2xl shadow-2xl border border-slate-100">
            <p className="text-sm font-black text-indigo-900 m-0 tracking-wide animate-pulse">
              AIが目標を分析中...
            </p>
          </div>
        </div>
      )}

      <header className="w-full px-4 sm:px-6 py-4 bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
  <button
    type="button"
    onClick={() => setIsMenuOpen(true)}
    className="font-black text-2xl tracking-tight bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent border-none cursor-pointer p-0"
    aria-label="メニューを開く"
  >
    STEPLY
  </button>
</header>

      {isMenuOpen && (
        <>
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/30 border-none z-[70] cursor-default"
            aria-label="メニューを閉じる"
          />

          <aside className="fixed top-0 right-0 h-screen w-72 max-w-[82vw] bg-white z-[80] shadow-2xl border-l border-slate-100">
            <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
              <p className="m-0 text-sm font-black text-slate-800">メニュー</p>

              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 border-none cursor-pointer text-xl font-black hover:bg-slate-200 transition-all"
                aria-label="メニューを閉じる"
              >
                ×
              </button>
            </div>

            <div className="flex flex-col py-3">
              {hasGoal && (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView(currentView === 'dashboard' ? 'set-goal' : 'dashboard')
                    setIsMenuOpen(false)
                  }}
                  className="text-left text-sm font-bold px-5 py-4 text-slate-700 hover:bg-slate-50 border-none bg-transparent cursor-pointer"
                >
                  {currentView === 'dashboard' ? '目標確認' : '今日の行動'}
                </button>
              )}

              <button
                type="button"
                onClick={handleResetGoal}
                className="text-left text-sm font-bold px-5 py-4 text-amber-600 hover:bg-amber-50 border-none bg-transparent cursor-pointer"
              >
                完全リセット
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsLoggedIn(false)
                  setIsMenuOpen(false)
                }}
                className="text-left text-sm font-bold px-5 py-4 text-rose-600 hover:bg-rose-50 border-none bg-transparent cursor-pointer"
              >
                ログアウト
              </button>
            </div>
          </aside>
        </>
      )}

      <main className="w-full px-3 sm:px-5 lg:px-8 py-4 sm:py-6">
        <div className="w-full max-w-6xl mx-auto">
          {currentView === 'set-goal' ? (
            <GoalSettingView onSave={handleSaveGoal} />
          ) : (
            <DashboardView
              vision={vision}
              steps={steps}
              loginDays={loginDays}
              onSuggestAISteps={handleSuggestAISteps}
              onStepTextChange={handleStepTextChange}
              onToggleComplete={handleToggleComplete}
            />
          )}
        </div>
      </main>
    </div>
  )
}