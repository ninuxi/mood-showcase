import dynamic from 'next/dynamic'

const MOODDashboard = dynamic(() => import('../components/MOODDashboard'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white">Loading MOOD System...</p>
      </div>
    </div>
  )
})

export default function Home() {
  return <MOODDashboard />
}