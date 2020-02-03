import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiBaseService } from '@partie/shared/services/api-base.service';
import { Game } from '@partie/game/models/game.model';

@Injectable({
  providedIn: 'root'
})
export class GameService extends ApiBaseService {

  getGame(gameId: string): Observable<Game> {
    return this.get<Game>(gameId, '/game');
  }

    search(title: string = null, pageNumber = 1, pageSize = 100): Observable<any> {
      const result = this.post({ title: title, pageNumber: pageNumber, pageSize: pageSize }, '/game/search');
      return result;
    }
}
