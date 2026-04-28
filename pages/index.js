import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import engineData from './sovereign_engine.json';

export default function SovereignUnifiedSystem() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [credits, setCredits] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPillar, setSelectedPillar] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [formData, setFormData] = useState({});
  const [showReport, setShowReport] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [activationCode, setActivationCode] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('sovereign_user');
    if (savedUser) {
      setUser(savedUser);
      setCredits(parseInt(localStorage.getItem('sovereign_credits') || '1'));
    }
  }, []);

  const handleLogin = () => {
    if (email) {
      setUser(email);
      setCredits(1); 
      localStorage.setItem('sovereign_user', email);
      localStorage.setItem('sovereign_credits', '1');
    }
  };

  const handleFinalGenerate = () => {
    if (credits > 0) {
      setShowReport(true);
      const newCredits = credits - 1;
      setCredits(newCredits);
      localStorage.setItem('sovereign_credits', newCredits.toString());
    }
  };

  const handleActivateCode = () => {
    if (activationCode.startsWith("MS-")) {
      const newCredits = credits + 5;
      setCredits(newCredits);
      localStorage.setItem('sovereign_credits', newCredits.toString());
      setActivationCode('');
      alert("تم شحن 5 تقارير بنجاح! 🪙");
    } else {
      alert("الكود غير صحيح");
    }
  };

  if (!user) {
    return (
      <div dir="rtl" style={{ background: "#0a192f", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "white", padding: "20px", fontFamily: "Cairo" }}>
        <div style={{ textAlign: "center", width: "100%", maxWidth: "400px" }}>
          <h1 style={{ color: "#d4af37", fontWeight: 900 }}>🏛️ منصة المنصور السيادية</h1>
          <p style={{ marginBottom: "30px", opacity: 0.8 }}>نظام توليد التقارير الاستراتيجية الاحترافي</p>
          <input type="email" placeholder="أدخل بريدك الإلكتروني" onChange={(e)=>setEmail(e.target.value)} style={{ width: "100%", padding: "15px", borderRadius: "10px", border: "none", marginBottom: "15px", textAlign: "center" }} />
          <button onClick={handleLogin} style={{ width: "100%", padding: "15px", background: "#d4af37", color: "#0a192f", border: "none", borderRadius: "10px", fontWeight: "900", cursor: "pointer" }}>دخول آمن ✅</button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" style={{ background: "#f8f9fa", minHeight: "100vh", fontFamily: "Cairo, sans-serif", paddingBottom: "100px" }}>
      <Head><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet" /></Head>
      
      {/* البار العلوي الثابت */}
      <div style={{ background: "#0a192f", color: "white", padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, borderBottom: "3px solid #d4af37" }}>
        <span style={{ fontSize: "12px", fontWeight: 700 }}>👤 {user}</span>
        <span style={{ background: "#d4af37", color: "#0a192f", padding: "5px 15px", borderRadius: "20px", fontWeight: "900", fontSize: "14px" }}>🪙 الرصيد: {credits}</span>
      </div>

      <main style={{ maxWidth: "600px", margin: "20px auto", padding: "0 15px" }}>
        
        {credits <= 0 && !showReport ? (
          <div style={{ background: "white", padding: "30px", borderRadius: "25px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <h2 style={{ color: "#e11d48", fontWeight: 900 }}>⚠️ نفد الرصيد السيادي</h2>
            <p style={{ color: "#64748b", marginBottom: "25px" }}>للاستمرار في توليد التقارير الاحترافية، يرجى شحن الرصيد عبر التواصل مع الإدارة.</p>
            <a href="https://wa.me/967770000000" style={{ display: "block", background: "#25D366", color: "white", padding: "18px", borderRadius: "15px", textDecoration: "none", fontWeight: "900", marginBottom: "25px" }}>👉 شراء رصيد عبر واتساب</a>
            <div style={{ background: "#f1f5f9", padding: "20px", borderRadius: "15px" }}>
              <input type="text" value={activationCode} onChange={(e)=>setActivationCode(e.target.value)} placeholder="أدخل كود التفعيل (MS-XXXX)" style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "10px", border: "1px solid #cbd5e1", textAlign: "center" }} />
              <button onClick={handleActivateCode} style={{ width: "100%", padding: "12px", background: "#0a192f", color: "white", borderRadius: "10px", fontWeight: 700 }}>تفعيل الكود 🚀</button>
            </div>
          </div>
        ) : !showReport ? (
          <div style={{ background: "white", padding: "30px", borderRadius: "25px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            
            {currentStep === 0 && (
              <>
                <h3 style={{ fontWeight: 900, marginBottom: "25px", color: "#0a192f" }}>🛡️ اختر الركيزة الاستراتيجية:</h3>
                {engineData?.pillars?.map(p => (
                  <button key={p.id} onClick={() => { setSelectedPillar(p); setCurrentStep(1); }} style={{ width: "100%", padding: "20px", marginBottom: "12px", borderRadius: "15px", border: "1px solid #e2e8f0", background: "white", textAlign: "right", fontWeight: 700, cursor: "pointer" }}>{p.name}</button>
                ))}
              </>
            )}

            {currentStep === 1 && selectedPillar && (
              <>
                <h3 style={{ color: "#d4af37", fontWeight: 900 }}>{selectedPillar.name}</h3>
                {selectedPillar.tracks?.map(t => (
                  <button key={t.id} onClick={() => { setSelectedTrack(t); setCurrentStep(2); }} style={{ width: "100%", padding: "18px", marginBottom: "10px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#f8fafc", textAlign: "right", fontWeight: 700 }}>{t.name}</button>
                ))}
                <button onClick={() => setCurrentStep(0)} style={{ width: "100%", marginTop: "20px", padding: "12px", borderRadius: "10px", border: "none", background: "#eee" }}>تراجع</button>
              </>
            )}

            {currentStep === 2 && selectedTrack && (
              <>
                <h3 style={{ color: "#0a192f", fontWeight: 900 }}>{selectedTrack.name}</h3>
                {selectedTrack.questions?.map((q, idx) => (
                  <div key={idx} style={{ marginBottom: "25px" }}>
                    <label style={{ fontWeight: 700, display: "block", marginBottom: "8px", fontSize: "14px" }}>{idx + 1}. {q.q}</label>
                    <div style={{ fontSize: "12px", color: "#166534", background: "#f0fdf4", padding: "10px", borderRadius: "8px", marginBottom: "8px" }}>💡 مثال: {q.example}</div>
                    <textarea onChange={(e) => setFormData({...formData, [`${selectedTrack.id}_${idx}`]: e.target.value})} rows="3" style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #cbd5e1" }} placeholder="اكتب الملاحظات الميدانية..."></textarea>
                  </div>
                ))}
                <button onClick={handleFinalGenerate} style={{ width: "100%", padding: "20px", background: "#0a192f", color: "#d4af37", fontWeight: "900", borderRadius: "15px", border: "none", fontSize: "18px" }}>توليد التقرير النهائي (-1 🪙)</button>
              </>
            )}
          </div>
        ) : (
          <div style={{ background: "white", padding: "40px", borderRadius: "0", borderTop: "15px solid #0a192f", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}>
             <div style={{ textAlign: "center", borderBottom: "2px solid #eee", paddingBottom: "20px", marginBottom: "30px" }}>
                <h1 style={{ color: "#0a192f", margin: 0 }}>تقرير استراتيجي</h1>
                <p style={{ color: "#d4af37", fontWeight: 700 }}>{selectedTrack.name}</p>
             </div>
             {selectedTrack.questions.map((q, idx) => (
               <div key={idx} style={{ marginBottom: "25px" }}>
                 <h4 style={{ color: "#0a192f", marginBottom: "5px" }}>● {q.q}</h4>
                 <p style={{ background: "#f8fafc", padding: "15px", borderRadius: "10px", borderRight: "4px solid #d4af37" }}>{formData[`${selectedTrack.id}_${idx}`] || "لم يتم توفير بيانات."}</p>
               </div>
             ))}
             <button onClick={() => {setShowReport(false); setCurrentStep(0);}} style={{ width: "100%", padding: "15px", background: "#0a192f", color: "white", borderRadius: "10px", border: "none", fontWeight: 700, marginTop: "30px" }}>إنشاء تقرير جديد</button>
             <button onClick={() => window.print()} style={{ width: "100%", marginTop: "10px", padding: "15px", background: "#eee", borderRadius: "10px", border: "none" }}>طباعة / PDF 📄</button>
          </div>
        )}

        {/* قسم الإدارة المخفي */}
        <div style={{ marginTop: "60px", textAlign: "center" }}>
          <button onClick={() => setAdminMode(!adminMode)} style={{ background: "none", border: "none", color: "#cbd5e1", fontSize: "10px" }}>Config v2.1</button>
          {adminMode && (
            <div style={{ padding: "20px", background: "#fff", borderRadius: "15px", marginTop: "10px", border: "1px solid #eee" }}>
              <input type="password" placeholder="Admin Pass" onChange={(e)=>setAdminPass(e.target.value)} style={{ width: "100%", marginBottom: "10px", textAlign: "center" }} />
              {adminPass === "Mansour@2026" && (
                <button onClick={() => setGeneratedCode("MS-" + Math.random().toString(36).substr(2, 6).toUpperCase())} style={{ background: "#000", color: "#fff", padding: "10px", width: "100%", borderRadius: "8px" }}>توليد كود رصيد</button>
              )}
              {generatedCode && <div style={{ marginTop: "10px", fontWeight: "900", color: "#2563eb", background: "#eff6ff", padding: "10px" }}>Code: {generatedCode}</div>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
