import { Injectable } from '@angular/core';
import { GamePlatformMap } from '@partie/shared/models/game-platform-map/game-platform-map.model';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../api-base.service';


@Injectable({
    providedIn: 'root'
})
export class GamePlatformMapService extends ApiBaseService {
    gamePlatformMap: GamePlatformMap[];
    types: string[] = [];

    getGamePlatformMap(): Observable<GamePlatformMap[]> {

        return this.get<GamePlatformMap[]>(null, '/game/getGamePlatformMap');
    }

    createGamePlatformMap() {
        if (this.gamePlatformMap && this.gamePlatformMap.length > 0) return;

        var subscription = this.getGamePlatformMap().subscribe((res: GamePlatformMap[]) => {
            this.gamePlatformMap = res;
            console.log("COUNT OF MAPS: ", res.length);
            subscription.unsubscribe();
        });
    }


    getMatchedGamePlatforms(gamePlatforms: string, userPlatforms: string): string[] {
        this.types = [];
        const gamePlatformsArray = gamePlatforms.split(",");
        const userPlatformsArray = userPlatforms.split(",");
        console.log("MAP DATA", this.gamePlatformMap);
        gamePlatformsArray.forEach(x => {
          console.log("GAMING PLATFORM ARRAY", x);
            var map = this.gamePlatformMap.find(y => y.gamePlatform === x);
            console.log(map);
            //console.log(map.gamePlatform + "; " + map.userProfilePlatform);
            var type = userPlatformsArray.find(u => u === map.userProfilePlatform) ? map.gamePlatform : undefined;
            if (type) {
                this.types.push(type);
            }
        });
        return this.types;
    }


}
