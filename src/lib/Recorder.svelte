<script lang="ts">
    import { onMount } from "svelte";

    let href: string;
    let download: string;
    let recordedChunks: Blob[] = [];
    let mediaRecorder: MediaRecorder;
    let recording = false;

    onMount(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
        });

        mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

        mediaRecorder.addEventListener("dataavailable", function (e) {
            if (e.data.size > 0) recordedChunks.push(e.data);
        });

        mediaRecorder.addEventListener("stop", function () {
            href = URL.createObjectURL(new Blob(recordedChunks));
            download = "acetest.wav";
        });
    });

    function record() {
        if (recording) {
            mediaRecorder?.stop();
            recording = false;
        } else {
            recordedChunks = [];
            mediaRecorder?.start();
            recording = true;
        }
    }
</script>

<button on:click={record}>
    {#if recording}Stop{:else}Record{/if}
</button>
{#if href}
    <a {href} {download}>Download</a>
{/if}
