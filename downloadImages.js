const fs = require("fs");
const path = require("path");
const axios = require("axios");

// Load câu hỏi từ JSON gốc (link online)
const questions = require("./modules/commands/game/dhbc.json");

// Thư mục cache ảnh
const cacheDir = path.join(__dirname, "modules/commands/cache/dhbc");
fs.mkdirSync(cacheDir, { recursive: true });

async function downloadImage(url, filename) {
    try {
        const res = await axios.get(url, { responseType: "arraybuffer" });
        fs.writeFileSync(filename, res.data);
        console.log("✅ Tải thành công:", filename);
    } catch (err) {
        console.error("❌ Lỗi tải:", url, err.message);
    }
}

(async () => {
    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const fileName = `cau_${i + 1}.jpg`;
        const savePath = path.join(cacheDir, fileName);

        if (!fs.existsSync(savePath)) {
            await downloadImage(q.link, savePath);
        }

        // Chỉnh link thành ảnh local
        q.link = `modules/commands/cache/dhbc/${fileName}`;
    }

    // Lưu lại JSON với link local
    fs.writeFileSync(
        "./modules/commands/game/dhbc.json",
        JSON.stringify(questions, null, 2),
        "utf8"
    );

    console.log("🎉 Hoàn tất tải toàn bộ ảnh và cập nhật dhbc.json!");
})();