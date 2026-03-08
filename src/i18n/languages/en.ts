import Key from "../i18nKey";
import type { Translation } from "../translation";

export const en: Translation = {
    // Navigation
    [Key.home]: "Home",
    [Key.category]: "Categories",
    [Key.archive]: "Archive",
    [Key.friends]: "Friends",
    [Key.anime]: "Anime",
    [Key.other]: "Other",
    [Key.about]: "About",
    
    // Search
    [Key.searchPlaceholder]: "Search",
    [Key.searchResult]: "Search Results",
    [Key.searchResultFor]: "Search Results: {query}",
    [Key.foundPosts]: "Found {count} related post(s)",
    [Key.noSearchResult]: "No posts found for \"{query}\"",
    [Key.viewAllPosts]: "View All Posts",
    
    // Post related
    [Key.sticky]: "[Sticky]",
    [Key.comments]: "{count} comments",
    [Key.views]: "{count} views",
    [Key.readingTime]: "Reading time: about {minutes} minutes",
    [Key.categoryLabel]: "Category: ",
    [Key.tagsLabel]: "Tags: ",
    
    // Sidebar
    [Key.recentReplies]: "Recent Replies",
    [Key.noReplies]: "No replies yet",
    [Key.tagCloud]: "Tag Cloud",
    
    // Page titles
    [Key.friendsTitle]: "Friend Links",
    [Key.animeTitle]: "Anime",
    [Key.archiveTitle]: "Archive",
    [Key.archiveYear]: "Archive: {year}",
    [Key.categoryTitle]: "Categories",
    [Key.categoryWith]: "Category: {name}",
    [Key.tagWith]: "Tag: {tag}",
    
    // Footer
    [Key.allRightsReserved]: "All rights reserved.",
    [Key.poweredBy]: "Proudly powered by",
    
    // Code copy
    [Key.copyCode]: "Copy code",
    [Key.copySuccess]: "Copied!",
    
    // RSS
    [Key.rssSubscribe]: "RSS Feed",
};
