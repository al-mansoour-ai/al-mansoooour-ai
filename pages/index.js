import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import engineData from './sovereign_engine.json';

export default function PromptArchitectMobile() {
  const [currentStep, setCurrentStep] = useState(0); 
  const [selectedPillar, setSelectedPillar] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [formData, setFormData] = useState({});
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);
  if (!isClient) return null;

  const buildFinalPrompt = () => {
    let prompt = `أنت الآن "كبير المستشارين الاستراتيجيين الدوليين". المطلوب منك صياغة تقرير مهني رفيع المستوى لمسار (${selectedTrack.name}) التابع لركيزة (${selectedPillar.name}).\n\n`;
    prompt += `إليك البيانات الخام المرصودة ميدانياً:\n`;
    selectedTrack.questions.forEach((q, idx) => {
      const answer = formData[`${selectedTrack.id}_${idx}`] || "لم تتوفر بيانات";
      prompt += `- ${q.q}: [${answer}]\n`;
    });
    prompt += `\nالمطلوب صياغته في التقرير:\n1. ملخص تنفيذي مركز.\n2. تحليل تقني للفجوات بناءً على المنهجيات الدولية.\n3. مصفوفة توصيات استراتيجية.\n\nاجعل الصياغة بأسلوب رسمي، رصين، ومقنع لصناع القرار.`;
    setGeneratedPrompt(prompt);
    setCurrentStep(3);
  };

  return (
    <div dir="rtl" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", fontFamily: "Cairo, sans-serif", paddingBottom: "50px" }}>
      <Head>
        <title>منصة المنصور السيادية</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        * { font-family: 'Cairo', sans-serif !important; }
        .app-header { background: #0a192f; color: white; padding: 20px; text-align: center; border-bottom: 5px solid #d4af37; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .main-card { background: white; padding: 25px; border-radius: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); margin-top: -20px; border: 1px solid #eee; }
        .btn-gold { width: 100%; padding: 18px; border-radius: 15px; border: none; background: #d4af37; color: #0a192f; font-weight: 900; margin-bottom: 12px; cursor: pointer; font-size: 16px; }
        .btn-navy { width: 100%; padding: 18px; border-radius: 15px; border: none; background: #0a192f; color: white; font-weight: 900; margin-bottom: 12px; cursor: pointer; font-size: 16px; }
        .input-box { width: 100%; padding: 15px; border-radius: 12px; border: 1px solid #cbd5e1; background: #fff; color: #1e293b; margin-bottom: 20px; font-size: 15px; box-sizing: border-box; }
        .hint-text { background: #f0fdf4; border-right: 4px solid #22c55e; padding: 10px; border-radius: 8px; margin-bottom: 10px; font-size: 13px; color: #166534; }
        .prompt-result { background: #f8fafc; color: #0f172a; padding: 20px; border-radius: 15px; font-size: 14px; white-space: pre-wrap; line-height: 1.6; border: 1px dashed #d4af37; }
      `}</style>

      <div className="app-header">
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 900 }}>🏛️ منصة المنصور السيادية</h2>
        <p style={{ margin: "5px 0 0 0", fontSize: "12px", opacity: 0.8 }}>محرك هندسة الأوامر الاستشارية</p>
      </div>

      <main style={{ maxWidth: "500px", margin: "0 auto", padding: "40px 20px" }}>
        
        <div className="main-card">
          {currentStep === 0 && (
            <>
              <h3 style={{ marginBottom: "25px", fontSize: "18px", color: "#0a192f", textAlign: "center" }}>🛡️ اختر الركيزة الاستراتيجية:</h3>
              {engineData?.pillars?.map(p => (
                <button key={p.id} onClick={() => { setSelectedPillar(p); setCurrentStep(1); }} className="btn-navy">{p.name}</button>
              ))}
            </>
          )}

          {currentStep === 1 && selectedPillar && (
            <>
              <h3 style={{ color: "#d4af37", marginBottom: "20px", textAlign: "center" }}>{selectedPillar.name}</h3>
              {selectedPillar.tracks?.map(t => (
                <button key={t.id} onClick={() => { setSelectedTrack(t); setCurrentStep(2); }} className="btn-gold">{t.name}</button>
              ))}
              <button onClick={() => setCurrentStep(0)} style={{ background: "none", border: "none", width: "100%", color: "#64748b", fontWeight: 700 }}>تراجع للركائز</button>
            </>
          )}

          {currentStep === 2 && selectedTrack && (
            <>
              <h3 style={{ color: "#0a192f", marginBottom: "25px", textAlign: "center" }}>{selectedTrack.name}</h3>
              {selectedTrack.questions?.map((q, idx) => (
                <div key={idx} style={{ marginBottom: "25px" }}>
                  <label style={{ fontSize: "14px", fontWeight: 700, display: "block", marginBottom: "8px", color: "#334155" }}>{idx + 1}. {q.q}</label>
                  <div className="hint-text">💡 مثال: {q.example}</div>
                  <textarea 
                    className="input-box" 
                    rows="3" 
                    onChange={(e) => setFormData({...formData, [`${selectedTrack.id}_${idx}`]: e.target.value})}
                    placeholder="أدخل البيانات الميدانية هنا..."
                  />
                </div>
              ))}
              <button onClick={buildFinalPrompt} className="btn-navy">بناء الأمر الاستشاري 🚀</button>
              <button onClick={() => setCurrentStep(1)} style={{ background: "none", border: "none", width: "100%", color: "#64748b", fontWeight: 700 }}>السابق</button>
            </>
          )}

          {currentStep === 3 && (
            <>
              <h3 style={{ color: "#16a34a", marginBottom: "15px", textAlign: "center" }}>✅ تم تجهيز الأمر!</h3>
              <p style={{ fontSize: "13px", marginBottom: "20px", color: "#475569", textAlign: "center" }}>انسخ النص أدناه وضعه في Gemini أو ChatGPT للحصول على التقرير.</p>
              <div className="prompt-result">{generatedPrompt}</div>
              <button 
                onClick={() => { navigator.clipboard.writeText(generatedPrompt); alert("تم النسخ بنجاح! اذهب الآن لـ Gemini"); }} 
                className="btn-gold" style={{ marginTop: "20px" }}>نسخ الأمر الاحترافي 📋</button>
              <button onClick={() => setCurrentStep(0)} style={{ background: "none", border: "none", width: "100%", color: "#64748b", fontWeight: 700 }}>بدء تحليل جديد</button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
