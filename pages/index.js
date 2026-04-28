import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import engineData from './sovereign_engine.json';

export default function ProfessionalSovereignV4() {
  const [currentStep, setCurrentStep] = useState(0); 
  const [selectedPillar, setSelectedPillar] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [formData, setFormData] = useState({});
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);
  if (!isClient) return null;

  const buildFinalPrompt = () => {
    let prompt = `بصفتك مستشاراً إستراتيجياً وخبيراً في المنهجيات الدولية (OECD & Kirkpatrick)، قم بتحليل البيانات التالية لمسار (${selectedTrack.name}):\n\n`;
    prompt += `[البيانات المرصودة ميدانياً]:\n`;
    selectedTrack.questions.forEach((q, idx) => {
      const answer = formData[`${selectedTrack.id}_${idx}`] || "لم يتم تقديم تفاصيل كافية";
      prompt += `- ${q.q}: ${answer}\n`;
    });
    prompt += `\n[المطلوب منك في التقرير]:\n`;
    prompt += `1. صياغة تحليل "فجوة" (Gap Analysis) بين الواقع والمأمول.\n`;
    prompt += `2. تقديم 3 توصيات إستراتيجية قائمة على معايير الجودة العالمية.\n`;
    prompt += `3. استشراف المخاطر المستقبلية في حال عدم التدخل.\n\nاجعل الأسلوب تقنياً، مهنياً، وصالحاً للعرض على مجلس الإدارة.`;
    setGeneratedPrompt(prompt);
    setCurrentStep(3);
  };

  return (
    <div dir="rtl" style={{ backgroundColor: "#fcfcfc", minHeight: "100vh", fontFamily: "'Cairo', sans-serif", color: "#1e293b" }}>
      <Head>
        <title>منصة المنصور - التميز الإستراتيجي</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        * { font-family: 'Cairo', sans-serif !important; transition: all 0.3s ease; }
        .app-bar { background: #1e293b; padding: 25px 15px; text-align: center; border-bottom: 4px solid #c5a059; border-radius: 0 0 30px 30px; margin-bottom: 30px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .card-container { background: #ffffff; padding: 25px; border-radius: 25px; border: 1px solid #f1f1f1; box-shadow: 0 15px 40px rgba(0,0,0,0.02); }
        .pill-button { width: 100%; padding: 18px; margin-bottom: 12px; border-radius: 18px; border: 1px solid #f1f1f1; background: #fff; color: #1e293b; font-weight: 600; cursor: pointer; text-align: right; font-size: 15px; }
        .pill-button:hover { background: #fafafa; border-color: #c5a059; transform: translateX(-5px); }
        .primary-btn { width: 100%; padding: 20px; border-radius: 18px; border: none; background: #1e293b; color: white; font-weight: 700; font-size: 16px; margin-top: 15px; cursor: pointer; }
        .primary-btn:active { transform: scale(0.98); }
        .input-area { width: 100%; padding: 15px; border-radius: 15px; border: 1px solid #e2e8f0; background: #fcfcfc; margin-bottom: 20px; font-size: 15px; line-height: 1.6; resize: none; box-sizing: border-box; }
        .input-area:focus { outline: none; border-color: #c5a059; background: #fff; }
        .hint-badge { background: #fdfaf3; color: #856404; padding: 10px; border-radius: 10px; font-size: 13px; margin-bottom: 10px; border-right: 4px solid #c5a059; }
      `}</style>

      <div className="app-bar">
        <h2 style={{ margin: 0, color: "#fff", fontWeight: 900, fontSize: "20px" }}>🏛️ منصة المنصور السيادية</h2>
        <p style={{ margin: "5px 0 0 0", color: "#c5a059", fontSize: "12px", letterSpacing: "1px" }}>التميز الإستراتيجي والمتابعة الفنية</p>
      </div>

      <main style={{ maxWidth: "550px", margin: "0 auto", padding: "0 20px" }}>
        
        <div className="card-container">
          {currentStep === 0 && (
            <>
              <h3 style={{ marginBottom: "25px", fontSize: "17px", color: "#64748b", textAlign: "center" }}>اختر ركيزة التحليل الإستراتيجي</h3>
              {engineData?.pillars?.map(p => (
                <button key={p.id} onClick={() => { setSelectedPillar(p); setCurrentStep(1); }} className="pill-button">
                  <span style={{ color: "#c5a059", marginLeft: "10px" }}>•</span> {p.name}
                </button>
              ))}
            </>
          )}

          {currentStep === 1 && selectedPillar && (
            <>
              <h4 style={{ color: "#c5a059", textAlign: "center", marginBottom: "20px" }}>{selectedPillar.name}</h4>
              {selectedPillar.tracks?.map(t => (
                <button key={t.id} onClick={() => { setSelectedTrack(t); setCurrentStep(2); }} className="pill-button" style={{ background: "#fcfcfc" }}>{t.name}</button>
              ))}
              <button onClick={() => setCurrentStep(0)} style={{ width: "100%", background: "none", border: "none", color: "#94a3b8", marginTop: "15px" }}>تراجع للركائز</button>
            </>
          )}

          {currentStep === 2 && selectedTrack && (
            <>
              <h4 style={{ color: "#1e293b", textAlign: "center", marginBottom: "25px" }}>{selectedTrack.name}</h4>
              {selectedTrack.questions?.map((q, idx) => (
                <div key={idx} style={{ marginBottom: "25px" }}>
                  <label style={{ fontSize: "14px", fontWeight: 700, display: "block", marginBottom: "8px", color: "#475569" }}>{idx + 1}. {q.q}</label>
                  <div className="hint-badge">💡 مثال استرشادي: {q.example}</div>
                  <textarea 
                    className="input-area" 
                    rows="3" 
                    onChange={(e) => setFormData({...formData, [`${selectedTrack.id}_${idx}`]: e.target.value})}
                    placeholder="اكتب الملاحظات الميدانية هنا..."
                  />
                </div>
              ))}
              <button onClick={buildFinalPrompt} className="primary-btn">بناء الأمر الاستشاري 🚀</button>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <div style={{ background: "#f0fdf4", color: "#166534", padding: "10px", borderRadius: "10px", display: "inline-block", fontSize: "14px", fontWeight: 700 }}>✅ تم تجهيز الأمر بنجاح</div>
              </div>
              <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "15px", border: "1px dashed #c5a059", fontSize: "14px", color: "#1e293b", lineHeight: "1.8", whiteSpace: "pre-wrap" }}>
                {generatedPrompt}
              </div>
              <button 
                onClick={() => { navigator.clipboard.writeText(generatedPrompt); alert("تم النسخ! الصقه الآن في Gemini."); }} 
                className="primary-btn" style={{ background: "#c5a059", color: "#1e293b" }}>نسخ الأمر للاستخدام 📋</button>
              <button onClick={() => setCurrentStep(0)} style={{ width: "100%", background: "none", border: "none", color: "#94a3b8", marginTop: "15px" }}>تحليل جديد</button>
            </>
          )}
        </div>
      </main>
      
      <footer style={{ textAlign: "center", marginTop: "30px", fontSize: "11px", color: "#cbd5e1" }}>
        مستشار منصور الوعيل © 2026 | نظام السيادة التقني
      </footer>
    </div>
  );
}
