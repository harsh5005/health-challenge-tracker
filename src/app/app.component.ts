import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Workout {
  username: string;
  type: string;
  minutes: number;
  count: number; // New field to count the number of workouts
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h1>Workout Tracker</h1>
      
      <!-- Form Section -->
      <div class="form-section">
        <h2>Add Workout</h2>
        <form (ngSubmit)="addWorkout()">
          <div class="form-group">
            <label for="username">Username:</label>
            <input id="username" [(ngModel)]="username" name="username" required>
          </div>
          <div class="form-group flex-container">
            <div class="input-group">
              <label for="type">Workout Type:</label>
              <input id="type" [(ngModel)]="type" name="type" required>
            </div>
            <div class="input-group">
              <label for="minutes">Workout Minutes:</label>
              <input id="minutes" type="number" [(ngModel)]="minutes" name="minutes" required>
            </div>
          </div>
          <button type="submit">Add Workout</button>
        </form>
      </div>

      <!-- Divider -->
      <hr class="divider" />
      
      <!-- Search and Filter Section -->
      <div class="search-filter">
        <input
          type="text"
          placeholder="Search by name"
          [(ngModel)]="searchName"
        />
        <select [(ngModel)]="filterType">
          <option value="">All Types</option>
          <option *ngFor="let type of workoutTypes" [value]="type">{{ type }}</option>
        </select>
      </div>
      
      <!-- Workout Table Section -->
      <div class="table-section">
        <h2>Workout List</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Workout Type</th>
              <th>Number of Workouts</th>
              <th>Total Workout Minutes</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let workout of paginatedWorkouts">
              <td>{{ workout.username }}</td>
              <td>{{ workout.type }}</td>
              <td>{{ workout.count }}</td>
              <td>{{ workout.minutes }}</td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <div class="pagination">
          <button (click)="previousPage()" [disabled]="currentPage === 1">Previous</button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button (click)="nextPage()" [disabled]="currentPage === totalPages">Next</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .form-section, .table-section {
      margin-bottom: 30px;
    }

    .form-section h2, .table-section h2 {
      margin-bottom: 20px;
    }

    form {
      display: flex;
      flex-direction: column;
    }

    .form-group {
      margin-bottom: 10px;
    }

    .flex-container {
      display: flex;
      justify-content: space-between;
    }

    .input-group {
      flex: 1;
      margin-right: 10px;
    }

    .input-group:last-child {
      margin-right: 0;
    }

    label {
      display: block;
      margin-bottom: 5px;
    }

    input {
      width: 100%;
      padding: 8px;
      box-sizing: border-box;
    }

    button {
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:hover {
      background-color: #0056b3;
    }

    .search-filter {
      margin-bottom: 20px;
      display: flex;
      gap: 10px;
    }

    .search-filter input,
    .search-filter select {
      padding: 8px;
      box-sizing: border-box;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 10px;
      border: 1px solid #ccc;
      text-align: left;
    }

    th {
      background-color: #f4f4f4;
    }

    .pagination {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }

    .pagination button {
      padding: 10px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .pagination button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .pagination span {
      align-self: center;
    }

    .divider {
      border: 0;
      border-top: 1px solid #ccc;
      margin: 20px 0;
    }
  `]
})
export class AppComponent {
  username: string = '';
  type: string = '';
  minutes: number | null = null;
  workouts: Workout[] = [];
  workoutTypes: string[] = [];  // List of unique workout types for filtering
  searchName: string = '';
  filterType: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;

  addWorkout() {
    if (this.username && this.type && this.minutes !== null) {
      const existingWorkout = this.workouts.find(workout =>
        workout.username === this.username && workout.type === this.type
      );

      if (existingWorkout) {
        // Update the existing workout entry
        existingWorkout.count++;
        existingWorkout.minutes += this.minutes;
      } else {
        // Add a new workout entry
        this.workouts.push({
          username: this.username,
          type: this.type,
          minutes: this.minutes,
          count: 1 // Start with a count of 1
        });

        // Update workout types for filtering
        if (!this.workoutTypes.includes(this.type)) {
          this.workoutTypes.push(this.type);
        }
      }

      this.clearForm();
    }
  }

  clearForm() {
    this.username = '';
    this.type = '';
    this.minutes = null;
  }

  // Filter and paginate workouts
  get paginatedWorkouts() {
    let filteredWorkouts = this.workouts.filter(workout =>
      workout.username.toLowerCase().includes(this.searchName.toLowerCase()) &&
      (this.filterType === '' || workout.type === this.filterType)
    );

    let startIndex = (this.currentPage - 1) * this.itemsPerPage;
    let endIndex = startIndex + this.itemsPerPage;
    return filteredWorkouts.slice(startIndex, endIndex);
  }

  get totalPages() {
    return Math.ceil(this.workouts.length / this.itemsPerPage);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}
