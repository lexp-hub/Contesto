
# Contesto AI – Puter.js Edition 🇮🇹

Ciao! Questo è un piccolo giochino web **ispirato al famoso Context**, ma tutto in italiano.
L’idea è semplice: devi **indovinare la parola segreta** usando i suggerimenti dell’AI e i feedback “caldo/freddo”.


# ⚡ Come funziona

* All’avvio scelgo a caso una parola italiana da un array (tranquillo, niente backend complicato per ora 😅).
* Scrivi una parola nella casella e premi invio o il pulsante ➔.
* L’AI ti dice quanto sei vicino **semanticalmente** alla parola segreta (tipo “vicino” o “bollente” o “ghiacciato”).
* Se indovini la parola, vittoria immediata! 🏆

Se l’AI fa i capricci o non c’è internet, uso un piccolo **trucchetto offline** basato sulla lunghezza delle parole, così non ti blocchi mai.


# 💡 Indizi

C’è il pulsante **💡 INDIZIO** che ti aiuta progressivamente:

1. Numero di lettere della parola
2. Lettera iniziale
3. Un indizio concettuale generato dall’AI (se l’AI non è disponibile, niente panico, ti dico solo “non disponibile” 😅)

Attenzione: **ogni indizio ha un cooldown di 10 secondi**, così non puoi spammarli tutti insieme.


# 🎨 Stile & struttura

* Tutto è in **un unico file HTML**.

  > Sì, lo so, di solito si divide in più file, ma con Puter.js non funzionava nulla 😅.
  > Magari in futuro lo separo, per ora va bene così.

* Usa **TailwindCSS** per lo stile rapido e **Puter.js v2 + Gemini** per l’AI.


# 🚀 Come giocare

1. Salva il file come `index.html`
2. Aprilo in un browser moderno
3. Assicurati di avere internet per far funzionare l’AI
4. Divertiti! 😎


# 🛠 Possibili migliorie future

* Mettere le parole su un backend (così posso aggiornarle senza toccare il file HTML)
* Sistema di punteggi o classifica
* Modalità a tempo o livelli di difficoltà
* Dividere il codice in più file per essere più ordinati


# 🏁 Stato attuale

Funziona, è un **prototipo** tutto in italiano di Context.
Perfetto per fare un po’ di esperimenti con AI semantica direttamente dal browser, senza server complicati.

> Nota: tutto è volutamente semplice e compatto, così puoi aprirlo subito e iniziare a giocare.
