import React, { useState, useEffect } from 'react';
import Head from 'next/head';
// استيراد البيانات من الملف الموجود في نفس المجلد
import engineData from './sovereign_engine.json';

export default function SovereignMasterPlatform() {
  const [activeTab, setActiveTab] = useState('platform');
  const [currentStep, setCurrentStep] = useState(0); 
  const [selectedPillar, setSelectedPillar] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);
  if (!isClient) return null;

  return (
    <div dir="rtl" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", paddingBottom: "110px" }}>
      <Head>
        <title>منصة المنصور السيادية</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        * { font-family: 'Cairo', sans-serif !important; color: #1e293b; }
        .card { background:white; padding:25px; border-radius:25px; box-shadow:0 10px 40px rgba(0,0,0,0.05); margin-bottom:20px; border:1px solid #eee; cursor:pointer; text-align:right; width:100%; transition: 0.3s; }
        .card:hover { border-color: #d4af37; background: #fffdf5; transform: translateY(-3px); }
        .hint { background:#f0fdf4; border-right:5px solid #22c55e; padding:15px; border-radius:12px; margin-bottom:15px; font-size:14px; color:#166534; line-height: 1.6; }
        .nav-link { flex: 1; border: none; background: none; color: #adb5bd; padding: 15px 0; cursor: pointer; }
        .nav-link.active { color: #0a192f; border-bottom: 4px solid #d4af37; font-weight: 900; }
        @media print { .no-print { display: none !important; } }
      `}</style>

      <div className="no-print" style={{ background: "#0a192f", color: "white", padding: "20px", textAlign: "center", borderBottom: "5px solid #d4af37" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 900, margin: 0, color: "white" }}>🏛️ محرك التقارير السيادية (Sovereign V2)</h2>
      </div>

      <main style={{ maxWidth: "680px", margin: "25px auto", padding: "0 15px" }}>
        {activeTab === 'platform' && (
          <div style={{ background: "white", padding: "35px", borderRadius: "30px", boxShadow: "0 20px 50px rgba(0,0,0,0.05)" }}>
            
            {currentStep === 0 && (
              <>
                <h3 style={{ fontWeight: 900, color: "#0a192f", marginBottom: "30px" }}>🛡️ اختر الركيزة المنهجية الدولية:</h3>
                {engineData?.pillars?.map(p => (
                  <button key={p.id} onClick={() => { setSelectedPillar(p); setCurrentStep(1); }} className="card">
                    <b style={{ fontSize: "17px" }}>{p.name}</b>
                  </button>
                ))}
              </>
            )}

            {currentStep === 1 && selectedPillar && (
              <>
                <h3 style={{ color: "#d4af37", fontWeight: 900 }}>{selectedPillar.name}</h3>
                {selectedPillar.tracks?.length > 0 ? (
                  selectedPillar.tracks.map(t => (
                    <button key={t.id} onClick={() => { setSelectedTrack(t); setCurrentStep(2); }} className="card">
                      <b>{t.name}</b>
                    </button>
                  ))
                ) : (
                  <div className="card" style={{ cursor: "default", color: "#666" }}>قريباً سيتم تفعيل كافة مسارات هذه الركيزة...</div>
                )}
                <button onClick={() => setCurrentStep(0)} style={{ width: "100%", padding: "15px", borderRadius: "12px", border: "1px solid #eee", background: "none" }}>تراجع للركائز</button>
              </>
            )}

            {currentStep === 2 && selectedTrack && (
              <>
                <h3 style={{ color: "#0a192f", fontWeight: 900, marginBottom: "30px" }}>{selectedTrack.name}</h3>
                {selectedTrack.questions?.map((q, idx) => (
                  <div key={idx} style={{ marginBottom: "40px" }}>
                    <label style={{ fontWeight: 900, display: "block", marginBottom: "12px", fontSize: "16px" }}>{idx + 1}. {q.q}</label>
                    <div className="hint">💡 مثال استرشادي: {q.example}</div>
                    <textarea rows="5" style={{ width: "100%", padding: "18px", borderRadius: "18px", border: "1px solid #cbd5e1", fontSize: "15px", boxSizing: "border-box" }} placeholder="أدخل البيانات الميدانية هنا..."></textarea>
                  </div>
                ))}
                <div style={{ display: "flex", gap: "15px" }}>
                  <button onClick={() => setCurrentStep(1)} style={{ flex: 1, padding: "20px", borderRadius: "15px", background: "#f1f5f9", fontWeight: 700, border: "none" }}>السابق</button>
                  <button onClick={() => window.print()} style={{ flex: 2, padding: "20px", background: "#d4af37", color: "#0a192f", borderRadius: "15px", fontWeight: 900, border: "none" }}>توليد التقرير النهائي 📄</button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'pricing' && (
          <div style={{ background: "white", padding: "40px", borderRadius: "30px", textAlign: "center" }}>
            <h3 style={{ fontWeight: 900, color: "#0a192f", fontSize: "24px" }}>💰 اشتراكات النخبة الاستراتيجية</h3>
            <div style={{ border: "2px solid #d4af37", padding: "30px", borderRadius: "25px", margin: "30px 0", background: "#fffdf5" }}>
              <h4 style={{ margin: 0, fontSize: "22px" }}>باقة الاحتراف (Pro)</h4>
              <div style={{ fontSize: "36px", fontWeight: 900, color: "#d4af37", margin: "15px 0" }}>$29 <small style={{ fontSize: "14px" }}>/ شهر</small></div>
              <button style={{ width: "100%", background: "#0a192f", color: "white", padding: "18px", borderRadius: "15px", border: "none", fontWeight: 900 }}>اشترك الآن</button>
            </div>
          </div>
        )}
      </main>

      <nav className="no-print" style={{ position: "fixed", bottom: 0, width: "100%", height: "90px", background: "white", display: "flex", borderTop: "2px solid #eee", zIndex: 1000, paddingBottom: "15px" }}>
        <button onClick={() => { setActiveTab('platform'); setCurrentStep(0); }} className={`nav-link ${activeTab === 'platform' ? 'active' : ''}`}>
          <div style={{ fontSize: "26px" }}>🏠</div><div style={{ fontSize: "12px", fontWeight: 900 }}>المنصة</div>
        </button>
        <button onClick={() => setActiveTab('pricing')} className={`nav-link ${activeTab === 'pricing' ? 'active' : ''}`}>
          <div style={{ fontSize: "26px" }}>💳</div><div style={{ fontSize: "12px", fontWeight: 900 }}>الباقات</div>
        </button>
      </nav>
    </div>
  );
}
