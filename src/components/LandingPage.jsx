import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Activity, ClipboardList } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0F0F14', color: '#FFF' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <Heart size={64} color="#DC2626" style={{ margin: '0 auto 1rem', filter: 'drop-shadow(0 0 20px rgba(220, 38, 38, 0.4))' }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>BloodLife</h1>
        <p style={{ color: '#9CA3AF', fontSize: '1.1rem' }}>Vyberte svou roli v systému</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', width: '100%', maxWidth: '1000px', padding: '0 2rem' }}>
        
        {/* Donor */}
        <div 
          onClick={() => navigate('/patient')}
          style={{ background: '#1A1A24', borderRadius: '24px', padding: '2rem', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{ background: 'rgba(220, 38, 38, 0.1)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <Heart size={40} color="#DC2626" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Dárce</h2>
          <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>Mobilní aplikace pro pacienty: rezervace, dotazník, cesta dárce.</p>
        </div>

        {/* Reception */}
        <div 
          onClick={() => navigate('/reception')}
          style={{ background: '#1A1A24', borderRadius: '24px', padding: '2rem', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{ background: 'rgba(52, 152, 219, 0.1)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <ClipboardList size={40} color="#3498DB" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Recepce</h2>
          <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>Kontrola dokladů totožnosti, registrace příchozích pacientů.</p>
        </div>

        {/* Doctor */}
        <div 
          onClick={() => navigate('/doctor')}
          style={{ background: '#1A1A24', borderRadius: '24px', padding: '2rem', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{ background: 'rgba(5, 150, 105, 0.1)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <Activity size={40} color="#059669" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Lékař</h2>
          <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>Fronta na vyšetření, schválení a sledování odběrů krve.</p>
        </div>

      </div>
    </div>
  );
}
