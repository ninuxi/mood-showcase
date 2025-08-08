// src/stores/moodStore.ts
import { create } from 'zustand'

// Types
export interface MoodData {
  name: string
  energy: number
  valence: number
  arousal: number
  color: string
  description: string
  lastUpdated: Date
}

export interface SoftwareConnection {
  name: string
  type: 'OSC' | 'MIDI' | 'ArtNet'
  status: 'connected' | 'disconnected' | 'error'
  ip?: string
  port?: number
  lastPing?: Date
}

export interface EnvironmentData {
  peopleCount: number
  avgMovement: number
  audioLevel: number
  lightLevel: number
  temperature: number
  timestamp: Date
}

export interface MoodRule {
  id: string
  name: string
  conditions: {
    peopleCount?: { min: number; max: number }
    movement?: { min: number; max: number }
    audioLevel?: { min: number; max: number }
    timeOfDay?: { start: string; end: string }
  }
  targetMood: string
  priority: number
  enabled: boolean
}

export interface AnalyticsData {
  visitors: number
  avgStayTime: number
  peakOccupancy: number
  engagementScore: number
  moodDistribution: Record<string, number>
  hourlyData: Array<{
    hour: number
    visitors: number
    engagement: number
    dominantMood: string
  }>
}

// Store interface
interface MoodStore {
  // System state
  systemActive: boolean
  isConnected: boolean
  
  // Current mood
  currentMood: MoodData
  availableMoods: MoodData[]
  
  // Environment data
  environmentData: EnvironmentData
  
  // Software connections
  softwareConnections: SoftwareConnection[]
  
  // Mood programming
  moodRules: MoodRule[]
  
  // Analytics
  analyticsData: AnalyticsData
  
  // Actions
  setSystemActive: (active: boolean) => void
  setCurrentMood: (mood: MoodData) => void
  updateEnvironmentData: (data: Partial<EnvironmentData>) => void
  updateSoftwareConnection: (name: string, status: SoftwareConnection['status']) => void
  addMoodRule: (rule: MoodRule) => void
  removeMoodRule: (id: string) => void
  updateMoodRule: (id: string, updates: Partial<MoodRule>) => void
  
  // Simulation functions
  startSimulation: () => void
  stopSimulation: () => void
}

// Default data
const defaultMoods: MoodData[] = [
  {
    name: 'Energetic',
    energy: 0.9,
    valence: 0.8,
    arousal: 0.9,
    color: '#EF4444',
    description: 'High energy and excitement',
    lastUpdated: new Date()
  },
  {
    name: 'Contemplative',
    energy: 0.3,
    valence: 0.6,
    arousal: 0.2,
    color: '#8B5CF6',
    description: 'Quiet reflection and thoughtful observation',
    lastUpdated: new Date()
  },
  {
    name: 'Social',
    energy: 0.7,
    valence: 0.9,
    arousal: 0.6,
    color: '#10B981',
    description: 'Interactive and collaborative atmosphere',
    lastUpdated: new Date()
  },
  {
    name: 'Mysterious',
    energy: 0.5,
    valence: 0.3,
    arousal: 0.7,
    color: '#6366F1',
    description: 'Intriguing and thought-provoking',
    lastUpdated: new Date()
  },
  {
    name: 'Peaceful',
    energy: 0.2,
    valence: 0.8,
    arousal: 0.1,
    color: '#06B6D4',
    description: 'Calm and serene environment',
    lastUpdated: new Date()
  }
]

const defaultSoftwareConnections: SoftwareConnection[] = [
  {
    name: 'QLab',
    type: 'OSC',
    status: 'connected',
    ip: '192.168.1.100',
    port: 53000,
    lastPing: new Date()
  },
  {
    name: 'Resolume Arena',
    type: 'OSC',
    status: 'connected',
    ip: '192.168.1.101',
    port: 7000,
    lastPing: new Date()
  },
  {
    name: 'Chamsys MagicQ',
    type: 'ArtNet',
    status: 'disconnected',
    ip: '192.168.1.102',
    lastPing: new Date(Date.now() - 30000)
  }
]

let simulationInterval: NodeJS.Timeout | null = null

// Create store
export const useMoodStore = create<MoodStore>((set, get) => ({
  // Initial state
  systemActive: false,
  isConnected: true,
  
  currentMood: defaultMoods[1], // Start with Contemplative
  availableMoods: defaultMoods,
  
  environmentData: {
    peopleCount: 12,
    avgMovement: 0.4,
    audioLevel: 0.25,
    lightLevel: 0.7,
    temperature: 22,
    timestamp: new Date()
  },
  
  softwareConnections: defaultSoftwareConnections,
  
  moodRules: [
    {
      id: '1',
      name: 'High Energy Crowds',
      conditions: {
        peopleCount: { min: 20, max: 100 },
        movement: { min: 0.7, max: 1.0 }
      },
      targetMood: 'Energetic',
      priority: 10,
      enabled: true
    },
    {
      id: '2',
      name: 'Quiet Hours',
      conditions: {
        peopleCount: { min: 1, max: 5 },
        timeOfDay: { start: '09:00', end: '11:00' }
      },
      targetMood: 'Peaceful',
      priority: 8,
      enabled: true
    },
    {
      id: '3',
      name: 'Social Gatherings',
      conditions: {
        peopleCount: { min: 10, max: 25 },
        audioLevel: { min: 0.4, max: 0.8 }
      },
      targetMood: 'Social',
      priority: 7,
      enabled: true
    }
  ],
  
  analyticsData: {
    visitors: 247,
    avgStayTime: 18.5,
    peakOccupancy: 34,
    engagementScore: 78,
    moodDistribution: {
      'Contemplative': 35,
      'Social': 28,
      'Peaceful': 20,
      'Energetic': 12,
      'Mysterious': 5
    },
    hourlyData: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      visitors: Math.floor(Math.random() * 30) + 5,
      engagement: Math.floor(Math.random() * 40) + 60,
      dominantMood: defaultMoods[Math.floor(Math.random() * defaultMoods.length)].name
    }))
  },
  
  // Actions
  setSystemActive: (active) => {
    set({ systemActive: active })
    if (active) {
      get().startSimulation()
    } else {
      get().stopSimulation()
    }
  },
  
  setCurrentMood: (mood) => {
    set({ 
      currentMood: { 
        ...mood, 
        lastUpdated: new Date() 
      } 
    })
  },
  
  updateEnvironmentData: (data) => {
    set(state => ({
      environmentData: {
        ...state.environmentData,
        ...data,
        timestamp: new Date()
      }
    }))
  },
  
  updateSoftwareConnection: (name, status) => {
    set(state => ({
      softwareConnections: state.softwareConnections.map(conn =>
        conn.name === name
          ? { ...conn, status, lastPing: new Date() }
          : conn
      )
    }))
  },
  
  addMoodRule: (rule) => {
    set(state => ({
      moodRules: [...state.moodRules, rule]
    }))
  },
  
  removeMoodRule: (id) => {
    set(state => ({
      moodRules: state.moodRules.filter(rule => rule.id !== id)
    }))
  },
  
  updateMoodRule: (id, updates) => {
    set(state => ({
      moodRules: state.moodRules.map(rule =>
        rule.id === id ? { ...rule, ...updates } : rule
      )
    }))
  },
  
  // Simulation functions
  startSimulation: () => {
    if (simulationInterval) return
    
    simulationInterval = setInterval(() => {
      const state = get()
      if (!state.systemActive) return
      
      // Simulate environment changes
      const newEnvironmentData = {
        peopleCount: Math.max(1, state.environmentData.peopleCount + Math.floor((Math.random() - 0.5) * 4)),
        avgMovement: Math.max(0, Math.min(1, state.environmentData.avgMovement + (Math.random() - 0.5) * 0.2)),
        audioLevel: Math.max(0, Math.min(1, state.environmentData.audioLevel + (Math.random() - 0.5) * 0.1)),
        lightLevel: Math.max(0, Math.min(1, state.environmentData.lightLevel + (Math.random() - 0.5) * 0.05))
      }
      
      state.updateEnvironmentData(newEnvironmentData)
      
      // AI Mood Selection Logic
      const evaluateRules = () => {
        const activeRules = state.moodRules
          .filter(rule => rule.enabled)
          .sort((a, b) => b.priority - a.priority)
        
        for (const rule of activeRules) {
          let matches = true
          
          // Check people count condition
          if (rule.conditions.peopleCount) {
            const { min, max } = rule.conditions.peopleCount
            if (newEnvironmentData.peopleCount < min || newEnvironmentData.peopleCount > max) {
              matches = false
            }
          }
          
          // Check movement condition
          if (rule.conditions.movement && matches) {
            const { min, max } = rule.conditions.movement
            if (newEnvironmentData.avgMovement < min || newEnvironmentData.avgMovement > max) {
              matches = false
            }
          }
          
          // Check audio level condition
          if (rule.conditions.audioLevel && matches) {
            const { min, max } = rule.conditions.audioLevel
            if (newEnvironmentData.audioLevel < min || newEnvironmentData.audioLevel > max) {
              matches = false
            }
          }
          
          // Check time condition
          if (rule.conditions.timeOfDay && matches) {
            const now = new Date()
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
            const { start, end } = rule.conditions.timeOfDay
            if (currentTime < start || currentTime > end) {
              matches = false
            }
          }
          
          if (matches) {
            const targetMood = state.availableMoods.find(m => m.name === rule.targetMood)
            if (targetMood && targetMood.name !== state.currentMood.name) {
              state.setCurrentMood(targetMood)
              console.log(`🧠 AI Decision: Switched to ${targetMood.name} mood (Rule: ${rule.name})`)
            }
            return
          }
        }
        
        // Default fallback behavior if no rules match
        if (Math.random() < 0.1) { // 10% chance to randomly change mood
          const randomMood = state.availableMoods[Math.floor(Math.random() * state.availableMoods.length)]
          if (randomMood.name !== state.currentMood.name) {
            state.setCurrentMood(randomMood)
            console.log(`🎲 Random mood change: ${randomMood.name}`)
          }
        }
      }
      
      evaluateRules()
      
      // Simulate occasional software connection issues
      if (Math.random() < 0.02) { // 2% chance
        const connections = state.softwareConnections
        const connectedOnes = connections.filter(c => c.status === 'connected')
        if (connectedOnes.length > 0) {
          const randomConn = connectedOnes[Math.floor(Math.random() * connectedOnes.length)]
          state.updateSoftwareConnection(randomConn.name, 'error')
          
          // Auto-recover after 5 seconds
          setTimeout(() => {
            state.updateSoftwareConnection(randomConn.name, 'connected')
          }, 5000)
        }
      }
      
    }, 3000) // Update every 3 seconds
  },
  
  stopSimulation: () => {
    if (simulationInterval) {
      clearInterval(simulationInterval)
      simulationInterval = null
    }
  }
}))

// Selectors for optimized re-renders
export const useCurrentMood = () => useMoodStore(state => state.currentMood)
export const useSystemActive = () => useMoodStore(state => state.systemActive)
export const useEnvironmentData = () => useMoodStore(state => state.environmentData)
export const useSoftwareConnections = () => useMoodStore(state => state.softwareConnections)
export const useMoodRules = () => useMoodStore(state => state.moodRules)
export const useAnalyticsData = () => useMoodStore(state => state.analyticsData)