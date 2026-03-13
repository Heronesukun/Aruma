<script lang="ts">
  import { siteConfig } from '../../site.config';

  interface Social {
    name: string;
    url: string;
  }

  let { social = [] }: { social?: Social[] } = $props();

  const getSocialIcon = (name: string) => {
    const map: Record<string, string> = {
      GitHub: 'code',
      Twitter: 'share',
      Email: 'email',
    };
    return map[name] || 'link';
  };
</script>

<div class="drawer-profile">
  <div class="drawer-avatar">
    <img src={siteConfig.avatar} alt="Avatar" />
  </div>
  <div class="drawer-social">
    {#each social as s (s.name)}
      <a href={s.url} target="_blank" class="social-icon" title={s.name}>
        <i class="mdui-icon material-icons">{getSocialIcon(s.name)}</i>
      </a>
    {/each}
  </div>
</div>
