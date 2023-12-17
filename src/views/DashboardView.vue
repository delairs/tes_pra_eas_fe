<template>
  <div>
    <p>Ini dashboard</p>
    <br />
    <p v-if="loading">Loading...</p>
    <p v-else>Email: {{ currUser.user.email }}</p>

    <button @click="toggleForm">Buat Grup</button>
    <p v-if="showForm">Buat Group Kamu Adminnya</p>
    <div v-else>
      <h2>Buat Grup</h2>
      <form @submit.prevent="createGroup">
        <div class="mb-3">
          <label for="GroupID" class="form-label">GroupID:</label>
          <input
            v-model="GroupID"
            class="form-control"
            id="GroupID"
            name="GroupID"
            required
          />
        </div>
        <button type="submit" class="btn btn-success">Klik Buat</button>
      </form>
    </div>

    <button @click="toggleJoin">Join Grup</button>
    <p v-if="showForm2">Join Group dengan masukkan Kode Group</p>
    <div v-else>
      <h2>Join Group</h2>
      <form @submit.prevent="fetchUserID">
        <div class="mb-3">
          <label for="JoinGroupID" class="form-label">GroupID:</label>
          <input
            v-model="JoinGroupID"
            class="form-control"
            id="JoinGroupID"
            name="JoinGroupID"
            required
          />
        </div>
        <button type="submit" class="btn btn-success">Join Grup</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import router from "../router";
import { useStore } from "vuex";

export default {
  setup() {
    const showForm = ref(true);
    const showForm2 = ref(true);
    const currUser = ref(null);
    const loading = ref(true);
    const allUserID = ref([]);
    const GroupID = ref("");
    const JoinGroupID = ref(""); // New variable for Join Group
    const currGroupID = ref("");
    const store = useStore();

    const toggleForm = () => {
      showForm.value = !showForm.value;
    };

    const toggleJoin = () => {
      showForm2.value = !showForm2.value;
    };

    onMounted(async () => {
      currUser.value = await getUser();
      loading.value = false;

      if (!currUser.value) router.replace("/about");
      await fetchUserID();
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

    const createGroup = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/group", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserID: currUser.value.user.id,
            GroupID: GroupID.value,
          }),
        });

        if (res.status === 401) {
          console.error("Unauthorized: Invalid credentials");
        } else {
          const json = await res.json();
          currGroupID.value = json.doc.id;
          console.log(currGroupID.value);

          await store.dispatch("updateCreatedGroup", currGroupID.value);

          router.push("/owngroup");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    console.log(allUserID.value);
    const joinGroup = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/group/" + JoinGroupID.value,
          {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              UserID: allUserID.value,
            }),
          }
        );

        if (res.status === 401) {
          console.error("Unauthorized: Invalid credentials");
        } else {
          const json = await res.json();
          console.log(json);
          await store.dispatch("updateJoinGroupID", JoinGroupID.value);
          router.push("/joingroup");
          return json;
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    const fetchUserID = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/group/" + JoinGroupID.value,
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

          // Tambahkan pengecekan currUser.user
          if (currUser.value && currUser.value.user) {
            const userIds = json.UserID.map((user) => user.id);

            // Gunakan .value untuk menambahkan elemen ke array ref
            allUserID.value.push(...userIds, currUser.value.user.id);
            console.log(allUserID.value);

            await joinGroup();
          } else {
            console.error("Error: currUser or currUser.user is undefined");
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    return {
      currUser,
      loading,
      showForm,
      GroupID,
      toggleForm,
      createGroup,
      currGroupID,
      showForm2,
      toggleJoin,
      JoinGroupID,
      fetchUserID,
    };
  },
};
</script>
