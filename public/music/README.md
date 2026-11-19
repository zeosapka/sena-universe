# Arka Plan Müziği Alanı (Lisanslı Enstrümantal Kayıt İçin)

Telif hakkı kuralları gereği Scorpions – *Still Loving You* parçasının orijinal kaydı veya izinsiz cover sürümleri projeye gömülmemiştir.

Bunun yerine:
1. Varsayılan olarak `src/components/MusicPlayer.tsx` içerisinde **G Minör (Sol Minör) 6/8'lik yavaş tempolu Romantik Piyano, Keman ve Çello** oda müziği sentezleyicisi kesintisiz olarak çalışmaktadır (distortion, elektro gitar veya davul içermez).
2. Kendi lisanslı piyano/yaylı enstrümantal `.mp3` dosyanızı bu klasöre (`public/music/still-loving-you-piano.mp3`) ekleyip `src/config/universeConfig.ts` dosyasındaki `customAudioSrc` alanını aşağıdaki gibi güncelleyebilirsiniz:

```ts
customAudioSrc: "/music/still-loving-you-piano.mp3",
```
