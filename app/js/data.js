/**
 * DATA BANK - BÀI 3: NGUYÊN TỐ HÓA HỌC (KHTN 7)
 */

// 1. 20 nguyên tố hóa học đầu tiên (Bảng 3.1)
const ELEMENTS_DATA = [
  { z: 1, name: "Hydrogen", symbol: "H", mass: 1, latin: "Hydrogenium", type: "Phi kim", state: "Khí", note: "Nguyên tố nhẹ nhất vũ trụ, tạo nên nước" },
  { z: 2, name: "Helium", symbol: "He", mass: 4, latin: "Helium", type: "Khí hiếm", state: "Khí", note: "Bơm khí cầu, không cháy nổ" },
  { z: 3, name: "Lithium", symbol: "Li", mass: 7, latin: "Lithium", type: "Kim loại", state: "Rắn", note: "Kim loại nhẹ nhất, pin sạc điện thoại, xe điện" },
  { z: 4, name: "Beryllium", symbol: "Be", mass: 9, latin: "Beryllium", type: "Kim loại", state: "Rắn", note: "Hợp kim cứng nhẹ cho hàng không vũ trụ" },
  { z: 5, name: "Boron", symbol: "B", mass: 11, latin: "Borium", type: "Á kim", state: "Rắn", note: "Sản xuất thủy tinh chịu nhiệt pyrex, gốm sứ" },
  { z: 6, name: "Carbon", symbol: "C", mass: 12, latin: "Carboneum", type: "Phi kim", state: "Rắn", note: "Cốt lõi của mọi sự sống, than chì, kim cương" },
  { z: 7, name: "Nitrogen", symbol: "N", mass: 14, latin: "Nitrogenium", type: "Phi kim", state: "Khí", note: "Chiếm 78% thể tích không khí, đạm cho cây" },
  { z: 8, name: "Oxygen", symbol: "O", mass: 16, latin: "Oxygenium", type: "Phi kim", state: "Khí", note: "Duy trì sự sống và sự cháy, chiếm 65% khối lượng người" },
  { z: 9, name: "Fluorine", symbol: "F", mass: 19, latin: "Fluorum", type: "Phi kim", state: "Khí", note: "Thành phần ngừa sâu răng trong kem đánh răng" },
  { z: 10, name: "Neon", symbol: "Ne", mass: 20, latin: "Neon", type: "Khí hiếm", state: "Khí", note: "Đèn quảng cáo phát ánh sáng đỏ cam rực rỡ" },
  { z: 11, name: "Sodium", symbol: "Na", mass: 23, latin: "Natrium", type: "Kim loại", state: "Rắn", note: "Thành phần muối ăn (NaCl), duy trì điện giải cơ thể" },
  { z: 12, name: "Magnesium", symbol: "Mg", mass: 24, latin: "Magnesium", type: "Kim loại", state: "Rắn", note: "Cháy sáng chói làm pháo hoa, trung tâm diệp lục tố" },
  { z: 13, name: "Aluminium", symbol: "Al", mass: 27, latin: "Aluminium", type: "Kim loại", state: "Rắn", note: "Kim loại phổ biến nhất vỏ Trái Đất, làm vỏ máy bay" },
  { z: 14, name: "Silicon", symbol: "Si", mass: 28, latin: "Silicium", type: "Á kim", state: "Rắn", note: "Vật liệu bán dẫn, vi mạch chip máy tính, cát thạch anh" },
  { z: 15, name: "Phosphorus", symbol: "P", mass: 31, latin: "Phosphorus", type: "Phi kim", state: "Rắn", note: "Đầu que diêm, phân bón, cấu tạo xương răng & DNA" },
  { z: 16, name: "Sulfur", symbol: "S", mass: 32, latin: "Sulfur", type: "Phi kim", state: "Rắn", note: "Chất rắn màu vàng, sản xuất sulfuric acid, diêm sinh" },
  { z: 17, name: "Chlorine", symbol: "Cl", mass: 35.5, latin: "Chlorum", type: "Phi kim", state: "Khí", note: "Khí màu vàng lục khử trùng nước sinh hoạt, hồ bơi" },
  { z: 18, name: "Argon", symbol: "Ar", mass: 40, latin: "Argon", type: "Khí hiếm", state: "Khí", note: "Khí trơ bảo vệ dây tóc bóng đèn, môi trường hàn kim loại" },
  { z: 19, name: "Potassium", symbol: "K", mass: 39, latin: "Kalium", type: "Kim loại", state: "Rắn", note: "Phân bón kali, khoáng chất thiết yếu điều hòa tim mạch" },
  { z: 20, name: "Calcium", symbol: "Ca", mass: 40, latin: "Calcium", type: "Kim loại", state: "Rắn", note: "Cấu tạo xương răng, vỏ sò, sữa và chế phẩm từ sữa" }
];

// 2. Dữ liệu thành phần cơ thể người (Hình 3.2 SGK)
const BODY_COMPOSITION_DATA = [
  { element: "Oxygen", symbol: "O", percent: 65, color: "#38bdf8", role: "Thành phần chính của nước (H2O) và các hợp chất hữu cơ sinh học" },
  { element: "Carbon", symbol: "C", percent: 18, color: "#475569", role: "Khung xương của mọi đại phân tử sinh học (protein, lipid, glucid, ADN)" },
  { element: "Hydrogen", symbol: "H", percent: 10, color: "#a855f7", role: "Thành phần của nước và tất cả các liên kết hữu cơ" },
  { element: "Nitrogen", symbol: "N", percent: 3, color: "#3b82f6", role: "Thành phần cơ bản của acid amin, protein và acid nucleic" },
  { element: "Calcium", symbol: "Ca", percent: 1.5, color: "#f59e0b", role: "Cấu tạo mô xương, men răng, dẫn truyền xung thần kinh" },
  { element: "Phosphorus", symbol: "P", percent: 1.0, color: "#ef4444", role: "Hợp phần của xương, màng tế bào (phospholipid) và năng lượng ATP" },
  { element: "Các nguyên tố khác (K, S, Na, Cl, Mg, Fe...)", symbol: "Khác", percent: 1.5, color: "#10b981", role: "Nguyên tố vi lượng và điện giải tham gia điều hòa sinh hóa" }
];

// 3. Bộ 10 câu hỏi Trắc nghiệm
const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Tập hợp các nguyên tử có cùng số hạt nào sau đây thuộc cùng một nguyên tố hóa học?",
    options: ["Neutron", "Proton", "Electron vỏ ngoài cùng", "Tổng số proton và neutron"],
    correctIndex: 1,
    explanation: "Định nghĩa cốt lõi: Nguyên tố hóa học là tập hợp những nguyên tử cùng loại, có cùng số proton trong hạt nhân."
  },
  {
    id: 2,
    question: "Kí hiệu hóa học của nguyên tố Carbon là gì?",
    options: ["Ca", "C", "Cu", "Cl"],
    correctIndex: 1,
    explanation: "Carbon được biểu diễn bằng 1 chữ cái in hoa là C. Chú ý phân biệt: Ca (Calcium), Cu (Copper), Cl (Chlorine)."
  },
  {
    id: 3,
    question: "Kí hiệu hóa học nào sau đây được viết đúng theo quy ước danh pháp?",
    options: ["AL", "ca", "Ca", "NA"],
    correctIndex: 2,
    explanation: "Quy ước: Nếu kí hiệu gồm 2 chữ cái thì chữ thứ nhất viết IN HOA, chữ thứ hai bắt buộc viết thường. Do đó chỉ có Ca là đúng."
  },
  {
    id: 4,
    question: "Số hiệu nguyên tử (Z) của nguyên tố Oxygen là bao nhiêu?",
    options: ["6", "7", "8", "16"],
    correctIndex: 2,
    explanation: "Oxygen nằm ở vị trí số 8 trong bảng tuần hoàn (Z = 8, hạt nhân có 8 proton). Khối lượng nguyên tử của Oxygen xấp xỉ 16 amu."
  },
  {
    id: 5,
    question: "Nguyên tố nào chiếm tỉ lệ phần trăm khối lượng lớn nhất trong cơ thể người (Hình 3.2)?",
    options: ["Carbon", "Hydrogen", "Oxygen (khoảng 65%)", "Nitrogen"],
    correctIndex: 2,
    explanation: "Theo Hình 3.2, Oxygen chiếm khoảng 65% khối lượng cơ thể người vì cơ thể có tới hơn 60-70% là nước (H2O), trong đó Oxygen nặng gấp 16 lần Hydrogen."
  },
  {
    id: 6,
    question: "Nguyên tố Potassium có kí hiệu hóa học chuẩn xác là:",
    options: ["P", "Po", "Pt", "K"],
    correctIndex: 3,
    explanation: "Kí hiệu hóa học của Potassium là K (xuất phát từ tên gốc tiếng Latin/Ả Rập là Kalium). Còn P là Phosphorus."
  },
  {
    id: 7,
    question: "Khối lượng nguyên tử của Sodium (Na) theo Bảng 3.1 là bao nhiêu?",
    options: ["11 amu", "23 amu", "24 amu", "39 amu"],
    correctIndex: 1,
    explanation: "Sodium có số hiệu Z = 11 và khối lượng nguyên tử xấp xỉ bằng 23 amu."
  },
  {
    id: 8,
    question: "Một nguyên tử có 17 proton trong hạt nhân. Tên gọi theo danh pháp quốc tế (IUPAC) của nguyên tố này là:",
    options: ["Sulfur", "Chlorine", "Argon", "Phosphorus"],
    correctIndex: 1,
    explanation: "Nguyên tử có Z = 17 proton chính là nguyên tố Chlorine (kí hiệu Cl, khối lượng xấp xỉ 35.5 amu)."
  },
  {
    id: 9,
    question: "Bốn nguyên tố thiết yếu chiếm tới khoảng 96% khối lượng cơ thể người là:",
    options: ["C, H, O, Ca", "C, H, O, P", "C, H, O, N", "O, Ca, P, Fe"],
    correctIndex: 2,
    explanation: "Bốn nguyên tố sinh học chính là Carbon (18%), Hydrogen (10%), Oxygen (65%), Nitrogen (3%) - viết tắt là C, H, O, N."
  },
  {
    id: 10,
    question: "Nguyên tử X có tổng số hạt p, n, e là 40, trong đó số hạt mang điện nhiều hơn số hạt không mang điện là 12. X là nguyên tố nào?",
    options: ["Magnesium", "Aluminium", "Silicon", "Sodium"],
    correctIndex: 1,
    explanation: "Gọi số hạt là p, e, n (p = e). Ta có: 2p + n = 40 và 2p - n = 12. Cộng hai vế => 4p = 52 => p = 13. Z = 13 là Aluminium (Al)."
  }
];

// 4. Bộ 3 câu hỏi Tự luận
const ESSAY_QUESTIONS = [
  {
    id: 1,
    title: "Câu 1: Đặc trưng của nguyên tố hóa học",
    prompt: "Vì sao số proton lại được coi là dấu hiệu đặc trưng quan trọng nhất để phân biệt các nguyên tố hóa học khác nhau?",
    sampleAnswer: "Vì mọi nguyên tử có cùng số proton trong hạt nhân đều có tính chất hóa học giống nhau và thuộc về cùng một nguyên tố hóa học. Nếu số proton thay đổi thì nguyên tử đó đã chuyển thành nguyên tố khác hoàn toàn."
  },
  {
    id: 2,
    title: "Câu 2: Quy ước kí hiệu hóa học",
    prompt: "Hãy nêu quy tắc viết kí hiệu hóa học (đối với nguyên tố có 1 chữ cái và 2 chữ cái). Lấy 2 ví dụ viết đúng và 2 trường hợp viết sai thường gặp.",
    sampleAnswer: "Quy tắc: Kí hiệu gồm 1 chữ cái viết in hoa (ví dụ: H, C, N, O). Kí hiệu gồm 2 chữ cái thì chữ đầu viết in hoa, chữ thứ hai bắt buộc viết thường (ví dụ đúng: Ca, Na, He, Cl; ví dụ sai: CA, na, HE, cL)."
  },
  {
    id: 3,
    title: "Câu 3: Phân tích thành phần nguyên tố cơ thể người",
    prompt: "Dựa vào Hình 3.2 SGK, giải thích vì sao Oxygen lại chiếm tỉ lệ khối lượng lớn nhất (khoảng 65%) trong cơ thể người, dù xét về số lượng nguyên tử thì Hydrogen trong nước (H2O) nhiều gấp đôi Oxygen?",
    sampleAnswer: "Vì nước chiếm phần lớn khối lượng cơ thể (trên 60-70%). Trong 1 phân tử nước H2O có 2 nguyên tử H và 1 nguyên tử O. Tuy nhiên, khối lượng 1 nguyên tử O là 16 amu, trong khi 2 nguyên tử H chỉ nặng 2 amu. Khối lượng nguyên tử O gấp 16 lần H, do đó Oxygen chiếm tới 65% khối lượng cơ thể người."
  }
];

// 5. Ngân hàng 15 câu hỏi "Ai là triệu phú Hóa học"
const MILLIONAIRE_QUESTIONS = [
  {
    level: 1,
    money: "200.000 đ",
    question: "Kí hiệu hóa học của nguyên tố Hydrogen là gì?",
    options: ["Hy", "Hd", "H", "Hg"],
    correctIndex: 2
  },
  {
    level: 2,
    money: "400.000 đ",
    question: "Kí hiệu 'Fe' biểu diễn cho nguyên tố kim loại nào?",
    options: ["Đồng (Copper)", "Sắt (Iron)", "Chì (Lead)", "Kẽm (Zinc)"],
    correctIndex: 1
  },
  {
    level: 3,
    money: "600.000 đ",
    question: "Quy ước: Khi kí hiệu hóa học gồm hai chữ cái, chữ cái thứ hai phải được viết như thế nào?",
    options: ["Viết in hoa", "Viết thường", "Viết in nghiêng", "Viết gạch chân"],
    correctIndex: 1
  },
  {
    level: 4,
    money: "1.000.000 đ",
    question: "Khí duy trì sự sống hô hấp và sự cháy trong khí quyển có kí hiệu hóa học là:",
    options: ["N", "H", "O", "C"],
    correctIndex: 2
  },
  {
    level: 5,
    milestone: true,
    money: "2.000.000 đ",
    question: "Z = 2 là số hiệu nguyên tử của chất khí hiếm nhẹ dùng để bơm bóng bay nào?",
    options: ["Neon", "Argon", "Krypton", "Helium"],
    correctIndex: 3
  },
  {
    level: 6,
    money: "3.000.000 đ",
    question: "Tên gọi quốc tế theo danh pháp IUPAC của kim loại Vàng là gì?",
    options: ["Silver", "Gold (Aurum)", "Copper", "Platinum"],
    correctIndex: 1
  },
  {
    level: 7,
    money: "6.000.000 đ",
    question: "Kí hiệu hóa học 'Na' của Sodium bắt nguồn từ danh từ Latin nào?",
    options: ["Nitrogen", "Niobi", "Natrium", "Nickel"],
    correctIndex: 2
  },
  {
    level: 8,
    money: "10.000.000 đ",
    question: "Nguyên tố nào có số hạt proton trong hạt nhân đúng bằng 6?",
    options: ["Nitrogen", "Oxygen", "Boron", "Carbon"],
    correctIndex: 3
  },
  {
    level: 9,
    money: "14.000.000 đ",
    question: "Nguyên tố kim loại nhẹ, dẫn nhiệt tốt, có Z = 13 làm vỏ máy bay là:",
    options: ["Magnesium", "Aluminium", "Silicon", "Calcium"],
    correctIndex: 1
  },
  {
    level: 10,
    milestone: true,
    money: "22.000.000 đ",
    question: "Khối lượng nguyên tử chuẩn của Carbon (Z = 6) bằng bao nhiêu amu?",
    options: ["6 amu", "12 amu", "14 amu", "16 amu"],
    correctIndex: 1
  },
  {
    level: 11,
    money: "30.000.000 đ",
    question: "Theo Hình 3.2, nguyên tố nào chiếm khoảng 18% khối lượng cơ thể người?",
    options: ["Oxygen", "Carbon", "Hydrogen", "Nitrogen"],
    correctIndex: 1
  },
  {
    level: 12,
    money: "40.000.000 đ",
    question: "Trong 20 nguyên tố đầu tiên, nguyên tố phi kim nào có khối lượng nguyên tử lẻ là 35.5 amu?",
    options: ["Argon", "Potassium", "Sulfur", "Chlorine"],
    correctIndex: 3
  },
  {
    level: 13,
    money: "60.000.000 đ",
    question: "Khoáng chất cấu tạo cốt lõi của hệ xương và răng chứa nhiều nguyên tố nào nhất?",
    options: ["Sắt (Iron)", "Calcium (Ca)", "Đồng (Cu)", "Kẽm (Zn)"],
    correctIndex: 1
  },
  {
    level: 14,
    money: "85.000.000 đ",
    question: "Kí hiệu hóa học 'K' của Potassium bắt nguồn từ tên cổ tiếng Ả Rập/Latinh nào?",
    options: ["Kripton", "Kation", "Kalium", "Kalcite"],
    correctIndex: 2
  },
  {
    level: 15,
    milestone: true,
    money: "150.000.000 đ",
    question: "Tỉ lệ phần trăm khối lượng xấp xỉ của nguyên tố Hydrogen trong cơ thể người là:",
    options: ["65%", "18%", "3%", "10%"],
    correctIndex: 3
  }
];
