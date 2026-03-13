<script lang="ts">
  import { i18n } from '../../i18n/translation';
  import I18nKey from '../../i18n/i18nKey';
  import SidebarModule from './SidebarModule.svelte';
  import ChipCloud from './ChipCloud.svelte';

  let { categories = [] }: { categories?: { name: string; slug: string }[] } = $props();
</script>

<SidebarModule title={i18n(I18nKey.categoryCloud)}>
  <ChipCloud items={categories} hrefPrefix="/category/" />
</SidebarModule>
