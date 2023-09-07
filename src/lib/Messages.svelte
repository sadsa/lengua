<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { currentUser, pb } from "./pocketbase";

  let messages: any[] = [];
  let newMessage = "";

  onMount(async () => {
    const resultList = await pb
      .collection("messages")
      .getList(1, 50, { sort: "created", expand: "user" });
    messages = resultList.items;
  });

  async function sendMessage() {
    const data = {
      text: newMessage,
      user: $currentUser?.id,
    };

    const createdMessage = await pb.collection("messages").create(data);
    newMessage = "";
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
      </div>
    </div>
  {/each}
</div>

<form on:submit|preventDefault={sendMessage}>
  <input placeholder="Message" type="text" bind:value={newMessage} />
  <button type="submit">Send</button>
</form>
