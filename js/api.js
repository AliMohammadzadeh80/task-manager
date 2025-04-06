// js/api.js
const API_URL = 'https://67f2e18bec56ec1a36d4778b.mockapi.io/tasks';

// ساخت توابع برای تعامل با API
export const apiService = {
  // دریافت همه وظایف
  async getTasks() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`خطا در دریافت داده‌ها: ${response.status}`);
      }
      const data = await response.json();
      console.log('وظایف دریافت شدند:', data);
      return data;
    } catch (error) {
      console.error('خطا در دریافت وظایف:', error);
      throw error;
    }
  },

  // افزودن وظیفه جدید
  async addTask(task) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      if (!response.ok) {
        throw new Error(`خطا در افزودن وظیفه: ${response.status}`);
      }
      const data = await response.json();
      console.log('وظیفه با موفقیت افزوده شد:', data);
      return data;
    } catch (error) {
      console.error('خطا در افزودن وظیفه:', error);
      throw error;
    }
  },

  // به‌روزرسانی وظیفه
  async updateTask(taskId, updatedTask) {
    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });
      if (!response.ok) {
        throw new Error(`خطا در به‌روزرسانی وظیفه: ${response.status}`);
      }
      const data = await response.json();
      console.log('وظیفه با موفقیت به‌روزرسانی شد:', data);
      return data;
    } catch (error) {
      console.error('خطا در به‌روزرسانی وظیفه:', error);
      throw error;
    }
  },

  // حذف وظیفه
  async deleteTask(taskId) {
    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`خطا در حذف وظیفه: ${response.status}`);
      }
      console.log(`وظیفه با شناسه ${taskId} با موفقیت حذف شد`);
      return taskId;
    } catch (error) {
      console.error('خطا در حذف وظیفه:', error);
      throw error;
    }
  }
};