import React, { useEffect, useState } from 'react'

// API endpoint for skips
const SKIP_API =
  'https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft'

export default function SkipSelector() {
  const [skips, setSkips] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showMobilePanel, setShowMobilePanel] = useState(false)

  useEffect(() => {
    async function fetchSkips() {
      setLoading(true)
      try {
        const res = await fetch(SKIP_API)
        const data = await res.json()
        setSkips(data)
        setSelected(data[0] || null)
      } catch (err) {
        setSkips([])
      } finally {
        setLoading(false)
      }
    }
    fetchSkips()
  }, [])

  if (loading) return <div className='text-center py-10'>Loading skips...</div>
  if (!skips.length)
    return <div className='text-center py-10'>No skips available.</div>

  return (
    <div className='flex flex-col md:flex-row gap-6 mt-10 mx-auto w-11/12'>
      {/* Cards Grid: 2 columns on desktop, 1 on mobile */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 flex-1'>
        {skips.map((skip) => (
          <div
            key={skip.id}
            className={`border rounded-xl p-5 shadow bg-[#181A20] ${
              selected && selected.id === skip.id
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-700'
            }`}
            onClick={() => setSelected(skip)}
          >
            <div className='relative mb-4'>
              <img
                src={
                  skip.image ||
                  'https://yozbrydxdlcxghkphhtq.supabase.co/storage/v1/object/public/skips/skip-sizes/4-yarder-skip.jpg'
                }
                alt={`${skip.size} Yard Skip`}
                className='w-full object-contain rounded-lg bg-[#22232A]'
              />
              <span className='absolute top-2 right-2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow'>
                {skip.size} Yards
              </span>
            </div>
            <div className='ml-2'>
              <h3 className='font-bold text-lg text-white mb-1'>
                {skip.size} Yard Skip
              </h3>
              <p className='text-gray-400 text-sm mb-2'>
                {skip.hire_period_days} day hire period
              </p>
              <p className='text-blue-400 font-bold text-xl mb-3'>
                £{skip.price_before_vat}
              </p>
            </div>
            <button
              className={`w-full py-3 rounded-lg font-semibold transition
                ${
                  selected && selected.id === skip.id
                    ? 'bg-blue-700 text-white'
                    : 'bg-gray-800 text-white hover:bg-blue-800'
                }
              `}
              onClick={(e) => {
                e.stopPropagation()
                setSelected(skip)
                // Show details panel on mobile when selecting a skip
                if (window.innerWidth < 768) setShowMobilePanel(true)
              }}
            >
              Select This Skip &rarr;
            </button>
          </div>
        ))}
      </div>

      {/* Sticky Card for Desktop */}
      <div className='md:w-1/3 w-full md:sticky md:top-6 h-fit hidden md:block'>
        <div className='rounded-xl border border-blue-200 bg-white shadow-xl sticky top-6 overflow-hidden'>
          <div className='bg-gradient-to-br from-gray-900 to-gray-900 p-5 flex flex-col items-center'>
            <img
              src={
                selected?.image ||
                'https://yozbrydxdlcxghkphhtq.supabase.co/storage/v1/object/public/skips/skip-sizes/4-yarder-skip.jpg'
              }
              alt={selected?.name || 'Card'}
              className='w-full object-contain rounded-md mb-3 shadow'
            />
          </div>
          <div className='px-6 py-4'>
            <div className='flex justify-between text-sm mb-1 text-gray-500'>
              <span>Yard Skip</span>
              <span>{selected?.size || '00.00'}</span>
            </div>
            <div className='flex justify-between text-sm mb-1 text-gray-500'>
              <span>Hire Period</span>
              <span>{selected?.hire_period_days || '00.00'}</span>
            </div>
            <div className='flex justify-between text-sm mb-3 text-gray-500'>
              <span>Price</span>
              <span>€ {selected?.price_before_vat || '00'}</span>
            </div>
            <div className='flex justify-between text-lg font-bold border-t pt-3 text-gray-400'></div>
          </div>
          <div className='px-6 pb-6 space-x-4 grid-cols-2 mx-auto flex items-center justify-center'>
            <button
              onClick={() => setSelected('')}
              className='w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition'
            >
              ← Back
            </button>
            <button className='w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition'>
              Continue →
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Expandable Sticky Card */}
      {showMobilePanel && (
        <div className='fixed inset-0 z-40 flex items-end md:hidden'>
          {/* Overlay */}
          <div
            className='absolute inset-0 bg-black bg-opacity-40'
            onClick={() => setShowMobilePanel(false)}
          />
          {/* Panel */}
          <div className='relative w-full bg-white rounded-t-2xl shadow-2xl p-4 animate-slide-up'>
            <div className='bg-gradient-to-br from-gray-900 to-gray-900 p-5 flex flex-col items-center rounded-xl'>
              <img
                src={
                  selected?.image ||
                  'https://yozbrydxdlcxghkphhtq.supabase.co/storage/v1/object/public/skips/skip-sizes/4-yarder-skip.jpg'
                }
                alt={selected?.name || 'Card'}
                className='w-full object-contain rounded-md mb-3 shadow'
              />
            </div>
            <div className='px-2 py-4'>
              <div className='flex justify-between text-sm mb-1 text-gray-500'>
                <span>Yard Skip</span>
                <span>{selected?.size || '00.00'}</span>
              </div>
              <div className='flex justify-between text-sm mb-1 text-gray-500'>
                <span>Hire Period</span>
                <span>{selected?.hire_period_days || '00.00'}</span>
              </div>
              <div className='flex justify-between text-sm mb-3 text-gray-500'>
                <span>Price</span>
                <span>€ {selected?.price_before_vat || '00'}</span>
              </div>
            </div>
            <div className='px-2 pb-2 space-x-4 grid-cols-2 mx-auto flex items-center justify-center'>
              <button
                onClick={() => setShowMobilePanel(false)}
                className='w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition'
              >
                Close
              </button>
              <button className='w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition'>
                Continue →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Optional: Add this CSS for a smooth slide-up animation */}
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.35s cubic-bezier(.4,0,.2,1);
        }
      `}</style>
    </div>
  )
}
