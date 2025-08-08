// src/components/mood/MoodProgrammer.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  Users,
  Activity,
  Volume2,
  Clock,
  ArrowRight,
  Save,
  Lightbulb,
  Brain,
  Settings,
  Target,
  Zap,
  Eye
} from 'lucide-react'
import { useMoodRules, useMoodStore, type MoodRule } from '@/stores/moodStore'

type PresetType = 'gallery' | 'museum' | 'corporate' | 'festival' | 'custom'

interface Preset {
  name: string
  description: string
  icon: React.ReactNode
  rules: Omit<MoodRule, 'id'>[]
}

export function MoodProgrammer() {
  const moodRules = useMoodRules()
  const { availableMoods, addMoodRule, removeMoodRule, updateMoodRule } = useMoodStore()
  const [editingRule, setEditingRule] = useState<MoodRule | null>(null)
  const [showRuleBuilder, setShowRuleBuilder] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<PresetType | null>(null)

  const presets: Record<PresetType, Preset> = {
    gallery: {
      name: 'Art Gallery',
      description: 'Sophisticated atmosphere for art appreciation',
      icon: <Eye className="w-5 h-5" />,
      rules: [
        {
          name: 'Quiet Contemplation',
          conditions: { peopleCount: { min: 1, max: 8 } },
          targetMood: 'Contemplative',
          priority: 8,
          enabled: true
        },
        {
          name: 'Opening Night Energy',
          conditions: { peopleCount: { min: 20, max: 100 }, audioLevel: { min: 0.5, max: 0.8 } },
          targetMood: 'Social',
          priority: 9,
          enabled: true
        }
      ]
    },
    museum: {
      name: 'Museum Experience',
      description: 'Educational and engaging environment',
      icon: <Lightbulb className="w-5 h-5" />,
      rules: [
        {
          name: 'Learning Mode',
          conditions: { peopleCount: { min: 5, max: 15 }, timeOfDay: { start: '10:00', end: '16:00' } },
          targetMood: 'Contemplative',
          priority: 7,
          enabled: true
        },
        {
          name: 'Interactive Discovery',
          conditions: { movement: { min: 0.6, max: 1.0 } },
          targetMood: 'Energetic',
          priority: 8,
          enabled: true
        }
      ]
    },
    corporate: {
      name: 'Corporate Event',
      description: 'Professional networking and presentations',
      icon: <Target className="w-5 h-5" />,
      rules: [
        {
          name: 'Networking Energy',
          conditions: { peopleCount: { min: 15, max: 50 }, audioLevel: { min: 0.4, max: 0.7 } },
          targetMood: 'Social',
          priority: 9,
          enabled: true
        },
        {
          name: 'Presentation Focus',
          conditions: { movement: { min: 0, max: 0.3 }, audioLevel: { min: 0, max: 0.3 } },
          targetMood: 'Contemplative',
          priority: 8,
          enabled: true
        }
      ]
    },
    festival: {
      name: 'Festival/Event',
      description: 'High energy crowd entertainment',
      icon: <Zap className="w-5 h-5" />,
      rules: [
        {
          name: 'Festival Energy',
          conditions: { peopleCount: { min: 30, max: 200 }, movement: { min: 0.7, max: 1.0 } },
          targetMood: 'Energetic',
          priority: 10,
          enabled: true
        },
        {
          name: 'Late Night Mysterious',
          conditions: { timeOfDay: { start: '22:00', end: '02:00' } },
          targetMood: 'Mysterious',
          priority: 7,
          enabled: true
        }
      ]
    },
    custom: {
      name: 'Custom Setup',
      description: 'Build your own mood rules',
      icon: <Settings className="w-5 h-5" />,
      rules: []
    }
  }

  const RuleCard = ({ rule }: { rule: MoodRule }) => {
    const mood = availableMoods.find(m => m.name === rule.targetMood)
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass rounded-lg p-4 ${rule.enabled ? '' : 'opacity-60'}`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: mood?.color || '#6B7280' }}
            />
            <div>
              <h4 className="text-white font-medium text-sm">{rule.name}</h4>
              <p className="text-slate-400 text-xs">Priority: {rule.priority}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateMoodRule(rule.id, { enabled: !rule.enabled })}
              className={`p-1 rounded ${
                rule.enabled ? 'text-green-400 hover:bg-green-500/20' : 'text-slate-500 hover:bg-slate-500/20'
              }`}
            >
              {rule.enabled ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setEditingRule(rule)}
              className="p-1 text-blue-400 hover:bg-blue-500/20 rounded"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => removeMoodRule(rule.id)}
              className="p-1 text-red-400 hover:bg-red-500/20 rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Rule Visualization */}
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="bg-slate-700 px-2 py-1 rounded">IF</span>
          
          {/* Conditions */}
          <div className="flex flex-wrap items-center gap-1">
            {rule.conditions.peopleCount && (
              <span className="flex items-center gap-1 bg-blue-500/20 px-2 py-1 rounded">
                <Users className="w-3 h-3" />
                {rule.conditions.peopleCount.min}-{rule.conditions.peopleCount.max} people
              </span>
            )}
            {rule.conditions.movement && (
              <span className="flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded">
                <Activity className="w-3 h-3" />
                {Math.round(rule.conditions.movement.min * 100)}-{Math.round(rule.conditions.movement.max * 100)}% movement
              </span>
            )}
            {rule.conditions.audioLevel && (
              <span className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded">
                <Volume2 className="w-3 h-3" />
                {Math.round(rule.conditions.audioLevel.min * 100)}-{Math.round(rule.conditions.audioLevel.max * 100)}% audio
              </span>
            )}
            {rule.conditions.timeOfDay && (
              <span className="flex items-center gap-1 bg-purple-500/20 px-2 py-1 rounded">
                <Clock className="w-3 h-3" />
                {rule.conditions.timeOfDay.start}-{rule.conditions.timeOfDay.end}
              </span>
            )}
          </div>

          <ArrowRight className="w-3 h-3 text-slate-500" />
          
          <span className="bg-slate-700 px-2 py-1 rounded">THEN</span>
          <span 
            className="px-2 py-1 rounded text-white"
            style={{ backgroundColor: `${mood?.color}40` }}
          >
            {rule.targetMood}
          </span>
        </div>
      </motion.div>
    )
  }

  const PresetCard = ({ presetKey, preset }: { presetKey: PresetType, preset: Preset }) => (
    <motion.button
      onClick={() => setSelectedPreset(presetKey)}
      className={`text-left p-4 rounded-lg border transition-all ${
        selectedPreset === presetKey
          ? 'border-purple-500 bg-purple-500/10'
          : 'border-slate-600 hover:border-slate-500 hover:bg-white/5'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-purple-500/20 rounded">
          {preset.icon}
        </div>
        <div>
          <h3 className="text-white font-medium">{preset.name}</h3>
          <p className="text-slate-400 text-sm">{preset.description}</p>
        </div>
      </div>
      <div className="text-slate-500 text-xs">
        {preset.rules.length} mood rules included
      </div>
    </motion.button>
  )

  const applyPreset = () => {
    if (!selectedPreset || selectedPreset === 'custom') return
    
    const preset = presets[selectedPreset]
    preset.rules.forEach((rule, index) => {
      addMoodRule({
        ...rule,
        id: `preset_${selectedPreset}_${index}_${Date.now()}`
      })
    })
    setSelectedPreset(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            Mood Programmer
          </h1>
          <p className="text-slate-400 ml-11">Create intelligent mood behaviors and rules</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowRuleBuilder(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Rule
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white transition-colors">
            <Save className="w-4 h-4" />
            Save Config
          </button>
        </div>
      </motion.div>

      {/* Preset Selection */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4">Quick Start Presets</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Object.entries(presets).map(([key, preset]) => (
            <PresetCard 
              key={key} 
              presetKey={key as PresetType} 
              preset={preset} 
            />
          ))}
        </div>

        {selectedPreset && selectedPreset !== 'custom' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border-t border-slate-700 pt-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">{presets[selectedPreset].name} Preset</h3>
                <p className="text-slate-400 text-sm">{presets[selectedPreset].description}</p>
              </div>
              <button
                onClick={applyPreset}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded text-white text-sm transition-colors"
              >
                Apply Preset
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Active Rules */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Active Mood Rules</h2>
          <div className="text-slate-400 text-sm">
            {moodRules.filter(r => r.enabled).length}/{moodRules.length} rules active
          </div>
        </div>

        {moodRules.length === 0 ? (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No mood rules configured</p>
            <p className="text-slate-500 text-sm mt-2">
              Start with a preset or create your first custom rule
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {moodRules
              .sort((a, b) => b.priority - a.priority)
              .map((rule) => (
                <RuleCard key={rule.id} rule={rule} />
              ))}
          </div>
        )}
      </motion.div>

      {/* Rule Builder Modal */}
      <AnimatePresence>
        {(showRuleBuilder || editingRule) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <RuleBuilder
                rule={editingRule}
                onSave={(rule) => {
                  if (editingRule) {
                    updateMoodRule(editingRule.id, rule)
                  } else {
                    addMoodRule({
                      ...rule,
                      id: `rule_${Date.now()}`
                    })
                  }
                  setEditingRule(null)
                  setShowRuleBuilder(false)
                }}
                onCancel={() => {
                  setEditingRule(null)
                  setShowRuleBuilder(false)
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flow Visualization */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-6">AI → Software Pipeline</h2>
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Input Sensors */}
          <div className="flex flex-col items-center gap-2">
            <div className="p-4 bg-blue-500/20 rounded-xl">
              <Eye className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-white font-medium text-sm">Computer Vision</h3>
            <p className="text-slate-400 text-xs text-center">People detection<br />Movement analysis</p>
          </div>

          <ArrowRight className="w-6 h-6 text-slate-500 rotate-90 lg:rotate-0" />

          {/* AI Processing */}
          <div className="flex flex-col items-center gap-2">
            <div className="p-4 bg-purple-500/20 rounded-xl">
              <Brain className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-white font-medium text-sm">AI Mood Engine</h3>
            <p className="text-slate-400 text-xs text-center">Rule evaluation<br />Mood selection</p>
          </div>

          <ArrowRight className="w-6 h-6 text-slate-500 rotate-90 lg:rotate-0" />

          {/* Software Outputs */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Play className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-white text-xs">QLab</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Eye className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-white text-xs">Resolume</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-white text-xs">Lighting</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Rule Builder Component
function RuleBuilder({ 
  rule, 
  onSave, 
  onCancel 
}: {
  rule: MoodRule | null
  onSave: (rule: Omit<MoodRule, 'id'>) => void
  onCancel: () => void
}) {
  const { availableMoods } = useMoodStore()
  const [formData, setFormData] = useState<Omit<MoodRule, 'id'>>({
    name: rule?.name || '',
    conditions: rule?.conditions || {},
    targetMood: rule?.targetMood || availableMoods[0].name,
    priority: rule?.priority || 5,
    enabled: rule?.enabled ?? true
  })

  const handleSave = () => {
    if (!formData.name.trim()) return
    onSave(formData)
  }

  const ConditionInput = ({ 
    type, 
    label, 
    icon, 
    value, 
    onChange 
  }: {
    type: 'range' | 'time'
    label: string
    icon: React.ReactNode
    value: any
    onChange: (value: any) => void
  }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="text-purple-400">{icon}</div>
        <label className="text-white font-medium text-sm">{label}</label>
      </div>
      
      {type === 'range' ? (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 text-xs">Min</label>
            <input
              type="number"
              value={value?.min || ''}
              onChange={(e) => onChange({ ...value, min: Number(e.target.value) })}
              className="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm"
              placeholder="0"
              min="0"
              max={label.includes('People') ? '100' : '1'}
              step={label.includes('People') ? '1' : '0.1'}
            />
          </div>
          <div>
            <label className="text-slate-400 text-xs">Max</label>
            <input
              type="number"
              value={value?.max || ''}
              onChange={(e) => onChange({ ...value, max: Number(e.target.value) })}
              className="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm"
              placeholder={label.includes('People') ? '100' : '1'}
              min="0"
              max={label.includes('People') ? '200' : '1'}
              step={label.includes('People') ? '1' : '0.1'}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-slate-400 text-xs">Start Time</label>
            <input
              type="time"
              value={value?.start || ''}
              onChange={(e) => onChange({ ...value, start: e.target.value })}
              className="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-slate-400 text-xs">End Time</label>
            <input
              type="time"
              value={value?.end || ''}
              onChange={(e) => onChange({ ...value, end: e.target.value })}
              className="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm"
            />
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          {rule ? 'Edit Rule' : 'Create New Rule'}
        </h2>
        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Rule Name */}
      <div>
        <label className="text-white font-medium text-sm mb-2 block">Rule Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-slate-700 text-white rounded px-3 py-2"
          placeholder="Enter rule name..."
        />
      </div>

      {/* Conditions */}
      <div className="space-y-4">
        <h3 className="text-white font-medium">Conditions (IF)</h3>
        
        <ConditionInput
          type="range"
          label="People Count"
          icon={<Users className="w-4 h-4" />}
          value={formData.conditions.peopleCount}
          onChange={(value) => setFormData({
            ...formData,
            conditions: { ...formData.conditions, peopleCount: value }
          })}
        />

        <ConditionInput
          type="range"
          label="Movement Activity (0-1)"
          icon={<Activity className="w-4 h-4" />}
          value={formData.conditions.movement}
          onChange={(value) => setFormData({
            ...formData,
            conditions: { ...formData.conditions, movement: value }
          })}
        />

        <ConditionInput
          type="range"
          label="Audio Level (0-1)"
          icon={<Volume2 className="w-4 h-4" />}
          value={formData.conditions.audioLevel}
          onChange={(value) => setFormData({
            ...formData,
            conditions: { ...formData.conditions, audioLevel: value }
          })}
        />

        <ConditionInput
          type="time"
          label="Time of Day"
          icon={<Clock className="w-4 h-4" />}
          value={formData.conditions.timeOfDay}
          onChange={(value) => setFormData({
            ...formData,
            conditions: { ...formData.conditions, timeOfDay: value }
          })}
        />
      </div>

      {/* Target Mood */}
      <div>
        <label className="text-white font-medium text-sm mb-2 block">Target Mood (THEN)</label>
        <select
          value={formData.targetMood}
          onChange={(e) => setFormData({ ...formData, targetMood: e.target.value })}
          className="w-full bg-slate-700 text-white rounded px-3 py-2"
        >
          {availableMoods.map(mood => (
            <option key={mood.name} value={mood.name}>{mood.name}</option>
          ))}
        </select>
      </div>

      {/* Priority */}
      <div>
        <label className="text-white font-medium text-sm mb-2 block">
          Priority: {formData.priority}
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>Low (1)</span>
          <span>High (10)</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!formData.name.trim()}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-600 disabled:cursor-not-allowed rounded text-white transition-colors"
        >
          {rule ? 'Update Rule' : 'Create Rule'}
        </button>
      </div>
    </div>
  )
}