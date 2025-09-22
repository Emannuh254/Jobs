document.addEventListener('DOMContentLoaded', function() {
    // Load jobs on page load
    loadJobs();
    
    // Set up event listeners
    document.getElementById('load-more-jobs').addEventListener('click', loadMoreJobs);
    document.getElementById('chatbot-button').addEventListener('click', toggleChatbot);
    document.getElementById('chatbot-close').addEventListener('click', toggleChatbot);
    document.getElementById('chatbot-send').addEventListener('click', sendMessage);
    document.getElementById('chatbot-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
    
    // Filter chips functionality
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
        chip.addEventListener('click', function() {
            filterChips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            loadJobs(this.textContent);
        });
    });
});

let currentPage = 1;
let currentFilter = 'All Jobs';

function loadJobs(filter = 'All Jobs') {
    currentFilter = filter;
    currentPage = 1;
    
    // Show loading state
    const jobListings = document.getElementById('job-listings');
    jobListings.innerHTML = '<div class="col-span-full text-center py-8"><i class="fas fa-spinner fa-spin text-2xl text-indigo-600"></i></div>';
    
    // Simulate API call with timeout
    setTimeout(() => {
        // In a real app, this would be a fetch request to your backend
        // fetch(`/api/jobs?page=${currentPage}&filter=${encodeURIComponent(filter)}`)
        //   .then(response => response.json())
        //   .then(data => renderJobs(data))
        //   .catch(error => console.error('Error loading jobs:', error));
        
        // For demo purposes, we'll use mock data
        const mockJobs = generateMockJobs(filter);
        renderJobs(mockJobs);
    }, 800);
}

function loadMoreJobs() {
    currentPage++;
    
    // Show loading state
    const loadMoreBtn = document.getElementById('load-more-jobs');
    loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Loading...';
    loadMoreBtn.disabled = true;
    
    // Simulate API call with timeout
    setTimeout(() => {
        // In a real app, this would be a fetch request to your backend
        // fetch(`/api/jobs?page=${currentPage}&filter=${encodeURIComponent(currentFilter)}`)
        //   .then(response => response.json())
        //   .then(data => appendJobs(data))
        //   .catch(error => console.error('Error loading more jobs:', error));
        
        // For demo purposes, we'll use mock data
        const mockJobs = generateMockJobs(currentFilter, currentPage);
        appendJobs(mockJobs);
        
        loadMoreBtn.innerHTML = 'Load More Jobs';
        loadMoreBtn.disabled = false;
    }, 800);
}

function renderJobs(jobs) {
    const jobListings = document.getElementById('job-listings');
    jobListings.innerHTML = '';
    
    if (jobs.length === 0) {
        jobListings.innerHTML = '<div class="col-span-full text-center py-8 text-gray-500">No jobs found matching your criteria.</div>';
        return;
    }
    
    jobs.forEach(job => {
        jobListings.appendChild(createJobCard(job));
    });
}

function appendJobs(jobs) {
    const jobListings = document.getElementById('job-listings');
    
    jobs.forEach(job => {
        jobListings.appendChild(createJobCard(job));
    });
}

function createJobCard(job) {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.innerHTML = `
        <div class="job-card-header">
            <div class="job-logo">
                <img src="${job.companyLogo || 'https://via.placeholder.com/60'}" alt="${job.company}">
            </div>
            <div class="job-type ${job.type.toLowerCase().replace('-', '')}">${job.type}</div>
        </div>
        <div class="job-title">${job.title}</div>
        <div class="job-company">${job.company}</div>
        <div class="job-location">
            <i class="fas fa-map-marker-alt mr-1"></i> ${job.location}
        </div>
        <div class="job-description">${job.description}</div>
        <div class="job-tags">
            ${job.tags.map(tag => `<span class="job-tag">${tag}</span>`).join('')}
        </div>
        <div class="job-footer">
            <div class="job-salary">${job.salary}</div>
            <button class="btn-primary apply-btn" data-job-id="${job.id}">Apply Now</button>
        </div>
    `;
    
    // Add event listener to apply button
    card.querySelector('.apply-btn').addEventListener('click', function() {
        const jobId = this.getAttribute('data-job-id');
        // In a real app, this would redirect to an application page or open a modal
        alert(`Applying for job ID: ${jobId}`);
    });
    
    return card;
}

function generateMockJobs(filter = 'All Jobs', page = 1) {
    const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
    const locations = ['Nairobi, Kenya', 'Mombasa, Kenya', 'Kisumu, Kenya', 'Remote', 'Eldoret, Kenya'];
    const companies = ['Tech Innovations Ltd', 'Global Solutions Inc', 'Digital Dynamics', 'Future Systems', 'Creative Minds'];
    const titles = ['Frontend Developer', 'Backend Engineer', 'UI/UX Designer', 'Project Manager', 'Data Analyst', 'DevOps Engineer'];
    const tags = ['JavaScript', 'React', 'Node.js', 'Python', 'Design', 'Management', 'Remote', 'Entry Level'];
    
    const jobs = [];
    const jobsPerPage = 6;
    const startIndex = (page - 1) * jobsPerPage;
    
    for (let i = 0; i < jobsPerPage; i++) {
        const jobType = filter === 'All Jobs' 
            ? jobTypes[Math.floor(Math.random() * jobTypes.length)]
            : filter;
            
        const job = {
            id: startIndex + i + 1,
            title: titles[Math.floor(Math.random() * titles.length)],
            company: companies[Math.floor(Math.random() * companies.length)],
            location: locations[Math.floor(Math.random() * locations.length)],
            type: jobType,
            description: 'We are looking for a talented professional to join our team and help us build amazing products.',
            salary: 'KSh ' + (Math.floor(Math.random() * 200) + 50) + ',000 - ' + (Math.floor(Math.random() * 300) + 200) + ',000',
            tags: Array.from({length: Math.floor(Math.random() * 4) + 2}, () => tags[Math.floor(Math.random() * tags.length)]),
            companyLogo: `https://picsum.photos/seed/company${Math.floor(Math.random() * 100)}/60/60.jpg`
        };
        
        jobs.push(job);
    }
    
    return jobs;
}

// Chatbot functionality
function toggleChatbot() {
    const chatbotWindow = document.getElementById('chatbot-window');
    chatbotWindow.classList.toggle('active');
}

function sendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    
    if (message === '') return;
    
    // Add user message
    addMessage(message, 'sent');
    input.value = '';
    
    // Simulate bot response after delay
    setTimeout(() => {
        const responses = [
            "Thank you for your message. How can I assist you with your job search today?",
            "I'd be happy to help you find your dream job. Could you tell me more about what you're looking for?",
            "Our support team is here to help. Do you have questions about a specific job or application?",
            "I can help you with job recommendations, application tips, or general questions about our platform."
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        addMessage(response, 'received');
    }, 1000);
}

function addMessage(text, type) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div>
            <div class="message-bubble">${text}</div>
            <div class="message-time">${time}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}