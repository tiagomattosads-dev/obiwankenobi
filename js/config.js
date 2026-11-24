// Arquivo: js/config.js — Ecossistema Unificado Nocturne Dynamics (Datapad + Mestre Kenobi)
const IS_LOCAL_DEV =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.protocol === "file:";

const CONFIG = {
    // Mesmo projeto Supabase do Nocturne Datapad (Login Único & Fichas Compartilhadas)
    SUPABASE_URL: "https://pvlrnpxnwgkhllgtpwov.supabase.co",
    SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2bHJucHhud2draGxsZ3Rwd292Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NTAzODEsImV4cCI6MjA4NDMyNjM4MX0.BuAUdi0Txb-ZkrIGGTFd_i7nHnYUZJ2HzqvBn3Pu6M8",

    // Endpoints seguros do Cérebro do Mestre Kenobi (Produção vai direto no backend do Datapad)
    KENOBI_API_ENDPOINTS: IS_LOCAL_DEV
        ? ["http://localhost:3000/api/kenobi", "https://swdatapad.vercel.app/api/kenobi"]
        : ["https://swdatapad.vercel.app/api/kenobi"],

    DATAPAD_URL: "https://swdatapad.vercel.app"
};
