'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Brain,
  Sliders,
  BarChart3,
  Settings,
  Play,
  Pause,
  Power,
  Wifi,
  WifiOff,
  Users,
  Volume2,
  Activity,
  TrendingUp,
  Clock,
  Lightbulb,
  Zap,
  CheckCircle,
  Monitor,
  Music,
  AlertTriangle,
  Eye,
  Target,
  PieChart as PieChartIcon
} from 'lucide-react'
import { create } from 'zustand'

// Types
interface MoodData {
  name: string
  energy: number
  valence: number
  arousal: number
  color: string
  description: string
}

interface SoftwareConnection {
  name: string
  type: 'OSC' | 'MIDI' | 'ArtNet'
  status: 'connected' | 'disconnected' | 'error'
  ip?: string
  port?: number
}

interface EnvironmentData {
  peopleCount: number
  avgMovement: number
  audioLevel: number
  lightLevel: number
}

interface MoodStore {
  systemActive: boolean
  isConnected: boolean
  currentMood: MoodData
  availableMoods: MoodData[]
  environmentData: EnvironmentData
  softwareConnections: SoftwareConnection[]
  setSystemActive: (active: boolean) => void
  setCurrentMood: (mood: MoodData) => void
  updateEnvironmentData: (data: Partial<EnvironmentData>) => void
  updateSoftwareConnection: (name: string, status: SoftwareConnection['status']) => void
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
    description: 'High energy and excitement'
  },
  {
    name: 'Contemplative',
    energy: 0.3,
    valence: 0.6,
    arousal: 0.2,
    color: '#8B5CF6',
    description: 'Quiet reflection and thoughtful observation'
  },
  {
    name: 'Social',
    energy: 0.7,
    valence: 0.9,
    arousal: 0.6,
    color: '#10B981',
    description: 'Interactive and collaborative atmosphere'
  },
  {
    name: 'Mysterious',
    energy: 0.5,
    valence: 0.3,
    arousal: 0.7,
    color: '#6366F1',
    description: 'Intriguing and thought-provoking'
  },
  {
    name: 'Peaceful',
    energy: 0.2,
    valence: 0.8,
    arousal: 0.1,
    color: '#06B6D4',
    description: 'Calm and serene environment'
  }
]

const defaultConnections: SoftwareConnection[] = [
  {
    name: 'QLab',
    type: 'OSC',
    status: 'connected',
    ip: '192.168.1.100',
    port: 53000
  },
  {
    name: 'Resolume Arena',
    type: 'OSC',
    status: 'connected',
    ip: '192.168.1.101',
    port: 7000
  },
  {
    name: 'Chamsys MagicQ',
    type: 'ArtNet',
    status: 'disconnected',
    ip: '192.168.1.102'
  }
]

let simulationInterval: NodeJS.Timeout | null = null

// Zustand Store
const useMoodStore = create<MoodStore>((set, get) => ({
  systemActive: false,
  isConnected: true,
  currentMood: defaultMoods[1],
  availableMoods: defaultMoods,
  environmentData: {
    peopleCount: 12,
    avgMovement: 0.4,
    audioLevel: 0.25,
    lightLevel: 0.7
  },
  softwareConnections: defaultConnections,
  
  setSystemActive: (active) => {
    set({ systemActive: active })
    if (active) {
      get().startSimulation()
    } else {
      get().stopSimulation()
    }
  },
  
  setCurrentMood: (mood) => {
    set({ currentMood: mood })
  },
  
  updateEnvironmentData: (data) => {
    set(state => ({
      environmentData: { ...state.environmentData, ...data }
    }))
  },
  
  updateSoftwareConnection: (name, status) => {
    set(state => ({
      softwareConnections: state.softwareConnections.map(conn =>
        conn.name === name ? { ...conn, status } : conn
      )
    }))
  },
  
  startSimulation: () => {
    if (simulationInterval) return
    
    simulationInterval = setInterval(() => {
      const state = get()
      if (!state.systemActive) return
      
      const newData = {
        peopleCount: Math.max(1, state.environmentData.peopleCount + Math.floor((Math.random() - 0.5) * 4)),
        avgMovement: Math.max(0, Math.min(1, state.environmentData.avgMovement + (Math.random() - 0.5) * 0.2)),
        audioLevel: Math.max(0, Math.min(1, state.environmentData.audioLevel + (Math.random() - 0.5) * 0.1)),
        lightLevel: Math.max(0, Math.min(1, state.environmentData.lightLevel + (Math.random() - 0.5) * 0.05))
      }
      
      state.updateEnvironmentData(newData)
      
      if (Math.random() < 0.1) {
        const randomMood = state.availableMoods[Math.floor(Math.random() * state.availableMoods.length)]
        if (randomMood.name !== state.currentMood.name) {
          state.setCurrentMood(randomMood)
        }
      }
    }, 3000)
  },
  
  stopSimulation: () => {
    if (simulationInterval) {
      clearInterval(simulationInterval)
      simulationInterval = null
    }
  }
}))

// Software Status Panel Component
function SoftwareStatusPanel() {
  const { softwareConnections, updateSoftwareConnection } = useMoodStore()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400'
      case 'disconnected': return 'text-slate-400'
      case 'error': return 'text-red-400'
      default: return 'text-slate-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />
      case 'disconnected': return <WifiOff className="w-4 h-4" />
      case 'error': return <AlertTriangle className="w-4 h-4" />
      default: return <WifiOff className="w-4 h-4" />
    }
  }

  const connectedCount = softwareConnections.filter(c => c.status === 'connected').length
  const totalCount = softwareConnections.length

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <Wifi className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Software Status</h2>
          <p className="text-slate-400 text-sm">
            {connectedCount}/{totalCount} systems connected
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {softwareConnections.map((connection) => (
          <div
            key={connection.name}
            className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-slate-300" />
                <h3 className="font-medium text-white text-sm">{connection.name}</h3>
              </div>
              <div className={getStatusColor(connection.status)}>
                {getStatusIcon(connection.status)}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Status</span>
                <span className={`font-medium ${getStatusColor(connection.status)}`}>
                  {connection.status}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Protocol</span>
                <span className="text-slate-300">{connection.type}</span>
              </div>
              
              {connection.ip && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Address</span>
                  <span className="text-slate-300 font-mono">
                    {connection.ip}:{connection.port}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => updateSoftwareConnection(connection.name, 
                connection.status === 'connected' ? 'disconnected' : 'connected'
              )}
              className={`w-full px-3 py-2 rounded text-xs transition-colors ${
                connection.status === 'connected' 
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
              }`}
            >
              {connection.status === 'connected' ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-slate-800/30 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-300 text-sm">Overall System Health</span>
          <span className="text-white font-medium">
            {Math.round((connectedCount / totalCount) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-1000"
            style={{ width: `${(connectedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// Mood Visualizer Component
function MoodVisualizer({ systemActive }: { systemActive: boolean }) {
  const { currentMood, environmentData, availableMoods, setCurrentMood } = useMoodStore()

  const ParameterBar = ({ label, value, color, icon }: {
    label: string
    value: number
    color: string
    icon: React.ReactNode
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded ${color}/20`}>
            {icon}
          </div>
          <span className="text-slate-300 text-sm">{label}</span>
        </div>
        <span className="text-white font-medium text-sm">
          {Math.round(value * 100)}%
        </span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} transition-all duration-800`}
          style={{ width: `${value * 100}%` }}
        />
      </div>
    </div>
  )

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${currentMood.color}20` }}
          >
            <Brain className="w-5 h-5" style={{ color: currentMood.color }} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Mood Analysis</h2>
            <p className="text-slate-400 text-sm">
              {systemActive ? 'AI actively monitoring' : 'System stopped'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div 
            className="text-2xl font-bold"
            style={{ color: currentMood.color }}
          >
            {currentMood.name}
          </div>
          <div className="text-slate-400 text-sm">Current Mood</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="relative">
            <div
              className={`w-32 h-32 rounded-full mx-auto relative overflow-hidden transition-all duration-3000 ${
                systemActive ? 'animate-pulse' : 'opacity-60'
              }`}
              style={{ backgroundColor: `${currentMood.color}20` }}
            >
              <div 
                className="absolute inset-2 rounded-full"
                style={{ backgroundColor: currentMood.color }}
              />
            </div>

            <div className="text-center mt-4">
              <div 
                className="text-xl font-bold"
                style={{ color: currentMood.color }}
              >
                {currentMood.name}
              </div>
              <div className="text-slate-400 text-sm mt-1">
                {currentMood.description}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-medium">Mood Parameters</h3>
            
            <ParameterBar
              label="Energy"
              value={currentMood.energy}
              color="from-red-400 to-orange-400"
              icon={<Zap className="w-3 h-3 text-red-400" />}
            />
            
            <ParameterBar
              label="Valence"
              value={currentMood.valence}
              color="from-green-400 to-blue-400"
              icon={<TrendingUp className="w-3 h-3 text-green-400" />}
            />
            
            <ParameterBar
              label="Arousal"
              value={currentMood.arousal}
              color="from-purple-400 to-pink-400"
              icon={<Activity className="w-3 h-3 text-purple-400" />}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-white font-medium mb-4">Environment Sensors</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className={`bg-slate-800/50 rounded-lg p-3 ${systemActive ? 'animate-pulse' : ''}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-300 text-sm">People</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {environmentData.peopleCount}
                </div>
                <div className="text-slate-400 text-xs">detected</div>
              </div>

              <div className={`bg-slate-800/50 rounded-lg p-3 ${systemActive ? 'animate-pulse' : ''}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span className="text-slate-300 text-sm">Movement</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {Math.round(environmentData.avgMovement * 100)}%
                </div>
                <div className="text-slate-400 text-xs">activity</div>
              </div>

              <div className={`bg-slate-800/50 rounded-lg p-3 ${systemActive ? 'animate-pulse' : ''}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Volume2 className="w-4 h-4 text-yellow-400" />
                  <span className="text-slate-300 text-sm">Audio</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {Math.round(environmentData.audioLevel * 100)}%
                </div>
                <div className="text-slate-400 text-xs">volume</div>
              </div>

              <div className={`bg-slate-800/50 rounded-lg p-3 ${systemActive ? 'animate-pulse' : ''}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-300 text-sm">Light</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {Math.round(environmentData.lightLevel * 100)}%
                </div>
                <div className="text-slate-400 text-xs">ambient</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4">Quick Mood Override</h3>
            <div className="space-y-2">
              {availableMoods.map((mood) => (
                <button
                  key={mood.name}
                  onClick={() => setCurrentMood(mood)}
                  className={`relative p-3 rounded-lg border transition-all w-full hover:scale-105 ${
                    mood.name === currentMood.name 
                      ? 'border-white/40 bg-white/10' 
                      : 'border-slate-600 hover:border-slate-500 hover:bg-white/5'
                  }`}
                  style={{ 
                    borderColor: mood.name === currentMood.name ? mood.color : undefined 
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: mood.color }}
                    />
                    <div className="text-left">
                      <div className="text-white font-medium text-sm">{mood.name}</div>
                      <div className="text-slate-400 text-xs">{mood.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {systemActive && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="animate-spin">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-white font-medium text-sm">AI Mood Engine Active</div>
              <div className="text-slate-400 text-xs">
                Analyzing environment and applying mood rules every 3 seconds
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Analytics Panel
function AnalyticsPanel() {
  const analyticsData = {
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
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
        <p className="text-slate-400">Performance insights and audience data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Visitors</p>
              <p className="text-2xl font-bold text-white mt-1">{analyticsData.visitors}</p>
              <p className="text-sm mt-1 text-green-400">+12% from yesterday</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm">Avg Stay Time</p>
              <p className="text-2xl font-bold text-white mt-1">{analyticsData.avgStayTime}min</p>
              <p className="text-sm mt-1 text-green-400">+8% from yesterday</p>
            </div>
            <div className="p-2 rounded-lg bg-green-500/20">
              <Clock className="w-5 h-5 text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm">Peak Occupancy</p>
              <p className="text-2xl font-bold text-white mt-1">{analyticsData.peakOccupancy}</p>
              <p className="text-sm mt-1 text-green-400">+15% from yesterday</p>
            </div>
            <div className="p-2 rounded-lg bg-purple-500/20">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 text-sm">Engagement Score</p>
              <p className="text-2xl font-bold text-white mt-1">{analyticsData.engagementScore}%</p>
              <p className="text-sm mt-1 text-green-400">+3% from yesterday</p>
            </div>
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <Target className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <PieChartIcon className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Mood Distribution</h3>
          </div>
          
          <div className="space-y-3">
            {Object.entries(analyticsData.moodDistribution).map(([mood, percentage]) => (
              <div key={mood} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: defaultMoods.find(m => m.name === mood)?.color || '#6B7280' }}
                  />
                  <span className="text-slate-300 text-sm">{mood}</span>
                </div>
                <span className="text-white font-medium text-sm">{percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Eye className="w-5 h-5 text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Key Insights</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-medium text-sm">Peak Performance</span>
              </div>
              <p className="text-slate-300 text-xs">
                Engagement peaks during 'Social' mood periods, especially 2-4 PM
              </p>
            </div>

            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 font-medium text-sm">Audience Behavior</span>
              </div>
              <p className="text-slate-300 text-xs">
                Groups of 10-15 people show highest interaction rates
              </p>
            </div>

            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 font-medium text-sm">AI Optimization</span>
              </div>
              <p className="text-slate-300 text-xs">
                Mood transitions reduced visitor drop-off by 23%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Dashboard Component
export default function MOODDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'programmer' | 'control' | 'analytics' | 'settings'>('overview')
  const { systemActive, isConnected, setSystemActive, currentMood, environmentData } = useMoodStore()

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'programmer' as const, label: 'Mood Designer', icon: <Brain className="w-5 h-5" /> },
    { id: 'control' as const, label: 'Live Control', icon: <Sliders className="w-5 h-5" /> },
    { id: 'analytics' as const, label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'settings' as const, label: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ]

  const toggleSystem = () => {
    setSystemActive(!systemActive)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <MoodVisualizer systemActive={systemActive} />
              <SoftwareStatusPanel />
            </div>
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">System Control</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">System Status</span>
                    <span className={`font-medium ${systemActive ? 'text-green-400' : 'text-slate-400'}`}>
                      {systemActive ? 'Active' : 'Stopped'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Connection</span>
                    <span className={`font-medium ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                      {isConnected ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  
                  <button
                    onClick={toggleSystem}
                    disabled={!isConnected}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                      systemActive
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white disabled:bg-slate-600 disabled:text-slate-400'
                    }`}
                  >
                    <Power className="w-4 h-4" />
                    {systemActive ? 'Stop System' : 'Start System'}
                  </button>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Current Visitors</span>
                    <span className="text-white font-medium">{environmentData.peopleCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Active Mood</span>
                    <span className="text-purple-400 font-medium" style={{ color: currentMood.color }}>
                      {currentMood.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Session Time</span>
                    <span className="text-white font-medium">2h 34m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Engagement</span>
                    <span className="text-green-400 font-medium">78%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case 'analytics':
        return <AnalyticsPanel />
      default:
        return (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">{activeTab} coming soon...</p>
              <p className="text-slate-500 text-sm mt-2">
                This section is under development
              </p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">MOOD</span> System
            </h1>
            <p className="text-slate-400 mt-1">
              Adaptive Artistic Environment Controller
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 ${
              isConnected ? 'text-green-400' : 'text-red-400'
            }`}>
              {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span className="text-sm font-medium">
                {isConnected ? 'Connected' : 'Offline'}
              </span>
            </div>
            
            <button
              onClick={toggleSystem}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                systemActive 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {systemActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {systemActive ? 'Stop System' : 'Start System'}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Navigation Tabs */}
      <motion.nav 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-white/10 backdrop-blur-md border border-white/20 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.nav>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.main
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.main>
      </AnimatePresence>
    </div>
  )
}