<template>
  <div>
    <h1>Logout Page</h1>
    <p>Anda akan keluar dari sesi.</p>
    <button @click="handleLogout">Logout</button>
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: "",
    };
  },
  methods: {
    async handleLogout() {
      try {
        const res = await fetch("http://localhost:3000/api/users/logout", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.status === 401) {
          console.error("Unauthorized: Invalid credentials");
        } else {
          const json = await res.json();
          this.message = json.message;
          console.log(this.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    },
  },
};
</script>
