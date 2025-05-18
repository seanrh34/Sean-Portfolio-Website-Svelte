<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css';
  import { pageList } from '$lib/constants/pageList';
  import Navbar from '../components/Navbar.svelte';

  let { 
		children,
	} : {
		children: () => any,
	} = $props();
</script>

<Navbar pageList={ pageList } />

<div class="pt-16">
  {@render children()}
</div>

