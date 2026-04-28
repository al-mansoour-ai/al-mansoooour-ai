import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import engineData from './sovereign_engine.json';

export default function SovereignCalmUI() {
  const [currentStep, setCurrentStep] = useState(0); 
  const [selectedPillar, setSelectedPillar] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [formData, setFormData] = useState({});
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);
  if (!isClient) return null;

  const buildFinalPrompt = () => {
    let prompt = `بصفتك مستشاراً استراتيجياً دولياً، صغ تقريراً احترافياً لمسار (${selectedTrack.name}) بناءً على الملاحظات التالية:\n\n`;
    selectedTrack.questions.forEach((q, idx) => {
      const answer = formData[`${selectedTrack.id}_${idx}`] || "لم تتوفر بيانات";
      prompt += `- ${q.q}: ${answer}\n`;
    });
    prompt += `\nالمطلوب: تحليل فني، رصد الفجوات، و3 توصيات تنفيذية وفق المعايير الدولية.`;
    setGeneratedPrompt(prompt);
    setCurrentStep(3);
  };

  return (
    <div dir="rtl" style={{ backgroundColor: "#F8F9FB", minHeight: "100vh", fontFamily: "'Cairo', sans-serif", color: "#34495E" }}>
      <Head>
        <title>منصة المنصور - واجهة هادئة</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        * { font-family: 'Cairo', sans-serif !important; }
        .mobile-header { background: #1B263B; color: #E0E1DD; padding: 25px 15px; text-align: center; border-bottom: 4px solid #C5A059; border-radius: 0 0 25px 25px; }
        .step-card { background: #FFFFFF; padding: 25px; border-radius: 20px; box-shadow: 0 8px 30px rgba(0,0,0,0.03); margin-top: -20px; border: 1px solid #EDF2F4; }
        .calm-btn { width: 100%; padding: 16px; border-radius: 14px; border: none; background: #1B263B; color: #F8F9FB; font-weight: 700; margin-bottom: 12px; cursor: pointer; transition: 0.3s; }
        .calm-btn:active { transform: scale(0.97); background: #415A77; }
        .track-btn { width: 100%; padding: 15px; border-radius: 12px; border: 1px solid #D1D5DB; background: #FFFFFF; color: #1B263B; font-weight: 600; margin-bottom: 10px; text-align: right; }
        .input-calm { width: 100%; padding: 14px; border-radius: 12px; border: 1px solid #D1D5DB; background: #FCFDFF; margin-bottom: 18px; font-size: 15px; box-sizing: border-box; }
        .hint-calm { background: #F0F4F8; color: #415A77; padding: 10px; border-radius: 10px; font-size: 13px; margin-bottom: 10px; border-right: 4px solid #C5A059; }
      `}</style>

      <div className="mobile-header">
        <h2 style={{ margin: 0, fontSize: "19px", fontWeight: 900 }}>🏛️ منصة المنصور السيادية</h2>
        <p style={{ margin: "4px 0 0 0", fontSize: "11px", opacity: 0.7 }}>الاحترافية في صياغة الأوامر الاستشارية</p>
      </div>

      <main style={{ maxWidth: "480px", margin: "0 auto", padding: "35px 18px" }}>
        <div className="step-card">
          {currentStep === 0 && (
            <>
              <h3 style={{ textAlign: "center", fontSize: "16px", color: "#415A77", marginBottom: "25px" }}>اختر ركيزة التحليل الاستراتيجي</h3>
              {engineData?.pillars?.map(p => (
                <button key={p.id} onClick={() => { setSelectedPillar(p); setCurrentStep(1); }} className="calm-btn">{p.name}</button>
              ))}
            </>
          )}

          {currentStep === 1 && selectedPillar && (
            <>
              <h3 style={{ textAlign: "center", color: "#C5A059", marginBottom: "20px" }}>{selectedPillar.name}</h3>
              {selectedPillar.tracks?.map(t => (
                <button key={t.id} onClick={() => { setSelectedTrack(t); setCurrentStep(2); }} className="track-btn">● {t.name}</button>
              ))}
              <button onClick={() => setCurrentStep(0)} style={{ width: "100%", background: "none", border: "none", color: "#94A3B8", marginTop: "10px" }}>تراجع</button>
            </>
          )}

          {currentStep === 2 && selectedTrack && (
            <>
              <h3 style={{ textAlign: "center", color: "#1B263B", marginBottom: "25px" }}>{selectedTrack.name}</h3>
              {selectedTrack.questions?.map((q, idx) => (
                <div key={idx} style={{ marginBottom: "25px" }}>
                  <label style={{ fontWeight: 700, display: "block", marginBottom: "8px", fontSize: "14px" }}>{idx + 1}. {q.q}</label>
                  <div className="hint-calm">💡 مثال: {q.example}</div>
                  <textarea className="input-calm" rows="3" onChange={(e) => setFormData({...formData, [`${selectedTrack.id}_${idx}`]: e.target.value})} placeholder="اكتب الملاحظات الميدانية..." />
                </div>
              ))}
              <button onClick={buildFinalPrompt} className="calm-btn" style={{ background: "#C5A059", color: "#1B263B" }}>بناء الأمر الاستشاري 🚀</button>
            </>
          )}

          {currentStep === 3 && (
            <>
              <h3 style={{ textAlign: "center", color: "#2D6A4F", marginBottom: "15px" }}>✅ الأمر جاهز للنسخ</h3>
              <div style={{ background: "#F8FAFC", padding: "18px", borderRadius: "15px", border: "1px dashed #C5A059", fontSize: "13.5px", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
                {generatedPrompt}
              </div>
              <button onClick={() => { navigator.clipboard.writeText(generatedPrompt); alert("تم النسخ بنجاح!"); }} className="calm-btn" style={{ marginTop: "20px" }}>نسخ الأمر 📋</button>
              <button onClick={() => setCurrentStep(0)} style={{ width: "100%", background: "none", border: "none", color: "#94A3B8", marginTop: "10px" }}>تحليل جديد</button>
            </>
          )}
        </div>
      </main>
      
      <footer style={{ textAlign: "center", padding: "20px", fontSize: "10px", color: "#94A3B8" }}>
        نظام السيادة الاستشارية © 2026 | تطوير مخصص للمستشار منصور
      </footer>
    </div>
  );
}
