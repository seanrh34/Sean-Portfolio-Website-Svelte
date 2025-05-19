<script lang="ts">
  import { page } from '$app/state'; 

  let email = $derived(page.params.email);
</script>

<main class="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
  <h1 class="text-4xl text-gray-200">Email: {email}</h1>
</main>