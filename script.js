const API_BASE_URL = 'http://localhost:8080/posts';
const postsContainer = document.getElementById('posts-container');
const newPostForm = document.getElementById('new-post-form');
const messageElement = document.getElementById('message');

/**
 * 投稿一覧を取得し、HTMLとして表示する
 */
async function fetchAndRenderPosts() {
    postsContainer.innerHTML = '<p>投稿を読み込み中...</p>'; // ローディング表示

    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const posts = await response.json();
        
        // HTML生成
        postsContainer.innerHTML = '';
        if (posts.length === 0) {
            postsContainer.innerHTML = '<p>まだ投稿はありません。</p>';
            return;
        }

        posts.forEach(post => {
            const listItem = document.createElement('li');
            listItem.className = 'post-item';
            listItem.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <small>ID: ${post.id}</small>
            `;
            postsContainer.appendChild(listItem);
        });

    } catch (error) {
        postsContainer.innerHTML = `<p style="color: red;">投稿の読み込みに失敗しました: ${error.message}</p>`;
        console.error("Error fetching posts:", error);
    }
}

/**
 * 新しい投稿を作成し、APIに送信する
 */
async function handleFormSubmit(event) {
    event.preventDefault(); // ページの再読み込みを防ぐ

    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content })
        });

        if (response.status === 201) {
            // 成功メッセージを表示
            showMessage('投稿が完了しました！', 'success');
            // フォームをクリア
            newPostForm.reset();
            // 投稿一覧を再読み込み
            fetchAndRenderPosts();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || '投稿に失敗しました。');
        }

    } catch (error) {
        showMessage(`エラー: ${error.message}`, 'error');
        console.error("Error creating post:", error);
    }
}

/**
 * ユーザーにメッセージを表示する
 */
function showMessage(text, type) {
    messageElement.textContent = text;
    messageElement.className = type;
    messageElement.classList.remove('hidden');
    setTimeout(() => {
        messageElement.classList.add('hidden');
    }, 5000);
}

// イベントリスナーの追加
newPostForm.addEventListener('submit', handleFormSubmit);

// ページの読み込み時に投稿一覧をフェッチ
document.addEventListener('DOMContentLoaded', fetchAndRenderPosts);