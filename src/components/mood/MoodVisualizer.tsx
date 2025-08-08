// src/components/mood/MoodVisualizer.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Volume2, 
  Eye, 
  Activity,
  TrendingUp,
  Clock,
  Brain,
  Lightbulb,
  Zap,
  Thermometer
} from 'lucide-react'
import { useCurrentMood, useEnvironmentData, useMoodStore } from '@/stores/moodStore'

interface VisualizerProps {
  systemActive: boolean
}

export function MoodVisualizer({ systemActive }: VisualizerProps) {
  const currentMood = useCurrentMood()
  const environmentData = useEnvironmentData()
  const { availableMoods, setCurrentMood } = useMoodStore()
  const [moodHistory, setMoodHistory] = useState<Array<{
    mood: string
    timestamp: Date
    duration: number
  }>>([])

  // Track mood changes for history
  useEffect(() => {
    setMoodHistory(prev => {
      const newEntry = {
        mood: currentMood.name,
        timestamp: new Date(),
        duration: 0
      }
      
      // Update previous entry duration
      if (prev.length > 0) {
        const updated = [...prev]
        updated[updated.length - 1].duration = Date.now() - updated[updated.length - 1].timestamp.getTime()
        return [...updated.slice(-10), newEntry] // Keep last 10 entries
      }
      
      return [newEntry]
    })
  }, [currentMood.name])

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
            <div className={`${color}`}>{icon}</div>
          </div>
          <span className="text-slate-300 text-sm">{label}</span>
        </div>
        <span className="text-white font-medium text-sm">
          {Math.round(value * 100)}%
        </span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${value * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  )

  const MoodButton = ({ mood, isActive }: { 
    mood: typeof currentMood
    isActive: boolean 
  }) => (
    <motion.button
      onClick={() => setCurrentMood(mood)}
      className={`relative p-3 rounded-lg border transition-all ${
        isActive 
          ? 'border-white/40 bg-white/10' 
          : 'border-slate-600 hover:border-slate-500 hover:bg-white/5'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
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
      
      {isActive && (
        <motion.div
          className="absolute inset-0 border-2 rounded-lg"
          style={{ borderColor: mood.color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  )

  return (
    <div className="glass rounded-xl p-6">
      {/* Header */}
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
          <div className="text-slate-400 text-sm">
            Current Mood
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Mood Visualization */}
        <div className="space-y-6">
          {/* Large Mood Display */}
          <div className="relative">
            <motion.div
              className="w-32 h-32 rounded-full mx-auto relative overflow-hidden"
              style={{ backgroundColor: `${currentMood.color}20` }}
              animate={{ 
                scale: systemActive ? [1, 1.05, 1] : 1,
                opacity: systemActive ? [0.8, 1, 0.8] : 0.6
              }}
              transition={{ 
                duration: 3, 
                repeat: systemActive ? Infinity : 0,
                ease: "easeInOut" 
              }}
            >
              <div 
                className="absolute inset-2 rounded-full"
                style={{ backgroundColor: currentMood.color }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-4"
                style={{ borderColor: currentMood.color }}
                animate={{ 
                  rotate: systemActive ? 360 : 0,
                  borderColor: systemActive ? [currentMood.color, '#ffffff', currentMood.color] : currentMood.color
                }}
                transition={{ 
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  borderColor: { duration: 2, repeat: Infinity }
                }}
              />
            </motion.div>

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
              <div className="text-slate-500 text-xs mt-2">
                Updated {Math.floor((Date.now() - currentMood.lastUpdated.getTime()) / 1000)}s ago
              </div>
            </div>
          </div>

          {/* Mood Parameters */}
          <div className="space-y-4">
            <h3 className="text-white font-medium">Mood Parameters</h3>
            
            <ParameterBar
              label="Energy"
              value={currentMood.energy}
              color="from-red-400 to-orange-400"
              icon={<Zap className="w-3 h-3" />}
            />
            
            <ParameterBar
              label="Valence"
              value={currentMood.valence}
              color="from-green-400 to-blue-400"
              icon={<TrendingUp className="w-3 h-3" />}
            />
            
            <ParameterBar
              label="Arousal"
              value={currentMood.arousal}
              color="from-purple-400 to-pink-400"
              icon={<Activity className="w-3 h-3" />}
            />
          </div>
        </div>

        {/* Environment Data & Controls */}
        <div className="space-y-6">
          {/* Environment Sensors */}
          <div>
            <h3 className="text-white font-medium mb-4">Environment Sensors</h3>
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                className="bg-slate-800/50 rounded-lg p-3"
                animate={systemActive ? { 
                  backgroundColor: ['rgba(30, 41, 59, 0.5)', 'rgba(30, 41, 59, 0.8)', 'rgba(30, 41, 59, 0.5)'] 
                } : {}}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Volume2 className="w-4 h-4 text-yellow-400" />
                  <span className="text-slate-300 text-sm">Audio</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {Math.round(environmentData.audioLevel * 100)}%
                </div>
                <div className="text-slate-400 text-xs">volume</div>
              </motion.div>

              <motion.div 
                className="bg-slate-800/50 rounded-lg p-3"
                animate={systemActive ? { 
                  backgroundColor: ['rgba(30, 41, 59, 0.5)', 'rgba(30, 41, 59, 0.8)', 'rgba(30, 41, 59, 0.5)'] 
                } : {}}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-300 text-sm">Light</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {Math.round(environmentData.lightLevel * 100)}%
                </div>
                <div className="text-slate-400 text-xs">ambient</div>
              </motion.div>
            </div>
          </div>

          {/* Quick Mood Selection */}
          <div>
            <h3 className="text-white font-medium mb-4">Quick Mood Override</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableMoods.map((mood) => (
                <MoodButton 
                  key={mood.name}
                  mood={mood}
                  isActive={mood.name === currentMood.name}
                />
              ))}
            </div>
          </div>

          {/* Mood History Timeline */}
          <div>
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent Mood Changes
            </h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              <AnimatePresence>
                {moodHistory.slice(-5).reverse().map((entry, index) => (
                  <motion.div
                    key={`${entry.mood}-${entry.timestamp.getTime()}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between p-2 bg-slate-800/30 rounded text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ 
                          backgroundColor: availableMoods.find(m => m.name === entry.mood)?.color || '#6B7280' 
                        }}
                      />
                      <span className="text-slate-300">{entry.mood}</span>
                    </div>
                    <span className="text-slate-500 text-xs">
                      {entry.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* AI Decision Indicator */}
      {systemActive && (
        <motion.div
          className="mt-6 p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-500/30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-5 h-5 text-purple-400" />
            </motion.div>
            <div>
              <div className="text-white font-medium text-sm">
                AI Mood Engine Active
              </div>
              <div className="text-slate-400 text-xs">
                Analyzing environment and applying mood rules every 3 seconds
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* System Status Indicator */}
      <div className="mt-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            systemActive ? 'bg-green-400 animate-pulse' : 'bg-slate-500'
          }`} />
          <span className="text-slate-400">
            {systemActive ? 'Real-time analysis active' : 'System paused'}
          </span>
        </div>
        <div className="text-slate-500">
          Last update: {environmentData.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}.8)', 'rgba(30, 41, 59, 0.5)'] 
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-300 text-sm">People</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {environmentData.peopleCount}
                </div>
                <div className="text-slate-400 text-xs">detected</div>
              </motion.div>

              <motion.div 
                className="bg-slate-800/50 rounded-lg p-3"
                animate={systemActive ? { 
                  backgroundColor: ['rgba(30, 41, 59, 0.5)', 'rgba(30, 41, 59, 0.8)', 'rgba(30, 41, 59, 0.5)'] 
                } : {}}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span className="text-slate-300 text-sm">Movement</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {Math.round(environmentData.avgMovement * 100)}%
                </div>
                <div className="text-slate-400 text-xs">activity</div>
              </motion.div>

              <motion.div 
                className="bg-slate-800/50 rounded-lg p-3"
                animate={systemActive ? { 
                  backgroundColor: ['rgba(30, 41, 59, 0.5)', 'rgba(30, 41, 59, 0