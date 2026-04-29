import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import engineData from './sovereign_engine.json';

export default function SovereignFinalSecurity() {
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

  // --- نظام البصمة الرقمية والحماية ---
  useEffect(() => {
    setIsClient(true);
    const deviceId = localStorage.getItem('sov_device_id') || 'ID-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('sov_device_id', deviceId);
    
    const savedCredits = localStorage.getItem(`credits_${deviceId}`);
    if (savedCredits !== null) {
      setCredits(parseInt(savedCredits));
    } else {
      // رصيد مجاني لأول مرة فقط لهذا الجهاز
      setCredits(1);
      localStorage.setItem(`credits_${deviceId}`, '1');
    }
    
    const savedUser = localStorage.getItem('sov_active_user');
    if (savedUser) {
      setUserEmail(savedUser);
      setView('platform');
    }
  }, []);

  if (!isClient) return null;

  const handleLogin = () => {
    if (!userEmail.includes('@')) { alert('يرجى إدخال بريد صحيح'); return; }
    localStorage.setItem('sov_active_user', userEmail);
    setView('platform');
  };

  const handleActivateCode = () => {
    if (activationCode.startsWith("MS-")) {
      const deviceId = localStorage.getItem('sov_device_id');
      const newTotal = credits + 10;
      setCredits(newTotal);
      localStorage.setItem(`credits_${deviceId}`, newTotal.toString());
      alert("تم شحن 10 تقارير بنجاح! 🪙");
      setActivationCode('');
    } else {
      alert("الكود غير صحيح");
    }
  };

  const buildFinalPrompt = () => {
    if (credits <= 0) { alert('عفواً، رصيد الجهاز نفد. يرجى الشحن.'); return; }
    
    let prompt = `/* SYSTEM: SENIOR STRATEGIC CONSULTANT AI */\n`;
    prompt += `CONTEXT: التحليل الإستراتيجي لمسار (${selectedTrack.name})\n`;
    prompt += `DATA_INPUTS: {\n`;
    selectedTrack.questions.forEach((q, idx) => {
      prompt += `  "Q${idx+1}": "${q.q}",\n  "VALUE": "${formData[`${selectedTrack.id}_${idx}`] || 'NULL'}",\n`;
    });
    prompt += `}\nTASK: صياغة تقرير تشخيصي احترافي وتوصيات وفق معايير الجودة.`;
    
    setGeneratedPrompt(prompt);
    
    // خصم الرصيد من البصمة الرقمية
    const deviceId = localStorage.getItem('sov_device_id');
    const updatedCredits = credits - 1;
    setCredits(updatedCredits);
    localStorage.setItem(`credits_${deviceId}`, updatedCredits.toString());
    
    setCurrentStep(3);
  };

  return (
    <div dir="rtl" style={{ backgroundColor: "#F8F9FB", minHeight: "100vh", fontFamily: "'Cairo', sans-serif" }}>
      <Head>
        <title>منصة منصور الوصابي السيادية</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        * { font-family: 'Cairo', sans-serif !important; transition: 0.3s; }
        .nav-bar { background: #1A2639; color: white; padding: 20px; display: flex; justify-content: space-between; border-bottom: 5px solid #C5A059; position: sticky; top:0; z-index:100; }
        .card { background: white; padding: 25px; border-radius: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border: 1px solid #EEE; }
        .btn-gold { background: #C5A059; color: #1A2639; padding: 18px; border-radius: 15px; border: none; width: 100%; font-weight: 900; font-size: 16px; cursor: pointer; }
        .btn-navy { background: #1A2639; color: white; padding: 15px; border-radius: 12px; border: none; width: 100%; font-weight: 700; }
        .hint-box { background: #FDF9F0; border-right: 5px solid #C5A059; padding: 12px; border-radius: 10px; font-size: 13px; color: #856404; margin-bottom: 10px; }
        .code-area { background: #1E1E1E; color: #4EC9B0; padding: 20px; border-radius: 15px; font-family: monospace !important; font-size: 12px; white-space: pre-wrap; direction: ltr; text-align: left; }
      `}</style>

      {/* الهيدر الاحترافي */}
      <div className="nav-bar">
        <span style={{ fontWeight: 900, fontSize: "17px" }}>منصة منصور الوصابي السيادية 🏛️</span>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ fontSize: "12px", background: "#C5A059", color: "#1A2639", padding: "2px 8px", borderRadius: "10px", fontWeight: 900 }}>🪙 {credits}</span>
          {/* زر الإدارة مخفي تماماً إلا للمدير */}
          {userEmail === 'almansoourd@gmail.com' && (
            <button onClick={()=>setView('admin')} style={{ background: "none", border: "none", color: "white", fontSize: "18px" }}>⚙️</button>
          )}
        </div>
      </div>

      <main style={{ maxWidth: "500px", margin: "25px auto", padding: "0 20px" }}>
        
        {view === 'login' && (
          <div className="card" style={{ textAlign: "center" }}>
            <h3 style={{ fontWeight: 900, color: "#1A2639" }}>تسجيل الدخول للنظام</h3>
            <p style={{ fontSize: "13px", color: "#666", marginBottom: "25px" }}>يرجى استخدام بريدك الرسمي للوصول للمسارات</p>
            <input type="email" placeholder="البريد الإلكتروني" value={userEmail} onChange={(e)=>setUserEmail(e.target.value)} style={{ width: "100%", padding: "15px", borderRadius: "12px", border: "1px solid #DDD", marginBottom: "15px", textAlign: "center" }} />
            <button onClick={handleLogin} className="btn-gold">دخول آمن ✅</button>
          </div>
        )}

        {view === 'platform' && (
          <>
            {credits <= 0 && currentStep !== 3 ? (
              <div className="card" style={{ textAlign: "center" }}>
                <h3 style={{ color: "#E11D48" }}>⚠️ نفد رصيد الجهاز</h3>
                <p style={{ fontSize: "14px", color: "#64748B" }}>للحصول على المزيد من التقارير، يرجى شحن رصيدك.</p>
                <a href="https://wa.me/967774575749" target="_blank" style={{ display: "block", background: "#25D366", color: "white", padding: "15px", borderRadius: "12px", textDecoration: "none", fontWeight: 900, marginBottom: "20px" }}>اطلب رصيد عبر واتساب 💬</a>
                <input type="text" placeholder="أدخل كود الشحن" value={activationCode} onChange={(e)=>setActivationCode(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #DDD", textAlign: "center", marginBottom: "10px" }} />
                <button onClick={handleActivateCode} className="btn-navy">تفعيل الكود 🚀</button>
              </div>
            ) : (
              <div className="card">
                {currentStep === 0 && (
                  <>
                    <h4 style={{ textAlign: "center", marginBottom: "25px", color: "#1A2639" }}>اختر ركيزة العمل الإستراتيجي:</h4>
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
                      <div key={idx} style={{ marginBottom: "25px" }}>
                        <label style={{ fontWeight: 700, display: "block", marginBottom: "8px", fontSize: "14px" }}>{idx+1}. {q.q}</label>
                        <div className="hint-box">💡 مثال: {q.example}</div>
                        <textarea onChange={(e) => setFormData({...formData, [`${selectedTrack.id}_${idx}`]: e.target.value})} rows="4" style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #CCC" }} placeholder="اكتب البيانات هنا..." />
                      </div>
                    ))}
                    <button onClick={buildFinalPrompt} className="btn-gold">توليد البرومبت الإستراتيجي (-1 🪙)</button>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <h4 style={{ color: "#27AE60", textAlign: "center" }}>✅ الأمر جاهز للنسخ</h4>
                    <div className="code-area">{generatedPrompt}</div>
                    <button onClick={() => { navigator.clipboard.writeText(generatedPrompt); alert("تم النسخ!"); }} className="btn-gold" style={{ marginTop: "20px" }}>نسخ البرومبت 📋</button>
                    <p style={{ fontSize: "11px", color: "#E67E22", textAlign: "center", marginTop: "10px", fontWeight: "bold" }}>💡 انسخ الكود أعلاه وافتحه في Gemini أو ChatGPT.</p>
                    <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                      <a href="https://gemini.google.com" target="_blank" className="btn-navy" style={{ textAlign: "center", textDecoration: "none", fontSize: "13px" }}>Open Gemini</a>
                      <a href="https://chat.openai.com" target="_blank" className="btn-navy" style={{ textAlign: "center", textDecoration: "none", fontSize: "13px" }}>Open ChatGPT</a>
                    </div>
                    <button onClick={() => { setCurrentStep(0); setShowReport(false); }} style={{ width: "100%", background: "none", border: "none", color: "#999", marginTop: "15px" }}>تحليل جديد</button>
                  </>
                )}
              </div>
            )}
          </>
        )}

        {view === 'admin' && (
          <div className="card">
            <h3 style={{ textAlign: "center" }}>🔐 لوحة التحكم - الإدارة</h3>
            <input type="password" placeholder="كلمة مرور الإدارة" onChange={(e)=>setAdminPass(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #DDD", marginBottom: "15px", textAlign: "center" }} />
            {adminPass === "Mansour@2026" && (
              <div style={{ textAlign: "center" }}>
                <button onClick={() => setNewCode("MS-" + Math.floor(Math.random()*90000 + 10000))} className="btn-gold">توليد كود بطاقة جديد</button>
                {newCode && <div style={{ marginTop: "20px", fontSize: "24px", color: "#2563EB", fontWeight: "bold", background: "#EFF6FF", padding: "15px", borderRadius: "10px" }}>{newCode}</div>}
              </div>
            )}
            <button onClick={()=>setView('platform')} style={{ marginTop: "20px", width: "100%", background: "#EEE", border: "none", padding: "10px", borderRadius: "10px" }}>خروج</button>
          </div>
        )}

      </main>

      <footer style={{ textAlign: "center", color: "#AAA", fontSize: "11px", padding: "30px" }}>
         العلامة منصور الوصابي © 2026 | نظام الرصد السيادي المعتمد
      </footer>
    </div>
  );
}
