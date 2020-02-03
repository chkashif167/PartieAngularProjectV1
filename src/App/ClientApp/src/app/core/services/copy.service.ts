import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CopyService {

  toClipboard(element) {

    let textContent = '';
    if (element.nodeName === 'SPAN') {
      textContent = element.textContent;
    } else {
      throw new DOMException(`${element.nodeName} not supported yet!`);
    }

    const textArea = document.createElement("textarea");
    textArea.value = textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("Copy");
    textArea.remove();
  }
}
