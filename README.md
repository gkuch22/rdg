
# ⚖️ Georgian Law AI Assistant – Hackathon Project

This is a full-stack AI chatbot built to assist users in navigating the **Georgian Criminal Code**. The chatbot can answer natural-language legal questions in Georgian, using real articles from the law and powerful large language models (LLMs).

> ✅ Frontend: React + Vite + TypeScript + Tailwind + Shadcn  
> ✅ Backend: Google Colab + FastAPI + LangChain + FAISS + Gemini + ngrok

---

## 📌 Features

- 🧠 **Legal Q&A** – Ask questions like _"რა სასჯელი ეკუთვნის ქურდს?"_
- 🔍 **RAG system** – Retrieves relevant articles and uses LLM to generate context-aware answers
- 🌐 **Frontend in React** – Fully responsive chat UI with modern design
- 🔌 **Colab-powered Backend** – Loads the legal index and serves answers via a FastAPI endpoint
- 🛠️ **Live Demo via ngrok** – Easily connect frontend to backend for hackathon demos

---

## 🧪 Tech Stack

### 🔹 Frontend
- [React](https://react.dev/) (with [Vite](https://vitejs.dev/))
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/) (for clean component styling)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/) for API calls

### 🔸 Backend
- [Google Colab](https://colab.research.google.com/) – serves the backend code
- [LangChain](https://www.langchain.com/) – for document retrieval + LLM
- [Gemini / Google Generative AI](https://ai.google.dev/)
- [FAISS](https://github.com/facebookresearch/faiss) – fast vector search over criminal code
- [FastAPI](https://fastapi.tiangolo.com/) – lightweight web API
- [ngrok](https://ngrok.com/) – exposes local server via HTTPS

---

## 🛠️ How to Run It

### 🚀 Backend (Google Colab)

1. Open the `legal_assistant_chatbot.ipynb` notebook in [Google Colab](https://colab.research.google.com/).
2. Upload the required files:
   - `criminal_code.index`
   - `criminal_code_metadata.json`
   - Your `GOOGLE_API_KEY` from [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
3. Install dependencies (Colab cell):
   ```python
   !pip install fastapi uvicorn[standard] nest_asyncio pyngrok langchain-google-genai faiss-cpu sentence-transformers pdfplumber
   ```
4. Insert your ngrok auth token:
   ```python
   ngrok.set_auth_token("your-ngrok-token")
   ```
   You can get it from: https://dashboard.ngrok.com/get-started
5. Run the API cell (provided in the notebook). You’ll get a public URL like:
   ```
   🎉 Public URL: https://abc123.ngrok-free.app
   ```

> This URL is the backend endpoint your frontend will connect to.

---

### 💻 Frontend

1. Clone the frontend project:
   ```bash
   git clone https://github.com/your-username/georgia-law-chatbot-frontend
   cd georgia-law-chatbot-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```bash
   VITE_BACKEND_URL=https://abc123.ngrok-free.app
   ```

4. Start the frontend dev server:
   ```bash
   npm run dev
   ```

> The chatbot will now communicate with the backend running on Colab via the ngrok tunnel.

---

## 🧠 Example Usage

**User Question:** _რა სასჯელი ეკუთვნის ქურდს?_  
**Bot Response:** _საქართველოს სისხლის სამართლის კოდექსის მიხედვით..._ (fetched from real articles)

---

## 🤝 Team

| Name           | Role         |
|----------------|--------------|
| Your Name      | Backend / LLM logic (Colab, FAISS, Gemini) |
| Friend #1      | Backend / API & ngrok setup |
| Friend #2      | Frontend Developer (React, UI, API integration) |

---

## 📎 Notes

- This was built for hackathon purposes: backend runs on Colab and is intended for temporary live use.
- For production, consider moving to Google Cloud Run, Hugging Face Spaces, or deploying the model via Vertex AI.
- All legal content is sourced from the **Georgian Criminal Code**.

---

## 📄 License

MIT License – Feel free to build upon and modify.

---

> ⚖️ _Built with AI to support legal literacy in Georgia._
