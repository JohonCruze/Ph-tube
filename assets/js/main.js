// Loader Animation

const showLoader = () => {
    document.getElementById('loader').classList.remove('hidden')
    document.getElementById('video-container').classList.add('hidden')
}
const hideLoader = () => {
    document.getElementById('loader').classList.add('hidden')
    document.getElementById('video-container').classList.remove('hidden')
}

// Remove active class

function removeActiveClass() {
    const activeBtns = document.getElementsByClassName('active')
    for (let btn of activeBtns) {
        btn.classList.remove('active')
    }
}

// Load Categories

function loadCategories() {

    // Fetch Data
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
        // Convert Promise to Json
        .then(res => res.json())
        // Send Data to Display Category
        .then(data => displayCategories(data.categories))
}

// Load Videos
function loadVideos(searchText = '') {
    showLoader()
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
        // Convert Promise to Json
        .then(response => response.json())
        // Send Data to Display Category
        .then(data => {
            document.getElementById('btn-all').classList.add('active')
            displayVideos(data.videos)
        })
}

// Load Category Videos

// const loadCategoryVideos = (id) => {

//     const url = `https://openapi.programming-hero.com/api/phero-tube/category/${id}`
//     fetch(url)

//         .then(res => res.json())
//         .then(data => {
//             removeActiveClass()
//             const clickedBtn = document.getElementById(`btn-${id}`)
//             clickedBtn.classList.add('active')
//             displayVideos(data.category)
//         })
// }
const loadCategoryVideos = (id) => {
    showLoader()
    const url = `https://openapi.programming-hero.com/api/phero-tube/category/${id}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            removeActiveClass();
            // Handle both cases:
            // 1. For "All" button (id might be undefined or 'all')
            // 2. For category buttons (numeric ids)
            const buttonId = id ? `btn-${id}` : 'btn-all';
            const clickedBtn = document.getElementById(buttonId);
            if (!clickedBtn) {
                return;
            }
            clickedBtn.classList.add('active');
            displayVideos(data.category || data.videos); // Handle both cases
        })

}

function displayCategories(categories) {
    // Get the Container
    const categoryContainer = document.getElementById('category-container')

    // Loop Operation of array object
    for (let cat of categories) {
        // Create Element
        const categoryDiv = document.createElement('div')
        categoryDiv.innerHTML = `
            <button id="btn-${cat.category_id}" onclick="loadCategoryVideos(${cat.category_id})" class="btn btn-sm hover:bg-[#FF1F3D] hover:text-[#ffffff] px-5 py-2 rounded-lg cursor-pointer">${cat.category}</button>
        `
        // Append Element
        categoryContainer.append(categoryDiv)
    }
}

const loadVideoDetails = (videoId) => {

    const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`
    fetch(url)
        .then((res) => res.json())
        .then((data) => displayVideoDetails(data.video))
}
const displayVideoDetails = (video) => {
    console.log(video);
    document.getElementById('video_details').showModal()
    const detailsContainer = document.getElementById('details-container')
    detailsContainer.innerHTML = `
        <div class="card bg-base-100 image-full w-full shadow-sm">
  <figure>
    <img
      src="${video.thumbnail}" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">${video.title}</h2>
    <p class="card-title">${video.authors[0].profile_name}</p>
    <p>${video.description}</p>
  </div>
</div>
    `

}
const displayVideos = (videos) => {
    // Get The Container
    const videoContainer = document.getElementById('video-container')
    videoContainer.innerHTML = ''
    if (videos.length == 0) {
        videoContainer.innerHTML = `
            <div class="flex flex-col col-span-full justify-center items-center mx-auto space-y-5 py-30">
                <img src="./assets/images/Icon.png" alt="">
                <h2 class="text-4xl font-bold text-center">Oops!! Sorry, There is no <br> content here</h2>
            </div>
        `
        hideLoader()
        return;
    }
    // Loop Operation of array object
    videos.forEach((video) => {
        // create element
        const videoDiv = document.createElement('div')
        videoDiv.innerHTML = `
            <div class="bg-base-100 w-full shadow-sm">
                <figure class="relative">
                    <img class="rounded w-full h-[230px] object-cover" src="${video.thumbnail}" alt="Shoes" />
                    <span class="bg-[#171717] text-[#ffffff] p-1 rounded absolute bottom-2 right-2 text-sm">3hrs 56 min ago</span>
                </figure>
                <div class="py-5 flex gap-5">
                    <div class="avatar w-8 h-8">
                        <div class="ring-primary ring-offset-base-100 w-8 rounded-full ring-offset-2">
                            <img src="${video.authors[0].profile_picture}" />
                        </div>
                    </div>
                    <div class="card-content space-y-2">
                        <h2 class="text-base font-bold">${video.title}</h2>
                        <p class="text-[#5c5c5c] text-sm flex gap-1">${video.authors[0].profile_name}  
                        ${video.authors[0].verified == true ? `<img class="w-5 h-5" src="https://img.icons8.com/?size=48&id=98A4yZTt9abw&format=png" alt="">` : ``}
                        </p>
                        <p class="text-[#5c5c5c] text-sm">${video.others.views} views</p>
                    </div>
                </div>
                <button onclick="loadVideoDetails('${video.video_id}')" class="btn btn-block bg-[#ffffff]">Show Details</button>
            </div>
        `
        videoContainer.append(videoDiv)
        hideLoader()
    });

}
document.getElementById('search-input').addEventListener('keyup', (e) => {
    const input = e.target.value;
    loadVideos(input)
})

loadCategories()
// loadVideos()
// loadCategoryVideos()



