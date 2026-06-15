import React, { useState } from 'react';
import { UserPlus, Globe, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function RegisterScreen({ onSwitchToLogin }) {
  const { registerDonor, t, lang, setLang } = useApp();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const [lastName, setLastName]       = useState('');
  const [firstName, setFirstName]     = useState('');
  const [dobDay, setDobDay]           = useState('');
  const [dobMonth, setDobMonth]       = useState('');
  const [dobYear, setDobYear]         = useState('');
  const [gender, setGender]           = useState('male');

  const [phone, setPhone]       = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [bloodType, setBloodType]           = useState('A+');
  const [weight, setWeight]                 = useState('');
  const [chronicDiseases, setChronicDiseases] = useState('');
  const [allergies, setAllergies]           = useState('');
  const [medications, setMedications]       = useState('');

  const toggleLang = () => setLang(lang === 'cs' ? 'uk' : 'cs');

  const validate = () => {
    if (step === 1) {
      if (!lastName.trim())   return t('error_required_surname')   || 'Zadejte příjmení.';
      if (!firstName.trim())  return t('error_required_name')      || 'Zadejte jméno.';
      if (!dobDay || !dobMonth || !dobYear || dobYear.length !== 4) return t('error_required_dob') || 'Zadejte platné datum narození.';
    }
    if (step === 2) {
      if (!phone.trim())      return t('error_required_phone')     || 'Zadejte telefonní číslo.';
      if (!email.trim())      return t('error_required_email')     || 'Zadejte e-mail.';
      if (!password.trim())   return t('error_required_password')  || 'Zadejte heslo.';
      if (password.length < 6) return t('error_password_short')   || 'Heslo musí mít alespoň 6 znaků.';
      if (password !== confirmPassword) return t('error_password_match') || 'Hesla se neshodují.';
    }
    if (step === 3) {
      if (!weight || Number(weight) < 30) return t('error_required_weight') || 'Zadejte váhu (min. 30 kg).';
    }
    return null;
  };

  const handleNext = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    try {
      await registerDonor({
        firstName,
        lastName,
        middleName: '',
        dateOfBirth: `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}`,
        gender,
        phone,
        email,
        password,
        bloodType,
        weight: Number(weight) || 0,
        chronicDiseases,
        allergies,
        medications,
      });
    } catch (e) {
      setError(e.message || "Registration failed");
    }
  };

  const stepLabels = [t('step_personal'), t('step_contacts'), t('step_medical')];

  return (
    <div className="mob-scroll">
      <div className="mob-content animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem' }}>
          <button className="mob-btn-ghost" onClick={toggleLang} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: '8px' }}>
            <Globe size={18} />
            <span style={{ fontWeight: 600 }}>{lang.toUpperCase()}</span>
          </button>
        </div>

        <div className="mob-login-hero" style={{ paddingTop: '0.5rem', paddingBottom: '1rem' }}>
          <div className="mob-login-logo">
            <UserPlus size={28} color="#fff" />
          </div>
          <h1 className="mob-login-title" style={{ fontSize: '1.4rem' }}>{t('register_title')}</h1>
        </div>

        {/* Step dots */}
        <div className="mob-steps">
          {[1, 2, 3].map((s, i) => (
            <React.Fragment key={s}>
              {i > 0 && <div className="mob-step-line" />}
              <div className={`mob-step-dot${step === s ? ' active' : ''}${step > s ? ' done' : ''}`} />
            </React.Fragment>
          ))}
        </div>

        <div className="mob-card">
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>
            {stepLabels[step - 1]}
          </h3>

          {/* Error banner */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)',
              borderRadius: '8px', padding: '0.6rem 0.75rem',
              marginBottom: '1rem', fontSize: '0.85rem', color: '#DC2626',
            }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="animate-slide-right">
              <div className="mob-input-group">
                <label className="mob-input-label">{t('surname')} *</label>
                <input type="text" className="mob-input" value={lastName} onChange={e => { setLastName(e.target.value); setError(''); }} />
              </div>
              <div className="mob-input-group">
                <label className="mob-input-label">{t('name')} *</label>
                <input type="text" className="mob-input" value={firstName} onChange={e => { setFirstName(e.target.value); setError(''); }} />
              </div>
              <div className="mob-input-group">
                <label className="mob-input-label">{t('dob')} *</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="tel" className="mob-input" placeholder="DD" maxLength={2} value={dobDay} onChange={e => { setDobDay(e.target.value.replace(/\D/g, '')); setError(''); }} style={{ flex: 1, textAlign: 'center' }} />
                  <input type="tel" className="mob-input" placeholder="MM" maxLength={2} value={dobMonth} onChange={e => { setDobMonth(e.target.value.replace(/\D/g, '')); setError(''); }} style={{ flex: 1, textAlign: 'center' }} />
                  <input type="tel" className="mob-input" placeholder="YYYY" maxLength={4} value={dobYear} onChange={e => { setDobYear(e.target.value.replace(/\D/g, '')); setError(''); }} style={{ flex: 2, textAlign: 'center' }} />
                </div>
              </div>
              <div className="mob-input-group">
                <label className="mob-input-label">{t('gender')}</label>
                <select className="mob-select" value={gender} onChange={e => setGender(e.target.value)}>
                  <option value="male">{t('male')}</option>
                  <option value="female">{t('female')}</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-slide-right">
              <div className="mob-input-group">
                <label className="mob-input-label">{t('phone_placeholder')} *</label>
                <input type="tel" className="mob-input" value={phone} onChange={e => { setPhone(e.target.value); setError(''); }} />
              </div>
              <div className="mob-input-group">
                <label className="mob-input-label">{t('email')} *</label>
                <input type="email" className="mob-input" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} />
              </div>
              <div className="mob-input-group">
                <label className="mob-input-label">{t('password_create')} *</label>
                <input type="password" className="mob-input" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} />
              </div>
              <div className="mob-input-group">
                <label className="mob-input-label">{t('password_confirm')} *</label>
                <input type="password" className="mob-input" value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); setError(''); }} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-slide-right">
              <div className="mob-input-group">
                <label className="mob-input-label">{t('blood_group')}</label>
                <select className="mob-select" value={bloodType} onChange={e => setBloodType(e.target.value)}>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bt => (
                    <option key={bt} value={bt}>{bt}</option>
                  ))}
                </select>
              </div>
              <div className="mob-input-group">
                <label className="mob-input-label">{t('weight')} *</label>
                <input type="number" className="mob-input" value={weight} onChange={e => { setWeight(e.target.value); setError(''); }} min="30" />
              </div>
              <div className="mob-input-group">
                <label className="mob-input-label">{t('chronic_diseases')}</label>
                <input type="text" className="mob-input" placeholder={t('none_placeholder')} value={chronicDiseases} onChange={e => setChronicDiseases(e.target.value)} />
              </div>
              <div className="mob-input-group">
                <label className="mob-input-label">{t('allergies')}</label>
                <input type="text" className="mob-input" placeholder={t('none_placeholder')} value={allergies} onChange={e => setAllergies(e.target.value)} />
              </div>
              <div className="mob-input-group">
                <label className="mob-input-label">{t('medications')}</label>
                <input type="text" className="mob-input" placeholder={t('none_placeholder')} value={medications} onChange={e => setMedications(e.target.value)} />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
            {step > 1 && (
              <button type="button" className="mob-btn mob-btn-outline" onClick={() => { setError(''); setStep(step - 1); }}>
                {t('btn_back')}
              </button>
            )}
            {step < 3 ? (
              <button type="button" className="mob-btn mob-btn-primary" onClick={handleNext}>
                {t('btn_next')}
              </button>
            ) : (
              <button type="button" className="mob-btn mob-btn-primary" onClick={handleSubmit}>
                {t('btn_create_account')}
              </button>
            )}
          </div>
        </div>

        <button type="button" className="mob-btn mob-btn-ghost" onClick={onSwitchToLogin} style={{ marginTop: '0.5rem' }}>
          {t('have_account')}
        </button>
        <div style={{ height: '3rem', flexShrink: 0, width: '100%' }} />
      </div>
    </div>
  );
}
