// src/components/dashboard/LiveControlPanel.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw,
  AlertTriangle,
  Sliders,
  Volume2,
  Monitor,
  Lightbulb,
  Settings,
  Eye,
  Users,
  Activity
} from 'lucide-react'
import { useMoodStore, useCurrentMood, useEnvironmentData } from '@/stores/moodStore'

interface LiveControlProps {
  systemActive: boolean
}

export function LiveControlPanel({ systemActive }: LiveControlProps) {
  const [overrideMode, setOverrideMode] = useState(false)
  const [manualControls, setManualControls] = useState({
    qlab: { volume: 0.7, currentCue: 'Ambient_01' },
    resolume: { opacity: 0.8, layer: 'Background' },
    lighting: { brightness: 0.6, color: '#8B5CF6' }
  })

  const currentMood = useCurrentMood()
  const environmentData = useEnvironmentData()
  const { setSystemActive, availableMoods, setCurrentMood } = useMoodStore()

  const handleEmergencyStop = () => {
    setSystemActive(false)
    setOverrideMode(true)
    // Reset all outputs to safe state
    setManualControls({
      qlab: { volume: 0, currentCue: 'STOP' },
      resolume: { opacity: 0, layer: 'Safe' },
      lighting: { brightness: 0.3, color: '#FFFFFF' }
    })
  }

  const handleReset = () => {
    setSystemActive(false)
    setOverrideMode(false)
    setManualControls({
      qlab: { volume: 0.7, currentCue: 'Ambient_01' },
      resolume: { opacity: 0.8, layer: 'Background' },
      lighting: { brightness: 0.6, color: '#8B5CF6' }
    })
  }

  const SliderControl = ({ 
    label, 
    value, 
    onChange, 
    icon, 
    color = 'purple',
    min = 0,
    max = 1,
    step = 0.1,
    disabled = false
  }: {
    label: string
    value: number
    onChange: (value: number) => void
    icon: React.ReactNode
    color?: string
    min?: number
    max?: number
    step?: number
    disabled?: boolean
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded bg-${color}-500/20`}>
            <div className={`text-${color}-400 w-4 h-4`}>{icon}</div>
          </div>
          <span className="text-slate-300 text-sm">{label}</span>
        </div>
        <span className="text-white font-mono text-sm">
          {typeof value === 'number' ? (value * 100).toFixed(0) + '%' : value}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className={`w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-${color} ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Emergency Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Emergency Controls</h2>
              <p className="text-slate-400 text-sm">
                {overrideMode ? 'Manual override active' : 'System controls'}
              </p>
            </div>
          </div>
          
          <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
            overrideMode 
              ? 'bg-orange-500/20 text-orange-400' 
              : 'bg-green-500/20 text-green-400'
          }`}>
            {overrideMode ? 'OVERRIDE MODE' : 'AUTO MODE'}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={handleEmergencyStop}
            className="flex flex-col items-center gap-2 p-4 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors border border-red-500/30"
          >
            <Square className="w-6 h-6 text-red-400" />
            <span className="text-red-400 font-medium text-sm">STOP ALL</span>
          </button>

          <button
            onClick={() => setSystemActive(!systemActive)}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-colors border ${
              systemActive
                ? 'bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-500/30'
                : 'bg-green-500/20 hover:bg-green-500/30 border-green-500/30'
            }`}
          >
            {systemActive ? (
              <>
                <Pause className="w-6 h-6 text-yellow-400" />
                <span className="text-yellow-400 font-medium text-sm">PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-6 h-6 text-green-400" />
                <span className="text-green-400 font-medium text-sm">START</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="flex flex-col items-center gap-2 p-4 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors border border-blue-500/30"
          >
            <RotateCcw className="w-6 h-6 text-blue-400" />
            <span className="text-blue-400 font-medium text-sm">RESET</span>
          </button>

          <button
            onClick={() => setOverrideMode(!overrideMode)}
            className="flex flex-col items-center gap-2 p-4 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors border border-purple-500/30"
          >
            <Settings className="w-6 h-6 text-purple-400" />
            <span className="text-purple-400 font-medium text-sm">OVERRIDE</span>
          </button>
        </div>
      </motion.div>

      {/* Current Performance Status */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Performance Monitor</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400" style={{ color: currentMood.color }}>
              {currentMood.name}
            </div>
            <div className="text-slate-400 text-sm">Active Mood</div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {environmentData.peopleCount}
            </div>
            <div className="text-slate-400 text-sm">Audience Size</div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {Math.round(environmentData.avgMovement * 100)}%
            </div>
            <div className="text-slate-400 text-sm">Engagement</div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {systemActive ? Math.floor(Math.random() * 60) + 120 : 0}s
            </div>
            <div className="text-slate-400 text-sm">Session Time</div>
          </div>
        </div>

        {/* Real-time Environment Data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-300 text-sm">
              <Users className="w-4 h-4" />
              People Detected
            </div>
            <div className="h-8 bg-slate-700 rounded-lg overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                initial={{ width: 0 }}
                animate={{ width: `${(environmentData.peopleCount / 50) * 100}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-300 text-sm">
              <Activity className="w-4 h-4" />
              Movement Activity
            </div>
            <div className="h-8 bg-slate-700 rounded-lg overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${environmentData.avgMovement * 100}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-300 text-sm">
              <Volume2 className="w-4 h-4" />
              Audio Level
            </div>
            <div className="h-8 bg-slate-700 rounded-lg overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${environmentData.audioLevel * 100}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Manual Software Control */}
      {overrideMode && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Sliders className="w-5 h-5" />
            Manual Software Control
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* QLab Controls */}
            <div className="bg-slate-800/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Play className="w-5 h-5 text-green-400" />
                <h4 className="text-white font-medium">QLab</h4>
              </div>
              
              <div className="space-y-4">
                <SliderControl
                  label="Master Volume"
                  value={manualControls.qlab.volume}
                  onChange={(value) => setManualControls(prev => ({
                    ...prev,
                    qlab: { ...prev.qlab, volume: value }
                  }))}
                  icon={<Volume2 className="w-4 h-4" />}
                  color="green"
                />
                
                <div>
                  <label className="text-slate-300 text-sm mb-2 block">Current Cue</label>
                  <select 
                    value={manualControls.qlab.currentCue}
                    onChange={(e) => setManualControls(prev => ({
                      ...prev,
                      qlab: { ...prev.qlab, currentCue: e.target.value }
                    }))}
                    className="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm"
                  >
                    <option value="Ambient_01">Ambient_01</option>
                    <option value="Energetic_02">Energetic_02</option>
                    <option value="Peaceful_03">Peaceful_03</option>
                    <option value="STOP">STOP</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Resolume Controls */}
            <div className="bg-slate-800/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Monitor className="w-5 h-5 text-blue-400" />
                <h4 className="text-white font-medium">Resolume</h4>
              </div>
              
              <div className="space-y-4">
                <SliderControl
                  label="Layer Opacity"
                  value={manualControls.resolume.opacity}
                  onChange={(value) => setManualControls(prev => ({
                    ...prev,
                    resolume: { ...prev.resolume, opacity: value }
                  }))}
                  icon={<Eye className="w-4 h-4" />}
                  color="blue"
                />
                
                <div>
                  <label className="text-slate-300 text-sm mb-2 block">Active Layer</label>
                  <select 
                    value={manualControls.resolume.layer}
                    onChange={(e) => setManualControls(prev => ({
                      ...prev,
                      resolume: { ...prev.resolume, layer: e.target.value }
                    }))}
                    className="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm"
                  >
                    <option value="Background">Background</option>
                    <option value="Particles">Particles</option>
                    <option value="Overlay">Overlay</option>
                    <option value="Safe">Safe Mode</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Lighting Controls */}
            <div className="bg-slate-800/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <h4 className="text-white font-medium">Lighting</h4>
              </div>
              
              <div className="space-y-4">
                <SliderControl
                  label="Master Brightness"
                  value={manualControls.lighting.brightness}
                  onChange={(value) => setManualControls(prev => ({
                    ...prev,
                    lighting: { ...prev.lighting, brightness: value }
                  }))}
                  icon={<Lightbulb className="w-4 h-4" />}
                  color="yellow"
                />
                
                <div>
                  <label className="text-slate-300 text-sm mb-2 block">Color</label>
                  <input
                    type="color"
                    value={manualControls.lighting.color}
                    onChange={(e) => setManualControls(prev => ({
                      ...prev,
                      lighting: { ...prev.lighting, color: e.target.value }
                    }))}
                    className="w-full h-10 bg-slate-700 rounded border-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-orange-400 text-sm">
              <AlertTriangle className="w-4 h-4" />
              Manual override is active. AI mood control is disabled.
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Mood Triggers */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Quick Mood Triggers</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {availableMoods.map((mood) => (
            <button
              key={mood.name}
              onClick={() => setCurrentMood(mood)}
              disabled={overrideMode}
              className={`p-3 rounded-lg border transition-all ${
                currentMood.name === mood.name
                  ? 'border-white/40 bg-white/10'
                  : 'border-slate-600 hover:border-slate-500 hover:bg-white/5'
              } ${overrideMode ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ 
                borderColor: currentMood.name === mood.name ? mood.color : undefined 
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: mood.color }}
                />
                <span className="text-white font-medium text-sm">{mood.name}</span>
              </div>
              <div className="text-slate-400 text-xs text-left">
                {mood.description}
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}