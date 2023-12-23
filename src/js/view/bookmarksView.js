import View from './View';
import PreviewView from './previewView';
class BookmarkView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmark yet. Find a nice recipe and bookmark it ;)`;

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _gennerateMarkup() {
    return this._data
      .map(bookmark => PreviewView.render(bookmark, false))
      .join('');
  }
}
export default new BookmarkView();
