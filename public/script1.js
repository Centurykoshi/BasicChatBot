

const API_KEY = ""
const chatbox = document.getElementById("chatbox");
const loadanimation = document.querySelector(".loading");

const chat = document.querySelector('.chat');

async function sendmessage() {
    const userinput = document.getElementById("custom-input").innerText.trim();
    if (!userinput) {
        return;
    }


    displaymessage(userinput, "user");
    document.getElementById("custom-input").innerText = "";

    const loadmessagediv = document.createElement("div");
    loadmessagediv.classList.add("message", "ai", "loading-message-container");
    loadmessagediv.appendChild(loadanimation);
    chatbox.appendChild(loadmessagediv);

    // loadmessagediv.iner

    loadanimation.style.display = "flex";


    try {
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: userinput }] }],
                generationConfig: { temperature: 1.2, top_p: 0.95, maxOutputTokens: 4000 }
            })
        });

        const data = await response.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received";
        chatbox.removeChild(loadmessagediv)
        loadanimation.style.display = "none";
        typingmessage(formatmessage(reply), "ai");
    }
    catch (error) {
        chatbox.removeChild(loadmessagediv);
        displaymessage("Error : " + error.message + "ai");
    }

}

function displaymessage(message, sender) {
    const messagediv = document.createElement("div");
    messagediv.classList.add("message", sender);

    messagediv.innerHTML = message;
    chatbox.appendChild(messagediv);
    chat.scrollTop = chat.scrollHeight; 
}
function typingmessage(message, sender) {

    const messagediv = document.createElement("div");
    messagediv.classList.add("message", sender);

    messagediv.innerHTML = "";
    chatbox.appendChild(messagediv);

    // let isCodeBlock = false;
    // let codeContent = "";
    // let formattedMessage = "";


    let i = 0;
    let currentText ="";
    const typinginterval = setInterval(() => {
        currentText += message.charAt(i);
        messagediv.innerHTML = currentText; 
        i++;
        if (i === message.length) {
            clearInterval(typinginterval);
            messagediv.innerHTML = message; 
        }
    }, 5);


}

function formatmessage(reply) {
    return reply.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
         .replace(/```([\s\S]+?)```/g, '<pre><code class="highlight">$1</code></pre>')
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/__(.*?)__/g, "<u>$1</u>")
        
        .replace(/\*[\s]*(.*?)[\s]*$/gm, '<li>$1</li>')
        .replace(/"([^"]+)"/g, '<span class="highlight">$1</span>')
        .replace(/^\s*\*\s*(.+)$/gm, '<li>$1</li>')
        .replace(/\n\n/g, '<p>');
        // .replace('\n').map(line => {
        //     if (line.trim().startsWith('*')) {
        //         const listItemContent = line.substring(1).trim(); // Remove the asterisk and leading/trailing spaces
        //         return `<li>${listItemContent}</li>`;
        //     } else {
        //         return line;
        //     }
        // }).join('\n');
        // .replace(/{{(.*?)}}/g, '<span class="special-background">$1</span>');
}


document.getElementById("custom-input").addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendmessage();
    }
});

console.log(1); 