import React, { useState, useEffect, useRef } from 'react';
import { Clock, Volume2, VolumeX, ArrowRight, Activity, Droplets } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { speak, cancelSpeech } from '../platform/speech';

export default function WaitingRoomBoard() {
  const { donors, ROOMS, docT } = useApp();
  const [time, setTime] = useState(new Date());
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Track previously called donor status mappings to detect updates
  const prevStatusesRef = useRef({});
  const [flashingDonors, setFlashingDonors] = useState({});
  const audioCtxRef = useRef(null);
  // Queue of announcements to speak one after another (avoids overlap)
  const announcementQueueRef = useRef([]);
  const isSpeakingRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => {
      clearInterval(timer);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(err => console.warn(err));
      }
    };
  }, []);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtxClass();
      
      // Keep audio hardware active with an inaudible oscillator
      const silentOsc = ctx.createOscillator();
      const silentGain = ctx.createGain();
      silentOsc.frequency.setValueAtTime(1, ctx.currentTime);
      silentGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      silentOsc.connect(silentGain);
      silentGain.connect(ctx.destination);
      silentOsc.start();
      
      audioCtxRef.current = ctx;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Web Audio chime — clean fade-out, no abrupt stops
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = getAudioContext();
      const now = audioCtx.currentTime;

      // Tone 1 (D5)
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.08, now + 0.02);    // gentle attack
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.55);
      
      // Tone 2 (A4) — starts at +0.25s
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(440.00, now + 0.25);
      gain2.gain.setValueAtTime(0, now);
      gain2.gain.setValueAtTime(0, now + 0.25);
      gain2.gain.linearRampToValueAtTime(0.08, now + 0.27);    // gentle attack
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now + 0.25);
      osc2.stop(now + 0.95);

    } catch (e) {
      console.warn('AudioContext failed:', e);
    }
  };

  // Process the announcement queue — speak one utterance at a time
  const processQueue = () => {
    if (isSpeakingRef.current || announcementQueueRef.current.length === 0) return;
    
    const text = announcementQueueRef.current.shift();
    isSpeakingRef.current = true;

    try {
          speak(text, {
        lang: 'cs-CZ',
        rate: 0.92,
        pitch: 1.0,
        volume: 0.85,
        onEnd: () => {
          isSpeakingRef.current = false;
          setTimeout(processQueue, 400);
        },
        onError: () => {
          isSpeakingRef.current = false;
          setTimeout(processQueue, 400);
        },
      });
    } catch (e) {
      console.warn('Speech failed:', e);
      isSpeakingRef.current = false;
    }
  };

  const announceCall = (donor) => {
    if (!soundEnabled) return;
    
    let targetLoc = 'Ordinace';
    if (donor.status === 'documents') targetLoc = 'Registrace';
    else if (donor.status === 'pressure') targetLoc = 'Vstupní kontrola';
    else if (donor.status === 'blood-sample' || donor.status === 'awaiting-results') targetLoc = 'Laboratoř';
    else if (donor.status === 'doctor-review') targetLoc = 'Lékař';
    else if (donor.status === 'donating') targetLoc = donor.currentVisit?.assignedRoom || 'Odběrový sál';

    const queueNum = donor.currentVisit?.queueNumber || '';
    if (!queueNum) return;

    let text = `Číslo ${queueNum}. Dostavte se na: ${targetLoc}.`;
    if (donor.status === 'donating') {
      text = `Číslo ${queueNum}. Dostavte se na odběrový sál, ${targetLoc}.`;
    } else if (donor.status === 'pressure') {
      text = `Číslo ${queueNum}. Dostavte se na vstupní vyšetření.`;
    } else if (donor.status === 'documents') {
      text = `Číslo ${queueNum}. Dostavte se na registraci k ověření dokladů.`;
    }

    // Queue the announcement — no cancel() call needed
    announcementQueueRef.current.push(text);
    processQueue();
  };

  // Monitor changes in status to trigger queue callouts
  useEffect(() => {
    const prevStatuses = prevStatusesRef.current;
    let newCall = false;
    const updatedFlashing = { ...flashingDonors };
    let calledDonor = null;

    donors.forEach((donor) => {
      const prevStatus = prevStatuses[donor.id];
      const currentStatus = donor.status;

      if (prevStatus !== undefined) {
        const isCalledToDoctor = ['documents', 'pressure', 'blood-sample', 'awaiting-results', 'doctor-review'].includes(currentStatus) &&
          prevStatus !== currentStatus;
        
        const isCalledToDonation = currentStatus === 'donating' && prevStatus !== 'donating';

        if (isCalledToDoctor || isCalledToDonation) {
          newCall = true;
          calledDonor = donor;
          updatedFlashing[donor.id] = true;
          setTimeout(() => {
            setFlashingDonors((prev) => {
              const copy = { ...prev };
              delete copy[donor.id];
              return copy;
            });
          }, 6000);
        }
      }

      prevStatuses[donor.id] = currentStatus;
    });

    if (newCall) {
      playChime();
      setFlashingDonors(updatedFlashing);
      if (calledDonor) {
        // Small delay so chime plays before voice
        setTimeout(() => announceCall(calledDonor), 900);
      }
    }
    prevStatusesRef.current = prevStatuses;
  }, [donors]);

  const doctorQueue = donors.filter((d) =>
    ['documents', 'pressure', 'blood-sample', 'awaiting-results', 'doctor-review'].includes(d.status) && d.currentVisit
  );

  const donationQueue = donors.filter((d) => d.status === 'donating' && d.currentVisit);

  const waitingQueue = donors.filter((d) =>
    ['checked-in', 'questionnaire'].includes(d.status) && d.currentVisit
  );

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      background: '#F1F5F9',
      color: '#0F172A',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: 'hidden',
    }}>
      
      {/* Header Bar — dark, branded, readable from a distance */}
      <header style={{
        height: '76px',
        background: '#1E293B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2.5rem',
        borderBottom: '3px solid #DC2626',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <div style={{
            width: 38,
            height: 38,
            background: '#DC2626',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Droplets size={22} color="#fff" />
          </div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '0.02em',
            margin: 0,
          }}>
            {docT('board_title')}
          </h1>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button
            onClick={() => {
              const newSound = !soundEnabled;
              setSoundEnabled(newSound);
              if (newSound) {
                playChime();
                // Queue the activation message instead of cancel+speak
                setTimeout(() => {
                  announcementQueueRef.current.push('Hlasové vyvolávání aktivováno.');
                  processQueue();
                }, 1000);
              } else {
                try { cancelSpeech(); } catch (e) { /* ignore */ }
                announcementQueueRef.current = [];
                isSpeakingRef.current = false;
              }
            }}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 8,
              color: '#fff',
              cursor: 'pointer',
              padding: '0.4rem 0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: 500,
            }}
          >
            {soundEnabled
              ? <><Volume2 size={18} color="#34D399" /> <span style={{ color: '#A3A3A3' }}>Zvuk zapnut</span></>
              : <><VolumeX size={18} color="#F87171" /> <span style={{ color: '#A3A3A3' }}>Zvuk vypnut</span></>
            }
          </button>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            padding: '0.4rem 1rem',
            borderRadius: 8,
            fontSize: '1.2rem',
            fontWeight: 700,
            color: '#FFFFFF',
            fontVariantNumeric: 'tabular-nums',
          }}>
            <Clock size={18} color="#94A3B8" />
            <span>{time.toLocaleTimeString('cs-CZ')}</span>
          </div>
        </div>
      </header>

      {/* Column Labels */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        padding: '1.25rem 1.5rem 0',
        flexShrink: 0,
      }}>
        {/* Reception / Doctor Column Header */}
        <div style={{
          background: '#2563EB',
          color: '#FFFFFF',
          borderRadius: '10px 10px 0 0',
          padding: '0.8rem 1.5rem',
          fontSize: '0.8rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span>{docT('board_col_reception')} / {docT('board_col_doctor')}</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 99, padding: '2px 10px', fontSize: '0.9rem', fontWeight: 800 }}>
            {doctorQueue.length}
          </span>
        </div>

        {/* Donation Hall Column Header */}
        <div style={{
          background: '#DC2626',
          color: '#FFFFFF',
          borderRadius: '10px 10px 0 0',
          padding: '0.8rem 1.5rem',
          fontSize: '0.8rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span>{docT('board_col_donation')}</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 99, padding: '2px 10px', fontSize: '0.9rem', fontWeight: 800 }}>
            {donationQueue.length}
          </span>
        </div>
      </div>

      {/* Main Columns */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        padding: '0 1.5rem',
        overflow: 'hidden',
      }}>
        
        {/* Left Column: Doctor / Pre-Exam */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderTop: '3px solid #2563EB',
          borderRadius: '0 0 12px 12px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {doctorQueue.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#CBD5E1', fontSize: '1.4rem', letterSpacing: '0.2em' }}>
                — — —
              </div>
            ) : (
              doctorQueue.map((donor) => {
                const isFlashing = flashingDonors[donor.id];
                let targetLoc = 'Ordinace';
                if (donor.status === 'documents') targetLoc = docT('board_col_reception');
                else if (donor.status === 'pressure') targetLoc = 'Vstupní kontrola';
                else if (donor.status === 'blood-sample') targetLoc = 'Laboratoř';
                else if (donor.status === 'doctor-review' && donor.currentVisit?.assignedRoom) targetLoc = donor.currentVisit.assignedRoom;

                return (
                  <div
                    key={donor.id}
                    className="animate-slide-up"
                    style={{
                      background: isFlashing ? '#EFF6FF' : '#F8FAFC',
                      border: isFlashing ? '2px solid #2563EB' : '1px solid #E2E8F0',
                      borderLeft: isFlashing ? '4px solid #2563EB' : '4px solid #CBD5E1',
                      borderRadius: 10,
                      padding: '1.1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span
                        className={isFlashing ? 'pulse-indicator-blue' : ''}
                        style={!isFlashing ? { width: 10, height: 10, backgroundColor: '#CBD5E1', borderRadius: '50%', display: 'inline-block' } : {}}
                      />
                      <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#2563EB', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                        #{donor.currentVisit?.queueNumber}
                      </div>
                    </div>
                    <ArrowRight size={22} color="#94A3B8" />
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B', textAlign: 'right' }}>
                      {targetLoc}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Donation Hall */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderTop: '3px solid #DC2626',
          borderRadius: '0 0 12px 12px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {donationQueue.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#CBD5E1', fontSize: '1.4rem', letterSpacing: '0.2em' }}>
                — — —
              </div>
            ) : (
              donationQueue.map((donor) => {
                const isFlashing = flashingDonors[donor.id];
                const boxName = donor.currentVisit?.assignedRoom || 'Odběrový sál';

                return (
                  <div
                    key={donor.id}
                    className="animate-slide-up"
                    style={{
                      background: isFlashing ? '#FFF5F5' : '#F8FAFC',
                      border: isFlashing ? '2px solid #DC2626' : '1px solid #E2E8F0',
                      borderLeft: isFlashing ? '4px solid #DC2626' : '4px solid #CBD5E1',
                      borderRadius: 10,
                      padding: '1.1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span
                        className={isFlashing ? 'pulse-indicator-red' : ''}
                        style={!isFlashing ? { width: 10, height: 10, backgroundColor: '#CBD5E1', borderRadius: '50%', display: 'inline-block' } : {}}
                      />
                      <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#DC2626', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                        #{donor.currentVisit?.queueNumber}
                      </div>
                    </div>
                    <ArrowRight size={22} color="#94A3B8" />
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B', textAlign: 'right' }}>
                      {boxName}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Waiting Queue Footer */}
      {waitingQueue.length > 0 && (
        <div style={{
          height: '56px',
          background: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1.5rem',
          gap: '1rem',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
            Čekající ve frontě:
          </span>
          <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', flex: 1 }}>
            {waitingQueue.map((d) => (
              <span
                key={d.id}
                style={{
                  background: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 6,
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#475569',
                  whiteSpace: 'nowrap',
                }}
              >
                #{d.currentVisit?.queueNumber}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Info Marquee Ticker — keeps the branded red accent */}
      <div style={{
        height: '46px',
        background: '#DC2626',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        fontSize: '0.95rem',
        fontWeight: 600,
        flexShrink: 0,
      }}>
        <div style={{
          background: '#B91C1C',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1.25rem',
          zIndex: 2,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontSize: '0.8rem',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          {docT('board_ticker_title')}
        </div>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              whiteSpace: 'nowrap',
              position: 'absolute',
              animation: 'marquee 28s linear infinite',
              gap: '4rem',
              paddingLeft: '100%',
            }}
          >
            <span>{docT('board_ticker_msg_1')}</span>
            <span>{docT('board_ticker_msg_2')}</span>
            <span>{docT('board_ticker_msg_3')}</span>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-100%, 0, 0); }
          }
        `}} />
      </div>

    </div>
  );
}
