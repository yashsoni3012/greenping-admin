import { useState } from 'react'
import { Search, Plus, Star, Edit3, Trash2, Grid, List } from 'lucide-react'

const PRODUCTS = [
  { id: 1, name: 'EcoSmart Bamboo Chair',     category: 'Furniture',   price: 149,  stock: 48,  rating: 4.8, sold: 312,  img: '🪑' },
  { id: 2, name: 'Solar USB Charger',          category: 'Electronics', price: 89,   stock: 120, rating: 4.6, sold: 520,  img: '🔋' },
  { id: 3, name: 'Organic Herb Garden Kit',    category: 'Garden',      price: 67,   stock: 35,  rating: 4.9, sold: 184,  img: '🌿' },
  { id: 4, name: 'Recycled Cotton Tote',       category: 'Bags',        price: 24,   stock: 200, rating: 4.5, sold: 890,  img: '👜' },
  { id: 5, name: 'Biodegradable Phone Case',   category: 'Electronics', price: 34,   stock: 156, rating: 4.3, sold: 445,  img: '📱' },
  { id: 6, name: 'Bamboo Desk Lamp',           category: 'Furniture',   price: 112,  stock: 29,  rating: 4.7, sold: 167,  img: '💡' },
  { id: 7, name: 'Compostable Notebook Set',   category: 'Stationery',  price: 19,   stock: 340, rating: 4.4, sold: 1100, img: '📓' },
  { id: 8, name: 'Stainless Water Bottle',     category: 'Kitchen',     price: 42,   stock: 88,  rating: 4.9, sold: 730,  img: '🍶' },
]

const CATEGORIES = ['All', ...new Set(PRODUCTS.map(p => p.category))]

const stockBadge = (s) =>
  s > 100 ? 'badge-green' : s > 30 ? 'badge-yellow' : 'badge-red'
const stockLabel = (s) =>
  s > 100 ? 'In Stock' : s > 30 ? 'Low Stock' : 'Critical'

export default function Products() {
  const [search,  setSearch]  = useState('')
  const [cat,     setCat]     = useState('All')
  const [view,    setView]    = useState('grid')

  const filtered = PRODUCTS.filter(p => {
    const ms = p.name.toLowerCase().includes(search.toLowerCase())
    const mc = cat === 'All' || p.category === cat
    return ms && mc
  })

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Products</h2>
          <p className="text-slate-500 text-sm">{filtered.length} products listed</p>
        </div>
        <button className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 text-sm"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                cat === c ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-1 border border-slate-200 rounded-lg p-0.5 self-start sm:self-auto">
          <button
            onClick={() => setView('grid')}
            className={`p-1.5 rounded transition-all ${view === 'grid' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Grid size={15} />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-1.5 rounded transition-all ${view === 'list' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* Grid view */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="card p-5 hover:shadow-md transition-shadow group">
              <div className="w-full h-28 bg-primary-50 rounded-xl flex items-center justify-center text-5xl mb-4">
                {p.img}
              </div>
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-slate-800 text-sm leading-tight">{p.name}</p>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-primary-600 transition-colors">
                      <Edit3 size={13} />
                    </button>
                    <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-400">{p.category}</p>
                <div className="flex items-center gap-1">
                  <Star size={11} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-semibold text-slate-700">{p.rating}</span>
                  <span className="text-xs text-slate-400">· {p.sold} sold</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-lg font-extrabold text-primary-700">${p.price}</span>
                  <span className={stockBadge(p.stock)}>{stockLabel(p.stock)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List view */
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Sold', ''].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                          {p.img}
                        </div>
                        <span className="font-semibold text-slate-800">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="badge-blue">{p.category}</span>
                    </td>
                    <td className="px-5 py-4 font-bold text-primary-700">${p.price}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className={stockBadge(p.stock)}>{stockLabel(p.stock)}</span>
                        <span className="text-xs text-slate-400">({p.stock})</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="font-semibold text-slate-700">{p.rating}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{p.sold.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary-600 transition-colors">
                          <Edit3 size={14} />
                        </button>
                        <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
