import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map, takeUntil } from 'rxjs/operators';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Observable, Subject, Subscription } from 'rxjs';
import { Todo } from '../store/models/todos.models';
import { Store } from '@ngrx/store';
import { selectAllTodos } from '../store/selectors/todos.selectors';
import { NavigationComponent } from "../navigation/navigation.component";
import { TodosService } from '../services/todos.service';
import * as echarts from 'echarts/core';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([TooltipComponent, LegendComponent, PieChart, LabelLayout, CanvasRenderer]);
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    standalone: true,
    imports: [
        AsyncPipe,
        MatGridListModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        DecimalPipe,
        NavigationComponent
    ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  allTodos$: Observable<Todo[]>; 
  completedPercentage!: number;
  tasksDueInOneWeek!: number;
  private destroy$ = new Subject<void>();
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => matches ?
      [
        { title: 'Fortschritt bei der Aufgabenerledigung', cols: 1, rows: 1, type: 'percentage' },
        { title: 'Aufgaben, die in einer Woche fällig sind', cols: 1, rows: 1, type: 'dueInOneWeek' }
      ] :
      [
        { title: 'Fortschritt bei der Aufgabenerledigung', cols: 1, rows: 1, type: 'percentage' },
        { title: 'Aufgaben, die in einer Woche fällig sind', cols: 1, rows: 1, type: 'dueInOneWeek' }
      ]
    )
  );
  allTodos!: Todo[];
  chart!: echarts.ECharts;

  constructor(
    private todosService: TodosService,
    private store: Store<{ todos: Todo[] }>,
    private breakpointObserver: BreakpointObserver
  ) {
    this.allTodos$ = this.store.select(selectAllTodos);
  }


  ngOnInit(): void {
    this.store.select(selectAllTodos)
    .pipe(takeUntil(this.destroy$))
    .subscribe(todos => {
      this.allTodos = todos;
      this.completedPercentage = this.getCompletedPercentage(todos);
      this.tasksDueInOneWeek = this.getTasksDueInOneWeek(todos);
      this.initFirstChart()
      this.initSecondChart()
    });
  }
  
  initFirstChart(): void {
    const chartDom = document.getElementById('completed-task');
    this.chart = echarts.init(chartDom);
    const option = this.getCompletedTaskChartOption();
    this.chart.setOption(option);
  }

  initSecondChart(): void {
    const chartDom = document.getElementById('waiting-tasks-in-one-week');
    this.chart = echarts.init(chartDom);
    const option = this.getTasksDueInOneWeekChartOption();
    this.chart.setOption(option);
  }


  getCompletedPercentage(todos: Todo[]): number {
    const totalTasks = todos.length;
    if (totalTasks === 0) return 0;
    const completedTasks = todos.filter(todo => todo.erledigt).length;
    return (completedTasks / totalTasks) * 100;
  }

  getTasksDueInOneWeek(todos: Todo[]): number {
    const now = Math.floor(Date.now() / 1000); 
    const oneWeekFromNow = now + 7 * 24 * 60 * 60;
  
    return todos.filter(todo => {
      if (!todo.erledigt && todo.faellig) {
        const faelligTime = Number(todo.faellig); 
        return faelligTime > now && faelligTime < oneWeekFromNow;
      }
      return false;
    }).length;
  }

  getCompletedTaskChartOption(): any {
    const totalTasks = this.allTodos.length;
    const completedTasks = this.allTodos.filter(todo => todo.erledigt).length;
    const pendingTasks = totalTasks - completedTasks;

    return {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '5%',
        left: 'center',
      },
      series: [
        {
          name: 'Fortschritt bei der Aufgabenerledigung',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            position: 'center',
            formatter: '{b}: {c} ({d}%)',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '20',
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: completedTasks, name: 'Erledigt' },
            { value: pendingTasks, name: 'Noch nicht Erledigt' },
          ],
        },
      ],
    };
  }


  getTasksDueInOneWeekChartOption(): any {
    const totalTasks = this.allTodos.length;
    const tasksDueInOneWeek = this.tasksDueInOneWeek;
    const tasksNotDueInOneWeek = totalTasks - tasksDueInOneWeek;

    return {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '5%',
        left: 'center',
      },
      series: [
        {
          name: 'Aufgaben fällig in einer Woche',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            position: 'center',
            formatter: '{b}: {c} ({d}%)',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '20',
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: tasksDueInOneWeek, name: 'Fällig in einer Woche' },
            { value: tasksNotDueInOneWeek, name: 'Nicht fällig in einer Woche' },
          ],
        },
      ],
    };
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}