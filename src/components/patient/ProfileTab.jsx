import React, { useState } from 'react';
import { User, LogOut, Globe, Sun, Moon, Pencil, Check, X, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { colors, radii, spacing } from '../../theme';

export default function ProfileTab() {
  const { getActiveDonor, logoutDonor, updateDonor, t, lang, setLang, theme, toggleTheme } = useApp();
  const donor = getActiveDonor();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  if (!donor) return null;

  const toggleLang = () => setLang(lang === 'cs' ? 'uk' : 'cs');

  const startEdit = () => {
    setForm({
      phone:           donor.phone           || '',
      email:           donor.email           || '',
      weight:          donor.weight          || '',
      chronicDiseases: donor.chronicDiseases || '',
      allergies:       donor.allergies       || '',
      medications:     donor.medications     || '',
    });
    setEditing(true);
  };

  const saveEdit = () => {
    updateDonor(donor.id, { ...form, weight: Number(form.weight) || 0 });
    setEditing(false);
  };

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="mob-content animate-fade-in" style={{ paddingBottom: '2rem' }}>

      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.md }}>
        <button
          className="mob-btn-ghost"
          onClick={toggleTheme}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: radii.md, border: `1px solid ${colors.border}` }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          className="mob-btn-ghost"
          onClick={toggleLang}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: radii.md, border: `1px solid ${colors.border}` }}
        >
          <Globe size={18} />
          <span style={{ fontWeight: 600 }}>{lang.toUpperCase()}</span>
        </button>
      </div>

      {/* Avatar */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div className="mob-profile-avatar">
          <User size={40} color="#fff" />
        </div>
        <h2 className="mob-profile-name">{donor.lastName} {donor.firstName}</h2>
        <div className="mob-profile-id">ID: {donor.id.slice(0, 8).toUpperCase()}</div>
      </div>

      {/* ── READ-ONLY card ── */}
      <SectionCard title={t('step_personal') || 'Osobní'} icon={<Lock size={13} color={colors.textMuted} />}>
        <InfoRow label={t('dob')        || 'Datum nar.'} value={donor.dateOfBirth} />
        <InfoRow label={t('blood_group')|| 'Krev'}       value={donor.bloodType} highlight />
      </SectionCard>

      {/* ── EDITABLE card ── */}
      <SectionCard
        title={t('step_contacts') || 'Kontakt'}
        action={
          !editing ? (
            <EditBtn onClick={startEdit} label={t('edit') || 'Upravit'} />
          ) : (
            <div style={{ display: 'flex', gap: spacing.xs }}>
              <SaveBtn onClick={saveEdit} label={t('save') || 'Uložit'} />
              <CancelBtn onClick={() => setEditing(false)} />
            </div>
          )
        }
      >
        {editing ? (
          <>
            <Field label={t('profile_phone') || 'Telefon'} type="tel"    value={form.phone}   onChange={set('phone')} />
            <Field label={t('email')             || 'E-mail'}  type="email"  value={form.email}   onChange={set('email')} />
          </>
        ) : (
          <>
            <InfoRow label={t('profile_phone') || 'Telefon'} value={donor.phone} />
            <InfoRow label={t('email')             || 'E-mail'}  value={donor.email || '—'} />
          </>
        )}
      </SectionCard>

      {/* ── EDITABLE medical card ── */}
      <SectionCard title={t('step_medical') || 'Zdravotní'}>
        {editing ? (
          <>
            <Field label={t('weight')          || 'Váha (kg)'}             type="number" value={form.weight}          onChange={set('weight')} />
            <Field label={t('chronic_diseases')|| 'Chronická onemocnění'}  type="text"   value={form.chronicDiseases} onChange={set('chronicDiseases')} placeholder={t('none_placeholder') || 'Ne'} />
            <Field label={t('allergies')       || 'Alergie'}               type="text"   value={form.allergies}       onChange={set('allergies')}       placeholder={t('none_placeholder') || 'Ne'} />
            <Field label={t('medications')     || 'Užívané léky'}          type="text"   value={form.medications}     onChange={set('medications')}     placeholder={t('none_placeholder') || 'Ne'} />
          </>
        ) : (
          <>
            <InfoRow label={t('weight')          || 'Váha'}   value={donor.weight ? `${donor.weight} kg` : '—'} />
            <InfoRow label={t('chronic_diseases')|| 'Choroby'} value={donor.chronicDiseases || '—'} />
            <InfoRow label={t('allergies')       || 'Alergie'} value={donor.allergies       || '—'} />
            <InfoRow label={t('medications')     || 'Léky'}    value={donor.medications     || '—'} />
          </>
        )}
      </SectionCard>

      {/* Logout */}
      {!editing && (
        <button
          className="mob-btn mob-btn-outline"
          style={{ marginTop: '0.5rem', borderColor: colors.danger, color: colors.danger }}
          onClick={logoutDonor}
        >
          <LogOut size={18} />
          {t('profile_logout')}
        </button>
      )}
    </div>
  );
}

/* ─── Sub-components ─── */

function SectionCard({ title, action, icon, children }) {
  return (
    <div className="mob-card" style={{ marginBottom: spacing.sm + 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{title}</h3>
          {icon}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value, highlight }) {
  return (
    <div className="mob-profile-row">
      <span className="mob-profile-label">{label}:</span>
      <span className="mob-profile-value" style={highlight ? { fontWeight: 700, color: colors.primary } : {}}>
        {value}
      </span>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <div style={{ marginBottom: spacing.sm + 4 }}>
      <label style={{
        display: 'block', fontSize: '0.72rem', fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.06em',
        color: colors.textMuted, marginBottom: spacing.xs,
      }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mob-input"
        style={{ fontSize: '0.9rem' }}
      />
    </div>
  );
}

function EditBtn({ onClick, label }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: '0.35rem',
      fontSize: '0.82rem', fontWeight: 600, color: colors.primary,
      background: colors.primarySoft, border: 'none', borderRadius: radii.md,
      padding: `${spacing.xs}px ${spacing.sm + 2}px`, cursor: 'pointer',
    }}>
      <Pencil size={13} /> {label}
    </button>
  );
}

function SaveBtn({ onClick, label }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: '0.3rem',
      fontSize: '0.82rem', fontWeight: 600, color: '#fff',
      background: colors.success, border: 'none', borderRadius: radii.md,
      padding: `${spacing.xs}px ${spacing.sm + 2}px`, cursor: 'pointer',
    }}>
      <Check size={13} /> {label}
    </button>
  );
}

function CancelBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: colors.textMuted, background: colors.bg,
      border: `1px solid ${colors.border}`, borderRadius: radii.md,
      padding: `${spacing.xs}px ${spacing.sm}px`, cursor: 'pointer',
    }}>
      <X size={14} />
    </button>
  );
}
