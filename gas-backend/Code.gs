/**
 * GOOGLE APPS SCRIPT BACKEND (Code.gs)
 * Dự án: Bài 3 - Nguyên tố hóa học (KHTN 7)
 * Giáo viên: Thầy Lê Văn Thắng
 * 
 * QUY CHUẨN CƠ SỞ DỮ LIỆU GOOGLE SHEET:
 * 1. Mỗi học sinh chỉ xuất hiện DUY NHẤT 1 DÒNG (dựa theo Tên học sinh).
 * 2. Cả TRẮC NGHIỆM và TỰ LUẬN đều thể hiện trên CÙNG MỘT DÒNG.
 * 3. Tách riêng từng cột cho từng câu:
 *    - Cột TN 1 -> TN 10 (thể hiện đáp án học sinh chọn A/B/C/D và kết quả Đúng/Sai)
 *    - Cột TL 1 -> TL 3 (thể hiện chi tiết nội dung trả lời từng câu tự luận)
 * 4. Tự động cập nhật nếu học sinh nộp thêm bài hoặc Thầy Thắng chấm điểm.
 */

var SPREADSHEET_ID = "14HTSPKPzgeHm26ozec92-zk5zI-170nKaMCu2QZFW9Q";

// Danh sách các cột tiêu chuẩn trên Google Sheet
var SHEET_HEADERS = [
  "Mã / Tên Học sinh",        // Cột 1 (Key định danh học sinh)
  "Thời gian cập nhật",       // Cột 2
  "Điểm Trắc nghiệm",         // Cột 3
  "Số câu TN đúng",           // Cột 4
  "TN Câu 1",                 // Cột 5
  "TN Câu 2",                 // Cột 6
  "TN Câu 3",                 // Cột 7
  "TN Câu 4",                 // Cột 8
  "TN Câu 5",                 // Cột 9
  "TN Câu 6",                 // Cột 10
  "TN Câu 7",                 // Cột 11
  "TN Câu 8",                 // Cột 12
  "TN Câu 9",                 // Cột 13
  "TN Câu 10",                // Cột 14
  "Điểm Tự luận",             // Cột 15
  "TL Câu 1 (Đặc trưng p)",   // Cột 16
  "TL Câu 2 (Quy ước KHHH)",  // Cột 17
  "TL Câu 3 (O trong cơ thể)",// Cột 18
  "Nhận xét của Thầy Thắng"   // Cột 19
];

function getTargetSheet() {
  var ss;
  try {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (err) {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }
  return ss.getActiveSheet();
}

function initSheetHeaders(sheet) {
  sheet.clear(); // Làm mới tiêu đề bảng cho chuẩn xác theo yêu cầu
  sheet.appendRow(SHEET_HEADERS);

  // Định dạng hàng tiêu đề
  var headerRange = sheet.getRange(1, 1, 1, SHEET_HEADERS.length);
  headerRange.setBackground("#0284c7");
  headerRange.setFontColor("#ffffff");
  headerRange.setFontWeight("bold");
  headerRange.setHorizontalAlignment("center");
  headerRange.setWrap(true);
  sheet.setRowHeight(1, 38);
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(1);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Khóa tránh xung đột đồng thời

  try {
    var sheet = getTargetSheet();

    // Nếu bảng chưa có tiêu đề đúng chuẩn, tiến hành thiết lập
    if (sheet.getLastRow() === 0 || sheet.getRange(1, 1).getValue() !== SHEET_HEADERS[0]) {
      initSheetHeaders(sheet);
    }

    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = {
        studentName: "Nguyễn Văn An - Lớp 7A",
        activityType: "Test",
        quizScore: "10/10",
        quizCorrect: "10/10",
        quizAnswers: { 1: "B (Đúng)", 2: "B (Đúng)" },
        essayAnswers: { cau1: "Mẫu câu 1", cau2: "Mẫu câu 2", cau3: "Mẫu câu 3" },
        essayScore: "9.5/10",
        teacherComment: "Rất tốt"
      };
    }

    var studentName = (data.studentName || "").trim();
    if (!studentName) {
      studentName = "Học sinh ẩn danh";
    }

    var timestamp = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss");

    // 1. TÌM XEM HỌC SINH ĐÃ CÓ DÒNG NÀO TRONG SHEET CHƯA
    var lastRow = sheet.getLastRow();
    var rowIndex = -1; // -1 nghĩa là chưa có

    if (lastRow > 1) {
      var nameColumnValues = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (var i = 0; i < nameColumnValues.length; i++) {
        if (nameColumnValues[i][0].toString().trim().toLowerCase() === studentName.toLowerCase()) {
          rowIndex = i + 2; // +2 vì index bắt đầu từ 0 và dòng 1 là tiêu đề
          break;
        }
      }
    }

    // Lấy dữ liệu dòng hiện tại nếu đã có, hoặc tạo mảng rỗng nếu là học sinh mới
    var rowData;
    if (rowIndex > 0) {
      rowData = sheet.getRange(rowIndex, 1, 1, SHEET_HEADERS.length).getValues()[0];
    } else {
      rowData = new Array(SHEET_HEADERS.length).fill("");
      rowData[0] = studentName; // Cột 1: Tên học sinh
    }

    // Cột 2: Cập nhật thời gian mới nhất
    rowData[1] = timestamp;

    // 2. CẬP NHẬT PHẦN TRẮC NGHIỆM (NẾU GÓI DỮ LIỆU CÓ)
    if (data.quizScore !== undefined) {
      rowData[2] = data.quizScore;
    }
    if (data.quizCorrect !== undefined) {
      rowData[3] = data.quizCorrect;
    }
    if (data.quizAnswers) {
      // 10 câu trắc nghiệm nằm ở cột index từ 4 đến 13 (Cột E đến N)
      for (var q = 1; q <= 10; q++) {
        if (data.quizAnswers[q] !== undefined) {
          rowData[3 + q] = data.quizAnswers[q];
        }
      }
    }

    // 3. CẬP NHẬT PHẦN TỰ LUẬN (NẾU GÓI DỮ LIỆU CÓ)
    if (data.essayAnswers) {
      if (data.essayAnswers.cau1 !== undefined) rowData[15] = data.essayAnswers.cau1;
      if (data.essayAnswers.cau2 !== undefined) rowData[16] = data.essayAnswers.cau2;
      if (data.essayAnswers.cau3 !== undefined) rowData[17] = data.essayAnswers.cau3;
    }
    if (data.essayScore !== undefined) {
      rowData[14] = data.essayScore;
    }

    // 4. CẬP NHẬT LỜI NHẬN XÉT CỦA THẦY THẮNG
    if (data.teacherComment !== undefined && data.teacherComment !== "") {
      rowData[18] = data.teacherComment;
    }

    // 5. GHI DỮ LIỆU VÀO SHEET (NẾU ĐÃ CÓ THÌ GHI ĐÈ DÒNG ĐÓ, NẾU CHƯA THÌ THÊM DÒNG MỚI)
    if (rowIndex > 0) {
      sheet.getRange(rowIndex, 1, 1, SHEET_HEADERS.length).setValues([rowData]);
    } else {
      sheet.appendRow(rowData);
      rowIndex = sheet.getLastRow();
    }

    // Định dạng căn chỉnh dữ liệu cho đẹp mắt
    sheet.getRange(rowIndex, 1, 1, 4).setHorizontalAlignment("center");
    sheet.getRange(rowIndex, 5, 1, 10).setHorizontalAlignment("center");
    sheet.getRange(rowIndex, 15, 1, 1).setHorizontalAlignment("center");

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Đã cập nhật dữ liệu của học sinh vào 1 dòng duy nhất trên Google Sheet!",
      studentName: studentName,
      row: rowIndex
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    var sheet = getTargetSheet();
    var data = sheet.getDataRange().getValues();
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      totalStudents: Math.max(0, data.length - 1),
      records: data
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
