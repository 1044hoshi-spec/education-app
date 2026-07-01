document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('appContainer');
    
    // Modal elements
    const btnContactBook = document.getElementById('btnContactBook');
    const submitModal = document.getElementById('submitModal');
    const closeModal = document.getElementById('closeModal');
    const appForm = document.getElementById('appForm');

    // Firestore initialization check for default apps
    // This runs once to ensure the default Timer app exists in the global database
    if (appContainer) {
        db.collection("apps").get().then((snapshot) => {
            if (snapshot.empty) {
                // Seed default app
                db.collection("apps").add({
                    name: 'タイマー',
                    url: 'timer.html',
                    type: 'calculator',
                    status: 'approved',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        });
    }

    // Render approved apps using Firestore realtime listener
    function setupAppListener() {
        if(!appContainer) return; // Might be on admin page
        
        db.collection("apps").where("status", "==", "approved")
          .onSnapshot((snapshot) => {
            appContainer.innerHTML = '';
            
            if (snapshot.empty) {
                appContainer.innerHTML = '<div class="empty-state">アプリがまだ登録されていません。</div>';
                return;
            }

            snapshot.forEach(doc => {
                const app = doc.data();
                const el = document.createElement('a');
                el.href = app.url;
                el.target = '_blank'; // Open in new tab
                el.className = 'app-card';
                
                const iconMap = {
                    notebook: '📓', calculator: '🧮', ruler: '📏', eraser: '🧽', pencil: '✏️', scissors: '✂️', microscope: '🔬', palette: '🎨', book: '📖',
                    dog: '🐶', cat: '🐱', fox: '🦊', bear: '🐻', panda: '🐼', lion: '🦁', frog: '🐸', penguin: '🐧', monkey: '🐵',
                    tree: '🌲', palm: '🌴', cactus: '🌵', tulip: '🌷', cherryblossom: '🌸', sunflower: '🌻', mushroom: '🍄',
                    apple: '🍎', banana: '🍌', strawberry: '🍓', pizza: '🍕', burger: '🍔', sushi: '🍣', onigiri: '🍙', cake: '🍰', donut: '🍩'
                };
                let icon = iconMap[app.type] || '📦';

                el.innerHTML = `
                    <div class="app-icon">${icon}</div>
                    <div class="app-info">
                        <h3>${app.name}</h3>
                        <p>カテゴリ: ${app.type}</p>
                    </div>
                `;
                appContainer.appendChild(el);
            });
        }, (error) => {
            console.error("Error fetching approved apps: ", error);
            appContainer.innerHTML = '<div class="empty-state" style="color:red;">データの読み込みに失敗しました。</div>';
        });
    }

    // Modal behavior
    if (btnContactBook) {
        btnContactBook.addEventListener('click', (e) => {
            e.preventDefault();
            submitModal.classList.add('active');
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            submitModal.classList.remove('active');
        });
    }

    // Close modal when clicking outside
    if (submitModal) {
        submitModal.addEventListener('click', (e) => {
            if(e.target === submitModal) {
                submitModal.classList.remove('active');
            }
        });
    }

    // Build Icon Picker
    const iconPickerContainer = document.getElementById('iconPickerContainer');
    const appTypeInput = document.getElementById('appType');
    if (iconPickerContainer && appTypeInput) {
        const iconMap = {
            notebook: '📓', calculator: '🧮', ruler: '📏', eraser: '🧽', pencil: '✏️', scissors: '✂️', microscope: '🔬', palette: '🎨', book: '📖',
            dog: '🐶', cat: '🐱', fox: '🦊', bear: '🐻', panda: '🐼', lion: '🦁', frog: '🐸', penguin: '🐧', monkey: '🐵',
            tree: '🌲', palm: '🌴', cactus: '🌵', tulip: '🌷', cherryblossom: '🌸', sunflower: '🌻', mushroom: '🍄',
            apple: '🍎', banana: '🍌', strawberry: '🍓', pizza: '🍕', burger: '🍔', sushi: '🍣', onigiri: '🍙', cake: '🍰', donut: '🍩'
        };

        let isFirst = true;
        for (const [key, emoji] of Object.entries(iconMap)) {
            const div = document.createElement('div');
            div.className = 'icon-option' + (isFirst ? ' selected' : '');
            div.textContent = emoji;
            div.title = key;
            
            if (isFirst) {
                appTypeInput.value = key;
                isFirst = false;
            }

            div.addEventListener('click', () => {
                document.querySelectorAll('.icon-option').forEach(el => el.classList.remove('selected'));
                div.classList.add('selected');
                appTypeInput.value = key;
            });

            iconPickerContainer.appendChild(div);
        }
    }

    // Form submission
    if (appForm) {
        appForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('appName').value;
            const url = document.getElementById('appUrl').value;
            const type = document.getElementById('appType').value;

            // Submit to Firestore
            db.collection("apps").add({
                name: name,
                url: url,
                type: type,
                status: 'pending', // Needs approval
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                alert('申請が完了しました。管理者の承認をお待ちください。');
                appForm.reset();
                submitModal.classList.remove('active');
                
                // Reset icon picker to first
                if (iconPickerContainer) {
                    const firstIcon = iconPickerContainer.querySelector('.icon-option');
                    if (firstIcon) firstIcon.click();
                }
            }).catch((error) => {
                console.error("Error adding document: ", error);
                alert("送信エラーが発生しました。");
            });
        });
    }

    // Initialize listener
    setupAppListener();
});
