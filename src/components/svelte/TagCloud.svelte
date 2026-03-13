<script lang="ts">
  import { i18n } from '../../i18n/translation';
  import I18nKey from '../../i18n/i18nKey';
  import SidebarModule from './SidebarModule.svelte';
  import ChipCloud from './ChipCloud.svelte';

  let { tags = [] }: { tags?: string[] } = $props();
</script>

<SidebarModule title={i18n(I18nKey.tagCloud)}>
  <ChipCloud items={tags} hrefPrefix="/tags/" />
</SidebarModule>
