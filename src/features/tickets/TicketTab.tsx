import { useState } from 'react';
import type { CSSProperties } from 'react';
import { useStore } from '@/app/store';
import { submitTicket } from '@/services/api';
import { v4 as uuid } from 'uuid';

export function TicketTab() {
  const robots = useStore((s) => s.robots);
  const addToast = useStore((s) => s.addToast);
  const appendAudit = useStore((s) => s.appendAudit);

  const [robotId, setRobotId] = useState('R-001');
  const [ticketType, setTicketType] = useState('robot_repair');
  const [severity, setSeverity] = useState('MEDIUM');
  const [details, setDetails] = useState('');
  const [camFaultId, setCamFaultId] = useState('R001-F · Front');

  const handleSubmit = async () => {
    if (!details.trim()) {
      addToast('Please add ticket details', 'warn');
      return;
    }
    try {
      const result = await submitTicket({ robotId, type: ticketType, severity, details });
      addToast(`Ticket submitted: ${robotId} · ${ticketType} · ${severity}`, 'success');
      appendAudit({
        id: uuid(),
        type: 'repair',
        ts: new Date().toISOString(),
        robotId,
        body: `Ticket ${result.ticketId}: ${robotId} · ${ticketType} · ${severity} · "${details.slice(0, 40)}..."`,
      });
      setDetails('');
    } catch {
      addToast('Failed to submit ticket', 'error');
    }
  };

  const handleCamFault = () => {
    addToast(`Camera fault logged: ${camFaultId}`, 'warn');
    appendAudit({
      id: uuid(),
      type: 'camera',
      ts: new Date().toISOString(),
      body: `Camera fault: ${camFaultId} · feed loss event`,
    });
  };

  const inputStyle: CSSProperties = {
    width: '100%',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '10px',
    padding: '6px 8px',
    marginBottom: '8px',
    outline: 'none',
    transition: 'border-color 0.15s',
  };

  const labelStyle: CSSProperties = {
    fontSize: '9px',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '5px',
    display: 'block',
  };

  return (
    <div style={{ padding: '12px' }}>
      <div style={{ fontSize: '9px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
        Raise Ticket / Fault Report
      </div>

      <label style={labelStyle}>Robot ID</label>
      <select value={robotId} onChange={(e) => setRobotId(e.target.value)} style={inputStyle}>
        {robots.map((r) => (
          <option key={r.id} value={r.id}>{r.id}</option>
        ))}
      </select>

      <label style={labelStyle}>Type</label>
      <select value={ticketType} onChange={(e) => setTicketType(e.target.value)} style={inputStyle}>
        <option value="robot_repair">Robot Repair</option>
        <option value="camera_fault">Camera Fault</option>
        <option value="behavior_flag">Behavior Flag</option>
        <option value="injury_report">Injury Report</option>
        <option value="other">Other</option>
      </select>

      <label style={labelStyle}>Severity</label>
      <select value={severity} onChange={(e) => setSeverity(e.target.value)} style={inputStyle}>
        <option>LOW</option>
        <option>MEDIUM</option>
        <option>HIGH</option>
        <option>CRITICAL</option>
      </select>

      <label style={labelStyle}>Details</label>
      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="Describe the issue..."
        style={{
          ...inputStyle,
          height: '60px',
          resize: 'none',
        }}
      />

      <button
        onClick={handleSubmit}
        style={{
          width: '100%',
          background: 'var(--cyan-glow)',
          border: '1px solid var(--cyan-dim)',
          color: 'var(--cyan)',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '10px',
          fontWeight: 600,
          padding: '7px',
          cursor: 'pointer',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          transition: 'all 0.15s',
        }}
      >
        Submit Ticket →
      </button>

      {/* Camera fault section */}
      <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '9px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
          Report Faulty Camera
        </div>
        <select value={camFaultId} onChange={(e) => setCamFaultId(e.target.value)} style={inputStyle}>
          <option>R001-F · Front</option>
          <option>R001-B · Back</option>
          <option>R002-F · Front</option>
          <option>R002-B · Back</option>
        </select>
        <button
          onClick={handleCamFault}
          style={{
            width: '100%',
            background: 'var(--red-glow)',
            border: '1px solid var(--red)',
            color: 'var(--red)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            fontWeight: 600,
            padding: '7px',
            cursor: 'pointer',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            transition: 'all 0.15s',
          }}
        >
          Report Camera Fault →
        </button>
      </div>
    </div>
  );
}
