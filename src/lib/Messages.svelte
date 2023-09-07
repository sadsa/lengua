<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { currentUser, pb } from "./pocketbase";

  let newMessage: string;
  let messages: any[] = [];
  let unsubscribe: () => void;

  onMount(async () => {
    const resultList = await pb
      .collection("messages")
      .getList(1, 50, { sort: "created", expand: "user" });
    messages = resultList.items;

    // Subscribe to realtime messages
    unsubscribe = await pb
      .collection("messages")
      .subscribe("*", async ({ action, record }) => {
        if (action === "create") {
          // Fetch associated user
          const user = await pb.collection("users").getOne(record.user);
          record.expand = { user };
          messages = [...messages, record];
        }
        if (action === "delete") {
          messages = messages.filter((m) => m.id !== record.id);
        }
      });
  });

  // Unsubscribe from realtime messages
  onDestroy(() => {
    unsubscribe?.();
  });

  async function sendMessage() {
    if (!$currentUser?.id) throw Error("No Current User");

    const data = {
      text: newMessage,
      user: $currentUser.id,
    };

    await pb.collection("messages").create(data);
    newMessage = "";
  }

  async function deleteMessage(id: string) {
    await pb.collection("messages").delete(id);
  }
</script>

<div class="messages">
  {#each messages as message (message.id)}
    <div class="message">
      <img
        class="avatar"
        src={`https://avatars.dicebear.com/api/identicon/${message.expand?.user?.username}.svg`}
        alt="avatar"
        width="40px"
      />
      <div>
        <small>
          Sent by @{message.expand?.user?.username}
        </small>
        <p class="message-text">{message.text}</p>
        <button on:click={() => deleteMessage(message.id)}>Delete</button>
      </div>
    </div>
  {/each}
</div>

<form on:submit|preventDefault={sendMessage}>
  <input placeholder="Message" type="text" bind:value={newMessage} />
  <button type="submit">Send</button>
</form>
