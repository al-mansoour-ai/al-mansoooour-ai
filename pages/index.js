import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import engineData from './sovereign_engine.json';

export default function SovereignProV6() {
  const [currentStep, setCurrentStep] = useState(0); 
  const [selectedPillar, setSelectedPillar] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [formData, setFormData] = useState({});
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [view, setView] = useState('login'); // login, platform, pricing, admin
  const [activationCode, setActivationCode] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [newGeneratedCode, setNewGeneratedCode] = useState('');

  useEffect(() => { setIsClient(true); }, []);
  if (!isClient) return null;

  const buildFinalPrompt = () => {
    let prompt = `/* SYSTEM_INSTRUCTIONS: ACT AS SENIOR STRATEGIC CONSULTANT */\n\n`;
    prompt += `CONTEXT: التحليل الإستراتيجي لمسار (${selectedTrack.name})\n`;
    prompt += `PILLAR: ${selectedPillar.name}\n\n`;
    prompt += `DATA_INPUTS: {\n`;
    selectedTrack.questions.forEach((q, idx) => {
      const answer = formData[`${selectedTrack.id}_${idx}`] || "NULL";
      prompt += `  "Q${idx + 1}": "${q.q}",\n  "OBSERVATION": "${answer}",\n`;
    });
    prompt += `}\n\n`;
    prompt += `REQUIRED_OUTPUT: [\n  "Executive Summary",\n  "Gap Analysis (OECD Standards)",\n  "Strategic Recommendations (3 Points)",\n  "Risk Mitigation Plan"\n]\n\n`;
    prompt += `NOTE: استخدم لغة احترافية، رصينة، وموجهة لصناع القرار.`;
    
    setGeneratedPrompt(prompt);
    setCurrentStep(3);
  };

  const handleActivate = () => {
    if(activationCode.startsWith("MS-")) {
      alert("تم تفعيل البطاقة بنجاح! تم إضافة 10 تقارير لرصيدك.");
      setView('platform');
    } else {
      alert("كود البطاقة غير صحيح.");
    }
  };

  return (
    <div dir="rtl" style={{ backgroundColor: "#F4F7F6", minHeight: "100vh", fontFamily: "'Cairo', sans-serif", color: "#2C3E50" }}>
      <Head>
        <title>منصة المنصور السيادية - Pro</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        * { font-family: 'Cairo', sans-serif !important; }
        .nav-bar { background: #1A2639; color: white; padding: 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 4px solid #C5A059; position: sticky; top: 0; z-index: 100; }
        .card { background: white; padding: 25px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); border: 1px solid #EAEAEA; }
        .btn-navy { background: #1A2639; color: white; padding: 15px; border-radius: 12px; border: none; width: 100%; font-weight: 700; cursor: pointer; margin-bottom: 10px; }
        .btn-gold { background: #C5A059; color: #1A2639; padding: 15px; border-radius: 12px; border: none; width: 100%; font-weight: 900; cursor: pointer; }
        .code-block { background: #2D3436; color: #00FFCC; padding: 20px; border-radius: 10px; font-family: monospace !important; font-size: 13px; white-space: pre-wrap; direction: ltr; text-align: left; border-left: 5px solid #C5A059; }
        .pricing-card { border: 1px solid #C5A059; padding: 20px; border-radius: 15px; text-align: center; background: white; }
        .wa-btn { background: #25D366; color: white; padding: 12px; border-radius: 50px; text-decoration: none; display: inline-flex; align-items: center; gap: 10px; font-weight: 700; position: fixed; bottom: 20px; left: 20px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); z-index: 1000; }
      `}</style>

      {/* الرأس */}
      <div className="nav-bar">
        <span style={{ fontWeight: 900, fontSize: "18px" }}>🏛️ المنصور السيادية</span>
        <div style={{ display: "flex", gap: "10px" }}>
           <button onClick={()=>setView('pricing')} style={{ background: "none", border: "1px solid #C5A059", color: "#C5A059", padding: "5px 10px", borderRadius: "8px", fontSize: "12px" }}>الباقات</button>
           <button onClick={()=>setView('admin')} style={{ background: "none", border: "none", color: "white", fontSize: "12px" }}>⚙️</button>
        </div>
      </div>

      <main style={{ maxWidth: "500px", margin: "20px auto", padding: "0 15px" }}>
        
        {/* نافذة الدخول وتفعيل الكود */}
        {view === 'login' && (
          <div className="card" style={{ textAlign: "center" }}>
            <h3 style={{ color: "#1A2639", fontWeight: 900 }}>مرحباً بك في المنطقة السيادية</h3>
            <p style={{ fontSize: "14px", color: "#7F8C8D" }}>أدخل كود البطاقة لتفعيل جلسة التحليل</p>
            <input type="text" placeholder="MS-XXXX-XXXX" value={activationCode} onChange={(e)=>setActivationCode(e.target.value)} style={{ width: "100%", padding: "15px", borderRadius: "10px", border: "1px solid #DDD", marginBottom: "15px", textAlign: "center", fontSize: "18px", fontWeight: "bold" }} />
            <button onClick={handleActivate} className="btn-gold">تفعيل الجلسة 🚀</button>
            <p onClick={()=>setView('platform')} style={{ marginTop: "15px", fontSize: "12px", color: "#95A5A6", cursor: "pointer" }}>تجربة العرض المحدود (بدون كود)</p>
          </div>
        )}

        {/* المنصة الرئيسية */}
        {view === 'platform' && (
          <div className="card">
            {currentStep === 0 && (
              <>
                <h4 style={{ textAlign: "center", marginBottom: "20px" }}>اختر ركيزة العمل الإستراتيجي:</h4>
                {engineData?.pillars?.map(p => (
                  <button key={p.id} onClick={() => { setSelectedPillar(p); setCurrentStep(1); }} className="btn-navy">{p.name}</button>
                ))}
              </>
            )}

            {currentStep === 1 && selectedPillar && (
              <>
                <h4 style={{ color: "#C5A059", textAlign: "center" }}>{selectedPillar.name}</h4>
                {selectedPillar.tracks?.map(t => (
                  <button key={t.id} onClick={() => { setSelectedTrack(t); setCurrentStep(2); }} className="btn-navy" style={{ background: "#F4F7F6", color: "#1A2639", border: "1px solid #DDD" }}>{t.name}</button>
                ))}
                <button onClick={() => setCurrentStep(0)} style={{ background: "none", border: "none", width: "100%", color: "#95A5A6", marginTop: "10px" }}>تراجع</button>
              </>
            )}

            {currentStep === 2 && selectedTrack && (
              <>
                <h4 style={{ textAlign: "center" }}>{selectedTrack.name}</h4>
                {selectedTrack.questions?.map((q, idx) => (
                  <div key={idx} style={{ marginBottom: "20px" }}>
                    <label style={{ fontSize: "13px", fontWeight: 700, display: "block", marginBottom: "5px" }}>{q.q}</label>
                    <textarea onChange={(e) => setFormData({...formData, [`${selectedTrack.id}_${idx}`]: e.target.value})} rows="3" style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #CCC" }} placeholder="اكتب البيانات هنا..." />
                  </div>
                ))}
                <button onClick={buildFinalPrompt} className="btn-gold">إنشاء الأمر البرمجي 🚀</button>
              </>
            )}

            {currentStep === 3 && (
              <>
                <h4 style={{ color: "#27AE60", textAlign: "center" }}>✅ تم تجهيز البرومبت الإستراتيجي</h4>
                <div className="code-block">{generatedPrompt}</div>
                
                <div style={{ marginTop: "20px" }}>
                  <button onClick={() => { navigator.clipboard.writeText(generatedPrompt); alert("تم النسخ!"); }} className="btn-gold">نسخ البرومبت 📋</button>
                  <p style={{ fontSize: "11px", color: "#E67E22", textAlign: "center", marginTop: "10px", fontWeight: "bold" }}>💡 تعليمات: انسخ الكود أعلاه وافتحه في Gemini أو ChatGPT للحصول على التقرير بصياغة عالمية.</p>
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                  <a href="https://gemini.google.com" target="_blank" className="btn-navy" style={{ textAlign: "center", textDecoration: "none", fontSize: "13px" }}>افتح Gemini</a>
                  <a href="https://chat.openai.com" target="_blank" className="btn-navy" style={{ textAlign: "center", textDecoration: "none", fontSize: "13px" }}>افتح ChatGPT</a>
                </div>
                <button onClick={() => setCurrentStep(0)} style={{ width: "100%", background: "none", border: "none", color: "#95A5A6", marginTop: "15px" }}>تحليل جديد</button>
              </>
            )}
          </div>
        )}

        {/* الباقات */}
        {view === 'pricing' && (
          <div className="card">
             <h3 style={{ textAlign: "center", color: "#1A2639" }}>💰 باقات الخدمة السيادية</h3>
             <div style={{ display: "grid", gap: "15px", marginTop: "20px" }}>
                <div className="pricing-card">
                   <h4>الباقة الفضية</h4>
                   <p style={{ fontSize: "20px", fontWeight: 900 }}>$20</p>
                   <ul style={{ fontSize: "12px", textAlign: "right", padding: 0, listStyle: "none" }}>
                      <li>✅ 10 تقارير استراتيجية</li>
                      <li>✅ صلاحية لمدة شهر</li>
                   </ul>
                   <button onClick={()=>window.open('https://wa.me/967774575749')} style={{ background: "#1A2639", color: "white", padding: "10px", borderRadius: "10px", border: "none", width: "100%" }}>اطلب الآن</button>
                </div>
                <div className="pricing-card" style={{ background: "#FDF9F0" }}>
                   <h4 style={{ color: "#C5A059" }}>الباقة الذهبية (الأكثر طلباً)</h4>
                   <p style={{ fontSize: "20px", fontWeight: 900 }}>$50</p>
                   <ul style={{ fontSize: "12px", textAlign: "right", padding: 0, listStyle: "none" }}>
                      <li>✅ 50 تقرير استراتيجي</li>
                      <li>✅ دعم استشاري مباشر</li>
                      <li>✅ صلاحية غير محدودة</li>
                   </ul>
                   <button onClick={()=>window.open('https://wa.me/967774575749')} className="btn-gold">اطلب الآن</button>
                </div>
             </div>
             <button onClick={()=>setView('login')} style={{ marginTop: "20px", width: "100%", background: "#EEE", border: "none", padding: "10px", borderRadius: "10px" }}>رجوع</button>
          </div>
        )}

        {/* الإدارة */}
        {view === 'admin' && (
          <div className="card">
             <h3 style={{ textAlign: "center" }}>🔐 لوحة التحكم - الإدارة</h3>
             <input type="password" placeholder="كلمة مرور الإدارة" value={adminPass} onChange={(e)=>setAdminPass(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />
             {adminPass === "Mansour@2026" && (
               <div style={{ textAlign: "center" }}>
                  <button onClick={() => setNewGeneratedCode("MS-" + Math.floor(Math.random()*90000 + 10000))} className="btn-gold">توليد كود بطاقة جديد</button>
                  {newGeneratedCode && <div style={{ marginTop: "20px", fontSize: "24px", color: "blue", fontWeight: "bold" }}>{newGeneratedCode}</div>}
               </div>
             )}
             <button onClick={()=>setView('login')} style={{ marginTop: "20px", width: "100%", background: "#EEE", border: "none", padding: "10px", borderRadius: "10px" }}>خروج</button>
          </div>
        )}

      </main>

      {/* زر واتساب العائم */}
      <a href="https://wa.me/967774575749" target="_blank" className="wa-btn">
        <span>تواصل مع المستشار</span>
        <span>💬</span>
      </a>

      <footer style={{ textAlign: "center", color: "#BDC3C7", fontSize: "11px", padding: "20px" }}>
        مستشار منصور الوعيل © 2026 | النسخة الاحترافية المعتمدة
      </footer>
    </div>
  );
}
