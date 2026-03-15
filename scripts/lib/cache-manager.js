/**
 * 数据缓存管理器
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = join(__dirname, '../../src/data');
const CACHE_FILE = join(CACHE_DIR, 'external-anime.json');
const METADATA_FILE = join(CACHE_DIR, 'external-anime-meta.json');

/**
 * 检查缓存是否有效
 * @param {string} source - 数据源名称
 * @param {number} cacheTime - 缓存时间（秒）
 * @returns {boolean} 缓存是否有效
 */
function isCacheValid(source, cacheTime) {
  if (!existsSync(METADATA_FILE)) return false;
  
  try {
    const metadata = JSON.parse(readFileSync(METADATA_FILE, 'utf-8'));
    const sourceMeta = metadata[source];
    
    if (!sourceMeta) return false;
    
    const now = Date.now();
    const cacheAge = (now - sourceMeta.timestamp) / 1000;
    
    return cacheAge < cacheTime;
  } catch {
    return false;
  }
}

/**
 * 读取缓存数据
 * @returns {Object} 缓存的动漫数据
 */
function readCache() {
  if (!existsSync(CACHE_FILE)) return { bilibili: [], bangumi: [] };
  
  try {
    return JSON.parse(readFileSync(CACHE_FILE, 'utf-8'));
  } catch {
    return { bilibili: [], bangumi: [] };
  }
}

/**
 * 写入缓存数据
 * @param {Object} data - 动漫数据
 * @param {string} source - 数据源名称
 */
function writeCache(data, source) {
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true });
  }
  
  const cache = readCache();
  cache[source] = data;
  
  writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
  
  // 更新元数据
  let metadata = {};
  if (existsSync(METADATA_FILE)) {
    metadata = JSON.parse(readFileSync(METADATA_FILE, 'utf-8'));
  }
  
  metadata[source] = {
    timestamp: Date.now(),
    count: data.length
  };
  
  writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2), 'utf-8');
  
  console.log(`Cached ${data.length} items from ${source}`);
}

/**
 * 获取缓存的动漫数据
 * @param {string} source - 数据源名称
 * @returns {Array} 动漫列表
 */
function getCachedAnime(source) {
  const cache = readCache();
  return cache[source] || [];
}

export { isCacheValid, readCache, writeCache, getCachedAnime };
