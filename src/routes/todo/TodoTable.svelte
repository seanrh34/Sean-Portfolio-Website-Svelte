<script lang="ts">

  type TodoItem = {
    id: number;
    name: string;
    completed: boolean;
  };

  let { 
    todo 
  }: { 
    todo: { 
      items: TodoItem[] 
      } 
  } = $props();
</script>

<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
  <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-200">
    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-600 dark:text-gray-300">
      <tr>
        <th scope="col" class="px-6 py-3">Task ID</th>
        <th scope="col" class="px-6 py-3">Task</th>
        <th scope="col" class="px-6 py-3">Completed</th>
      </tr>
    </thead>
    <tbody>
      {#each todo.items as item (item.id)}
        <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-400 border-gray-200">
          <td class="px-6 py-4">{item.id}</td>
          <td class="px-6 py-4">{item.name}</td>
          <td class="px-6 py-4">
            <div class="flex items-center justify-center">
              <input
                type="checkbox"
                bind:checked={item.completed}
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
