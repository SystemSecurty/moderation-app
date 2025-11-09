import json
from datetime import datetime
import tkinter as tk
from tkinter import ttk, messagebox, simpledialog
from tkinter import font

class BanSystem:
    def __init__(self, data_file="users.json"):
        self.data_file = data_file
        self.users = {}
        self.load_data()

    def load_data(self):
        try:
            with open(self.data_file, 'r') as f:
                self.users = json.load(f)
        except FileNotFoundError:
            self.users = {}

    def save_data(self):
        with open(self.data_file, 'w') as f:
            json.dump(self.users, f, indent=2)

    def add_user(self, user_id):
        if user_id not in self.users:
            self.users[user_id] = {"warnings": [], "kicks": [], "bans": []}
            self.save_data()
            return True
        return False

    def delete_user(self, user_id):
        if user_id in self.users:
            del self.users[user_id]
            self.save_data()
            return True
        return False

    def add_warning(self, user_id, reason):
        if user_id not in self.users:
            self.add_user(user_id)
        self.users[user_id]["warnings"].append({
            "timestamp": datetime.now().isoformat(),
            "reason": reason
        })
        self.save_data()

    def remove_warning(self, user_id, warning_index):
        if (user_id in self.users and 
            0 <= warning_index < len(self.users[user_id]["warnings"])):
            self.users[user_id]["warnings"].pop(warning_index)
            self.save_data()
            return True
        return False

    def add_kick(self, user_id, reason):
        if user_id not in self.users:
            self.add_user(user_id)
        self.users[user_id]["kicks"].append({
            "timestamp": datetime.now().isoformat(),
            "reason": reason
        })
        self.save_data()

    def add_ban(self, user_id, reason):
        if user_id not in self.users:
            self.add_user(user_id)
        self.users[user_id]["bans"].append({
            "timestamp": datetime.now().isoformat(),
            "reason": reason
        })
        self.save_data()

    def remove_kick(self, user_id, kick_index):
        if (user_id in self.users and 
            0 <= kick_index < len(self.users[user_id]["kicks"])):
            self.users[user_id]["kicks"].pop(kick_index)
            self.save_data()
            return True
        return False

    def remove_ban(self, user_id, ban_index):
        if (user_id in self.users and 
            0 <= ban_index < len(self.users[user_id]["bans"])):
            self.users[user_id]["bans"].pop(ban_index)
            self.save_data()
            return True
        return False

    def get_user_info(self, user_id):
        return self.users.get(user_id, None)
    
    def format_timestamp(self, timestamp):
        """ISO formatındaki tarihi insan tarafından okunabilir formata çevirir"""
        try:
            dt = datetime.fromisoformat(timestamp)
            return dt.strftime("%d %b %Y %H:%M")
        except:
            return timestamp[:19].replace("T", " ")

class BanSystemGUI:
    def __init__(self, root):
        self.system = BanSystem()
        self.root = root
        self.root.title("Kullanıcı Yönetim Sistemi")
        self.root.geometry("1100x700")
        
        # Tema ayarları
        self.setup_styles()

        self.selected_user = None
        self.setup_ui()

    def setup_styles(self):
        """Uygulama için özel stiller oluşturur"""
        style = ttk.Style()
        
        # Treeview başlık stili
        style.configure("Treeview.Heading", font=('Arial', 10, 'bold'))
        
        # Seçili satır stili
        style.map("Treeview", background=[("selected", "#4a6fa5")])

    def setup_ui(self):
        # Ana çerçeve
        main_container = tk.Frame(self.root)
        main_container.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        # Sol panel - Kullanıcı listesi ve ekleme/silme
        left_frame = tk.Frame(main_container, width=300, relief=tk.RAISED, bd=2)
        left_frame.pack(side=tk.LEFT, fill=tk.Y, padx=(0, 10))
        left_frame.pack_propagate(False)

        tk.Label(left_frame, text="Kullanıcı Yönetimi", font=("Arial", 12, "bold")).pack(pady=(10, 5))

        # Kullanıcı ID girişi
        tk.Label(left_frame, text="Kullanıcı ID:", font=("Arial", 9)).pack(anchor="w", padx=10, pady=(5, 0))
        self.user_id_entry = tk.Entry(left_frame, font=("Arial", 10))
        self.user_id_entry.pack(fill=tk.X, padx=10, pady=5)

        # Butonlar
        btn_frame = tk.Frame(left_frame)
        btn_frame.pack(fill=tk.X, padx=10, pady=5)

        tk.Button(btn_frame, text="Kullanıcı Ekle", command=self.add_user, 
                 bg="#4CAF50", fg="white", font=("Arial", 9, "bold"), height=2).pack(fill=tk.X, pady=2)
        tk.Button(btn_frame, text="Kullanıcı Sil", command=self.delete_user,
                 bg="#f44336", fg="white", font=("Arial", 9, "bold"), height=2).pack(fill=tk.X, pady=2)

        # Arama alanı
        tk.Label(left_frame, text="Kullanıcı Ara:", font=("Arial", 9)).pack(anchor="w", padx=10, pady=(10, 0))
        self.search_entry = tk.Entry(left_frame, font=("Arial", 10))
        self.search_entry.pack(fill=tk.X, padx=10, pady=5)
        self.search_entry.bind("<KeyRelease>", self.filter_users)

        # Kullanıcı tablosu
        table_frame = tk.Frame(left_frame)
        table_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=(0, 10))

        columns = ("ID", "Uyarılar", "Kick", "Ban")
        self.tree = ttk.Treeview(table_frame, columns=columns, show="headings", height=15)
        
        # Sütun genişlikleri ve hizalama
        self.tree.column("ID", width=80, anchor=tk.W)
        self.tree.column("Uyarılar", width=60, anchor=tk.CENTER)
        self.tree.column("Kick", width=60, anchor=tk.CENTER)
        self.tree.column("Ban", width=60, anchor=tk.CENTER)
        
        for col in columns:
            self.tree.heading(col, text=col)
            self.tree.column(col, width=70)

        # Scrollbar ekleme
        scrollbar = ttk.Scrollbar(table_frame, orient=tk.VERTICAL, command=self.tree.yview)
        self.tree.configure(yscrollcommand=scrollbar.set)
        
        self.tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        self.tree.bind("<<TreeviewSelect>>", self.on_user_select)

        # Sağ panel - Kullanıcı detayları
        right_frame = tk.Frame(main_container, relief=tk.RAISED, bd=2)
        right_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)

        # Seçili kullanıcı başlığı
        self.user_header = tk.Label(right_frame, text="Hiçbir Kullanıcı Seçili Değil", 
                                  font=("Arial", 14, "bold"), fg="#1a365d", pady=10)
        self.user_header.pack(fill=tk.X, padx=10, pady=(10, 5))

        # Detay sekme paneli
        self.notebook = ttk.Notebook(right_frame)
        self.notebook.pack(fill=tk.BOTH, expand=True, padx=10, pady=5)

        # Uyarılar sekmesi
        warning_frame = ttk.Frame(self.notebook)
        self.setup_action_tab(warning_frame, "warnings", "Uyarılar")
        self.notebook.add(warning_frame, text="Uyarılar")

        # Kickler sekmesi
        kick_frame = ttk.Frame(self.notebook)
        self.setup_action_tab(kick_frame, "kicks", "Kickler")
        self.notebook.add(kick_frame, text="Kickler")

        # Banlar sekmesi
        ban_frame = ttk.Frame(self.notebook)
        self.setup_action_tab(ban_frame, "bans", "Banlar")
        self.notebook.add(ban_frame, text="Banlar")

        # Seçili kullanıcının actionlarını göstermek için butonlar
        action_btn_frame = tk.Frame(right_frame)
        action_btn_frame.pack(fill=tk.X, padx=10, pady=10)

        tk.Button(action_btn_frame, text="Uyarı Ekle", command=self.add_warning,
                 bg="#FFC107", font=("Arial", 9, "bold"), height=2).pack(side=tk.LEFT, padx=2, fill=tk.X, expand=True)
        tk.Button(action_btn_frame, text="Kick At", command=self.kick_user,
                 bg="#2196F3", fg="white", font=("Arial", 9, "bold"), height=2).pack(side=tk.LEFT, padx=2, fill=tk.X, expand=True)
        tk.Button(action_btn_frame, text="Banla", command=self.ban_user,
                 bg="#f44336", fg="white", font=("Arial", 9, "bold"), height=2).pack(side=tk.LEFT, padx=2, fill=tk.X, expand=True)

        self.refresh_users()

    def setup_action_tab(self, parent, action_type, title):
        """Her bir eylem sekmesi için ortak yapıyı oluşturur"""
        # Tablo
        columns = ("Tarih", "Sebep")
        tree = ttk.Treeview(parent, columns=columns, show="headings", height=8)
        
        tree.heading("Tarih", text="Tarih/Saat")
        tree.heading("Sebep", text="Sebep")
        
        tree.column("Tarih", width=150, anchor=tk.CENTER)
        tree.column("Sebep", width=300, anchor=tk.W)
        
        # Scrollbar
        scrollbar = ttk.Scrollbar(parent, orient=tk.VERTICAL, command=tree.yview)
        tree.configure(yscrollcommand=scrollbar.set)
        
        tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(10, 0), pady=10)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y, pady=10)
        
        # Silme butonu
        btn_frame = tk.Frame(parent)
        btn_frame.pack(fill=tk.X, padx=10, pady=(0, 10))
        
        remove_btn = tk.Button(btn_frame, text=f"Seçili {title[:-1]}i Sil", 
                              command=lambda: self.remove_action(action_type, tree),
                              bg="#f44336", fg="white", font=("Arial", 9, "bold"))
        remove_btn.pack(side=tk.RIGHT, padx=5)
        
        # Treeview'i sınıf değişkeni olarak sakla
        setattr(self, f"{action_type}_tree", tree)

    def add_user(self):
        user_id = self.user_id_entry.get().strip()
        if user_id:
            if self.system.add_user(user_id):
                messagebox.showinfo("Başarılı", f"'{user_id}' başarıyla eklendi")
                self.refresh_users()
                self.user_id_entry.delete(0, tk.END)
            else:
                messagebox.showwarning("Uyarı", "Bu kullanıcı zaten mevcut")
        else:
            messagebox.showwarning("Hata", "Lütfen geçerli bir kullanıcı ID'si girin")

    def delete_user(self):
        user_id = self.user_id_entry.get().strip()
        if not user_id:
            messagebox.showwarning("Hata", "Lütfen önce bir kullanıcı ID'si girin")
            return
            
        if user_id not in self.system.users:
            messagebox.showwarning("Hata", "Bu kullanıcı sistemde bulunamadı")
            return
            
        if messagebox.askyesno("Onay", f"'{user_id}' kullanıcısını silmek istediğinizden emin misiniz?\nBu işlem geri alınamaz!"):
            if self.system.delete_user(user_id):
                messagebox.showinfo("Başarılı", f"'{user_id}' kullanıcısı silindi")
                self.refresh_users()
                self.user_id_entry.delete(0, tk.END)
                self.clear_user_details()

    def refresh_users(self):
        for item in self.tree.get_children():
            self.tree.delete(item)

        search_term = self.search_entry.get().lower()
        for user_id, data in self.system.users.items():
            if search_term in user_id.lower():
                self.tree.insert("", "end", values=(
                    user_id,
                    len(data["warnings"]),
                    len(data["kicks"]),
                    len(data["bans"])
                ))

    def filter_users(self, event=None):
        self.refresh_users()

    def on_user_select(self, event):
        selection = self.tree.selection()
        if selection:
            item = self.tree.item(selection[0])
            self.selected_user = item['values'][0]
            self.load_user_details(self.selected_user)

    def load_user_details(self, user_id):
        """Seçilen kullanıcının tüm detaylarını yükler"""
        self.user_header.config(text=f"Kullanıcı: {user_id}")
        
        user_data = self.system.get_user_info(user_id)
        if not user_data:
            return
            
        # Uyarılar tablosunu güncelle
        self.update_action_tree("warnings", user_data["warnings"])
        
        # Kickler tablosunu güncelle
        self.update_action_tree("kicks", user_data["kicks"])
        
        # Banlar tablosunu güncelle
        self.update_action_tree("bans", user_data["bans"])

    def update_action_tree(self, action_type, actions):
        """Belirli bir eylem türü için tabloyu günceller"""
        tree = getattr(self, f"{action_type}_tree")
        
        # Mevcut verileri temizle
        for item in tree.get_children():
            tree.delete(item)
            
        # Yeni verileri ekle
        for idx, action in enumerate(actions):
            formatted_time = self.system.format_timestamp(action["timestamp"])
            tree.insert("", "end", iid=f"{action_type}_{idx}", values=(
                formatted_time,
                action["reason"]
            ))

    def clear_user_details(self):
        """Kullanıcı detaylarını temizler"""
        self.user_header.config(text="Hiçbir Kullanıcı Seçili Değil")
        self.selected_user = None
        
        # Tüm tabloları temizle
        for action_type in ["warnings", "kicks", "bans"]:
            tree = getattr(self, f"{action_type}_tree")
            for item in tree.get_children():
                tree.delete(item)

    def add_warning(self):
        if not self.selected_user:
            messagebox.showwarning("Uyarı", "Lütfen önce bir kullanıcı seçin")
            return
            
        reason = simpledialog.askstring("Yeni Uyarı", "Uyarı sebebi:", parent=self.root)
        if reason is None:  # İptal edildi
            return
        if reason.strip() == "":
            messagebox.showwarning("Hata", "Uyarı sebebi boş olamaz")
            return
            
        self.system.add_warning(self.selected_user, reason.strip())
        self.load_user_details(self.selected_user)
        self.refresh_users()
        messagebox.showinfo("Başarılı", f"'{self.selected_user}' kullanıcısına uyarı eklendi")

    def kick_user(self):
        if not self.selected_user:
            messagebox.showwarning("Uyarı", "Lütfen önce bir kullanıcı seçin")
            return
            
        reason = simpledialog.askstring("Kick İşlemi", "Kick sebebi:", parent=self.root)
        if reason is None:  # İptal edildi
            return
        if reason.strip() == "":
            messagebox.showwarning("Hata", "Kick sebebi boş olamaz")
            return
            
        self.system.add_kick(self.selected_user, reason.strip())
        self.load_user_details(self.selected_user)
        self.refresh_users()
        messagebox.showinfo("Başarılı", f"'{self.selected_user}' kullanıcısı kicklendi")

    def ban_user(self):
        if not self.selected_user:
            messagebox.showwarning("Uyarı", "Lütfen önce bir kullanıcı seçin")
            return
            
        reason = simpledialog.askstring("Ban İşlemi", "Ban sebebi:", parent=self.root)
        if reason is None:  # İptal edildi
            return
        if reason.strip() == "":
            messagebox.showwarning("Hata", "Ban sebebi boş olamaz")
            return
            
        self.system.add_ban(self.selected_user, reason.strip())
        self.load_user_details(self.selected_user)
        self.refresh_users()
        messagebox.showinfo("Başarılı", f"'{self.selected_user}' kullanıcısı banlandı")

    def remove_action(self, action_type, tree):
        """Seçilen eylemi siler"""
        if not self.selected_user:
            return
            
        selected = tree.selection()
        if not selected:
            messagebox.showinfo("Bilgi", "Lütfen önce listeden bir kayıt seçin")
            return
            
        item_id = selected[0]
        index = int(item_id.split("_")[1])
        
        action_names = {
            "warnings": "uyarı",
            "kicks": "kick",
            "bans": "ban"
        }
        
        action_name = action_names.get(action_type, "kayıt")
        
        if messagebox.askyesno("Onay", f"Seçili {action_name} silinsin mi?"):
            if action_type == "warnings":
                success = self.system.remove_warning(self.selected_user, index)
            elif action_type == "kicks":
                success = self.system.remove_kick(self.selected_user, index)
            elif action_type == "bans":
                success = self.system.remove_ban(self.selected_user, index)
                
            if success:
                messagebox.showinfo("Başarılı", f"{action_name.capitalize()} başarıyla silindi")
                self.load_user_details(self.selected_user)
                self.refresh_users()
            else:
                messagebox.showerror("Hata", "İşlem sırasında bir hata oluştu")

if __name__ == "__main__":
    root = tk.Tk()
    # Pencere simgesini ayarla (isteğe bağlı)
    try:
        root.iconbitmap("moderator.ico")
    except:
        pass
        
    app = BanSystemGUI(root)
    root.mainloop()