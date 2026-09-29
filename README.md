# Cenik Elektrik Web Sitesi — Başlangıç Sürümü

Bu paket, Cenik Elektrik için hazırlanan ilk çalışan prototiptir.

## İçerik

- `index.html` — Ana sayfa
- `hakkimizda.html` — Şirket tanıtımı
- `kurucumuz.html` — Kurucu/yönetim sayfası
- `urunler.html` — Arama ve filtrelemeli ürün kataloğu
- `teklif.html` — Teklif listesi ve demo form
- `assets/css/style.css` — Tüm tasarım ve mobil uyumluluk
- `assets/js/products.js` — Örnek ürün verileri
- `assets/js/app.js` — Menü, filtreleme ve teklif sepeti işlemleri

## Çalıştırma

`index.html` dosyasını tarayıcıda açabilirsiniz. Daha sağlıklı test için VS Code içindeki **Live Server** eklentisini kullanın.

## Şu anda çalışan özellikler

- Mobil uyumlu menü
- Ürün arama
- Kategori ve marka filtresi
- Ürünü teklif listesine ekleme
- Teklif listesinin tarayıcıda saklanması
- Adet değiştirme ve ürün kaldırma
- Demo teklif formu

## Sonraki aşamalar

1. Gerçek logo ve fotoğrafların eklenmesi
2. Şirket ve kurucu metinlerinin yazılması
3. Gerçek ürün envanterinin Excel/CSV üzerinden aktarılması
4. Teklif formunun sunucuya ve e-postaya bağlanması
5. Yönetim paneli ve veri tabanı
6. Güvenlik, KVKK metinleri ve yayına alma

## Önemli

Teklif formu şu anda gerçek e-posta göndermez. Form verisini tarayıcı konsolunda demo olarak hazırlar. Gerçek gönderim için güvenli bir backend kurulmalıdır.


## Son ana sayfa düzenlemeleri
- Footer iletişim bilgileri ve Google Haritalar eklendi.
- Kategori kartlarının görselleri `assets/img/categories/` klasöründedir.
- Çözüm Ortaklarımız alanında 34 adet tıklanabilir placeholder vardır. Logo eklemek için ilgili `<a class="partner-logo-slot">` içindeki `LOGO XX` metnini `<img src="..." alt="...">` ile değiştirin ve `href="#"` değerini markanın gerçek bağlantısıyla güncelleyin.
- Logo şeridi sonsuz döngüde akar ve fare üzerine gelindiğinde durur.

## Çözüm Ortakları Logoları

Çözüm ortakları için 34 hazır görsel dosyası `assets/img/partners/` klasöründedir.
Gerçek logoları eklemek için mevcut dosyaların üzerine aynı adlarla kaydedin: `logo1.jpg` ... `logo34.jpg`.
Dosya adlarını değiştirmezseniz `index.html` üzerinde ek işlem yapmanız gerekmez.


## Kategori kartı görselleri
Ana sayfadaki 7 kategori kartının görselleri `assets/img/category-cards/` klasöründedir.
Projektörler ayrı kategori değildir; Armatürler kategorisine dahildir.
Dosya adlarını değiştirmeden görselleri değiştirmeniz yeterlidir.


Kategori görselleri: assets/img/category-cards/. Sigorta ve pano artık ayrı dosyalardır: sigorta.jpg ve pano.jpg.


## 2026-09 güncellemesi
- Eski ürün kartı / sepet / localStorage teklif sistemi kaldırıldı.
- Ürünler sayfası marka PDF fiyat listeleri yapısına dönüştürüldü.
- WhatsApp hızlı teklif formu eklendi.
- Footer iletişimine WhatsApp eklendi.
- PDF eşleştirmeleri `assets/js/price-lists.js` üzerinden yönetilir.
