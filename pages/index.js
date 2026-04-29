import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import engineData from './sovereign_engine.json';

export default function SovereignMasterV7() {
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
  const [newCode, setNewCode] = useState('');
  const [isClient, setIsClient] = useState(false);

  // --- نظام البصمة الرقمية (Device ID) ---
  useEffect(() => {
    setIsClient(true);
    let deviceId = localStorage.getItem('sov_device_fingerprint');
    if (!deviceId) {
      deviceId = 'DV-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      localStorage.setItem('sov_device_fingerprint', deviceId);
    }
    
    // ربط الرصيد بالبصمة الرقمية للجهاز
    const savedCredits = localStorage.getItem(`credits_${deviceId}`);
    if (savedCredits !== null) {
      setCredits(parseInt(savedCredits));
    } else {
      setCredits(1); // تقرير مجاني واحد فقط لكل جهاز
      localStorage.setItem(`credits_${deviceId}`, '1');
    }

    const activeUser = localStorage.getItem('sov_logged_user');
    if (activeUser) {
      setUserEmail(activeUser);
      setView('platform');
    }
  }, []);

  if (!isClient) return null;

  const handleLogin = () => {
    if (!userEmail.includes('@')) { alert('يرجى إدخال بريد إلكتروني صحيح'); return; }
    localStorage.setItem('sov_logged_user', userEmail);
    setView('platform');
  };

  const handleActivate = () => {
    if (activationCode.startsWith("MS-")) {
      const deviceId = localStorage.getItem('sov_device_fingerprint');
      const updatedTotal = credits + 10;
      setCredits(updatedTotal);
      localStorage.setItem(`credits_${deviceId}`, updatedTotal.toString());
      alert("تم شحن 10 تقارير بنجاح! 🪙");
      setActivationCode('');
    } else {
      alert("كود البطاقة غير صحيح أو منتهي.");
    }
  };

  const buildFinalPrompt = () => {
    if (credits <= 0) { alert('عفواً، رصيد الجهاز انتهى. يرجى الشحن عبر الواتساب.'); return; }
    
    let prompt = `/* ACT AS SENIOR STRATEGIC CONSULTANT */\n\n`;
    prompt += `مسار التحليل: (${selectedTrack.name})\nالركيزة: ${selectedPillar.name}\n\n`;
    prompt += `البيانات المرصودة ميدانياً: {\n`;
    selectedTrack.questions.forEach((q, idx) => {
      prompt += `  "السؤال${idx+1}": "${q.q}",\n  "الملاحظة": "${formData[`${selectedTrack.id}_${idx}`] || 'لا توجد بيانات'}",\n`;
    });
    prompt += `}\n\nالمطلوب: صياغة تقرير احترافي، تحليل فجوات، و3 توصيات إستراتيجية رصينة.`;
    
    setGeneratedPrompt(prompt);
    
    // خصم الرصيد من الجهاز
    const deviceId = localStorage.getItem('sov_device_fingerprint');
    const newBalance = credits - 1;
    setCredits(newBalance);
    localStorage.setItem(`credits_${deviceId}`, newBalance.toString());
    
    setCurrentStep(3);
  };

  return (
    <div dir="rtl" style={{ backgroundColor: "#F4F7F6", minHeight: "100vh", fontFamily: "'Cairo', sans-serif" }}>
      <Head>
        <title>منصة منصور الوصابي السيادية</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        * { font-family: 'Cairo', sans-serif !important; }
        .nav { background: #1A2639; color: white; padding: 18px; display: flex; justify-content: space-between; align-items: center; border-bottom: 5px solid #C5A059; position: sticky; top:0; z-index:100; }
        .card { background: white; padding: 25px; border-radius: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border: 1px solid #EEE; }
        .btn-gold { background: #C5A059; color: #1A2639; padding: 16px; border-radius: 15px; border: none; width: 100%; font-weight: 900; cursor: pointer; }
        .btn-navy { background: #1A2639; color: white; padding: 14px; border-radius: 12px; border: none; width: 100%; font-weight: 700; }
        .hint-box { background: #FDF9F0; border-right: 5px solid #C5A059; padding: 12px; border-radius: 10px; font-size: 13px; color: #856404; margin-bottom: 12px; }
        .code-view { background: #1E1E1E; color: #4EC9B0; padding: 20px; border-radius: 15px; font-family: monospace !important; font-size: 12px; white-space: pre-wrap; direction: ltr; text-align: left; }
      `}</style>

      {/* الرأس السيادي */}
      <div className="nav">
        <span style={{ fontWeight: 900 }}>منصة منصور الوصابي السيادية 🏛️</span>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ background: "#C5A059", color: "#1A2639", padding: "3px 10px", borderRadius: "20px", fontWeight: 900, fontSize: "13px" }}>🪙 {credits}</div>
          {/* الإدارة تظهر فقط لبريدك الشخصي */}
          {userEmail === 'almansoourd@gmail.com' && (
            <button onClick={()=>setView('admin')} style={{ background: "none", border: "none", color: "white", fontSize: "18px" }}>⚙️</button>
          )}
        </div>
      </div>

      <main style={{ maxWidth: "550px", margin: "25px auto", padding: "0 20px" }}>
        
        {view === 'login' && (
          <div className="card" style={{ textAlign: "center" }}>
            <h3 style={{ fontWeight: 900, color: "#1A2639" }}>تسجيل الدخول للنظام</h3>
            <p style={{ fontSize: "13px", color: "#666", marginBottom: "25px" }}>أدخل بريدك الرسمي لبدء العمل المنهجي</p>
            <input type="email" placeholder="البريد الإلكتروني" value={userEmail} onChange={(e)=>setUserEmail(e.target.value)} style={{ width: "100%", padding: "15px", borderRadius: "12px", border: "1px solid #DDD", marginBottom: "15px", textAlign: "center" }} />
            <button onClick={handleLogin} className="btn-gold">دخول آمن ✅</button>
          </div>
        )}

        {view === 'platform' && (
          <>
            {credits <= 0 && currentStep !== 3 ? (
              <div className="card" style={{ textAlign: "center" }}>
                <h3 style={{ color: "#E11D48", fontWeight: 900 }}>⚠️ نفد رصيد الجهاز</h3>
                <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "25px" }}>لقد استنفدت حقك في التجربة المجانية لهذا الجهاز.</p>
                <a href="https://wa.me/967774575749" target="_blank" style={{ display: "block", background: "#25D366", color: "white", padding: "15px", borderRadius: "15px", textDecoration: "none", fontWeight: 900, marginBottom: "20px" }}>تواصل مع المستشار للشحن 💬</a>
                <input type="text" placeholder="أدخل كود البطاقة (MS-XXXX)" value={activationCode} onChange={(e)=>setActivationCode(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #DDD", textAlign: "center", marginBottom: "15px" }} />
                <button onClick={handleActivate} className="btn-navy">تفعيل كود الشحن 🚀</button>
              </div>
            ) : (
              <div className="card">
                {currentStep === 0 && (
                  <>
                    <h4 style={{ textAlign: "center", marginBottom: "25px", color: "#1A2639" }}>اختر ركيزة العمل الإستراتيجي:</h4>
                    {engineData?.pillars?.map(p => (
                      <button key={p.id} onClick={() => { setSelectedPillar(p); setCurrentStep(1); }} className="btn-navy" style={{ marginBottom: "12px" }}>{p.name}</button>
                    ))}
                  </>
                )}

                {currentStep === 1 && (
                  <>
                    <h4 style={{ color: "#C5A059", textAlign: "center", fontWeight: 900 }}>{selectedPillar.name}</h4>
                    {selectedPillar.tracks?.map(t => (
                      <button key={t.id} onClick={() => { setSelectedTrack(t); setCurrentStep(2); }} className="btn-navy" style={{ background: "#F4F7F6", color: "#1A2639", border: "1px solid #DDD", marginBottom: "10px" }}>{t.name}</button>
                    ))}
                    <button onClick={() => setCurrentStep(0)} style={{ width: "100%", background: "none", border: "none", color: "#999", marginTop: "15px" }}>تراجع</button>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <h4 style={{ textAlign: "center", fontWeight: 900 }}>{selectedTrack.name}</h4>
                    {selectedTrack.questions?.map((q, idx) => (
                      <div key={idx} style={{ marginBottom: "25px" }}>
                        <label style={{ fontWeight: 700, display: "block", marginBottom: "8px", fontSize: "14px" }}>{idx+1}. {q.q}</label>
                        <div className="hint-box">💡 مثال: {q.example}</div>
                        <textarea onChange={(e) => setFormData({...formData, [`${selectedTrack.id}_${idx}`]: e.target.value})} rows="4" style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #CCC", fontSize: "15px" }} placeholder="اكتب البيانات والملاحظات الخام هنا..." />
                      </div>
                    ))}
                    <button onClick={buildFinalPrompt} className="btn-gold">توليد البرومبت الإستراتيجي (-1 🪙)</button>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <h4 style={{ color: "#27AE60", textAlign: "center", fontWeight: 900 }}>✅ تم تجهيز البرومبت الإستراتيجي</h4>
                    <div className="code-view">{generatedPrompt}</div>
                    <button onClick={() => { navigator.clipboard.writeText(generatedPrompt); alert("تم نسخ الكود بنجاح!"); }} className="btn-gold" style={{ marginTop: "20px" }}>نسخ البرومبت 📋</button>
                    <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                      <a href="https://gemini.google.com" target="_blank" className="btn-navy" style={{ textAlign: "center", textDecoration: "none", fontSize: "13px" }}>Open Gemini</a>
                      <a href="https://chat.openai.com" target="_blank" className="btn-navy" style={{ textAlign: "center", textDecoration: "none", fontSize: "13px" }}>Open ChatGPT</a>
                    </div>
                    <button onClick={() => setCurrentStep(0)} style={{ width: "100%", background: "none", border: "none", color: "#999", marginTop: "15px" }}>تحليل جديد</button>
                  </>
                )}
              </div>
            )}
          </>
        )}

        {view === 'admin' && (
          <div className="card">
            <h3 style={{ textAlign: "center", fontWeight: 900 }}>🔐 لوحة التحكم - الإدارة</h3>
            <input type="password" placeholder="كلمة مرور الإدارة" onChange={(e)=>setAdminPass(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #DDD", marginBottom: "15px", textAlign: "center" }} />
            {adminPass === "Mansour@2026" && (
              <div style={{ textAlign: "center" }}>
                <button onClick={() => setNewCode("MS-" + Math.floor(Math.random()*90000 + 10000))} className="btn-gold">توليد كود بطاقة جديد</button>
                {newCode && <div style={{ marginTop: "20px", fontSize: "24px", color: "#2563EB", fontWeight: "bold", background: "#EFF6FF", padding: "15px", borderRadius: "15px" }}>{newCode}</div>}
              </div>
            )}
            <button onClick={()=>setView('platform')} style={{ marginTop: "20px", width: "100%", background: "#EEE", border: "none", padding: "10px", borderRadius: "10px" }}>خروج</button>
          </div>
        )}

      </main>

      <footer style={{ textAlign: "center", color: "#AAA", fontSize: "11px", padding: "30px" }}>
        العلامة منصور الوصابي © 2026 | النسخة الاحترافية المعتمدة
      </footer>
    </div>
  );
}
