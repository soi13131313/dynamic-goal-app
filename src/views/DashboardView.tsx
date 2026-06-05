import React from 'react'
import type { BabyStep } from '../types'

interface DashboardViewProps {
  vision: string
  steps: BabyStep[]
  onStepTextChange: (id: number, text: string) => void
  onToggleComplete: (id: number) => void
  onSuggestAISteps: () => void
  loginDays: number
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  vision,
  steps,
  onStepTextChange,
  onToggleComplete,
  onSuggestAISteps,
  loginDays,
}) => {
  const completedCount = steps.filter((step) => step.completed).length
  const progress = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0

  return (
    <div className="flex flex-col gap-5 w-full max-w-5xl mx-auto mt-4 font-sans">
      <article className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 text-9xl font-black text-white/5 select-none pointer-events-none">🎯</div>

        <div className="flex justify-between items-start">
          <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm tracking-wider">MY VISION</span>
          <span className="text-xs font-extrabold bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 px-3 py-1 rounded-full shadow-lg shadow-orange-500/20 animate-pulse">
            🔥 継続 {loginDays} 日目
          </span>
        </div>

        <p className="mt-5 text-lg font-bold leading-relaxed">{vision}</p>
      </article>

      <section className="bg-white rounded-2xl p-5 shadow-xl shadow-slate-100 border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="m-0 text-base font-black text-slate-800">今日の目標達成ゲージ</h3>
          <span className="text-sm font-black text-indigo-600">{progress}%</span>
        </div>

        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              progress === 100
                ? 'bg-gradient-to-r from-emerald-400 to-green-500'
                : 'bg-gradient-to-r from-indigo-500 to-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between items-center mt-3">
          <p className="m-0 text-xs font-bold text-slate-500">
            {completedCount} / {steps.length} タスク完了
          </p>
          <p className="m-0 text-xs font-bold text-slate-500">
            {progress === 100 ? '今日の目標達成！' : 'あと少しずつ進めよう'}
          </p>
        </div>
      </section>

      <div className="bg-gradient-to-br from-indigo-50 via-indigo-100/50 to-blue-50 rounded-2xl p-5 border border-indigo-100 flex flex-col gap-3 shadow-md shadow-indigo-500/5">
        <div className="flex items-center gap-2">
          <span className="text-xl">🧠</span>
          <h3 className="m-0 text-base font-bold text-indigo-900">AIベビーステップ生成</h3>
        </div>

        <p className="m-0 text-xs text-indigo-700 font-medium leading-relaxed">
          AIがあなたの目標を分析し、今日すぐに始められる具体的な行動に分解します。
        </p>

        <button
          type="button"
          onClick={onSuggestAISteps}
          className="w-full p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold text-sm border-none cursor-pointer shadow-lg shadow-indigo-600/10 active:scale-[0.99] transition-all hover:opacity-95"
        >
          ✨ 目標をAIで自動分解する
        </button>
      </div>

      <section className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-100 border border-slate-100">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800 m-0 flex items-center gap-2">📋 今日のベビーステップ</h2>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">毎日3つ限定</span>
        </header>

        <div className="flex flex-col gap-5">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-start gap-4 p-4 rounded-2xl border border-slate-50 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all"
            >
              <button
                type="button"
                onClick={() => onToggleComplete(step.id)}
                disabled={!step.text}
                className={`w-6 h-6 mt-1 rounded-lg border-2 flex items-center justify-center font-black text-xs cursor-pointer transition-all flex-shrink-0 ${
                  step.completed
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-slate-300 bg-white hover:border-indigo-500'
                }`}
              >
                {step.completed ? '✓' : ''}
              </button>

              <textarea
                rows={2}
                value={step.text}
                onChange={(e) => onStepTextChange(step.id, e.target.value)}
                placeholder={`行動 ${index + 1} を入力 (例: 本を1ページ開く)`}
                className={`flex-1 text-sm bg-transparent border-none outline-none font-medium transition-all resize-none leading-relaxed min-h-[3rem] ${
                  step.completed ? 'line-through text-slate-400' : 'text-slate-700'
                }`}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}