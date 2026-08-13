<script lang="ts">
	import type { Snippet } from "svelte";

	let { title, children }: { title: string; children?: Snippet } = $props();
</script>

<div class="mdui-card mdui-hoverable sidebar-module">
	<ul class="mdui-list">
		<div class="sidebar-module-title">{title}</div>
		<li class="mdui-divider mdui-m-y-0"></li>
		{@render children?.()}
	</ul>
</div>
