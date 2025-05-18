<script lang="ts">
  import TodoTable from "./TodoTable.svelte";

  let todo = $state({
    items: [
      { id: 0, name: 'Add something to do', completed: false },
    ],
  })

  function addTodo(task: string): void {
    const newTodo = { 
      id: Date.now(), 
      name: task, 
      completed: false 
    };

    todo.items.push(newTodo);
  }

  let newTask = $state('');

</script>

<main class="flex flex-col items-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
  <h1 class="text-4xl text-gray-200">To Do List</h1>

  <div class="my-8">
    <input
      type="text"
      bind:value={newTask}
      placeholder="Add a new task"
      class="p-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-gray-200"
    />
    <button
      onclick={() => {
        if (newTask.trim()) {
          addTodo(newTask);
          newTask = '';
        }
      }}
      class="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Add Task
    </button>
  </div>
  
  <div class="my-4">
    <TodoTable {todo} />

    <div class="my-4">
      <ul class="list-disc">
        {#each todo.items as item}
          <li class="text-gray-800 dark:text-gray-200">
            {item.name} - {item.completed ? 'Completed' : 'Pending'}
          </li>
        {/each}
      </ul>
    </div>
</main>