import streamlit as st
import json, os, uuid
from datetime import datetime

# =========================
# إعداد النظام
# =========================
st.set_page_config(page_title="منصة المنصور السيادية", layout="centered")

DB_FILE = "db.json"

def load_db():
    if not os.path.exists(DB_FILE):
        with open(DB_FILE, "w") as f:
            json.dump({
                "users": {},
                "codes": {"VIP2026": 20},
                "used_codes": []
            }, f)
    with open(DB_FILE, "r") as f:
        return json.load(f)

def save_db(data):
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=2)

db = load_db()

# =========================
# session
# =========================
if "login" not in st.session_state:
    st.session_state.login = False
if "email" not in st.session_state:
    st.session_state.email = ""
if "answers" not in st.session_state:
    st.session_state.answers = {}

# =========================
# تسجيل الدخول
# =========================
def login():
    st.title("🏛️ منصة المنصور")
    email = st.text_input("البريد الإلكتروني")

    if st.button("دخول"):
        if email:
            if email not in db["users"]:
                db["users"][email] = {
                    "balance": 1,  # تجربة مجانية
                    "created": str(datetime.now())
                }
                save_db(db)

            st.session_state.login = True
            st.session_state.email = email
            st.rerun()

# =========================
# واتساب
# =========================
def whatsapp():
    st.warning("🚫 انتهت التجربة المجانية")
    st.markdown("### تفعيل الحساب:")
    st.markdown(
        "[📱 تواصل عبر واتساب](https://wa.me/967774575749?text=أريد%20تفعيل%20منصة%20المنصور)"
    )

# =========================
# إدخال كود
# =========================
def activate_code():
    st.subheader("🔑 تفعيل كود")
    code = st.text_input("أدخل الكود")

    if st.button("تفعيل"):
        if code in db["codes"] and code not in db["used_codes"]:
            value = db["codes"][code]
            db["users"][st.session_state.email]["balance"] += value
            db["used_codes"].append(code)
            save_db(db)
            st.success(f"تم إضافة {value} تقرير")
        else:
            st.error("كود غير صالح")

# =========================
# توليد تقرير (بدون AI خارجي)
# =========================
def generate_report(data):
    return f"""
📊 التقرير التنفيذي

الملخص:
تم تحليل البيانات المدخلة، وتبين ما يلي:

- الوضع الحالي: {data.get('q1','')}
- التحديات: {data.get('q2','')}
- الأسباب: {data.get('q3','')}

🔍 التحليل:
هناك فجوة تشغيلية تحتاج إلى تحسين.

🎯 التوصيات:
- تحسين الأداء
- تقليل الهدر
- رفع الكفاءة

📈 KPI:
- زيادة الإنتاجية
- تقليل التكاليف

---

🧠 البرومبت:

اكتب تقرير احترافي بناءً على:
{data}
"""

# =========================
# المنصة
# =========================
def platform():
    user = db["users"][st.session_state.email]
    balance = user["balance"]

    st.info(f"رصيدك: {balance} تقرير")

    if balance <= 0:
        whatsapp()
        activate_code()
        return

    st.subheader("📋 أدخل البيانات")

    q1 = st.text_area("الوضع الحالي")
    q2 = st.text_area("التحديات")
    q3 = st.text_area("الأسباب")

    if st.button("توليد التقرير"):
        st.session_state.answers = {
            "q1": q1,
            "q2": q2,
            "q3": q3
        }

        report = generate_report(st.session_state.answers)
        st.success("تم إنشاء التقرير")

        st.text_area("📄 التقرير", report, height=300)

        # خصم الرصيد
        db["users"][st.session_state.email]["balance"] -= 1
        save_db(db)

# =========================
# الإدارة
# =========================
def admin():
    st.title("🛠️ الإدارة")

    password = st.text_input("كلمة المرور", type="password")

    if password == "Mansour@2026":

        st.subheader("➕ توليد كود")

        value = st.selectbox("عدد التقارير", [5, 10, 20, 50])

        if st.button("توليد"):
            code = "MS-" + uuid.uuid4().hex[:6].upper()
            db["codes"][code] = value
            save_db(db)
            st.success(code)

        st.subheader("👥 المستخدمين")
        st.write(db["users"])

# =========================
# التنقل
# =========================
if not st.session_state.login:
    login()
else:
    page = st.sidebar.radio("القائمة", ["المنصة", "تفعيل", "الإدارة"])

    if page == "المنصة":
        platform()
    elif page == "تفعيل":
        activate_code()
    elif page == "الإدارة":
        admin()
