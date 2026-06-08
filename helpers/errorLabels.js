"use strict";

const FIELD_LABELS = {
  id: "kimlik",
  title: "başlık",
  name: "ad",
  record_type: "kayıt türü",
  department_id: "müdürlük kimliği",
  manager_employee_id: "birim müdürü kimliği",
  page: "sayfa numarası",
  per_page: "sayfa başına kayıt sayısı",
  ids: "kimlik listesi",
  search: "arama metni",
  q: "arama sorgusu",
  limit: "sonuç limiti",
  is_active: "aktiflik durumu",
  role: "rol",
  permissions: "yetkiler",
  first_name: "ad",
  last_name: "soyad",
  email: "e-posta",
  phone_number: "telefon numarası",
  password: "şifre",
  spot: "spot (özet)",
  content: "içerik",
  description: "açıklama",
  address: "adres",
  biography: "biyografi",
  message: "mesaj",
  type: "tür",
  start_date: "başlangıç tarihi",
  end_date: "bitiş tarihi",
  event_time: "etkinlik saati",
  publish_date: "yayın tarihi",
  latitude: "enlem",
  longitude: "boylam",
  day_of_week: "gün",
  political_party: "siyasi parti",
  dahili_no: "dahili numara",
  title_field: "ünvan",
  department_ids: "müdürlük kimlikleri",
  president_department_ids: "başkan müdürlük kimlikleri",
  social_media_accounts: "sosyal medya hesapları",
  education: "eğitim bilgileri",
  political_career: "siyasi kariyer",
  work_life: "iş hayatı",
  birth_place: "doğum yeri",
  birth_year: "doğum yılı",
  grown_place: "büyüdüğü yer",
  marital_status: "medeni hal",
  project_name: "proje adı",
  project_purpose: "proje amacı",
  application_duration: "uygulama süresi",
  total_budget: "toplam bütçe",
  location: "konum",
  stakeholders: "paydaşlar",
  beneficiaries: "faydalanıcılar",
  main_activities: "ana faaliyetler",
  expected_results: "beklenen sonuçlar",
  status: "durum",
  starts_at: "başlangıç tarihi",
  ends_at: "bitiş tarihi",
  redirect_url: "yönlendirme adresi",
  clear_image: "görsel temizleme",
  tender_number: "ihale numarası",
  decision_no: "karar numarası",
  summary: "özet",
  full_text: "tam metin",
  presidents: "başkanlar",
  timeline: "zaman çizelgesi",
  reports_to_president: "başkana bağlılık",
  is_unit_manager: "birim müdürü",
  is_contact_person: "irtibat kişisi",
};

const ACTION_LABELS = {
  read: "okuma",
  create: "oluşturma",
  update: "güncelleme",
  delete: "silme",
};

const MODULE_LABELS = {
  admins: "yöneticiler",
  departments: "birimler",
  services: "hizmetler",
  projects: "projeler",
  employees: "çalışanlar",
  presidents: "başkan",
  vicePresidents: "başkan yardımcıları",
  councilMembers: "meclis üyeleri",
  councilDecisions: "meclis kararları",
  publicNotices: "kamu duyuruları",
  tenders: "ihaleler",
  realEstateListings: "taşınmaz ilanları",
  news: "haberler",
  pressReleases: "basın bültenleri",
  events: "etkinlikler",
  facilities: "tesisler",
  suggestions: "proje önerileri",
  directives: "genelgeler",
  pressMaterials: "basın materyalleri",
  photoGallery: "foto galeri",
  activityReports: "faaliyet raporları",
  financialExpectationReports: "mali durum beklenti raporları",
  performancePrograms: "performans programları",
  auditReports: "denetim raporları",
  strategicPlans: "stratejik planlar",
  kvkkDocuments: "KVKK belgeleri",
  departmentDocuments: "müdürlük evrakları",
  adminAuditLogs: "işlem günlüğü",
  contentPopups: "açılır pencereler",
  institutionHistory: "kurum tarihçesi",
  workplaceLicenses: "işyeri ruhsatları",
};

function labelModule(moduleName) {
  return MODULE_LABELS[moduleName] || moduleName;
}

const RECORD_TYPE_LABELS = {
  public_notice: "kamu duyurusu",
  tender: "ihale",
  council_decision: "meclis kararı",
  real_estate_listing: "taşınmaz ilanı",
};

function labelField(name) {
  return FIELD_LABELS[name] || name;
}

function labelAction(action) {
  return ACTION_LABELS[action] || action;
}

function labelRecordType(recordType) {
  return RECORD_TYPE_LABELS[recordType] || recordType;
}

function labelRecordTypes(recordTypes) {
  return recordTypes.map(labelRecordType).join(", ");
}

module.exports = {
  labelField,
  labelAction,
  labelRecordType,
  labelRecordTypes,
  labelModule,
};
