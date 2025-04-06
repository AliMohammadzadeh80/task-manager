// js/ui.js
export class UI {
    constructor(taskManager) {
      // ذخیره مرجع به مدیریت وظایف
      this.taskManager = taskManager;
      
      // گرفتن مراجع DOM
      this.taskForm = document.getElementById('task-form');
      this.tasksList = document.getElementById('tasks-list');
      this.filterAllBtn = document.getElementById('filter-all');
      this.filterActiveBtn = document.getElementById('filter-active');
      this.filterCompletedBtn = document.getElementById('filter-completed');
      this.loader = document.getElementById('loader');
      
      // تنظیم event listeners
      this.setupEventListeners();
    }
  
    // تنظیم تمام رویدادها
    setupEventListeners() {
      // ارسال فرم افزودن وظیفه
      this.taskForm.addEventListener('submit', this.handleAddTask.bind(this));
      
      // رویدادهای فیلتر
      this.filterAllBtn.addEventListener('click', () => this.handleFilterChange('all'));
      this.filterActiveBtn.addEventListener('click', () => this.handleFilterChange('active'));
      this.filterCompletedBtn.addEventListener('click', () => this.handleFilterChange('completed'));
    }
  
    // نمایش/پنهان‌سازی لودر
    toggleLoader(show = true) {
      this.loader.classList.toggle('hidden', !show);
    }
  
    // رسم وظایف
    renderTasks(tasks) {
      // پاک‌سازی لیست فعلی
      this.tasksList.innerHTML = '';
      
      if (tasks.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'col-span-full text-center py-8 text-gray-500';
        emptyMessage.textContent = 'هیچ وظیفه‌ای یافت نشد';
        this.tasksList.appendChild(emptyMessage);
        return;
      }
      
      // ایجاد کارت برای هر وظیفه
      tasks.forEach(task => {
        const { id, title, description, dueDate, completed } = task;
        
        // ایجاد المان کارت
        const taskCard = document.createElement('div');
        taskCard.className = `task-card p-4 rounded-lg shadow-md transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg ${
          completed ? 'bg-green-50 border-r-4 border-green-500' : 'bg-white border-r-4 border-blue-500'
        }`;
        taskCard.dataset.id = id;
        
        // ساخت محتوای کارت با استفاده از template literals
        taskCard.innerHTML = `
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-bold ${completed ? 'line-through text-gray-500' : 'text-gray-800'}">${title}</h3>
            <div class="flex space-x-2">
              <button class="toggle-btn w-6 h-6 rounded-full flex items-center justify-center ${
                completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
              }">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button class="edit-btn text-blue-500 hover:text-blue-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button class="delete-btn text-red-500 hover:text-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          
          <p class="mb-2 text-gray-600 text-sm">${description || 'بدون توضیحات'}</p>
          
          ${dueDate ? `
          <div class="text-xs text-gray-500 mt-2">
            <span class="font-semibold">تاریخ انجام:</span> ${new Date(dueDate).toLocaleDateString('fa-IR')}
          </div>
          ` : ''}
        `;
        
        // افزودن event listeners به دکمه‌های کارت
        const toggleBtn = taskCard.querySelector('.toggle-btn');
        const editBtn = taskCard.querySelector('.edit-btn');
        const deleteBtn = taskCard.querySelector('.delete-btn');
        
        toggleBtn.addEventListener('click', () => this.handleToggleTask(id));
        editBtn.addEventListener('click', () => this.handleEditTask(task));
        deleteBtn.addEventListener('click', () => this.handleDeleteTask(id));
        
        // افزودن کارت به لیست
        this.tasksList.appendChild(taskCard);
      });
    }
  
    // مدیریت افزودن وظیفه
    async handleAddTask(event) {
      event.preventDefault();
      
      // گرفتن مقادیر فرم
      const titleInput = document.getElementById('task-title');
      const descriptionInput = document.getElementById('task-description');
      const dueDateInput = document.getElementById('task-due-date');
      
      const title = titleInput.value.trim();
      const description = descriptionInput.value.trim();
      const dueDate = dueDateInput.value;
      
      if (!title) {
        alert('لطفاً عنوان وظیفه را وارد کنید');
        return;
      }
      
      try {
        this.toggleLoader(true);
        
        // ساخت داده‌های وظیفه
        const taskData = {
          title,
          description,
          dueDate: dueDate || null
        };
        
        // افزودن وظیفه و به‌روزرسانی UI
        await this.taskManager.addTask(taskData);
        const filteredTasks = this.taskManager.getFilteredTasks();
        this.renderTasks(filteredTasks);
        
        // پاک‌سازی فرم
        this.taskForm.reset();
        
      } catch (error) {
        alert(`خطا در افزودن وظیفه: ${error.message}`);
      } finally {
        this.toggleLoader(false);
      }
    }
  
    // تغییر وضعیت وظیفه
    async handleToggleTask(taskId) {
      try {
        this.toggleLoader(true);
        await this.taskManager.toggleTaskCompletion(taskId);
        const filteredTasks = this.taskManager.getFilteredTasks();
        this.renderTasks(filteredTasks);
      } catch (error) {
        alert(`خطا در تغییر وضعیت وظیفه: ${error.message}`);
      } finally {
        this.toggleLoader(false);
      }
    }
  
    // ویرایش وظیفه
    handleEditTask(task) {
      // این متد می‌تواند یک مودال یا فرم جدید باز کند
      // برای مثال ساده، از پنجره prompt استفاده می‌کنیم
      const newTitle = prompt('عنوان جدید:', task.title);
      if (newTitle === null) return; // لغو عملیات
      
      const newDescription = prompt('توضیحات جدید:', task.description || '');
      if (newDescription === null) return; // لغو عملیات
      
      // انجام به‌روزرسانی
      this.updateTask(task.id, { 
        title: newTitle.trim(),
        description: newDescription.trim()
      });
    }
  
    // به‌روزرسانی وظیفه
    async updateTask(taskId, updatedData) {
      try {
        this.toggleLoader(true);
        await this.taskManager.updateTask(taskId, updatedData);
        const filteredTasks = this.taskManager.getFilteredTasks();
        this.renderTasks(filteredTasks);
      } catch (error) {
        alert(`خطا در به‌روزرسانی وظیفه: ${error.message}`);
      } finally {
        this.toggleLoader(false);
      }
    }
  
    // حذف وظیفه
    async handleDeleteTask(taskId) {
      const confirm = window.confirm('آیا از حذف این وظیفه اطمینان دارید؟');
      if (!confirm) return;
      
      try {
        this.toggleLoader(true);
        await this.taskManager.deleteTask(taskId);
        const filteredTasks = this.taskManager.getFilteredTasks();
        this.renderTasks(filteredTasks);
      } catch (error) {
        alert(`خطا در حذف وظیفه: ${error.message}`);
      } finally {
        this.toggleLoader(false);
      }
    }
  
    // تغییر فیلتر
    async handleFilterChange(filter) {
      try {
        this.toggleLoader(true);
        
        // به‌روزرسانی وضعیت دکمه‌های فیلتر
        this.filterAllBtn.className = filter === 'all' 
          ? 'bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300'
          : 'bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition duration-300';
        
        this.filterActiveBtn.className = filter === 'active'
          ? 'bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300'
          : 'bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition duration-300';
        
        this.filterCompletedBtn.className = filter === 'completed'
          ? 'bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300'
          : 'bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition duration-300';
        
        // اعمال فیلتر و به‌روزرسانی UI
        const filteredTasks = this.taskManager.setFilter(filter);
        this.renderTasks(filteredTasks);
        
      } catch (error) {
        alert(`خطا در تغییر فیلتر: ${error.message}`);
      } finally {
        this.toggleLoader(false);
      }
    }
  
    // راه‌اندازی اولیه UI
    async initialize() {
      try {
        this.toggleLoader(true);
        await this.taskManager.init();
        const tasks = this.taskManager.getFilteredTasks();
        this.renderTasks(tasks);
      } catch (error) {
        alert(`خطا در راه‌اندازی برنامه: ${error.message}`);
        console.error('خطا در راه‌اندازی UI:', error);
      } finally {
        this.toggleLoader(false);
      }
    }
  }