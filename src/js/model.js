import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config';
// import { getJSON, sendJSON } from './helpers';
import { AJAX } from './helpers'; //new
export const state = {
  // ตะกร้าเตรียมใส่
  recipe: {},
  search: {
    query: '', //ค้นหา
    results: [], // เจ็บข้อมูลที่ค้นหาเจอ
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    image: recipe.image_url,
    ...(recipe.key && { key: recipe.key }), // ตรวจสอบว่ามี คุณสมบัติแบบนี้อยู่หรือไม่หากไม่มีจะไม่ทำการใส่คุณสมบัตินี้ให้กับอ๊อฟเจ๊กตัวนั้น
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    // สำหรับเช็ค bookmark ที่เก็บในอาลีเก่าของเราว่ามีตัวที่เจอไหมถ้าเจอจะให้หน้านั้นที่ดาวน์โหลดมาแสดงบุ๊คมาร์คตัวเดิม
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;
    // console.log(state.recipe);
  } catch (err) {
    console.error(err);
    throw err; // ส่งไปให้ดักจับที่ controller
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page; // ทำให้อัพเดทค่าภายในตัว
  // ตั้งค่าเริ่มต้นให้อยู่ที่หน้าหนึ่ง
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end); //0-10 แต่จริงๆคือเอาตัวที่ 0-9 เพราะ 10 ที่เราเขียนวันหมายถึงจุด ก่อนหน้า 10
};

export const updateServings = function (newServings) {
  //เอาไว้สำหรับ เราอยากเพิ่มจำนวนการ เสิร์ฟอาหาร
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  //บันทึกข้อมูลลง loclStorage
  localStorage.setItem('bookmark', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  //mask current recipe as bookmarked
  if ((recipe.id = state.recipe.id)) state.recipe.bookmarked = true;
  persistBookmarks(); //เรียกบันทึกข้อมูลลง loclStorage
};

export const deleteBookmark = function (id) {
  //delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  //Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmark');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(([name, value]) => name.startsWith('ingredient') && value !== '')
      .map(([_, value]) => {
        const ingArr = value.replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error('Wrong ingredient format! โง่ ;)');
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
// loadSearchResults('pizza');
