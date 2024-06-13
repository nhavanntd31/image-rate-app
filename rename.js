const fs = require('fs');
const path = require('path');

// Đường dẫn đến thư mục chứa ảnh
const folderPath = 'public/data1';

// Hàm đổi tên file
function renameFiles() {
    // Đọc danh sách các tệp trong thư mục
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Lỗi khi đọc thư mục:', err);
            return;
        }

        // Lọc chỉ lấy các tệp có định dạng "fake_image_*.png"
        const imageFiles = files.filter(file => file.startsWith('fake_image_') && file.endsWith('.png'));

        imageFiles.forEach(file => {
            // Lấy số từ tên file, ví dụ "fake_image_1.png" -> 1
            const fileNumber = parseInt(file.match(/\d+/)[0], 10);
            
            // Định dạng số thành chuỗi 4 chữ số, ví dụ 1 -> "0001"
            const formattedNumber = String(fileNumber).padStart(4, '0');
            
            // Tên file mới
            const newFileName = `${formattedNumber}.png`;

            // Đường dẫn cũ và mới
            const oldPath = path.join(folderPath, file);
            const newPath = path.join(folderPath, newFileName);

            // Đổi tên file
            fs.rename(oldPath, newPath, err => {
                if (err) {
                    console.error(`Lỗi khi đổi tên file ${file} thành ${newFileName}:`, err);
                } else {
                    console.log(`Đã đổi tên file ${file} thành ${newFileName}`);
                }
            });
        });
    });
}

// Thực thi hàm đổi tên file
renameFiles();
