export interface MomentItem {
  id: string;
  title: string;
  subtitle: string;
  dateLabel: string;
  quote: string;
  /**
   * Özel fotoğraf yolu. Fotoğraflarınızı `/public/moments/` klasörüne ekleyip
   * `imageUrl: "/moments/foto1.jpg"` şeklinde tanımlayabilirsiniz.
   * Boş bırakıldığında (`""`), romantik takımyıldızı çerçevesi gösterilir.
   */
  imageUrl: string;
  accentColor: string;
  constellationName: string;
}

export const UNIVERSE_CONFIG = {
  recipientName: "Sena",
  siteTitle: "SENA — SENİN İÇİN YARATILMIŞ KÜÇÜK BİR EVREN",
  // Hedef Doğum Günü: 21 Kasım 2026, 00:00:00 (Yerel Saat)
  birthdayIsoDate: "2026-11-21T00:00:00",
  birthdayDisplayDate: "21 Kasım 2026",

  // 4 Şarkılık Romantik Kolaj Listesi (/public/music/ içindeki gerçek MP3 kayıtları)
  // crossfadeSeconds: Şarkılar arası yumuşak geçiş (fade-out / fade-in) süresi
  // startAtSeconds: Şarkının başlayacağı saniye (0 = en baştan)
  // excerptDurationSeconds: Kolajda bir sonraki şarkıya yumuşak geçiş yapmadan önce çalacağı süre (saniye)
  crossfadeSeconds: 5.5,
  musicPlaylist: [
    {
      id: "piyanist",
      title: "Ferdi Özbeğen — Piyanist 🎹",
      src: "/music/Ferdi Özbeğen - Piyanist.mp3",
      startAtSeconds: 0,
      excerptDurationSeconds: 75,
    },
    {
      id: "gurbette-sevgilim",
      title: "Ferdi Özbeğen — Gurbette Sevgilim 🌹",
      src: "/music/Ferdi Özbeğen - Gurbette Sevgilim.mp3",
      startAtSeconds: 0,
      excerptDurationSeconds: 75,
    },
    {
      id: "hani-benim-olacaktin",
      title: "Haluk Levent — Hani Benim Olacaktın ❤️",
      src: "/music/Haluk Levent  -  Hani Benim Olacaktın - SENDE Bİ DİNLE.mp3",
      startAtSeconds: 0,
      excerptDurationSeconds: 75,
    },
    {
      id: "ayrilik",
      title: "Selda Bağcan — Ayrılık ✨",
      src: "/music/Ayrılık - Selda Bağcan.mp3",
      startAtSeconds: 0,
      excerptDurationSeconds: 75,
    },
  ],
  customAudioSrc: "/music/Ferdi Özbeğen - Piyanist.mp3",
  musicTrackTitle: "Ferdi Özbeğen — Piyanist 🎹",

  // Müzik Oynatıcı Metinleri
  musicPlayer: {
    playingLabel: "Kolaj Çalıyor",
    pausedLabel: "Şarkımızı Başlat",
    playAriaLabel: "Müzik kolajını başlat",
    pauseAriaLabel: "Müziği duraklat",
    nextTrackAriaLabel: "Sıradaki şarkıya yumuşak geçiş yap",
    muteAriaLabel: "Sesi kapat",
    unmuteAriaLabel: "Sesi aç",
  },

  // 0. Sinematik Çiçek Açma Katmanı (Kasımpatı / Chrysanthemum Intro Layer)
  flowerIntro: {
    badgeText: "21 Kasım 2026 • Sena'nın Kasımpatısı",
    growingText:
      "Kasım’ın en güzel çiçeği Kasımpatı, senin için dalları ve tomurcuklarıyla filizleniyor... ✨",
    message: "Bu çiçek, senin kadar güzel bir güne açılsın Sena. ❤️",
    novemberSubtext:
      "Kasım’da doğan en zarif ruha, Kasım’ın çiçeği Kasımpatı armağan olsun...",
    touchHeartButtonText: "Kasımpatının Kalbine Dokun ❤️",
    skipButtonText: "Animasyonu Geç",
    continueHint: "Karşılama ekranına geçiliyor...",
  },

  // 1. Açılış Ekranı (First Impression)
  opening: {
    quote: "Bir insan, sadece varlığıyla bile dünyayı güzelleştirebilir.",
    greeting: "İyi ki doğdun Sena! ❤️",
    dateText: "21 Kasım 2026",
    buttonText: "BENİM KÜÇÜK EVRENİME GİR",
  },

  // 2. Ana Kutlama Ekranı (Hero Celebration)
  hero: {
    headlinePrefix: "İyi ki doğdun,",
    headlineHighlight: "güzel Sena'm.",
    subheadline: "Bugün evrenin parlamak için bir nedeni daha var.",
    touchHint: "Küçük kalpleri uyandırmak için evrenin herhangi bir yerine dokun ✨",
    scrollButtonText: "Evrenini Keşfet",
  },

  // 3. Geri Sayım Ekranı (Countdown)
  countdown: {
    preTitle: "SENİN GÜNÜNE KALAN ZAMAN",
    titlePrefix: "Her Saniye Bizi",
    titleHighlight: "Senin Işığına Yaklaştırıyor",
    celebrationHeadline: "BUGÜN SENİN GÜNÜN SENA!",
    celebrationSubtext:
      "Yıldızlar senin için hizalandı — bugün ve her gün tüm evren seni kutluyor. ❤️",
    units: {
      days: "Gün",
      hours: "Saat",
      minutes: "Dakika",
      seconds: "Saniye",
    },
    previewBirthdayButton: "Doğum Günü Modunu Önizle (21 Kasım)",
    showLiveTimerButton: "Canlı Geri Sayımı Göster",
  },

  // 4. İnteraktif Aşk Mektubu (Interactive Love Letter)
  loveLetter: {
    badgeText: "Yıldız Işığıyla Mühürlendi",
    envelopePrompt: "Yalnızca sana yazılmış bir mektup...",
    sealInitials: "S ❤️",
    openEnvelopeAriaLabel: "Sena için yazılan mektubu aç",
    touchSealHint: "Açmak İçin Altın Mühre Dokun",
    headerLabel: "Özel Mektup",
    showAllButton: "Tümünü Göster",
    foldButton: "Zarfı Kapat",
    salutation: "Sevgili Sena,",
    paragraphs: [
      "Bazı insanların ne kadar özel olduğunu kelimelerle anlatmak gerçekten zor.",
      "Ama bugün sana bir şeyi hatırlatmak istiyorum.",
      "Kasım ayı kimileri için soğuyan havalar demek olabilir; ama benim için kasımpatıların en zarif haliyle çiçek açtığı, senin dünyaya gelişinle ısınan en güzel mevsim.",
      "Tıpkı şarkımızdaki o piyanistin tuşlarında dolaşan en duygusal melodi gibi; hayatın bütün beyaz tuşlarındaki mutluluklar senin varlığınla anlam buluyor.",
      "Bu dünyadaki bütün mutlulukları hak ediyorsun. Her güzel anı, her küçük gülümsemeyi ve kurduğun bütün güzel hayalleri...",
      "Umarım hayatının bu yeni yaşı sana sonsuz mutluluklar, huzur ve gülümsemen için binlerce neden getirir.",
      "Kalbin hep sevgiyle, hayatın kasımpatılar kadar zarif güzelliklerle dolsun.",
      "İyi ki doğdun Sena.",
      "Sen, kutlanmaya değer çok özel birisin.",
    ],
    signOff: "Sevgiyle... ❤️",
    foreverBadge: "Bugün ve Her Zaman",
  },

  // 5. Havai Fişek Kutlaması (Fireworks Celebration)
  fireworks: {
    badgeText: "Gökyüzü Senfonisi",
    sectionTitle: "Geceyi Işığınla Aydınlat",
    sectionSubtitle:
      "Bir saniyeliğine gözlerini kapat, içinden en güzel dileğini geçir ve aşağıdaki yıldız ışığına dokun.",
    buttonText: "ŞİMDİ BİR DİLEK TUT SENA ✨",
    modalTopHint: "✦ Dileğini Tut, Sena ✦",
    skyMessage: "SENİN VARLIĞINLA DÜNYA DAHA GÜZEL.",
    touchSkyHint:
      "Kalp havai fişekleri fırlatmak için gökyüzünün herhangi bir yerine dokun ❤️",
    closeButtonText: "Evrene Dön",
    closeAriaLabel: "Havai fişek gösterisini kapat",
  },

  // 6. Bizim Küçük Anılarımız (Our Little Moments)
  momentsSection: {
    badgeText: "Yıldız Işığı Galerisi",
    title: "BİZİM KÜÇÜK ANILARIMIZ",
    subtitle:
      "En sevdiğimiz anıları, en içten gülümsemeleri ve birlikte geçen huzurlu saniyeleri saklamak için ayrılmış özel çerçeveler.",
    helperNote:
      "3B döndürmek için çerçevelere dokun • Büyütmek için 'Tam Ekran' butonunu seç",
    flipBadgeText: "3B Çevir",
    flipButtonText: "Notu Çevir",
    flipBackButtonText: "Çerçeveye Dön",
    fullscreenButtonText: "Tam Ekran",
    editNoteLabel: "Anı Notunu Özelleştir:",
    closeModalAriaLabel: "Tam ekran anı görünümünü kapat",
    configTipText:
      "İpucu: Fotoğrafları dilediğiniz zaman src/config/universeConfig.ts dosyasından ekleyebilirsiniz.",
    items: [
      {
        id: "moment-1",
        title: "En Güzel Gülümsemen",
        subtitle: "Zamanı durduran o sıcak tebessümün için ayrıldı",
        dateLabel: "Anı Çerçevesi I",
        quote: "Gülüşün, her mevsimde içimi ısıtan en güzel güneş ışığı.",
        imageUrl: "",
        accentColor: "#E83E70",
        constellationName: "Lyra • Uyum Takımyıldızı",
      },
      {
        id: "moment-2",
        title: "Birlikte Gün Batımı",
        subtitle: "Huzurlu bir yürüyüş veya altın saatler için ayrıldı",
        dateLabel: "Anı Çerçevesi II",
        quote: "Sen yanımdayken en sıradan saniyeler bile altına dönüşüyor.",
        imageUrl: "",
        accentColor: "#F5D58A",
        constellationName: "Cygnus • Zarafet Takımyıldızı",
      },
      {
        id: "moment-3",
        title: "Unutulmaz Kahkahalar",
        subtitle: "İçten bir neşe ve paylaştığımız mutluluk için ayrıldı",
        dateLabel: "Anı Çerçevesi III",
        quote: "Milyarlarca sesin olduğu bu evrende en güzel melodi senin sesin.",
        imageUrl: "",
        accentColor: "#FF91B5",
        constellationName: "Cassiopeia • Taç Takımyıldızı",
      },
      {
        id: "moment-4",
        title: "Aynı Yıldızların Altında",
        subtitle: "Dingin bir akşam ve hayal dolu bir bakış için ayrıldı",
        dateLabel: "Anı Çerçevesi IV",
        quote: "Gökyüzünde nereye bakarsam bakayım, en parlak yıldız hep sensin.",
        imageUrl: "",
        accentColor: "#E83E70",
        constellationName: "Andromeda • Mucize Takımyıldızı",
      },
      {
        id: "moment-5",
        title: "Seni Sen Yapan Detaylar",
        subtitle: "Saf mutluluğun en doğal fotoğraf karesi için ayrıldı",
        dateLabel: "Anı Çerçevesi V",
        quote: "Kalbimde en büyük yeri, sana ait en küçük ve en zarif detaylar kaplıyor.",
        imageUrl: "",
        accentColor: "#F5D58A",
        constellationName: "Vela • Yolculuk Takımyıldızı",
      },
      {
        id: "moment-6",
        title: "Yazılacak Yeni Sayfalar",
        subtitle: "Bizi bekleyen bir sonraki güzel sürpriz için ayrıldı",
        dateLabel: "Anı Çerçevesi VI",
        quote: "Hikâyemizin en güzel anıları henüz fotoğraflanmayı bekleyenler.",
        imageUrl: "",
        accentColor: "#FF91B5",
        constellationName: "Carina • Ufuk Takımyıldızı",
      },
    ] as MomentItem[],
  },

  // 6.5. Sena'nın Oyun Köşesi (Mini Games Section)
  gamesSection: {
    badgeText: "SENA'NIN OYUN KÖŞESİ ❤️",
    title: "Biraz da Eğlenelim Sena! ❤️",
    subtitle: "Senin için üç küçük sürpriz hazırladım.",
    playButtonText: "Oyunu Başlat",
    playAgainButtonText: "Tekrar Oyna",
    switchGameLabel: "Oyun Seç:",
    catchHearts: {
      tabTitle: "Kalpleri Yakala",
      cardTitle: "Kalpleri Yakala",
      cardSubtitle: "30 saniye içinde beliren parlak kalplere dokun ve topla.",
      durationSeconds: 30,
      pointsPerHeart: 10,
      scoreLabel: "Skor",
      timeLabel: "Süre",
      timeUnit: "sn",
      startPrompt: "Kalpler evrende belirmeye hazır. Başlamak için butona dokun!",
      finalMessage: "Bütün kalpler senin için Sena! ❤️",
      collectedSummaryPrefix: "Toplam Puanın:",
    },
    findStar: {
      tabTitle: "Gizli Yıldızı Bul",
      cardTitle: "Gizli Yıldızı Bul",
      cardSubtitle: "Parlayan yıldızların arasına gizlenmiş özel altın yıldızı keşfet.",
      instructionText: "Gökyüzündeki yıldızlara dikkatlice bak ve içlerinden en özel altın parıltıya sahip olan gizli yıldızına dokun ✨",
      wrongStarHint: "Bu yıldız da çok parlak ama aradığımız özel altın yıldız başka bir yerde parlıyor... ✨",
      finalMessage: "Aradığın yıldız zaten sensin! ✨",
      playAgainText: "Yıldızları Yeniden Karıştır",
    },
    heartCipher: {
      tabTitle: "Kalbin Şifresi",
      cardTitle: "Kalbin Şifresi",
      cardSubtitle: "Üç romantik bilmeceyi çözerek kalbin gizli mektubunu aç.",
      stagePrefix: "Aşama",
      unlockedBadge: "Kilit Açıldı ✨",
      finalMessage: "Bu küçük sürprizin şifresi: İYİ Kİ DOĞDUN SENA! ❤️",
      finalLetterSubtext: "Kalbin bütün kilitlerini sevgiyle açtın. Yeni yaşın sana hep en güzel kapıları açsın.",
      stages: [
        {
          id: 1,
          question: "1. Bilmece: Karanlık bir gecede bile gökyüzünü ve kalbimi aynı anda aydınlatan en güzel ışık nedir?",
          options: [
            "Senin içten gülümsemen",
            "Uzak bir gezegen",
            "Sokak lambaları",
          ],
          correctIndex: 0,
          hint: "İpucu: Bir tebessümün bile bütün dünyayı ısıtmaya yetiyor... ❤️",
        },
        {
          id: 2,
          question: "2. Bilmece: Takvimdeki yüzlerce gün arasından bütün evrenin heyecanla beklediği o en özel gün hangisidir?",
          options: [
            "Sıradan bir pazartesi",
            "21 Kasım — Senin Doğum Günün",
            "Yılın ilk günü",
          ],
          correctIndex: 1,
          hint: "İpucu: Kasım ayının en güzel ve en anlamlı gününü düşün... ✨",
        },
        {
          id: 3,
          question: "3. Bilmece: Bu küçük dijital evrenin her bir yıldızı ve her bir satırı kimin için sevgiyle hazırlandı?",
          options: [
            "Rastgele bir gezgin için",
            "Zaman yolcuları için",
            "Yalnızca senin için, güzel Sena'm ❤️",
          ],
          correctIndex: 2,
          hint: "İpucu: Bu evrenin kalbinde sadece senin ismin yazılı... ❤️",
        },
      ],
    },
  },

  // 7. Son Sürpriz Butonu ve Final (Final Surprise)
  surprise: {
    preTitle: "✦ Bu Gece Gözlerini Kapatmadan Önce ✦",
    buttonText: "SON BİR SÜRPRİZİM VAR ❤️",
    mainMessage:
      "Bu koca evrende yollarımızın kesişmiş olmasına çok mutluyum.",
    subMessage: "İyi ki doğdun Sena. ❤️",
    moreConfettiButton: "Daha Fazla Altın ve Pembe Konfeti Yağdır",
    closeButtonText: "Kapat",
    closeAriaLabel: "Sürpriz ekranını kapat",
  },
};
