import React, { useState } from 'react'
import { Button } from '../components/ui/Button'

interface LoginViewProps {
  onLogin: (email: string, password: string) => boolean
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isNewAccount, setIsNewAccount] = useState(false)

  React.useEffect(() => {
    const savedPassword = localStorage.getItem('app_user_password')
    if (!savedPassword) {
      setIsNewAccount(true)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.includes('@')) {
      setError('有効なメールアドレスを入力してください。')
      return
    }
    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください。')
      return
    }

    const success = onLogin(email, password)
    if (!success) {
      setError('登録されているパスワードと一致しません。')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-slate-100 via-blue-50 to-indigo-50 p-4 font-sans">
      <main className="w-full max-w-md rounded-3xl bg-white/80 p-8 shadow-2xl border border-white backdrop-blur-md">
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-3xl shadow-xl shadow-blue-500/20 mb-4 animate-bounce">
            🚀
          </div>
          {/* 🔥 タイトルロゴを STEPLY に完全変更しました */}
          <h1 className="text-4xl font-black text-slate-900 tracking-tight bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-1">
            STEPLY
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            {isNewAccount ? '💡 初回パスワードを設定して開始' : '🔒 登録したパスワードでログイン'}
          </p>
        </header>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">メールアドレス</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-400"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">パスワード</label>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-400"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-3.5 rounded-xl border border-rose-100">
              ⚠️ {error}
            </p>
          )}

          <Button type="submit" className="w-full py-3 text-base">
            {isNewAccount ? 'パスワードを登録して始める' : 'ログインする'}
          </Button>
        </form>
      </main>
    </div>
  )
}
