import { Injectable } from '@angular/core';
import { NetworkDetectionService } from './network-detection.service';
import { BehaviorSubject, Observable, Subject, catchError, concatAll, concatMap, filter, finalize, forkJoin, from, last, lastValueFrom, map, of, switchMap, takeUntil, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { HttpMethod } from '../enums/http-method.enum';

const REQ_STORAGE_KEY = 'REQUEST_STORAGE_KEY';

interface StoredRequest {
  url: string;
  type: HttpMethod;
  data: any;
  time: number;
  completed?: boolean;
  failed?: boolean;
  error?: any;
  response?: any;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiManagerService {
  private destroy$ = new Subject<boolean>();
  private requestInProccess$ = new Subject<boolean>();
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

  public setCompletedToRequest(request: StoredRequest, response: any): void {
    const currentRequests = this.requestsQueue$.getValue();
    const requestToChange = currentRequests.find((r) => r.id === request.id);

    if (requestToChange) {
      if (!!response.error) {
        requestToChange.failed = true;
        requestToChange.error = response.error;
      }

      requestToChange.completed = true;
      requestToChange.response = response;
    }

    this.requestsQueue$.next(currentRequests);
  }

  public makeRequest(method: HttpMethod, url: string, data?: any): Observable<any> {
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

    const internetConnected = this.networkDetectionService.getCurrentStatus().connected;

    console.log(action);
    
    if (internetConnected) {
      //return only the performed request with response
      return this.checkForUnCompleteAPI().pipe(
        map(({completedRequests, failedRequests}) => {
          const successResponse = completedRequests?.find((request) => request.id === action.id);
         
          if (successResponse) {
            return successResponse.response;
          }
          
          const failedRequest = failedRequests?.find((request) => request.id === action.id);
          
          if (failedRequest) {
            throwError(() => new Error(failedRequest.response))
          }
        }
        ));
    } else {
      return throwError(() => new Error('No internet connection'))
    }
  }

  public storeCallAndRespond(method: HttpMethod, url: string, header: any, data?: any): any {
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

  public checkForUnCompleteAPI(): Observable<{ completedRequests: StoredRequest[], failedRequests: StoredRequest[] }> {
    const currentRequests = this.requestsQueue$.getValue();

    if (!currentRequests.length) {
      return of({ completedRequests: [], failedRequests: [] })
    }

    return from(currentRequests).pipe(
      filter((r: any) => !r.completed),
      tap(() => this.requestInProccess$.next(true)),
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
        this.requestInProccess$.next(false);

        return { completedRequests, failedRequests }
      })
    )
  }

  public performHttpRequest(action: any): Observable<any> {

    if (action.type === HttpMethod.GET) {
      return this.http.request(action.type, action.url, { headers: action.header }).pipe(catchError((error) => of({ error })));
    } else {
      
      return this.http.request(action.type, action.url, { body: action.data, headers: action.header }).pipe(catchError((error) => of({ error })));
    }
  }
}
