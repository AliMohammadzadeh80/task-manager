// js/app.js
import { TaskManager } from './task.js';
import { UI } from './ui.js';

// تابع اصلی راه‌اندازی برنامه
const initApp = async () => {
  try {
    console.log('شروع راه‌اندازی برنامه...');
    
    // ایجاد نمونه مدیریت وظایف
    const taskManager = new TaskManager();
    
    // ایجاد نمونه UI
    const ui = new UI(taskManager);
    
    // راه‌اندازی UI
    await ui.initialize();
    
    console.log('برنامه با موفقیت راه‌اندازی شد');
  } catch (error) {
    console.error('خطا در راه‌اندازی برنامه:', error);
    alert(`خطا در راه‌اندازی برنامه: ${error.message}`);
  }
};

// اجرای برنامه زمانی که محتوای صفحه کاملا بارگذاری شده است
document.addEventListener('DOMContentLoaded', initApp);