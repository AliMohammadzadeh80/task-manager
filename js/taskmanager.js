// js/taskManager.js
import { apiService } from './api.js';

// مدیریت وضعیت محلی و منطق کسب و کار
export class TaskManager {
  constructor() {
    this.tasks = [];
    this.currentFilter = 'all'; // 'all', 'active', 'completed'
    
    // بررسی وجود localStorage
    this.hasLocalStorage = typeof localStorage !== 'undefined';
  }

  // شروع برنامه و بارگیری وظایف
  async init() {
    try {
      // تلاش برای بارگیری از localStorage در صورت وجود
      if (this.hasLocalStorage && localStorage.getItem('tasks')) {
        this.tasks = JSON.parse(localStorage.getItem('tasks'));
        console.log('وظایف از localStorage بارگیری شدند');
      } else {
        // دریافت وظایف از API
        this.tasks = await apiService.getTasks();
        console.log('وظایف از API بارگیری شدند');
        this.saveToLocalStorage();
      }
      return this.tasks;
    } catch (error) {
      console.error('خطا در راه‌اندازی مدیریت وظایف:', error);
      throw error;
    }
  }

  // دریافت وظایف براساس فیلتر فعلی
  getFilteredTasks() {
    switch (this.currentFilter) {
      case 'active':
        return this.tasks.filter(task => !task.completed);
      case 'completed':
        return this.tasks.filter(task => task.completed);
      case 'all':
      default:
        return this.tasks;
    }
  }

  // تنظیم فیلتر جدید
  setFilter(filter) {
    this.currentFilter = filter;
    console.log(`فیلتر به '${filter}' تغییر یافت`);
    return this.getFilteredTasks();
  }

  // افزودن وظیفه جدید
  async addTask(taskData) {
    try {
      // افزودن وظیفه به API
      const newTask = await apiService.addTask({
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString()
      });
      
      // به‌روزرسانی وضعیت محلی
      this.tasks.push(newTask);
      this.saveToLocalStorage();
      
      console.log('وظیفه جدید اضافه شد:', newTask);
      return newTask;
    } catch (error) {
      console.error('خطا در افزودن وظیفه:', error);
      throw error;
    }
  }

  // تغییر وضعیت تکمیل وظیفه
  async toggleTaskCompletion(taskId) {
    try {
      // یافتن وظیفه
      const taskIndex = this.tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) {
        throw new Error(`وظیفه با شناسه ${taskId} یافت نشد`);
      }
      
      // تهیه نسخه به‌روزشده
      const updatedTask = {
        ...this.tasks[taskIndex],
        completed: !this.tasks[taskIndex].completed
      };
      
      // به‌روزرسانی در API
      const result = await apiService.updateTask(taskId, updatedTask);
      
      // به‌روزرسانی وضعیت محلی
      this.tasks[taskIndex] = result;
      this.saveToLocalStorage();
      
      console.log(`وضعیت تکمیل وظیفه ${taskId} تغییر یافت به: ${result.completed}`);
      return result;
    } catch (error) {
      console.error('خطا در تغییر وضعیت وظیفه:', error);
      throw error;
    }
  }

  // به‌روزرسانی وظیفه
  async updateTask(taskId, updatedData) {
    try {
      // یافتن وظیفه
      const taskIndex = this.tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) {
        throw new Error(`وظیفه با شناسه ${taskId} یافت نشد`);
      }
      
      // تهیه نسخه به‌روزشده
      const updatedTask = {
        ...this.tasks[taskIndex],
        ...updatedData,
        updatedAt: new Date().toISOString()
      };
      
      // به‌روزرسانی در API
      const result = await apiService.updateTask(taskId, updatedTask);
      
      // به‌روزرسانی وضعیت محلی
      this.tasks[taskIndex] = result;
      this.saveToLocalStorage();
      
      console.log(`وظیفه ${taskId} به‌روزرسانی شد:`, result);
      return result;
    } catch (error) {
      console.error('خطا در به‌روزرسانی وظیفه:', error);
      throw error;
    }
  }

  // حذف وظیفه
  async deleteTask(taskId) {
    try {
      // حذف از API
      await apiService.deleteTask(taskId);
      
      // به‌روزرسانی وضعیت محلی
      this.tasks = this.tasks.filter(task => task.id !== taskId);
      this.saveToLocalStorage();
      
      console.log(`وظیفه ${taskId} حذف شد`);
      return taskId;
    } catch (error) {
      console.error('خطا در حذف وظیفه:', error);
      throw error;
    }
  }

  // ذخیره در localStorage
  saveToLocalStorage() {
    if (this.hasLocalStorage) {
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
      console.log('وظایف در localStorage ذخیره شدند');
    }
  }

  // بازیابی همه وظایف از API (همگام‌سازی)
  async refreshTasks() {
    try {
      this.tasks = await apiService.getTasks();
      this.saveToLocalStorage();
      console.log('وظایف با API همگام‌سازی شدند');
      return this.getFilteredTasks();
    } catch (error) {
      console.error('خطا در به‌روزرسانی وظایف:', error);
      throw error;
    }
  }
}