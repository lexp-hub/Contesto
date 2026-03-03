import { secretWordsPool } from './words.js';
let secretWord = "";
let gameActive = true;
let guessHistory = [];

const dom = {
    input: document.getElementById('word-input'),
    submitBtn: document.getElementById('submit-btn'),
    loader: document.getElementById('loader'),
    sendIcon: document.getElementById('send-icon'),
    container: document.getElementById('guesses-container'),
    emptyState: document.getElementById('empty-state'),
    aiBox: document.getElementById('ai-assistant-box'),
    aiText: document.getElementById('ai-response-text'),
    hintBtn: document.getElementById('ai-hint-btn'),
    analyzeBtn: document.getElementById('ai-analyze-btn')
};
/* inizializza il gioco*/
function initGame() {
    const oldWord = secretWord;
    const pool = secretWordsPool; 

    do {
        secretWord = pool[Math.floor(Math.random() * pool.length)];
    } while (secretWord === oldWord && pool.length > 1);

    gameActive = true;
    guessHistory = [];
    dom.container.innerHTML = "";
    if (dom.aiBox) dom.aiBox.classList.remove('visible');
    if (dom.emptyState) dom.emptyState.style.display = 'flex';
    
    dom.input.disabled = false;
    dom.submitBtn.disabled = false;
    dom.input.value = "";
    dom.input.placeholder = "Prova una parola...";
    document.body.style.backgroundColor = '';
    
    const nextBtn = document.getElementById('next-game-btn');
    if (nextBtn) nextBtn.remove();
}

async function callPuterAI(prompt) {
    try {
        const response = await puter.ai.chat(prompt);
        return { text: response.toString() };
    } catch (error) {
        console.error("Puter AI Error:", error);
        return { error: "Errore con Puter AI. Riprova." };
    }
}
/* Invia una richesta a Puter.js che per calcolare la distanza semantica 
   tra la parola inserita e la parola segreta
   invia il prompt ad gemini e riceve il risultato */
async function fetchDistance(word) {
    const prompt = `Sei un esperto di semantica italiana. 
    Calcola la distanza semantica tra la parola "${word}" 
    e la parola segreta "${secretWord}". 
    
    Regole:
    - Se le parole sono identiche, restituisci 1.
    - Se sono sinonimi stretti, restituisci un numero tra 2 e 500.
    - Se sono correlate, restituisci tra 501 e 5000.
    - Se sono lontane, restituisci 10000+.
    Rispondi SOLO con il numero intero, senza testo aggiuntivo.`;
    
    const result = await callPuterAI(prompt);
    
    if (result.error) return result;

    const distance = parseInt(result.text.replace(/\D/g, ''));
    return isNaN(distance) ? 15000 : distance;
}
/* invia una richesta a Puter.js che per dare un indizio
   invia il prompt e riceve il risultato */
async function getAIHint() {
    if (guessHistory.length === 0) {
        showAIResponse("Prova a indovinare almeno una parola per sbloccare l'aiuto!");
        return;
    }
    dom.hintBtn.disabled = true;
    const prompt = `Stiamo giocando a Contesto. La parola segreta è "${secretWord}". 
    I tentativi dell'utente sono: ${guessHistory.map(g => g.word).join(', ')}. 
    Dai un indizio breve e criptico in italiano senza rivelare la parola.`;
    const result = await callPuterAI(prompt);
    dom.hintBtn.disabled = false;
    
    if (result.text) showAIResponse(result.text);
    else if (result.error) showAIResponse(result.error);
}

/* invia una richesta a Puter.js che per analizzare la strategia
   invia il prompt e riceve il risultato */
async function analyzeStrategy() {
    if (guessHistory.length < 3) {
        showAIResponse("Servono almeno 3 tentativi per un'analisi.");
        return;
    }
    dom.analyzeBtn.disabled = true;
    const prompt = `Analizza la strategia dell'utente nel gioco Contesto. Parola segreta: "
    ${secretWord}". Tentativi: ${guessHistory.map(g => `${g.word} (${g.dist})`).join(', ')}. 
    Dai un consiglio breve in italiano.`;
    const result = await callPuterAI(prompt);
    dom.analyzeBtn.disabled = false;
    
    if (result.text) showAIResponse(result.text);
    else if (result.error) showAIResponse(result.error);
}

/* mostra la risposta dell'AI */
function showAIResponse(text) {
    dom.aiText.innerText = text;
    dom.aiBox.classList.add('visible');
    setTimeout(() => {
        dom.aiBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
}
/* restituisce il colore in base alla distanza */
function getColor(dist) {
    if (dist === 1) return '#22c55e';
    if (dist < 500) return '#4ade80';
    if (dist < 2000) return '#facc15';
    if (dist < 6000) return '#fb923c';
    return '#cbd5e1';
}
/* invia la parola inserita all'AI e riceve la distanza */
async function submit() {
    if (!gameActive) return;
    const word = dom.input.value.trim().toLowerCase();
    if (!word || dom.loader.style.display === 'block') return;

    dom.loader.style.display = 'block';
    dom.sendIcon.style.display = 'none';
    dom.input.value = "";

    const result = await fetchDistance(word);
    
    dom.loader.style.display = 'none';
    dom.sendIcon.style.display = 'block';

    if (result && typeof result === 'object' && result.error) {
        showAIResponse(result.error);
        return;
    }

    const dist = result;
    if (dom.emptyState) dom.emptyState.style.display = 'none';
    guessHistory.push({word, dist});
    
    const color = getColor(dist);
    const percentage = Math.max(8, 100 - (dist / 12000 * 100));
    const row = document.createElement('div');
    row.className = 'guess-row shadow-sm';
    row.innerHTML = `
        <div class="progress-bg" style="width: ${dist === 1 ? 100 : 
            percentage}%; background-color: ${color}; opacity: 0.4;"></div>
        <div class="content-z font-bold text-slate-700">
            <span class="capitalize">${word}</span>
            <span class="text-slate-500">${dist === 1 ? '🎉 TROVATA!' : dist}</span>
        </div>
    `;
    dom.container.appendChild(row);

    if (dist === 1) {
        gameActive = false;
        dom.input.disabled = true;
        dom.submitBtn.disabled = true;
        document.body.style.backgroundColor = '#f0fdf4';
        
        const nextBtn = document.createElement('button');
        nextBtn.id = 'next-game-btn';
        nextBtn.className = 'w-full py-4 mt-6 bg-slate-800 text-white font-bold rounded-2xl shadow-lg hover:bg-slate-900 transition-all animate-bounce';
        nextBtn.innerText = `NUOVA PARTITA`;
        nextBtn.onclick = initGame;
        dom.container.insertAdjacentElement('afterend', nextBtn);
        const factResult = await callPuterAI(`Scrivi una curiosità di una riga in italiano sulla parola "${secretWord}".`);
        if (factResult.text) showAIResponse(`🏆 ${factResult.text}`);
    }
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

dom.submitBtn.onclick = submit;
dom.input.onkeydown = (e) => { if (e.key === 'Enter') submit(); };
dom.hintBtn.onclick = getAIHint;
dom.analyzeBtn.onclick = analyzeStrategy;

initGame();
