'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Link2, Upload, Sparkles, Shield, CloudUpload } from 'lucide-react'

const C = {
  bg: '#0D0B0A', surface: '#161310', surface2: '#1C1916',
  border: '#2A2520', gold: '#D4A96A', goldDim: '#9A7A4A',
  cream: '#E8D9B8', text: '#F5F0E8', muted: '#7A6E64', muted2: '#4A4440',
}

export default function LandingPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'url' | 'file'>('url')
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <main style={{
      backgroundColor: C.bg,
      minHeight: '100vh',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '16px 16px 64px',
      boxSizing: 'border-box',
      overflowY: 'auto',
    }}>

      {/* ── TOP BRANDING: centered, top of page ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: 24,
        width: '100%',
      }}>
        {/* Dancer Image */}
        <img
          src="/ballet-dancer.png"
          alt="Ballet Dancer"
          style={{ width: 132, height: 180, objectFit: 'contain', marginBottom: -24 }}
        />


        {/* Logo */}
        <h1 style={{
          fontFamily: 'Cinzel, Cormorant Garamond, Georgia, serif',
          fontSize: 40,
          fontWeight: 300,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: C.gold,
          marginBottom: 8,
          textAlign: 'center',
          lineHeight: 1,
        }}>Motion Lore</h1>

        <p style={{
          fontSize: 10.5,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: C.muted,
          marginBottom: 10,
          textAlign: 'center',
        }}>AI-Powered Ballet Subtitle Generator</p>

        <p style={{
          fontSize: 13,
          color: C.muted,
          textAlign: 'center',
          lineHeight: 1.5,
          maxWidth: 380,
        }}>
          Upload a ballet video or paste a YouTube link<br />
          and we&apos;ll generate accurate, context-aware subtitles.
        </p>
      </div>

      {/* ── FORM SECTION ── */}
      <div style={{ width: '100%', maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* Card */}
        <div style={{
          backgroundColor: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          padding: 24,
          marginBottom: 16,
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, marginBottom: 20 }}>
            {(['url', 'file'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                paddingBottom: 12, paddingRight: 20,
                fontSize: 13.5, fontWeight: 500,
                color: activeTab === tab ? C.text : C.muted,
                background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: `2px solid ${activeTab === tab ? C.gold : 'transparent'}`,
                marginBottom: -1, transition: 'color 0.2s',
              }}>
                {tab === 'url' ? <Link2 size={13} /> : <Upload size={13} />}
                {tab === 'url' ? 'YouTube URL' : 'Upload File'}
              </button>
            ))}
          </div>

          {activeTab === 'url' && (
            <div>
              <input
                type="text" value={url} onChange={e => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                style={{
                  width: '100%', padding: '12px 14px',
                  backgroundColor: C.surface2, border: `1px solid ${C.border}`,
                  borderRadius: 7, color: C.text, fontSize: 13, fontFamily: 'inherit',
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '12px 0' }}>
                <div style={{ flex: 1, height: 1, backgroundColor: C.border }} />
                <span style={{ fontSize: 11.5, color: C.muted }}>or</span>
                <div style={{ flex: 1, height: 1, backgroundColor: C.border }} />
              </div>
              <DropZone dragging={dragging} fileName={fileName}
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if(f) setFileName(f.name) }}
                onClick={() => fileRef.current?.click()} />
            </div>
          )}

          {activeTab === 'file' && (
            <DropZone dragging={dragging} fileName={fileName}
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if(f) setFileName(f.name) }}
              onClick={() => fileRef.current?.click()} />
          )}

          <input ref={fileRef} type="file" accept=".mp4,.mov,.avi" style={{ display: 'none' }}
            onChange={e => setFileName(e.target.files?.[0]?.name || '')} />
        </div>

        {/* Title input */}
        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: 'block', fontSize: 10.5, fontWeight: 500,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: C.muted, marginBottom: 8,
          }}>
            Title (optional)
          </label>
          <input
            type="text" value={title} onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Swan Lake Act II"
            style={{
              width: '100%', padding: '12px 14px',
              backgroundColor: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 7, color: C.text, fontSize: 13, fontFamily: 'inherit',
            }}
          />
          <p style={{ fontSize: 10.5, color: C.muted2, marginTop: 6 }}>leave blank if unknown</p>
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push('/processing')}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '14px 24px',
            backgroundColor: C.cream, color: '#1a1510',
            border: 'none', borderRadius: 8,
            fontSize: 13.5, fontWeight: 600, letterSpacing: '0.03em',
            cursor: 'pointer', fontFamily: 'inherit', marginBottom: 16,
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
          <Sparkles size={14} />
          Generate Subtitles
        </button>

        {/* Footer */}
        <p style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 6, fontSize: 11, color: C.muted2,
        }}>
          <Shield size={11} />
          Your data is private and never stored.
        </p>
      </div>
    </main>
  )
}

function DropZone({ dragging, fileName, onDragOver, onDragLeave, onDrop, onClick }: {
  dragging: boolean; fileName: string
  onDragOver: (e: React.DragEvent) => void; onDragLeave: () => void
  onDrop: (e: React.DragEvent) => void; onClick: () => void
}) {
  return (
    <div onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 6, padding: '16px 16px',
        borderRadius: 8, cursor: 'pointer',
        border: `1.5px dashed ${dragging ? C.gold : '#2A2520'}`,
        backgroundColor: dragging ? 'rgba(212,169,106,0.05)' : 'transparent',
        transition: 'all 0.2s',
      }}>
      <CloudUpload size={20} color="#7A6E64" />
      {fileName
        ? <span style={{ fontSize: 12.5, color: '#D4A96A' }}>{fileName}</span>
        : <>
            <p style={{ fontSize: 12.5, fontWeight: 500, color: '#F5F0E8', margin: 0 }}>Drag &amp; drop a video file here</p>
            <p style={{ fontSize: 10.5, color: '#7A6E64', margin: 0 }}>MP4, MOV, AVI up to 2GB</p>
          </>}
    </div>
  )
}

const C_gold = '#D4A96A'
