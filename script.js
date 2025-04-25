document.addEventListener("DOMContentLoaded", function () {
    const botoesSkin = document.querySelectorAll(".botao1, .botao2, .botao3, .botao4");
    const som1 = document.getElementById("somBotao1"); // capivara
    const som2 = document.getElementById("somBotao2"); // pedro

    botoesSkin.forEach(botao => {
        botao.addEventListener("click", function () {
            if (botao.classList.contains("botao1")) {
                som2.currentTime = 0;
                som2.play();
            } else if (botao.classList.contains("botao2")) {
                som1.currentTime = 0;
                som1.play();
            }
        });
    });
});

