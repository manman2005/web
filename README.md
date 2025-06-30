# โปรเจกต์เว็บแอปพลิเคชัน

โปรเจกต์นี้ประกอบด้วยส่วนหน้า (client) ที่พัฒนาด้วย React และส่วนหลัง (server) ที่พัฒนาด้วย Node.js/Express.

## การติดตั้ง

ก่อนเริ่มต้น ตรวจสอบให้แน่ใจว่าคุณได้ติดตั้ง Node.js และ npm (หรือ yarn) แล้ว

1.  **โคลน Repository:**
    ```bash
    git clone <URL ของคุณ>
    cd wed
    ```

2.  **ติดตั้ง Dependencies สำหรับ Server:**
    ```bash
    cd server
    npm install
    cd ..
    ```

3.  **ติดตั้ง Dependencies สำหรับ Client:**
    ```bash
    cd client
    npm install
    cd ..
    ```

## การรันแอปพลิเคชัน

### การรัน Server

ในไดเรกทอรี `server`:

```bash
cd server
npm start
```

เซิร์ฟเวอร์จะทำงานบนพอร์ตที่กำหนดไว้ (โดยปกติคือ 5000 หรือ 8080)

### การรัน Client

ในไดเรกทอรี `client`:

```bash
cd client
npm start
```

แอปพลิเคชันส่วนหน้าจะเปิดขึ้นในเบราว์เซอร์ของคุณ (โดยปกติคือ `http://localhost:3000`)

## โครงสร้างโปรเจกต์

-   `client/`: โค้ดส่วนหน้าของ React
-   `server/`: โค้ดส่วนหลังของ Node.js/Express
