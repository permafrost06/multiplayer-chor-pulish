<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div
        class="modal"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
      >
        <header class="modal-header" id="modalTitle">
          <slot name="header">Enter your name</slot>
        </header>
        <section class="modal-body" id="modalDescription">
          <slot name="body">
            <input
              class="name-field"
              ref="input"
              type="text"
              placeholder="Player"
              v-model="nameInput"
              @keyup.enter="submit"
            />
            <p><span class="err" ref="err"></span></p>
          </slot>
        </section>
        <footer class="modal-footer">
          <slot name="footer">
            <button
              type="button"
              class="btn-green"
              @click="submit"
              aria-label="Close modal"
            >Continue</button>
          </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "modal",
  data() {
    return {
      nameInput: ""
    };
  },
  methods: {
    submit() {
      if (this.nameInput == "") {
        this.$refs.err.innerText = "Please enter your name"
        this.$refs.err.style.display = "initial";
      } else if (this.nameInput.length > 10) {
        this.$refs.err.innerText = "Name must be 10 characters or less"
        this.$refs.err.style.display = "initial";
      } else {
        this.$emit("submit", this.nameInput);
        this.nameInput = "";
      }
    }
  },
  mounted() {
    this.$refs.err.style.display = "none";
    this.$refs.input.focus();
  }
};
</script>

<style>
.err {
  color: rgb(223, 83, 83);
}

.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #70c1b3;
  border: 1px transparent;
  border-radius: 15px;
  box-shadow: rgba(3, 8, 20, 0.1) 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
}

.modal-header,
.modal-footer {
  padding: 15px;
  display: flex;
}

.modal-header,
.modal-footer {
  font-size: 20px;
  justify-content: center;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
}

.name-field {
  font-size: 20px;
  height: 40px;
  width: 300px;
  text-align: center;
  border: 1px transparent;
  border-radius: 5px;
}

.btn-green {
  height: 30px;
  width: 100px;
  background: white;
  border: 1px transparent;
  border-radius: 15px;
}

button {
  cursor: pointer;
}
</style>