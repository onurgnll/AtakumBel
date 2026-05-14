"use strict";

const { Sequelize } = require("sequelize");
const C = require("./data/demoSeedConstants");

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Facilities", [
      {
        name: C.FACILITY_NAME_CAKIRLAR,
        address: "Çakırlar Yalı Mah. 6287. Sok. No:6 55270 Atakum/Samsun",
        latitude: 41.39613284534675,
        longitude: 36.19504981334528,
        description: "<p><strong>Doğayla İç İçe Huzurlu Bir Nefes Alanı</strong>&nbsp;</p><p></p><p>Çakırlar Korusu içerisinde yer alan <strong>Çakırlar Korusu Restoran</strong>, Atakum Belediyesi’nin kent sakinlerine doğayla iç içe, huzurlu ve keyifli bir sosyal alan sunmak amacıyla hayata geçirdiği örnek tesislerden biridir. Yemyeşil koruluk alanın içinde konumlanan restoran, hem doğa yürüyüşü yapanlar hem de dinlenmek isteyenler için eşsiz bir durak noktasıdır.</p><p></p><p>Geniş açık oturma alanları, doğal çevreyle uyumlu mimarisi ve uygun fiyatlı kaliteli hizmet anlayışıyla Çakırlar Korusu Restoran; aileler, gençler, sporcular ve doğa tutkunları için ideal bir buluşma mekânıdır. Misafirlerine çay, kahve, yemek ve atıştırmalıklar eşliğinde dinlenme imkânı sunarken; koru boyunca uzanan yürüyüş parkuru ve dinlenme alanları sayesinde günün stresinden uzaklaşmak mümkün hale gelir.</p><p></p><p><strong>Çakırlar Korusu ve Restoran</strong>, Atakum Belediyesi’nin yeşili koruyan, sosyal yaşamı destekleyen ve halkın hizmetine açık tesisler üretme vizyonunun başarılı bir yansımasıdır.&nbsp;</p>",
      },
      {
        name: C.FACILITY_NAME_KUTUPHANE,
        address:
          "Yeşilyurt, 75. Yıl Cumhuriyet Blv. No:85, 55270 Atakum/Samsun",
        latitude: 41.426747163843814,
        longitude: 36.17018193466148,
        description: "<p>Atakum Belediyesi’ne bağlı <strong>Çatalçam Sosyal Tesisleri</strong>, yaz aylarının en çok tercih edilen yaşam alanlarından biri haline geldi. Eşsiz plajı, ekonomik ve seçkin menüleriyle hizmet veren restoranı ile vatandaşların yoğun ilgisini görüyor.</p><p></p><p><strong>Yeşilyurt Mahallesi 75. Yıl Cumhuriyet Bulvarı No:85</strong> adresinde bulunan tesis, fast food çeşitlerinden dondurmaya, sıcak-soğuk içeceklerden özel menülere kadar geniş bir yelpazede hizmet sunuyor. Sahil kenarındaki restoran, ziyaretçilerine adeta lezzet dolu bir yolculuk yaşatıyor.&nbsp;</p><p></p><p>Yaklaşık <strong>2 bin metrekarelik alanda</strong> kurulan tesis, yeşil ve mavinin buluştuğu noktada ailelerin keyifli vakit geçirebileceği nezih bir ortam sağlıyor. Plaj alanı, modern duş ve soyunma kabinleriyle donatılırken; vatandaşlar denizin tadını çıkarırken aynı zamanda zengin menü seçeneklerinin de keyfine varabiliyor.</p><p></p><p>Her gün <strong>09.00 – 23.00 saatleri arasında</strong> hizmet veren Çatalçam Sosyal Tesisleri, yaz sezonunun önde gelen buluşma noktalarından biri olmayı sürdürüyor.&nbsp;</p>"
      },

      {
        name: C.FACILITY_NAME_BANDA,
        address: "Cumhuriyet, 36. Sk. No:1, 55200 Atakum/Samsun",
        latitude: 41.33753047226031,
        longitude: 36.266413599836255,
        description: "<p>Atakum Belediyesi tarafından hayata geçirilen <strong>Banda Aceh Parkı</strong>, çocukların, gençlerin, ailelerin ve tüm Atakum halkının sporla, doğayla ve sosyal yaşamla iç içe olabilmesi amacıyla oluşturulmuş modern bir yaşam alanıdır. Bu park, sadece bir dinlenme ve eğlence alanı olmanın ötesinde, sağlıklı ve aktif bir yaşamı destekleyen çok yönlü bir sosyal tesis niteliği taşımaktadır.</p><p></p><p>Park içerisinde; basketbol, voleybol ve futbol sahaları gibi spor alanları, çocukların güvenle vakit geçirebileceği oyun parkları, kaykay ve paten gibi aktiviteler için özel olarak tasarlanmış alanlar, doğa ile iç içe yürüyüş yolları, ailelerin keyifle vakit geçirebileceği yeşil dinlenme alanları, tüm ziyaretçilerin ihtiyaçlarına cevap verecek konforlu bir kafeterya bulunmaktadır.</p><p></p><p>Banda Aceh Parkı, Atakum’da kaliteli zaman geçirmek isteyen herkesin buluşma noktası olmayı hedeflemektedir. Spor yapmak, dinlenmek, çocuklarla oyun oynamak ya da sadece doğanın tadını çıkarmak isteyen tüm halkımıza yılın her günü hizmet vermektedir.&nbsp;</p>"
      },

      {
        name: C.FACILITY_NAME_HASAN,
        address: "Cumhuriyet mah, 37. Sok. No:5, 55200 Atakum/Samsun",
        latitude: 41.33651225293488,
        longitude: 36.2656101844866,
        description: `<p>Atakum Belediyesi bünyesinde hizmet veren Hasan Ali Yücel Gençlik Bilim ve Sanat Merkezi, her yaştan bireyin rahatlıkla faydalanabileceği; ücretsiz kurslar, kültürel etkinlikler ve sosyal imkanlarla dolu, çağdaş ve çok yönlü bir merkezdir.</p><p>&nbsp;</p><p><strong>Hizmet Saatleri</strong></p><p>Her gün 08:30-22:00 saatleri arasında açıktır. &nbsp;</p><p>&nbsp;</p><p><strong>Kütüphane</strong></p><p>135 kişilik konforlu oturma alanı ve zengin kitap arşiviyle hem ders çalışmak hem de keyifle kitap okumak için ideal bir ortam.</p><p>30 gün süreyle 2 kitap ödünç alma imkanı,<br>Günlük 20 sayfa ücretsiz siyah-beyaz fotokopi,<br>Mezun öğrencilerden gelen kullanılmamış test kitaplarıyla, sınava hazırlananlara ücretsiz kaynak desteği vardır.</p><p>&nbsp;</p><p><strong>Ücretsiz MEB Onaylı Sertifikalı Meslek Kursları</strong></p><p>İstihdama yönelik hazırlanan bu kurslar, farklı yaş gruplarına hitap ediyor.</p><p>Her kursun modül saati farklıdır.<br>Kursu başarıyla tamamlayan katılımcılar, e-Devlet üzerinden MEB onaylı sertifikalarını görüntüleyebilir.<br>Kurslar dönemsel olarak devam etmektedir.</p><p>&nbsp;</p><p><strong>Sergi ve Konferans Salonu</strong></p><p>Sanatın ve bilginin buluştuğu alan!</p><p>Her ay farklı sanatçılara ev sahipliği yapan sergi salonu,<br>Seminer, konferans, eğitim ve topluluk etkinlikleri için ücretsiz kullanım imkanı vardır.</p><p>&nbsp;</p><p><strong>Ücretsiz Kuru Temizleme (Çamaşırhane)</strong></p><p>Yurtlarda kalan üniversite öğrencileri için ücretsiz kuru temizleme hizmeti sunulmaktadır.</p><p>&nbsp;</p><p><strong>Sınırsız Ücretsiz İnternet</strong></p><p>Merkezin tüm alanlarında erişilebilir hızlı ve sınırsız WiFi.&nbsp;<br>Bağlanmak için:</p><p>"Atakum Belediyesi" WiFi ağına bağlanın.</p><p>Açılan sayfadaki formu doldurun.</p><p>Telefonunuza gelen doğrulama kodunu girin.<br>Ve internet keyfini çıkarın.</p><p>&nbsp;</p><p><strong>Genç Atakart</strong></p><p>Ortaokuldan doktora düzeyine kadar tüm öğrencilerin faydalanabileceği özel bir avantaj kartıdır.</p><p>Atakum ilçesinde ikamet eden öğrenciler başvurabilir.<br>Restoran ve sosyal tesislerde indirimli hizmetlerden faydalanılır.<br>Kartın geçerliliği farklı belediye tesislerine de yayılmaya devam etmektedir.</p><p>&nbsp;</p><p><strong>Kent Lokantası</strong></p><p>Kaliteli ve doyurucu 3 çeşit yemek yalnızca 60 TL.<br>Belediyemizin sosyal destek projelerinden biri olan Kent Lokantası, hem bütçe dostu hem lezzetli!</p>`
      },

      {
        name: C.FACILITY_NAME_MERKEZ,
        address: "İstiklal mah. 910. sok, 55200 Atakum/Samsun",
        latitude: 41.33358699291852,
        longitude: 36.256231928663254,
        description: "<p><strong>Zabıta Saha Amirliği</strong>, Atakum Belediyesi'nin kent genelindeki kamu düzenini sağlamak, vatandaşların huzurunu korumak ve belediye hizmetlerinin sahada etkin şekilde yürütülmesini sağlamak amacıyla kurulmuş denetim ve uygulama birimidir.</p><p></p><p>Kent estetiğinden seyyar satış kontrollerine, ruhsatsız yapı denetiminden işyeri denetimlerine kadar geniş bir sorumluluk alanına sahip olan Zabıta Saha Amirliği, <strong>7/24 esaslı çalışma programı</strong>yla sahada aktif şekilde görev yapmaktadır. Yerel esnafla, vatandaşla ve diğer kamu kurumlarıyla iş birliği içinde çalışan ekipler; çözüm odaklı, hızlı ve adil müdahaleleriyle Atakum’un düzenli kent yapısını korumaktadır.</p><p></p><p>Aynı zamanda halk sağlığına yönelik hijyen denetimleri, kaldırım işgalleri, çevre kirliliği bildirimi gibi konularda da aktif rol alan <strong>Zabıta Saha Amirliği</strong>, Atakum Belediyesi'nin sahadaki gözü ve denge gücüdür.</p><p></p><p><strong>Güler yüzlü hizmet, kararlı uygulama</strong> anlayışıyla çalışan zabıta ekipleri, kentin huzuru için sürekli görev başındadır.</p>"
      },

      {
        name: C.FACILITY_NAME_YESILDERE,
        address: "Yeşildere, 511. Sk. 55200 Atakum/Samsun",
        latitude: 41.320157425292685,
        longitude: 36.30467111330365,
        description: "<p><strong>Yeşildere Kültür Evi</strong>, Atakum Belediyesi’nin kırsal mahallelerde sosyal yaşamı canlandırma ve kültürel faaliyetleri yaygınlaştırma vizyonuyla hayata geçirdiği önemli projelerden biridir. Atakum’un Yeşildere Mahallesi’nde yer alan bu merkez, mahalle halkının sosyal bağlarını güçlendirmesi, üretkenliğini artırması ve kültürel değerlere sahip çıkması için çok yönlü bir yaşam alanı sunar.</p><p></p><p>Tesis içerisinde çok amaçlı etkinlik salonları, kadınlara yönelik kurs ve atölye alanları, çocuk etkinlik odaları, toplantı alanları ve dinlenme bölümleri bulunmaktadır. Düğün, nişan, toplantı, söyleşi ve eğitim gibi etkinlikler için mahalle halkı tarafından aktif olarak kullanılmaktadır.</p><p></p><p><strong>Yeşildere Kültür Evi</strong>, sadece bir bina değil; mahalle dayanışmasının, kadın emeğinin, çocuk gelişiminin ve kültürel zenginliğin buluşma noktasıdır. Atakum Belediyesi’nin kırsal kalkınmayı destekleyen sosyal belediyecilik anlayışının güçlü bir örneğidir.</p>"
      },
      {
        name: C.FACILITY_NAME_OZGECAN,
        address: "İstiklal mah. 862. sok. No:5, 55070 Atakum/Samsun",
        latitude: 41.32652999608455,
        longitude: 36.267061271009226,
        description: "<p><strong>Özgecan Kadın Danışma Merkezi</strong>, Atakum Belediyesi tarafından kadınların sosyal, psikolojik ve hukuki destek alabilecekleri güvenli bir yaşam alanı olarak hayata geçirilmiştir. Adını, kadın cinayetlerinin simgesi haline gelen <strong>Özgecan Aslan</strong>’dan alan bu merkez, kadına yönelik şiddete karşı duruşun ve toplumsal farkındalığın önemli bir simgesidir.</p><p></p><p>Merkezde kadınlara yönelik bireysel danışmanlık hizmetleri, psikolojik destek seansları, hukuki bilgilendirme, meslek edindirme kursları, toplumsal cinsiyet eşitliği atölyeleri ve grup terapileri gibi çok yönlü çalışmalar yürütülmektedir. Kadınların hem bireysel güçlenmesini sağlamak hem de dayanışma içinde olmalarını desteklemek amacıyla tasarlanan bu merkez, gizlilik ve güven esasına dayalı olarak hizmet verir.</p><p></p><p><strong>Özgecan Kadın Danışma Merkezi</strong>, Atakum’da yaşayan kadınların yalnız olmadığını hissettiren, haklarını bilen ve kendi ayakları üzerinde duran bireyler olarak topluma katılmalarını destekleyen çok değerli bir sosyal dayanışma modelidir.</p>"
      },
      {
        name: C.FACILITY_NAME_OMER,
        address: "Cumhuriyet Mah. Alparslan Bulvarı No:36, 55200 Atakum/Samsun",
        latitude: 41.33297200666224,
        longitude: 36.27038079978376,
        description: "<p><strong>Ömer Halisdemir Parkı</strong>, 15 Temmuz Demokrasi Şehidi Astsubay Kıdemli Başçavuş <strong>Ömer Halisdemir</strong>’in adını yaşatmak ve gelecek nesillere vatan sevgisini aşılamak amacıyla Atakum Belediyesi tarafından hizmete sunulmuştur. Atakum’un önemli sosyal alanlarından biri olan bu park, hem anma hem de yaşam alanı işleviyle halkın yoğun ilgi gösterdiği değerli bir tesistir.</p><p></p><p>Geniş yeşil alanları, yürüyüş yolları, çocuk oyun grupları, dinlenme bankları ve aydınlatmalı peyzaj düzenlemesiyle <strong>Ömer Halisdemir Parkı</strong>, ailelerin huzur içinde vakit geçirebileceği güvenli ve sakin bir ortam sunar. Ayrıca park içerisinde yer alan tematik alanlarda Ömer Halisdemir’in kahramanlık hikâyesine dair bilgilendirici panolar ve anıt çalışmaları da yer almaktadır.</p><p></p><p>Atakum Belediyesi, bu park ile sadece bir rekreasyon alanı değil, aynı zamanda <strong>ulusal değerlerimizi yaşatan ve sahip çıkan bir toplumsal hafıza mekânı</strong> oluşturmuştur.</p>"
      },
      {
        name: C.FACILITY_NAME_ATAKAFE,
        address: "Çakırlar Yalı Mah. 6287. Sok. No:6 55270 Atakum/Samsun",
        latitude: 41.3961489419387,
        longitude: 36.195071271030926,
        description: "<p><strong>Doğayla İç İçe Huzurlu Bir Nefes Alanı</strong></p><p></p><p><strong>Çakırlar Korusu içerisinde yer alan ATAKAFE</strong>, Atakum Belediyesi’nin kent sakinlerine doğayla iç içe, huzurlu ve keyifli bir sosyal alan sunmak amacıyla hayata geçirdiği örnek tesislerden biridir. Yemyeşil koruluk alanın içinde konumlanan ATAKAFE, hem doğa yürüyüşü yapanlar hem de dinlenmek isteyenler için eşsiz bir durak noktasıdır.</p><p></p><p>Geniş açık oturma alanları, doğal çevreyle uyumlu mimarisi ve uygun fiyatlı kaliteli hizmet anlayışıyla ATAKAFE, aileler, gençler, sporcular ve doğa tutkunları için ideal bir buluşma mekânıdır. Misafirlerine çay, kahve ve atıştırmalıklar eşliğinde dinlenme imkânı sunarken; koru boyunca uzanan yürüyüş parkuru ve dinlenme alanları sayesinde günün stresinden uzaklaşmak mümkün hale gelir.</p><p></p><p>Çakırlar Korusu ve ATAKAFE, Atakum Belediyesi’nin <strong>yeşili koruyan, sosyal yaşamı destekleyen ve halkın hizmetine açık tesisler üretme vizyonunun</strong> başarılı bir yansımasıdır.</p>"
      },
      {
        name: C.FACILITY_NAME_CEMAL,
        address: "Küçükkolpınar, 648. Sk. No:12, 55200 Atakum/Samsun",
        latitude: 41.32087798118876,
        longitude: 36.28591131332172,
        description: `<p><strong>Cemal Yeşilyurt Yaşam Alanı</strong>, Atakum Belediyesi tarafından doğa, dinlenme ve sosyal etkileşim odaklı olarak tasarlanmış; hem aileler hem de bireyler için huzurlu vakit geçirilebilecek örnek bir kentsel yaşam projesidir. Adını hayırsever iş insanı <strong>Cemal Yeşilyurt</strong>’tan alan bu alan, modern şehir hayatı içinde nefes alınabilecek yeşil bir vaha niteliğindedir.</p><p></p><p>Tesis içerisinde geniş yürüyüş yolları, çocuk oyun parkları, dinlenme alanları, açık spor sahaları, kafeterya ve sosyal etkinlik alanları yer almaktadır. Gölgelik oturma alanları ve doğal bitki örtüsüyle çevrelenen yaşam alanı, hem sabah yürüyüşleri hem akşam etkinlikleri için her yaştan ziyaretçiye hitap eder.</p><p></p><p>Cemal Yeşilyurt Yaşam Alanı, sadece fiziksel bir alan değil; <strong>komşuluğun geliştiği, çocukların güvenle oynadığı, yaş almış bireylerin sosyalleştiği</strong> ve toplumsal bağların güçlendiği bir yaşam merkezidir. Atakum Belediyesi’nin "yaşanabilir kent" anlayışının somut bir ürünü olan bu alan, çevreye duyarlı yapısıyla da dikkat çeker.</p>`
      },
      {
        name: C.FACILITY_NAME_BEL,
        address: "İstiklal Mah. Abdullah Gül Bulv. No:205 Atakum/Samsun",
        latitude: 41.333724004666394,
        longitude: 36.25792627099295,
        description: "<p><strong>Atakum Belediyesi Spor Tesisi</strong>, ilçede yaşayan vatandaşların spor yapma alışkanlıklarını geliştirmek, sağlıklı yaşamı teşvik etmek ve sosyal etkileşimi artırmak amacıyla hayata geçirilmiş kapsamlı bir spor kompleksidir. Modern donanımı, erişilebilir yapısı ve çok yönlü alanlarıyla her yaştan bireyin kullanımına açık olan bu tesis, Atakum’un aktif yaşam vizyonunu temsil eder.</p><p></p><p>Tesiste; açık ve kapalı spor salonları, futbol sahası, basketbol ve voleybol sahaları, yürüyüş ve koşu parkurları, fitness alanları ve çocuklara özel oyun bölümleri yer almaktadır. Aynı zamanda belediye tarafından düzenlenen ücretsiz spor kursları, turnuvalar, grup egzersizleri ve sağlık seminerleriyle de sosyal fayda sağlanmaktadır.</p><p></p><p><strong>Belediye güvencesiyle temiz, güvenli ve profesyonelce yönetilen</strong> bu tesis, sporu yaşamın bir parçası haline getirmek isteyen herkes için ideal bir buluşma noktasıdır. Kadınlar, çocuklar, gençler ve yaş almış bireyler için özel saat ve programlarla spor herkes için ulaşılabilir kılınmıştır.</p>"
      },
      {
        name: C.FACILITY_NAME_AZIZ,
        address: "Mevlana mah. 720. sok. 3-5, 55200 Atakum/Samsun",
        latitude: 41.325225255985394,
        longitude: 36.275766413337124,
        description: `<p><strong>Aziz Sancar Spor Tesisi</strong>, Atakum Belediyesi tarafından gençlerin, çocukların ve tüm Atakum halkının sporla iç içe, sağlıklı ve aktif bir yaşam sürmesi amacıyla hayata geçirilmiş örnek bir spor kompleksidir. İsmini Nobel Ödüllü bilim insanımız Prof. Dr. Aziz Sancar’dan alan bu tesis, hem fiziksel gelişimi desteklemek hem de sporu yaşam kültürüne dönüştürmek amacı taşır.</p><p></p><p>Tesiste futbol sahası, basketbol ve voleybol sahaları, yürüyüş alanları, açık spor aletleri ve çocuk oyun alanları gibi çok yönlü alanlar bulunmaktadır. Spor yapmaya teşvik eden açık hava ortamı ve düzenli olarak organize edilen turnuvalar sayesinde özellikle gençler için güvenli ve keyifli bir spor deneyimi sunulmaktadır.</p><p></p><p><strong>Aziz Sancar Spor Tesisi</strong>, sadece sporun yapıldığı değil, aynı zamanda sporun sevdirildiği ve dayanışmanın güçlendiği bir sosyal merkezdir. Atakum Belediyesi’nin "her mahalleye spor" anlayışının güçlü bir parçası olan bu tesis, sporu tabana yayarak toplum sağlığına önemli katkı sunmaktadır.</p>`
      },
      {
        name: C.FACILITY_NAME_ATA,
        address: "Atakent Mah. 3145. Sk. No:6 55270 Atakum/Samsun",
        latitude: 41.339651622976334,
        longitude: 36.247149870982994,
        description: "<p><strong>ATA TOHUM</strong>, Atakum Belediyesi’nin yerli üretimi desteklemek, biyolojik çeşitliliği korumak ve geleceğe sürdürülebilir bir tarım mirası bırakmak amacıyla hayata geçirdiği önemli bir kırsal kalkınma ve farkındalık projesidir.</p><p></p><p>Bu proje kapsamında Samsun’un ve ülkemizin çeşitli bölgelerinde nesilden nesile aktarılan <strong>yerli ve ata tohumları</strong> toplanmakta, çoğaltılmakta ve vatandaşlarla ücretsiz olarak paylaşılmaktadır. Aynı zamanda bu tohumların korunması, ticarileştirilmeden yaşatılması ve doğal üretimle buluşması hedeflenmektedir.</p><p>ATA TOHUM Projesi sadece bir tarım hareketi değil; <strong>gıda egemenliğini</strong>, <strong>yerel üreticiyi desteklemeyi</strong>, <strong>doğal tarımı teşvik etmeyi</strong> ve <strong>doğaya saygılı bir gelecek</strong> inşa etmeyi amaçlayan bir sosyal sorumluluk modelidir.</p><p></p><p>Tohum takas günleri, fide dağıtımları, eğitim seminerleri ve yerel üretici destek programlarıyla <strong>Atakum Belediyesi</strong>, tarım kültürünü yeniden canlandırmakta ve gelecek nesillere temiz, güvenilir bir üretim altyapısı bırakmaktadır.</p>"
      },
      {
        name: C.FACILITY_NAME_ATATEPE,
        address: "Atatepe, 3514. Sk. No:6, 55200 Atakum/Samsun",
        latitude: 41.328255049051805,
        longitude: 36.23914044217496,
        description: "<p><strong>Atatepe Kültür Evi</strong>, Atakum Belediyesi tarafından halkın sosyal yaşamına değer katmak ve kültürel faaliyetleri desteklemek amacıyla hayata geçirilmiş önemli bir yerel yaşam merkezidir. Samsun Atakum’un Atatepe Mahallesi’nde konumlanan bu tesis, mahalle sakinlerinin bir araya gelerek üretim yapabileceği, öğrenebileceği ve sosyalleşebileceği nitelikli bir ortam sunar.</p><p></p><p>Kültür evi içerisinde kadınlara yönelik meslek edindirme kursları, çocuklar için eğitsel etkinlikler, yaşlılar için sosyalleşme programları ve toplumun her kesimine hitap eden çeşitli atölye çalışmaları düzenlenmektedir. Ayrıca seminerler, sergiler, film gösterimleri ve özel gün etkinlikleriyle bölge halkına kültürel farkındalık kazandırmayı hedeflemektedir.</p><p></p><p>Modern yapısı, çok amaçlı salonları ve samimi atmosferiyle <strong>Atatepe Kültür Evi</strong>, yalnızca bir bina değil; <strong>komşuluğun, paylaşımın ve toplumsal üretimin kalbi</strong> olarak Atakum’daki sosyal yaşamın vazgeçilmez adreslerinden biri haline gelmiştir.</p>"
      },
      {
        name: C.FACILITY_NAME_ATASAHNE,
        address: "Mimarsinan Mah. 178. Sk. No:14 Atakum/Samsun",
        latitude: 41.32750943480892,
        longitude: 36.27539394220573,
        description: "<p><strong>ATA SAHNE</strong>, Atakum Belediyesi’nin kültür ve sanata verdiği önemin en somut göstergelerinden biridir. Samsun Atakum’da yer alan bu modern sahne ve etkinlik salonu, şehrin sanatsal yaşamına dinamizm kazandıran bir merkez olarak hem yerel halkın hem de sanatçıların buluşma noktasıdır.</p><p></p><p>Tesis; tiyatro oyunları, konserler, söyleşiler, film gösterimleri, çocuk etkinlikleri ve kültürel atölyelere ev sahipliği yapmaktadır. Sahne altyapısı, akustik yapısı ve oturma düzeniyle profesyonel prodüksiyonlara uygun şekilde tasarlanmış olan ATA SAHNE, hem yerel sanatçılara sahne imkânı tanımakta hem de ulusal çapta turne yapan grupları ağırlamaktadır.</p><p></p><p>ATA SAHNE sadece bir etkinlik mekanı değil, aynı zamanda <strong>toplumsal dayanışma</strong>, <strong>sanatla buluşma</strong> ve <strong>kültürel gelişim</strong> merkezi olarak hizmet verir. Atakum Belediyesi'nin sosyal belediyecilik anlayışıyla yönetilen bu tesis, Atakum halkına nitelikli ve erişilebilir sanatsal etkinlikler sunar.</p>"
      },
      {
        name: C.FACILITY_NAME_ATAKOCUK,
        address: "Yeni Mah. Ali Gaffar Okan Cad. No:60",
        latitude: 41.34062124151271,
        longitude: 36.239915713328074,
        description: "<h3><strong>ATAÇOCUK – Atakum Belediyesi Çocuk Gelişim ve Eğitim Merkezi</strong></h3><p>Atakum Belediyesi’nin çocuklara yönelik en değerli sosyal projelerinden biri olan <strong>ATAÇOCUK</strong>, 3-6 yaş arası çocuklara yönelik okul öncesi eğitim hizmeti sunan modern bir gelişim ve eğitim merkezidir. Atakum’daki ailelerin güvenle tercih ettiği bu tesis, çocukların hem zihinsel hem fiziksel gelişimlerini destekleyen nitelikli bir ortam sunar.</p><p>Tesiste alanında uzman eğitmenler eşliğinde çocuklar için özel olarak hazırlanmış eğitim programları, oyun atölyeleri, sanat etkinlikleri, drama çalışmaları ve değerler eğitimi gibi çok yönlü faaliyetler yürütülmektedir. ATAÇOCUK’ta her çocuğun bireysel yetenekleri keşfedilir, özgüveni gelişir ve sosyal hayata hazır hale gelir.</p><p>Güvenlik, hijyen ve pedagojik yaklaşımlar açısından yüksek standartlara sahip olan ATAÇOCUK, velilerin içinin rahat edeceği, çocukların ise keyifle zaman geçireceği bir ortam oluşturur. Ayrıca gün içinde sağlıklı beslenme düzeni, açık hava oyun alanları ve gelişim takip sistemiyle eğitim-öğretim süreci sürekli olarak desteklenir.</p><p>&nbsp;</p><p>Tüm Şube Adresleri ve İletişim Numaraları:</p><p><strong>Atakent Ataçocuk Çocuk Gelişim Merkezi&nbsp;</strong></p><p>Yeni Mah. Ali Gaffar Okan Cad. No:60 &nbsp;/ 0362 428 10 46</p><p>&nbsp;</p><p><strong>Demirkent Ataçocuk Çocuk Gelişim Merkezi</strong></p><p>Yeni Mah. 3193. Sok. No:1 &nbsp;/ 0505 378 55 01</p><p>&nbsp;</p><p><strong>Mevlana Ataçocuk Çocuk Gelişim Merkezi</strong></p><p>Mevlana Mah. 740. Sok. No: 11-A &nbsp;/ 0505 523 55 01&nbsp;</p><p>&nbsp;</p><p><strong>Yeni Mahalle Ataçocuk Çocuk Gelişim Merkezi</strong></p><p>Yeni Mah. Kıbrıs Cad. No: 11 &nbsp;/ 0505 352 55 01</p>"
      },
      {
        name: C.FACILITY_NAME_AQUA,
        address: "Atakent Mah, 3145. Sk. N0:1, Atakum/Samsun",
        latitude: 41.3400538690821,
        longitude: 36.2481928531846,
        description: "<p><strong>Atakum Aqua Park Tesisi</strong></p><p>Samsun’un gözde sahil ilçesi Atakum’da yer alan <strong>Atakum Belediyesi Aqua Park Tesisi</strong>, yaz aylarının vazgeçilmez eğlence ve serinleme noktasıdır. Modern tasarımı, hijyenik alanları ve her yaşa hitap eden su kaydıraklarıyla dikkat çeken Aqua Park, hem aileler hem gençler için keyifli vakit geçirilecek güvenli bir ortam sunar.</p><p></p><p>Tesiste çocuk havuzu, yetişkin havuzu, su oyunları alanı ve güneşlenme terasları gibi birçok bölüm yer alırken; misafirlerin konforu için soyunma kabinleri, duş alanları, kafeterya ve dinlenme alanları da hizmet vermektedir. Özellikle yaz sezonunda düzenlenen etkinlikler, animasyonlar ve çocuklara özel oyun saatleri ile Aqua Park yalnızca bir yüzme alanı değil, aynı zamanda sosyal ve eğlenceli bir yaşam alanıdır.</p><p></p><p><strong>Uygun fiyatlı giriş seçenekleri</strong>, <strong>belediye güvencesi</strong> ve <strong>kolay ulaşımıyla</strong> bölge halkına hizmet veren Aqua Park, Atakum sahilinin hemen yanında yer almasıyla denizle iç içe bir su eğlencesi deneyimi sunar.</p>"
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Facilities", {
      name: {
        [Sequelize.Op.in]: [C.FACILITY_NAME_GENCLIK, C.FACILITY_NAME_KUTUPHANE],
      },
    });
  },
};
