// Global State Management
// ไฟล์กลางสำหรับเก็บข้อมูลผู้ใช้ที่ Login

class GlobalState {
    constructor() {
        this.username = '';
        this.password = '';
        this.userId = null;
        this.userEmail = '';
    }

    // ตั้งค่า Username และ Password
    setCredentials(username, password) {
        this.username = username;
        this.password = password;
    }

    // ดึงค่า Username
    getUsername() {
        return this.username;
    }

    // ดึงค่า Password
    getPassword() {
        return this.password;
    }

    // ตั้งค่า User ID
    setUserId(userId) {
        this.userId = userId;
    }

    // ดึงค่า User ID
    getUserId() {
        return this.userId;
    }

    // ตั้งค่า Email
    setUserEmail(email) {
        this.userEmail = email;
    }

    // ดึงค่า Email
    getUserEmail() {
        return this.userEmail;
    }

    // ล้างข้อมูลทั้งหมด (สำหรับ Logout)
    clearAll() {
        this.username = '';
        this.password = '';
        this.userId = null;
        this.userEmail = '';
    }

    // ดึงข้อมูลทั้งหมด
    getAllData() {
        return {
            username: this.username,
            password: this.password,
            userId: this.userId,
            userEmail: this.userEmail
        };
    }
}

// สร้าง instance เดียวสำหรับทั้งแอป (Singleton Pattern)
const globalState = new GlobalState();

export default globalState;
