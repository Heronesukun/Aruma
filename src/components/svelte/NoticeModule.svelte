<script lang="ts">
  import { i18n } from '../../i18n/translation';
  import I18nKey from '../../i18n/i18nKey';
  import SidebarModule from './SidebarModule.svelte';

  let { content = "" }: { content?: string } = $props();
</script>

{#if content}
  <SidebarModule title={i18n(I18nKey.notice)}>
    <div class="sidebar-notice-content">{@html content}</div>
  </SidebarModule>
{/if}
