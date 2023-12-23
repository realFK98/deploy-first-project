import View from './View';
import PreviewView from './previewView';
class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = `No recipes found for your query! Please try again i kak ;)`;

  _gennerateMarkup() {
    return this._data
      .map(bookmark => PreviewView.render(bookmark, false))
      .join('');
  }
}

export default new ResultsView();
