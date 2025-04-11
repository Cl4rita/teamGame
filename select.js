let selectedAnimal = null;
  let selectedSoldier = null;

  const animalButtons = [document.querySelector(".botao1"), document.querySelector(".botao2")];
  const soldierButtons = [document.querySelector(".botao3"), document.querySelector(".botao4")];

  animalButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      animalButtons.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedAnimal = index; // 0 para guaxinim, 1 para capivara
      salvarSelecao();
    });
  });

  soldierButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      soldierButtons.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedSoldier = index; // 0 para azul, 1 para rosa
      salvarSelecao();
    });
  });

  function salvarSelecao() {
    if (selectedAnimal !== null && selectedSoldier !== null) {
      localStorage.setItem("animalSelecionado", selectedAnimal);
      localStorage.setItem("soldadoSelecionado", selectedSoldier);
      document.getElementById("jogoButton").disabled = false;
    }
  }

  // Desabilita o botão "jogar" até selecionar os dois
  document.getElementById("jogoButton").disabled = true;
