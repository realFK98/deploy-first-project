// import icons from '../img/icons.svg'; //parcel

// ที่ต้องทำเพราะว่า markup ของเราที่โหลดมามันไม่ได้แปลงให้เป็นที่อยู่ของไฟล์ parcel ดังนั้นเราเลยต้องดึงผาดที่อยู่มา อีกที
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js'; // จะได้เป็น obj model ที่มีค่าของ export ทั้งหมด
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import resultsView from './view/resultsView.js';
import bookmarksView from './view/bookmarksView.js';
import paginationView from './view/paginationView.js';
import addRecipeView from './view/addRecipeView.js';
import { async } from 'regenerator-runtime';
import { MODAL_CLOSE_SEC } from './config.js';
const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
if (module.hot) {
  module.hot.accept(); // สิ่งนี้จะช่วยให้เมื่อมีการแก้ไขตัวของ parcel ทำให้ไม่ต้องหลบหน้าใหม่ทุกครั้ง
}

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1); // เอาค่าของ hash ซึ่งคือถ้า /#...
    if (!id) return;
    recipeView.renderSpinner(); //เอาไว้ทำระหว่างรอโหลด
    //0)update results view mark
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks); // เมื่อทำการโหลดตัวใหม่ก็ต้องย้าย hover ใน bookmarkด้วย

    //1) Loading recipe
    await model.loadRecipe(id);
    //2) Rendering recipe
    recipeView.render(model.state.recipe); // ส่งค่าให้ data
    // const recipeView = new recipeView(model.state.recipe) // ความหมายเดียวกันกับตัวบนก็คือเอาไปสร้างอ๊อฟเจ็กในที่นี้
  } catch (err) {
    recipeView.renderError();
  }
};
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1 getQuery
    const query = searchView.getQuery();
    if (!query) return;
    //2 load
    await model.loadSearchResults(query); // รันเพื่อให้เอาไปเก็บใน state
    //3 render
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
  // recipeView.render(model.state.recipe); // ที่เราไม่แ ใช้หน้านี้เพราะเราไม่ต้องการให้มันอัพเดทใหม่ทั้งหมดแต่ต้องการเฉพาะเจาะจง

  //ไม่ใช่ตอนนี้เพราะว่าเราไม่ได้ต้องการจะต้องให้มันโหลดใหม่ตลอดเราแค่ต้องการให้มันเปลี่ยนตัวหนังสือ;
};
const controlAddBookmark = function () {
  //1) add/remove bookmark
  const isBookmarked = model.state.recipe.bookmarked;
  if (isBookmarked)
    model.deleteBookmark(model.state.recipe.id); // รับข้าเป็น id
  else model.addBookmark(model.state.recipe); //รับข้าเป็น recipe
  console.log(model.state.recipe);
  //2) update bookmarks
  recipeView.update(model.state.recipe);

  //3)Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controllerPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage)); // โหลดตัวผลลัพธ์ใหม่
  paginationView.render(model.state.search); // โหลดตัวปุ่มใหม่
};

// สิ่งที่จะทำงานเมื่อเริ่มต้น controller

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show load
    addRecipeView.renderSpinner();
    //Upload the recipe data
    await model.uploadRecipe(newRecipe);
    //render recipe
    recipeView.render(model.state.recipe);

    //bookmarksView
    bookmarksView.render(model.state.bookmarks);

    //change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Sucess message
    addRecipeView.renderMessage();

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err);
  }
};

const init = function () {
  // เอาไว้จัดการ addlisterner

  //เนื่องจากมีบัคตรงอับเดตที่ตอนแรกมันไม่เจอ bookmark เราแต่เสือกไปเปรียบเทียบตัวเก่าที่เป็นค่าว่างเลยทำให้เราหาข้อมูลนั้นไม่เจอมางออกเดียวคือเราต้องสั่งให้ตัวเรื่นมันทำงานมาก่อน ผ่าน window.docment("load") หมายความว่าทุกครั้งที่โหลดหน้านี้ให้
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controllerPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
// ฟังก์ชันนี้เนื่องจากเป็นการทำงานร่วมกับดองจึงไม่ควรจะมาอยู่ controller but ควรไปอยู่ใน viewแทน
// ['hashchange', 'load'].forEach(ev =>
//   window.addEventListener(ev, controlRecipe)
// );

// window.addEventListener('hashchange', controlRecipe); // ทำงานเมื่อเปลี่ยน hash
// window.addEventListener('load', controlRecipe); // ทำงานเมื่อโหลดหน้าเว็บ
