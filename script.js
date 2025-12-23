// Etya Radio JavaScript

// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const navList = document.querySelector('.nav-list');
const searchBtn = document.querySelector('.search-btn');
const searchBar = document.querySelector('.search-bar');
const searchResults = document.querySelector('.search-results');
const playButton = document.querySelector('.play-button');
const nowPlaying = document.querySelector('.now-playing');
const navLinks = document.querySelectorAll('.nav-link');

// Sample content for search functionality
const siteContent = {
    news: [
        {
            title: "Latest Local News Update",
            excerpt: "Breaking news from the local community with updates on current events...",
            url: "news.html"
        },
        {
            title: "Political Developments",
            excerpt: "Recent political changes and their impact on the community...",
            url: "news.html"
        }
    ],
    sports: [
        {
            title: "Local Sports Championship",
            excerpt: "The annual sports championship brings together teams from across the region...",
            url: "sports.html"
        },
        {
            title: "Football League Updates",
            excerpt: "Latest scores and standings from the regional football league...",
            url: "sports.html"
        }
    ],
    business: [
        {
            title: "Local Business Growth",
            excerpt: "Small businesses in the area are showing remarkable growth this quarter...",
            url: "business.html"
        },
        {
            title: "Economic Development News",
            excerpt: "New initiatives to boost economic development in the region...",
            url: "business.html"
        }
    ],
    politics: [
        {
            title: "Community Leadership Changes",
            excerpt: "New leadership appointments and their vision for the community...",
            url: "politics.html"
        }
    ]
};

// Mobile Menu Toggle
menuToggle.addEventListener('click', () => {
    navList.classList.toggle('active');
    menuToggle.textContent = navList.classList.contains('active') ? '✕' : '☰';
});

// Search Functionality
searchBtn.addEventListener('click', performSearch);
searchBar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

async function performSearch() {
    const query = searchBar.value.toLowerCase().trim();
    
    if (query === '') {
        searchResults.classList.remove('active');
        return;
    }
    
    searchResults.innerHTML = '<div class="search-loading">🔍 Searching the web...</div>';
    searchResults.classList.add('active');
    
    try {
        // First, search local content
        const localResults = [];
        Object.keys(siteContent).forEach(category => {
            siteContent[category].forEach(item => {
                if (item.title.toLowerCase().includes(query) || 
                    item.excerpt.toLowerCase().includes(query)) {
                    localResults.push({
                        ...item,
                        category: category.charAt(0).toUpperCase() + category.slice(1),
                        type: 'local'
                    });
                }
            });
        });
        
        // Then search the web using a news API approach
        const webResults = await searchWeb(query);
        
        const allResults = [...localResults, ...webResults];
        displaySearchResults(allResults);
        
    } catch (error) {
        console.error('Search error:', error);
        searchResults.innerHTML = `
            <div class="search-result-item">
                <div class="search-result-title">Search temporarily unavailable</div>
                <div class="search-result-excerpt">Please try again in a moment</div>
            </div>
        `;
    }
}

async function searchWeb(query) {
    // Using DuckDuckGo instant answer API for web search
    const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query + ' news')}&format=json&pretty=1`);
    const data = await response.json();
    
    const results = [];
    
    // Process related topics from DuckDuckGo
    if (data.RelatedTopics) {
        data.RelatedTopics.slice(0, 3).forEach(topic => {
            if (topic.Text && topic.FirstURL) {
                results.push({
                    title: topic.Text.split(' - ')[0] || topic.Text.substring(0, 60) + '...',
                    excerpt: topic.Text.substring(0, 150) + '...',
                    url: topic.FirstURL,
                    category: 'Web',
                    type: 'web'
                });
            }
        });
    }
    
    // If no results from RelatedTopics, try Abstract
    if (results.length === 0 && data.Abstract) {
        results.push({
            title: data.AbstractText ? data.AbstractText.split('. ')[0] : query + ' - Information',
            excerpt: data.Abstract.substring(0, 150) + '...',
            url: data.AbstractURL || '#',
            category: 'Web',
            type: 'web'
        });
    }
    
    return results;
}

function displaySearchResults(results) {
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-result-item">
                <div class="search-result-title">No results found</div>
                <div class="search-result-excerpt">Try searching with different keywords</div>
            </div>
        `;
    } else {
        searchResults.innerHTML = results.map(result => `
            <div class="search-result-item" onclick="${result.type === 'web' ? `window.open('${result.url}', '_blank')` : `window.location.href='${result.url}'`}">
                <div class="search-result-title">${result.title}</div>
                <div class="search-result-excerpt">${result.excerpt}</div>
                <small style="color: var(--primary-orange);">Category: ${result.category} ${result.type === 'web' ? '🌐' : '📁'}</small>
            </div>
        `).join('');
    }
    
    searchResults.classList.add('active');
}

// Close search results when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container') && !e.target.closest('.search-results')) {
        searchResults.classList.remove('active');
    }
});

// Live Radio Streaming (Placeholder)
let isPlaying = false;
playButton.addEventListener('click', () => {
    if (!isPlaying) {
        startRadioStream();
    } else {
        stopRadioStream();
    }
});

function startRadioStream() {
    // In a real implementation, this would connect to an actual radio stream
    playButton.textContent = '⏸ Stop';
    playButton.style.background = 'var(--secondary-blue)';
    isPlaying = true;
    
    // Simulate now playing information
    nowPlaying.innerHTML = `
        <h4>🔴 LIVE - Etya Radio 100.3 FM</h4>
        <p><strong>Now Playing:</strong> Eriogi Ria Omogusii - Morning Show</p>
        <p><strong>Host:</strong> Radio Presenter</p>
        <p><small>Stream quality: Good</small></p>
    `;
    
    // Add a visual indicator
    playButton.innerHTML = '⏸ Stop Playing';
}

function stopRadioStream() {
    playButton.textContent = '▶ Play Live';
    playButton.style.background = 'var(--primary-orange)';
    isPlaying = false;
    
    nowPlaying.innerHTML = `
        <p>Click the play button to start listening to Etya Radio 100.3 FM</p>
    `;
}

// Navigation Active State
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        // Add active class to clicked link
        this.classList.add('active');
        
        // Close mobile menu after selection
        if (window.innerWidth <= 768) {
            navList.classList.remove('active');
            menuToggle.textContent = '☰';
        }
    });
});

// Set active nav based on current page
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        const href = link.getAttribute('href');
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setActiveNavigation();
    
    // Add some initial animation
    const cards = document.querySelectorAll('.content-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navList.classList.remove('active');
        menuToggle.textContent = '☰';
    }
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search focus
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchBar.focus();
    }
    
    // Escape to close search results
    if (e.key === 'Escape') {
        searchResults.classList.remove('active');
        searchBar.blur();
    }
});

// Live button special behavior
const liveBtn = document.querySelector('.live-btn');
if (liveBtn) {
    liveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Scroll to live player section
        const livePlayer = document.querySelector('.live-player');
        if (livePlayer) {
            livePlayer.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            // Auto-start playing
            setTimeout(() => {
                if (!isPlaying) {
                    startRadioStream();
                }
            }, 500);
        }
    });
}

// Update frequency display
function updateFrequency() {
    const frequencyElements = document.querySelectorAll('.frequency');
    frequencyElements.forEach(el => {
        el.textContent = '100.3 FM';
    });
}

// Call on load
updateFrequency();

// Fullscreen functionality for video placeholder
function toggleFullscreen() {
    const videoPlaceholder = document.querySelector('.video-placeholder');
    if (!videoPlaceholder) return;
    
    if (!document.fullscreenElement) {
        videoPlaceholder.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Add fullscreen button event listener
document.addEventListener('DOMContentLoaded', () => {
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
});
