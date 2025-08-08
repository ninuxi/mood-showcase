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