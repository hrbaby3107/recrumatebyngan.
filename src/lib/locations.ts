export interface LocationOption {
  /** Canonical value stored on jobs / candidates (English, matches job filters). */
  value: string;
  /** Local-language name shown next to it. */
  vi: string;
  group: "Remote" | "Việt Nam" | "International";
  keywords?: string;
}

const remote: LocationOption[] = [
  { value: "Remote (Worldwide)", vi: "Làm việc từ xa toàn cầu", group: "Remote", keywords: "remote wfh tu xa" },
  { value: "Remote (APAC)", vi: "Làm việc từ xa khu vực châu Á - Thái Bình Dương", group: "Remote", keywords: "remote apac asia chau a" },
  { value: "Remote (Vietnam)", vi: "Làm việc từ xa tại Việt Nam", group: "Remote", keywords: "remote viet nam" },
];

const vietnam: LocationOption[] = [
  { value: "Ho Chi Minh City", vi: "TP. Hồ Chí Minh", group: "Việt Nam", keywords: "tphcm tp.hcm hcm hcmc sai gon saigon" },
  { value: "Hanoi", vi: "Hà Nội", group: "Việt Nam", keywords: "ha noi hn" },
  { value: "Da Nang", vi: "Đà Nẵng", group: "Việt Nam", keywords: "danang" },
  { value: "Hai Phong", vi: "Hải Phòng", group: "Việt Nam" },
  { value: "Can Tho", vi: "Cần Thơ", group: "Việt Nam" },
  { value: "Hue", vi: "Huế", group: "Việt Nam", keywords: "thua thien hue" },
  { value: "Binh Duong", vi: "Bình Dương", group: "Việt Nam", keywords: "thu dau mot di an" },
  { value: "Dong Nai", vi: "Đồng Nai", group: "Việt Nam", keywords: "bien hoa" },
  { value: "Vung Tau", vi: "Vũng Tàu (Bà Rịa - Vũng Tàu)", group: "Việt Nam", keywords: "ba ria vung tau brvt" },
  { value: "Nha Trang", vi: "Nha Trang (Khánh Hòa)", group: "Việt Nam", keywords: "khanh hoa" },
  { value: "Da Lat", vi: "Đà Lạt (Lâm Đồng)", group: "Việt Nam", keywords: "dalat lam dong" },
  { value: "Quang Ninh", vi: "Quảng Ninh (Hạ Long)", group: "Việt Nam", keywords: "ha long halong" },
  { value: "Bac Ninh", vi: "Bắc Ninh", group: "Việt Nam" },
  { value: "Thai Nguyen", vi: "Thái Nguyên", group: "Việt Nam" },
  { value: "Ninh Binh", vi: "Ninh Bình", group: "Việt Nam" },
  { value: "Thanh Hoa", vi: "Thanh Hóa", group: "Việt Nam" },
  { value: "Nghe An", vi: "Nghệ An (Vinh)", group: "Việt Nam", keywords: "vinh" },
  { value: "Quang Nam", vi: "Quảng Nam (Hội An)", group: "Việt Nam", keywords: "hoi an tam ky" },
  { value: "Quang Ngai", vi: "Quảng Ngãi", group: "Việt Nam" },
  { value: "Binh Dinh", vi: "Bình Định (Quy Nhơn)", group: "Việt Nam", keywords: "quy nhon" },
  { value: "Gia Lai", vi: "Gia Lai (Pleiku)", group: "Việt Nam", keywords: "pleiku" },
  { value: "Dak Lak", vi: "Đắk Lắk (Buôn Ma Thuột)", group: "Việt Nam", keywords: "buon ma thuot daklak" },
  { value: "Long An", vi: "Long An", group: "Việt Nam" },
  { value: "Tien Giang", vi: "Tiền Giang (Mỹ Tho)", group: "Việt Nam", keywords: "my tho" },
  { value: "An Giang", vi: "An Giang (Long Xuyên)", group: "Việt Nam", keywords: "long xuyen" },
  { value: "Kien Giang", vi: "Kiên Giang (Phú Quốc)", group: "Việt Nam", keywords: "phu quoc rach gia" },
  { value: "Ca Mau", vi: "Cà Mau", group: "Việt Nam" },
  { value: "Lao Cai", vi: "Lào Cai (Sa Pa)", group: "Việt Nam", keywords: "sapa sa pa" },
];

const countries: [string, string, string?][] = [
  ["Canada", "Canada"],
  ["Japan", "Nhật Bản", "tokyo osaka"],
  ["South Korea", "Hàn Quốc", "korea seoul"],
  ["Thailand", "Thái Lan", "bangkok"],
  ["Singapore", "Singapore"],
  ["Malaysia", "Malaysia", "kuala lumpur"],
  ["Indonesia", "Indonesia", "jakarta"],
  ["Philippines", "Philippines", "manila"],
  ["Cambodia", "Campuchia", "phnom penh"],
  ["Laos", "Lào", "vientiane"],
  ["Myanmar", "Myanmar"],
  ["China", "Trung Quốc", "beijing shanghai shenzhen"],
  ["Hong Kong", "Hồng Kông"],
  ["Taiwan", "Đài Loan", "taipei"],
  ["India", "Ấn Độ", "bangalore mumbai"],
  ["Australia", "Úc", "sydney melbourne"],
  ["New Zealand", "New Zealand", "auckland"],
  ["United States", "Hoa Kỳ (Mỹ)", "usa us america my"],
  ["Mexico", "Mexico"],
  ["Brazil", "Brazil"],
  ["Argentina", "Argentina"],
  ["Chile", "Chile"],
  ["Colombia", "Colombia"],
  ["United Kingdom", "Anh", "uk england london britain"],
  ["Ireland", "Ireland", "dublin"],
  ["Germany", "Đức", "berlin munich"],
  ["France", "Pháp", "paris"],
  ["Netherlands", "Hà Lan", "amsterdam holland"],
  ["Belgium", "Bỉ"],
  ["Spain", "Tây Ban Nha", "madrid barcelona"],
  ["Portugal", "Bồ Đào Nha", "lisbon"],
  ["Italy", "Ý", "rome milan"],
  ["Switzerland", "Thụy Sĩ", "zurich"],
  ["Austria", "Áo", "vienna"],
  ["Sweden", "Thụy Điển", "stockholm"],
  ["Norway", "Na Uy", "oslo"],
  ["Denmark", "Đan Mạch", "copenhagen"],
  ["Finland", "Phần Lan", "helsinki"],
  ["Poland", "Ba Lan", "warsaw"],
  ["Czech Republic", "Séc", "prague czechia"],
  ["Russia", "Nga", "moscow"],
  ["Ukraine", "Ukraina"],
  ["Turkey", "Thổ Nhĩ Kỳ", "istanbul"],
  ["United Arab Emirates", "UAE (Dubai, Abu Dhabi)", "uae dubai abu dhabi"],
  ["Saudi Arabia", "Ả Rập Xê Út", "riyadh"],
  ["Qatar", "Qatar", "doha"],
  ["Israel", "Israel", "tel aviv"],
  ["Egypt", "Ai Cập", "cairo"],
  ["South Africa", "Nam Phi", "cape town johannesburg"],
  ["Nigeria", "Nigeria", "lagos"],
  ["Kenya", "Kenya", "nairobi"],
];

const international: LocationOption[] = countries.map(([value, vi, keywords]) => ({
  value,
  vi,
  group: "International",
  keywords,
}));

export function getLocationOptions(includeRemote = true): LocationOption[] {
  return includeRemote
    ? [...remote, ...vietnam, ...international]
    : [...vietnam, ...international];
}
