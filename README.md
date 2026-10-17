# 🚀 Kick Sub Counter Daily (Kick Günlük Abone Sayacı)

<div align="center">

![Kick Developer API](https://img.shields.io/badge/Kick-API%20v2-53FC18?style=for-the-badge&logoColor=black)
![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![OBS Studio](https://img.shields.io/badge/OBS-Studio%20Overlay-302E31?style=for-the-badge&logo=obs-studio)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<p align="center">
  <strong>Kick.com yayıncıları için 15 farklı seçilebilir temaya sahip, doğrudan Kick Sign-In entegrasyonlu, günlük hedef göstergeli ve OBS Browser Source uyumlu şeffaf canlı abone sayacı.</strong>
</p>

[Özellikler](#-öne-çıkan-özellikler) • [15 Canlı Tema](#-15-farklı-seçilebilir-sayaç-teması) • [Hızlı Kurulum](#-hızlı-kurulum) • [OBS Studio Kurulumu](#-obs-studio-ve-streamlabs-kurulumu) • [Kick Giriş Yöntemleri](#-kick-bağlantı-seçenekleri) • [Mimari](#-sistem-mimarisi)

---

</div>

## ✨ Öne Çıkan Özellikler

- **🔑 Doğrudan Kick Sign-In (OAuth 2.0 PKCE)**: Resmi Kick Developer Portal yetkilendirmesiyle tek tıkla güvenli giriş.
- **⚡ Hızlı Bağlantı (API Keysiz Tak-Çalıştır)**: Geliştirici hesabı beklemeden sadece Kick kullanıcı adınızı girerek saniyeler içinde yayına başlayabilme.
- **📅 Gerçek Günlük Sayaç (Daily Sub Tracking)**: Saat dilimine duyarlı (`Europe/Istanbul`, vb.) ve her gece yarısı 00:00'da otomatik sıfırlanan sayaç motoru.
- **🎯 Günlük Abone Hedefi & İlerleme Çubuğu**: Dinamik yüzde (%XX), kalan abone sayısı ve pürüzsüz dolum animasyonları.
- **🎉 Hedef Kutlama & Konfeti Efekti**: Günlük hedefe ulaşıldığında OBS ekranında otomatik patlayan çok katmanlı konfeti şöleni.
- **🎨 15 Seçilebilir Profesyonel Tema**: Gaming, Cyberpunk, 8-Bit Retro, Glassmorphism, Espor HUD ve minimalist seçenekler.
- **🔊 Dahili Web Audio Ses Sentezleyici**: Dışarıdan MP3 indirme ihtiyacı olmadan sıfır gecikmeli (0ms) tarayıcı ses efektleri (Chime, 8-Bit Coin, Arcade Powerup, Fanfare).
- **📺 %100 Şeffaf OBS Overlay**: `http://localhost:3000/overlay` adresiyle OBS Browser Source'a tam uyumlu, donanım hızlandırmalı saydam katman.
- **🔄 Anında Senkronizasyon (BroadcastChannel EventBus)**: Yayıncı panelinden yapılan tüm ayar ve simülasyonların OBS penceresine milisaniye seviyesinde yansıması.
- **🧪 Canlı Simülatör & Manuel Yönetim**: Yayın öncesinde +1 Abone, +5 Hediye Abone, -1 Düzeltme ve Sıfırlama araçları.

---

## 🎨 15 Farklı Seçilebilir Sayaç Teması

Uygulama, her yayın konseptine ve ekran düzenine uyum sağlayacak 15 özel CSS/Tailwind teması ile birlikte gelir:

| # | Tema Adı | Kategori | Açıklama |
|---|----------|----------|-----------|
| 1 | **Kick Electric** | Gaming | Kick'in resmi `#53FC18` neon yeşili ve obsidian siyah modern stili |
| 2 | **Cyberpunk Neon** | Modern | Canlı camgöbeği & macenta neon parıltıları ve fütüristik parlamalar |
| 3 | **8-Bit Arcade** | Retro | Nostaljik arcade salonu piksel fontları ve bloklu ilerleme çubuğu |
| 4 | **Clean Glass** | Minimal | Ultra modern buzlu cam (Glassmorphism), pürüzsüz estetik blur efekti |
| 5 | **Synthwave 80s** | Special | 80'ler retro dalgası, mor ve sıcak turuncu gün batımı geçişleri |
| 6 | **Tactical Esports HUD** | Gaming | Askeri/bilimkurgu HUD arayüzü, köşeli braketler ve telemetri |
| 7 | **Lofi Pastel Cozy** | Minimal | Sakin lavanta ve sıcak şeftali pastel tonları, yumuşak hatlar |
| 8 | **Royal Gold VIP** | Special | Metalik altın işlemeler, kraliyet tacı ve lüks VIP yayıncı havası |
| 9 | **Manga Speedline** | Special | Yüksek kontrastlı siyah-beyaz çizgi roman ve dinamik aksiyon çizgileri |
| 10 | **Inferno Lava** | Gaming | Alev alev yanan lav gradyanı ve akkor köz parıltılı yüksek enerji |
| 11 | **Matrix Terminal** | Retro | Yeşil fosforlu CRT hacker konsolu ve ASCII karakterli sayaç |
| 12 | **Glitch Cyber** | Gaming | Dijital glitç bozulma efekti, kromatik ayrışma ve keskin sokak tarzı |
| 13 | **Frostbite Arctic** | Modern | Sıfırın altında kutup mavisi, dondurucu kristal parlaklığı ve buz ışıltısı |
| 14 | **Miami Sunset** | Modern | Tropikal mercan pembesi ve altın sarısı yaz akşamı gradyanı |
| 15 | **Compact Streamer Pill** | Minimal | Kamera köşesi ve dar alanlar için ultra ince yatay kapsül widget |

---

## 🚀 Hızlı Kurulum

### Gereksinimler
- **Node.js**: v18.0.0 veya üzeri (v20+ / v22+ önerilir)
- **npm** veya **pnpm** / **yarn**

### 1. Depoyu Klonlayın veya Açın
```bash
git clone https://github.com/Xdestrys895/kick-sub-counter-daily.git
cd kick-sub-counter-daily
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Çevre Değişkenlerini Ayarlayın (İsteğe Bağlı)
Resmi Kick Developer Portal kimliklerini kullanmak isterseniz:
```bash
cp .env.example .env.local
```
`.env.local` dosyasını açıp Kick Developer Portal bilgilerinizi ekleyin:
```env
KICK_CLIENT_ID=your_kick_client_id_here
KICK_CLIENT_SECRET=your_kick_client_secret_here
KICK_REDIRECT_URI=http://localhost:3000/api/auth/callback
DEFAULT_DAILY_GOAL=20
DEFAULT_TIMEZONE=Europe/Istanbul
```
> **Not:** Kick Developer hesabınız olmasa bile uygulamayı doğrudan Kick kullanıcı adınız ile anında kullanabilirsiniz!

### 4. Uygulamayı Başlatın
```bash
npm run dev
```
Tarayıcınızda açın: **[http://localhost:3000](http://localhost:3000)**

---

## 📺 OBS Studio ve Streamlabs Kurulumu

Sayaç ekranını yayına saydam (transparent) olarak eklemek çok kolaydır:

1. OBS Studio'da yayınınızın bulunduğu **Sahneler (Scenes)** paneline gelin.
2. **Kaynaklar (Sources)** bölümündeki **`+`** butonuna tıklayın ve **"Tarayıcı" (Browser Source)** seçin.
3. Kaynağa bir isim verin (Örn: `Kick Gunluk Abone`).
4. Açılan ayar penceresinde aşağıdaki parametreleri girin:
   - **URL:** `http://localhost:3000/overlay` (veya panelden kopyaladığınız özel bağlantı)
   - **Genişlik (Width):** `480`
   - **Yükseklik (Height):** `180`
   - **Özel CSS (Custom CSS):**
     ```css
     body { background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }
     ```
   - **Görünür olmadığında kaynağı kapat:** `İşaretli`
   - **Sahne etkinleştiğinde tarayıcıyı yenile:** `İşaretli`
5. **Tamam**'a basın. Tebrikler! Şeffaf canlı sayacınız yayında!

---

## 🔑 Kick Bağlantı Seçenekleri

### Yöntem 1: Resmi Kick Sign-In (OAuth 2.0)
- Kick Developer Portal (`https://dev.kick.com`) üzerinden oluşturduğunuz OAuth App ile çalışır.
- Yayıncının profil resmi, kanal ID'si ve doğrulama rozeti otomatik çekilir.
- Güvenli PKCE (Proof Key for Code Exchange) ve SHA-256 doğrulama protokolü uygular.

### Yöntem 2: Hızlı Kanal Bağlantısı (API Keysiz)
- Geliştirici onayı beklemeden hemen başlamak isteyenler için tasarlanmıştır.
- Yayıncı panelindeki giriş kutusuna sadece Kick kullanıcı adınızı (örn: `xqc`) yazmanız yeterlidir.
- Sistem Kick'in halka açık WebSocket Pusher kanallarına (`channel.{id}`) otomatik abone olur ve abonelikleri canlı yakalar.

---

## 🏗 Sistem Mimarisi

Sentinel Architect & Clean Architecture ilkelerine göre katmanlı (layered & loosely coupled) olarak inşa edilmiştir:

```
src/
├── domain/                      # Saf İş Mantığı (Framework Bağımsız)
│   ├── types.ts                 # Katı TypeScript veri modelleri
│   ├── themes.ts                # 15 benzersiz sayaç temasının stilleri ve tanımları
│   └── counter-service.ts       # Günlük tarih hesabı, $O(1)$ tekilleştirme & Web Audio sentezi
├── lib/                         # Dış Servis Adaptörleri (Infrastructure)
│   ├── kick-api.ts              # Kick OAuth2 REST istemcisi
│   ├── kick-pusher.ts           # Kick canlı WebSocket dinleyicisi
│   ├── event-bus.ts             # BroadcastChannel & OBS senkronizasyon veri yolu
│   └── storage.ts               # Yerel depolama & gece yarısı otomatik sıfırlama
├── components/                  # Yeniden Kullanılabilir UI Bileşenleri
│   ├── ThemeRenderer.tsx        # 15 temayı canlı çizen ana görsel katman
│   ├── ThemeSelector.tsx        # Canlı önizlemeli tema galerisi
│   ├── KickLoginCard.tsx        # OAuth ve kullanıcı adı giriş modülü
│   ├── ObsUrlGenerator.tsx      # OBS URL oluşturucu ve kopyalama aracı
│   ├── SimulatorControls.tsx    # Canlı test & manuel sayaç kontrol paneli
│   ├── StreamerSettings.tsx     # Hedef, ses, saat dilimi ayarları
│   └── ConfettiTrigger.tsx      # GPU hızlandırmalı konfeti motoru
└── app/                         # Next.js App Router (Sunucu & İstemci Sayfaları)
    ├── api/                     # Sunucu API Uç Noktaları
    │   ├── auth/kick/           # Kick OAuth başlatıcı (PKCE)
    │   ├── auth/callback/       # Kick OAuth token takası
    │   └── kick/channel/        # Genel kanal bilgisi sorgulama servisi
    ├── overlay/                 # OBS Studio şeffaf overlay sayfası
    ├── page.tsx                 # Yayıncı Ana Yönetim Paneli
    ├── layout.tsx               # Kök yerleşim şablonu
    └── globals.css              # Tailwind ve saydamlık stilleri
```

---

## 🛠 Kullanılan Teknolojiler

- **Next.js 14 (App Router)** - Yüksek performanslı Full-Stack React çubuğu
- **TypeScript 5.6** - %100 tip güvenliği ve sıfır çalışma zamanı sürprizi
- **Tailwind CSS 3.4** - Hızlı, modern ve zengin animasyonlu tasarım sistemi
- **Pusher JS** - Kick gerçek zamanlı WebSocket kanallarına doğrudan bağlantı
- **Web Audio API** - Dış kaynak gerektirmeyen sıfır gecikmeli ses motoru
- **Canvas Confetti** - Hedef tamamlandığında patlayan partikül sistemi
- **Lucide React** - Modern akıcı ikon seti

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır. Dilediğiniz gibi ticari veya kişisel yayınlarınızda kullanabilir, geliştirebilir ve paylaşabilirsiniz.
