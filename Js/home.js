// API Configuration - Use the same endpoint as the admin panel
const API_BASE = "https://admin-9hxq.onrender.com";
// DOM Elements
const jobListings = document.getElementById('job-listings');
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const loadMoreButton = document.getElementById('load-more-jobs');
const filterChips = document.querySelectorAll('.filter-chip');

// State
let jobs = [];
let currentPage = 1;
let jobsPerPage = 6;
let currentFilter = 'All Jobs';
let searchQuery = '';

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    fetchJobs();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Filter chips
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => handleFilter(chip));
    });

    // Load more button
    loadMoreButton.addEventListener('click', loadMoreJobs);
}

// Fetch jobs from API - using the same endpoint as admin
async function fetchJobs() {
    try {
        // Use the same endpoint as the admin panel: /jobs/
        const response = await fetch(`${API_BASE}/jobs/?page=${currentPage}&limit=${jobsPerPage}&search=${searchQuery}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            jobs = currentPage === 1 ? data : [...jobs, ...data];
            renderJobs();
            
            // Hide load more button if no more jobs
            if (data.length < jobsPerPage) {
                loadMoreButton.style.display = 'none';
            } else {
                loadMoreButton.style.display = 'block';
            }
        } else if (currentPage === 1) {
            // No jobs found
            jobListings.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-briefcase text-gray-400 text-5xl mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-700 mb-2">No jobs found</h3>
                    <p class="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
            `;
            loadMoreButton.style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching jobs:', error);
        jobListings.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-exclamation-circle text-red-500 text-5xl mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-700 mb-2">Error loading jobs</h3>
                <p class="text-gray-500">Please try again later</p>
            </div>
        `;
        loadMoreButton.style.display = 'none';
    }
}

// Render jobs in the grid
function renderJobs() {
    jobListings.innerHTML = '';
    
    jobs.forEach(job => {
        const jobCard = createJobCard(job);
        jobListings.appendChild(jobCard);
    });
}

// Create a job card element
function createJobCard(job) {
    const card = document.createElement('div');
    card.className = 'job-card';
    
    // Format tags
    let tagsHtml = '';
    if (job.tags) {
        const tags = typeof job.tags === 'string' ? job.tags.split(',') : job.tags;
        tagsHtml = tags.map(tag => `<span class="job-tag">${tag.trim()}</span>`).join('');
    }
    
    // Format date
    const datePosted = job.date_posted ? new Date(job.date_posted).toLocaleDateString() : 'Recently';
    
    card.innerHTML = `
        <div class="job-card-header">
            <div>
                <h3>${job.title || 'Job Title'}</h3>
                <div class="company">
                    <i class="fas fa-building"></i>
                    <span>${job.company || 'Company Name'}</span>
                </div>
            </div>
            <span class="job-type ${job.type?.toLowerCase() || 'full-time'}">${job.type || 'Full-time'}</span>
        </div>
        <div class="job-card-body">
            <div class="location">
                <i class="fas fa-map-marker-alt"></i>
                <span>${job.location || 'Location'}</span>
            </div>
            <div class="description">
                ${job.description || 'Job description not available.'}
            </div>
            <div class="job-tags">
                ${tagsHtml}
            </div>
        </div>
        <div class="job-card-footer">
            <div class="salary">${job.salary || 'Salary not specified'}</div>
            <div class="text-sm text-gray-500">${datePosted}</div>
        </div>
    `;
    
    return card;
}

// Handle search
function handleSearch() {
    searchQuery = searchInput.value.trim();
    currentPage = 1;
    jobs = [];
    loadMoreButton.style.display = 'block';
    fetchJobs();
}

// Handle filter
function handleFilter(chip) {
    // Update active state
    filterChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    
    // Update current filter
    currentFilter = chip.textContent.trim();
    
    // Reset and fetch jobs
    currentPage = 1;
    jobs = [];
    loadMoreButton.style.display = 'block';
    
    // If filter is not "All Jobs", add it to search query
    if (currentFilter !== 'All Jobs') {
        searchQuery = currentFilter.toLowerCase();
    } else {
        searchQuery = '';
    }
    
    fetchJobs();
}

// Load more jobs
function loadMoreJobs() {
    currentPage++;
    fetchJobs();
}