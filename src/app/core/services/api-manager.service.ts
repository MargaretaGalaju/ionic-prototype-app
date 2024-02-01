import { Injectable } from '@angular/core';
import { NetworkDetectionService } from './network-detection.service';
import { BehaviorSubject, Observable, Subject, catchError, concatAll, concatMap, filter, finalize, forkJoin, from, last, lastValueFrom, map, of, switchMap, takeUntil, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';

const REQ_STORAGE_KEY = 'REQUEST_STORAGE_KEY';

interface StoredRequest {
  url: string;
  type: 'POST' | 'GET' | 'PATCH' | 'DELETE' | 'PUT';
  data: any;
  time: number;
  completed: boolean;
  failed: boolean;
  response: any;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiManagerService {
  private destroy$ = new Subject<boolean>();

  private requestsQueue$ = new BehaviorSubject<StoredRequest[]>([]);
  private networkConnected = false;

  constructor(
    private readonly networkDetectionService: NetworkDetectionService,
    private readonly storage: Storage,
    private readonly http: HttpClient,
  ) { }

  // public listenToNetworkChanges(): void {
  //   this.networkDetectionService.networkChange$.pipe(
  //     filter(({ connected }) => this.networkConnected !== connected),
  //     switchMap(({ connected }) => {
  //       if (connected) {
  //         const currentRequests = this.requestsQueue$.getValue();

  //         return forkJoin(
  //           currentRequests
  //             .filter((r: any) => !r.completed)
  //             .map((request: any) => this.performHttpRequest(request).pipe(
  //               catchError(() => of(true)),
  //               tap((request) => {
  //                 this.setCompletedToRequest(request);
  //               }),
  //             ))).pipe(concatAll());
  //       } else {
  //         return of(null);
  //       }
  //     })
  //   ).subscribe((response) => {
  //     if (!response) {
  //       console.log('no internet');

  //     } else {
  //       console.log('all requests done', response);

  //     }
  //   })
  // }

  public setCompletedToRequest(request: StoredRequest, response: {error: boolean}): void {
    const currentRequests = this.requestsQueue$.getValue();
    const requestToChange = currentRequests.find((r) => r.id === request.id);
    
    if (requestToChange) {
      if (response.error) {
        requestToChange.failed = true;
      }

      requestToChange.completed = true;
    }

    this.requestsQueue$.next(currentRequests);
  }

  public makeRequest(method: 'POST' | 'GET' | 'PATCH' | 'DELETE' | 'PUT', url: string, data?: any): void {
    const action: StoredRequest = {
      url: url,
      type: method,
      data: data ? data : null,
      time: new Date().getTime(),
      completed: false,
      failed: false,
      response: null,
      id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
    };

    this.saveRequestInStorage(action);
  }

  public storeCallAndRespond(method: 'POST' | 'GET' | 'PATCH' | 'DELETE' | 'PUT', url: string, header: any, data?: any): any {
    const action: StoredRequest = {
      url: url,
      type: method,
      data: data ? data : null,
      time: new Date().getTime(),
      completed: false,
      failed: false,
      response: null,
      id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
    };

    this.saveRequestInStorage(action);
  }

  public saveRequestInStorage(request: any): void {
    const currentRequests = this.requestsQueue$.getValue() || [];

    this.requestsQueue$.next([...currentRequests, request]);
  }

  public checkForUnCompleteAPI(): Observable<{completedRequests: StoredRequest[], failedRequests: StoredRequest[]}> {
    const currentRequests = this.requestsQueue$.getValue();

    if (!currentRequests.length) {
      return of({completedRequests: [], failedRequests: []})
    }

    return from(currentRequests).pipe(
      filter((r: any) => !r.completed),
      concatMap((request: any) => this.performHttpRequest(request).pipe(
        tap((response) => {
          this.setCompletedToRequest(request, response);
        }),
      )),
      last(),
      map(() => {
        const completedRequests = this.requestsQueue$.getValue().filter((r) => r.completed === true);
        const failedRequests = this.requestsQueue$.getValue().filter((r) => r.failed === true);
        
        this.requestsQueue$.next(completedRequests);
        return {completedRequests, failedRequests}
      })
    )
  }

  public performHttpRequest(action: any): Observable<any> {
    if (action.type === 'GET') {
      return this.http.request(action.type, action.url, { headers: action.header }).pipe(catchError(() => of({ error: true })));
    } else {
      return this.http.request(action.type, action.url, { body: action.data, headers: action.header }).pipe(catchError(() => of({ error: true })));
    }
  }
}
