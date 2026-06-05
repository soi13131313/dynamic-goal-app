import React, { useState } from 'react'
import { Button } from '../components/ui/Button'

interface GoalSettingViewProps {
  onSave: (visionText: string) => void
}

export const GoalSettingView: React.FC<GoalSettingViewProps> = ({ onSave }) => {
  const [vision, setVision] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!vision.trim()) return
    onSave(vision)
  }

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100 border border-slate-100 max-w-2xl mx-auto mt-8 font-sans">
      <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">🎯 なりたい自分を定義する</h2>
      <p className="text-sm text-slate-500 mt-2 mb-6 font-medium">理想の姿を、具体的につぶやいてみてください。</p>
      
      {/* 💡 flex-col を指定して、中の要素が必ず「上から下へ」縦並びになるように強制します */}
      <form onSubmit={handleSubmit} className="flex flex-col w-full gap-5">
        
        {/* 📋 1行目：特大サイズの記入欄 */}
        <div className="w-full">
          <textarea
            rows={6} 
            required 
            onChange={(e) => setVision(e.target.value)}
            placeholder="例: 英語を不自由なく話せて、海外のエンジニアと自信を持ってディスカッションしている自分。そのために毎日プログラミングの学習を継続し、世界で活躍できるスキルを身につける！"
            className="w-full rounded-2xl border border-slate-200 p-5 text-base text-slate-800 bg-slate-50/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none min-h-[12rem] placeholder-slate-400 leading-relaxed box-border"
          />
        </div>

        {/* 📋 2行目：記入欄の「真下」に横幅いっぱいで配置されるボタン */}
        <div className="w-full">
          <Button type="submit" className="w-full py-4 text-base font-bold tracking-wider block">
            この姿を目指してスタートする
          </Button>
        </div>

      </form>
    </section>
  )
}
