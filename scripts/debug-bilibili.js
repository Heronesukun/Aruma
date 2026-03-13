/**
 * Bilibili API 调试脚本
 * 用于检查 API 响应数据结构
 */

import axios from 'axios';

const API_BASE = 'https://api.bilibili.com/x/space/bangumi/follow/list';

// 测试用的用户 ID（可从配置文件获取或使用默认值）
const TEST_USER_ID = '174471710'; // 使用 Cuckoo 示例中的默认 UID

async function debugBilibiliApi() {
  console.log('=== Bilibili API 调试 ===\n');
  
  try {
    // 测试三种状态
    const statuses = [
      { value: 0, name: '全部' },
      { value: 1, name: '想看/计划' },
      { value: 2, name: '在看/观看中' },
      { value: 3, name: '已看/完成' }
    ];
    
    for (const status of statuses) {
      console.log(`\n--- 测试状态：${status.name} (${status.value}) ---`);
      
      const url = `${API_BASE}?type=1&follow_status=${status.value}&vmid=${TEST_USER_ID}&ps=5&pn=1`;
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': `https://space.bilibili.com/${TEST_USER_ID}/bangumi`
        }
      });
      
      if (response.data.code === 0) {
        console.log(`API 响应成功`);
        console.log(`总数：${response.data.data.total}`);
        
        if (response.data.data.list && response.data.data.list.length > 0) {
          console.log(`返回条目数：${response.data.data.list.length}`);
          
          // 分析第一个条目的数据结构
          const firstItem = response.data.data.list[0];
          console.log('\n第一个条目的数据结构:');
          console.log(JSON.stringify(firstItem, null, 2));
          
          // 重点检查字段
          console.log('\n--- 重点字段分析 ---');
          console.log(`title: ${firstItem.title}`);
          console.log(`cover: ${firstItem.cover}`);
          console.log(`square_cover: ${firstItem.square_cover}`);
          console.log(`media_id: ${firstItem.media_id}`);
          console.log(`season_id: ${firstItem.season_id}`);
          console.log(`progress: ${firstItem.progress}`);
          console.log(`is_finish: ${firstItem.is_finish}`);
          console.log(`is_started: ${firstItem.is_started}`);
          console.log(`follow_status: ${firstItem.follow_status}`);
          console.log(`season_type_name: ${firstItem.season_type_name}`);
          console.log(`evaluate: ${firstItem.evaluate?.substring(0, 50) || 'N/A'}...`);
          console.log(`areas: ${JSON.stringify(firstItem.areas)}`);
          console.log(`publish: ${JSON.stringify(firstItem.publish)}`);
          console.log(`rating: ${JSON.stringify(firstItem.rating)}`);
          console.log(`styles: ${JSON.stringify(firstItem.styles)}`);
          console.log(`total_count: ${firstItem.total_count}`);
          console.log(`new_ep: ${JSON.stringify(firstItem.new_ep)}`);
          console.log(`url: ${firstItem.url}`);
        } else {
          console.log('该状态下没有数据');
        }
      } else {
        console.log(`API 响应失败：${response.data.message}`);
      }
      
      // 延迟避免请求过快
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
  } catch (error) {
    console.error('调试过程中发生错误:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
  }
}

debugBilibiliApi();
