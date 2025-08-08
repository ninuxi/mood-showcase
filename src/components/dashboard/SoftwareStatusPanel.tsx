// src/components/dashboard/SoftwareStatusPanel.tsx
'use client'

import { motion } from 'framer-motion'
import { 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  CheckCircle,
  Play,
  Square,
  Monitor,
  Music,
  Lightbulb,
  Zap,
  RefreshCw
} from 'lucide-react'
import { useSoftwareConnections, useMoodStore } from '@/stores/moodStore'

const protocolIcons = {
  OSC: <Zap className="w-4 h-4" />,
  MIDI: <Music className="w-4 h-4" />,
  ArtNet: <Lightbulb className="w-4 h-4" />
}

const softwareIcons = {
  'QLab': <Play className="w-5 h-5" />,
  'Resolume Arena': <Monitor className="w-5 h-5" />,
  'Chamsys MagicQ': <Lightbulb className="w-5 h-5" />
}

export function SoftwareStatusPanel() {
  const connections = useSoftwareConnections()
  const { updateSoftwareConnection } = useMoodStore()

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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Connected'
      case 'disconnected': return 'Disconnected'
      case 'error': return 'Error'
      default: return 'Unknown'
    }
  }

  const handleReconnect = (softwareName: string) => {
    updateSoftwareConnection(softwareName, 'connected')
  }

  const handleDisconnect = (softwareName: string) => {
    updateSoftwareConnection(softwareName, 'disconnected')
  }

  const connectedCount = connections.filter(c => c.status === 'connected').length
  const totalCount = connections.length

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
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

        <div className="flex gap-2">
          <button
            onClick={() => connections.forEach(c => handleReconnect(c.name))}
            className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Connect All
          </button>
          <button
            onClick={() => connections.forEach(c => handleDisconnect(c.name))}
            className="flex items-center gap-2 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            <Square className="w-4 h-4" />
            Emergency Stop
          </button>
        </div>
      </div>

      {/* Connection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {connections.map((connection, index) => (
          <motion.div
            key={connection.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50"
          >
            {/* Software Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="text-slate-300">
                  {softwareIcons[connection.name as keyof typeof softwareIcons] || <Monitor className="w-5 h-5" />}
                </div>
                <h3 className="font-medium text-white text-sm">{connection.name}</h3>
              </div>
              <div className={`${getStatusColor(connection.status)}`}>
                {getStatusIcon(connection.status)}
              </div>
            </div>

            {/* Connection Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Status</span>
                <span className={`font-medium ${getStatusColor(connection.status)}`}>
                  {getStatusText(connection.status)}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Protocol</span>
                <div className="flex items-center gap-1 text-slate-300">
                  {protocolIcons[connection.type]}
                  <span>{connection.type}</span>
                </div>
              </div>
              
              {connection.ip && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Address</span>
                  <span className="text-slate-300 font-mono">
                    {connection.ip}:{connection.port}
                  </span>
                </div>
              )}
              
              {connection.lastPing && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Last Ping</span>
                  <span className="text-slate-300">
                    {Math.floor((Date.now() - connection.lastPing.getTime()) / 1000)}s ago
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {connection.status === 'connected' ? (
                <button
                  onClick={() => handleDisconnect(connection.name)}
                  className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30 transition-colors"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={() => handleReconnect(connection.name)}
                  className="flex-1 px-3 py-2 bg-green-500/20 text-green-400 rounded text-xs hover:bg-green-500/30 transition-colors"
                >
                  Connect
                </button>
              )}
              
              <button className="px-3 py-2 bg-slate-600/50 text-slate-300 rounded text-xs hover:bg-slate-600/70 transition-colors">
                Test
              </button>
            </div>

            {/* Status Indicator Bar */}
            <div className="mt-3 h-1 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${
                  connection.status === 'connected' 
                    ? 'bg-green-400' 
                    : connection.status === 'error'
                    ? 'bg-red-400'
                    : 'bg-slate-500'
                }`}
                initial={{ width: 0 }}
                animate={{ 
                  width: connection.status === 'connected' ? '100%' : '0%' 
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Overall Status Bar */}
      <div className="mt-6 p-4 bg-slate-800/30 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-300 text-sm">Overall System Health</span>
          <span className="text-white font-medium">
            {Math.round((connectedCount / totalCount) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-blue-400"
            initial={{ width: 0 }}
            animate={{ width: `${(connectedCount / totalCount) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Quick Info */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-green-400">{connectedCount}</div>
          <div className="text-xs text-slate-400">Connected</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-red-400">
            {connections.filter(c => c.status === 'error').length}
          </div>
          <div className="text-xs text-slate-400">Errors</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-400">
            {connections.filter(c => c.status === 'disconnected').length}
          </div>
          <div className="text-xs text-slate-400">Offline</div>
        </div>
      </div>
    </motion.div>
  )
}