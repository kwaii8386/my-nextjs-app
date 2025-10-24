// file: pages/api/download.js

import path from 'path';
import fs from 'fs';

export default function handler(req, res) {
  // Tên file bạn muốn cung cấp
  const fileName = 'Client.exe';
  // Tên file mà người dùng sẽ thấy khi tải về
  const downloadFileName = 'service.exe';

  // Lấy đường dẫn tuyệt đối đến file trong môi trường serverless
  // process.cwd() trỏ đến thư mục gốc của dự án khi deploy
  const filePath = path.join(process.cwd(), 'private_files', fileName);

  try {
    // Kiểm tra xem file có tồn tại không
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    // Đọc nội dung file
    const fileBuffer = fs.readFileSync(filePath);

    // ---- ĐÂY LÀ PHẦN QUAN TRỌNG NHẤT ----
    // Thiết lập các HTTP Header để ép buộc tải xuống
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${downloadFileName}"`
    );
    // ------------------------------------

    // Gửi nội dung file về cho client
    res.send(fileBuffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}