// src/components/dashboard/AnalyticsPanel.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts'
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Target,
  Calendar,
  Download,
  Eye,
  Activity,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react'
import { useAnalyticsData } from '@/stores/moodStore'

type TimeRange = '1h' | '24h' | '7d' | '30d'

export function AnalyticsPanel() {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h')
  const analyticsData = useAnalyticsData()

  // Generate sample data based on time range
  const getTimeSeriesData = () => {
    const hours = timeRange === '1h' ? 1 : timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720
    const interval = timeRange === '1h' ? 5 : timeRange === '24h' ? 60 : timeRange === '7d' ? 24 * 60 : 24 * 60
    
    return Array.from({ length: Math.min(hours, 24) }, (_, i) => ({
      time: timeRange === '1h' 
        ? `${Math.floor(i * 5)}min`
        : timeRange === '24h'
        ? `${i}:00`
        : timeRange === '7d'
        ? `Day ${i + 1}`
        : `Week ${i + 1}`,
      visitors: Math.floor(Math.random() * 30) + 5,
      engagement: Math.floor(Math.random() * 40) + 60,
      moodChanges: Math.floor(Math.random() * 10) + 2
    }))
  }

  const timeSeriesData = getTimeSeriesData()

  const moodDistributionData = Object.entries(analyticsData.moodDistribution).map(([mood, percentage]) => ({
    name: mood,
    value: percentage,
    color: getMoodColor(mood)
  }))

  function getMoodColor(moodName: string) {
    const colorMap: Record<string, string> = {
      'Energetic': '#EF4444',
      'Contemplative': '#8B5CF6',
      'Social': '#10B981',
      'Mysterious': '#6366F1',
      'Peaceful': '#06B6D4'
    }
    return colorMap[moodName] || '#6B7280'
  }

  const MetricCard = ({ title, value, change, icon, color }: {
    title: string
    value: string | number
    change?: string
    icon: React.ReactNode
    color: string
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${
              change.startsWith('+') ? 'text-green-400' : 'text-red-400'
            }`}>
              {change} from yesterday
            </p>
          )}
        </div>
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  )

  const TimeRangeSelector = () => (
    <div className="flex gap-2">
      {(['1h', '24h', '7d', '30d'] as TimeRange[]).map((range) => (
        <button
          key={range}
          onClick={() => setTimeRange(range)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            timeRange === range
              ? 'bg-purple-500 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          {range}
        </button>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-slate-400">Performance insights and audience data</p>
        </div>
        
        <div className="flex items-center gap-4">
          <TimeRangeSelector />
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white transition-colors">
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </motion.div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Visitors"
          value={analyticsData.visitors}
          change="+12%"
          icon={<Users className="w-5 h-5 text-blue-400" />}
          color="bg-blue-500/20"
        />
        
        <MetricCard
          title="Avg Stay Time"
          value={`${analyticsData.avgStayTime}min`}
          change="+8%"
          icon={<Clock className="w-5 h-5 text-green-400" />}
          color="bg-green-500/20"
        />
        
        <MetricCard
          title="Peak Occupancy"
          value={analyticsData.peakOccupancy}
          change="+15%"
          icon={<TrendingUp className="w-5 h-5 text-purple-400" />}
          color="bg-purple-500/20"
        />
        
        <MetricCard
          title="Engagement Score"
          value={`${analyticsData.engagementScore}%`}
          change="+3%"
          icon={<Target className="w-5 h-5 text-yellow-400" />}
          color="bg-yellow-500/20"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitor Timeline */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Visitor Activity</h3>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
              <Area
                type="monotone"
                dataKey="visitors"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Engagement Metrics */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Activity className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Engagement Trends</h3>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
              <Line
                type="monotone"
                dataKey="engagement"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="moodChanges"
                stroke="#F59E0B"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Mood Distribution and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mood Distribution Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <PieChartIcon className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Mood Distribution</h3>
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={moodDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {moodDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
                formatter={(value) => [`${value}%`, 'Usage']}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="space-y-2">
            {moodDistributionData.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-slate-300 text-sm">{entry.name}</span>
                </div>
                <span className="text-white font-medium text-sm">{entry.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Performance Insights */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-6"
        >
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

            <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-orange-400" />
                <span className="text-orange-400 font-medium text-sm">Scheduling</span>
              </div>
              <p className="text-slate-300 text-xs">
                Weekends show 40% higher engagement than weekdays
              </p>
            </div>
          </div>
        </motion.div>

        {/* Hourly Heatmap */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Hourly Activity</h3>
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analyticsData.hourlyData.slice(8, 20)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="hour" 
                stroke="#9CA3AF"
                fontSize={10}
                tickFormatter={(value) => `${value}:00`}
              />
              <YAxis stroke="#9CA3AF" fontSize={10} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
                labelFormatter={(value) => `${value}:00`}
              />
              <Bar 
                dataKey="visitors" 
                fill="#EF4444" 
                radius={[2, 2, 0, 0]}
                opacity={0.8}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Advanced Analytics Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-500/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Detailed Metrics</h3>
          </div>
          
          <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
            View All →
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 text-sm font-medium py-3">Time</th>
                <th className="text-left text-slate-400 text-sm font-medium py-3">Visitors</th>
                <th className="text-left text-slate-400 text-sm font-medium py-3">Engagement</th>
                <th className="text-left text-slate-400 text-sm font-medium py-3">Dominant Mood</th>
                <th className="text-left text-slate-400 text-sm font-medium py-3">Duration</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.hourlyData.slice(9, 15).map((data, index) => (
                <tr key={index} className="border-b border-slate-800">
                  <td className="py-3 text-slate-300 text-sm">{data.hour}:00</td>
                  <td className="py-3 text-white font-medium">{data.visitors}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-400 rounded-full"
                          style={{ width: `${data.engagement}%` }}
                        />
                      </div>
                      <span className="text-white text-sm font-medium">{data.engagement}%</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getMoodColor(data.dominantMood) }}
                      />
                      <span className="text-slate-300 text-sm">{data.dominantMood}</span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-300 text-sm">{Math.floor(Math.random() * 30) + 10}min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}