

import { Injectable } from '@angular/core';

import { EmojiSearch } from '@ctrl/ngx-emoji-mart';


@Injectable({
  providedIn: 'root'
})
export class EmojiService {

  constructor(private readonly emojiSearch: EmojiSearch) { }

  replaceEmoji(message: string): string {

    const emojisColons = message.match(/:\w+:/g);

    if (!emojisColons) {
      return message;
    }
    emojisColons.forEach(emojiColons => {

      const regexExp = new RegExp(`${emojiColons}`, 'g');
      var emojiValue = this.emojiSearch.search(emojiColons.substring(1, emojiColons.length - 2)).map(o => o.native)[0];

      if (emojiValue) {
        message = message.replace(regexExp, emojiValue);
      }

    });
    return message;
  }
}
