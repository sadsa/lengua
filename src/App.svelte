<script lang="ts">
  import Login from "./lib/Login.svelte";
  import Messages from "./lib/Messages.svelte";
  import Recorder from "./lib/Recorder.svelte";
  import { currentUser } from "./lib/pocketbase";
</script>

<h1>Lengua</h1>

{#if $currentUser}
  <p>
    Signed in as {$currentUser.username}
    {$currentUser.id}
  </p>
  <Messages />
  <Recorder />
{:else}
  <Login />
{/if}
