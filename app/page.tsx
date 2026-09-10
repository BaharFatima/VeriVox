'use client'

import { useMemo, useState } from 'react'
import {
  Activity, AlertTriangle, BarChart3, Bell, ChevronDown, CircleHelp, FileSearch,
  Fingerprint, Gauge, Headphones, LayoutDashboard, LockKeyhole, Menu, Mic2,
  MoreHorizontal, Network, PhoneCall, Radio, ShieldCheck, SlidersHorizontal,
  Sparkles, Users, Wifi, X, Zap,
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

function Waveform({ active }: { active: boolean }) {
  const heights = [10,18,27,15,34,48,26,18,40,28,16,30,50,34,18,13,29,43,23,16,35,53,31,19,25,41,22,15,30,47,26,14,20,35,25,12,18,30,21,14,28,44,25,16,33,49,29,18,24,38,22,13,20,31,18,11,17,27,14,9]
  return <div className={`waveform ${active ? 'is-active' : 'is-paused'}`} aria-label={active ? 'Live audio waveform' : 'Audio stream paused'}>{heights.map((height, index) => <span key={index} style={{ height: active ? height : Math.max(4, height / 3) }} />)}</div>
}

function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 72
  return <div className="score-ring-wrap"><svg className="score-ring" viewBox="0 0 180 180" aria-label={`Bayesian spoof score ${score}`}><circle cx="90" cy="90" r="72" className="ring-track" /><circle cx="90" cy="90" r="72" className="ring-progress" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - score)} /></svg><div className="score-value"><strong>{score.toFixed(2)}</strong><span>Bayesian spoof score</span></div></div>
}

export default function Page() {
  const [activeTab, setActiveTab] = useState('Live Guard')
  const [isConnected, setIsConnected] = useState(true)
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [autoCases, setAutoCases] = useState(true)
  const [forceDrop, setForceDrop] = useState(true)
  const [alertVisible, setAlertVisible] = useState(true)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [baselineCreated, setBaselineCreated] = useState(false)

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }
  const riskStatus = useMemo(() => isMonitoring ? 'Low risk' : 'Monitoring paused', [isMonitoring])
  const switchTab = (label: string) => { setActiveTab(label); notify(`${label} view selected`) }

  return <main className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><ShieldCheck size={20} /></div><span>Vox<span>Sentinel</span></span></div>
      <button className="workspace" onClick={() => notify('Workspace switcher opened')}><div className="workspace-avatar">AC</div><div><small>Workspace</small><strong>Acme Corp</strong></div><ChevronDown size={15} /></button>
      <nav aria-label="Primary navigation"><p className="nav-label">Monitor</p>{navItems.slice(0, 2).map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${activeTab === label ? 'active' : ''}`} onClick={() => switchTab(label)}><Icon size={18} /><span>{label}</span>{label === 'Live Guard' && <i />}</button>)}<p className="nav-label">Investigate</p>{navItems.slice(2).map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${activeTab === label ? 'active' : ''}`} onClick={() => switchTab(label)}><Icon size={18} /><span>{label}</span></button>)}</nav>
      <div className="sidebar-bottom"><button className="nav-item" onClick={() => notify('Team directory opened')}><Users size={18} /><span>Team</span></button><button className="nav-item" onClick={() => notify('Help center opened')}><CircleHelp size={18} /><span>Help center</span></button><div className="user-row"><div className="user-avatar">JD</div><div><strong>Jordan Davis</strong><small>Security lead</small></div><button className="icon-button" aria-label="Profile options" onClick={() => notify('Profile options opened')}><MoreHorizontal size={17} /></button></div></div>
    </aside>

    <section className="content">
      <header className="topbar"><div className="mobile-brand"><div className="brand-mark"><ShieldCheck size={18} /></div><strong>VoxSentinel</strong></div><div className="top-actions"><div className="system-status"><span className="pulse" /> All systems operational</div><div className="notification-wrap"><button className="icon-button" aria-label="Notifications" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen(!notificationsOpen)}><Bell size={18} /><b /></button>{notificationsOpen && <div className="popover notification-popover"><strong>Notifications</strong><span>All voice channels are healthy.</span><button onClick={() => setNotificationsOpen(false)}>Mark as read</button></div>}</div><button className="icon-button menu-button" aria-label="Menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Menu size={19} /></button><div className="top-avatar">JD</div></div>{menuOpen && <div className="popover mobile-popover"><button onClick={() => { switchTab('Analytics'); setMenuOpen(false) }}>Analytics</button><button onClick={() => { notify('Settings opened'); setMenuOpen(false) }}>Settings</button><button onClick={() => { notify('Signed out'); setMenuOpen(false) }}>Sign out</button></div>}</header>
      <div className="page-body">
        <div className="page-heading"><div><div className="eyebrow"><span className="live-dot" /> INTERCEPTION ACTIVE <span className="eyebrow-separator">/</span> LATENCY: &lt;50MS</div><h1>{activeTab}</h1><p>{activeTab === 'Live Guard' ? 'Real-time voice intelligence for every conversation.' : `${activeTab} workspace and controls.`}</p></div><div className="heading-actions"><button className="secondary-button" onClick={() => { setIsMonitoring(!isMonitoring); notify(isMonitoring ? 'Monitor paused' : 'Monitor resumed') }}><Radio size={16} />{isMonitoring ? 'Pause monitor' : 'Resume monitor'}</button><button className="primary-button" onClick={() => { setBaselineCreated(true); notify('New voice baseline created') }}><Zap size={16} />{baselineCreated ? 'Baseline ready' : 'New baseline'}</button></div></div>
        {alertVisible && <div className="alert-strip" role="status"><div className="alert-icon"><Activity size={17} /></div><div><strong>{isMonitoring ? 'Monitoring is active' : 'Monitoring is paused'}</strong><span>{isMonitoring ? 'Incoming streams are being analyzed across all voice channels.' : 'Resume monitoring to analyze incoming voice streams.'}</span></div><button aria-label="Dismiss alert" onClick={() => setAlertVisible(false)}><X size={16} /></button></div>}
        <div className="dashboard-grid">
          <section className="panel risk-panel"><div className="panel-header"><div><span className="section-kicker">CURRENT SESSION</span><h2>Risk overview</h2></div><button className="more-button" aria-label="More options" onClick={() => notify('Risk options opened')}><MoreHorizontal size={19} /></button></div><div className="risk-content"><ScoreRing score={isMonitoring ? 0.18 : 0} /><div className="risk-copy"><span className="status-pill safe"><span />{riskStatus}</span><h3>{isMonitoring ? 'Conversation appears authentic' : 'Analysis is paused'}</h3><p>{isMonitoring ? 'All models are in agreement. No synthetic voice markers detected in the current session.' : 'Resume the monitor to continue checking for synthetic voice markers.'}</p><div className="mini-stat"><span>Confidence</span><strong>{isMonitoring ? '91.4%' : '—'}</strong><div className="meter"><i style={{ width: isMonitoring ? '91.4%' : '0%' }} /></div></div></div></div><div className="risk-footer"><span><LockKeyhole size={14} /> Session encrypted</span><span><Wifi size={14} /> WebRTC {isConnected ? 'connected' : 'disconnected'}</span><span>Updated just now</span></div></section>
          <section className="panel call-panel"><div className="panel-header"><div><span className="section-kicker">ACTIVE CALL</span><h2>Voice stream</h2></div><span className={`live-badge ${!isConnected ? 'ended' : ''}`}><span className="pulse" /> {isConnected ? 'LIVE' : 'ENDED'}</span></div><div className="caller"><div className="caller-avatar"><Headphones size={25} /></div><div><h3>Unknown caller</h3><p>+1 (415) 555-0182 <span>·</span> San Francisco, CA</p></div><button className="more-button" aria-label="Caller options" onClick={() => notify('Caller options opened')}><MoreHorizontal size={19} /></button></div><div className="wave-wrap"><div className="wave-top"><span>INCOMING AUDIO</span><span className="codec"><Mic2 size={13} /> OPUS · 48KHZ</span></div><Waveform active={isConnected && isMonitoring} /><div className="wave-time"><span>00:42</span><span>02:18</span></div></div><div className="call-meta"><div><small>STREAM</small><strong><span className="tiny-green" /> RTP / WebRTC</strong></div><div><small>ENCRYPTION</small><strong><LockKeyhole size={12} /> SRTP</strong></div><div><small>CHANNEL</small><strong>PBX · 04</strong></div></div><button className={`sever-button ${!isConnected ? 'ended' : ''}`} onClick={() => { setIsConnected(!isConnected); notify(isConnected ? 'Connection severed' : 'Connection restored') }}><PhoneCall size={16} />{isConnected ? 'Sever connection' : 'Restore connection'}</button></section>
          <section className="panel models-panel"><div className="panel-header"><div><span className="section-kicker">MULTI-MODEL ANALYSIS</span><h2>Signal intelligence</h2></div><button className="view-link" onClick={() => switchTab('Analytics')}>View analytics <span>→</span></button></div><div className="model-list">{modelScores.map((model) => <div className="model-row" key={model.name}><div className="model-icon"><Sparkles size={15} /></div><div className="model-name"><strong>{model.name}</strong><span>{model.detail}</span></div><div className="model-score"><strong>{isMonitoring ? model.score : '—'}</strong><span>{isMonitoring ? model.status : 'Paused'}</span></div><div className="score-bar"><i style={{ width: isMonitoring ? `${Number(model.score) * 100}%` : '0%' }} /></div></div>)}</div><div className="models-foot"><span><Gauge size={14} /> 4 models synchronized</span><span>Last inference 120ms ago</span></div></section>
          <section className="panel controls-panel"><div className="panel-header"><div><span className="section-kicker">AUTOMATION</span><h2>Response controls</h2></div><button className="view-link" onClick={() => switchTab('SOAR Rules')}>Manage rules <span>→</span></button></div><div className="control-list"><div className="control-row"><div className="control-leading"><div className="control-icon amber"><AlertTriangle size={16} /></div><div><strong>Elevated risk alerts</strong><span>Notify your security team</span></div></div><button className={`toggle ${alertsEnabled ? 'on' : ''}`} onClick={() => { setAlertsEnabled(!alertsEnabled); notify(`Elevated risk alerts ${alertsEnabled ? 'disabled' : 'enabled'}`) }} aria-label="Toggle elevated risk alerts"><i /></button></div><div className="control-row"><div className="control-leading"><div className="control-icon blue"><Network size={16} /></div><div><strong>Auto-create cases</strong><span>Open a case above 0.70</span></div></div><button className={`toggle ${autoCases ? 'on' : ''}`} onClick={() => setAutoCases(!autoCases)} aria-label="Toggle auto-create cases"><i /></button></div><div className="control-row"><div className="control-leading"><div className="control-icon green"><ShieldCheck size={16} /></div><div><strong>Force connection drop</strong><span>Critical spoof threshold</span></div></div><button className={`toggle ${forceDrop ? 'on' : ''}`} onClick={() => setForceDrop(!forceDrop)} aria-label="Toggle force connection drop"><i /></button></div></div></section>
        </div>
        <div className="bottom-note"><span><ShieldCheck size={14} /> Protected by VoxSentinel inference engine</span><span>Data processed in-region · SOC 2 Type II</span></div>
      </div>
      <nav className="mobile-nav" aria-label="Mobile navigation">{navItems.map(({ label, icon: Icon }) => <button key={label} className={activeTab === label ? 'active' : ''} onClick={() => switchTab(label)}><Icon size={17} /><span>{label.replace('Voice Baselines', 'Baselines')}</span></button>)}</nav>
      {toast && <div className="toast" role="status"><ShieldCheck size={15} />{toast}</div>}
    </section>
  </main>
}
