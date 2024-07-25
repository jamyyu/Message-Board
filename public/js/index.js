let lastFetchedPostId = null; // 記錄最後已獲取留言的ID
let displayedPostIds = new Set(); // 記錄已顯示的留言ID

document.addEventListener('DOMContentLoaded', async function() {
  const uploadForm = document.getElementById('uploadForm');
  const imageUpload = document.getElementById('imageUpload');
  const textContent = document.getElementById('textContent');

  // 初始化時獲取舊留言
  await fetchPosts();

  // 當表單提交時，上傳文件
  uploadForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    if (!textContent.value.trim() && imageUpload.files.length === 0) {
      alert('並未上傳文字或圖片');
      return;
    }
    
    const formData = new FormData();
    const text = textContent.value || null;
    const image = imageUpload.files[0] || null;
    formData.append('text', text);
    formData.append('image', image);
    //console.log(formData);

    textContent.value = "";
    imageUpload.value = "";

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('上傳失敗');
      }
      
      const data = await response.json();
      //alert('文件上傳成功!');
      await fetchNewPosts();
    } catch (error) {
      console.error('Error:', error);
    }
  });
});

async function fetchPosts() {
  try {
    const response = await fetch('/api/posts');
    if (!response.ok) {
      throw new Error('獲取留言失敗');
    }

    const result = await response.json();
    const posts = result.data;
    console.log(posts);

    // 清空留言
    //const container = document.querySelector('.board');
    //container.innerHTML = '';

    posts.forEach(post => {
      const { id, message, image_name, created_at, image_url} = post;
      renderCard(message, image_url);
      displayedPostIds.add(post.id);
    });
    
    //更新留言ID
    lastFetchedPostId = posts.length ? posts[0].id : null;
    console.log(lastFetchedPostId);

  } catch (error) {
    console.error('Error:', error);
  }
}


function renderCard(text, imageUrl) {
  const container = document.querySelector('.board')

  const cardContainer = document.createElement('div');
  cardContainer.classList.add('card-container');

  const card = document.createElement('div');
  card.classList.add('card');

  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = 'img';

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h5');
  cardTitle.classList.add('card-title');
  cardTitle.textContent = text;

  card.appendChild(img);
  cardBody.appendChild(cardTitle);
  card.appendChild(cardBody);
  cardContainer.appendChild(card);
  container.appendChild(cardContainer);
}

async function fetchNewPosts() {
  try {
    const response = await fetch('/api/posts');
    if (!response.ok) {
      throw new Error('獲取留言失敗');
    }

    const result = await response.json();
    const posts = result.data;
    console.log(posts);
    console.log(displayedPostIds);

    posts.forEach(post => {
      const { id, message, image_name, created_at, image_url} = post;
      if (!displayedPostIds.has(id)) {
        console.log(message, image_url);
        renderNewCard(message, image_url);
        displayedPostIds.add(id); // 添加新顯示的留言ID
      }
    });

    //更新留言ID
    lastFetchedPostId = posts.length ? posts[0].id : null;
    console.log(lastFetchedPostId);
    console.log(displayedPostIds);

  } catch (error) {
    console.error('Error:', error);
  }
}


function renderNewCard(text, imageUrl) {
  const container = document.querySelector('.board')

  const cardContainer = document.createElement('div');
  cardContainer.classList.add('card-container');

  const card = document.createElement('div');
  card.classList.add('card');

  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = 'img';

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h5');
  cardTitle.classList.add('card-title');
  cardTitle.textContent = text;

  card.appendChild(img);
  cardBody.appendChild(cardTitle);
  card.appendChild(cardBody);
  cardContainer.appendChild(card);
  container.appendChild(cardContainer);

  // 新的插入第一個
  if (container.firstChild) {
    container.insertBefore(cardContainer, container.firstChild);
  } else {
    container.appendChild(cardContainer);
  }
  console.log('Card rendered:', { text, imageUrl });
}