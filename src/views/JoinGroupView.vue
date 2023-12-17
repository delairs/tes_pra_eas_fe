<template>
  <div>
    <p>ini grup JOIN</p>
    <p>{{ currUser.user.email }}</p>
    <p>{{ currGroupID }}</p>
    <p>{{ message }}</p>

    <!-- Form Chat -->
    <form @submit.prevent="sendMessage">
      <div class="form-group">
        <label for="message">Pesan:</label>
        <textarea
          v-model="message"
          class="form-control"
          id="message"
          name="message"
          rows="3"
          required
        ></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Kirim</button>
    </form>

    <!-- Tampilkan Pesan dari Database -->
    <div>
      <h2>Riwayat Pesan</h2>
      <ul>
        <li v-for="chat in chatHistory" :key="chat.id">
          <p>
            <strong>{{ chat.UserID[0].email }}:</strong> {{ chat.content }}
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, ref } from "vue";
import router from "../router";
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const currUser = ref(null);
    const message = ref("");
    const store = useStore();
    const currGroupID = computed(() => store.getters.computedJoinGroupID);
    const chatHistory = ref([]);

    console.log(currGroupID);

    onBeforeMount(async () => {
      currUser.value = await getUser();
      if (!currUser.value) router.replace("/about");

      // Ambil riwayat chat dari database saat komponen dimuat
      await fetchChatHistory();
    });

    const getUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/users/me", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.status === 401) {
          console.error("Unauthorized: Invalid credentials");
        } else {
          const json = await res.json();
          console.log(json);
          return json;
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchChatHistory = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/chats?where[GroupID][equals]=" +
            currGroupID.value,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res.status === 401) {
          console.error("Unauthorized: Invalid credentials");
        } else {
          const json = await res.json();
          console.log(json);
          chatHistory.value = json.docs;
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const sendMessage = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/chats", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserID: currUser.value.user.id,
            GroupID: currGroupID.value,
            content: message.value,
          }),
        });

        if (res.status === 401) {
          console.error("Unauthorized: Invalid credentials");
        } else {
          const json = await res.json();
          console.log(json);
          // Update chat history setelah mengirim pesan
          await fetchChatHistory();
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    return {
      currUser,
      message,
      sendMessage,
      currGroupID,
      chatHistory,
      fetchChatHistory,
    };
  },
};
</script>
