import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import engineData from './sovereign_engine.json';

export default function SovereignAutoGenerator() {
  const [activeTab, setActiveTab] = useState('platform');
  const [currentStep, setCurrentStep] = useState(0); 
  const [selectedPillar, setSelectedPillar] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [formData, setFormData] = useState({});
  const [showFinalReport, setShowFinalReport] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);
  if (!isClient) return null;

  // محرك الصياغة الاستشارية التلقائي
  const renderProfessionalAnalysis = (question, answer) => {
    if (!answer || answer.trim() === "") return "لا توجد بيانات كافية للتحليل.";
    // صياغة استنتاجية بسيطة تحاكي الذكاء الاصطناعي
    const templates = [
      `بناءً على المعطيات المرصودة بشأن (${question})، تبين أن هناك ${answer}. وهذا يستوجب مراجعة استراتيجية لضمان الامتثال المعياري.`,
      `تشير البيانات الميدانية المتعلقة بـ (${question}) إلى وجود (${answer})، مما يستدعي تدخلًا تطويريًا لرفع كفاءة الأداء المؤسسي.`,
      `من خلال فحص (${question})، تم رصد أن (${answer}). نوصي بتعزيز نقاط القوة ومعالجة الفجوات المذكورة وفق الجدول الزمني.`
    ];
    // اختيار قالب عشوائي ليعطي انطباع التنوع في التقرير
    return templates[Math.floor(Math.random() * templates.length)];
  };

  return (
    <div dir="rtl" style={{ backgroundColor: "#f4f7f9", minHeight: "100vh", paddingBottom: "110px" }}>
      <Head>
        <title>منصة المنصور - التوليد التلقائي</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        * { font-family: 'Cairo', sans-serif !important; }
        .card { background:white; padding:25px; border-radius:25px; box-shadow:0 10px 40px rgba(0,0,0,0.05); margin-bottom:20px; border:1px solid #eee; cursor:pointer; width:100%; text-align:right; }
        .executive-report { background: #fff; padding: 50px; border-radius: 10px; min-height: 297mm; position: relative; }
        .gold-border { border-top: 10px solid #d4af37; border-bottom: 10px solid #0a192f; }
        .section-title { color: #d4af37; border-right: 5px solid #0a192f; padding-right: 15px; margin: 30px 0 15px 0; font-weight: 900; }
        .nav-btn { flex: 1; border: none; background: none; color: #adb5bd; padding: 15px 0; cursor: pointer; }
        .nav-btn.active { color: #0a192f; border-bottom: 4px solid #d4af37; font-weight: 900; }
        @media print { .no-print { display: none !important; } .executive-report { padding: 0; box-shadow: none; } }
      `}</style>

      {/* الهيدر العلوي */}
      <div className="no-print" style={{ background: "#0a192f", color: "white", padding: "20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 900, margin: 0 }}>🏛️ محرك التوليد الاستراتيجي الفوري</h2>
      </div>

      <main style={{ maxWidth: "800px", margin: "30px auto", padding: "0 20px" }}>
        
        {activeTab === 'platform' && !showFinalReport && (
          <div className="card">
            {currentStep === 0 && (
              <>
                <h3 style={{ fontWeight: 900, marginBottom: "30px" }}>🛡️ اختر ركيزة التحليل:</h3>
                {engineData?.pillars?.map(p => (
                  <button key={p.id} onClick={() => { setSelectedPillar(p); setCurrentStep(1); }} className="card"><b>{p.name}</b></button>
                ))}
              </>
            )}

            {currentStep === 1 && selectedPillar && (
              <>
                <h3 style={{ color: "#d4af37", fontWeight: 900 }}>{selectedPillar.name}</h3>
                {selectedPillar.tracks?.map(t => (
                  <button key={t.id} onClick={() => { setSelectedTrack(t); setCurrentStep(2); }} className="card"><b>{t.name}</b></button>
                ))}
                <button onClick={() => setCurrentStep(0)} style={{ width: "100%", padding: "15px", borderRadius: "15px", border: "1px solid #ddd" }}>تراجع</button>
              </>
            )}

            {currentStep === 2 && selectedTrack && (
              <>
                <h3 style={{ color: "#0a192f", fontWeight: 900, marginBottom: "30px" }}>{selectedTrack.name}</h3>
                {selectedTrack.questions?.map((q, idx) => (
                  <div key={idx} style={{ marginBottom: "35px" }}>
                    <label style={{ fontWeight: 900, display: "block", marginBottom: "10px" }}>{idx + 1}. {q.q}</label>
                    <textarea 
                      onChange={(e) => setFormData({...formData, [`${selectedTrack.id}_${idx}`]: e.target.value})}
                      rows="4" 
                      style={{ width: "100%", padding: "15px", borderRadius: "15px", border: "1px solid #cbd5e1", fontSize: "15px" }} 
                      placeholder="صف الواقع الميداني هنا..."
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

        {/* شاشة التقرير النهائي (الجاهز) */}
        {showFinalReport && (
          <div className="executive-report gold-border">
            <div style={{ textAlign: "left", fontSize: "12px", color: "#666" }}>التاريخ: {new Date().toLocaleDateString('ar-YE')}</div>
            <div style={{ textAlign: "center", marginBottom: "50px" }}>
              <h1 style={{ color: "#0a192f", fontWeight: 900, margin: 0, fontSize: "28px" }}>تقرير تشخيصي استراتيجي</h1>
              <div style={{ width: "100px", height: "4px", background: "#d4af37", margin: "10px auto" }}></div>
              <p style={{ fontWeight: 700 }}>مسار التحليل: {selectedTrack.name}</p>
            </div>

            <h3 className="section-title">1. الملخص التنفيذي (Executive Summary)</h3>
            <p>بناءً على عملية المتابعة والتقييم الميدانية، تم فحص مجموعة من المؤشرات المنهجية ضمن ركيزة ({selectedPillar.name}). تهدف هذه المخرجات إلى تقديم رؤية واضحة لصناع القرار حول مستوى الأداء والتحديات القائمة.</p>

            <h3 className="section-title">2. المخرجات والتحليل الفني</h3>
            {selectedTrack.questions.map((q, idx) => (
              <div key={idx} style={{ marginBottom: "25px" }}>
                <h4 style={{ margin: "0 0 5px 0", color: "#334155" }}>● {q.q}</h4>
                <div style={{ padding: "15px", background: "#f8fafc", borderRadius: "8px", fontSize: "15px", color: "#1e293b", borderRight: "3px solid #d4af37" }}>
                  {renderProfessionalAnalysis(q.q, formData[`${selectedTrack.id}_${idx}`])}
                </div>
              </div>
            ))}

            <h3 className="section-title">3. التوصيات الاستراتيجية</h3>
            <ul style={{ lineHeight: "2" }}>
              <li>تفعيل نظام الرقابة الصارمة على المؤشرات التي أظهرت انحرافاً.</li>
              <li>تعزيز التدريب التخصصي للكوادر في الجوانب الضعيفة المرصودة.</li>
              <li>أتمتة الدورة المستندية لضمان سرعة الاستجابة وشفافية البيانات.</li>
            </ul>

            <div className="no-print" style={{ marginTop: "50px", display: "flex", gap: "10px" }}>
              <button onClick={() => setShowFinalReport(false)} style={{ flex: 1, padding: "15px", background: "#eee", borderRadius: "10px", border: "none" }}>تعديل البيانات</button>
              <button onClick={() => window.print()} style={{ flex: 2, padding: "15px", background: "#0a192f", color: "white", borderRadius: "10px", border: "none", fontWeight: 900 }}>طباعة التقرير / حفظ PDF</button>
            </div>
          </div>
        )}
      </main>

      <nav className="no-print" style={{ position: "fixed", bottom: 0, width: "100%", height: "90px", background: "white", display: "flex", borderTop: "1px solid #eee", zIndex: 1000 }}>
        <button onClick={() => { setShowFinalReport(false); setActiveTab('platform'); setCurrentStep(0); }} className={`nav-btn ${activeTab === 'platform' ? 'active' : ''}`}>
          <div style={{ fontSize: "25px" }}>🏠</div><div style={{ fontSize: "11px", fontWeight: 900 }}>المنصة</div>
        </button>
        <button onClick={() => setActiveTab('pricing')} className={`nav-btn ${activeTab === 'pricing' ? 'active' : ''}`}>
          <div style={{ fontSize: "25px" }}>💳</div><div style={{ fontSize: "11px", fontWeight: 900 }}>الباقات</div>
        </button>
      </nav>
    </div>
  );
}
