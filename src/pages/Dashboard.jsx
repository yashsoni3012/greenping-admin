import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import {
  Users, ShoppingBag, TrendingUp, DollarSign,
  ArrowUpRight, ArrowDownRight, MoreHorizontal,
} from 'lucide-react'

const revenueData = [
  { month: 'Jan', revenue: 42000, expenses: 28000 },
  { month: 'Feb', revenue: 53000, expenses: 31000 },
  { month: 'Mar', revenue: 48000, expenses: 27000 },
  { month: 'Apr', revenue: 61000, expenses: 34000 },
  { month: 'May', revenue: 55000, expenses: 30000 },
  { month: 'Jun', revenue: 72000, expenses: 38000 },
  { month: 'Jul', revenue: 68000, expenses: 35000 },
  { month: 'Aug', revenue: 79000, expenses: 41000 },
]

const visitorData = [
  { day: 'Mon', visitors: 1200 },
  { day: 'Tue', visitors: 1800 },
  { day: 'Wed', visitors: 1500 },
  { day: 'Thu', visitors: 2100 },
  { day: 'Fri', visitors: 1900 },
  { day: 'Sat', visitors: 1100 },
  { day: 'Sun', visitors: 900 },
]

const pieData = [
  { name: 'Organic', value: 40, color: '#059669' },
  { name: 'Social',  value: 28, color: '#34d399' },
  { name: 'Paid',    value: 20, color: '#6ee7b7' },
  { name: 'Direct',  value: 12, color: '#a7f3d0' },
]

const recentOrders = [
  { id: '#4521', customer: 'Sarah Connor', product: 'EcoSmart Chair',   amount: '$149', status: 'Completed', date: 'Jun 10' },
  { id: '#4520', customer: 'James Watson',  product: 'Green Desk Lamp',  amount: '$89',  status: 'Pending',   date: 'Jun 10' },
  { id: '#4519', customer: 'Emily Clarke',  product: 'Bamboo Notebook',  amount: '$34',  status: 'Completed', date: 'Jun 9' },
  { id: '#4518', customer: 'Mark Johnson',  product: 'Solar Charger',    amount: '$210', status: 'Cancelled', date: 'Jun 9' },
  { id: '#4517', customer: 'Lisa Park',     product: 'Herb Garden Kit',  amount: '$67',  status: 'Completed', date: 'Jun 8' },
]

const statusBadge = {
  Completed: 'badge-green',
  Pending:   'badge-yellow',
  Cancelled: 'badge-red',
}

function StatCard({ title, value, change, positive, icon: Icon, color }) {
  return (
    <div className="card p-5 flex items-start justify-between hover:shadow-md transition-shadow">
      <div className="space-y-2">
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-extrabold text-slate-800">{value}</p>
        <div className={`flex items-center gap-1 text-xs font-semibold ${positive ? 'text-primary-600' : 'text-red-500'}`}>
          {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {change} vs last month
        </div>
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-4 py-3 text-xs">
        <p className="font-semibold text-slate-700 mb-1">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <span className="font-bold">{typeof p.value === 'number' && p.value > 999 ? `$${(p.value/1000).toFixed(0)}k` : p.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Revenue"  value="$128,430" change="+12.5%" positive icon={DollarSign}  color="bg-primary-600" />
        <StatCard title="Active Users"   value="24,812"   change="+8.2%"  positive icon={Users}       color="bg-emerald-500" />
        <StatCard title="Total Orders"   value="3,642"    change="+4.1%"  positive icon={ShoppingBag} color="bg-teal-500" />
        <StatCard title="Growth Rate"    value="18.6%"    change="-2.3%"  positive={false} icon={TrendingUp}  color="bg-cyan-500" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue area chart */}
        <div className="card p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-800">Revenue Overview</h3>
              <p className="text-slate-400 text-xs mt-0.5">Revenue vs Expenses — 2024</p>
            </div>
            <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#059669" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#34d399" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue"  name="Revenue"  stroke="#059669" strokeWidth={2.5} fill="url(#revGrad)" />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#34d399" strokeWidth={2}   fill="url(#expGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-800">Traffic Sources</h3>
              <p className="text-slate-400 text-xs mt-0.5">This month</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-slate-600">{d.name}</span>
                </div>
                <span className="font-semibold text-slate-800">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Orders table */}
        <div className="card xl:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Recent Orders</h3>
            <button className="text-primary-600 text-sm font-semibold hover:text-primary-700 transition-colors">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {['Order', 'Customer', 'Product', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-primary-600 font-semibold">{order.id}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-700">{order.customer}</td>
                    <td className="px-5 py-3.5 text-slate-500">{order.product}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{order.amount}</td>
                    <td className="px-5 py-3.5">
                      <span className={statusBadge[order.status]}>{order.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visitors bar chart */}
        <div className="card p-5">
          <div className="mb-5">
            <h3 className="font-bold text-slate-800">Weekly Visitors</h3>
            <p className="text-slate-400 text-xs mt-0.5">This week's traffic</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={visitorData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="visitors" name="Visitors" fill="#059669" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
