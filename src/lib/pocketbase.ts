import Pocketbase from "pocketbase";

import { writable } from "svelte/store";

export const pb = new Pocketbase("http://172.105.186.25:80");

export const currentUser = writable(pb.authStore.model);

pb.authStore.onChange((auth) => {
  console.log("authStore changed", auth);
  currentUser.set(pb.authStore.model);
});
