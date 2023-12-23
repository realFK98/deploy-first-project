// เอาไว้เก็บของชั่นที่มีการใช้ซ้ำๆ
import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  // two on one
  try {
    const fetchPro = uploadData
      ? await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw Error(`${data.message} ${res.status}`);
    return data;
  } catch (err) {
    throw err; // เป็นการโยนส่งต่อให้กับตัวโมเดล
  }
};

// export const getJSON = async function (url) {
//   try {
//     const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
//     // เพื่อป้องกันการโหลดตลอดเวลา เมื่อเน็ตช้า
//     const data = await res.json();
//     if (!res.ok) throw Error(`${data.message} ${res.status}`);
//     return data;
//   } catch (err) {
//     throw err; // เป็นการโยนส่งต่อให้กับตัวโมเดล
//   }
// };

// export const sendJSON = async function (url, uploadData) {
//   try {
//     const fetchPro = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadData),
//     });
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     // เพื่อป้องกันการโหลดตลอดเวลา เมื่อเน็ตช้า
//     const data = await res.json();
//     if (!res.ok) throw Error(`${data.message} ${res.status}`);
//     return data;
//   } catch (err) {
//     throw err; // เป็นการโยนส่งต่อให้กับตัวโมเดล
//   }
// };
