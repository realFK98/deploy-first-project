class SearchView {
  _parentEl = document.querySelector('.search');

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value; // เพื่อเอาค่า input
    this._clearInput();
    return query;
  }
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      // ที่ไม่ใส่ handler เพราะว่าเมื่อมีการซับมิทมันจะมีการรีหน้าใหม่ดังนั้นต้องป้องกัน refeash ก่อนด้วย e
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
