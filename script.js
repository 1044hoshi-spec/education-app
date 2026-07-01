document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('appContainer');
    
    // Modal elements
    const btnContactBook = document.getElementById('btnContactBook');
    const submitModal = document.getElementById('submitModal');
    const closeModal = document.getElementById('closeModal');
    const appForm = document.getElementById('appForm');

    // Default built-in apps if none exist
    const defaultApps = [
        { id: 1, name: 'タイマー', url: 'timer.html', type: 'calculator', status: 'approved' },
        { id: 2, name: '算数ドリル', url: '#', type: 'notebook', status: 'approved' }
    ];

    // Initialize localStorage if empty
    if (!localStorage.getItem('schoolApps')) {
        localStorage.setItem('schoolApps', JSON.stringify(defaultApps));
    } else {
        // Migration: If they already have schoolApps, force update id:1 to the real timer app
        let allApps = JSON.parse(localStorage.getItem('schoolApps') || '[]');
        const oldTimerIndex = allApps.findIndex(a => a.id === 1);
        if (oldTimerIndex !== -1) {
            allApps[oldTimerIndex].name = 'タイマー';
            allApps[oldTimerIndex].url = 'timer.html';
            allApps[oldTimerIndex].type = 'calculator';
            localStorage.setItem('schoolApps', JSON.stringify(allApps));
        }
    }

    // Render approved apps
    function renderApps() {
        if(!appContainer) return; // Might be on admin page
        appContainer.innerHTML = '';
        const allApps = JSON.parse(localStorage.getItem('schoolApps') || '[]');
        const approvedApps = allApps.filter(app => app.status === 'approved');

        if (approvedApps.length === 0) {
            appContainer.innerHTML = '<div class="empty-state">アプリがまだ登録されていません。</div>';
            return;
        }

        approvedApps.forEach(app => {
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

            const newApp = {
                id: Date.now(),
                name: name,
                url: url,
                type: type,
                status: 'pending' // Needs approval
            };

            const allApps = JSON.parse(localStorage.getItem('schoolApps') || '[]');
            allApps.push(newApp);
            localStorage.setItem('schoolApps', JSON.stringify(allApps));

            alert('申請が完了しました。管理者の承認をお待ちください。');
            
            appForm.reset();
            submitModal.classList.remove('active');
            
            // Reset icon picker to first
            if (iconPickerContainer) {
                const firstIcon = iconPickerContainer.querySelector('.icon-option');
                if (firstIcon) firstIcon.click();
            }
        });
    }

    // Initial render
    renderApps();
});
