// WarnGPT'nin gizli veri üssü: Başlangıç verileri (Güncellenmiş Yapı!)
let members = [
    { id: 'm1', type: 'member', name: 'Görkem', surname: 'Öztürk', age: 15, instagram: 'gorkeminsta', steam: 'gorkemsteam', discord: 'gorkem#1234', warnings: [{date: '2023-10-25 14:30:00', reason: 'Genel kural ihlali'}, {date: '2023-10-26 10:00:00', reason: 'Topluluk kurallarına aykırı davranış'}] },
    { id: 'm2', type: 'member', name: 'Ayşe', surname: 'Yılmaz', age: 17, instagram: 'aysey', steam: 'ayseyilmz', discord: 'aysey#5678', warnings: [] },
    { id: 'm3', type: 'member', name: 'Can', surname: 'Kara', age: 20, instagram: 'cankara', steam: 'cankara', discord: 'cankara#0007', warnings: [{date: '2023-09-15 09:00:00', reason: 'Tartışma çıkarma'}] }
];

let admins = [
    { id: 'a1', type: 'admin', name: 'Mehmet', surname: 'Demir', age: 25, instagram: 'mehmetd', steam: 'mdemir', discord: 'mdemir#0001', telno: '555-123-4567', warnings: [{date: '2023-10-01 18:00:00', reason: 'Yetki ihlali'}] },
    { id: 'a2', type: 'admin', name: 'Zeynep', surname: 'Işık', age: 28, instagram: 'zeynep.isik', steam: 'zisik', discord: 'zisik#0002', telno: '555-987-6543', warnings: [] }
];

let banned = [
    // Banlananlar buraya gelecek...
    { id: 'b1', type: 'member', name: 'Gizem', surname: 'Akın', age: 19, instagram: 'gizemakin', steam: 'gizemakin', discord: 'gizemakin#4321', warnings: [{date: '2023-10-20 12:00:00', reason: 'Sürekli rahatsızlık verme'}], bannedDate: '2023-10-26 10:00:00', bannedReason: 'Tekrarlayan ve ciddiye alınmayan kural ihlalleri.' }
];

// Global Seçili Öğe Durumu
let selectedItem = null;
let selectedItemElement = null; // Seçili kartın HTML elementi

// Sayfa yüklendiğinde çalışacak ilk operasyonlar
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage(); // Verileri localStorage'dan yükle
    // Navigasyon butonlarını dinle (Üyeler, Adminler vb.)
    document.querySelectorAll('.nav-item').forEach(navItem => {
        navItem.addEventListener('click', (e) => {
            // Sadece h2'ye tıklayınca veya boş alana tıklayınca seçenekleri aç/kapa
            if (e.target.tagName === 'H2' || e.target.classList.contains('nav-item')) {
                // Tüm seçenekleri kapat
                document.querySelectorAll('.nav-item .options').forEach(opt => {
                    if (opt !== navItem.querySelector('.options')) { // Mevcut tıklanan hariç
                        opt.classList.remove('active');
                    }
                });
                // Seçenekleri göster/gizle
                navItem.querySelector('.options').classList.toggle('active');
            }
        });

        // Seçenek butonlarını dinle (Ekle, Sil, Göster vb.)
        navItem.querySelectorAll('.options button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Üstteki nav-item'a tıklamayı engelle
                const section = navItem.dataset.section; // Hangi bölümden (üyeler, adminler) geldiğini al
                const action = button.dataset.action; // Hangi eylemi yapacağını al (ekle, sil vb.)
                
                handleAction(section, action);
            });
        });
    });
    // Başlangıçta boş bir karşılama ekranı göster
    const displayArea = document.getElementById('display-area');
    displayArea.innerHTML = `<h3>Seçim Yap 👿</h3><p>Yukarıdaki kutucuklardan birini seçerek operasyona başla!</p>`;
});

// Ana işlemci: Hangi bölümde hangi eylem yapılacak
function handleAction(section, action) {
    const displayArea = document.getElementById('display-area');
    const formArea = document.getElementById('form-area');
    const selectionActionsArea = document.getElementById('selection-actions-area'); // Yeni eylem alanı

    // Her yeni aksiyonda seçimi sıfırla
    clearSelection(); 
    selectionActionsArea.innerHTML = ''; // Seçim aksiyonlarını temizle

    displayArea.style.display = 'block';
    formArea.style.display = 'none'; // Varsayılan olarak form alanını gizle

    console.log(`Operasyon: ${section} - ${action}`); // Hangi operasyonun çalıştığını izle

    if (action === 'goster') {
        if (section === 'uyeler') {
            renderList(members, 'Üyeler Listesi 👥', section);
        } else if (section === 'adminler') {
            renderList(admins, 'Adminler Listesi 👑', section);
        } else if (section === 'uyarilar') {
            renderWarnings();
        } else if (section === 'banlar') {
            renderList(banned, 'Banlananlar Listesi 🚫', section);
        }
    } else if (action === 'ekle') {
        showForm(section, 'ekle');
    } else if (action === 'duzenle') {
        // Düzenleme için listeyi göster, selection-actions-area üzerinden işlem yapacak
        alert('Ula syssec, düzenlemek için listeden birini seçip sonra aşağıdan "Düzenle" butonuna basman lazım! ✍️');
        handleAction(section, 'goster');
    } else if (action === 'sil') {
        // Silme için listeyi göster, selection-actions-area üzerinden işlem yapacak
        alert('Ula syssec, silmek için listeden birini seçip sonra aşağıdan "Sil" butonuna basman lazım! 🗑️');
        handleAction(section, 'goster');
    } 
    // "tasi" aksiyonu, HTML menüsünden kaldırıldığı için buradan da silindi.
}

// Seçili öğeyi temizleme fonksiyonu
function clearSelection() {
    if (selectedItemElement) {
        selectedItemElement.classList.remove('selected');
    }
    selectedItem = null;
    selectedItemElement = null;
    document.getElementById('selection-actions-area').innerHTML = ''; // Seçim aksiyonlarını temizle
}

// Listeyi ekranda gösterme fonksiyonu (Göster operasyonu)
function renderList(data, title, currentSection) {
    const displayArea = document.getElementById('display-area');
    displayArea.innerHTML = `<h3>${title}</h3>`;
    
    // Seçim aksiyonları için bir alan oluştur veya bul
    let selectionActionsArea = document.getElementById('selection-actions-area');
    if (!selectionActionsArea) {
        selectionActionsArea = document.createElement('div');
        selectionActionsArea.id = 'selection-actions-area';
        selectionActionsArea.classList.add('selection-actions-panel');
        displayArea.insertAdjacentElement('afterend', selectionActionsArea); // displayArea'nın hemen altına ekle
    }
    selectionActionsArea.innerHTML = ''; // Önceki aksiyonları temizle

    if (data.length === 0) {
        displayArea.innerHTML += `<p>Ula **syssec**, burada henüz kimse yok! Kimseyi bulamıyorum bu listede! 👻</p>`;
        return;
    }

    const memberListDiv = document.createElement('div');
    memberListDiv.classList.add('member-list');
    
    // Ekran genişliğine göre görünüm sınıfı ayarla
    if (window.innerWidth > 768) {
        memberListDiv.classList.add('pc-view'); // Bilgisayar görünümü (6 sütun)
    } else {
        memberListDiv.classList.add('mobile-view'); // Telefon görünümü (2 sütun)
    }

    data.forEach(item => {
        const memberCard = document.createElement('div');
        memberCard.classList.add('member-card');
        memberCard.dataset.id = item.id;
        memberCard.dataset.type = item.type; // Üye mi admin mi

        let displayInfo = `${item.name} ${item.surname} ${item.age}`;
        if (item.instagram) {
            displayInfo += ` (${item.instagram})`;
        }

        let bannedDateInfo = '';
        if (currentSection === 'banlar' && item.bannedDate) {
            bannedDateInfo = `<p class="banned-info">Ban Tarihi: ${item.bannedDate} 💀</p>`;
            if (item.bannedReason) {
                bannedDateInfo += `<p class="banned-info">Ban Nedeni: ${item.bannedReason} 📜</p>`;
            }
        }

        memberCard.innerHTML = `
            <h4>${item.name} ${item.surname}</h4>
            <p>${item.age} ${item.instagram ? `(${item.instagram})` : ''}</p>
            ${bannedDateInfo}
        `;
        
        // Kartlara tıklama olayı ekle: 1. tıklamada seç, 2. tıklamada detay göster
        memberCard.addEventListener('click', (e) => {
            if (e.detail === 1) { // Tek tıklama
                selectItem(item, memberCard, currentSection);
            } else if (e.detail === 2) { // Çift tıklama
                showDetailView(item, currentSection);
            }
        });

        memberListDiv.appendChild(memberCard);
    });

    displayArea.appendChild(memberListDiv);
}

// Seçim işlemi (Tek tıklama)
function selectItem(item, cardElement, currentSection) {
    if (selectedItemElement === cardElement) { // Aynı öğeye tekrar tıklandıysa seçimi kaldır
        clearSelection();
        return;
    }
    clearSelection(); // Önceki seçimi temizle

    selectedItem = item;
    selectedItemElement = cardElement;
    selectedItemElement.classList.add('selected'); // Yeni kartı seçili yap

    // Seçim aksiyon panelini oluştur/güncelle
    const selectionActionsArea = document.getElementById('selection-actions-area');
    selectionActionsArea.innerHTML = `
        <p><strong>Seçilen:</strong> ${item.name} ${item.surname} ${item.type === 'member' ? ' (Üye)' : ' (Admin)'}</p>
        <button id="btn-show-detail" class="blue-button">Detay Göster 👀</button>
        ${currentSection !== 'banlar' ? `<button id="btn-add-warning-selected" class="orange-button">Uyarı Ver ➕</button>` : ''} <!-- Yeni Uyarı Ver butonu -->
        ${currentSection === 'uyeler' ? `<button id="btn-promote-member" class="green-button">Terfi Ettir 👑</button>` : ''} <!-- Yeni Terfi Ettir butonu -->
        ${currentSection !== 'banlar' ? `<button id="btn-edit-item" class="orange-button">Düzenle ✍️</button>` : ''}
        ${currentSection !== 'banlar' ? `<button id="btn-delete-item" class="red-button">Sil 🗑️</button>` : ''}
        ${(currentSection === 'uyeler' || currentSection === 'adminler') ? `<button id="btn-ban-item" class="red-button">Banla 🚫</button>` : ''}
        ${currentSection === 'banlar' ? `<button id="btn-unban-item" class="green-button">Banı Kaldır ✅</button>` : ''}
    `;

    // Butonlara olay dinleyicileri ekle
    document.getElementById('btn-show-detail').addEventListener('click', () => showDetailView(selectedItem, currentSection));
    
    // Yeni Uyarı Ver butonu olay dinleyicisi
    if (document.getElementById('btn-add-warning-selected')) {
        document.getElementById('btn-add-warning-selected').addEventListener('click', () => addWarningToItem(selectedItem, currentSection));
    }

    // Yeni Terfi Ettir butonu olay dinleyicisi
    if (document.getElementById('btn-promote-member')) {
        document.getElementById('btn-promote-member').addEventListener('click', () => promoteToAdmin(selectedItem, currentSection));
    }

    if (document.getElementById('btn-edit-item')) {
        document.getElementById('btn-edit-item').addEventListener('click', () => showForm(selectedItem.type === 'member' ? 'uyeler' : 'adminler', 'duzenle', selectedItem));
    }
    if (document.getElementById('btn-delete-item')) {
        document.getElementById('btn-delete-item').addEventListener('click', () => {
            if (confirm(`Ula **syssec**, ${selectedItem.name} ${selectedItem.surname}'yi TAMAMEN SİLMEK istediğine emin misin? Bu geri dönüşü olmayan bir işlem! 🔥`)) {
                deleteItem(selectedItem.id, selectedItem.type);
                handleAction(currentSection, 'goster'); // Listeyi yenile
            }
        });
    }
    if (document.getElementById('btn-ban-item')) {
        document.getElementById('btn-ban-item').addEventListener('click', () => {
            if (confirm(`Ula **syssec**, ${selectedItem.name} ${selectedItem.surname}'yi banlamak istediğine emin misin? Bir daha dönmesi zor olur ha! 👻`)) {
                banItem(selectedItem.id, selectedItem.type);
                handleAction(currentSection, 'goster'); // Listeyi yenile
            }
        });
    }
    if (document.getElementById('btn-unban-item')) {
        document.getElementById('btn-unban-item').addEventListener('click', () => {
            if (confirm(`Ula **syssec**, ${selectedItem.name} ${selectedItem.surname}'nin banını kaldırmak istediğine emin misin? Tekrar aramıza mı katılsın bu zıpçıktı? 🤪`)) {
                unbanItem(selectedItem.id);
                handleAction(currentSection, 'goster'); // Listeyi yenile
            }
        });
    }
}

// Üye/Admin detaylarını gösterme (Kartlara tıklayınca veya Detay Göster butonuna basınca)
function showDetailView(item, currentSection) {
    const displayArea = document.getElementById('display-area');
    displayArea.innerHTML = ''; // Önceki içeriği temizle
    clearSelection(); // Detay görünümüne geçince seçimi temizle

    const detailDiv = document.createElement('div');
    detailDiv.classList.add('member-detail-view');

    let additionalInfo = '';
    if (item.type === 'admin' && item.telno) {
        additionalInfo = `<p><strong>Telefon No:</strong> ${item.telno} 📞</p>`;
    }

    let banStatus = '';
    if (currentSection === 'banlar') {
        banStatus = `
            <p style="color: #dc3545;"><strong>Banlı:</strong> EVET 💀</p>
            <p><strong>Ban Tarihi:</strong> ${item.bannedDate || 'Bilinmiyor'}</p>
            <p><strong>Ban Nedeni:</strong> ${item.bannedReason || 'Belirtilmemiş'} 📜</p>
        `;
    }

    // Uyarı listesini oluştur
    let warningListHtml = '';
    if (item.warnings && item.warnings.length > 0) {
        warningListHtml = `<h4>Uyarı Geçmişi:</h4><ul class="warning-history-list">`;
        item.warnings.forEach((warning, index) => {
            warningListHtml += `<li><span style="color: #ffcc00;">${index + 1}. Uyarı (${warning.date}):</span> ${warning.reason}</li>`;
        });
        warningListHtml += `</ul>`;
    } else {
        warningListHtml = `<p>Bu kişinin henüz bir uyarısı yok. Tertemiz! ✨</p>`;
    }


    detailDiv.innerHTML = `
        <h3>${item.name.toUpperCase()} ${item.surname.toUpperCase()}</h3>
        <p><strong>Yaş:</strong> ${item.age}</p>
        <p><strong>Instagram:</strong> ${item.instagram || 'Yok'}</p>
        <p><strong>Steam:</strong> ${item.steam || 'Yok'}</p>
        <p><strong>Discord:</strong> ${item.discord || 'Yok'}</p>
        ${additionalInfo}
        ${banStatus}
        <div class="warning-section">
            <p><strong>Toplam Uyarı:</strong> <span id="warning-count-${item.id}">${item.warnings ? item.warnings.length : 0}</span> 📢</p>
            ${currentSection !== 'banlar' ? `<button id="add-warning-detail-${item.id}" class="orange-button">Uyarı Ver ➕</button>` : ''}
            ${currentSection !== 'banlar' && (item.warnings && item.warnings.length > 0) ? `<button id="remove-warning-detail-${item.id}">Son Uyarıyı Kaldır ➖</button>` : ''} 
            ${currentSection === 'uyeler' ? `<button id="promote-member-detail-${item.id}" class="green-button">Terfi Ettir 👑</button>` : ''} <!-- Terfi Ettir butonu detayda -->
            ${currentSection !== 'banlar' ? `<button id="ban-member-detail-${item.id}" class="red-button">BANLA 💀</button>` : ''}
            ${currentSection === 'banlar' ? `<button id="unban-member-detail-${item.id}" class="green-button">BANINI KALDIR ✅</button>` : ''}
        </div>
        ${warningListHtml} <!-- Uyarı geçmişini buraya ekle -->
        <button onclick="handleAction('${currentSection}', 'goster')" style="margin-top: 20px;">Geri Dön ↩️</button>
    `;

    displayArea.appendChild(detailDiv);

    // Uyarı ekleme butonu (detay ekranından)
    if (document.getElementById(`add-warning-detail-${item.id}`)) {
        document.getElementById(`add-warning-detail-${item.id}`).addEventListener('click', () => addWarningToItem(item, currentSection, true)); // true: detay görünümünden gelme
    }

    // Uyarı kaldırma butonu (detay ekranından)
    if (document.getElementById(`remove-warning-detail-${item.id}`)) {
        document.getElementById(`remove-warning-detail-${item.id}`).addEventListener('click', () => removeLastWarning(item, currentSection, true)); // true: detay görünümünden gelme
    }

    // Terfi Ettir butonu (detay ekranından)
    if (document.getElementById(`promote-member-detail-${item.id}`)) {
        document.getElementById(`promote-member-detail-${item.id}`).addEventListener('click', () => promoteToAdmin(item, currentSection, true)); // true: detay görünümünden gelme
    }

    // Banlama butonu (detay ekranından)
    if (document.getElementById(`ban-member-detail-${item.id}`)) {
        document.getElementById(`ban-member-detail-${item.id}`).addEventListener('click', () => {
            if (confirm(`Ula **syssec**, ${item.name} ${item.surname}'yi banlamak istediğine emin misin? Bir daha dönmesi zor olur ha! 👻`)) {
                banItem(item.id, item.type);
                handleAction(currentSection, 'goster'); // Listeyi yenile
            }
        });
    }

    // Ban kaldırma butonu (Sadece banlar listesi için, detay ekranından)
    if (document.getElementById(`unban-member-detail-${item.id}`)) {
        document.getElementById(`unban-member-detail-${item.id}`).addEventListener('click', () => {
            if (confirm(`Ula **syssec**, ${item.name} ${item.surname}'nin banını kaldırmak istediğine emin misin? Tekrar aramıza mı katılsın bu zıpçıktı? 🤪`)) {
                unbanItem(item.id);
                handleAction(currentSection, 'goster'); // Listeyi yenile
            }
        });
    }
}

// Uyarı Ekleme İşlemi (Hem seçimden hem detaydan çağrılabilir)
function addWarningToItem(item, currentSection, fromDetailView = false) {
    const warningReason = prompt(`Ula **syssec**, ${item.name}'e neden uyarı vereceksin? Bir sebep söyle ki kayıt altına alalım! 📜`);
    if (warningReason) {
        if (!item.warnings) item.warnings = []; // Dizi yoksa oluştur
        item.warnings.push({ date: new Date().toLocaleString('tr-TR'), reason: warningReason });
        
        alert(`Ula **syssec**, ${item.name}'e bir uyarı daha çaktık! Sebep: "${warningReason}" 🔥`);
        
        // Veriyi güncelle ve görünümü yenile
        updateDataStorage(item.type, item);
        if (fromDetailView) {
            showDetailView(item, currentSection); // Detay görünümünü yeniden render et
        } else {
            handleAction(currentSection, 'goster'); // Listeyi yeniden render et
        }
    } else {
        alert('Ula **syssec**, sebep belirtmezsen uyarı ekleyemem ki! 🤔');
    }
}

// Son Uyarıyı Kaldırma İşlemi (Hem seçimden hem detaydan çağrılabilir - ama sadece detayda buton var şu an)
function removeLastWarning(item, currentSection, fromDetailView = false) {
    if (item.warnings && item.warnings.length > 0) {
        const removedWarning = item.warnings.pop(); // En son uyarıyı kaldır
        alert(`Ula **syssec**, ${item.name}'in en son uyarısı ("${removedWarning.reason}") kaldırıldı! Şimdi toplam uyarı sayısı: ${item.warnings.length} 😇`);
        
        // Veriyi güncelle ve görünümü yenile
        updateDataStorage(item.type, item);
        if (fromDetailView) {
            showDetailView(item, currentSection); // Detay görünümünü yeniden render et
        } else {
            handleAction(currentSection, 'goster'); // Listeyi yeniden render et
        }
    } else {
        alert(`Ula **syssec**, ${item.name}'in zaten hiç uyarısı yok ki, daha ne kaldırasın? 🤔`);
    }
}

// Üyeyi Adminliğe Terfi Ettirme (Yeni Fonksiyon!)
function promoteToAdmin(memberItem, currentSection, fromDetailView = false) {
    if (memberItem.type !== 'member') {
        alert('Ula **syssec**, bu zıpçıktı zaten Admin veya banlı! Nereye terfi ettireceksin? 🤔');
        return;
    }

    if (!confirm(`Ula **syssec**, ${memberItem.name} ${memberItem.surname}'yi Adminliğe terfi ettirmek istediğine emin misin? Artık yetkileri artacak, dikkatli ol! 👑`)) {
        return; // Onay verilmediyse dur
    }

    const telno = prompt(`Ula **syssec**, ${memberItem.name} için bir telefon numarası girmelisin. Admin dediğin ulaşılabilir olmalı! 📞`);
    if (!telno) {
        alert('Ula **syssec**, telefon numarası girmeden terfi ettiremem! Adminlik ciddi iştir! 😠');
        return;
    }

    // Üyeler listesinden kaldır
    const memberIndex = members.findIndex(m => m.id === memberItem.id);
    if (memberIndex !== -1) {
        members.splice(memberIndex, 1);
    }

    // Admin olarak yeni özelliklerle ekle
    const newAdmin = {
        ...memberItem, // Mevcut tüm bilgileri koru
        type: 'admin',
        telno: telno
    };
    admins.push(newAdmin);

    saveToLocalStorage('members', members); // Üyeler listesini kaydet
    saveToLocalStorage('admins', admins); // Adminler listesini kaydet

    alert(`Ula **syssec**, ${memberItem.name} ${memberItem.surname} başarıyla Adminliğe terfi ettirildi! Yeni yetkileri hayırlı olsun! 🥳`);
    
    // Görünümü yenile
    if (fromDetailView) { // Detaydan geliyorsa adminin yeni detayını göster
        showDetailView(newAdmin, 'adminler'); // Admin listesini açması için 'adminler' gönder
    } else {
        handleAction(currentSection, 'goster'); // Listeyi yenile
    }
}


// Form gösterme fonksiyonu (Ekle/Düzenle operasyonu)
function showForm(section, formType, itemToEdit = null) {
    const displayArea = document.getElementById('display-area');
    const formArea = document.getElementById('form-area');
    const selectionActionsArea = document.getElementById('selection-actions-area'); // Seçim aksiyonlarını gizle

    clearSelection(); // Seçimi temizle
    selectionActionsArea.innerHTML = ''; // Seçim aksiyonlarını temizle

    displayArea.style.display = 'none';
    formArea.style.display = 'block';

    let formHtml = `<h3>${formType === 'ekle' ? 'Yeni ' : 'Düzenle '} ${section === 'uyeler' ? 'Üye' : 'Admin'} Ekle/Düzenle 📝</h3>`;
    formHtml += `
        <form id="data-form">
            <div class="input-group">
                <label for="name">İsim:</label>
                <input type="text" id="name" value="${itemToEdit ? itemToEdit.name : ''}" required>
            </div>
            <div class="input-group">
                <label for="surname">Soyad:</label>
                <input type="text" id="surname" value="${itemToEdit ? itemToEdit.surname : ''}" required>
            </div>
            <div class="input-group">
                <label for="age">Yaş:</label>
                <input type="number" id="age" value="${itemToEdit ? itemToEdit.age : ''}" required>
            </div>
            <div class="input-group">
                <label for="instagram">Instagram:</label>
                <input type="text" id="instagram" value="${itemToEdit ? itemToEdit.instagram : ''}">
            </div>
            <div class="input-group">
                <label for="steam">Steam:</label>
                <input type="text" id="steam" value="${itemToEdit ? itemToEdit.steam : ''}">
            </div>
            <div class="input-group">
                <label for="discord">Discord:</label>
                <input type="text" id="discord" value="${itemToEdit ? itemToEdit.discord : ''}">
            </div>
    `;

    // Adminlere özel Tel No alanı
    if (section === 'adminler') {
        formHtml += `
            <div class="input-group">
                <label for="telno">Telefon No:</label>
                <input type="text" id="telno" value="${itemToEdit ? itemToEdit.telno : ''}" required>
            </div>
        `;
    }

    formHtml += `
            <button type="submit">${formType === 'ekle' ? 'Kaydet 💾' : 'Güncelle 🔄'}</button>
            <button type="button" onclick="handleAction('${section}', 'goster')" style="background-color: #6c757d;">İptal ❌</button>
        </form>
    `;
    formArea.innerHTML = formHtml;

    document.getElementById('data-form').addEventListener('submit', (e) => {
        e.preventDefault(); // Sayfanın yeniden yüklenmesini engelle

        const newItem = {
            name: document.getElementById('name').value,
            surname: document.getElementById('surname').value,
            age: parseInt(document.getElementById('age').value),
            instagram: document.getElementById('instagram').value,
            steam: document.getElementById('steam').value,
            discord: document.getElementById('discord').value,
            warnings: itemToEdit ? itemToEdit.warnings : [], // Uyarıları koru veya boş dizi başlat
            type: section === 'uyeler' ? 'member' : 'admin'
        };

        if (section === 'adminler') {
            newItem.telno = document.getElementById('telno').value;
        }

        if (formType === 'ekle') {
            newItem.id = generateId(section); // Yeni ID oluştur
            if (section === 'uyeler') {
                members.push(newItem);
                saveToLocalStorage('members', members);
            } else {
                admins.push(newItem);
                saveToLocalStorage('admins', admins);
            }
            alert(`Ula **syssec**, yeni ${newItem.name} ${newItem.surname} sisteme dahil edildi! 🥳`);
        } else { // Düzenleme
            // Mevcut öğenin ID'si ile güncelleme yap
            updateDataStorage(newItem.type, {...itemToEdit, ...newItem}); // Eski ID ile güncellenmiş veriyi kaydet

            alert(`Ula **syssec**, ${newItem.name} ${newItem.surname}'nin bilgileri güncellendi! 🔄`);
        }

        handleAction(section, 'goster'); // Listeyi yenile ve göster
    });
}

// Veri Taşıma (Banlama) işlemi
function banItem(id, type) {
    let sourceArray = type === 'member' ? members : admins;
    const itemIndex = sourceArray.findIndex(item => item.id === id);

    if (itemIndex !== -1) {
        const bannedReason = prompt(`Ula **syssec**, ${sourceArray[itemIndex].name}'yi neden banlıyorsun? Bir sebep söyle ki kayıt altına alalım! 📜`);
        if (!bannedReason) {
            alert('Ula **syssec**, ban nedeni belirtmezsen banlayamam ki! 🤔');
            return;
        }

        const [bannedItem] = sourceArray.splice(itemIndex, 1); // Kaynaktan çıkar
        bannedItem.bannedDate = new Date().toLocaleString('tr-TR'); // Banlanma tarihi ekle
        bannedItem.bannedReason = bannedReason; // Banlanma nedeni ekle
        banned.push(bannedItem); // Banlananlar listesine ekle

        // Verileri localStorage'da güncelle
        saveToLocalStorage(type === 'member' ? 'members' : 'admins', sourceArray);
        saveToLocalStorage('banned', banned);
        
        alert(`Ula **syssec**, ${bannedItem.name} ${bannedItem.surname} başarıyla banlandı ve **Banlar** listesine gönderildi! Nedeni: "${bannedReason}"💥`);
    } else {
        alert('Ula **syssec**, o kişiyi bulamadım ki! Belki zaten banlanmıştır. 🤔');
    }
}

// Ban Kaldırma işlemi (Yeni Fonksiyon!)
function unbanItem(id) {
    const itemIndex = banned.findIndex(item => item.id === id);

    if (itemIndex !== -1) {
        const [unbannedItem] = banned.splice(itemIndex, 1); // Banlananlar listesinden çıkar
        delete unbannedItem.bannedDate; // Banlanma tarihini sil
        delete unbannedItem.bannedReason; // Banlanma nedenini sil

        if (unbannedItem.type === 'member') {
            members.push(unbannedItem);
            saveToLocalStorage('members', members);
        } else {
            admins.push(unbannedItem);
            saveToLocalStorage('admins', admins);
        }
        saveToLocalStorage('banned', banned);

        alert(`Ula **syssec**, ${unbannedItem.name} ${unbannedItem.surname}'nin banı başarıyla kaldırıldı ve ${unbannedItem.type === 'member' ? 'Üyeler' : 'Adminler'} listesine geri döndü! ✅`);
    } else {
        alert('Ula **syssec**, bu ID ile banlanmış birini bulamadım. Yanlış mı baktın? 🧐');
    }
}

// Üye Silme işlemi (Yeni Fonksiyon!)
function deleteItem(id, type) {
    let targetArray;
    let storageKey;

    if (type === 'member') {
        targetArray = members;
        storageKey = 'members';
    } else if (type === 'admin') {
        targetArray = admins;
        storageKey = 'admins';
    } else {
        alert('Ula **syssec**, neyin nesini sileceğini bilemedim! Yanlış tip girdin sanırım. 🤨');
        return;
    }

    const itemIndex = targetArray.findIndex(item => item.id === id);

    if (itemIndex !== -1) {
        const [deletedItem] = targetArray.splice(itemIndex, 1);
        saveToLocalStorage(storageKey, targetArray);
        alert(`Ula **syssec**, ${deletedItem.name} ${deletedItem.surname} sistemden tamamen silindi! 🔥 Bir daha izini bulamayız!`);
    } else {
        alert('Ula **syssec**, silinecek kişiyi listede bulamadım! Yoksa çoktan mı kaçtı? 🏃‍♂️');
    }
}


// Uyarıları gösterme fonksiyonu (Tüm uyarıları detaylı listeler)
function renderWarnings() {
    const displayArea = document.getElementById('display-area');
    displayArea.innerHTML = `<h3>Tüm Uyarılar Raporu ⚠️</h3>`;
    clearSelection(); // Seçimi temizle

    const allWarnedItems = [
        ...members.map(m => m.warnings.map(w => ({ ...w, name: m.name, surname: m.surname, type: 'Üye' }))).flat(),
        ...admins.map(a => a.warnings.map(w => ({ ...w, name: a.name, surname: a.surname, type: 'Admin' }))).flat()
    ];

    if (allWarnedItems.length === 0) {
        displayArea.innerHTML += `<p>Ula **syssec**, henüz kimseye uyarı verilmemiş. Çok mu uysal bir ekibin var? Yoksa sen mi uyarı vermekten çekiniyorsun? 😜</p>`;
        return;
    }

    // Uyarıları tarihe göre tersten sırala (en yeni en başta)
    allWarnedItems.sort((a, b) => new Date(b.date) - new Date(a.date));

    const warningList = document.createElement('ul');
    warningList.classList.add('detailed-warning-list'); // Yeni sınıf ekledik

    allWarnedItems.forEach(warning => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>${warning.name} ${warning.surname}</strong> (${warning.type}): 
            <span style="color: #ffcc00;">${warning.reason}</span> 
            <small>(${warning.date})</small> 🚨
        `;
        warningList.appendChild(listItem);
    });

    displayArea.appendChild(warningList);
}

// Benzersiz ID oluşturucu
function generateId(section) {
    const prefix = section === 'uyeler' ? 'm' : 'a';
    return prefix + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Verileri localStorage'da saklama
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Verileri localStorage'dan yükleme
function loadFromLocalStorage() {
    const storedMembers = localStorage.getItem('members');
    const storedAdmins = localStorage.getItem('admins');
    const storedBanned = localStorage.getItem('banned');

    if (storedMembers) members = JSON.parse(storedMembers);
    if (storedAdmins) admins = JSON.parse(storedAdmins);
    if (storedBanned) banned = JSON.parse(storedBanned);
    
    // Eğer hiç veri yoksa, başlangıçtaki örnek verileri tekrar kaydet
    // Bu kısım, ilk çalıştırmada veya localStorage temizlendiğinde örnek verileri yükler
    // Not: Boş dizi ise yükle, null ise değil.
    if (!storedMembers || (members.length === 0 && JSON.parse(storedMembers || '[]').length === 0)) { 
        saveToLocalStorage('members', members);
    }
    if (!storedAdmins || (admins.length === 0 && JSON.parse(storedAdmins || '[]').length === 0)) {
        saveToLocalStorage('admins', admins);
    }
    if (!storedBanned || (banned.length === 0 && JSON.parse(storedBanned || '[]').length === 0)) {
        saveToLocalStorage('banned', banned);
    }
}


// Veri güncelleyici (Uyarı, Düzenleme sonrası için)
function updateDataStorage(type, updatedItem) {
    if (type === 'member') {
        const index = members.findIndex(m => m.id === updatedItem.id);
        if (index !== -1) members[index] = updatedItem;
        saveToLocalStorage('members', members);
    } else if (type === 'admin') {
        const index = admins.findIndex(a => a.id === updatedItem.id);
        if (index !== -1) admins[index] = updatedItem;
        saveToLocalStorage('admins', admins);
    } else if (type === 'banned') { // Banlanan bir öğenin özelliklerini güncellediğinde (örn: unban'da)
        const index = banned.findIndex(b => b.id === updatedItem.id);
        if (index !== -1) banned[index] = updatedItem;
        saveToLocalStorage('banned', banned);
    }
}

// Pencere boyutu değiştiğinde listelerin görünümünü güncelle
window.addEventListener('resize', () => {
    const memberListDiv = document.querySelector('.member-list');
    if (memberListDiv) {
        memberListDiv.classList.remove('pc-view', 'mobile-view');
        if (window.innerWidth > 768) {
            memberListDiv.classList.add('pc-view');
        } else {
            memberListDiv.classList.add('mobile-view');
        }
    }

});
