import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import engineData from './sovereign_engine.json';

export default function PromptArchitect() {
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
    prompt += `\nالمطلوب صياغته في التقرير:\n1. ملخص تنفيذي مركز.\n2. تحليل تقني للفجوات بناءً على المنهجيات الدولية.\n3. مصفوفة توصيات استراتيجية.\n\nاجعل الصياغة بأسلوب رسمي، رصين، ومقنع.`;
    setGeneratedPrompt(prompt);
    setCurrentStep(3);
  };

  return (
    <div dir="rtl" style={{ backgroundColor: "#0a192f", minHeight: "100vh", color: "white", fontFamily: "Cairo" }}>
      <Head>
        <title>معمار الأوامر السيادية</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet" />
      </Head>

      <style>{`* { font-family: 'Cairo', sans-serif !important; } .card { background: rgba(255, 255, 255, 0.05); padding: 25px; border-radius: 20px; border: 1px solid rgba(212, 175, 55, 0.3); } .btn { width: 100%; padding: 15px; border-radius: 12px; border: none; background: #d4af37; color: #0a192f; font-weight: 900; margin-bottom: 10px; cursor: pointer; } .input { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #d4af37; background: #0a192f; color: white; margin-bottom: 15px; }`}</style>

      <div style={{ maxWidth: "500px", margin: "0 auto", padding: "30px 15px" }}>
        <header style={{ textAlign: "center", marginBottom: "30px" }}>
          <h2 style={{ color: "#d4af37", fontWeight: 900 }}>🏛️ معمار الأوامر السيادية</h2>
          <p style={{ fontSize: "14px", opacity: 0.7 }}>حوّل بياناتك إلى تقارير استشارية بذكاء AI</p>
        </header>

        <div className="card">
          {currentStep === 0 && (
            <>
              <h4 style={{ marginBottom: "20px" }}>🛡️ اختر الركيزة الاستراتيجية:</h4>
              {engineData?.pillars?.map(p => (
                <button key={p.id} onClick={() => { setSelectedPillar(p); setCurrentStep(1); }} className="btn">{p.name}</button>
              ))}
            </>
          )}

          {currentStep === 1 && selectedPillar && (
            <>
              <h4 style={{ color: "#d4af37" }}>{selectedPillar.name}</h4>
              {selectedPillar.tracks?.map(t => (
                <button key={t.id} onClick={() => { setSelectedTrack(t); setCurrentStep(2); }} className="btn" style={{ background: "white" }}>{t.name}</button>
              ))}
              <button onClick={() => setCurrentStep(0)} style={{ color: "white", background: "none", width: "100%", marginTop: "10px" }}>رجوع</button>
            </>
          )}

          {currentStep === 2 && selectedTrack && (
            <>
              <h4 style={{ color: "#d4af37" }}>{selectedTrack.name}</h4>
              {selectedTrack.questions?.map((q, idx) => (
                <div key={idx}>
                  <label style={{ fontSize: "13px", display: "block", marginBottom: "5px" }}>{q.q}</label>
                  <textarea className="input" rows="3" onChange={(e) => setFormData({...formData, [`${selectedTrack.id}_${idx}`]: e.target.value})} placeholder="اكتب الملاحظات..." />
                </div>
              ))}
              <button onClick={buildFinalPrompt} className="btn">توليد الأمر الاحترافي 🚀</button>
            </>
          )}

          {currentStep === 3 && (
            <>
              <h4 style={{ color: "#22c55e" }}>✅ الأمر جاهز للنسخ!</h4>
              <div style={{ background: "white", color: "#0a192f", padding: "15px", borderRadius: "10px", fontSize: "13px", whiteSpace: "pre-wrap" }}>{generatedPrompt}</div>
              <button onClick={() => { navigator.clipboard.writeText(generatedPrompt); alert("تم النسخ!"); }} className="btn" style={{ marginTop: "15px" }}>نسخ الأمر 📋</button>
              <button onClick={() => setCurrentStep(0)} style={{ color: "white", background: "none", width: "100%" }}>إنشاء أمر جديد</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
