<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="mb-3">
        <label for="username" class="form-label">Username:</label>
        <input
          v-model="username"
          type="text"
          class="form-control"
          id="username"
          name="username"
          required
        />
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Password:</label>
        <input
          v-model="password"
          type="password"
          class="form-control"
          id="password"
          name="password"
          required
        />
      </div>

      <button type="submit" class="btn btn-success">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const res = await fetch("http://localhost:3000/api/users/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: this.username,
            password: this.password,
          }),
        });

        if (res.status === 401) {
          console.error("Unauthorized: Invalid credentials");
        } else {
          const json = await res.json();
          console.log(json);
          // Use Vue Router to navigate to the dashboard route
          this.$router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },
  },
};
</script>
