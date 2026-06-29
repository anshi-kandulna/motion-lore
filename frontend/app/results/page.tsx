'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, ChevronDown, ChevronUp, Play, Volume2, Settings, Maximize2, MoreVertical, Download, ArrowLeft, Pause } from 'lucide-react'

const C = {
  bg: '#0D0B0A', surface: '#161310', surface2: '#1C1916',
  border: '#2A2520', gold: '#D4A96A', goldDim: '#9A7A4A',
  cream: '#E8D9B8', text: '#F5F0E8', muted: '#7A6E64', muted2: '#4A4440',
}

const SUBS = [
  { time: '01:15:04', tag: 'PANTOMIME', text: 'She extends her arms, as if reaching for his promise.' },
  { time: '01:18:12', tag: 'EMOTION',   text: 'A flicker of doubt crosses her face.' },
  { time: '01:21:30', tag: 'NARRATIVE', text: 'The lake shimmers as the spell is cast.' },
  { time: '01:24:08', tag: 'PANTOMIME', text: 'He kneels before her, offering his devotion.' },
  { time: '01:27:42', tag: 'EMOTION',   text: 'Her expression softens with grace and sorrow.' },
  { time: '01:30:11', tag: 'NARRATIVE', text: 'The moon rises, and the enchantment deepens.' },
  { time: '01:33:47', tag: 'PANTOMIME', text: 'She turns away, torn between love and fate.' },
  { time: '01:36:22', tag: 'EMOTION',   text: 'A wave of longing fills the silence.' },
]

const TAG: Record<string, { bg: string; color: string }> = {
  PANTOMIME: { bg: '#3D2B1A', color: '#D4A96A' },
  EMOTION:   { bg: '#1A1F3D', color: '#7A9BD4' },
  NARRATIVE: { bg: '#1A2D1F', color: '#6DBF8A' },
}

export default function ResultsPage() {
  const router = useRouter()
  const [contextOpen, setContextOpen] = useState(true)
  const [exportOpen, setExportOpen] = useState(false)
  const [activeRow, setActiveRow] = useState(0)
  const [playing, setPlaying] = useState(false)

  return (
    <main style={{
      backgroundColor: C.bg, minHeight: '100vh',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '0',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 24px 48px' }}>

        {/* Back button */}
        <button onClick={() => router.push('/')} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 12, color: C.muted, background: 'none', border: 'none',
          cursor: 'pointer', marginBottom: 24, fontFamily: 'inherit',
        }}>
          <ArrowLeft size={13} /> New video
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <button onClick={() => setContextOpen(o => !o)} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 13, fontWeight: 500, color: C.text,
            background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          }}>
            <BookOpen size={15} color={C.gold} />
            Ballet Context
            {contextOpen
              ? <ChevronUp size={14} color={C.muted} />
              : <ChevronDown size={14} color={C.muted} />}
          </button>

          {/* Export */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setExportOpen(o => !o)} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '8px 14px', borderRadius: 7,
              backgroundColor: C.surface, border: `1px solid ${C.border}`,
              color: C.text, fontSize: 13, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <Download size={13} /> Export <ChevronDown size={12} color={C.muted} />
            </button>
            {exportOpen && (
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 4px)',
                backgroundColor: C.surface2, border: `1px solid ${C.border}`,
                borderRadius: 7, overflow: 'hidden', zIndex: 50, width: 148,
              }}>
                {['Export as SRT', 'Export as JSON'].map((opt, i) => (
                  <button key={opt} onClick={() => setExportOpen(false)} style={{
                    width: '100%', textAlign: 'left', padding: '11px 14px',
                    fontSize: 13, color: C.text, background: 'none',
                    border: 'none', borderBottom: i === 0 ? `1px solid ${C.border}` : 'none',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}>
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Metadata */}
        {contextOpen && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
            padding: '16px 20px', borderRadius: 8, marginBottom: 16,
            backgroundColor: C.surface, border: `1px solid ${C.border}`,
          }}>
            {[
              { label: 'Title', value: 'Swan Lake' },
              { label: 'Setting', value: 'Enchanted Lake' },
              { label: 'Tone', value: 'Melancholic, Romantic' },
              { label: 'Characters', value: 'Odette (Swan Queen), Prince Siegfried, Rothbart' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontSize: 11, color: C.muted, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                <p style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Video Player */}
        <div style={{
          borderRadius: 10, overflow: 'hidden', marginBottom: 12,
          border: `1px solid ${C.border}`, backgroundColor: '#090807',
        }}>
          {/* Video area */}
          <div style={{
            position: 'relative', height: 360,
            background: 'linear-gradient(160deg, #0D1520 0%, #090807 55%, #10080C 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Placeholder dancer */}
            <svg width="70" height="100" viewBox="0 0 70 100" fill="none" style={{ opacity: 0.15 }}>
              <circle cx="35" cy="9" r="8" fill={C.gold} />
              <line x1="35" y1="17" x2="35" y2="50" stroke={C.gold} strokeWidth="2.5"/>
              <line x1="35" y1="30" x2="12" y2="20" stroke={C.gold} strokeWidth="2.5"/>
              <line x1="35" y1="30" x2="60" y2="18" stroke={C.gold} strokeWidth="2.5"/>
              <line x1="35" y1="50" x2="18" y2="80" stroke={C.gold} strokeWidth="2.5"/>
              <line x1="35" y1="50" x2="52" y2="80" stroke={C.gold} strokeWidth="2.5"/>
              <line x1="18" y1="80" x2="6" y2="68" stroke={C.gold} strokeWidth="2"/>
              <line x1="52" y1="80" x2="66" y2="92" stroke={C.gold} strokeWidth="2"/>
            </svg>

            {/* Subtitle overlay */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '48px 32px 20px',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.75))',
              textAlign: 'center',
            }}>
              <p style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: 20, fontWeight: 400, fontStyle: 'italic',
                color: C.text, textShadow: '0 2px 12px rgba(0,0,0,0.9)',
                lineHeight: 1.4,
              }}>
                {SUBS[activeRow].text}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 16px', borderTop: `1px solid ${C.border}`,
            backgroundColor: C.surface,
          }}>
            <button onClick={() => setPlaying(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              {playing
                ? <Pause size={16} fill={C.text} color={C.text} />
                : <Play size={16} fill={C.text} color={C.text} />}
            </button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Volume2 size={15} color={C.text} />
            </button>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: C.muted, flexShrink: 0 }}>01:15:04</span>

            {/* Scrubber */}
            <div style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: C.border, position: 'relative', cursor: 'pointer' }}>
              <div style={{ width: '46%', height: '100%', borderRadius: 2, backgroundColor: C.gold }} />
              <div style={{
                position: 'absolute', top: '50%', left: 'calc(46% - 5px)', transform: 'translateY(-50%)',
                width: 10, height: 10, borderRadius: '50%', backgroundColor: C.gold,
              }} />
            </div>

            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: C.muted, flexShrink: 0 }}>02:45:00</span>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Settings size={14} color={C.muted} />
            </button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Maximize2 size={14} color={C.muted} />
            </button>
          </div>
        </div>

        {/* Subtitle list */}
        <div style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${C.border}` }}>
          {SUBS.map((sub, i) => (
            <div key={i} onClick={() => setActiveRow(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', cursor: 'pointer',
                backgroundColor: activeRow === i ? C.surface2 : i % 2 === 0 ? C.surface : 'transparent',
                borderBottom: i < SUBS.length - 1 ? `1px solid ${C.border}` : 'none',
                transition: 'background-color 0.15s',
              }}>

              <button style={{ background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                <Play size={11}
                  fill={activeRow === i ? C.gold : C.muted2}
                  color={activeRow === i ? C.gold : C.muted2} />
              </button>

              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11, color: C.muted, flexShrink: 0, width: 58,
              }}>{sub.time}</span>

              <span style={{
                ...TAG[sub.tag],
                padding: '3px 8px', borderRadius: 4,
                fontSize: 10, fontWeight: 600,
                fontFamily: 'JetBrains Mono, monospace',
                letterSpacing: '0.04em',
                flexShrink: 0, width: 88, textAlign: 'center',
              }}>{sub.tag}</span>

              <span style={{
                fontSize: 13, flex: 1, lineHeight: 1.4,
                color: activeRow === i ? C.text : C.muted,
              }}>{sub.text}</span>

              <button style={{ background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                <MoreVertical size={14} color={C.muted2} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
