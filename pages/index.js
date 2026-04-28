import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import engineData from './sovereign_engine.json';

export default function SovereignFinalForce() {
  const [activeTab, setActiveTab] = useState('platform');
  const [currentStep, setCurrentStep] = useState(0); 
  const [selectedPillar, setSelectedPillar] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [formData, setFormData] = useState({});
  const [showFinalReport, setShowFinalReport] = useState(false);
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
        * { font-family: 'Cairo', sans-serif !important; }
        .card { background:white; padding:25px; border-radius:25px; box-shadow:0 10px 40px rgba(0,0,0,0.05); margin-bottom:20px; border:1px solid #eee; cursor:pointer; width:100%; text-align:right; }
        .card:hover { border-color: #d4af37; background: #fffdf5; transform: translateY(-3px); }
        .hint { background:#f0fdf4; border-right:5px solid #22c55e; padding:15px; border-radius:12px; margin-bottom:15px; font-size:14px; color:#166534; }
        .report-page { background: #fff; padding: 50px; border: 1px solid #ddd; border-top: 15px solid #0a192f; line-height: 1.8; }
        @media print { .no-print { display: none !important; } .report-page { padding: 0; border: none; } }
      `}</style>

      <div className="no-print" style={{ background: "#0a192f", color: "white", padding: "20px", textAlign: "center", borderBottom: "5px solid #d4af37" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 900, margin: 0 }}>🏛️ محرك التقارير السيادية (النسخة المكتملة)</h2>
      </div>

      <main style={{ maxWidth: "750px", margin: "30px auto", padding: "0 20px" }}>
        
        {activeTab === 'platform' && !showFinalReport && (
          <div>
            {currentStep === 0 && (
              <>
                <h3 style={{ fontWeight: 900, marginBottom: "30px" }}>🛡️ اختر الركيزة الاستراتيجية (الخمس الركائز):</h3>
                {engineData?.pillars?.map(p => (
                  <button key={p.id} onClick={() => { setSelectedPillar(p); setCurrentStep(1); }} className="card"><b>{p.name}</b></button>
                ))}
              </>
            )}

            {currentStep === 1 && selectedPillar && (
              <>
                <h3 style={{ color: "#d4af37", fontWeight: 900 }}>{selectedPillar.name}</h3>
                {selectedPillar.tracks?.length > 0 ? (
                  selectedPillar.tracks.map(t => (
                    <button key={t.id} onClick={() => { setSelectedTrack(t); setCurrentStep(2); }} className="card"><b>{t.name}</b></button>
                  ))
                ) : (
                  <div className="card">قريباً سيتم تفعيل المسارات...</div>
                )}
                <button onClick={() => setCurrentStep(0)} style={{ width: "100%", padding: "15px", borderRadius: "15px", border: "1px solid #ddd" }}>تراجع</button>
              </>
            )}

            {currentStep === 2 && selectedTrack && (
              <>
                <h3 style={{ color: "#0a192f", fontWeight: 900 }}>{selectedTrack.name}</h3>
                {selectedTrack.questions?.map((q, idx) => (
                  <div key={idx} style={{ marginBottom: "35px" }}>
                    <label style={{ fontWeight: 900, display: "block", marginBottom: "10px" }}>{idx + 1}. {q.q}</label>
                    {/* هنا تظهر الأمثلة التي ظننت أنها حُذفت */}
                    <div className="hint">💡 مثال استرشادي: {q.example}</div>
                    <textarea 
                      onChange={(e) => setFormData({...formData, [`${selectedTrack.id}_${idx}`]: e.target.value})}
                      rows="4" 
                      style={{ width: "100%", padding: "15px", borderRadius: "15px", border: "1px solid #cbd5e1" }} 
                      placeholder="أدخل البيانات الميدانية هنا..."
                    />
                  </div>
                ))}
                <div style={{ display: "flex", gap: "15px" }}>
                  <button onClick={() => setCurrentStep(1)} style={{ flex: 1, padding: "20px", borderRadius: "15px", background: "#f1f5f9", border: "none" }}>السابق</button>
                  <button onClick={() => setShowFinalReport(true)} style={{ flex: 2, padding: "20px", background: "#d4af37", color: "#0a192f", borderRadius: "15px", fontWeight: 900, border: "none" }}>توليد التقرير الجاهز 📄</button>
                </div>
              </>
            )}
          </div>
        )}

        {showFinalReport && (
          <div className="report-page">
            <div style={{ textAlign: "center", borderBottom: "2px solid #0a192f", paddingBottom: "20px", marginBottom: "30px" }}>
              <h2 style={{ color: "#0a192f", margin: 0 }}>تقرير استراتيجي احترافي</h2>
              <p>المسار: {selectedTrack.name}</p>
            </div>
            {selectedTrack.questions.map((q, idx) => (
              <div key={idx} style={{ marginBottom: "25px" }}>
                <h4 style={{ color: "#d4af37", marginBottom: "5px" }}>● {q.q}</h4>
                <p style={{ background: "#f9f9f9", padding: "15px", borderRadius: "10px", borderRight: "4px solid #0a192f" }}>
                  {formData[`${selectedTrack.id}_${idx}`] || "لم يتم توفير بيانات."}
                </p>
              </div>
            ))}
            <div className="no-print" style={{ marginTop: "40px", display: "flex", gap: "10px" }}>
              <button onClick={() => setShowFinalReport(false)} style={{ flex: 1, padding: "15px", background: "#eee", border: "none", borderRadius: "10px" }}>تعديل البيانات</button>
              <button onClick={() => window.print()} style={{ flex: 2, padding: "15px", background: "#0a192f", color: "white", border: "none", borderRadius: "10px", fontWeight: 900 }}>طباعة / PDF</button>
            </div>
          </div>
        )}
      </main>

      <nav className="no-print" style={{ position: "fixed", bottom: 0, width: "100%", height: "90px", background: "white", display: "flex", borderTop: "1px solid #eee", zIndex: 1000 }}>
        <button onClick={() => { setShowFinalReport(false); setActiveTab('platform'); setCurrentStep(0); }} style={{ flex: 1, border: "none", background: "none", color: activeTab === 'platform' ? "#0a192f" : "#adb5bd" }}>
          <div style={{ fontSize: "25px" }}>🏠</div><div style={{ fontSize: "11px", fontWeight: 900 }}>المنصة</div>
        </button>
        <button onClick={() => setActiveTab('pricing')} style={{ flex: 1, border: "none", background: "none", color: activeTab === 'pricing' ? "#0a192f" : "#adb5bd" }}>
          <div style={{ fontSize: "25px" }}>💳</div><div style={{ fontSize: "11px", fontWeight: 900 }}>الباقات</div>
        </button>
      </nav>
    </div>
  );
}
