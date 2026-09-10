'use client'

import { useState } from 'react'
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  ChevronDown,
  CircleHelp,
  FileSearch,
  Fingerprint,
  Gauge,
  Headphones,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  Mic2,
  MoreHorizontal,
  Network,
  PhoneCall,
  Play,
  Radio,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  Wifi,
  X,
  Zap,
} from 'lucide-react'

const navItems = [
  { label: 'Live Guard', icon: LayoutDashboard },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'SOAR Rules', icon: SlidersHorizontal },
  { label: 'Voice Baselines', icon: Fingerprint },
  { label: 'Forensics', icon: FileSearch },
]

const modelScores = [
  { name: 'AASIST attention', score: '0.18', detail: 'Temporal + spectral', status: 'Low risk' },
  { name: 'SSL fusion', score: '0.24', detail: 'WavLM · HuBERT', status: 'Low risk' },
  { name: 'Bispectrum', score: '0.31', detail: 'Phase coupling', status: 'Low risk' },
  { name: 'Acoustic baseline', score: '0.09', detail: 'Cosine similarity', status: 'Verified' },
]

function Waveform() {
  const heights = [10, 18, 27, 15, 34, 48, 26, 18, 40, 28, 16, 30, 50, 34, 18, 13, 29, 43, 23, 16, 35, 53, 31, 19, 25, 41, 22, 15, 30, 47, 26, 14, 20, 35, 25, 12, 18, 30, 21, 14, 28, 44, 25, 16, 33, 49, 29, 18, 24, 38, 22, 13, 20, 31, 18, 11, 17, 27, 14, 9]
  return <div className="waveform" aria-label="Live audio waveform">{heights.map((height, index) => <span key={index} style={{ height }} />)}</div>
}

function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 72
  return (
    <div className="score-ring-wrap">
      <svg className="score-ring" viewBox="0 0 180 180" aria-label={`Bayesian spoof score ${score}`}>
        <circle cx="90" cy="90" r="72" className="ring-track" />
        <circle cx="90" cy="90" r="72" className="ring-progress" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - score)} />
      </svg>
      <div className="score-value"><strong>{score.toFixed(2)}</strong><span>Bayesian spoof score</span></div>
    </div>
  )
}

export default function Page() {
  const [activeTab, setActiveTab] = useState('Live Guard')
  const [isConnected, setIsConnected] = useState(true)
  const [isLive, setIsLive] = useState(true)

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><ShieldCheck size={20} /></div><span>Vox<span>Sentinel</span></span></div>
        <div className="workspace"><div className="workspace-avatar">AC</div><div><small>Workspace</small><strong>Acme Corp</strong></div><ChevronDown size={15} /></div>
        <nav aria-label="Primary navigation">
          <p className="nav-label">Monitor</p>
          {navItems.slice(0, 2).map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${activeTab === label ? 'active' : ''}`} onClick={() => setActiveTab(label)}><Icon size={18} /><span>{label}</span>{label === 'Live Guard' && <i />}</button>)}
          <p className="nav-label">Investigate</p>
          {navItems.slice(2).map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${activeTab === label ? 'active' : ''}`} onClick={() => setActiveTab(label)}><Icon size={18} /><span>{label}</span></button>)}
        </nav>
        <div className="sidebar-bottom"><button className="nav-item"><Users size={18} /><span>Team</span></button><button className="nav-item"><CircleHelp size={18} /><span>Help center</span></button><div className="user-row"><div className="user-avatar">JD</div><div><strong>Jordan Davis</strong><small>Security lead</small></div><MoreHorizontal size={17} /></div></div>
      </aside>

      <section className="content">
        <header className="topbar"><div className="mobile-brand"><div className="brand-mark"><ShieldCheck size={18} /></div><strong>VoxSentinel</strong></div><div className="top-actions"><div className="system-status"><span className="pulse" /> All systems operational</div><button className="icon-button" aria-label="Notifications"><Bell size={18} /><b /></button><button className="icon-button menu-button" aria-label="Menu"><Menu size={19} /></button><div className="top-avatar">JD</div></div></header>
        <div className="page-body">
          <div className="page-heading"><div><div className="eyebrow"><span className="live-dot" /> INTERCEPTION ACTIVE <span className="eyebrow-separator">/</span> LATENCY: &lt;50MS</div><h1>Live Guard</h1><p>Real-time voice intelligence for every conversation.</p></div><div className="heading-actions"><button className="secondary-button"><Radio size={16} />Test monitor</button><button className="primary-button"><Zap size={16} />New baseline</button></div></div>

          <div className="alert-strip"><div className="alert-icon"><Activity size={17} /></div><div><strong>Monitoring is active</strong><span>Incoming streams are being analyzed across all voice channels.</span></div><button aria-label="Dismiss"><X size={16} /></button></div>

          <div className="dashboard-grid">
            <section className="panel risk-panel"><div className="panel-header"><div><span className="section-kicker">CURRENT SESSION</span><h2>Risk overview</h2></div><button className="more-button" aria-label="More options"><MoreHorizontal size={19} /></button></div><div className="risk-content"><ScoreRing score={0.18} /><div className="risk-copy"><span className="status-pill safe"><span />Low risk</span><h3>Conversation appears authentic</h3><p>All models are in agreement. No synthetic voice markers detected in the current session.</p><div className="mini-stat"><span>Confidence</span><strong>91.4%</strong><div className="meter"><i style={{ width: '91.4%' }} /></div></div></div></div><div className="risk-footer"><span><LockKeyhole size={14} /> Session encrypted</span><span><Wifi size={14} /> WebRTC connected</span><span>Updated just now</span></div></section>

            <section className="panel call-panel"><div className="panel-header"><div><span className="section-kicker">ACTIVE CALL</span><h2>Voice stream</h2></div><span className="live-badge"><span className="pulse" /> LIVE</span></div><div className="caller"><div className="caller-avatar"><Headphones size={25} /></div><div><h3>Unknown caller</h3><p>+1 (415) 555-0182 <span>·</span> San Francisco, CA</p></div><button className="more-button" aria-label="Caller options"><MoreHorizontal size={19} /></button></div><div className="wave-wrap"><div className="wave-top"><span>INCOMING AUDIO</span><span className="codec"><Mic2 size={13} /> OPUS · 48KHZ</span></div><Waveform /><div className="wave-time"><span>00:42</span><span>02:18</span></div></div><div className="call-meta"><div><small>STREAM</small><strong><span className="tiny-green" /> RTP / WebRTC</strong></div><div><small>ENCRYPTION</small><strong><LockKeyhole size={12} /> SRTP</strong></div><div><small>CHANNEL</small><strong>PBX · 04</strong></div></div><button className={`sever-button ${!isConnected ? 'ended' : ''}`} onClick={() => setIsConnected(false)}><PhoneCall size={16} />{isConnected ? 'Sever connection' : 'Connection severed'}</button></section>

            <section className="panel models-panel"><div className="panel-header"><div><span className="section-kicker">MULTI-MODEL ANALYSIS</span><h2>Signal intelligence</h2></div><button className="view-link" onClick={() => setActiveTab('Analytics')}>View analytics <span>→</span></button></div><div className="model-list">{modelScores.map((model) => <div className="model-row" key={model.name}><div className="model-icon"><Sparkles size={15} /></div><div className="model-name"><strong>{model.name}</strong><span>{model.detail}</span></div><div className="model-score"><strong>{model.score}</strong><span>{model.status}</span></div><div className="score-bar"><i style={{ width: `${Number(model.score) * 100}%` }} /></div></div>)}</div><div className="models-foot"><span><Gauge size={14} /> 4 models synchronized</span><span>Last inference 120ms ago</span></div></section>

            <section className="panel controls-panel"><div className="panel-header"><div><span className="section-kicker">AUTOMATION</span><h2>Response controls</h2></div><button className="view-link" onClick={() => setActiveTab('SOAR Rules')}>Manage rules <span>→</span></button></div><div className="control-list"><div className="control-row"><div className="control-leading"><div className="control-icon amber"><AlertTriangle size={16} /></div><div><strong>Elevated risk alerts</strong><span>Notify your security team</span></div></div><button className={`toggle ${isLive ? 'on' : ''}`} onClick={() => setIsLive(!isLive)} aria-label="Toggle elevated risk alerts"><i /></button></div><div className="control-row"><div className="control-leading"><div className="control-icon blue"><Network size={16} /></div><div><strong>Auto-create cases</strong><span>Open a case above 0.70</span></div></div><button className="toggle on" aria-label="Auto-create cases enabled"><i /></button></div><div className="control-row"><div className="control-leading"><div className="control-icon green"><ShieldCheck size={16} /></div><div><strong>Force connection drop</strong><span>Critical spoof threshold</span></div></div><button className="toggle on" aria-label="Force connection drop enabled"><i /></button></div></div></section>
          </div>

          <div className="bottom-note"><span><ShieldCheck size={14} /> Protected by VoxSentinel inference engine</span><span>Data processed in-region · SOC 2 Type II</span></div>
        </div>
        <nav className="mobile-nav">{navItems.map(({ label, icon: Icon }) => <button key={label} className={activeTab === label ? 'active' : ''} onClick={() => setActiveTab(label)}><Icon size={17} /><span>{label.replace('Voice Baselines', 'Baselines')}</span></button>)}</nav>
      </section>
    </main>
  )
}
