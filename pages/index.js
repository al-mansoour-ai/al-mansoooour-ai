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
  const [activationCode, setActivationCode] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);
  if (!isClient) return null;

  const buildFinalPrompt = () => {
    let prompt = `/* SYSTEM: SENIOR STRATEGIC CONSULTANT AI */\n\n`;
    prompt += `CONTEXT: التحليل الإستراتيجي لمسار (${selectedTrack.name})\n`;
    prompt += `PILLAR: ${selectedPillar.name}\n\n`;
    prompt += `INPUT_DATA: {\n`;
    selectedTrack.questions.forEach((q, idx) => {
      const answer = formData[`${selectedTrack.id}_${idx}`] || "NULL";
      prompt += `  "Q${idx+1}": "${q.q}",\n  "VALUE": "${answer}",\n`;
    });
    prompt += `}\n\n`;
    prompt += `TASK: صياغة تقرير تشخيصي، تحليل فجوات، و3 توصيات إستراتيجية بأسلوب رصين وفخم.`;
    setGeneratedPrompt(prompt);
    setCurrentStep(3);
  };

  return (
    <div dir="rtl" style={{ backgroundColor: "#F4F7F6", minHeight: "100vh", fontFamily: "'Cairo', sans-serif" }}>
      <Head>
        <title>منصة المنصور السيادية - Pro</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        * { font-family: 'Cairo', sans-serif !important; transition: 0.3s; }
        .nav-bar { background: #1A2639; color: white; padding: 20px; display: flex; justify-content: space-between; border-bottom: 5px solid #C5A059; position: sticky; top:0; z-index:100; }
        .card { background: white; padding: 25px; border-radius: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border: 1px solid #EEE; }
        .btn-gold { background: #C5A059; color: #1A2639; padding: 18px; border-radius: 15px; border: none; width: 100%; font-weight: 900; font-size: 16px; cursor: pointer; }
        .btn-navy { background: #1A2639; color: white; padding: 15px; border-radius: 12px; border: none; width: 100%; font-weight: 700; }
        .example-hint { background: #FDF9F0; border-right: 5px solid #C5A059; padding: 12px; border-radius: 10px; font-size: 13px; color: #856404; margin-bottom: 10px; }
        .code-output { background: #1E1E1E; color: #4EC9B0; padding: 20px; border-radius: 15px; font-family: monospace !important; font-size: 13px; white-space: pre-wrap; direction: ltr; text-align: left; }
        .wa-float { background: #25D366; color: white; padding: 15px 25px; border-radius: 50px; text-decoration: none; display: flex; align-items: center; gap: 10px; font-weight: 900; position: fixed; bottom: 25px; left: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.2); z-index: 1000; }
      `}</style>

      {/* الهيدر الاحترافي */}
      <div className="nav-bar">
        <span style={{ fontWeight: 900, fontSize: "19px" }}>المنصور السيادية 🏛️</span>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={()=>setView('pricing')} style={{ background: "none", border: "1px solid #C5A059", color: "#C5A059", padding: "5px 12px", borderRadius: "10px", fontSize: "12px" }}>الباقات</button>
          <button onClick={()=>setView('admin')} style={{ background: "none", border: "none", color: "white" }}>⚙️</button>
        </div>
      </div>

      <main style={{ maxWidth: "550px", margin: "25px auto", padding: "0 20px" }}>
        
        {view === 'login' && (
          <div className="card" style={{ textAlign: "center" }}>
            <h3 style={{ fontWeight: 900, color: "#1A2639" }}>مرحباً بك في النسخة الاحترافية</h3>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "25px" }}>أدخل كود البطاقة لتفعيل جلسة العمل</p>
            <input type="text" placeholder="MS-XXXX-XXXX" value={activationCode} onChange={(e)=>setActivationCode(e.target.value)} style={{ width: "100%", padding: "15px", borderRadius: "12px", border: "1px solid #DDD", marginBottom: "15px", textAlign: "center", fontSize: "18px", fontWeight: "bold" }} />
            <button onClick={()=>setView('platform')} className="btn-gold">تفعيل الجلسة 🚀</button>
          </div>
        )}

        {view === 'platform' && (
          <div className="card">
            {currentStep === 0 && (
              <>
                <h4 style={{ textAlign: "center", marginBottom: "25px", color: "#1A2639" }}>اختر ركيزة العمل الإستراتيجي:</h4>
                {engineData?.pillars?.map(p => (
                  <button key={p.id} onClick={() => { setSelectedPillar(p); setCurrentStep(1); }} className="btn-navy" style={{ marginBottom: "12px" }}>{p.name}</button>
                ))}
              </>
            )}

            {currentStep === 1 && selectedPillar && (
              <>
                <h4 style={{ color: "#C5A059", textAlign: "center", fontWeight: 900 }}>{selectedPillar.name}</h4>
                {selectedPillar.tracks?.map(t => (
                  <button key={t.id} onClick={() => { setSelectedTrack(t); setCurrentStep(2); }} className="btn-navy" style={{ background: "#F4F7F6", color: "#1A2639", border: "1px solid #DDD", marginBottom: "10px" }}>{t.name}</button>
                ))}
                <button onClick={() => setCurrentStep(0)} style={{ width: "100%", background: "none", border: "none", color: "#999", marginTop: "15px" }}>تراجع</button>
              </>
            )}

            {currentStep === 2 && selectedTrack && (
              <>
                <h4 style={{ textAlign: "center", fontWeight: 900 }}>{selectedTrack.name}</h4>
                {selectedTrack.questions?.map((q, idx) => (
                  <div key={idx} style={{ marginBottom: "25px" }}>
                    <label style={{ fontWeight: 700, display: "block", marginBottom: "8px", fontSize: "14px" }}>{idx+1}. {q.q}</label>
                    <div className="example-hint">💡 مثال: {q.example}</div>
                    <textarea onChange={(e) => setFormData({...formData, [`${selectedTrack.id}_${idx}`]: e.target.value})} rows="4" style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #CCC", fontSize: "15px" }} placeholder="اكتب البيانات والملاحظات هنا..." />
                  </div>
                ))}
                <button onClick={buildFinalPrompt} className="btn-gold">إنشاء الأمر البرمجي 🚀</button>
              </>
            )}

            {currentStep === 3 && (
              <>
                <h4 style={{ color: "#27AE60", textAlign: "center" }}>✅ تم تجهيز البرومبت الإستراتيجي</h4>
                <div className="code-output">{generatedPrompt}</div>
                <button onClick={() => { navigator.clipboard.writeText(generatedPrompt); alert("تم النسخ!"); }} className="btn-gold" style={{ marginTop: "20px" }}>نسخ البرومبت 📋</button>
                <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                  <a href="https://gemini.google.com" target="_blank" className="btn-navy" style={{ textAlign: "center", textDecoration: "none", fontSize: "13px" }}>افتح Gemini</a>
                  <a href="https://chat.openai.com" target="_blank" className="btn-navy" style={{ textAlign: "center", textDecoration: "none", fontSize: "13px" }}>افتح ChatGPT</a>
                </div>
                <button onClick={() => setCurrentStep(0)} style={{ width: "100%", background: "none", border: "none", color: "#999", marginTop: "15px" }}>تحليل جديد</button>
              </>
            )}
          </div>
        )}

        {view === 'pricing' && (
          <div className="card" style={{ textAlign: "center" }}>
            <h3 style={{ color: "#1A2639", fontWeight: 900 }}>💰 باقات الخدمة السيادية</h3>
            <div style={{ border: "2px solid #C5A059", padding: "20px", borderRadius: "20px", margin: "20px 0", background: "#FDF9F0" }}>
              <h4 style={{ color: "#C5A059" }}>الباقة الذهبية</h4>
              <p style={{ fontSize: "28px", fontWeight: 900 }}>$50</p>
              <ul style={{ textAlign: "right", padding: 0, listStyle: "none", fontSize: "14px", lineHeight: "2" }}>
                <li>✅ 50 تقرير إستراتيجي</li>
                <li>✅ دعم فني مباشر</li>
                <li>✅ صلاحية غير محدودة</li>
              </ul>
              <button onClick={()=>window.open('https://wa.me/967774575749')} className="btn-gold">اطلب البطاقة الآن</button>
            </div>
            <button onClick={()=>setView('login')} style={{ background: "none", border: "none", color: "#999" }}>رجوع</button>
          </div>
        )}
      </main>

      <a href="https://wa.me/967774575749" target="_blank" className="wa-float">
        <span>تواصل مع المستشار</span>💬
      </a>

      <footer style={{ textAlign: "center", color: "#AAA", fontSize: "11px", padding: "25px" }}>
        مستشار منصور الوعيل © 2026 | النسخة الاحترافية المعتمدة
      </footer>
    </div>
  );
}
