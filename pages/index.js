import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import engineData from './sovereign_engine.json';

export default function SovereignMasterFinal() {
  const [view, setView] = useState('login'); 
  const [currentStep, setCurrentStep] = useState(0); 
  const [selectedPillar, setSelectedPillar] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [formData, setFormData] = useState({});
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [credits, setCredits] = useState(0);
  const [activationCode, setActivationCode] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // نظام البصمة الرقمية للجوال
    let deviceId = localStorage.getItem('sov_fingerprint');
    if (!deviceId) {
      deviceId = 'DV-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      localStorage.setItem('sov_fingerprint', deviceId);
    }
    
    const savedCredits = localStorage.getItem(`cr_${deviceId}`);
    if (savedCredits !== null) {
      setCredits(parseInt(savedCredits));
    } else {
      setCredits(1); // تقرير مجاني واحد فقط للجهاز
      localStorage.setItem(`cr_${deviceId}`, '1');
    }

    const savedUser = localStorage.getItem('sov_user');
    if (savedUser) {
      setUserEmail(savedUser);
      setView('platform');
    }
  }, []);

  if (!isClient) return null;

  const handleLogin = () => {
    if (!userEmail.includes('@')) { alert('البريد غير صحيح'); return; }
    localStorage.setItem('sov_user', userEmail);
    setView('platform');
  };

  const handleActivate = () => {
    if (activationCode.startsWith("MS-")) {
      const deviceId = localStorage.getItem('sov_fingerprint');
      const newBalance = credits + 10;
      setCredits(newBalance);
      localStorage.setItem(`cr_${deviceId}`, newBalance.toString());
      alert("تم شحن 10 تقارير بنجاح! 🪙");
      setActivationCode('');
    } else { alert("كود غير صحيح"); }
  };

  const buildFinalPrompt = () => {
    if (credits <= 0) { alert('نفد رصيد الجهاز. يرجى الشحن.'); return; }
    
    let prompt = `/* ACT AS SENIOR STRATEGIC CONSULTANT */\n\n`;
    prompt += `مسار التحليل: (${selectedTrack.name})\n`;
    prompt += `الركيزة: ${selectedPillar.name}\n\n`;
    prompt += `الملاحظات الميدانية: {\n`;
    selectedTrack.questions.forEach((q, idx) => {
      prompt += `  "س${idx+1}": "${q.q}",\n  "الواقع": "${formData[`${selectedTrack.id}_${idx}`] || 'لا توجد بيانات'}",\n`;
    });
    prompt += `}\n\nالمطلوب: صياغة تقرير استراتيجي، تحليل فجوات، و3 توصيات احترافية.`;
    
    setGeneratedPrompt(prompt);
    
    // خصم الرصيد من البصمة
    const deviceId = localStorage.getItem('sov_fingerprint');
    const updated = credits - 1;
    setCredits(updated);
    localStorage.setItem(`cr_${deviceId}`, updated.toString());
    
    setCurrentStep(3);
  };

  return (
    <div dir="rtl" style={{ backgroundColor: "#F8F9FB", minHeight: "100vh", fontFamily: "'Cairo', sans-serif" }}>
      <Head>
        <title>منصة منصور الوصابي السيادية</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        * { font-family: 'Cairo', sans-serif !important; }
        .header { background: #1A2639; color: white; padding: 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 5px solid #C5A059; }
        .card { background: white; padding: 25px; border-radius: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #EEE; }
        .btn-gold { background: #C5A059; color: #1A2639; padding: 18px; border-radius: 15px; border: none; width: 100%; font-weight: 900; cursor: pointer; }
        .btn-navy { background: #1A2639; color: white; padding: 15px; border-radius: 12px; border: none; width: 100%; font-weight: 700; }
        .hint { background: #FDF9F0; border-right: 5px solid #C5A059; padding: 12px; border-radius: 10px; font-size: 13px; color: #856404; margin-bottom: 10px; }
        .code-block { background: #1E1E1E; color: #4EC9B0; padding: 20px; border-radius: 15px; font-family: monospace !important; font-size: 12px; white-space: pre-wrap; direction: ltr; text-align: left; }
      `}</style>

      <div className="header">
        <span style={{ fontWeight: 900, fontSize: "16px" }}>منصة منصور الوصابي 🏛️</span>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ background: "#C5A059", color: "#1A2639", padding: "3px 10px", borderRadius: "15px", fontWeight: 900, fontSize: "12px" }}>🪙 {credits}</div>
          {userEmail === 'almansoourd@gmail.com' && (
            <button onClick={()=>setView('admin')} style={{ background: "none", border: "none", color: "white", fontSize: "18px" }}>⚙️</button>
          )}
        </div>
      </div>

      <main style={{ maxWidth: "550px", margin: "25px auto", padding: "0 20px" }}>
        {view === 'login' && (
          <div className="card" style={{ textAlign: "center" }}>
            <h3 style={{ fontWeight: 900, color: "#1A2639" }}>تسجيل الدخول</h3>
            <input type="email" placeholder="البريد الإلكتروني" value={userEmail} onChange={(e)=>setUserEmail(e.target.value)} style={{ width: "100%", padding: "15px", borderRadius: "12px", border: "1px solid #DDD", marginBottom: "15px", textAlign: "center" }} />
            <button onClick={handleLogin} className="btn-gold">دخول ✅</button>
          </div>
        )}

        {view === 'platform' && (
          <>
            {credits <= 0 && currentStep !== 3 ? (
              <div className="card" style={{ textAlign: "center" }}>
                <h3 style={{ color: "#E11D48" }}>نفد رصيد الجهاز</h3>
                <a href="https://wa.me/967774575749" target="_blank" style={{ display: "block", background: "#25D366", color: "white", padding: "15px", borderRadius: "15px", textDecoration: "none", fontWeight: 900, marginBottom: "20px" }}>اطلب شحن (واتساب) 💬</a>
                <input type="text" placeholder="أدخل كود البطاقة" value={activationCode} onChange={(e)=>setActivationCode(e.target.value)} style={{ width: "100%", padding: "12px", textAlign: "center", marginBottom: "10px", borderRadius: "10px" }} />
                <button onClick={handleActivate} className="btn-navy">تفعيل 🚀</button>
              </div>
            ) : (
              <div className="card">
                {currentStep === 0 && (
                  <>
                    <h4 style={{ textAlign: "center", marginBottom: "20px" }}>اختر الركيزة:</h4>
                    {engineData?.pillars?.map(p => (
                      <button key={p.id} onClick={() => { setSelectedPillar(p); setCurrentStep(1); }} className="btn-navy" style={{ marginBottom: "10px" }}>{p.name}</button>
                    ))}
                  </>
                )}
                {currentStep === 1 && (
                  <>
                    <h4 style={{ color: "#C5A059", textAlign: "center" }}>{selectedPillar.name}</h4>
                    {selectedPillar.tracks?.map(t => (
                      <button key={t.id} onClick={() => { setSelectedTrack(t); setCurrentStep(2); }} className="btn-navy" style={{ background: "#F4F7F6", color: "#1A2639", border: "1px solid #DDD", marginBottom: "10px" }}>{t.name}</button>
                    ))}
                    <button onClick={() => setCurrentStep(0)} style={{ width: "100%", background: "none", border: "none", color: "#999", marginTop: "10px" }}>رجوع</button>
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <h4 style={{ textAlign: "center" }}>{selectedTrack.name}</h4>
                    {selectedTrack.questions?.map((q, idx) => (
                      <div key={idx} style={{ marginBottom: "20px" }}>
                        <label style={{ fontWeight: 700, display: "block", marginBottom: "5px", fontSize: "14px" }}>{q.q}</label>
                        <div className="hint">💡 مثال: {q.example}</div>
                        <textarea onChange={(e) => setFormData({...formData, [`${selectedTrack.id}_${idx}`]: e.target.value})} rows="3" style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #CCC" }} />
                      </div>
                    ))}
                    <button onClick={buildFinalPrompt} className="btn-gold">توليد البرومبت (-1 🪙)</button>
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    <h4 style={{ color: "#27AE60", textAlign: "center" }}>✅ جاهز للنسخ</h4>
                    <div className="code-block">{generatedPrompt}</div>
                    <button onClick={() => { navigator.clipboard.writeText(generatedPrompt); alert("تم النسخ!"); }} className="btn-gold" style={{ marginTop: "20px" }}>نسخ 📋</button>
                    <button onClick={() => setCurrentStep(0)} style={{ width: "100%", background: "none", border: "none", color: "#999", marginTop: "15px" }}>جديد</button>
                  </>
                )}
              </div>
            )}
          </>
        )}

        {view === 'admin' && (
          <div className="card">
            <h3 style={{ textAlign: "center" }}>🔐 الإدارة</h3>
            <input type="password" placeholder="كلمة السر" onChange={(e)=>setAdminPass(e.target.value)} style={{ width: "100%", padding: "12px", textAlign: "center" }} />
            {adminPass === "Mansour@2026" && (
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button onClick={() => alert("MS-" + Math.floor(10000 + Math.random() * 90000))} className="btn-gold">توليد كود</button>
                <button onClick={() => { localStorage.setItem(`cr_${localStorage.getItem('sov_fingerprint')}`, '100'); alert("تم شحن جهازك بـ 100 تقرير!"); }} className="btn-navy" style={{ marginTop: "10px" }}>شحن جهازي (أدمن)</button>
              </div>
            )}
            <button onClick={()=>setView('platform')} style={{ marginTop: "20px", width: "100%", background: "#EEE", border: "none", padding: "10px", borderRadius: "10px" }}>خروج</button>
          </div>
        )}
      </main>

      <footer style={{ textAlign: "center", color: "#AAA", fontSize: "11px", padding: "30px" }}>
        منصور الوصابي © 2026 | النسخة الاحترافية المعتمدة
      </footer>
    </div>
  );
}
