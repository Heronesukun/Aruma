<script lang="ts">
  import { siteConfig } from '../../site.config';
</script>

<div class="mdui-card mdui-hoverable sidebar-info">
  <div class="sidebar-info-img">
    <div
      class="sidebar-info-bg"
      style={`background-image: url('${siteConfig.sidebarBg}')`}
    >
    </div>
    <div
      class="mdui-img-circle mdui-shadow-3"
      style={`background-image: url('${siteConfig.avatar}')`}
    >
    </div>
  </div>
  <div class="sidebar-info-body">
    <div class="sidebar-info-name">{siteConfig.author}</div>
    <div class="sidebar-info-desc">{siteConfig.description}</div>
  </div>
</div>
