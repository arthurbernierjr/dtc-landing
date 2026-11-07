class MemoryGame {
  constructor(root) {
    this.root = root;
    this.scoreEl = document.querySelector("#score");
    this.timerEl = document.querySelector("#timer");
    this.statusEl = document.querySelector("#status");
    this.faces = ["oak", "iron", "ember", "tide", "gale", "stone"];
    this.reset();
  }

  reset() {
    this.score = 0;
    this.time = 45;
    this.lock = true;
    this.open = [];
    this.matched = 0;
    this.over = false;
    window.clearInterval(this.timer);
    this.deck = this.shuffle([...this.faces, ...this.faces]);
    this.scoreEl.textContent = "0";
    this.timerEl.textContent = "45";
    this.statusEl.textContent = "Match the pairs before the timer ends.";
    this.root.replaceChildren();
    this.deck.forEach((face, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "card";
      button.dataset.face = face;
      button.dataset.index = String(index);
      button.textContent = "?";
      button.addEventListener("click", () => this.flip(button));
      this.root.append(button);
    });
  }

  shuffle(list) {
    for (let i = list.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  start() {
    if (!this.over && this.time < 45 && this.timer) return;
    this.reset();
    this.lock = false;
    this.timer = window.setInterval(() => this.tick(), 1000);
  }

  tick() {
    this.time -= 1;
    this.timerEl.textContent = String(this.time);
    if (this.time <= 0) this.finish(false);
  }

  flip(button) {
    if (this.lock || this.over || button.classList.contains("is-open") || button.classList.contains("is-matched")) return;
    button.classList.add("is-open");
    button.textContent = button.dataset.face;
    this.open.push(button);
    if (this.open.length < 2) return;
    this.lock = true;
    const [a, b] = this.open;
    if (a.dataset.face === b.dataset.face) {
      a.classList.add("is-matched");
      b.classList.add("is-matched");
      this.matched += 1;
      this.score += 1;
      this.scoreEl.textContent = String(this.score);
      this.open = [];
      this.lock = false;
      if (this.matched === this.faces.length) this.finish(true);
      return;
    }
    window.setTimeout(() => {
      a.classList.remove("is-open");
      b.classList.remove("is-open");
      a.textContent = "?";
      b.textContent = "?";
      this.open = [];
      this.lock = false;
    }, 700);
  }

  finish(won) {
    this.over = true;
    this.lock = true;
    window.clearInterval(this.timer);
    this.statusEl.textContent = won ? "You cleared the board." : "Time. The board wins.";
  }
}

const game = new MemoryGame(document.querySelector("#board"));
document.querySelector("#start").addEventListener("click", () => game.start());
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.target.id === "start") game.start();
});
