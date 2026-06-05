export interface Goal {
  id: string
  userId: string
  visionText: string
  createdAt: string
}

export interface BabyStep {
  id: number
  text: string
  completed: boolean
}
