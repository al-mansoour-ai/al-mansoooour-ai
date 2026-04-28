import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import engineData from './sovereign_engine.json';

export default function SovereignMobilePro() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [credits, setCredits] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  // نظام حفظ الرصيد في ذاكرة المتصفح
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
      const startCredits = 1; // تقرير واحد مجاني
      setCredits(startCredits);
      localStorage.setItem('sovereign_user', email);
      localStorage.setItem('sovereign_credits', startCredits.toString());
    }
  };

  const handleGenerate = () => {
    if (credits > 0) {
      setShowReport(true);
      const newCredits = credits - 1;
      setCredits(newCredits);
      localStorage.setItem('sovereign_credits', newCredits.toString());
    }
  };

  if (!user) {
    return (
      <div dir="rtl" style={{ background: "#0a192f", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "white", padding: "20px" }}>
        <div style={{ textAlign: "center", width: "100%" }}>
          <h1 style={{ color: "#d4af37", marginBottom: "30px" }}>🏛️ منصة المنصور السيادية</h1>
          <input type="email" placeholder="أدخل بريدك الإلكتروني" onChange={(e)=>setEmail(e.target.value)} style={{ width: "100%", padding: "15px", borderRadius: "10px", border: "none", marginBottom: "15px" }} />
          <button onClick={handleLogin} style={{ width: "100%", padding: "15px", background: "#d4af37", border: "none", borderRadius: "10px", fontWeight: "900" }}>دخول آمن ✅</button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" style={{ background: "#f4f7f9", minHeight: "100vh", fontFamily: "Cairo, sans-serif" }}>
      <Head><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet" /></Head>
      
      {/* البار العلوي مع الرصيد */}
      <div style={{ background: "#0a192f", color: "white", padding: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "14px" }}>👤 {user}</span>
        <span style={{ background: "#d4af37", color: "#0a192f", padding: "5px 15px", borderRadius: "20px", fontWeight: "900" }}>🪙 الرصيد: {credits}</span>
      </div>

      <main style={{ padding: "20px" }}>
        {credits <= 0 && !showReport ? (
          <div style={{ background: "white", padding: "30px", borderRadius: "20px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
            <h2 style={{ color: "red" }}>⚠️ نفد الرصيد!</h2>
            <p>لقد استخدمت تقريرك المجاني. للحصول على المزيد، تواصل معنا:</p>
            <a href="https://wa.me/967770000000" style={{ display: "block", background: "#25D366", color: "white", padding: "15px", borderRadius: "10px", textDecoration: "none", fontWeight: "900", marginBottom: "20px" }}>👉 اطلب رصيد عبر واتساب</a>
            <hr />
            <input type="text" placeholder="أدخل كود الشحن (MS-XXXX)" style={{ width: "100%", padding: "12px", marginBottom: "10px", borderRadius: "8px", border: "1px solid #ddd" }} />
            <button onClick={() => { setCredits(5); alert("تم شحن 5 تقارير!"); }} style={{ width: "100%", padding: "12px", background: "#0a192f", color: "white", borderRadius: "8px" }}>تفعيل الكود 🚀</button>
          </div>
        ) : !showReport ? (
          <div style={{ background: "white", padding: "20px", borderRadius: "20px" }}>
             <h3>🛡️ محرك التقارير السيادية</h3>
             <p>اختر الركيزة والمسار وابدأ توليد تقريرك الاستراتيجي فوراً.</p>
             <textarea rows="5" placeholder="أدخل البيانات الميدانية..." style={{ width: "100%", padding: "15px", borderRadius: "10px", border: "1px solid #ddd", marginBottom: "15px" }}></textarea>
             <button onClick={handleGenerate} style={{ width: "100%", padding: "20px", background: "#d4af37", color: "#0a192f", fontWeight: "900", border: "none", borderRadius: "15px" }}>توليد التقرير النهائي 📄</button>
          </div>
        ) : (
          <div style={{ background: "white", padding: "30px", borderTop: "10px solid #d4af37" }}>
             <h2>📄 تقرير استراتيجي جاهز</h2>
             <p>بناءً على البيانات المقدمة، نوصي بتعزيز آليات الرقابة...</p>
             <button onClick={() => setShowReport(false)} style={{ marginTop: "20px", padding: "10px", width: "100%" }}>رجوع</button>
          </div>
        )}

        {/* قسم الإدارة السري */}
        <div style={{ marginTop: "50px", opacity: 0.5 }}>
          <button onClick={() => setAdminMode(!adminMode)} style={{ background: "none", border: "none", fontSize: "12px" }}>الإدارة ⚙️</button>
          {adminMode && (
            <div style={{ padding: "15px", background: "#eee", borderRadius: "10px", marginTop: "10px" }}>
              <input type="password" placeholder="كلمة المرور" onChange={(e)=>setAdminPass(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />
              {adminPass === "Mansour@2026" && (
                <button onClick={() => setGeneratedCode("MS-" + Math.random().toString(36).substr(2, 6).toUpperCase())} style={{ background: "black", color: "white", padding: "10px", width: "100%" }}>توليد كود شحن رصيد</button>
              )}
              {generatedCode && <div style={{ marginTop: "10px", fontWeight: "900", color: "blue" }}>الكود: {generatedCode}</div>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
