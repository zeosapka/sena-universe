# SENA — A LITTLE UNIVERSE MADE FOR YOU ❤️

21 Kasım 2026 tarihinde Sena'nın doğum günü için özel olarak tasarlanmış, sinematik, romantik, interaktif ve **Tablet Öncelikli (Tablet-First)** dijital aşk ve kutlama deneyimi.

---

## ✨ Özellikler & Bölümler

1. **First Impression (Sinematik Açılış Portalı)** (`src/components/OpeningPortal.tsx`)
   - *"Some people make the world more beautiful just by being in it."*
   - Merkezde nabız gibi atan ışıltılı kalp çekirdeği.
   - **"ENTER MY LITTLE UNIVERSE"** butonuna dokunulduğunda GSAP ile kalp büyüyerek ekranı kaplar, pembe ve altın parçacıklar patlar ve ana evrene geçiş yapılır.
2. **Ana Kutlama Ekranı (Hero Celebration)** (`src/components/HeroCelebration.tsx`)
   - *"Happy Birthday, My Beautiful Sena."* & *"Today, the universe has one more reason to shine."*
   - Hareketli yıldızlar (`@tsparticles/react`), yükselen kalpler ve derinlik hissi veren parallax katmanları.
   - Ekrana her dokunulduğunda/tıklandığında küçük kalp ve yıldız patlamaları (`src/components/TouchHeartBursts.tsx`).
3. **Gerçek Zamanlı Geri Sayım (Countdown)** (`src/components/BirthdayCountdown.tsx`)
   - **21 Kasım 2026** tarihine gün, saat, dakika ve saniye bazında canlı geri sayım.
   - Her rakam değişiminde Framer Motion `AnimatePresence` ile zarif dikey geçiş animasyonu.
   - Doğum günü geldiğinde (veya önizleme butonuyla test edildiğinde) otomatik olarak **"TODAY IS YOUR DAY, SENA!"** kutlama moduna geçer ve 21 Kasım sonrasında da kutlama modunda kalır.
4. **Interactive Love Letter (Altın Mühürlü Aşk Mektubu)** (`src/components/InteractiveLoveLetter.tsx`)
   - Üzerinde *"A letter written just for you..."* yazan altın balmumu mühürlü (`S ❤️`) interaktif zarf.
   - Dokunulduğunda zarf açılır ve mektup satır satır romantik tipografiyle belirir.
5. **Fireworks Celebration (Havai Fişek Gösterisi)** (`src/components/FireworksCelebration.tsx`)
   - **"MAKE A WISH, SENA ✨"** butonuna dokunulduğunda tam ekran 60 FPS özel HTML5 Canvas havai fişek gösterisi başlar.
   - Pembe (`#FF91B5`), romantik kırmızı (`#E83E70`), yumuşak altın (`#F5D58A`) ve beyaz (`#FFF8FC`) renklerde küresel ve **parametrik kalp şeklinde** havai fişekler rastgele zaman ve noktalarda patlar.
   - Gökyüzüne dokunarak ekstra kalp havai fişekleri fırlatılabilir.
6. **Our Little Moments (3D Anılar Galerisi)** (`src/components/OurLittleMoments.tsx`)
   - Gerçek yaşanmamış anılar uydurulmadan, şık takımyıldızı sanatıyla hazırlanmış 6 adet kolayca değiştirilebilir çerçeve.
   - Kartlara dokunulduğunda **3D Y-ekseni dönüşü (3D Flip)**, alt mesaj düzenleme ve **Tam Ekran (Fullscreen Lightbox)** görüntüleme.
7. **Surprise Button (Son Sürpriz)** (`src/components/FinalSurprise.tsx`)
   - **"ONE LAST SURPRISE ❤️"** butonuna dokunulduğunda `react-rewards` kalp patlaması ve tam ekran sinematik kararma gerçekleşir.
   - Yüzlerce kalp yükselirken *"Out of all the places in this universe, I'm glad our paths crossed. Happy Birthday, Sena. ❤️"* mesajı ve altın/pembe konfeti yağmuru başlar.
8. **Romantik Müzik Oynatıcı** (`src/components/MusicPlayer.tsx`)
   - Otomatik ses başlatmaz; yalnızca kullanıcı sağ üstteki müzik butonuna dokunduğunda başlar.
   - Lisanssız MP3 gömmek yerine yerleşik **Web Audio API Romantik Müzik Kutusu Sentezleyicisi** içerir ve istenirse `universeConfig.ts` üzerinden özel MP3 dosyası bağlanabilir.

---

## 🛠️ Kişiselleştirme (Tek Dosyadan Kolay Düzenleme)

Tüm metinler, tarih, mektup satırları, fotoğraf çerçeveleri ve müzik dosyası yolu **`src/config/universeConfig.ts`** dosyasında toplanmıştır:

- **Fotoğraf Eklemek İçin:** Fotoğraflarınızı `public/moments/` klasörüne koyup `src/config/universeConfig.ts` içindeki `imageUrl: "/moments/foto1.jpg"` alanına yazmanız yeterlidir.
- **Müzik Eklemek İçin:** MP3 dosyanızı `public/music/sarki.mp3` olarak ekleyip `customAudioSrc: "/music/sarki.mp3"` olarak güncelleyebilirsiniz.

---

## 🚀 Çalıştırma ve Yayınlama (GitHub Pages / Vercel)

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# Production derlemesi oluşturun
npm run build
```

- **Vercel:** Projeyi doğrudan Vercel'e bağlayabilirsiniz (`vercel.json` hazırdır).
- **GitHub Pages:** `vite.config.ts` içerisinde `base: './'` tanımlandığı için `dist/` klasörü doğrudan GitHub Pages üzerinde sorunsuz çalışır.
