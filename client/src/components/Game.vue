<template>
  <div class="main">
    <header>
      <h1>CHOR PULISH DAKAT BABU</h1>
    </header>
    <section ref="gameWindow" class="container">
      <div ref="player1">
        <h2 v-if="players[0]">{{ players[0].name }}</h2>
        <h2 v-else>Empty!</h2>
        <p>Score</p>
        <h1 v-if="players[0]">{{ players[0].score }}</h1>
        <h1 v-if="players[0]">{{ players[0].card }}</h1>
        <button ref="player1Button" class="player-target-button" v-on:click="emitPlayerid(1)">{{ target }}!</button>
      </div>
      <div ref="player2">
        <h2 v-if="players[1]">{{ players[1].name }}</h2>
        <h2 v-else>Empty!</h2>
        <p>Score</p>
        <h1 v-if="players[1]">{{ players[1].score }}</h1>
        <h1 v-if="players[1]">{{ players[1].card }}</h1>
        <button ref="player2Button" class="player-target-button" v-on:click="emitPlayerid(2)">{{ target }}!</button>
      </div>
      <div ref="player3">
        <h2 v-if="players[2]">{{ players[2].name }}</h2>
        <h2 v-else>Empty!</h2>
        <p>Score</p>
        <h1 v-if="players[2]">{{ players[2].score }}</h1>
        <h1 v-if="players[2]">{{ players[2].card }}</h1>
        <button ref="player3Button" class="player-target-button" v-on:click="emitPlayerid(3)">{{ target }}!</button>
      </div>
      <div ref="player4">
        <h2 v-if="players[3]">{{ players[3].name }}</h2>
        <h2 v-else>Empty!</h2>
        <p>Score</p>
        <h1 v-if="players[3]">{{ players[3].score }}</h1>
        <h1 v-if="players[3]">{{ players[3].card }}</h1>
        <button ref="player4Button" class="player-target-button" v-on:click="emitPlayerid(4)">{{ target }}!</button>
      </div>
      <div class="break"></div>
      <div class="buttons-container">
        <p ref="message" class="message">Please wait for {{ 4 - players.length }} more player(s)</p>
        <button v-on:click="emitTarget('Dakat')" class="buttonpanel target-control">Dakat</button>
        <button v-on:click="emitNewRound" class="buttonpanel round-control">New Round</button>
        <button v-on:click="emitTarget('Chor')" class="buttonpanel target-control">Chor</button>
      </div>
    </section>
    <modal v-show="isModalVisible" @submit="updateName" />
  </div>
</template>

<script>
import modal from "./modal.vue";
import io from "socket.io-client";
export default {
  name: "Game",
  components: {
    modal
  },
  data() {
    return {
      socket: {},
      players: [],
      self: {},
      target: "",
      isModalVisible: true
    };
  },
  methods: {
    hideTargetControls() {
      for (var i = 0; i < this.targetElements.length; i++) {
        this.targetElements[i].style.display = "none";
      }
    },
    showTargetControls() {
      for (var i = 0; i < this.targetElements.length; i++) {
        this.targetElements[i].style.display = "initial";
      }
    },
    hideTargetButtons() {
      for (var i = 0; i < this.targetButtons.length; i++) {
        this.targetButtons[i].style.display = "none";
      }
    },
    showTargetButtons() {
      for (var i = 0; i < 4; i++) {
        if (this.players[i].card == '****')
          this.targetButtons[i].style.display = "initial";
      }
    },
    hideNewRoundControl() {
      this.newRoundButton[0].style.display = "none";
    },
    showNewRoundControl() {
      this.newRoundButton[0].style.display = "initial";
    },
    emitPlayerid(n) {
      this.socket.emit("targetid", this.players[n - 1].id);
      console.log(this.players[n - 1].id + " is " + this.target);
      this.target = "";
      this.hideTargetButtons();
    },
    emitTarget(target) {
      this.socket.emit("target", target);
    },
    emitNewRound() {
      console.log("getting new round");
      this.socket.emit("new-round");
    },
    updateName(name) {
      this.socket.emit("player-join");
      this.socket.emit("name-change", name);
      this.isModalVisible = false;
    }
  },
  created() {
    this.socket = io("http://localhost:5000");
  },
  mounted() {
    this.playersdiv = [
      this.$refs.player1,
      this.$refs.player2,
      this.$refs.player3,
      this.$refs.player4
    ];
    this.colors = ["#50514f", "#f25f5c", "#e6c33a", "#247ba0"];
    for (var i = 0; i < this.playersdiv.length; i++) {
      this.playersdiv[i].style.backgroundColor = this.colors[i];
    }

    this.targetElements = this.$el.querySelectorAll(".target-control");

    this.targetButtons = this.$el.querySelectorAll(".player-target-button");

    this.newRoundButton = this.$el.querySelectorAll(".round-control");

    this.hideTargetControls();
    this.hideTargetButtons();
    this.hideNewRoundControl();

    this.socket.on("game-start", () => {
      this.showNewRoundControl();
      this.$refs.message.innerText = "Press 'New Round' button for a new round";
    });

    this.socket.on("update", players => {
      this.players = players.all;
      this.self = players.self;
      console.log("you are "+this.self.card);
    });

    this.socket.on("round-start", () => {
      this.hideNewRoundControl();
      if (this.self.card == "babu") {
        this.$refs.message.innerText = "You are "+ this.self.card +"\nSelect target";
        this.showTargetControls();
      }
      else
        this.$refs.message.innerText = "You are "+ this.self.card +"\nBabu is choosing target";
    })

    this.socket.on("game-interrupt", () => {
      this.$refs.message.innerText = "Please wait for 4 players";

      this.hideTargetControls();
      this.hideTargetButtons();
      this.hideNewRoundControl();
    });

    this.socket.on("target-set", (target) => {
      console.log("target is "+target);
      this.target = target;
      this.hideTargetControls();
      if (this.self.card == "pulish") {
        this.$refs.message.innerText = "You are "+ this.self.card +"\nFind " + this.target;
        this.showTargetButtons();
      }
      else {
        this.$refs.message.innerText = "You are "+ this.self.card +"\nPulish is looking for " + this.target;
      }
    })

    this.socket.on("targetid-callback", (result) => {
      if (result) {
        if (this.self.card == "pulish")
          this.$refs.message.innerText = "You guessed correctly!";
        else
          this.$refs.message.innerText = "Pulish guessed correctly!";
      }
      else {
        if (this.self.card == "pulish")
          this.$refs.message.innerText = "You guessed wrong!";
        else
          this.$refs.message.innerText = "Pulish guessed wrong!";
      }
      this.showNewRoundControl();
    })
  }
};
</script>

<style scoped>
.message {
  font-size: 20px;
  font-weight: 500;
  text-shadow: 1.5px 1.5px rgba(0, 0, 0, 0.5);
}

.main {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.container {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  flex-wrap: wrap;
}

.container div {
  border: 1px transparent;
  border-radius: 15px;
  margin: 5px;
  box-shadow: rgba(3, 8, 20, 0.1) 0px 0.15rem 0.5rem,
    rgba(2, 8, 20, 0.1) 0px 0.075rem 0.175rem;
}

/* wide screen/desktop */
@media screen and (min-width: 600px) {
  .container {
    width: 70%;
  }

  .container div {
    padding-bottom: 1rem;
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

@media screen and (max-height: 600px) {
  header {
    visibility: hidden;
  }
}

/* portrait/mobile */
@media screen and (max-width: 600px) {
  header {
    visibility: hidden;
  }
  h1 {
    font-size: 18px;
  }
  h2 {
    font-size: 18px;
  }
  .container {
    width: 80%;
  }
  .container div {
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
  }
}

.hiddenid {
  display: none;
}

button {
  height: 30px;
  width: 100px;
  background-color: white;
  border: 1px solid #ffffff00;
  border-radius: 15px;
  cursor: pointer;
}

.buttonpanel {
  font-size: 20px;
  font-weight: 500;
  height: auto;
  width: 150px;
  padding: 10px;
  margin: 5px;
}

.break {
  flex-basis: 100%;
  height: 0;
  visibility: hidden;
}
</style>
