import React, { useState } from 'react';
import { UserPlus, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function RegisterScreen({ onSwitchToLogin }) {
  const { registerDonor, t, lang, setLang } = useApp();
  const [step, setStep] = useState(1);

  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('male');

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');

  const [bloodType, setBloodType] = useState('A+');
  const [weight, setWeight] = useState('');
  const [chronicDiseases, setChronicDiseases] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medications, setMedications] = useState('');

  const handleSubmit = () => {
    registerDonor({
      firstName,
      lastName,
      middleName: '',
      dateOfBirth,
      gender,
      phone,
      email,
      passportNumber,
      address,
      password,
      bloodType,
      weight: Number(weight) || 0,
      chronicDiseases,
      allergies,
      medications,
    });
  };

  const toggleLang = () => {
    setLang(lang === 'cs' ? 'uk' : 'cs');
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

        <div className="mob-steps">
          {[1, 2, 3].map((s, i) => (
            <React.Fragment key={s}>
              {i > 0 && <div className="mob-step-line" />}
              <div
                className={`mob-step-dot${step === s ? ' active' : ''}${step > s ? ' done' : ''}`}
              />
            </React.Fragment>
          ))}
        </div>

        <div className="mob-card">
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>
            {stepLabels[step - 1]}
          </h3>

          {step === 1 && (
            <div className="animate-slide-right">
              <div className="mob-input-group">
                <label className="mob-input-label">{t('surname')}</label>
                <input type="text" className="mob-input" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
              <div className="mob-input-group">
                <label className="mob-input-label">{t('name')}</label>
                <input type="text" className="mob-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="mob-input-group">
                <label className="mob-input-label">{t('dob')}</label>
                <input type="date" className="mob-input" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
              </div>
              <div className="mob-input-group">
                <label className="mob-input-label">{t('gender')}</label>
                <select className="mob-select" value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="male">{t('male')}</option>
                  <option value="female">{t('female')}</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-slide-right">
              <div className="mob-input-group">
                <label className="mob-input-label">{t('phone_placeholder')}</label>
                <input type="text" className="mob-input" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div className="mob-input-group">
                <label className="mob-input-label">{t('email')}</label>
                <input type="email" className="mob-input" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="mob-input-group">
                <label className="mob-input-label">{t('passport')}</label>
                <input type="text" className="mob-input" value={passportNumber} onChange={(e) => setPassportNumber(e.target.value)} required />
              </div>
              <div className="mob-input-group">
                <label className="mob-input-label">{t('address')}</label>
                <input type="text" className="mob-input" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="mob-input-group">
                <label className="mob-input-label">{t('password_create')}</label>
                <input type="password" className="mob-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-slide-right">
              <div className="mob-input-group">
                <label className="mob-input-label">{t('blood_group')}</label>
                <select className="mob-select" value={bloodType} onChange={(e) => setBloodType(e.target.value)}>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bt) => (
                    <option key={bt} value={bt}>{bt}</option>
                  ))}
                </select>
              </div>
              <div className="mob-input-group">
                <label className="mob-input-label">{t('weight')}</label>
                <input type="number" className="mob-input" value={weight} onChange={(e) => setWeight(e.target.value)} min="30" required />
              </div>
              <div className="mob-input-group">
                <label className="mob-input-label">{t('chronic_diseases')}</label>
                <input type="text" className="mob-input" placeholder={t('none_placeholder')} value={chronicDiseases} onChange={(e) => setChronicDiseases(e.target.value)} />
              </div>
              <div className="mob-input-group">
                <label className="mob-input-label">{t('allergies')}</label>
                <input type="text" className="mob-input" placeholder={t('none_placeholder')} value={allergies} onChange={(e) => setAllergies(e.target.value)} />
              </div>
              <div className="mob-input-group">
                <label className="mob-input-label">{t('medications')}</label>
                <input type="text" className="mob-input" placeholder={t('none_placeholder')} value={medications} onChange={(e) => setMedications(e.target.value)} />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
            {step > 1 && (
              <button type="button" className="mob-btn mob-btn-outline" onClick={() => setStep(step - 1)}>
                {t('btn_back')}
              </button>
            )}
            {step < 3 ? (
              <button type="button" className="mob-btn mob-btn-primary" onClick={() => setStep(step + 1)}>
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
