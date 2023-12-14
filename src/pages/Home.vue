<script setup lang="ts">
import { onMounted, ref } from "vue";
import routes from "../routes";
import { api } from "../api";
import { ICFManagerInfo } from "../interface/info.interface";
import { perttyAxios } from "../utils/pertty-axios";
// @ts-ignore
import VueTurnstile from "vue-turnstile";

const show = ref(false);
const loaded = ref(false);
const loadingBtn = ref(false);
const cfToken = ref("");

// Get query
const id = routes.currentRoute.value.query.id;
const token = routes.currentRoute.value.query.token;
// Replace data
const data = ref<ICFManagerInfo | null>(null);
const ip = ref("");

async function doUpdateNewIP() {
  if (!cfToken.value) return alert("Please verify captcha");

  loadingBtn.value = true;

  // Do request to server
  const info = await perttyAxios<ICFManagerInfo>(
    api.post("/api/v1/update", {
      id,
      token,
      ip: ip.value,
      "cf-turnstile-response": cfToken.value,
    })
  );

  loadingBtn.value = false;

  if (!info.code) {
    return alert("Network error.");
  }
  if ([400, 401, 500].includes(info.code)) {
    return alert("Server error. Please contact administrator.");
  } else if (info.code === 422) {
    return alert(
      "Your domain not registered. Please contact administrator to add it."
    );
  }

  alert("Update success. Please take few 1 - 5 minute will take effect");
  setTimeout(() => {
    window.location.reload();
  }, 50);
}

onMounted(async () => {
  console.log("OK");
  if (!id || !token) loaded.value = true;
  // Do request to server
  const info = await perttyAxios<ICFManagerInfo>(
    api.post("/api/v1/info", {
      id,
      token,
    })
  );
  if (!info.code) {
    return alert("Network error.");
  }
  if ([400, 401].includes(info.code)) {
    return (loaded.value = true);
  } else if (info.code === 500) {
    return alert("Server error. Please contact administrator.");
  }

  // Replace data
  data.value = info.data;
  show.value = true;
  loaded.value = true;
  ip.value = info.data.ip;
});
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <div v-if="!loaded">
      <div class="flex justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-12 h-12 animate-spin"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </div>

      <h1 class="text-3xl font-light text-center">Loading....</h1>
    </div>
    <div v-else-if="loaded && !show" class="space-y-5">
      <div class="flex justify-center">
        <img src="/ump45.gif" />
      </div>
      <h1 class="text-3xl font-semibold text-center">Nice try bro.</h1>
    </div>
    <div v-else-if="loaded && show && !data">
      <div class="flex justify-center">
        <img src="/sora_uhm.gif" class="w-[50%]" />
      </div>
      <h1 class="text-3xl font-semibold text-center">Very sussy baka. (0x1)</h1>
    </div>
    <div v-else>
      <div class="bg-white shadow-xl p-5 rounded-md">
        <h1 class="text-xl font-semibold">Cloudflare IP manager</h1>
        <h4>
          Your domain:
          <a
            :href="data?.domain"
            class="no-underline hover:underline text-sky-500 hover:text-sky-700 duration-300"
            target="_blank"
            >{{ data?.domain }}</a
          >
          <hr class="my-2" />
          <div class="space-y-3">
            <div class="space-y-1">
              <label>Your current IP ({{ data?.type }} record)</label><br />
              <input
                v-model="ip"
                type="text"
                placeholder="Enter your IP"
                class="border border-slate-400 px-2 rounded-md py-2 w-full"
              />
            </div>
            <vue-turnstile
              site-key="0x4AAAAAAAOlY263ZjuhUAyX"
              v-model="cfToken"
            />
            <button
              type="button"
              @click="doUpdateNewIP"
              :disabled="loadingBtn"
              :class="`${
                loadingBtn
                  ? 'bg-gray-400 hover:bg-gray-500 w-full duration-300 rounded-md py-2 text-white transform translate-y-0 hover:-translate-y-1 shadow-none hover:shadow-md'
                  : 'bg-purple-400 hover:bg-purple-500 duration-300 w-full rounded-md py-2 text-white transform translate-y-0 hover:-translate-y-1 shadow-none hover:shadow-md'
              }`"
            >
              <div class="flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6 animate-spin"
                  v-if="loadingBtn"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                <div v-else>Update new IP</div>
              </div>
            </button>
          </div>
        </h4>
      </div>

      <div class="text-center my-3">
        <div>
          <span>Made with 💖 by </span>
          <a
            href="https://m307.dev"
            class="no-underline hover:underline text-sky-500 hover:text-sky-700 duration-300"
            >M-307</a
          >
        </div>
        <div>
          <span class="text-sm text-gray-500"
            >This site is protected by
            <a
              href="https://www.cloudflare.com/en-gb/products/turnstile/"
              class="no-underline hover:underline text-amber-500 hover:text-amber-700 duration-300"
              >Cloudflare Turnstile.</a
            ></span
          >
        </div>
      </div>
    </div>
  </div>
</template>
