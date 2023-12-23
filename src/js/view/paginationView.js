import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _gennerateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // ไม่มีหน้าย้อนกลับ
    if (curPage === 1 && numPages > 1) {
      return `<button data-goto=${
        curPage + 1
      } class="btn--inline pagination__btn--next">
      <svg class="search__icon">
       <use href="${icons}#icon-arrow-right"></use>
       </svg>
      <span>Page ${curPage + 1}</span>
       </button>`;
    }
    // ไม่มีหน้าถัดไป
    if (curPage === numPages && numPages > 1) {
      return `<button data-goto=${
        curPage - 1
      } class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
             <use href="${icons}#icon-arrow-left"></use>
             </svg>
            <span>Page ${curPage - 1}</span>
             </button>`;
    }
    // มีหน้าหน้าถัดไปมีหน้าย้อนกลับ
    if (curPage < numPages) {
      return `
      <button data-goto=${
        curPage - 1
      } class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
             <use href="${icons}#icon-arrow-left"></use>
             </svg>
            <span>Page ${curPage - 1}</span>
             </button>
      <button data-goto=${
        curPage + 1
      } class="btn--inline pagination__btn--next">
      <svg class="search__icon">
       <use href="${icons}#icon-arrow-right"></use>
       </svg>
      <span>Page ${curPage + 1}</span>
       </button>
       
       `;
    }
    // มีแค่หน้าเดียว
    return '';
  }
}

export default new PaginationView();
