import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import engineData from './sovereign_engine.json';

export default function SovereignFinalPro() {
  const [view, setView] = useState('login'); 
  const [currentStep, setCurrentStep] = useState(0); 
  const [selectedPillar, setSelectedPillar] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [formData, setFormData] = useState({});
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [credits, setCredits] = useState(0);
  const [activationCode, setActivationCode] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    let deviceId = localStorage.getItem('sov_fingerprint');
    if (!deviceId) {
      deviceId = 'DV-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      localStorage.setItem('sov_fingerprint', deviceId);
    }
    const savedCredits = localStorage.getItem(`cr_${deviceId}`);
    setCredits(savedCredits !== null ? parseInt(savedCredits) : 1);

    const savedUser = localStorage.getItem('sov_user');
    if (savedUser) { setUserEmail(savedUser); setView('platform'); }
  }, []);

  if (!isClient) return null;

  const buildFinalPrompt = () => {
    if (credits <= 0) { alert('نفد رصيد الجهاز.'); return; }
    let prompt = `/* ACT AS SENIOR STRATEGIC CONSULTANT: منصور الوصابي */\n\n`;
    prompt += `المسار: ${selectedTrack.name}\n`;
    selectedTrack.questions.forEach((q, i) => {
      prompt += `- ${q.q}: ${formData[`${selectedTrack.id}_${i}`] || 'لا توجد بيانات'}\n`;
    });
    setGeneratedPrompt(prompt);
    const deviceId = localStorage.getItem('sov_fingerprint');
    const newCr = credits - 1;
    setCredits(newCr);
    localStorage.setItem(`cr_${deviceId}`, newCr.toString());
    setCurrentStep(3);
  };

  return (
    <div dir="rtl" style={{ backgroundColor: "#F8F9FB", minHeight: "100vh", fontFamily: "Cairo" }}>
      <Head><title>منصة منصور الوصابي</title></Head>

      <div style={{ background: "#1A2639", color: "white", padding: "15px", display: "flex", justifyContent: "space-between", borderBottom: "4px solid #C5A059" }}>
        <span style={{ fontWeight: 900 }}>🏛️ منصة منصور الوصابي</span>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ background: "#C5A059", color: "#1A2639", padding: "2px 8px", borderRadius: "10px", fontSize: "12px", fontWeight: 900 }}>🪙 {credits}</span>
          {userEmail === 'almansoourd@gmail.com' && <button onClick={()=>setView('admin')} style={{ background: "none", border: "none", color: "white", fontSize: "18px" }}>⚙️</button>}
        </div>
      </div>

      <main style={{ maxWidth: "500px", margin: "20px auto", padding: "0 15px" }}>
        {view === 'login' && (
          <div style={{ background: "white", padding: "25px", borderRadius: "20px", textAlign: "center", border: "1px solid #EEE" }}>
            <h3 style={{ fontWeight: 900 }}>تسجيل الدخول</h3>
            <input type="email" placeholder="البريد الإلكتروني" value={userEmail} onChange={(e)=>setUserEmail(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #DDD", marginBottom: "10px" }} />
            <button onClick={()=>{localStorage.setItem('sov_user', userEmail); setView('platform');}} style={{ width: "100%", padding: "12px", background: "#C5A059", color: "#1A2639", border: "none", borderRadius: "10px", fontWeight: 900 }}>دخول ✅</button>
          </div>
        )}

        {view === 'platform' && (
          <div style={{ background: "white", padding: "20px", borderRadius: "20px", border: "1px solid #EEE" }}>
            {credits <= 0 && currentStep !== 3 ? (
               <div style={{ textAlign: "center" }}>
                  <h4 style={{ color: "red" }}>نفد رصيد الجهاز</h4>
                  <a href="https://wa.me/967774575749" style={{ display: "block", background: "#25D366", color: "white", padding: "15px", borderRadius: "10px", textDecoration: "none", fontWeight: 900 }}>شحن عبر واتساب 💬</a>
               </div>
            ) : (
              <>
                {currentStep === 0 && engineData.pillars.map(p => (
                  <button key={p.id} onClick={()=>{setSelectedPillar(p); setCurrentStep(1);}} style={{ width: "100%", padding: "15px", marginBottom: "10px", background: "#1A2639", color: "white", border: "none", borderRadius: "12px", fontWeight: 700 }}>{p.name}</button>
                ))}
                {currentStep === 1 && selectedPillar && (
                  <>
                    <h4 style={{ color: "#C5A059" }}>{selectedPillar.name}</h4>
                    {selectedPillar.tracks.map(t => (
                      <button key={t.id} onClick={()=>{setSelectedTrack(t); setCurrentStep(2);}} style={{ width: "100%", padding: "12px", marginBottom: "8px", background: "#F4F7F6", color: "#1A2639", border: "1px solid #DDD", borderRadius: "10px" }}>{t.name}</button>
                    ))}
                    <button onClick={()=>setCurrentStep(0)} style={{ width: "100%", background: "none", border: "none", color: "#999", marginTop: "10px" }}>تراجع</button>
                  </>
                )}
                {currentStep === 2 && selectedTrack && (
                  <>
                    <h4 style={{ color: "#1A2639" }}>{selectedTrack.name}</h4>
                    {selectedTrack.questions.map((q, i) => (
                      <div key={i} style={{ marginBottom: "20px" }}>
                        <label style={{ fontWeight: 700, fontSize: "14px" }}>{q.q}</label>
                        <div style={{ background: "#FDF9F0", padding: "8px", borderRadius: "8px", fontSize: "12px", color: "#856404", marginBottom: "8px" }}>💡 مثال: {q.example}</div>
                        <textarea onChange={(e)=>setFormData({...formData, [`${selectedTrack.id}_${i}`]: e.target.value})} rows="3" style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #CCC" }} />
                      </div>
                    ))}
                    <button onClick={buildFinalPrompt} style={{ width: "100%", padding: "15px", background: "#C5A059", color: "#1A2639", border: "none", borderRadius: "15px", fontWeight: 900 }}>توليد البرومبت 🚀</button>
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    <div style={{ background: "#1E1E1E", color: "#4EC9B0", padding: "15px", borderRadius: "15px", fontSize: "12px", whiteSpace: "pre-wrap", direction: "ltr", textAlign: "left" }}>{generatedPrompt}</div>
                    <button onClick={()=>{navigator.clipboard.writeText(generatedPrompt); alert("تم النسخ!");}} style={{ width: "100%", padding: "15px", background: "#C5A059", color: "#1A2639", border: "none", borderRadius: "12px", fontWeight: 900, marginTop: "15px" }}>نسخ 📋</button>
                    <button onClick={()=>setCurrentStep(0)} style={{ width: "100%", background: "none", border: "none", color: "#999", marginTop: "10px" }}>جديد</button>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {view === 'admin' && (
          <div style={{ background: "white", padding: "20px", borderRadius: "20px" }}>
             <h3 style={{ textAlign: "center" }}>🔐 الإدارة</h3>
             <button onClick={()=>{localStorage.setItem(`cr_${localStorage.getItem('sov_fingerprint')}`, '100'); alert("تم شحن جهازك!");}} style={{ width: "100%", padding: "15px", background: "#1A2639", color: "white", border: "none", borderRadius: "12px" }}>شحن جهازي (100 تقرير)</button>
             <button onClick={()=>setView('platform')} style={{ width: "100%", marginTop: "10px", background: "#EEE", border: "none", padding: "10px", borderRadius: "10px" }}>خروج</button>
          </div>
        )}
      </main>

      <footer style={{ textAlign: "center", color: "#AAA", fontSize: "11px", padding: "20px" }}>
        منصور الوصابي © 2026 | النسخة المعتمدة
      </footer>
    </div>
  );
}
