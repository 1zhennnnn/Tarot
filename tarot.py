# -*- coding: utf-8 -*-
import os
import sqlite3
import json
import sys
import io
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from tarot_knowledge import get_card_knowledge

# 強制將標準輸出設為 UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

app = Flask(__name__, static_folder='.', static_url_path='')
app.config['JSON_AS_ASCII'] = False
CORS(app)

# 1. 配置 Groq API Client
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY)

def init_db():
    conn = sqlite3.connect('tarot_history.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT,
            cards TEXT,
            interpretation TEXT,
            timestamp DATETIME
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/api/interpret', methods=['POST'])
def interpret():
    data = request.json
    if not data:
        return jsonify({"success": False, "error": "未接收到資料"}), 400

    try:
        question = data.get('question')
        cards = data.get('cards')
        spread_name = data.get('spreadName', '未指定牌陣') # 接收牌陣名稱
        
        # --- 關鍵修改：將「牌位名稱」加入解讀字串 ---
        # 格式會變成：[問題核心]: 愚者(正位)、[障礙]: 魔術師(逆位)...
        card_details = []
        knowledge_lines = []
        for c in cards:
            detail = f"【{c['positionName']}】: {c['name']} ({c['position']})"
            card_details.append(detail)

            meaning = get_card_knowledge(c['name'], c['position'])
            if meaning:
                knowledge_lines.append(
                    f"▸ 【{c['positionName']}】{c['name']}（{c['position']}）\n  {meaning}"
                )

        knowledge_section = (
            "\n\n【塔羅知識庫參考——每張牌的傳統核心意涵，請以此為基礎延伸解讀】\n"
            + "\n".join(knowledge_lines)
        ) if knowledge_lines else ""

        prompt_text = (
            f"牌陣：{data.get('spreadName')}\n"
            f"使用者問題：{question}\n"
            f"牌面組合：\n" + "\n".join(card_details)
            + knowledge_section
        )

        # 呼叫 Groq API (保持不變)
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system", 
                "content": (
                    "你是一位精通局勢解構的職業諮詢師。你的核心能力不是『解牌』，而是『將牌面能量翻譯為用戶處境的解方』。\n\n"
            
                    "【嚴格格式要求】\n"
                    "1. 禁止條列式、清單、數字分項、粗體項目符號。整篇回答必須以自然段落呈現。\n"
                    "2. 禁止使用「這張牌代表...」這種百科全書式的定義。請將牌面視為局勢數據，直接描述它們在當前問題中如何互動。\n"
                    "3. 保持理解但冷靜的語氣。你可以表達友善與支持，但重點在於給出精闢的分析，而非過度的情緒撫慰。\n\n"
                    
                    "【邏輯核心】\n"
                    "1. 如果使用者提出的問題顯得模糊、狹隘，或與牌面看似無關，請不要否定問題，也不要偏題。請運用你的分析力，找出『牌面隱喻』與『問題核心』之間的連結點。例如：用戶問財務，但牌面全是情緒牌，你要指出『你對財務的焦慮，其實是源於對自我價值的安全感缺失』，並以此為邏輯進行分析。\n"
                    "2. 嚴禁任何條列式或標籤化。所有的分析都必須是連貫的敘事。如果這幾張牌之間有衝突，你要負責把它們圓回來，告訴使用者為什麼這兩種衝突同時存在於他的生活中。\n"
                    "3. 不要說『這牌代表...』。請說『這組牌顯示你正處於 X 狀態，這解釋了為什麼你在處理 Y 問題時會感到 Z』。將牌視為診斷報告，將用戶的問題視為症狀。\n"
                    "4. 對於任何類型的問題，都必須從「核心趨勢」切入，再給出「物理行動」。如果你無法給出答案，就針對用戶的現狀進行『深度反詰』，讓用戶自己去思考死結在哪。\n\n"
                    "5. 請給出實際解決問題的建議，而非籠統的正向思考或情緒支持。若是二選一排陣，一定會給出其中一個較好的選擇回答給提問者\n\n"
                    
                    "【禁令】\n"
                    "禁止使用：『這是一個有趣的問題』、『這意味著』、『作為AI』、『建議你保持正向思考』等常見 AI 模板詞彙。"
                    )
            },
            {"role": "user", "content": prompt_text}
        ],
            temperature=0.5, 
            max_tokens=1024
        )
        
        ai_reply = completion.choices[0].message.content

        # 儲存到 SQLite (保持不變)
        conn = sqlite3.connect('tarot_history.db')
        conn.text_factory = str 
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO history (question, cards, interpretation, timestamp) VALUES (?, ?, ?, ?)",
            (question, json.dumps(cards, ensure_ascii=False), ai_reply, datetime.now())
        )
        conn.commit()
        conn.close()

        return jsonify({"success": True, "reply": ai_reply})

    except Exception as e:
        # 錯誤處理保持不變...
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/recommend_spread', methods=['POST'])
def recommend_spread():
    data = request.json
    question = data.get('question', '')

    if not question:
        return jsonify({"success": False, "error": "問題不能為空"}), 400

    # 定義牌陣清單給 AI 看，讓它知道有哪些選項
    spread_options = (
        "1. single: 單牌啟示 (適合問是非、今日運勢)\n"
        "2. triangle: 聖三角 (適合問事情真相、建言)\n"
        "3. timeflow: 時間之流 (適合問發展過程)\n"
        "4. core_analysis: 直指核心 (適合問深度問題、對策)\n"
        "5. choice: 二選一 (適合問兩個選項的決擇)"
    )

    try:
        # 使用更快速的 8b 模型來做簡單判斷
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system", 
                    "content": "你是一位冷靜的占卜助手。根據問題，從提供的牌陣清單中選擇一個最適合的。只需回傳一段話，內容格式為：『建議使用「牌陣名稱(牌陣名稱請輸出中文)」，理由是...』，禁止廢話與安慰。"
                },
                {"role": "user", "content": f"問題：{question}\n可用牌陣：\n{spread_options}"}
            ],
            temperature=0.5
        )
        
        recommendation = completion.choices[0].message.content
        return jsonify({"success": True, "recommendation": recommendation})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    conn = sqlite3.connect('tarot_history.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM history ORDER BY timestamp DESC")
    rows = cursor.fetchall()
    conn.close()
    
    history = []
    for row in rows:
        history.append({
            "id": row[0],
            "question": row[1],
            "cards": json.loads(row[2]),
            "interpretation": row[3],
            "timestamp": row[4]
        })
    return jsonify(history)

@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)