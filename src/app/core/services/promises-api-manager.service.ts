import { Injectable } from '@angular/core';
import { NetworkDetectionService } from './network-detection.service';
import { Observable, Subject, catchError, finalize, forkJoin, from, lastValueFrom, of, switchMap, takeUntil, tap } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';

const REQ_STORAGE_KEY = 'REQUEST_STORAGE_KEY';

interface StoredRequest {
  url: string;
  type: 'POST' | 'GET' | 'PATCH' | 'DELETE' | 'PUT';
  data: any;
  time: number;
  completed: boolean;
  response: any;
  header: any;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiManagerService {
  private destroy$ = new Subject<boolean>();

  constructor(
    private readonly networkDetectionService: NetworkDetectionService,
    private readonly storage: Storage,
    private readonly http: HttpClient,
  ) { }

  public makeRequest(method: 'POST' | 'GET' | 'PATCH' | 'DELETE' | 'PUT', url: string, header: any, data?: any): any {
    return new Promise(async (resolve, reject) =>  {
      const action: StoredRequest = {
        url: url,
        type: method,
        data: data ? data : null,
        time: new Date().getTime(),
        completed: false,
        response: null,
        header: header,
        id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
      };
      
      const Store = await this.storeRequest(action);
      await this.repeatRequest(action).then((response) => {
        console.log('Request is done!!!', response);
        resolve(response);
      })
    });
  }

  public storeRequest(action: StoredRequest): void {
    this.storage.get(REQ_STORAGE_KEY).then((storedOperations) => {
      let storedObj = JSON.parse(storedOperations);

      if (storedObj) {
        storedObj.push(action);
      } else {
        storedObj = [action];
      }

      console.log('first setting a request', console.log(action));
      

      return this.storage.set(REQ_STORAGE_KEY, JSON.stringify(storedObj));
    });
  }

  public async repeatRequest(action: StoredRequest): Promise<any> {
    return new Promise(async (resolve, reject) => {
        let response;

        console.log('then repeating request');
        
        // No Internet
        if (!this.networkDetectionService.getCurrentStatus().connected) {
          resolve(action.data);
        } else {
          // Internet is there
          if (action.type === 'GET') {
            const request = this.http.request(action.type, action.url, {headers: action.header}).pipe(catchError(() => of(true)));
            response = await lastValueFrom(request);

          } else {
            const request =  this.http.request(action.type, action.url, {body: action.data, headers: action.header}).pipe(catchError(() => of(true)));
            response = await lastValueFrom(request);
          }

          console.log('I just got response from my request');
          
          this.updateActionObject(action, response);
          resolve(response);
        }
    });
  }
  
  public updateActionObject(action: StoredRequest, response: any): void {
    this.storage.get(REQ_STORAGE_KEY).then((storedOperations) => {
      let storedObj = JSON.parse(storedOperations);
      
      storedObj.forEach((call: StoredRequest) => {
        if (call.id == action.id) {
          call.response = response;
          call.completed = true;
        }
      });

      this.storage.remove(REQ_STORAGE_KEY);
      console.log('updateActionObject',storedObj);
      
      return this.storage.set(REQ_STORAGE_KEY, JSON.stringify(storedObj));
    });
  }

  public ngOnDestroy(): void {
    this.networkDetectionService.removeAllListeners()
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public checkForUnCompleteAPI(): Observable <any> {
    return from(this.storage.get(REQ_STORAGE_KEY)).pipe(
      switchMap((storedOperations: any) => {
        let storedObj = JSON.parse(storedOperations);

        if (storedObj && storedObj.length > 0) {
          return this.sendRequests(storedObj).pipe(
            tap((test) => console.log('this is my tap', test)),
            finalize(() => {
              this.completeAllRequests().then(async () => {
                // this.requestSubscriber.unsubscribe();
                const stored = await this.storage.get(REQ_STORAGE_KEY); // use the db name that you prefer
                console.log('when finished', JSON.parse(stored));
                
              });
            })
          );
        } else {
          return of(false);
        }
      })
    )
  }

  public sendRequests(operations: StoredRequest[]) {
    let obs = [];
    let oneObs;
    
    for (let op of operations) {
      if (!op.completed) {
        if (op.type === 'GET') {
          oneObs = this.http.request(op.type, op.url, {headers: op.header}).pipe(catchError(() => of(op)), tap((res) => this.updateActionObject(op, res)));
        } else {
          oneObs = this.http.request(op.type, op.url, {body: op.data, headers: op.header}).pipe(catchError(() => of(op)), tap((res) => this.updateActionObject(op, res)));          
        }
        obs.push(oneObs);
      }
    }

    return forkJoin(obs);
  }

  public completeAllRequests(): Promise <any> {
    return new Promise((resolve, reject) => {
      this.storage.get(REQ_STORAGE_KEY).then((StoredReqs) => {
        let storedObj = JSON.parse(StoredReqs);

        storedObj = storedObj.filter((request: any) => !request.completed);

        this.storage.remove(REQ_STORAGE_KEY);
        resolve(this.storage.set(REQ_STORAGE_KEY, JSON.stringify(storedObj)));
      });
    })
  }

}
