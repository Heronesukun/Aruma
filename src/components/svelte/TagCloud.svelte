<script lang="ts">
  import { i18n } from '../../i18n/translation';
  import I18nKey from '../../i18n/i18nKey';

  let { tags = [] }: { tags?: string[] } = $props();
</script>

<div class="mdui-card mdui-hoverable sidebar-module">
  <ul class="mdui-list">
    <div class="sidebar-module-title">{i18n(I18nKey.tagCloud)}</div>
    <li class="mdui-divider mdui-m-y-0"></li>
    <div class="sidebar-tag">
      {#each tags as tag (tag)}
        <a href={`/tags/${tag}`} class="tag-link">
          <div class="mdui-chip">
            <span class="mdui-chip-title">{tag}</span>
          </div>
        </a>
      {/each}
    </div>
  </ul>
</div>
