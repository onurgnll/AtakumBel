# AtakumBel Admin Panel ↔ Backend API Entegrasyon Planı

## Context

Backend (`AtakumBel/`) Node.js + Express 5 + Sequelize/PostgreSQL + JWT ile yazılmış, ~30 modül için tam CRUD endpoint sunan, çalışır durumda bir API'dir. Admin panel (`AtakumBel-WebAdmin/`) ise React 19 + Vite + TypeScript + Zustand + Tailwind v4 stack'inde, **hiçbir HTTP client kurulmamış, tüm veriler [src/data/mockData.ts](AtakumBel-WebAdmin/src/data/mockData.ts) içinde sabit** olarak duran bir prototiptir. `authStore.login` her email/şifre ikilisini kabul eder, login mock'tur.

Hedef: Admin paneli **backend'in mevcut tüm modüllerine** bağlamak; backend'de doğrudan karşılığı olmayan admin sayfalarını (CRM, Polls, Map Points, Settings) kaldırmak; backend'de mevcut yapılar için eksik kalan endpoint varsa tamamlamak. Sonuç: localStorage'daki JWT ile gerçek backend'e konuşan, ~30 modülü tek tek yöneten production-grade admin paneli.

Karar verilenler: **Axios + TanStack Query**, **JWT localStorage + 401 auto-logout**, **kapsam: tüm backend modülleri**, karşılıksız frontend sayfaları kaldırılır.

---

## Mevcut Durum Özeti

### Backend modülleri (30+)
auth/admin, news, news-galleries, events, event-galleries, departments, employees, council-members, council-decisions, tenders, real-estate-listings, public-notices, services, service-forms, suggestions, activity-reports, audit-reports, financial-expectation-reports, performance-programs, strategic-plans, kvkk-documents, press-materials, facilities, directives, vice-presidents, president, encumens, encumen-members, gathering-areas, free-wifi-points, waste-points, marketplaces.

- Base URL: `http://localhost:5000/api`
- Auth: `Authorization: Bearer <jwt>` (24h TTL); login `POST /api/admin/login` `{email,password}` → `{success:1, token, message}`
- Standart yanıt: `{success, data, message, pagination?}`; pagination `{total_items,total_pages,current_page,per_page}` (default per_page=20).
- Permissions: `superadmin` | `admin` (JSONB modül CRUD flag'leri).
- File upload: Multer; `upload.single("document")` ya da `upload.array("images",10)`; statik servis `/uploads/:module/:filename`.

### Admin panel mevcut sayfaları
Dashboard, Haberler, Duyurular, Events, Meclis & Yayınlar, Medya, Müdürlükler, Hizmetler, **CRM**, **Harita**, **Anketler**, Users, **Ayarlar**.
Kalın olanlar **kaldırılacak** (backend karşılığı yok).

---

## Plan

### Faz 0 — Backend gap-fill (eksik endpoint denetimi)

[AtakumBel/routes/](AtakumBel/routes/) ve [AtakumBel/controllers/](AtakumBel/controllers/) gözden geçirilip aşağıdaki eksikler tamamlanır:

1. **`GET /api/admin/me`** — Token'dan oturumdaki admin'i (ad, rol, permissions) dönen endpoint. Frontend'de RequireAuth/header için gerekiyor. Yeni: [AtakumBel/controllers/adminController.js](AtakumBel/controllers/adminController.js) `getMe` + [AtakumBel/routes/adminRoutes.js](AtakumBel/routes/adminRoutes.js) `router.get('/me', protect, getMe)`.
2. **News Galleries** ve **Event Galleries** için `GET /:parentId` (parent kaydın galerisini listeleme). Mevcutta sadece POST/PUT/DELETE var; admin galeri yönetimi için liste ucu lazım.
3. **Service Forms** için `GET /` (tüm formları sayfalı listeleme). Mevcut sadece `GET /:serviceId`.
4. **Suggestions** için `PATCH /:id/status` veya mevcut `PUT /:id`'ın `status` alanını kabul ettiğinden emin olunması (Suggestions admin sayfasında onay akışı için).
5. **Tüm "list" endpoint'lerinin** `search`, `is_active`, `start_date`/`end_date` filtrelerini desteklemesi denetlenir; eksiklerde [AtakumBel/helpers/pagination.js](AtakumBel/helpers/pagination.js) ile tekdüze tamamlanır.
6. (Opsiyonel ama önerilir) **Swagger** kurulumu: `swagger-jsdoc` + `swagger-ui-express`, `/api/docs` üzerinden Postman collection'a paralel canlı doküman.

> Audit `Phase 0`'da tek tek endpoint listesi çıkarılır; gerçekten eksik olmayanlar atlanır.

---

### Faz 1 — Frontend altyapı (HTTP client + auth + query layer)

**Bağımlılıklar (yeni):** `axios`, `@tanstack/react-query`, `@tanstack/react-query-devtools`, `react-hook-form`, `zod`, `@hookform/resolvers`, `react-hot-toast` (ya da mevcut bir toast).

**Yeni dosyalar:**

- [AtakumBel-WebAdmin/.env](AtakumBel-WebAdmin/.env) — `VITE_API_BASE_URL=http://localhost:5000/api` ve `VITE_UPLOADS_BASE_URL=http://localhost:5000`
- [AtakumBel-WebAdmin/src/lib/api.ts](AtakumBel-WebAdmin/src/lib/api.ts) — Axios instance:
  - `baseURL: import.meta.env.VITE_API_BASE_URL`
  - Request interceptor: `localStorage.getItem('atakum-admin-token')` → `Authorization: Bearer ...`
  - Response interceptor: 401 → `useAuthStore.getState().logout()` + `window.location.href='/login'`; success-shape unwrap: `{success:1,data}` → `data` döndürür, `success:0` → throw.
  - Multipart helper: `apiUpload(url, formData)`.
- [AtakumBel-WebAdmin/src/lib/queryClient.ts](AtakumBel-WebAdmin/src/lib/queryClient.ts) — `QueryClient` (defaults: `retry:1`, `refetchOnWindowFocus:false`, `staleTime:30s`).
- [AtakumBel-WebAdmin/src/lib/types.ts](AtakumBel-WebAdmin/src/lib/types.ts) — `Paginated<T>`, `ApiResponse<T>`, ortak filtre tipleri.
- [AtakumBel-WebAdmin/src/main.tsx](AtakumBel-WebAdmin/src/main.tsx) — `<QueryClientProvider>` ile sarılır, devtools eklenir.

**authStore güncellemesi** — [AtakumBel-WebAdmin/src/store/authStore.ts](AtakumBel-WebAdmin/src/store/authStore.ts):
- `login(email,password)` artık `POST /admin/login` çağırır; token'ı `localStorage['atakum-admin-token']`'a yazar.
- `me: AdminProfile | null` alanı eklenir; başarılı login sonrası `GET /admin/me` ile doldurulur (Faz 0 gerektirir). Alternatif: token'ı JWT decode edip `id, role, permissions`'ı çıkar (`jwt-decode`).
- `hydrate()` token varsa `me`'yi tekrar çekmeyi dener; 401 olursa logout.
- Mevcut `'atakum-admin-session'` anahtarı kaldırılır.

**LoginPage** — [AtakumBel-WebAdmin/src/pages/LoginPage.tsx](AtakumBel-WebAdmin/src/pages/LoginPage.tsx) gerçek hata mesajlarını backend'den (`message`) gösterecek; 4xx/5xx ayrımı yapar.

**RequireAuth** — [AtakumBel-WebAdmin/src/components/auth/RequireAuth.tsx](AtakumBel-WebAdmin/src/components/auth/RequireAuth.tsx) `me` yüklenirken skeleton gösterir; permissions tabanlı `<RequirePermission module="news" action="update">` wrapper'ı eklenir (sidebar gizleme + sayfa guard).

---

### Faz 2 — Servis katmanı (modül başına 1 dosya)

[AtakumBel-WebAdmin/src/services/](AtakumBel-WebAdmin/src/services/) altında her backend modülü için bir servis ve query-key dosyası:

```
services/
  news.service.ts       # list, getById, create (multipart), update, remove
  newsGallery.service.ts
  events.service.ts
  eventGallery.service.ts
  departments.service.ts
  employees.service.ts
  councilMembers.service.ts
  councilDecisions.service.ts
  tenders.service.ts
  realEstateListings.service.ts
  publicNotices.service.ts
  services.service.ts
  serviceForms.service.ts
  suggestions.service.ts
  activityReports.service.ts
  auditReports.service.ts
  financialExpectationReports.service.ts
  performancePrograms.service.ts
  strategicPlans.service.ts
  kvkkDocuments.service.ts
  pressMaterials.service.ts
  facilities.service.ts
  directives.service.ts
  vicePresidents.service.ts
  president.service.ts
  encumens.service.ts
  encumenMembers.service.ts
  gatheringAreas.service.ts
  freeWifiPoints.service.ts
  wastePoints.service.ts
  marketplaces.service.ts
  admin.service.ts      # /me, list/create/update/delete adminler
```

Her servis tipik olarak şu fonksiyonları export eder:

```ts
list(params: ListParams): Promise<Paginated<T>>
getById(id: number): Promise<T>
create(payload: CreateDto | FormData): Promise<T>
update(id: number, payload: UpdateDto | FormData): Promise<T>
remove(id: number): Promise<void>
```

**Query key konvansiyonu:** `['news','list',params]`, `['news','detail',id]`. Mutation sonrası `queryClient.invalidateQueries({queryKey:['news']})`.

---

### Faz 3 — Reusable UI primitive'leri

Aynı CRUD desenini 25+ kez yazmamak için:

- [AtakumBel-WebAdmin/src/components/data/DataTable.tsx](AtakumBel-WebAdmin/src/components/data/DataTable.tsx) — kolon tanımı + pagination + arama + loading/error/empty state. Mevcut tabloların stiline uyumlu.
- [AtakumBel-WebAdmin/src/components/data/CrudDrawer.tsx](AtakumBel-WebAdmin/src/components/data/CrudDrawer.tsx) — sağdan açılan create/edit panel; react-hook-form + zod ile.
- [AtakumBel-WebAdmin/src/components/data/ConfirmDialog.tsx](AtakumBel-WebAdmin/src/components/data/ConfirmDialog.tsx) — silme onayı.
- [AtakumBel-WebAdmin/src/components/data/FileDropzone.tsx](AtakumBel-WebAdmin/src/components/data/FileDropzone.tsx) — single + multi (max 10) upload, mime-type guard backend ile aynı.
- [AtakumBel-WebAdmin/src/components/data/RichTextEditor.tsx](AtakumBel-WebAdmin/src/components/data/RichTextEditor.tsx) — News/Events `content` için (TipTap önerilir; basit kalmak istenirse `<textarea>`).
- [AtakumBel-WebAdmin/src/lib/uploads.ts](AtakumBel-WebAdmin/src/lib/uploads.ts) — `toUrl(path)` helper'ı: `${VITE_UPLOADS_BASE_URL}${path}`.

Mevcut [src/components/ui/](AtakumBel-WebAdmin/src/components/ui/) (StatsCard, StatusPill, Skeleton) korunur ve listelerde tekrar kullanılır.

---

### Faz 4 — Sayfaları gerçek API'ye bağlama (mock → query)

Her admin sayfası için pattern: `import { NEWS } from '../data/mockData'` kaldır → `useQuery({queryKey, queryFn: newsService.list})` ile değiştir, mutationlar `useMutation` + invalidate.

**Dönüştürülecek mevcut sayfalar:**
- [DashboardPage.tsx](AtakumBel-WebAdmin/src/pages/DashboardPage.tsx) — count'lar paralel `useQueries` ile çekilir (news, events, suggestions pending, tenders…). Activity feed için (Faz 0'da değerlendirilirse) bir audit log endpoint'i; yoksa kaldırılır.
- [NewsPage.tsx](AtakumBel-WebAdmin/src/pages/NewsPage.tsx) — `news.service`. Gallery yönetimi için detail drawer'ında ayrı sekme.
- [EventsPage.tsx](AtakumBel-WebAdmin/src/pages/EventsPage.tsx) — `events.service`; type filter (competition/activity).
- [AnnouncementsPage.tsx](AtakumBel-WebAdmin/src/pages/AnnouncementsPage.tsx) → **`/duyurular` rotası `publicNotices`'e maplenir**. Sayfa adı korunur, servis `publicNotices.service`.
- [DepartmentsPage.tsx](AtakumBel-WebAdmin/src/pages/DepartmentsPage.tsx) — `departments.service`; manager için employees dropdown.
- [ServicesPage.tsx](AtakumBel-WebAdmin/src/pages/ServicesPage.tsx) — `services.service` + nested `serviceForms`.
- [CouncilPage.tsx](AtakumBel-WebAdmin/src/pages/CouncilPage.tsx) — sekmeli: Üyeler / Kararlar / Encümenler / Encümen Üyeleri.
- [MediaPage.tsx](AtakumBel-WebAdmin/src/pages/MediaPage.tsx) — `pressMaterials.service` (basın materyali); haber/event galerileri ilgili kayıtlardan yönetilir.
- [UsersPage.tsx](AtakumBel-WebAdmin/src/pages/UsersPage.tsx) — `admin.service` (backend'de "Admin" diye geçiyor). Role + permissions matrix UI.

**Eklenecek yeni sayfalar (her biri standart CRUD + DataTable + CrudDrawer):**
İhaleler (`/ihaleler` → tenders), Emlak İlanları (`/emlak` → realEstateListings), Öneri/Projeler (`/oneriler` → suggestions, status onay akışı), Faaliyet Raporları (`/raporlar/faaliyet`), Denetim Raporları (`/raporlar/denetim`), Mali Beklenti Raporları (`/raporlar/mali`), Performans Programları (`/raporlar/performans`), Stratejik Planlar (`/raporlar/stratejik`), KVKK Belgeleri (`/kvkk`), Yönergeler (`/yonergeler` → directives), Tesisler (`/tesisler` → facilities), Çalışanlar (`/calisanlar` → employees), Başkan (`/baskan` → president single-record edit), Başkan Yardımcıları (`/baskan-yardimcilari` → vicePresidents), Toplanma Alanları (`/toplanma-alanlari` → gatheringAreas), Ücretsiz Wi-Fi (`/wifi` → freeWifiPoints), Atık Toplama (`/atik` → wastePoints), Pazaryerleri (`/pazaryerleri` → marketplaces).

**Sidebar** ([Sidebar.tsx](AtakumBel-WebAdmin/src/components/layout/Sidebar.tsx)) yeniden gruplanır:
- İçerik: Haberler, Duyurular, Etkinlikler, Medya, Basın
- Kurumsal: Başkan, Başkan Yrd., Müdürlükler, Çalışanlar, Meclis & Encümen
- Hizmetler: Hizmetler, Yönergeler, KVKK
- Şehir: Tesisler, Toplanma Alanları, Wi-Fi, Atık, Pazaryerleri, Emlak
- Yayınlar: İhaleler, Raporlar (alt menü), Stratejik Plan, Performans
- Etkileşim: Öneriler/Projeler
- Sistem: Yöneticiler

[navStore.ts](AtakumBel-WebAdmin/src/store/navStore.ts) ve sidebar item listesi bu gruplara göre yenilenir.

**Kaldırılacak sayfalar (backend karşılığı yok):**
- [CrmPage.tsx](AtakumBel-WebAdmin/src/pages/CrmPage.tsx) ve `/crm` rotası
- [PollsPage.tsx](AtakumBel-WebAdmin/src/pages/PollsPage.tsx) ve `/anketler` rotası
- [MapPage.tsx](AtakumBel-WebAdmin/src/pages/MapPage.tsx) ve `/harita` rotası (Toplanma/Wi-Fi/Atık ayrı sayfalar olarak gelecek)
- [SettingsPage.tsx](AtakumBel-WebAdmin/src/pages/SettingsPage.tsx) ve `/ayarlar` rotası
- Bunlara ait mockData export'ları ve sidebar/nav item'ları temizlenir.

**Mock data temizliği:** Tüm sayfalar geçtikten sonra [src/data/mockData.ts](AtakumBel-WebAdmin/src/data/mockData.ts) silinir; bağlı `MicroLabel`/`Sparkline` örneklerinden kullanılmayanlar atılır.

---

### Faz 5 — Permissions ve UI guard

Backend'in `permissions: { module: { read, create, update, delete } }` modeli frontend'de `useHasPermission(module, action)` hook'u ile kullanılır.
- Sidebar item'ları `read` izni yoksa gizlenir (superadmin her şeyi görür).
- Tablo "Yeni" butonu `create`, satır aksiyonları `update`/`delete` ile koşullanır.
- Sayfa düzeyinde `<RequirePermission>` guard'ı 403 ekranı gösterir.

---

## Doğrulama (end-to-end test)

1. **Backend ayağa kaldır:** `cd AtakumBel && npm install && npm run dev` (PostgreSQL ve `.env` hazır olmalı). `http://localhost:5000/api` 200 vermeli; `GET /api/news` boş veya dolu liste dönmeli.
2. **Frontend ayağa kaldır:** `cd AtakumBel-WebAdmin && npm install && npm run dev`. `.env` `VITE_API_BASE_URL` ayarlı.
3. **Login akışı:** Yanlış kimlik → backend `message`'ı görünür; doğru kimlik → token localStorage'a yazılır, dashboard yüklenir, header'da admin adı `me` endpoint'inden gelir.
4. **CRUD smoke testi (her modülden 1 örnek):**
   - News: yeni haber oluştur (3 görselli), listede görün, düzenle, sil.
   - Tenders: PDF yükle, listede görün.
   - Suggestions: status'u `pending → reviewed` yap; UI badge değişsin.
   - Employees + Departments: ilişkili dropdown çalışsın.
5. **Permissions:** Superadmin olmayan bir admin ile login → izin verilmeyen sayfalar sidebar'da görünmesin, doğrudan URL ile gidilince 403.
6. **401 davranışı:** localStorage'daki token'ı bozarak yenile → otomatik logout + `/login` yönlendirmesi.
7. **Pagination/search:** Listelerde sayfa değiştirme ve arama backend'e doğru `page`, `per_page`, `search` query'si yollasın (DevTools Network).
8. **File serving:** Yüklenen görseller `${VITE_UPLOADS_BASE_URL}/uploads/...` üzerinden render olsun.
9. **Tip güvenliği:** `npm run build` (vite + tsc) hatasız geçsin.

---

## Kritik Dosyalar (referans)

**Backend:**
- [AtakumBel/app.js](AtakumBel/app.js) — route mount sırası, CORS
- [AtakumBel/middlewares/authMiddleware.js](AtakumBel/middlewares/authMiddleware.js) — `protect`, `authorize`
- [AtakumBel/helpers/pagination.js](AtakumBel/helpers/pagination.js) — list endpoint'leri için tek tip
- [AtakumBel/middlewares/uploadMiddleware.js](AtakumBel/middlewares/uploadMiddleware.js) — multer config
- [AtakumBel/postman/AtakumBel-API.postman_collection.json](AtakumBel/postman/AtakumBel-API.postman_collection.json) — referans kontrat

**Frontend:**
- [AtakumBel-WebAdmin/src/App.tsx](AtakumBel-WebAdmin/src/App.tsx) — router; rota ekleme/silme buradan
- [AtakumBel-WebAdmin/src/store/authStore.ts](AtakumBel-WebAdmin/src/store/authStore.ts) — login akışı
- [AtakumBel-WebAdmin/src/components/layout/Sidebar.tsx](AtakumBel-WebAdmin/src/components/layout/Sidebar.tsx) — nav grupları
- [AtakumBel-WebAdmin/src/data/mockData.ts](AtakumBel-WebAdmin/src/data/mockData.ts) — silinecek
- [AtakumBel-WebAdmin/src/components/ui/Skeleton.tsx](AtakumBel-WebAdmin/src/components/ui/Skeleton.tsx) — loading state'lerinde tekrar kullanılır

---

## Uygulama sırası (önerilen)

1. Faz 0 — backend audit + `/admin/me` + eksik gallery list endpoint'leri
2. Faz 1 — axios + react-query + auth refactor + login canlıya bağlanır
3. Faz 3 — DataTable/CrudDrawer/FileDropzone primitive'leri (Faz 4 öncesi)
4. Faz 2 — servisler (modül modül, Faz 4 ile paralel ilerletilebilir)
5. Faz 4 — sayfa dönüşümleri (önce News/Events/Departments/Users gibi yüksek değerli, sonra raporlar)
6. Faz 5 — permission guard'lar
7. mockData.ts silme + final build + e2e smoke
