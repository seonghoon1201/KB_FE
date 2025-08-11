// src/stores/rank.js
import { defineStore } from 'pinia'

function normalizeRankName(name) {
  // 예: '1순위', '2순위', '예비순위', '무순위' 등
  if (!name) return { name: '기타', priority: 999 }
  const m = String(name).match(/^(\d+)\s*순위/)
  if (m) {
    const n = Number(m[1])
    return { name: `${n}순위`, priority: n } // 숫자 작을수록 높은 순위
  }
  // 숫자가 없는 경우는 후순위로 밀기
  const lowered = String(name).trim()
  const fallbackPriorityMap = {
    '예비순위': 100,
    '무순위': 200,
    '해당없음': 500,
  }
  const priority = fallbackPriorityMap[lowered] ?? 999
  return { name: lowered, priority }
}

function computeBestRank(rankByAreaObj) {
  // rankByAreaObj: { '59㎡': '1순위', '74㎡': '2순위', ... }
  const counts = new Map() // key: 순위명, value: { cnt, priority }
  for (const [, name] of Object.entries(rankByAreaObj || {})) {
    const norm = normalizeRankName(name)
    const current = counts.get(norm.name) || { cnt: 0, priority: norm.priority }
    counts.set(norm.name, { cnt: current.cnt + 1, priority: norm.priority })
  }
  if (counts.size === 0) return { bestRankName: null, bestPriority: null, counts: {}, areasByRank: {} }

  // 동률이면 priority(숫자 작은 것이 더 높은 순위)로 승부
  let bestRankName = null
  let best = { cnt: -1, priority: 9999 }

  for (const [name, stat] of counts.entries()) {
    if (stat.cnt > best.cnt) {
      bestRankName = name
      best = stat
    } else if (stat.cnt === best.cnt && stat.priority < best.priority) {
      bestRankName = name
      best = stat
    }
  }

  // areasByRank: 각 순위에 해당하는 면적 목록
  const areasByRank = {}
  Object.entries(rankByAreaObj).forEach(([area, name]) => {
    const norm = normalizeRankName(name).name
    if (!areasByRank[norm]) areasByRank[norm] = []
    areasByRank[norm].push(area)
  })

  // counts를 일반 객체로
  const countsObj = {}
  for (const [name, { cnt }] of counts.entries()) countsObj[name] = cnt

  return {
    bestRankName,
    bestPriority: best.priority,
    counts: countsObj,
    areasByRank,
  }
}

export const useRankStore = defineStore('rank', {
  state: () => ({
    // 공고번호별 데이터 보관
    // byPblancNo[pblancNo] = {
    //   rankByArea: { '59㎡': '1순위', ... },
    //   best: { bestRankName, bestPriority, counts, areasByRank },
    //   updatedAt: ISO string
    // }
    byPblancNo: {}
  }),
  actions: {
    loadFromLocal(pblancNo) {
      const raw = localStorage.getItem(`rank:${pblancNo}`)
      if (!raw) return
      try {
        const parsed = JSON.parse(raw)
        this.byPblancNo[pblancNo] = parsed
      } catch {
        localStorage.removeItem(`rank:${pblancNo}`)
      }
    },
    saveToLocal(pblancNo) {
      const data = this.byPblancNo[pblancNo]
      if (!data) return
      localStorage.setItem(`rank:${pblancNo}`, JSON.stringify(data))
    },
    setRankByArea(pblancNo, rankByAreaObj) {
      const best = computeBestRank(rankByAreaObj)
      this.byPblancNo[pblancNo] = {
        rankByArea: rankByAreaObj,
        best,
        updatedAt: new Date().toISOString()
      }
      this.saveToLocal(pblancNo)
    },
    resetRank(pblancNo) {
      delete this.byPblancNo[pblancNo]
      localStorage.removeItem(`rank:${pblancNo}`)
    },
    // 당첨 확률 계산용으로 보낼 "대표 순위" 리턴
    getBestRank(pblancNo) {
      const rec = this.byPblancNo[pblancNo]
      return rec?.best?.bestRankName ?? null
    },
    // 디버깅/리포트용
    getSummary(pblancNo) {
      const rec = this.byPblancNo[pblancNo]
      if (!rec) return null
      return {
        bestRankName: rec.best.bestRankName,
        counts: rec.best.counts,
        areasByRank: rec.best.areasByRank,
        updatedAt: rec.updatedAt
      }
    }
  }
})
