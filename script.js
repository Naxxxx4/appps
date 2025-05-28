// --- REEMPLAZA con tu configuración Firebase --- 
const firebaseConfig = {
    apiKey: "AIzaSyCcwLTayd-Ex_4i4s2kwEfbCx0iQjAhF8s",
  authDomain: "apweb-a869c.firebaseapp.com",
  projectId: "apweb-a869c",
  storageBucket: "apweb-a869c.firebasestorage.app",
  messagingSenderId: "872429982344",
  appId: "1:872429982344:web:7a4add259f8d2e69d7053d",
  measurementId: "G-SE38ZQYY4B""
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- REEMPLAZA con tu User ID de EmailJS ---
emailjs.init("8OHz_TssMsBenKMBJ");

const form = document.getElementById("questionForm");
const input = document.getElementById("questionInput");
const questionList = document.getElementById("questionList");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const question = input.value.trim();
  if (!question) return;

  // Guardar pregunta en Firebase
  await db.collection("preguntas").add({
    pregunta: question,
    respuesta: "",
    timestamp: Date.now()
  });

  // Enviar email con EmailJS
  emailjs.send("service_59qd7te", "template_h45nanc", {
    message: question
  });

  input.value = "";
  loadQuestions();
});

async function loadQuestions() {
  const snapshot = await db.collection("preguntas").orderBy("timestamp", "desc").get();
  questionList.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("li");
    li.innerHTML = `
      <p><strong>Pregunta:</strong> ${data.pregunta}</p>
      ${data.respuesta ? `<p><strong>Respuesta:</strong> ${data.respuesta}</p>` : ""}
    `;
    questionList.appendChild(li);
  });
}

// Cargar preguntas al iniciar
loadQuestions();
