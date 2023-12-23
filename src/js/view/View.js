import icons from 'url:../../img/icons.svg';
export default class View {
  // เป็นตัวกลางที่ให้ view ทุกตัวสามารถใช้ฟังก์ชันในนี้ได้เป็นตัวไว้สำหรับสืบทอด
  _data;

  /**
   *
   * @param {Object | Object[]} data render the receive object to the DOM
   * @param {boolean} [render = true] if false create markup string insted of rendering to the DOM
   * @returns {undefined | string} a markup string is returnned if render=false
   * @this {Object} View instance
   * @author Wichira Matrakampa
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || data?.length === 0) return this.renderError();
    // console.log(data);
    this._data = data;
    const markup = this._gennerateMarkup();
    if (!render) return markup; //หาก render เป็น false มันขะไม่รัน markup แต่ส่งเป็น text แทน

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    this._data = data;
    const newMarkup = this._gennerateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup); // แปลง string html เป็น obj
    const newElement = Array.from(newDOM.querySelectorAll('*')); // ตัใหม่ที่ถูกเปลี่ยน
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));

    // console.log(curElements);
    // console.log(newElement);
    newElement.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl), newEl); // เป็นตัวเอาไว้เทียบตัวเก่ากับตัวใหม่ว่ามีแท็กไหนบ้างที่ เหมือนกัน

      //updates changed TEXT
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim())
        curEl.textContent = newEl.textContent; // ทำแบบนี้ไม่ได้เพราะมันจะไปแทนที่boxใหญ่ด้วย ที่ไม่ใช่แค่ tag ที่ข้างในเป็นตัวหนังสือ
      if (!newEl.isEqualNode(curEl)) {
        // console.log(Array.from(newEl.attributes)); // เราจะได้ลิสต์ของทุกตัวมาที่ตรงเงื่อนไข if
        Array.from(newEl.attributes).forEach(
          attr => curEl.setAttribute(attr.name, attr.value) // บอก key และ value ที่ต้องการเปลี่ยน
        );
      }
    });
    //updates changed ATTIBUTE
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }
  renderSpinner() {
    const markup = `
      <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div>
      `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div> 
      `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div> 
      `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
}
