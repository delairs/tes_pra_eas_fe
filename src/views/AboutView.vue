<template>
  <div class="container mt-5">
    <h2 class="mb-4">Register</h2>
    <form @submit.prevent="handleRegister">
      <div class="mb-3">
        <label for="email" class="form-label">Email:</label>
        <input
          v-model="email"
          type="email"
          class="form-control"
          id="email"
          name="email"
          required
        />
      </div>

      <div class="mb-3">
        <label for="newPassword" class="form-label">New Password:</label>
        <input
          v-model="newPassword"
          type="password"
          class="form-control"
          id="newPassword"
          name="newPassword"
          required
        />
      </div>

      <div class="mb-3">
        <label for="confirmPassword" class="form-label"
          >Confirm Password:</label
        >
        <input
          v-model="confirmPassword"
          type="password"
          class="form-control"
          id="confirmPassword"
          name="confirmPassword"
          required
        />
      </div>

      <button type="submit" class="btn btn-primary">Register</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      newPassword: "",
      confirmPassword: "",
    };
  },
  methods: {
    async handleRegister() {
      if (this.newPassword !== this.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: this.email,
            password: this.newPassword,
            confirmPassword: this.confirmPassword,
          }),
        });

        if (!res.ok) {
          console.error("Registration failed with status:", res.status);
          return;
        }

        const json = await res.json();
        console.log(json);
        alert("Registration successful!");
      } catch (error) {
        console.error("Error:", error);
      }
    },
  },
};
</script>

<style scoped>
/* Add your component-specific styles here */
</style>
